"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const manuscriptId = String(params?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: list = [] } = useNaverManuscriptsQuery();
  const selectedFromList = useMemo(() => list.find((item) => String(item.id) === manuscriptId) ?? null, [list, manuscriptId]);
  const { data: detail, isLoading: isDetailLoading } = useNaverManuscriptDetailQuery(manuscriptId, selectedFromList ?? undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredList = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.keyword.toLowerCase().includes(q) ||
      (item.targetKeyword ?? "").toLowerCase().includes(q)
    );
  }, [list, searchTerm]);

  const data = detail ?? selectedFromList;

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
    if (!data) return;
    const nextRecord = { ...data, ...patch };
    persistCaches(nextRecord);
  }, [data, persistCaches]);

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

      const { error } = await supabase.from("writing_naver_posts").update(payload).eq("id", Number(data.id));
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  const noopEnhance = useCallback(async () => { }, []);
  const noopImageUploadClick = useCallback(() => fileInputRef.current?.click(), []);
  const noopImageChange = useCallback(() => { }, []);
  const noopUpdateCaption = useCallback(() => { }, []);
  const noopDeleteImage = useCallback(() => { }, []);

  const charCount = useMemo(() => (data?.content ?? "").replace(/\s+/g, "").length, [data?.content]);

  const towerKeyword = data?.targetKeyword ?? data?.keyword ?? "키워드";

  return (
    <div className="h-full w-full overflow-hidden bg-[#0a0d12] text-white">
      <div className="grid h-full w-full grid-cols-[360px_minmax(0,1fr)_380px]">

        {/* 왼쪽 글 목록 */}
        <aside className="h-full overflow-y-auto custom-scrollbar border-r border-emerald-500/20 bg-[#0b0f15] p-4 text-[13px]">
          <button
            onClick={() => router.push("/studio/writing/naver/list")}
            className="mb-5 flex w-full items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-left text-[13px] font-bold text-white/80 transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-300" />
            목록으로 돌아가기
          </button>

          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/60" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="원고 검색..."
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/30 py-3 pl-11 pr-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-2">
            {filteredList.map((item) => {
              const active = String(item.id) === manuscriptId;

              return (
                <button
                  key={item.id}
                  onClick={() => router.push(`/studio/writing/naver/list/${item.id}`)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${active
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
                </button>
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
            handleEnhanceContent={noopEnhance as any}
            handleSavePostToSupabase={handleSave}
            isDetailMode
            isRecreateMode={(data?.postType ?? data?.type) === "recreate"}
            targetKeyword={data?.targetKeyword ?? data?.keyword}
            isLoading={isDetailLoading && !data}
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
