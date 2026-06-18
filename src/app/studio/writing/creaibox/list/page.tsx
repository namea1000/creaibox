"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  AlertCircle,
  Trash2,
  Globe,
  Edit3,
  RotateCcw,
  PenLine,
  Tags,
  MessageSquareText,
  ListChecks,
  Save,
  Send,
  FilePlus2,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  useCreaiboxManuscriptsQuery,
  creaiboxManuscriptKeys,
  type StudioManuscriptRecord,
} from "@/lib/queries/manuscripts";
import { useManuscriptUiStore } from "@/lib/stores/manuscript-ui";

const PAGE_SIZE = 15;
const CREAIBOX_LIST_CACHE_KEY = "creaibox:manuscripts:list:v1";
type CreaiboxRow = Record<string, unknown>;
type TableFilters = {
  writingType: string;
  contentType: string;
  tone: string;
};

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function getWordCount(value?: number | null, content?: string | null) {
  const safeValue = Number(value ?? 0);
  if (safeValue > 0) return safeValue;

  return (content ?? "").replace(/\s+/g, "").length;
}

function getRouteId(record: StudioManuscriptRecord, index: number) {
  const displayId = Number(record.displayId);
  if (Number.isFinite(displayId) && displayId > 0) return displayId;

  return record.id || String(index + 1);
}

function safeText(value?: string | null) {
  return value ?? "";
}

function getToneLabel(value?: string | null) {
  const tone = safeText(value).trim();
  if (!tone) return "말투 설정 없음";

  return tone.split("(")[0].trim() || tone;
}

function getStatusLabel(status?: StudioManuscriptRecord["status"] | null) {
  if (status === "published") return "발행 완료";
  if (status === "saved") return "저장 완료";
  if (status === "trash") return "휴지통";
  return "임시 저장";
}

function getWritingTypeLabel(manuscript: StudioManuscriptRecord) {
  return manuscript.postType === "recreate" ? "글 재창조" : "스마트 글쓰기";
}

function getContentTypeLabel(manuscript: StudioManuscriptRecord) {
  if (manuscript.sourceMode === "url") return "URL 재창조";
  if (manuscript.sourceMode === "text") return "텍스트 재창조";
  if (manuscript.postType === "recreate") return "AI 재창조";
  return "AI 인사이트 포스팅";
}

function getPreviewUrl(manuscript: StudioManuscriptRecord) {
  if (manuscript.canonicalUrl) return manuscript.canonicalUrl;

  const slugOrId = manuscript.slug || manuscript.id;
  return `/blog/${slugOrId}`;
}

function readCachedList(): StudioManuscriptRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(CREAIBOX_LIST_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedList(records: StudioManuscriptRecord[]) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CREAIBOX_LIST_CACHE_KEY, JSON.stringify(records));
  } catch {
    // sessionStorage 저장 실패는 화면 동작을 막지 않음
  }
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumberValue(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function normalizeCreaiboxRecord(row: CreaiboxRow, index: number): StudioManuscriptRecord {
  const id = String(row.id ?? index + 1);
  const rawDisplayId = row.display_id ?? row.displayId;
  const displayId =
    typeof rawDisplayId === "number" && Number.isFinite(rawDisplayId) && rawDisplayId > 0
      ? rawDisplayId
      : undefined;
  const content = toStringValue(row.content);

  return {
    id,
    displayId,
    title: toStringValue(row.title, "제목 없음"),
    content,
    targetKeyword: toStringValue(row.target_keyword ?? row.targetKeyword),
    selectedTone: toStringValue(row.selected_tone ?? row.selectedTone),
    status:
      row.status === "saved" || row.status === "published" || row.status === "trash"
        ? row.status
        : "draft",
    postType: row.post_type === "recreate" || row.postType === "recreate" ? "recreate" : "create",
    sourceMode: toStringValue(row.source_mode ?? row.sourceMode),
    createdAt: toStringValue(row.created_at ?? row.createdAt),
    updatedAt: toStringValue(row.updated_at ?? row.updatedAt),
    slug: toStringValue(row.slug),
    metaDescription: toStringValue(row.meta_description ?? row.metaDescription),
    focusKeyword: toStringValue(row.focus_keyword ?? row.focusKeyword),
    canonicalUrl: toStringValue(row.canonical_url ?? row.canonicalUrl),
    seoTags: Array.isArray(row.seo_tags) ? row.seo_tags.filter((tag): tag is string => typeof tag === "string") : [],
    wordCount: toNumberValue(row.word_count ?? row.wordCount, getWordCount(null, content)),
    wordCountGoal:
      typeof (row.word_count_goal ?? row.wordCountGoal) === "string" ||
      typeof (row.word_count_goal ?? row.wordCountGoal) === "number"
        ? (row.word_count_goal ?? row.wordCountGoal)
        : undefined,
  } as StudioManuscriptRecord;
}

export default function CreaiboxManuscriptListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const currentPage = useManuscriptUiStore((state) => state.creaiboxCurrentPage);
  const setCurrentPage = useManuscriptUiStore((state) => state.setCreaiboxCurrentPage);
  const statusTab = useManuscriptUiStore((state) => state.creaiboxStatusTab);
  const setStatusTab = useManuscriptUiStore((state) => state.setCreaiboxStatusTab);
  const searchTerm = useManuscriptUiStore((state) => state.creaiboxSearchTerm);
  const setSearchTerm = useManuscriptUiStore((state) => state.setCreaiboxSearchTerm);

  const [cachedManuscripts, setCachedManuscripts] = useState<
    StudioManuscriptRecord[]
  >([]);
  const [fallbackManuscripts, setFallbackManuscripts] = useState<StudioManuscriptRecord[]>([]);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreatingDirect, setIsCreatingDirect] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [tableFilters, setTableFilters] = useState<TableFilters>({
    writingType: "all",
    contentType: "all",
    tone: "all",
  });

  const {
    data: queryManuscripts = [],
    isLoading,
    isFetching,
    refetch,
  } = useCreaiboxManuscriptsQuery();

  const visibleQueryManuscripts = useMemo(
    () => (isMounted ? queryManuscripts : []),
    [isMounted, queryManuscripts]
  );
  const visibleIsLoading = isMounted && isLoading;
  const visibleIsFetching = isMounted && isFetching;

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);

      const cachedList = readCachedList();
      if (cachedList.length > 0) {
        setCachedManuscripts(cachedList);
        queryClient.setQueryData(creaiboxManuscriptKeys.list, cachedList);
      }
    });
  }, [queryClient]);

  useEffect(() => {
    if (!isMounted) return;

    if (cachedManuscripts.length > 0) {
      queryClient.setQueryData(creaiboxManuscriptKeys.list, cachedManuscripts);
    }
  }, [cachedManuscripts, isMounted, queryClient]);

  useEffect(() => {
    if (!isMounted) return;

    if (visibleQueryManuscripts.length > 0) {
      queueMicrotask(() => {
        setFallbackError(null);
        setCachedManuscripts(visibleQueryManuscripts);
        writeCachedList(visibleQueryManuscripts);
      });
    }
  }, [isMounted, visibleQueryManuscripts]);

  const fetchDirectlyFromSupabase = useCallback(async () => {
    setIsFallbackLoading(true);
    setFallbackError(null);

    const { data, error } = await supabase
      .from("writing_creaibox_posts")
      .select("*")
      .order("updated_at", { ascending: false });

    setIsFallbackLoading(false);

    if (error) {
      setFallbackError(error.message);
      return;
    }

    const normalized = (data ?? []).map((row: any, index: number) => normalizeCreaiboxRecord(row, index));

    setFallbackManuscripts(normalized);
    setCachedManuscripts(normalized);
    writeCachedList(normalized);
    queryClient.setQueryData(creaiboxManuscriptKeys.list, normalized);
  }, [queryClient, supabase]);

  useEffect(() => {
    if (!isMounted) return;

    const hasQueryData = visibleQueryManuscripts.length > 0;
    const hasCache = cachedManuscripts.length > 0;

    if (!visibleIsLoading && !visibleIsFetching && !hasQueryData && !hasCache) {
      queueMicrotask(() => {
        void fetchDirectlyFromSupabase();
      });
    }
  }, [
    cachedManuscripts.length,
    fetchDirectlyFromSupabase,
    isMounted,
    visibleIsFetching,
    visibleIsLoading,
    visibleQueryManuscripts.length,
  ]);

  useEffect(() => {
    if (!isMounted) return;

    void refetch();

    const handleFocus = () => {
      void refetch();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refetch();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMounted, refetch]);

  const manuscripts = useMemo(() => {
    if (visibleQueryManuscripts.length > 0) return visibleQueryManuscripts;
    if (fallbackManuscripts.length > 0) return fallbackManuscripts;
    return cachedManuscripts;
  }, [cachedManuscripts, fallbackManuscripts, visibleQueryManuscripts]);

  const isTrashView = statusTab === "trash";

  const filterOptions = useMemo(() => {
    const writingTypes = new Set<string>();
    const contentTypes = new Set<string>();
    const tones = new Set<string>();

    manuscripts.forEach((manuscript) => {
      writingTypes.add(getWritingTypeLabel(manuscript));
      contentTypes.add(getContentTypeLabel(manuscript));
      tones.add(getToneLabel(manuscript.selectedTone));
    });

    return {
      writingTypes: Array.from(writingTypes),
      contentTypes: Array.from(contentTypes),
      tones: Array.from(tones),
    };
  }, [manuscripts]);

  const filteredManuscripts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    return manuscripts.filter((manuscript) => {
      const isTrash = manuscript.status === "trash";
      const matchesStatus =
        statusTab === "all" ? !isTrash : manuscript.status === statusTab;
      const matchesWritingType =
        tableFilters.writingType === "all" ||
        getWritingTypeLabel(manuscript) === tableFilters.writingType;
      const matchesContentType =
        tableFilters.contentType === "all" ||
        getContentTypeLabel(manuscript) === tableFilters.contentType;
      const matchesTone =
        tableFilters.tone === "all" || getToneLabel(manuscript.selectedTone) === tableFilters.tone;

      const title = safeText(manuscript.title).toLowerCase();
      const targetKeyword = safeText(manuscript.targetKeyword).toLowerCase();
      const selectedTone = safeText(manuscript.selectedTone).toLowerCase();

      const matchesSearch =
        !lowerSearch ||
        title.includes(lowerSearch) ||
        targetKeyword.includes(lowerSearch) ||
        selectedTone.includes(lowerSearch);

      return (
        matchesStatus &&
        matchesWritingType &&
        matchesContentType &&
        matchesTone &&
        matchesSearch
      );
    });
  }, [manuscripts, searchTerm, statusTab, tableFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredManuscripts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedManuscripts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredManuscripts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredManuscripts, safeCurrentPage]);

  const shouldShowSkeletonRows =
    manuscripts.length === 0 && (visibleIsLoading || visibleIsFetching || isFallbackLoading);

  const paddedRows = useMemo(() => {
    const rows: Array<StudioManuscriptRecord | null> = [...paginatedManuscripts];

    if (shouldShowSkeletonRows) {
      while (rows.length < PAGE_SIZE) rows.push(null);
    }

    return rows;
  }, [paginatedManuscripts, shouldShowSkeletonRows]);

  const tabCounts = useMemo(
    () => ({
      all: manuscripts.filter((item) => item.status !== "trash").length,
      draft: manuscripts.filter((item) => item.status === "draft").length,
      saved: manuscripts.filter((item) => item.status === "saved").length,
      published: manuscripts.filter((item) => item.status === "published").length,
      trash: manuscripts.filter((item) => item.status === "trash").length,
    }),
    [manuscripts]
  );

  const trashPageIds = useMemo(
    () =>
      paginatedManuscripts
        .filter((item) => item.status === "trash")
        .map((item) => item.id),
    [paginatedManuscripts]
  );
  const allTrashRowsSelected =
    isTrashView && trashPageIds.length > 0 && trashPageIds.every((id) => selectedTrashIds.includes(id));
  const tableColumnCount = isTrashView ? 10 : 9;

  useEffect(() => {
    if (!isTrashView && selectedTrashIds.length > 0) {
      queueMicrotask(() => {
        setSelectedTrashIds([]);
      });
    }
  }, [isTrashView, selectedTrashIds.length]);

  const handleTableFilterChange = useCallback(
    (key: keyof TableFilters, value: string) => {
      setTableFilters((current) => ({
        ...current,
        [key]: value,
      }));
      setCurrentPage(1);
    },
    [setCurrentPage]
  );

  const handleOpenManuscript = useCallback(
    (manuscript: StudioManuscriptRecord, index: number) => {
      const routeId = getRouteId(manuscript, index);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(routeId), manuscript);
      router.push(`/studio/writing/creaibox/list/${routeId}`);
    },
    [queryClient, router]
  );

  const handleMoveToTrash = useCallback(
    async (manuscript: StudioManuscriptRecord) => {
      if (!window.confirm("휴지통으로 이동합니다. 계속할까요?")) return;

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update({ status: "trash" })
        .eq("id", manuscript.id);

      if (error) {
        window.alert(`휴지통 이동 실패: ${error.message}`);
        return;
      }

      const nextList: StudioManuscriptRecord[] = manuscripts.map((item) =>
        item.id === manuscript.id
          ? {
            ...item,
            status: "trash",
            updatedAt: new Date().toISOString(),
          }
          : item
      );

      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      writeCachedList(nextList);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
    },
    [manuscripts, queryClient, supabase]
  );

  const handleToggleTrashRow = useCallback((id: string) => {
    setSelectedTrashIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const handleToggleAllTrashRows = useCallback(() => {
    setSelectedTrashIds((current) => {
      if (trashPageIds.length === 0) return current;

      const allSelected = trashPageIds.every((id) => current.includes(id));
      if (allSelected) return current.filter((id) => !trashPageIds.includes(id));

      return Array.from(new Set([...current, ...trashPageIds]));
    });
  }, [trashPageIds]);

  const handleRestoreTrash = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) {
        window.alert("복원할 원고를 선택해주세요.");
        return;
      }

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update({ status: "saved" })
        .in("id", ids);

      if (error) {
        window.alert(`복원 실패: ${error.message}`);
        return;
      }

      const now = new Date().toISOString();
      const nextList: StudioManuscriptRecord[] = manuscripts.map((item) =>
        ids.includes(item.id)
          ? {
            ...item,
            status: "saved",
            updatedAt: now,
          }
          : item
      );

      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      setSelectedTrashIds((current) => current.filter((id) => !ids.includes(id)));
      writeCachedList(nextList);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
    },
    [manuscripts, queryClient, supabase]
  );

  const handlePermanentDelete = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) {
        window.alert("삭제할 원고가 없습니다.");
        return;
      }

      if (!window.confirm("휴지통에서 영구 삭제합니다. 계속할까요?")) return;

      const { error } = await supabase.from("writing_creaibox_posts").delete().in("id", ids);

      if (error) {
        window.alert(`영구 삭제 실패: ${error.message}`);
        return;
      }

      const nextList = manuscripts.filter((item) => !ids.includes(item.id));

      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      setSelectedTrashIds((current) => current.filter((id) => !ids.includes(id)));
      writeCachedList(nextList);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
    },
    [manuscripts, queryClient, supabase]
  );

  const handleEmptyTrash = useCallback(() => {
    const trashIds = manuscripts.filter((item) => item.status === "trash").map((item) => item.id);
    void handlePermanentDelete(trashIds);
  }, [handlePermanentDelete, manuscripts]);

  const handlePreview = useCallback((manuscript: StudioManuscriptRecord) => {
    window.open(getPreviewUrl(manuscript), "_blank", "noopener,noreferrer");
  }, []);

  const handleDuplicate = useCallback(
    async (manuscript: StudioManuscriptRecord) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      const payload = {
        user_id: user.id,
        user_nicename: user.email?.split("@")[0] ?? null,
        title: `${manuscript.title || "제목 없음"} - 복사본`,
        content: manuscript.content,
        status: manuscript.status,
        post_type: manuscript.detailLabel || manuscript.postType || manuscript.type || "create",
        target_keyword: manuscript.targetKeyword || manuscript.keyword || null,
        selected_tone: manuscript.selectedTone || null,
        slug: null,
        meta_description: manuscript.metaDescription || null,
        focus_keyword: manuscript.focusKeyword || null,
        canonical_url: null,
        seo_tags: manuscript.seoTags ?? [],
        word_count_goal: manuscript.wordCountGoal ?? null,
        source_mode: manuscript.sourceMode ?? null,
      };

      const { data, error } = await supabase
        .from("writing_creaibox_posts")
        .insert([payload])
        .select("*")
        .single();

      if (error) {
        window.alert(`복제 실패: ${error.message}`);
        return;
      }

      const duplicated = normalizeCreaiboxRecord(data as CreaiboxRow, 0);
      const nextList = [duplicated, ...manuscripts];

      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      writeCachedList(nextList);
      setStatusTab("all");
      setCurrentPage(1);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
      queryClient.setQueryData(
        creaiboxManuscriptKeys.detail(duplicated.displayId ?? duplicated.id),
        duplicated
      );
    },
    [manuscripts, queryClient, setCurrentPage, setStatusTab, supabase]
  );

  const handleCreateDirect = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.alert("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    setIsCreatingDirect(true);

    try {
      const payload = {
        user_id: user.id,
        user_nicename: user.email?.split("@")[0] ?? null,
        title: "직접 작성한 새 글",
        content: "",
        status: "draft",
        post_type: "create",
        target_keyword: "",
        selected_tone: "전문적이고 통찰력 있는 분석",
        slug: null,
        meta_description: "",
        focus_keyword: "",
        canonical_url: null,
        seo_tags: [],
        word_count_goal: null,
        source_mode: "direct",
      };

      const { data, error } = await supabase
        .from("writing_creaibox_posts")
        .insert([payload])
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const newPost = normalizeCreaiboxRecord(data as CreaiboxRow, 0);
      const routeId = getRouteId(newPost, 0);

      const nextList = [newPost, ...manuscripts];
      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      writeCachedList(nextList);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
      queryClient.setQueryData(
        creaiboxManuscriptKeys.detail(routeId),
        newPost
      );

      router.push(`/studio/writing/creaibox/list/${routeId}`);
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreatingDirect(false);
    }
  };

  const handlePublish = useCallback(
    async (manuscript: StudioManuscriptRecord) => {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update({
          status: "published",
          canonical_url:
            manuscript.canonicalUrl || `https://creaibox.com/blog/${manuscript.slug || manuscript.id}`,
        })
        .eq("id", manuscript.id);

      if (error) {
        window.alert(`발행 실패: ${error.message}`);
        return;
      }

      const nextList: StudioManuscriptRecord[] = manuscripts.map((item) =>
        item.id === manuscript.id
          ? {
            ...item,
            status: "published" as StudioManuscriptRecord["status"],
            updatedAt: now,
          }
          : item
      );

      setCachedManuscripts(nextList);
      setFallbackManuscripts(nextList);
      writeCachedList(nextList);

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        nextList
      );
    },
    [manuscripts, queryClient, supabase]
  );

  const pageTitle = "Creaibox 발행 원고 관리";
  const paginationControls = (
    <div className="flex items-center gap-1 text-[14px] text-slate-600">
      <span className="mr-2 text-slate-500">
        {filteredManuscripts.length.toLocaleString()}개 항목
      </span>

      <button
        onClick={() => setCurrentPage(1)}
        disabled={safeCurrentPage === 1}
        className="h-8 min-w-8 border border-slate-300 bg-white px-2 text-slate-700 disabled:text-slate-300"
      >
        «
      </button>

      <button
        onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
        disabled={safeCurrentPage === 1}
        className="h-8 min-w-8 border border-slate-300 bg-white px-2 text-slate-700 disabled:text-slate-300"
      >
        ‹
      </button>

      <span className="mx-1 flex items-center gap-1">
        <span className="inline-flex h-8 min-w-10 items-center justify-center border border-slate-300 bg-white px-2 font-semibold text-slate-900">
          {safeCurrentPage}
        </span>
        <span>/ {totalPages}</span>
      </span>

      <button
        onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
        disabled={safeCurrentPage === totalPages}
        className="h-8 min-w-8 border border-slate-300 bg-white px-2 text-slate-700 disabled:text-slate-300"
      >
        ›
      </button>

      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={safeCurrentPage === totalPages}
        className="h-8 min-w-8 border border-slate-300 bg-white px-2 text-slate-700 disabled:text-slate-300"
      >
        »
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f0f1] px-6 py-6 text-[14px] text-slate-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
          <p className="mt-2 text-[14px] leading-6 text-slate-600">
            AI로 제작된 원고를 관리합니다. 각 원고를 클릭하면 실시간 수정/발행이 가능한 전용
            스튜디오로 이동합니다.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="원고 제목 또는 검색 키워드 입력..."
              className="h-10 w-full border border-slate-300 bg-white pl-10 pr-3 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {createError && (
        <div className="mb-4 flex items-center justify-between border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>새 글 생성 실패: {createError}</span>
          </div>
          <button
            type="button"
            onClick={() => setCreateError(null)}
            className="text-red-800 hover:text-red-950 font-bold ml-4"
            aria-label="에러 메시지 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
        {[
          { key: "all", label: "전체 원고", count: tabCounts.all, Icon: ListChecks },
          { key: "saved", label: "저장 완료", count: tabCounts.saved, Icon: Save },
          { key: "published", label: "발행 완료", count: tabCounts.published, Icon: Send },
          { key: "trash", label: "휴지통", count: tabCounts.trash, Icon: Trash2 },
        ].map(({ key, label, count, Icon }) => {
          const active = statusTab === key;

          return (
            <button
              key={key}
              onClick={() => {
                setStatusTab(key as "all" | "draft" | "saved" | "published" | "trash");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-2 border px-3 py-1.5 transition ${active ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                }`}
            >
              <Icon className="h-4 w-4" />
              {label} <span className="ml-1 text-[13px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[14px]">
        <label className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-700">
          <PenLine className="h-4 w-4 text-[#135e96]" />
          <span className="font-semibold">작성 방식</span>
          <select
            value={tableFilters.writingType}
            onChange={(event) => handleTableFilterChange("writingType", event.target.value)}
            className="bg-white text-slate-900 outline-none"
          >
            <option value="all">전체 선택</option>
            {filterOptions.writingTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-700">
          <Tags className="h-4 w-4 text-[#135e96]" />
          <span className="font-semibold">타입</span>
          <select
            value={tableFilters.contentType}
            onChange={(event) => handleTableFilterChange("contentType", event.target.value)}
            className="bg-white text-slate-900 outline-none"
          >
            <option value="all">전체 선택</option>
            {filterOptions.contentTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-700">
          <MessageSquareText className="h-4 w-4 text-[#135e96]" />
          <span className="font-semibold">말투</span>
          <select
            value={tableFilters.tone}
            onChange={(event) => handleTableFilterChange("tone", event.target.value)}
            className="bg-white text-slate-900 outline-none"
          >
            <option value="all">전체 선택</option>
            {filterOptions.tones.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/studio/writing/creaibox/create")}
            className="inline-flex items-center gap-2 border border-blue-600 bg-white px-3 py-1.5 text-[14px] font-semibold text-[#135e96] hover:bg-blue-50"
          >
            <FilePlus2 className="h-4 w-4" />
            AI로 새글 쓰기
          </button>

          <button
            type="button"
            disabled={isCreatingDirect}
            onClick={handleCreateDirect}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 text-[14px] font-semibold text-slate-700 hover:border-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <FilePlus2 className="h-4 w-4" />
            {isCreatingDirect ? "생성 중..." : "수기 직접 새글 쓰기"}
          </button>

          {isTrashView && (
            <>
              <button
                type="button"
                onClick={() => void handleRestoreTrash(selectedTrashIds)}
                disabled={selectedTrashIds.length === 0}
                className="border border-slate-300 bg-white px-3 py-1.5 text-[14px] font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:text-slate-300"
              >
                복원
              </button>
              <button
                type="button"
                onClick={handleEmptyTrash}
                disabled={tabCounts.trash === 0}
                className="border border-red-300 bg-white px-3 py-1.5 text-[14px] font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 disabled:text-slate-300"
              >
                휴지통 비우기
              </button>
            </>
          )}
        </div>

        {paginationControls}
      </div>

      <div className="overflow-hidden border border-slate-300 bg-white">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-slate-300 bg-white text-left text-[14px] font-semibold text-slate-700">
              <th className="w-16 px-3 py-3 text-center">번호</th>
              {isTrashView && (
                <th className="w-10 px-2 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allTrashRowsSelected}
                    onChange={handleToggleAllTrashRows}
                    className="h-4 w-4"
                    aria-label="현재 페이지 휴지통 원고 전체 선택"
                  />
                </th>
              )}
              <th className="min-w-[320px] px-3 py-3">포스팅 제목</th>
              <th className="w-28 px-3 py-3 text-center">원고 상태</th>
              <th className="w-44 px-3 py-3 text-center">작성 방식</th>
              <th className="w-44 px-3 py-3 text-center">타입</th>
              <th className="w-72 px-3 py-3 text-center">말투</th>
              <th className="w-28 px-3 py-3 text-center">글자 수</th>
              <th className="w-40 px-3 py-3 text-center">업데이트 일시</th>
              <th className="w-32 px-3 py-3 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
          {paddedRows.length === 0 && (
            <tr>
              <td colSpan={tableColumnCount} className="h-40 px-3 py-8 text-center text-slate-500">
                표시할 원고가 없습니다.
              </td>
            </tr>
          )}

          {paddedRows.map((manuscript, index) => {
            if (!manuscript) {
              return (
                <tr
                  key={`empty-${index}`}
                  className="border-b border-slate-200"
                >
                  {Array.from({ length: tableColumnCount }).map((_, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-4">
                      <div className="h-4 w-full max-w-32 animate-pulse bg-slate-100" />
                    </td>
                  ))}
                </tr>
              );
            }

            const absoluteIndex = (safeCurrentPage - 1) * PAGE_SIZE + index;
            const rowNumber = filteredManuscripts.length - absoluteIndex;
            const wordCount = getWordCount(manuscript.wordCount, manuscript.content);
            const updatedText = formatDisplayDate(manuscript.updatedAt || manuscript.createdAt);
            const typeLabel = getWritingTypeLabel(manuscript);
            const statusLabel = getStatusLabel(manuscript.status);
            const modeLabel = getContentTypeLabel(manuscript);
            const toneLabel = getToneLabel(manuscript.selectedTone);

            const routeId = getRouteId(manuscript, index);
            const isSelected = pathname === `/studio/writing/creaibox/list/${routeId}`;

            return (
              <tr
                key={manuscript.id}
                className={`group cursor-pointer border-b border-slate-200 align-top transition ${isSelected ? "bg-blue-50" : "odd:bg-white even:bg-[#f6f7f7] hover:bg-blue-50"
                  }`}
                onClick={() => handleOpenManuscript(manuscript, index)}
              >
                <td className="px-3 py-4 text-center text-[14px] text-slate-700">
                  {rowNumber}
                </td>

                {isTrashView && (
                  <td
                    className="px-2 py-4 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTrashIds.includes(manuscript.id)}
                      onChange={() => handleToggleTrashRow(manuscript.id)}
                      className="h-4 w-4"
                      aria-label={`${manuscript.title} 선택`}
                    />
                  </td>
                )}

                <td className="px-3 py-4">
                  <button
                    type="button"
                    className="text-left text-[14px] font-semibold leading-6 text-[#135e96] hover:text-[#0a4b78] hover:underline"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenManuscript(manuscript, index);
                    }}
                  >
                    {manuscript.title}
                  </button>
                  <div
                    className="mt-1 flex items-center gap-1 text-[13px] opacity-0 transition group-hover:opacity-100"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {isTrashView ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleRestoreTrash([manuscript.id])}
                          className="text-[#135e96] hover:text-[#0a4b78] hover:underline"
                        >
                          복원
                        </button>
                        <span className="text-slate-400">|</span>
                        <button
                          type="button"
                          onClick={() => void handlePermanentDelete([manuscript.id])}
                          className="text-red-600 hover:text-red-700 hover:underline"
                        >
                          영구 삭제
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenManuscript(manuscript, index)}
                          className="text-[#135e96] hover:text-[#0a4b78] hover:underline"
                        >
                          편집
                        </button>
                        <span className="text-slate-400">|</span>
                        <button
                          type="button"
                          onClick={() => handlePreview(manuscript)}
                          className="text-[#135e96] hover:text-[#0a4b78] hover:underline"
                        >
                          미리보기
                        </button>
                        <span className="text-slate-400">|</span>
                        <button
                          type="button"
                          onClick={() => void handleDuplicate(manuscript)}
                          className="text-[#135e96] hover:text-[#0a4b78] hover:underline"
                        >
                          복제
                        </button>
                        <span className="text-slate-400">|</span>
                        <button
                          type="button"
                          onClick={() => void handleMoveToTrash(manuscript)}
                          className="text-red-600 hover:text-red-700 hover:underline"
                        >
                          휴지통
                        </button>
                      </>
                    )}
                  </div>
                </td>

                <td className="px-3 py-4 text-center text-[14px] text-slate-700">
                  <span className="inline-flex border border-slate-300 bg-white px-2 py-1 text-[13px] text-slate-700">
                    {statusLabel}
                  </span>
                </td>

                <td className="px-3 py-4 text-center text-[14px] text-slate-700">
                  <span className="inline-flex border border-slate-300 bg-white px-2 py-1 text-[13px] text-slate-700">
                    {typeLabel}
                  </span>
                </td>

                <td className="px-3 py-4 text-center text-[14px] text-slate-700">
                  {modeLabel}
                </td>

                <td className="px-3 py-4 text-center text-[14px] leading-6 text-slate-700">
                  {toneLabel}
                </td>

                <td className="px-3 py-4 text-center text-[14px] text-slate-700">
                  {Number(wordCount).toLocaleString()} 자
                </td>

                <td className="px-3 py-4 text-center text-[14px] leading-6 text-slate-600">{updatedText}</td>

                <td
                  className="px-3 py-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex justify-center gap-2">
                    {isTrashView ? (
                      <>
                        <button
                          onClick={() => void handleRestoreTrash([manuscript.id])}
                          className="border border-slate-300 bg-white p-2 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                          title="복원"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => void handlePermanentDelete([manuscript.id])}
                          className="border border-slate-300 bg-white p-2 text-slate-600 hover:border-red-500 hover:text-red-600"
                          title="영구 삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenManuscript(manuscript, index)}
                          className="border border-slate-300 bg-white p-2 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                          title="수정"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => void handlePublish(manuscript)}
                          className="border border-slate-300 bg-white p-2 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                          title="발행"
                        >
                          <Globe className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => void handleMoveToTrash(manuscript)}
                          className="border border-slate-300 bg-white p-2 text-slate-600 hover:border-red-500 hover:text-red-600"
                          title="휴지통"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-[14px] text-slate-600">
        <div className="text-slate-500">
          검색 결과: 총{" "}
          <span className="font-semibold text-slate-900">{filteredManuscripts.length}개</span> 중{" "}
          {filteredManuscripts.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(safeCurrentPage * PAGE_SIZE, filteredManuscripts.length)} 표시
        </div>

        {paginationControls}
      </div>

      {(visibleIsLoading || isFallbackLoading) && manuscripts.length === 0 && (
        <div className="mt-6 flex items-center gap-3 border border-amber-300 bg-amber-50 px-5 py-4 text-[14px] text-amber-800">
          <AlertCircle className="h-5 w-5" />
          원고 목록을 불러오는 중입니다.
        </div>
      )}

      {fallbackError && manuscripts.length === 0 && (
        <div className="mt-6 flex items-center gap-3 border border-red-300 bg-red-50 px-5 py-4 text-[14px] text-red-700">
          <AlertCircle className="h-5 w-5" />
          원고 목록을 불러오지 못했습니다: {fallbackError}
        </div>
      )}
    </div>
  );
}
