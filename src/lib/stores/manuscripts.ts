"use client";

import { createClient } from "@/utils/supabase/client";

export type ManuscriptStatus = "draft" | "saved" | "published";
export type ManuscriptType = "create" | "recreate";

export interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

export interface StudioManuscript {
  id: string;
  displayId?: number;
  title: string;
  content: string;
  keyword: string;
  type: ManuscriptType;
  detailLabel?: string;
  selectedTone?: string;
  status: ManuscriptStatus;
  wordCount?: number;
  updatedAt?: string;
  slug?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  seoTags?: string[];
  images: ImageBlock[];
  categoryId?: string;
  tocEnabled?: boolean;
}

interface StoreState {
  list: StudioManuscript[];
  hydrated: boolean;
  listLoading: boolean;
  listRefreshing: boolean;
}

interface CreateStoreConfig<RecordType> {
  cacheKey: string;
  fetchList: (userId: string) => Promise<RecordType[]>;
  fetchDetail: (param: string) => Promise<RecordType | null>;
  mapRecord: (record: RecordType) => StudioManuscript;
  getRouteKey: (manuscript: StudioManuscript) => string;
  getIdentityKey: (manuscript: StudioManuscript) => string;
}

const SESSION_TIMEOUT_MS = 4000;
const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

function normalizeUpdatedAt(input?: string) {
  if (!input) return "";
  return input.replace("T", " ").substring(0, 16);
}

export function normalizePostStatus(status?: string | null): ManuscriptStatus {
  if (status === "published") return "published";
  if (status === "saved" || status === "completed") return "saved";
  return "draft";
}

export function normalizePostType(postType?: string | null): ManuscriptType {
  return postType === "recreate" ? "recreate" : "create";
}

async function resolveUserId() {
  const supabase = createClient();

  for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
    const timeout = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), SESSION_TIMEOUT_MS);
    });

    const sessionUserIdPromise = supabase.auth
      .getSession()
      .then(({ data: { session } }: any) => session?.user?.id || null)
      .catch(() => null);

    const sessionUserId = await Promise.race([sessionUserIdPromise, timeout]);
    if (sessionUserId) return sessionUserId;

    const userPromise = supabase.auth
      .getUser()
      .then(({ data: { user } }: any) => user?.id || null)
      .catch(() => null);

    const userId = await Promise.race([userPromise, timeout]);
    if (userId) return userId;

    if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
    }
  }

  return null;
}

function createManuscriptStore<RecordType>(config: CreateStoreConfig<RecordType>) {
  const listeners = new Set<() => void>();

  let state: StoreState = {
    list: [],
    hydrated: false,
    listLoading: false,
    listRefreshing: false,
  };

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (nextState: Partial<StoreState>) => {
    state = { ...state, ...nextState };
    emit();
  };

  const getSnapshot = () => state;

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const persistList = (nextList: StudioManuscript[]) => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(config.cacheKey, JSON.stringify(nextList));
  };

  const hydrate = () => {
    if (state.hydrated) return;

    if (typeof window !== "undefined") {
      const rawCache = window.sessionStorage.getItem(config.cacheKey);
      if (rawCache) {
        try {
          const parsed = JSON.parse(rawCache) as StudioManuscript[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            state = {
              ...state,
              list: parsed,
              hydrated: true,
              listLoading: false,
            };
            emit();
            return;
          }
        } catch {
          window.sessionStorage.removeItem(config.cacheKey);
        }
      }
    }

    state = { ...state, hydrated: true };
    emit();
  };

  const replaceOrInsert = (incoming: StudioManuscript, currentList: StudioManuscript[]) => {
    const identityKey = config.getIdentityKey(incoming);
    const existingIndex = currentList.findIndex(
      (item) => config.getIdentityKey(item) === identityKey
    );

    if (existingIndex === -1) {
      return [incoming, ...currentList];
    }

    const nextList = [...currentList];
    nextList[existingIndex] = { ...nextList[existingIndex], ...incoming };
    return nextList;
  };

  const upsert = (incoming: StudioManuscript) => {
    const nextList = replaceOrInsert(incoming, state.list);
    persistList(nextList);
    setState({ list: nextList });
  };

  const replaceAll = (incomingList: StudioManuscript[]) => {
    persistList(incomingList);
    setState({
      list: incomingList,
      listLoading: false,
      listRefreshing: false,
    });
  };

  const removeByIdentity = (identityValue: string) => {
    const nextList = state.list.filter(
      (item) => config.getIdentityKey(item) !== identityValue
    );
    persistList(nextList);
    setState({ list: nextList });
  };

  const findByRouteKey = (routeKey: string) =>
    state.list.find((item) => config.getRouteKey(item) === routeKey);

  const ensureList = async (options?: {
    background?: boolean;
    preserveOnAuthMiss?: boolean;
  }) => {
    hydrate();

    const shouldKeepCurrentList = Boolean(options?.background && state.list.length > 0);
    setState({
      listLoading: !shouldKeepCurrentList,
      listRefreshing: shouldKeepCurrentList,
    });

    try {
      const userId = await resolveUserId();
      if (!userId) {
        setState({ listLoading: false, listRefreshing: false });
        return;
      }

      const records = await config.fetchList(userId);
      const mappedList = records.map(config.mapRecord);
      replaceAll(mappedList);
    } catch {
      setState({ listLoading: false, listRefreshing: false });
    }
  };

  const ensureDetail = async (routeKey: string) => {
    hydrate();

    const cached = findByRouteKey(routeKey);
    if (cached?.title && cached?.content) {
      return cached;
    }

    try {
      const record = await config.fetchDetail(routeKey);
      if (!record) return null;

      const mapped = config.mapRecord(record);
      upsert(mapped);
      return mapped;
    } catch {
      return null;
    }
  };

  const clear = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(config.cacheKey);
    }
    setState({ list: [], listLoading: false, listRefreshing: false });
  };

  return {
    subscribe,
    getSnapshot,
    hydrate,
    ensureList,
    ensureDetail,
    upsert,
    replaceAll,
    removeByIdentity,
    findByRouteKey,
    clear,
  };
}

interface WritingCreaiboxPostRecord {
  id: string | number;
  display_id?: number | null;
  created_at?: string | null;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  status?: string | null;
  target_keyword?: string | null;
  selected_tone?: string | null;
  slug?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  seo_tags?: string[] | null;
  category_id?: string | null;
  toc_enabled?: boolean | null;
}

export const creaiboxManuscriptStore = createManuscriptStore<WritingCreaiboxPostRecord>({
  cacheKey: "creaibox-manuscript-store-v1",
  fetchList: async () => {
    const { data, error } = await createClient()
      .from("writing_creaibox_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as WritingCreaiboxPostRecord[];
  },
  fetchDetail: async (routeKey) => {
    const displayId = Number(routeKey);
    const { data, error } = await createClient()
      .from("writing_creaibox_posts")
      .select("*")
      .eq("display_id", displayId)
      .single();

    if (error) throw error;
    return (data || null) as WritingCreaiboxPostRecord | null;
  },
  mapRecord: (record) => ({
    id: String(record.id),
    displayId: record.display_id || 0,
    title: record.title || "제목 없음",
    content: record.content || "",
    keyword: record.target_keyword || "일반 원고",
    type: normalizePostType(record.post_type),
    detailLabel: "AI 인사이트 포스팅",
    selectedTone: record.selected_tone || "전문적이고 통찰력 있는 분석",
    status: normalizePostStatus(record.status),
    wordCount: (record.content || "").length,
    updatedAt: normalizeUpdatedAt(record.created_at || undefined),
    slug: record.slug || "",
    metaDescription: record.meta_description || "",
    focusKeyword: record.focus_keyword || "",
    canonicalUrl: record.canonical_url || "",
    seoTags: record.seo_tags || [],
    images: [],
    categoryId: record.category_id || undefined,
    tocEnabled: record.toc_enabled ?? true,
  }),
  getRouteKey: (manuscript) => String(manuscript.displayId || ""),
  getIdentityKey: (manuscript) => manuscript.id,
});

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  source_mode?: string | null;
  status?: string | null;
  updated_at?: string | null;
  target_keyword?: string | null;
  selected_tone?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

export const naverManuscriptStore = createManuscriptStore<WritingNaverPostRecord>({
  cacheKey: "naver-manuscript-store-v1",
  fetchList: async (userId) => {
    const { data, error } = await createClient()
      .from("writing_naver_posts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data || []) as WritingNaverPostRecord[];
  },
  fetchDetail: async (routeKey) => {
    const { data, error } = await createClient()
      .from("writing_naver_posts")
      .select("*")
      .eq("id", routeKey)
      .single();

    if (error) throw error;
    return (data || null) as WritingNaverPostRecord | null;
  },
  mapRecord: (record) => {
    const fallbackKeyword =
      (record.categories && record.categories[0]) ||
      (record.tags && record.tags[0]) ||
      "일반 원고";

    return {
      id: String(record.id),
      title: record.title || "제목 없음",
      content: record.content || "",
      keyword: record.target_keyword || fallbackKeyword,
      type: normalizePostType(record.post_type),
      detailLabel:
        record.post_type === "recreate"
          ? record.source_mode === "url"
            ? "URL 재창조"
            : record.source_mode === "text"
            ? "텍스트 재창조"
            : "글 재창조"
          : "AI 스마트 글쓰기",
      selectedTone:
        record.selected_tone ||
        (record.tags && record.tags[0]) ||
        "친근하고 부드러운 말투",
      status: normalizePostStatus(record.status),
      wordCount: (record.content || "").length,
      updatedAt: normalizeUpdatedAt(record.updated_at || undefined),
      images: [],
    };
  },
  getRouteKey: (manuscript) => manuscript.id,
  getIdentityKey: (manuscript) => manuscript.id,
});
