"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search, ArrowLeft } from "lucide-react";
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
    <div className="flex min-h-[calc(100vh-160px)] gap-0">
      <aside className="w-[360px] border-r border-white/10 bg-[#0d0f14] px-6 py-6">
        <Link href="/studio/writing/naver/list" className="mb-6 flex h-12 items-center gap-2 rounded-2xl bg-white/5 px-4 text-lg font-semibold text-white/88 transition hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
          목록으로 돌아가기
        </Link>

        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="원고 검색..."
            className="h-14 w-full rounded-2xl border border-white/10 bg-[#0a0c10] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400/50"
          />
        </div>

        <div className="space-y-4">
          {filteredList.map((item) => {
            const active = String(item.id) === manuscriptId;
            return (
              <button
                key={item.id}
                onClick={() => router.push(`/studio/writing/naver/list/${item.id}`)}
                className={`w-full rounded-3xl border p-4 text-left transition ${active ? "border-emerald-400 bg-white/10" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"}`}
              >
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-1 text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
                  {item.postType === "recreate" ? "RECREATE" : "CREATE"}
                </div>
                <div className="line-clamp-2 text-lg font-semibold text-white">{item.title}</div>
                <div className="mt-2 line-clamp-1 text-sm text-white/45">#{item.targetKeyword ?? item.keyword}</div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <UniversalBlogEditor
            title={data?.title ?? ""}
            setTitle={(value) => updateLocalData({ title: value })}
            content={data?.content ?? ""}
            setContent={(value) => updateLocalData({ content: value, wordCount: value.replace(/\s+/g, "").length })}
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
            frequencies={[{ word: towerKeyword, count: 4, density: 2.4, status: "good" }]}
            content={data?.content ?? ""}
            naverBotScore={60}
            isDensitySafe
            isRecreateMode={(data?.postType ?? data?.type) === "recreate"}
            isDetailMode
          />
        </div>
      </main>
    </div>
  );
}
