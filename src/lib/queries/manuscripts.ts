"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const AUTH_RETRY_ATTEMPTS = 4;
const AUTH_RETRY_DELAY_MS = 350;

const CREAIBOX_LIST_CACHE_KEY = "creaibox:manuscripts:list:v1";
const CREAIBOX_DETAIL_CACHE_PREFIX = "creaibox:manuscripts:detail:v1:";

const NAVER_LIST_CACHE_KEY = "naver:manuscripts:list:v1";
const NAVER_DETAIL_CACHE_PREFIX = "naver:manuscripts:detail:v1:";

const QUERY_STALE_TIME = 1000 * 60 * 10;
const QUERY_GC_TIME = 1000 * 60 * 30;

export type ManuscriptStatus = "draft" | "saved" | "published" | "trash";
export type ManuscriptType = "create" | "recreate";

export interface StudioImageBlock {
  id: string;
  url: string;
  caption: string;
}

export interface StudioManuscriptRecord {
  id: string;
  displayId?: number;
  title: string;
  content: string;
  keyword: string;
  targetKeyword: string;
  type: ManuscriptType;
  postType?: ManuscriptType;
  detailLabel: string;
  selectedTone: string;
  status: ManuscriptStatus;
  wordCount: number;
  wordCountGoal?: string | number;
  updatedAt: string;
  createdAt?: string;
  slug?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  seoTags?: string[];
  sourceMode?: string;
  sourceUrl?: string;
  sourceText?: string;
  rewriteStrategy?: string;
  images: StudioImageBlock[];
}

interface WritingCreaiboxPostRecord {
  id: string | number;
  display_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  word_count_goal?: string | number | null;
  source_mode?: string | null;
}

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  source_mode?: string | null;
  source_url?: string | null;
  source_text?: string | null;
  rewrite_strategy?: string | null;
  word_count_goal?: string | number | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  target_keyword?: string | null;
  selected_tone?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

export const creaiboxManuscriptKeys = {
  all: ["creaibox-manuscripts"] as const,
  list: ["creaibox-manuscripts", "list"] as const,
  detail: (displayId: string | number) =>
    ["creaibox-manuscripts", "detail", String(displayId)] as const,
};

export const naverManuscriptKeys = {
  all: ["naver-manuscripts"] as const,
  list: ["naver-manuscripts", "list"] as const,
  detail: (id: string | number) =>
    ["naver-manuscripts", "detail", String(id)] as const,
};

function safeReadList(cacheKey: string): StudioManuscriptRecord[] | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(cacheKey);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StudioManuscriptRecord[]) : undefined;
  } catch {
    return undefined;
  }
}

function safeWriteList(cacheKey: string, records: StudioManuscriptRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(records));
  } catch {
    // 캐시 저장 실패는 앱 동작을 막지 않음
  }
}

function safeReadDetail(
  cachePrefix: string,
  id: string | number
): StudioManuscriptRecord | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(`${cachePrefix}${String(id)}`);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);
    return parsed as StudioManuscriptRecord;
  } catch {
    return undefined;
  }
}

function safeWriteDetail(
  cachePrefix: string,
  id: string | number,
  record: StudioManuscriptRecord
) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(`${cachePrefix}${String(id)}`, JSON.stringify(record));
  } catch {
    // 캐시 저장 실패는 앱 동작을 막지 않음
  }
}

export function normalizePostStatus(status?: string | null): ManuscriptStatus {
  if (status === "published") return "published";
  if (status === "saved" || status === "completed") return "saved";
  if (status === "trash") return "trash";
  return "draft";
}

export function normalizePostType(postType?: string | null): ManuscriptType {
  return postType === "recreate" ? "recreate" : "create";
}

async function waitForAuthenticatedUser() {
  const supabase = createClient();

  for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return { supabase, userId: session.user.id };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return { supabase, userId: user.id };
    }

    if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
    }
  }

  return { supabase, userId: null as string | null };
}

function getWordCount(content?: string | null) {
  return (content ?? "").replace(/\s+/g, "").length;
}

function mapCreaiboxRecord(record: WritingCreaiboxPostRecord): StudioManuscriptRecord {
  const postType = normalizePostType(record.post_type);
  const content = record.content ?? "";
  const targetKeyword = record.target_keyword || "일반 원고";
  const displayId =
    typeof record.display_id === "number" && record.display_id > 0
      ? record.display_id
      : Number(record.id);

  return {
    id: String(record.id),
    displayId: Number.isNaN(displayId) ? undefined : displayId,
    title: record.title || "제목 없음",
    content,
    keyword: targetKeyword,
    targetKeyword,
    type: postType,
    postType,
    detailLabel: record.post_type || "AI 인사이트 포스팅",
    selectedTone: record.selected_tone || "전문적이고 통찰력 있는 분석",
    status: normalizePostStatus(record.status),
    wordCount: getWordCount(content),
    wordCountGoal: record.word_count_goal ?? undefined,
    updatedAt: record.updated_at || record.created_at || "",
    createdAt: record.created_at || undefined,
    slug: record.slug || "",
    metaDescription: record.meta_description || "",
    focusKeyword: record.focus_keyword || "",
    canonicalUrl: record.canonical_url || "",
    seoTags: Array.isArray(record.seo_tags) ? record.seo_tags : [],
    sourceMode: record.source_mode || undefined,
    images: [],
  };
}

function mapNaverRecord(record: WritingNaverPostRecord): StudioManuscriptRecord {
  const fallbackKeyword =
    (record.categories && record.categories[0]) ||
    (record.tags && record.tags[0]) ||
    "일반 원고";

  const targetKeyword = record.target_keyword || fallbackKeyword;
  const postType = normalizePostType(record.post_type);
  const content = record.content ?? "";

  return {
    id: String(record.id),
    title: record.title || "제목 없음",
    content,
    keyword: targetKeyword,
    targetKeyword,
    type: postType,
    postType,
    detailLabel:
      record.post_type === "recreate"
        ? record.source_mode === "url"
          ? "URL 재창조"
          : record.source_mode === "text"
            ? "텍스트 재창조"
            : "글 재창조"
        : "AI 스마트 글쓰기",
    selectedTone:
      record.selected_tone || (record.tags && record.tags[0]) || "친근하고 부드러운 말투",
    status: normalizePostStatus(record.status),
    wordCount: getWordCount(content),
    wordCountGoal: record.word_count_goal ?? undefined,
    updatedAt: record.updated_at || record.created_at || "",
    createdAt: record.created_at || undefined,
    sourceMode: record.source_mode || undefined,
    sourceUrl: record.source_url || undefined,
    sourceText: record.source_text || undefined,
    rewriteStrategy: record.rewrite_strategy || undefined,
    images: [],
  };
}

async function fetchCreaiboxManuscripts(): Promise<StudioManuscriptRecord[]> {
  let { supabase, userId } = await waitForAuthenticatedUser();

  if (!userId) {
    const cached = safeReadList(CREAIBOX_LIST_CACHE_KEY);
    if (cached) return cached;

    await new Promise((resolve) => setTimeout(resolve, 500));
    ({ supabase, userId } = await waitForAuthenticatedUser());

    if (!userId) return [];
  }

  const { data, error } = await supabase
    .from("writing_creaibox_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const records = ((data ?? []) as WritingCreaiboxPostRecord[]).map(mapCreaiboxRecord);

  safeWriteList(CREAIBOX_LIST_CACHE_KEY, records);

  records.forEach((record) => {
    const detailKey = record.displayId ?? record.id;
    safeWriteDetail(CREAIBOX_DETAIL_CACHE_PREFIX, detailKey, record);
    safeWriteDetail(CREAIBOX_DETAIL_CACHE_PREFIX, record.id, record);
  });

  return records;
}

async function fetchCreaiboxManuscriptDetail(
  displayId: string | number
): Promise<StudioManuscriptRecord | null> {
  let { supabase, userId } = await waitForAuthenticatedUser();

  const cached =
    safeReadDetail(CREAIBOX_DETAIL_CACHE_PREFIX, displayId) ??
    safeReadList(CREAIBOX_LIST_CACHE_KEY)?.find(
      (item) => String(item.displayId) === String(displayId) || String(item.id) === String(displayId)
    );

  if (!userId) {
    if (cached) return cached;

    await new Promise((resolve) => setTimeout(resolve, 500));
    ({ supabase, userId } = await waitForAuthenticatedUser());

    if (!userId) return null;
  }

  const numericDisplayId = Number(displayId);

  let row: WritingCreaiboxPostRecord | null = null;

  if (!Number.isNaN(numericDisplayId)) {
    const byDisplayId = await supabase
      .from("writing_creaibox_posts")
      .select("*")
      .eq("display_id", numericDisplayId)
      .maybeSingle();

    if (byDisplayId.error && byDisplayId.error.code !== "PGRST116") {
      throw byDisplayId.error;
    }

    row = (byDisplayId.data ?? null) as WritingCreaiboxPostRecord | null;
  }

  if (!row) {
    const byId = await supabase
      .from("writing_creaibox_posts")
      .select("*")
      .eq("id", displayId)
      .maybeSingle();

    if (byId.error && byId.error.code !== "PGRST116") {
      throw byId.error;
    }

    row = (byId.data ?? null) as WritingCreaiboxPostRecord | null;
  }

  const record = row ? mapCreaiboxRecord(row) : cached ?? null;

  if (record) {
    const detailKey = record.displayId ?? displayId;
    safeWriteDetail(CREAIBOX_DETAIL_CACHE_PREFIX, detailKey, record);
    safeWriteDetail(CREAIBOX_DETAIL_CACHE_PREFIX, record.id, record);
  }

  return record;
}

async function fetchNaverManuscripts(): Promise<StudioManuscriptRecord[]> {
  let { supabase, userId } = await waitForAuthenticatedUser();

  if (!userId) {
    const cached = safeReadList(NAVER_LIST_CACHE_KEY);
    if (cached) return cached;

    await new Promise((resolve) => setTimeout(resolve, 500));
    ({ supabase, userId } = await waitForAuthenticatedUser());

    if (!userId) return [];
  }

  const { data, error } = await supabase
    .from("writing_naver_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const records = ((data ?? []) as WritingNaverPostRecord[]).map(mapNaverRecord);

  safeWriteList(NAVER_LIST_CACHE_KEY, records);
  records.forEach((record) => safeWriteDetail(NAVER_DETAIL_CACHE_PREFIX, record.id, record));

  return records;
}

async function fetchNaverManuscriptDetail(
  id: string | number
): Promise<StudioManuscriptRecord | null> {
  let { supabase, userId } = await waitForAuthenticatedUser();

  const cached =
    safeReadDetail(NAVER_DETAIL_CACHE_PREFIX, id) ??
    safeReadList(NAVER_LIST_CACHE_KEY)?.find((item) => String(item.id) === String(id));

  if (!userId) {
    if (cached) return cached;

    await new Promise((resolve) => setTimeout(resolve, 500));
    ({ supabase, userId } = await waitForAuthenticatedUser());

    if (!userId) return null;
  }

  const { data, error } = await supabase
    .from("writing_naver_posts")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;

  const record = data ? mapNaverRecord(data as WritingNaverPostRecord) : cached ?? null;

  if (record) {
    safeWriteDetail(NAVER_DETAIL_CACHE_PREFIX, id, record);
  }

  return record;
}

export function useCreaiboxManuscriptsQuery() {
  return useQuery<StudioManuscriptRecord[]>({
    queryKey: creaiboxManuscriptKeys.list,
    queryFn: fetchCreaiboxManuscripts,
    initialData: () => safeReadList(CREAIBOX_LIST_CACHE_KEY) ?? [],
    placeholderData: (previousData) =>
      previousData ?? safeReadList(CREAIBOX_LIST_CACHE_KEY) ?? [],
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreaiboxManuscriptDetailQuery(
  displayId: string | number,
  placeholder?: StudioManuscriptRecord | null
) {
  return useQuery<StudioManuscriptRecord | null>({
    queryKey: creaiboxManuscriptKeys.detail(displayId),
    queryFn: () => fetchCreaiboxManuscriptDetail(displayId),
    enabled: Boolean(displayId),
    initialData: () =>
      placeholder ??
      safeReadDetail(CREAIBOX_DETAIL_CACHE_PREFIX, displayId) ??
      safeReadList(CREAIBOX_LIST_CACHE_KEY)?.find(
        (item) =>
          String(item.displayId) === String(displayId) || String(item.id) === String(displayId)
      ) ??
      null,
    placeholderData: (previousData) =>
      previousData ??
      placeholder ??
      safeReadDetail(CREAIBOX_DETAIL_CACHE_PREFIX, displayId) ??
      null,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useNaverManuscriptsQuery() {
  return useQuery<StudioManuscriptRecord[]>({
    queryKey: naverManuscriptKeys.list,
    queryFn: fetchNaverManuscripts,
    initialData: () => safeReadList(NAVER_LIST_CACHE_KEY) ?? [],
    placeholderData: (previousData) => previousData ?? safeReadList(NAVER_LIST_CACHE_KEY) ?? [],
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useNaverManuscriptDetailQuery(
  id: string | number,
  placeholder?: StudioManuscriptRecord | null
) {
  return useQuery<StudioManuscriptRecord | null>({
    queryKey: naverManuscriptKeys.detail(id),
    queryFn: () => fetchNaverManuscriptDetail(id),
    enabled: Boolean(id),
    initialData: () =>
      placeholder ??
      safeReadDetail(NAVER_DETAIL_CACHE_PREFIX, id) ??
      safeReadList(NAVER_LIST_CACHE_KEY)?.find((item) => String(item.id) === String(id)) ??
      null,
    placeholderData: (previousData) =>
      previousData ?? placeholder ?? safeReadDetail(NAVER_DETAIL_CACHE_PREFIX, id) ?? null,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
