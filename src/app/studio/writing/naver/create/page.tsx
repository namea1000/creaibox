"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NaverCreateTab from "@/components/writing/naver/tabs/NaverCreateTab";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  generateGeminiContentWithFallback,
  getPublicGeminiFallbackNotice,
  getUserAiVaultConfig,
} from "@/lib/client/api-vault";
import { naverManuscriptStore } from "@/lib/stores/manuscripts";
import {
  createContentPlannerOutput,
  updateContentPlannerItemStatus,
} from "@/lib/content-planner/supabase";
import { robustParseJson } from "@/lib/utils";

const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

const AI_RETRY_ATTEMPTS = 3;
const AI_RETRY_DELAY_MS = 1200;
const PRIMARY_GEMINI_MODEL = "gemini-3.1-flash-lite";

const GEMINI_MODEL_FALLBACKS = [
  PRIMARY_GEMINI_MODEL,
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isHighDemandError(error: any) {
  const message = String(error?.message || error || "").toLowerCase();

  return (
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("try again later")
  );
}

function getFriendlyAiErrorMessage(error: any) {
  if (isHighDemandError(error)) {
    return "AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 자동으로 다른 모델을 시도합니다.";
  }

  return "AI 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function parseGeminiJson(text: string) {
  return robustParseJson(text);
}

function getLengthPrompt(wordCountGoal: string) {
  switch (wordCountGoal) {
    case "800":
      return {
        label: "📰 짧게 (약 800자)",
        instruction:
          "뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합하게 작성하고 군더더기 없이 핵심만 빠르게 전달하십시오.",
      };
    case "1500":
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction:
          "일반 정보성 블로그형. 가장 많이 사용하는 표준 콘텐츠 구성으로, 도입-핵심 설명-정리 흐름을 안정적으로 유지하십시오.",
      };
    case "3000":
      return {
        label: "🚀 길게 (약 3,000자)",
        instruction:
          "SEO 최적화형 / 상위 노출 공략. 검색 유입과 키워드 최적화 중심으로 소제목을 충분히 쓰고, 문단 전개를 풍부하게 구성하십시오.",
      };
    case "5000":
      return {
        label: "📚 아주 길게 (약 5,000자)",
        instruction:
          "전문 가이드형 / 심층 분석 콘텐츠. 비교, 설명, 활용법까지 자세히 정리하고 사례와 맥락 설명을 충분히 포함하십시오.",
      };
    case "8000":
      return {
        label: "💰 초장문 (약 8,000자)",
        instruction:
          "애드센스 수익형 / 체류시간 극대화. SEO + FAQ + 사례 + 확장 정보를 포함한 전문 아티클형으로 작성하고, 검색자가 오래 머무를 수 있도록 매우 촘촘하게 구성하십시오.",
      };
    default:
      return {
        label: "✍️ 보통 (약 1,500자)",
        instruction:
          "일반 정보성 블로그형으로 자연스럽고 안정적인 표준 콘텐츠 구조를 유지하십시오.",
      };
  }
}

export default function NaverCreatePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[600px] w-full items-center justify-center bg-[#0b0b0d]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-black text-emerald-400 tracking-widest text-xs uppercase italic">
            Naver Studio Loading...
          </span>
        </div>
      </div>
    }>
      <NaverCreatePageContent />
    </Suspense>
  );
}

function NaverCreatePageContent() {
  const supabase = useMemo(() => createClient(), []);

  const resolveAuthUser = async (): Promise<User | null> => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) return session.user;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) return user;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await wait(AUTH_RETRY_DELAY_MS);
      }
    }

    return null;
  };

  const [targetKeyword, setTargetKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTone, setSelectedTone] = useState(
    "친근하고 부드러운 말투 (블로그 후기, 일상)"
  );
  const [postType, setPostType] = useState("AI 자동 포스팅");
  const [wordCountGoal, setWordCountGoal] = useState("1500");

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [editLink, setEditLink] = useState<string>("");
  const [generationStatusMessage, setGenerationStatusMessage] = useState("");
  const [generationErrorMessage, setGenerationErrorMessage] = useState("");
  const [itemId, setItemId] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const user = await resolveAuthUser();

      if (user) {
        setActiveUser(user);

        const { data: prof } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (prof?.nickname) setUserNickname(prof.nickname);
      }
    };

    void getProfile();
  }, [supabase]);

  const searchParams = useSearchParams();
  const [hasAutoRun, setHasAutoRun] = useState(false);

  useEffect(() => {
    const source = searchParams.get("source");
    if (source === "content-planner") {
      const keyword = searchParams.get("keyword");
      const titleParam = searchParams.get("title");
      const contentTypeParam = searchParams.get("contentType");
      const itemIdParam = searchParams.get("itemId");
      const campaignIdParam = searchParams.get("campaignId");

      if (itemIdParam) setItemId(itemIdParam);
      if (campaignIdParam) setCampaignId(campaignIdParam);

      if (keyword && !hasAutoRun) {
        setTargetKeyword(keyword);
        if (titleParam) setTitle(titleParam);
        if (contentTypeParam) setPostType(contentTypeParam);
        setHasAutoRun(true);
        void handleAiGenerateLive(keyword);
      }
    }
  }, [searchParams, hasAutoRun]);

  const saveToSupabase = async (
    currentContent: string,
    currentTitle: string,
    isManual: boolean = false
  ) => {
    if (!currentContent || currentContent.length < 10) {
      alert("❌ 저장할 본문이 아직 충분히 생성되지 않았습니다.");
      return;
    }

    try {
      const user = activeUser || (await resolveAuthUser());

      if (!user) {
        alert(
          "❌ 로그인 세션을 확인하지 못해 저장을 진행하지 못했습니다. 다시 로그인했는지 확인해 주세요."
        );
        return;
      }

      if (!activeUser) setActiveUser(user);

      const finalAuthor = userNickname || user.email?.split("@")[0] || "Unknown";

      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: currentTitle || title || "제목 없음",
        content: currentContent,
        status: "saved",
        categories: [postType || "AI 자동 포스팅"],
        tags: [selectedTone || "기본 말투"],
        post_type: "create",
        target_keyword: targetKeyword || null,
        selected_tone: selectedTone || null,
        word_count_goal: Number(wordCountGoal) || null,
        source_mode: null,
        source_url: null,
        source_text: null,
        rewrite_strategy: null,
      };

      const { data: insertedRow, error } = await supabase
        .from("writing_naver_posts")
        .insert([payload])
        .select("id, created_at")
        .single();

      if (error) {
        console.error("DB 저장 에러:", error.message);
        alert(`❌ DB 저장 실패: ${error.message}`);
        return;
      }

      if (itemId && campaignId && insertedRow) {
        try {
          const outputPayload = {
            campaignId: campaignId,
            itemId: itemId,
            outputType: "naver_blog" as const,
            platform: "네이버 블로그" as const,
            targetRoute: `/studio/writing/naver/list/${insertedRow.id}`,
            title: currentTitle || title || "제목 없음",
            status: "generated" as const,
            generatedPostId: insertedRow.id,
            metadata: {}
          };
          await createContentPlannerOutput(outputPayload);
          await updateContentPlannerItemStatus(itemId, "generated");
        } catch (linkErr) {
          console.error("Failed to link planner output:", linkErr);
        }
      }

      if (insertedRow?.id) {
        setEditLink(`/studio/writing/naver/list/${insertedRow.id}`);

        naverManuscriptStore.upsert({
          id: String(insertedRow.id),
          title: currentTitle || title || "제목 없음",
          content: currentContent,
          keyword: targetKeyword || postType || "일반 원고",
          type: "create",
          detailLabel: "AI 스마트 글쓰기",
          selectedTone: selectedTone || "친근하고 부드러운 말투",
          status: "saved",
          wordCount: currentContent.length,
          updatedAt: insertedRow.created_at
            ? insertedRow.created_at.replace("T", " ").substring(0, 16)
            : "",
          images: [],
        });
      }

      alert(
        isManual
          ? "🎉 에디터의 새 원고가 '네이버 발행 원고 관리' 장부에 즉시 수동 적재되었습니다!"
          : "✅ 콘텐츠가 생성되어 '네이버 발행 원고 관리' 장부에 즉시 자동 저장되었습니다!"
      );
    } catch (err: any) {
      alert(`❌ 시스템 오류: ${err.message}`);
    }
  };

  const handleAiGenerateLive = async (overrideKeyword?: string) => {
    const activeKeyword = overrideKeyword || targetKeyword;
    if (!activeKeyword.trim()) {
      alert("타겟 키워드를 기입해 주십시오, 사장님!");
      return;
    }

    setIsAiLoading(true);
    setTitle("");
    setContent("");
    setGenerationStatusMessage(`${PRIMARY_GEMINI_MODEL} 모델로 글을 생성하고 있습니다...`);
    setGenerationErrorMessage("");

    try {
      const lengthPrompt = getLengthPrompt(wordCountGoal);
      const vaultConfig = getUserAiVaultConfig();
      const shouldUseGoogleSearch = Boolean(
        useSearch && vaultConfig?.provider === "gemini_postpay"
      );

      if (!vaultConfig) {
        alert(getPublicGeminiFallbackNotice());
      }

      const prompt = `
        너는 블로그 스마트블록 노출 전문 탑 마케터이다. 조건에 부합하는 고품질 원고를 빌드하라.
        - 키워드: ${activeKeyword}
        - 어조: ${selectedTone}
        - 유형: ${postType}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${wordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - 연도 정보: 2026년 최신 팩트체크 기반 전개 ${shouldUseGoogleSearch ? "(구글 검색 활용)" : "(내부 지식 기반)"}
        - 제목은 클릭하고 싶게 만들되 과장하지 말고, 첫 문단에서 핵심 결론을 빠르게 전달하라.
        - 짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 넣어라.
        오직 규격에 맞는 JSON 오브젝트만 반환하라: { "title": "생성된 제목", "content": "마크다운 본문" }
      `;

      let text = "";
      let lastError: any = null;
      const uniqueModelNames = [
        ...new Set(
          vaultConfig?.provider === "groq"
            ? [vaultConfig.model]
            : [vaultConfig?.model || PRIMARY_GEMINI_MODEL, ...GEMINI_MODEL_FALLBACKS]
        ),
      ];

      for (const modelName of uniqueModelNames) {
        for (let attempt = 1; attempt <= AI_RETRY_ATTEMPTS; attempt += 1) {
          try {
            setGenerationStatusMessage(
              attempt === 1
                ? modelName === PRIMARY_GEMINI_MODEL
                  ? `${PRIMARY_GEMINI_MODEL} 모델로 글을 생성하고 있습니다...`
                  : "AI 서버 상태에 따라 보조 모델로 이어서 글을 생성하고 있습니다..."
                : `${modelName} 모델 재시도 중입니다. (${attempt}/${AI_RETRY_ATTEMPTS})`
            );

            const generationResult = await generateGeminiContentWithFallback({
              modelName,
              prompt,
              useSearch: shouldUseGoogleSearch,
              responseMimeType: "application/json",
              type: "naver_create",
              userId: activeUser?.id || null,
              userEmail: activeUser?.email || null,
            });
            text = generationResult.text;

            lastError = null;
            setGenerationStatusMessage("AI 응답을 정리하는 중입니다...");
            break;
          } catch (error: any) {
            lastError = error;
            console.warn(`[Naver Gemini 생성 실패] model=${modelName}, attempt=${attempt}`, error);

            if (attempt < AI_RETRY_ATTEMPTS && isHighDemandError(error)) {
              setGenerationStatusMessage(
                "AI 서버가 혼잡하여 자동으로 다시 시도하고 있습니다..."
              );
              await wait(AI_RETRY_DELAY_MS * attempt);
              continue;
            }

            break;
          }
        }

        if (text) break;
      }

      if (!text) {
        throw lastError || new Error("AI 응답을 받지 못했습니다.");
      }

      const parsedData = parseGeminiJson(text);

      const finalTitle = parsedData.title || `[스마트] ${activeKeyword} 핵심 분석`;
      const finalContent = parsedData.content || "";

      setTitle(finalTitle);
      setContent(finalContent);
      setGenerationStatusMessage("생성이 완료되었습니다. 네이버 원고 장부에 자동 저장 중입니다...");
      setIsAiLoading(false);

      await saveToSupabase(finalContent, finalTitle, false);

      setGenerationStatusMessage("생성과 저장이 완료되었습니다.");
    } catch (error: any) {
      const friendlyMessage = getFriendlyAiErrorMessage(error);

      console.error(error);
      setGenerationErrorMessage(friendlyMessage);
      setGenerationStatusMessage("");
      setIsAiLoading(false);

      alert(friendlyMessage);
    }
  };

  return (
    <div className="h-full">
      <NaverCreateTab
        key={isAiLoading ? "active_loading" : "active_ready"}
        targetKeyword={targetKeyword}
        setTargetKeyword={setTargetKeyword}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        selectedTone={selectedTone}
        setSelectedTone={setSelectedTone}
        wordCountGoal={wordCountGoal}
        setWordCountGoal={setWordCountGoal}
        postType={postType}
        setPostType={setPostType}
        isAiLoading={isAiLoading}
        setIsAiLoading={setIsAiLoading}
        useSearch={useSearch}
        setUseSearch={setUseSearch}
        handleAiGenerateLive={handleAiGenerateLive}
        handleSavePostToSupabase={() => saveToSupabase(content, title, true)}
        editLink={editLink}
        generationStatusMessage={generationStatusMessage}
        generationErrorMessage={generationErrorMessage}
      />
    </div>
  );
}
