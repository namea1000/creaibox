"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const manuscriptId = String(params?.id ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const manuscriptListRef = useRef<HTMLDivElement | null>(null);

  const { data: list = [] } = useNaverManuscriptsQuery();
  const selectedFromList = useMemo(() => list.find((item) => String(item.id) === manuscriptId) ?? null, [list, manuscriptId]);
  const { data: detail, isLoading: isDetailLoading } = useNaverManuscriptDetailQuery(manuscriptId, selectedFromList ?? undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);
  const [isEnhancingToc, setIsEnhancingToc] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isChangingPostType, setIsChangingPostType] = useState(false);
  const [isApplyingSearch, setIsApplyingSearch] = useState(false);
  const [data, setData] = useState<StudioManuscriptRecord | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.");
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    };
    void checkAuth();
  }, [isMounted, pathname, router]);

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
    setHasLocalEdits(true);
  }, [persistCaches]);

  const handleSave = useCallback(async () => {
    if (!data) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return false;
    }

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

      const { error } = await supabase.from("writing_naver_posts").update(payload).eq("id", data.id).eq("user_id", user.id);
      if (error) throw error;
      persistCaches({
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setHasLocalEdits(false);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [data, persistCaches, pathname, router]);

  const handleEnhanceContent = useCallback(
    async (option: string) => {
      if (!data) return;

      if (option.startsWith("expand_")) {
        if (option.includes("toc_")) {
          setIsEnhancingToc(true);
        } else {
          setIsEnhancingContent(true);
        }
      } else if (option === "correct" || option === "polish") {
        setIsPolishing(true);
      } else if (option.startsWith("change_post_type:")) {
        setIsChangingPostType(true);
      } else if (option === "apply_google_search") {
        setIsApplyingSearch(true);
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();

        let promptInstruction = "";
        if (option.startsWith("expand_")) {
          if (option.includes("toc_")) {
            const count = option.replace("expand_toc_", "");
            promptInstruction = `현재 본문에 있는 기존 목차(H2 등)들과 긴밀하게 연관되고 이어지는 새로운 목차(H2 또는 H3 태그)를 정확히 ${count}개 생성하여 추가해 주세요. 또한, 새로 추가된 각 목차 하위에는 상세하고 깊이 있는 설명 문단(글 내용)도 함께 작성해서 본문의 마지막 또는 문맥상 적합한 위치에 자연스럽게 덧붙여 전체 원고의 분량을 확장해 주세요. 기존에 존재하던 목차나 본문 내용은 절대로 삭제, 수정, 축소하지 마십시오.`;
          } else {
            const percent = option.replace("expand_", "");
            promptInstruction = `기존의 흐름, 맥락, 구조(HTML 태그)를 최대한 유지하면서 문장을 더 구체화하고 관련 유용한 정보를 덧붙여서 원고의 전체적인 분량이 대략 ${percent}% 정도 더 풍성하고 알차게 늘어나도록 내용을 확장하여 보강해 주세요. 절대 기존 내용을 누락하거나 마음대로 생략하여 아예 새로운 글로 대체하지 마세요.`;
          }
        } else if (option === "correct") {
          promptInstruction = `기존 내용의 흐름과 맥락을 완벽히 유지하면서 맞춤법, 띄어쓰기, 문맥에 어색한 비문 등을 깔끔하게 수정해 주세요. 기존 문단의 내용이나 전체적인 분량을 마음대로 축소하거나 생략해서는 안 됩니다.`;
        } else if (option === "polish") {
          promptInstruction = `작성자가 초안으로 작성한 기존 본문을 완성도 높은 완결성 있는 고품질 글로 다듬어 완성해 주세요. 전체적인 맥락과 핵심 주제, 주요 팩트는 온전히 보존하되, 문장의 표현력을 풍부하고 매끄럽게 가다듬고 오탈자를 교정하며, 논리적 구조와 가독성을 대폭 개선하여 하나의 완결성 높은 고품질의 글로 전체 재작성해 주셔야 합니다. 절대 기존의 유용한 지식 정보나 핵심 주장을 축소, 생략하거나 아예 상관없는 새로운 이야기로 덮어씌우지 마십시오.`;
        } else if (option.startsWith("change_post_type:")) {
          const targetType = option.replace("change_post_type:", "");
          promptInstruction = `작성자가 입력한 기존 본문의 전체적인 핵심 주제와 팩트 정보, 전체 흐름은 동일하게 유지하되, 전체 글의 포스트 타입(글 작성 양식 및 어조)을 [${targetType}] 스타일로 새롭게 재구성하여 재작성해 주세요. 포스트 타입별 글쓰기 특징에 맞춰 제목과의 연계성, 목차 구조, 설명하는 방식, 서론/본론/결론의 논리 구성 방식을 해당 포스트 타입 스타일에 맞춤 최적화해야 합니다. 절대 기존 정보나 중요한 주장을 누락시키지 마십시오.`;
        } else if (option === "apply_google_search") {
          promptInstruction = `현재 본문에 기재된 수치, 통계, 주식 현황, 뉴스 등의 정보가 최신 현실 정보와 일치하는지 Google Search를 활용하여 실시간 검색하고 분석해 주세요. 만약 기존 본문에 적힌 수치나 데이터(예: 주가, 통계치, 특정 정책 내용 등)가 현재 시점의 실시간 정보와 다르거나 오래되었다면, 최신 실시간 검색 결과에 기반하여 본문의 수치와 관련 문맥 정보를 올바르게 수정하고 내용을 업데이트해 주세요. 전체 글의 주요 핵심 주제나 기존 맥락 흐름은 그대로 유지하되, 정보의 사실성과 최신성(팩트)만 실시간 데이터로 교체하고 관련 설명을 보강해야 합니다.`;
        }

        const prompt = `당신은 전문 콘텐츠 에디터이자 SEO 작가입니다. 제공된 원고 제목과 본문(HTML 형식)을 기반으로, 지시사항에 따라 본문을 더 완성도 높고 알차게 보강(확장)해 주세요.

[원고 제목]: ${data.title}
[원고 태그/키워드]: ${data.targetKeyword ?? data.keyword ?? ""}
[기존 본문 (HTML)]:
${data.content ?? ""}

[지시사항]:
${promptInstruction}

[출력 형식 및 제약 조건]:
1. 반드시 기존 본문 내용의 맥락을 누락하지 말고, 내용을 더 풍성하게 다듬거나 확장해야 합니다.
2. 마크다운 기호(예: ** 혹은 * 등)가 아닌 기존 본문에 맞춰 <h2>, <h3>, <p>, <ul>, <li>, <strong> 등 적합한 HTML 태그 형태로 결과를 작성해야 합니다.
3. 지시사항 외의 다른 부연 설명이나 마크다운 백틱(예: \`\`\`html 등)은 절대 포함하지 말고, 브라우저에서 바로 사용할 수 있는 순수한 HTML 본문 코드만 출력하세요.`;

        const useSearch = option === "apply_google_search";
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: useSearch ? "google_search_reflection" : "content_enhancement",
            prompt,
            useSearch,
            userId: user?.id,
            userEmail: user?.email,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "AI 보강 호출에 실패했습니다.");
        }

        let enhancedHtml = result.text || "";
        enhancedHtml = enhancedHtml.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

        if (enhancedHtml) {
          // 포스트 타입 변경 성공 시, 데이터 모델의 postType도 함께 갱신 처리
          if (option.startsWith("change_post_type:")) {
            const targetType = option.replace("change_post_type:", "");
            updateLocalData({
              content: enhancedHtml,
              detailLabel: targetType,
            });
          } else {
            updateLocalData({ content: enhancedHtml });
          }
          window.alert("AI 처리 및 본문 반영이 완료되었습니다.");
        }
      } catch (error: any) {
        console.error("Content enhancement failed:", error);
        window.alert(`AI 보강 실패: ${error.message}`);
      } finally {
        setIsEnhancingContent(false);
        setIsEnhancingToc(false);
        setIsPolishing(false);
        setIsChangingPostType(false);
        setIsApplyingSearch(false);
      }
    },
    [data, supabase, updateLocalData]
  );
  const noopImageUploadClick = useCallback(() => fileInputRef.current?.click(), []);
  const noopImageChange = useCallback(() => { }, []);
  const noopUpdateCaption = useCallback(() => { }, []);
  const noopDeleteImage = useCallback(() => { }, []);

  const handleOpenNaverManuscript = useCallback((id: string) => {
    if (hasLocalEdits) {
      void handleSave();
    }
    router.replace(`/studio/writing/naver/list/${id}`);
  }, [hasLocalEdits, handleSave, router]);

  useEffect(() => {
    if (!hasLocalEdits || !data || isSaving) return;

    const timer = setTimeout(() => {
      console.log("Naver 자동 저장 실행 중...");
      void handleSave();
    }, 1500);

    return () => clearTimeout(timer);
  }, [data?.title, data?.content, hasLocalEdits, isSaving, handleSave]);

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
          <button
            type="button"
            onClick={() => {
              if (hasLocalEdits) {
                void handleSave();
              }
              router.replace("/studio/writing/naver/list");
            }}
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

          <div ref={manuscriptListRef} className="space-y-2">
            {(isMounted ? filteredList : []).map((item) => {
              const active = String(item.id) === manuscriptId;

              return (
                <button
                  key={item.id}
                  type="button"
                  data-manuscript-id={item.id}
                  onClick={() => handleOpenNaverManuscript(String(item.id))}
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
            isEnhancingContent={isEnhancingContent}
            isEnhancingToc={isEnhancingToc}
            isPolishing={isPolishing}
            isChangingPostType={isChangingPostType}
            isApplyingSearch={isApplyingSearch}
            handleImageUploadClick={noopImageUploadClick}
            handleImageChange={noopImageChange}
            handleUpdateCaption={noopUpdateCaption}
            handleDeleteImage={noopDeleteImage}
            handleEnhanceContent={handleEnhanceContent}
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
