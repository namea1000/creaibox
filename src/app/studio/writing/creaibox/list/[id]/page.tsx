"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, RotateCcw, Search, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import UniversalBlogEditor from "@/components/writing/editor/UniversalBlogEditor";
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";
import CreaiboxContentImagePanel from "@/components/writing/creaibox/tabs/CreaiboxContentImagePanel";
import CreaiboxSchemaPanel from "@/components/writing/creaibox/tabs/CreaiboxSchemaPanel";
import CreaiboxSeoOptimizationPanel from "@/components/writing/creaibox/tabs/CreaiboxSeoOptimizationPanel";
import CreaiboxThumbnailPanel from "@/components/writing/creaibox/tabs/CreaiboxThumbnailPanel";
import {
  creaiboxManuscriptKeys,
  type StudioManuscriptRecord,
  useCreaiboxManuscriptDetailQuery,
  useCreaiboxManuscriptsQuery,
} from "@/lib/queries/manuscripts";

const CREAIBOX_LIST_CACHE_KEY = "creaibox:manuscripts:list:v1";

type StudioManuscriptRecordWithOptionalFields = StudioManuscriptRecord & {
  useSearch?: boolean;
};

type PublishingPanelTab = "seo" | "thumbnail" | "contentImage" | "schema";

function buildPublicBlogSlug(title?: string, focusKeyword?: string, targetKeyword?: string) {
  const base = (focusKeyword || targetKeyword || title || "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");

  return base || `creaibox-post-${Date.now()}`;
}

function buildCanonicalUrl(slug: string) {
  return `https://creaibox.com/blog/${slug}`;
}

function toTagList(value?: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
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
    // 캐시 저장 실패는 화면 동작을 막지 않음
  }
}

function normalizeCreaiboxRecord(row: any): StudioManuscriptRecord {
  const content = row.content ?? "";

  return {
    id: row.id,
    displayId: row.display_id ?? row.displayId ?? row.id,
    title: row.title ?? "제목 없음",
    content,
    targetKeyword: row.target_keyword ?? row.targetKeyword ?? "",
    selectedTone: row.selected_tone ?? row.selectedTone ?? "",
    status: row.status ?? "draft",
    postType: row.post_type ?? row.postType ?? "create",
    sourceMode: row.source_mode ?? row.sourceMode ?? "",
    createdAt: row.created_at ?? row.createdAt ?? null,
    updatedAt: row.updated_at ?? row.updatedAt ?? null,
    slug: row.slug ?? "",
    metaDescription: row.meta_description ?? row.metaDescription ?? "",
    focusKeyword: row.focus_keyword ?? row.focusKeyword ?? "",
    canonicalUrl: row.canonical_url ?? row.canonicalUrl ?? "",
    seoTags: Array.isArray(row.seo_tags) ? row.seo_tags : [],
    wordCount: row.word_count ?? row.wordCount ?? content.replace(/\s+/g, "").length,
    wordCountGoal: row.word_count_goal ?? row.wordCountGoal ?? null,
  } as StudioManuscriptRecord;
}

export default function CreaiboxManuscriptDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const manuscriptId = Number(params?.id || 0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const saveFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: queryList = [], refetch: refetchList } = useCreaiboxManuscriptsQuery();

  const [cachedList, setCachedList] = useState<StudioManuscriptRecord[]>(() => readCachedList());
  const [searchTerm, setSearchTerm] = useState("");
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState("");
  const [publishingPanelTab, setPublishingPanelTab] = useState<PublishingPanelTab>("seo");

  const sidebarList = useMemo(() => {
    if (queryList.length > 0) return queryList;
    return cachedList;
  }, [cachedList, queryList]);

  const selectedFromList = useMemo(
    () => sidebarList.find((item) => Number(item.displayId) === manuscriptId || Number(item.id) === manuscriptId),
    [sidebarList, manuscriptId]
  );

  const cachedDetail = useMemo(() => {
    const cachedFromQuery = queryClient.getQueryData<StudioManuscriptRecord | null>(
      creaiboxManuscriptKeys.detail(manuscriptId)
    );

    if (cachedFromQuery) return cachedFromQuery;
    if (selectedFromList) return selectedFromList;

    return cachedList.find(
      (item) => Number(item.displayId) === manuscriptId || Number(item.id) === manuscriptId
    );
  }, [cachedList, manuscriptId, queryClient, selectedFromList]);

  const { data: detail, isLoading: isDetailLoading } = useCreaiboxManuscriptDetailQuery(
    manuscriptId,
    cachedDetail ?? selectedFromList
  );

  const [data, setData] = useState<StudioManuscriptRecord | null>(() => cachedDetail ?? null);

  useEffect(() => {
    const cached = readCachedList();
    if (cached.length > 0) {
      setCachedList(cached);
      queryClient.setQueryData(creaiboxManuscriptKeys.list, cached);
    }
  }, [queryClient]);

  useEffect(() => {
    if (queryList.length > 0) {
      setCachedList(queryList);
      writeCachedList(queryList);
    }
  }, [queryList]);

  useEffect(() => {
    if (!cachedDetail) return;

    if (!data || Number(data.displayId) !== manuscriptId) {
      setData(cachedDetail);
    }
  }, [cachedDetail, data, manuscriptId]);

  useEffect(() => {
    if (!detail) return;

    if (!hasLocalEdits || detail.id !== data?.id) {
      setData(detail);
      setHasLocalEdits(false);

      queryClient.setQueryData(creaiboxManuscriptKeys.detail(manuscriptId), detail);
    }
  }, [data?.id, detail, hasLocalEdits, manuscriptId, queryClient]);

  const fetchDirectDetail = useCallback(async () => {
    if (!manuscriptId || data || isDirectLoading) return;

    setIsDirectLoading(true);

    const { data: row, error } = await supabase
      .from("writing_creaibox_posts")
      .select("*")
      .eq("id", manuscriptId)
      .maybeSingle();

    setIsDirectLoading(false);

    if (error || !row) return;

    const normalized = normalizeCreaiboxRecord(row);

    setData(normalized);
    setHasLocalEdits(false);

    queryClient.setQueryData(creaiboxManuscriptKeys.detail(manuscriptId), normalized);

    const nextList = (() => {
      const exists = sidebarList.some((item) => item.id === normalized.id);
      if (exists) {
        return sidebarList.map((item) => (item.id === normalized.id ? normalized : item));
      }
      return [normalized, ...sidebarList];
    })();

    setCachedList(nextList);
    writeCachedList(nextList);
    queryClient.setQueryData(creaiboxManuscriptKeys.list, nextList);
  }, [data, isDirectLoading, manuscriptId, queryClient, sidebarList, supabase]);

  useEffect(() => {
    if (!data && !isDetailLoading) {
      void fetchDirectDetail();
    }
  }, [data, fetchDirectDetail, isDetailLoading]);

  useEffect(() => {
    void refetchList();
  }, [refetchList]);

  useEffect(() => {
    return () => {
      if (saveFeedbackTimeoutRef.current) {
        clearTimeout(saveFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const filteredManuscripts = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) return sidebarList;

    return sidebarList.filter((item) => {
      const title = item.title ?? "";
      const targetKeyword = item.targetKeyword ?? "";

      return title.toLowerCase().includes(lower) || targetKeyword.toLowerCase().includes(lower);
    });
  }, [sidebarList, searchTerm]);

  const updateLocalData = useCallback((patch: Partial<StudioManuscriptRecord>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasLocalEdits(true);
  }, []);

  const showPublishFeedback = useCallback((message: string) => {
    if (saveFeedbackTimeoutRef.current) {
      clearTimeout(saveFeedbackTimeoutRef.current);
    }

    setPublishFeedback(message);
    saveFeedbackTimeoutRef.current = setTimeout(() => {
      setPublishFeedback("");
      saveFeedbackTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleOpenManuscript = useCallback(
    (manuscript: StudioManuscriptRecord) => {
      setData(manuscript);
      setHasLocalEdits(false);

      const displayId = Number(manuscript.displayId ?? manuscript.id);
      queryClient.setQueryData(creaiboxManuscriptKeys.detail(displayId), manuscript);

      router.push(`/studio/writing/creaibox/list/${displayId}`);
    },
    [queryClient, router]
  );

  const persistCaches = useCallback(
    (nextRecord: StudioManuscriptRecord) => {
      const displayId = Number(nextRecord.displayId ?? nextRecord.id);

      queryClient.setQueryData<StudioManuscriptRecord | null>(
        creaiboxManuscriptKeys.detail(displayId),
        nextRecord
      );

      queryClient.setQueryData<StudioManuscriptRecord[]>(
        creaiboxManuscriptKeys.list,
        (prev = []) => {
          const exists = prev.some((item) => item.id === nextRecord.id);
          const nextList = exists
            ? prev.map((item) => (item.id === nextRecord.id ? nextRecord : item))
            : [nextRecord, ...prev];

          writeCachedList(nextList);
          setCachedList(nextList);

          return nextList;
        }
      );
    },
    [queryClient]
  );

  const handleSave = useCallback(
    async (status?: StudioManuscriptRecord["status"]) => {
      if (!data) return false;

      setIsSaving(true);

      const safeData = data as StudioManuscriptRecordWithOptionalFields;

      const slug = buildPublicBlogSlug(
        safeData.title,
        safeData.focusKeyword,
        safeData.targetKeyword
      );

      const canonicalUrl = buildCanonicalUrl(slug);
      const now = new Date().toISOString();
      const nextStatus = (status ?? safeData.status ?? "draft") as StudioManuscriptRecord["status"];

      const updatePayload = {
        title: safeData.title ?? "",
        content: safeData.content ?? "",
        target_keyword: safeData.targetKeyword ?? "",
        selected_tone: safeData.selectedTone ?? "",
        status: nextStatus,
        slug,
        meta_description: safeData.metaDescription ?? "",
        focus_keyword: safeData.focusKeyword ?? "",
        canonical_url: canonicalUrl,
        seo_tags: toTagList(safeData.seoTags),
        word_count_goal: safeData.wordCountGoal ?? null,
        use_search: safeData.useSearch ?? false,
      };

      const { error } = await supabase
        .from("writing_creaibox_posts")
        .update(updatePayload)
        .eq("id", safeData.id);

      setIsSaving(false);

      if (error) {
        window.alert(`저장 실패: ${error.message}`);
        return false;
      }

      const nextRecord: StudioManuscriptRecord = {
        ...safeData,
        slug,
        canonicalUrl,
        status: nextStatus,
        updatedAt: now,
        displayId: safeData.displayId,
        wordCount: (safeData.content ?? "").replace(/\s+/g, "").length,
      };

      setData(nextRecord);
      setHasLocalEdits(false);
      persistCaches(nextRecord);

      return true;
    },
    [data, persistCaches, supabase]
  );

  const publishingStatus = useMemo(() => {
    if (!data) return "대기 중";

    if (data.status === "published") return "발행 완료";
    if (data.status === "trash") return "휴지통";
    return "저장 완료";
  }, [data]);

  const publishingStatusClass = useMemo(() => {
    if (data?.status === "published") return "bg-emerald-500/10 text-emerald-300";
    if (data?.status === "trash") return "bg-rose-500/10 text-rose-300";
    return "bg-sky-500/10 text-sky-300";
  }, [data?.status]);

  const handlePublish = useCallback(async () => {
    if (data?.status === "published") {
      showPublishFeedback("이미 발행이 완료된 글입니다.");
      return;
    }

    const published = await handleSave("published");

    if (published) {
      showPublishFeedback("블로그 발행이 완료되었습니다.");
    }
  }, [data?.status, handleSave, showPublishFeedback]);

  const handleCancelPublish = useCallback(async () => {
    const canceled = await handleSave("saved");

    if (canceled) {
      showPublishFeedback("발행이 취소되었습니다.");
    }
  }, [handleSave, showPublishFeedback]);

  if (!data && (isDetailLoading || isDirectLoading)) {
    return (
      <div className="min-h-screen bg-[#0a0d12] text-white">
        <div className="mx-auto grid max-w-[1880px] grid-cols-[360px_minmax(0,1.2fr)_420px] gap-0 px-0">
          <aside className="min-h-screen border-r border-white/10 bg-[#0b0f15] p-4" />
          <div className="relative min-h-screen bg-white">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              원고 데이터를 불러오는 중입니다...
            </div>
          </div>
          <aside className="min-h-screen border-l border-white/10 bg-[#0b0f15] p-6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0d12] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-xl font-bold">원고를 찾지 못했습니다.</p>
          <button
            onClick={() => router.push("/studio/writing/creaibox/list")}
            className="mt-5 rounded-2xl bg-white px-5 py-3 font-bold text-black"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0d12] text-white">
      <div className="grid h-full w-full grid-cols-[360px_minmax(0,1fr)_420px]">

        {/* 왼쪽 글 목록 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-r border-violet-500/20 bg-[#0b0f15] p-4 text-[13px]">
          <button
            onClick={() => router.push("/studio/writing/creaibox/list")}
            className="mb-5 flex w-full items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-left text-[13px] font-bold text-white/80 transition hover:border-violet-400/40 hover:bg-violet-500/10"
          >
            <ArrowLeft className="h-4 w-4 text-violet-300" />
            목록으로 돌아가기
          </button>

          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300/60" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="원고 검색..."
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/30 py-3 pl-11 pr-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-2">
            {filteredManuscripts.map((manuscript) => {
              const active = manuscript.id === data.id;

              return (
                <button
                  key={manuscript.id}
                  onClick={() => handleOpenManuscript(manuscript)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${active
                    ? "border-violet-500/60 bg-violet-950/15"
                    : "border-zinc-800/80 bg-zinc-950/30 hover:border-violet-500/35 hover:bg-zinc-900/40"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`line-clamp-2 text-[13px] font-black leading-tight ${active ? "text-violet-300" : "text-zinc-100"}`}>
                      {manuscript.title}
                    </div>
                    {active && <Check className="mt-0.5 h-3 w-3 shrink-0 text-violet-300" />}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-flex rounded-md border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[13px] font-black uppercase tracking-[0.16em] text-violet-300">
                      {manuscript.postType === "recreate" ? "RECREATE" : "CREATE"}
                    </span>
                    <span className="line-clamp-1 text-[13px] font-medium text-zinc-500">
                      #{manuscript.targetKeyword || "키워드 없음"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 가운데 에디터 - 유동 영역 */}
        <main className="h-full min-w-0 overflow-hidden bg-white">
          <UniversalBlogEditor
            title={data.title ?? ""}
            setTitle={(value) => updateLocalData({ title: value })}
            content={data.content ?? ""}
            setContent={(value) =>
              updateLocalData({
                content: value,
                wordCount: value.replace(/\s+/g, "").length,
              })
            }
            charCount={(data.content ?? "").length}
            images={[]}
            fileInputRef={fileInputRef}
            isSaving={isSaving}
            isEnhancing={false}
            handleImageUploadClick={() => { }}
            handleImageChange={() => { }}
            handleUpdateCaption={() => { }}
            handleDeleteImage={() => { }}
            handleEnhanceContent={() => { }}
            handleSavePostToSupabase={() => handleSave("saved")}
            isDetailMode
            targetKeyword={data.targetKeyword ?? ""}
            manuscriptId={data.id}
          />
        </main>

        {/* 오른쪽 발행 정보 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-l border-white/10 bg-[#0b0f15]">
          <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#141926] to-[#10141f] px-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handlePublish()}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] px-3.5 py-2 text-xs font-black text-white shadow-[0_8px_18px_rgba(124,58,237,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                {isSaving ? "처리 중..." : "블로그 발행"}
              </button>
              <button
                onClick={() => void handleCancelPublish()}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 transition hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                발행 취소
              </button>
            </div>
            <span
              className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${publishingStatusClass}`}
            >
              {publishingStatus}
            </span>
            {publishFeedback && (
              <div className="absolute left-0 top-full z-20 mt-3 rounded-2xl border border-violet-400/30 bg-[#18121f] px-4 py-3 text-sm font-bold text-violet-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                {publishFeedback}
              </div>
            )}
          </div>

          <section className="border-b border-zinc-800 text-white">
            <div className="grid h-14 grid-cols-4 border-b border-white/10 bg-transparent">
              {[
                { key: "seo", label: "SEO 최적화" },
                { key: "thumbnail", label: "썸네일" },
                { key: "contentImage", label: "본문 이미지" },
                { key: "schema", label: "스키마" },
              ].map((tab) => {
                const active = publishingPanelTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setPublishingPanelTab(tab.key as PublishingPanelTab)}
                    className={`relative border-r border-white/10 text-sm font-black transition last:border-r-0 ${active
                      ? "bg-blue-500/8 text-blue-200"
                      : "text-white/45 hover:bg-white/[0.025] hover:text-blue-100"
                      }`}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {publishingPanelTab === "seo" && (
              <CreaiboxSeoOptimizationPanel
                data={data}
                updateLocalData={updateLocalData}
              />
            )}
            {publishingPanelTab === "thumbnail" && <CreaiboxThumbnailPanel />}
            {publishingPanelTab === "contentImage" && <CreaiboxContentImagePanel />}
            {publishingPanelTab === "schema" && <CreaiboxSchemaPanel />}
          </section>

          {publishingPanelTab === "seo" && (
            <div>
              <CreaiboxAnalysisTower
                seoScore={0}
                seoChecks={{
                  titleKeyword: false,
                  contentDensity: false,
                  duplicateSafe: true,
                  lengthCheck: false,
                  structureCheck: false,
                  subHeadingCheck: false,
                }}
                posRatio={{
                  noun: 0,
                  verb: 0,
                  other: 0,
                }}
                frequencies={[]}
                content={data.content ?? ""}
                title={data.title ?? ""}
                focusKeyword={data.focusKeyword ?? data.targetKeyword ?? ""}
                metaDescription={data.metaDescription ?? ""}
                slug={data.slug ?? ""}
                canonicalUrl={data.canonicalUrl ?? ""}
                seoTags={data.seoTags ?? []}
                crawlabilityScore={0}
                isDensitySafe={true}
                isDetailMode
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
