"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search, ArrowLeft, Check } from "lucide-react";
import UniversalBlogEditor from "@/components/writing/editor/UniversalBlogEditor";
import NaverAnalysisTower from "@/components/writing/naver/NaverAnalysisTower";
import { createClient } from "@/utils/supabase/client";
import {
  useNaverManuscriptsQuery,
  useNaverManuscriptDetailQuery,
  naverManuscriptKeys,
  type StudioManuscriptRecord,
} from "@/lib/queries/manuscripts";

const supabase = createClient();

export default function NaverManuscriptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const manuscriptId = String(params?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const manuscriptListRef = useRef<HTMLDivElement | null>(null);

  const { data: list = [] } = useNaverManuscriptsQuery();
  const selectedFromList = useMemo(() => list.find((item) => String(item.id) === manuscriptId) ?? null, [list, manuscriptId]);
  const { data: detail, isLoading: isDetailLoading } = useNaverManuscriptDetailQuery(manuscriptId, selectedFromList ?? undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<StudioManuscriptRecord | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const nextData = detail ?? selectedFromList ?? null;
    if (!nextData) return;

    queueMicrotask(() => {
      setData((current) => {
        if (current?.id === nextData.id) return current;
        return nextData;
      });
    });
  }, [detail, isMounted, selectedFromList]);

  const filteredList = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.keyword.toLowerCase().includes(q) ||
      (item.targetKeyword ?? "").toLowerCase().includes(q)
    );
  }, [list, searchTerm]);

  const persistCaches = useCallback((nextRecord: StudioManuscriptRecord) => {
    queryClient.setQueryData(naverManuscriptKeys.list, (prev: StudioManuscriptRecord[] | undefined) => {
      if (!prev) return [nextRecord];
      const exists = prev.some((item) => String(item.id) === String(nextRecord.id));
      if (!exists) return [nextRecord, ...prev];
      return prev.map((item) => (String(item.id) === String(nextRecord.id) ? nextRecord : item));
    });

    queryClient.setQueryData(naverManuscriptKeys.detail(String(nextRecord.id)), nextRecord);
  }, [queryClient]);

  const updateLocalData = useCallback((patch: Partial<StudioManuscriptRecord>) => {
    setData((current) => {
      if (!current) return current;

      const nextRecord = { ...current, ...patch };
      persistCaches(nextRecord);
      return nextRecord;
    });
  }, [persistCaches]);

  const handleSave = useCallback(async () => {
    if (!data) return false;
    setIsSaving(true);
    try {
      const payload = {
        title: data.title,
        content: data.content,
        target_keyword: data.targetKeyword ?? data.keyword,
        selected_tone: data.selectedTone,
        post_type: data.postType ?? data.type,
        source_mode: data.sourceMode ?? null,
        source_url: data.sourceUrl ?? null,
        source_text: data.sourceText ?? null,
        rewrite_strategy: data.rewriteStrategy ?? null,
        word_count_goal: data.wordCountGoal ?? null,
      };

      const { error } = await supabase.from("writing_naver_posts").update(payload).eq("id", data.id);
      if (error) throw error;
      persistCaches({
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [data, persistCaches]);

  const noopEnhance = useCallback(() => { }, []);
  const noopImageUploadClick = useCallback(() => fileInputRef.current?.click(), []);
  const noopImageChange = useCallback(() => { }, []);
  const noopUpdateCaption = useCallback(() => { }, []);
  const noopDeleteImage = useCallback(() => { }, []);

  const charCount = useMemo(() => (data?.content ?? "").replace(/\s+/g, "").length, [data?.content]);

  const towerKeyword = data?.targetKeyword ?? data?.keyword ?? "키워드";

  const navigateByOffset = useCallback(
    (offset: number) => {
      if (!isMounted || filteredList.length === 0) return;

      const currentIndex = Math.max(
        0,
        filteredList.findIndex((item) => String(item.id) === manuscriptId)
      );
      const nextIndex = Math.min(Math.max(currentIndex + offset, 0), filteredList.length - 1);
      const nextItem = filteredList[nextIndex];

      if (nextItem && String(nextItem.id) !== manuscriptId) {
        router.replace(`/studio/writing/naver/list/${nextItem.id}`);
      }
    },
    [filteredList, isMounted, manuscriptId, router]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        return;
      }

      event.preventDefault();
      navigateByOffset(event.key === "ArrowDown" ? 1 : -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateByOffset]);

  useEffect(() => {
    if (!manuscriptId) return;

    const activeLink = manuscriptListRef.current?.querySelector<HTMLElement>(
      `[data-manuscript-id="${CSS.escape(manuscriptId)}"]`
    );

    activeLink?.scrollIntoView({ block: "nearest" });
  }, [manuscriptId]);

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0d12] text-white">
      <div className="grid h-full w-full grid-cols-[360px_minmax(0,1fr)_380px]">

        {/* 왼쪽 글 목록 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-r border-emerald-500/20 bg-[#0b0f15] p-4 text-[13px]">
          <Link
            replace
            href="/studio/writing/naver/list"
            className="mb-5 flex w-full items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-left text-[13px] font-bold text-white/80 transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-300" />
            목록으로 돌아가기
          </Link>

          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/60" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="원고 검색..."
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/30 py-3 pl-11 pr-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-emerald-500/50"
            />
          </div>

          <div ref={manuscriptListRef} className="space-y-2">
            {(isMounted ? filteredList : []).map((item) => {
              const active = String(item.id) === manuscriptId;

              return (
                <Link
                  key={item.id}
                  replace
                  data-manuscript-id={item.id}
                  href={`/studio/writing/naver/list/${item.id}`}
                  className={`block w-full rounded-xl border p-3.5 text-left transition ${active
                      ? "border-emerald-500/60 bg-emerald-950/15"
                      : "border-zinc-800/80 bg-zinc-950/30 hover:border-emerald-500/35 hover:bg-zinc-900/40"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`line-clamp-2 text-[13px] font-black leading-tight ${active ? "text-emerald-300" : "text-zinc-100"}`}>
                      {item.title}
                    </div>
                    {active && <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300" />}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-flex rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[13px] font-black uppercase tracking-[0.16em] text-emerald-300">
                      {item.postType === "recreate" ? "RECREATE" : "CREATE"}
                    </span>
                    <span className="line-clamp-1 text-[13px] font-medium text-zinc-500">
                      #{item.targetKeyword ?? item.keyword ?? "키워드 없음"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* 가운데 에디터 */}
        <main className="h-full min-w-0 overflow-hidden bg-white">
          <UniversalBlogEditor
            title={data?.title ?? ""}
            setTitle={(value) => updateLocalData({ title: value })}
            content={data?.content ?? ""}
            setContent={(value) =>
              updateLocalData({
                content: value,
                wordCount: value.replace(/\s+/g, "").length,
              })
            }
            charCount={charCount}
            images={data?.images ?? []}
            fileInputRef={fileInputRef}
            isSaving={isSaving}
            isEnhancing={false}
            handleImageUploadClick={noopImageUploadClick}
            handleImageChange={noopImageChange}
            handleUpdateCaption={noopUpdateCaption}
            handleDeleteImage={noopDeleteImage}
            handleEnhanceContent={noopEnhance}
            handleSavePostToSupabase={handleSave}
            isDetailMode
            isRecreateMode={(data?.postType ?? data?.type) === "recreate"}
            targetKeyword={data?.targetKeyword ?? data?.keyword}
            isLoading={isDetailLoading && !data}
            manuscriptId={manuscriptId}
            contentImageSourceType="writing_naver_posts"
          />
        </main>

        {/* 오른쪽 관제탑 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-l border-white/10 bg-[#0d0f14] p-4">
          <NaverAnalysisTower
            seoScore={100}
            seoChecks={{
              titleKeyword: true,
              contentDensity: true,
              duplicateSafe: true,
              structureCheck: true,
              subHeadingCheck: true,
            }}
            posRatio={{ noun: 50, verb: 30, other: 20 }}
            frequencies={[
              {
                word: towerKeyword,
                count: 4,
                density: 2.4,
                status: "good",
              },
            ]}
            content={data?.content ?? ""}
            naverBotScore={60}
            isDensitySafe
            isRecreateMode={(data?.postType ?? data?.type) === "recreate"}
            isDetailMode
          />
        </aside>
      </div>
    </div>
  );
}
