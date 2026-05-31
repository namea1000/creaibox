"use client";

import React, { useMemo, useState, useEffect } from "react";
import CreaiboxCreateTab from "@/components/writing/creaibox/tabs/CreaiboxCreateTab";
import { createClient } from "@/utils/supabase/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { User } from "@supabase/supabase-js";
import { creaiboxManuscriptStore } from "@/lib/stores/manuscripts";

const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;
const SESSION_TIMEOUT_MS = 4000;

const AI_RETRY_ATTEMPTS = 3;
const AI_RETRY_DELAY_MS = 1200;

const GEMINI_MODEL_FALLBACKS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
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
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("AI 응답을 JSON으로 변환하지 못했습니다.");
  }
}

function getLengthPrompt(wordCountGoal: string) {
  switch (wordCountGoal) {
    case "800":
      return {
        label: "📰 짧게 (약 800자)",
        instruction:
          "뉴스형 / 핵심 정보 빠른 전달. 짧은 요약, 속보, 트렌드 소개에 적합한 구조로 작성하고 군더더기 없이 핵심만 빠르게 전달하십시오.",
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

function sanitizeGeneratedTitle(rawTitle: string, fallbackKeyword: string) {
  const cleaned = rawTitle
    .replace(/\[(.*?)AI(.*?)\]/gi, "[$1$2]")
    .replace(/\[\s*Creaibox\s+Insight\s*\]/gi, "[Creaibox Insight]")
    .replace(/\[\s*Creaibox\s+AI\s+Insight\s*\]/gi, "[Creaibox Insight]")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || `[Creaibox Insight] ${fallbackKeyword} 핵심 분석`;
}

function stripHorizontalRules(markdown: string) {
  return markdown
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*\*\*\*+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeFocusKeyword(
  rawValue: string | undefined,
  fallbackKeyword: string,
  fallbackTitle: string
) {
  const cleaned = (rawValue || "")
    .replace(/[\[\]#*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length >= 2) return cleaned;
  if (fallbackKeyword.trim().length >= 2) return fallbackKeyword.trim();

  return fallbackTitle
    .replace(/\[[^\]]+\]/g, " ")
    .split(/[\s,:·|/]+/)
    .filter((token) => token.trim().length >= 2)
    .slice(0, 2)
    .join(" ")
    .trim();
}

function normalizeSeoTags(rawTags: unknown, focusKeyword: string) {
  const parsedTags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string"
      ? rawTags.split(",")
      : [];

  const cleaned = parsedTags
    .map((tag) =>
      String(tag)
        .replace(/[#\[\]]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((tag) => tag.length >= 2);

  const fallback = focusKeyword
    ? [
      focusKeyword,
      `${focusKeyword} 전망`,
      `${focusKeyword} 분석`,
      `${focusKeyword} 수혜주`,
      `${focusKeyword} 투자 포인트`,
    ]
    : [];

  return [...new Set(cleaned.length > 0 ? cleaned : fallback)].slice(0, 5);
}

function buildSeoSlug(title: string, focusKeyword: string) {
  const titleTokens = title
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const focusTokens = focusKeyword
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  return [...new Set([...focusTokens, ...titleTokens])]
    .slice(0, 6)
    .join("-")
    .toLowerCase()
    .slice(0, 60);
}

export default function CreaiboxEditorPage() {
  const supabase = useMemo(() => createClient(), []);

  const resolveAuthUser = async (): Promise<User | null> => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), SESSION_TIMEOUT_MS);
      });

      const sessionPromise = supabase.auth
        .getSession()
        .then(({ data: { session } }) => session?.user || null)
        .catch(() => null);

      const sessionUser = await Promise.race([sessionPromise, timeout]);
      if (sessionUser) return sessionUser;

      const userPromise = supabase.auth
        .getUser()
        .then(({ data: { user } }) => user || null)
        .catch(() => null);

      const user = await Promise.race([userPromise, timeout]);
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
    "전문적이고 통찰력 있는 분석 (기술 블로그)"
  );
  const [postType, setPostType] = useState("AI 인사이트 포스팅");
  const [wordCountGoal, setWordCountGoal] = useState("1500");

  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [seoTags, setSeoTags] = useState<string[]>([]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [editLink, setEditLink] = useState("");
  const [generationStatusMessage, setGenerationStatusMessage] = useState("");
  const [generationErrorMessage, setGenerationErrorMessage] = useState("");

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

  const getApiKey = async () => {
    const localKey = localStorage.getItem("gemini_api_key");
    if (localKey && localKey.trim()) return localKey;

    const { data: vaultKeys } = await supabase
      .from("admin_api_vault")
      .select("key")
      .eq("status", "active");

    if (!vaultKeys || vaultKeys.length === 0) {
      throw new Error("API 키를 찾을 수 없습니다.");
    }

    const selectedKey = vaultKeys[Math.floor(Math.random() * vaultKeys.length)].key;

    try {
      return atob(selectedKey);
    } catch {
      return selectedKey;
    }
  };

  const saveToSupabase = async (
    currentContent: string,
    currentTitle: string,
    isManual: boolean = false,
    overrides?: {
      focusKeyword?: string;
      seoTags?: string[];
      slug?: string;
      metaDescription?: string;
      canonicalUrl?: string;
    }
  ) => {
    if (!currentContent || currentContent.length < 50) {
      alert("콘텐츠 내용을 더 작성해 주세요.");
      return;
    }

    try {
      const user = activeUser || (await resolveAuthUser());

      if (!user) {
        alert(
          "로그인 세션을 확인하지 못해 저장을 진행하지 못했습니다. 다시 로그인 상태를 확인해 주세요."
        );
        return;
      }

      if (!activeUser) {
        setActiveUser(user);
      }

      const derivedFocusKeyword =
        (overrides?.focusKeyword || focusKeyword || targetKeyword).trim() || null;

      const selectedSeoTags =
        overrides?.seoTags && overrides.seoTags.length > 0 ? overrides.seoTags : seoTags;

      const derivedSeoTags =
        selectedSeoTags.length > 0
          ? selectedSeoTags
          : derivedFocusKeyword
            ? [
              derivedFocusKeyword,
              `${derivedFocusKeyword} 전망`,
              `${derivedFocusKeyword} 분석`,
              `${derivedFocusKeyword} 핵심 정리`,
              `${derivedFocusKeyword} 투자 포인트`,
            ].slice(0, 5)
            : null;

      const payload = {
        user_id: user.id,
        user_nicename: userNickname || user.email?.split("@")[0],
        title: currentTitle,
        content: currentContent,
        status: "saved",
        post_type: postType || "AI 인사이트 포스팅",
        target_keyword: targetKeyword || null,
        selected_tone: selectedTone || null,
        slug: overrides?.slug || slug || null,
        meta_description: overrides?.metaDescription || metaDescription || null,
        focus_keyword: derivedFocusKeyword,
        canonical_url: overrides?.canonicalUrl || canonicalUrl || null,
        seo_tags: derivedSeoTags,
        word_count_goal: wordCountGoal,
        use_search: useSearch,
      };

      const { data: insertedRow, error } = await supabase
        .from("writing_creaibox_posts")
        .insert([payload])
        .select("id, display_id, created_at")
        .single();

      if (error) throw error;

      if (insertedRow?.display_id) {
        setEditLink(`/studio/writing/creaibox/list/${insertedRow.display_id}`);
      }

      if (insertedRow?.id) {
        creaiboxManuscriptStore.upsert({
          id: String(insertedRow.id),
          displayId: insertedRow.display_id || 0,
          title: currentTitle || title || "제목 없음",
          content: currentContent,
          keyword: targetKeyword || "일반 원고",
          type: "create",
          detailLabel: "AI 인사이트 포스팅",
          selectedTone: selectedTone || "전문적이고 통찰력 있는 분석",
          status: "saved",
          wordCount: currentContent.length,
          updatedAt: insertedRow.created_at
            ? insertedRow.created_at.replace("T", " ").substring(0, 16)
            : "",
          slug: payload.slug || "",
          metaDescription: payload.meta_description || "",
          focusKeyword: derivedFocusKeyword || "",
          canonicalUrl: payload.canonical_url || "",
          seoTags: derivedSeoTags || [],
          images: [],
        });
      }

      alert(
        isManual
          ? "원고가 아카이브에 저장되었습니다."
          : "AI 생성이 완료되어 아카이브에 자동 저장되었습니다."
      );
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    }
  };

  const handleAiGenerateLive = async () => {
    if (!targetKeyword.trim()) {
      alert("타겟 키워드를 입력해 주세요.");
      return;
    }

    setIsAiLoading(true);
    setGenerationStatusMessage("AI 생성 준비 중입니다...");
    setGenerationErrorMessage("");

    try {
      const lengthPrompt = getLengthPrompt(wordCountGoal);
      const apiKey = await getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);

      const prompt = `
        당신은 Creaibox의 전문 블로그 콘텐츠 에디터입니다. 
        - 주제: ${targetKeyword}
        - 어조: ${selectedTone}
        - 글 유형: ${postType}
        - 길이 규격: ${lengthPrompt.label}
        - 목표 분량: 약 ${wordCountGoal}자
        - 길이 작성 지침: ${lengthPrompt.instruction}
        - ${useSearch ? "Google Search를 활용해" : "내부 지식과 논리 전개를 활용해"} 2026년 최신 기술 트렌드와 인사이트를 반영하여 작성하십시오.
        - 제목은 클릭하고 싶게 만들되 과장하지 말고, 첫 문단에서 글의 핵심 가치를 빠르게 전달하십시오.
        - 본문은 마크다운 형식으로 작성하고, 길이 규격에 맞게 문단 수와 정보 밀도를 조절하십시오.
        - 짧은 글은 압축적으로, 긴 글은 소제목/사례/FAQ/실행 팁을 충분히 포함해 깊이 있게 작성하십시오.
        - 제목에는 "[Creaibox AI Insight]" 같은 AI 표기를 넣지 말고, 본문에도 가로 구분선(---, ***)을 넣지 마십시오.
        - SEO 최적화 관점에서 이 글의 핵심 Focus Keyword 1개를 뽑으십시오.
        - SEO Tags 는 Focus Keyword를 중심으로 한 롱테일 검색어 5개를 생성하십시오.
        - Meta Description 은 정확히 160자에 가깝게 작성하고, 문장 끝은 "알아보겠습니다", "확인해보겠습니다", "분석해보겠습니다"처럼 마무리되는 자연스러운 안내형 문장으로 끝내십시오.
        - Slug 는 Focus Keyword가 반드시 포함되도록 너무 길지 않게 SEO 친화적으로 작성하십시오.
        - JSON 형식으로만 반환하십시오:
          {
            "title": "제목",
            "content": "마크다운 본문",
            "focusKeyword": "핵심 키워드",
            "seoTags": ["롱테일1", "롱테일2", "롱테일3", "롱테일4", "롱테일5"],
            "metaDescription": "160자 설명",
            "slug": "seo-friendly-slug"
          }
      `;

      let text = "";
      let lastError: any = null;

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        for (let attempt = 1; attempt <= AI_RETRY_ATTEMPTS; attempt += 1) {
          try {
            setGenerationStatusMessage(
              attempt === 1
                ? `${modelName} 모델로 글을 생성하고 있습니다...`
                : `${modelName} 모델 재시도 중입니다. (${attempt}/${AI_RETRY_ATTEMPTS})`
            );

            const modelOptions: any = { model: modelName };

            if (useSearch) {
              modelOptions.tools = [{ googleSearch: {} }];
            }

            const model = genAI.getGenerativeModel(modelOptions);
            const result = await model.generateContent(prompt);
            text = result.response.text();

            lastError = null;
            setGenerationStatusMessage("AI 응답을 정리하는 중입니다...");
            break;
          } catch (error: any) {
            lastError = error;
            console.warn(`[Creaibox Gemini 생성 실패] model=${modelName}, attempt=${attempt}`, error);

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

      const parsed = parseGeminiJson(text);

      const finalTitle = sanitizeGeneratedTitle(parsed.title || "", targetKeyword);
      const finalContent = stripHorizontalRules(parsed.content || "");
      const nextFocusKeyword = normalizeFocusKeyword(
        parsed.focusKeyword,
        targetKeyword,
        finalTitle
      );
      const nextSeoTags = normalizeSeoTags(parsed.seoTags, nextFocusKeyword);
      const nextSlug = buildSeoSlug(parsed.slug || finalTitle, nextFocusKeyword);
      const nextMetaDescription = (parsed.metaDescription || "").trim();

      setTitle(finalTitle);
      setContent(finalContent);
      setFocusKeyword(nextFocusKeyword);
      setSeoTags(nextSeoTags);
      setSlug(nextSlug);
      setCanonicalUrl(`https://creaibox.blog/${nextSlug}`);

      if (nextMetaDescription) {
        setMetaDescription(nextMetaDescription);
      }

      setGenerationStatusMessage("생성이 완료되었습니다. 아카이브에 자동 저장 중입니다...");
      setIsAiLoading(false);

      setTimeout(() => {
        void saveToSupabase(finalContent, finalTitle, false, {
          focusKeyword: nextFocusKeyword,
          seoTags: nextSeoTags,
          slug: nextSlug,
          metaDescription: nextMetaDescription,
          canonicalUrl: `https://creaibox.blog/${nextSlug}`,
        });
      }, 100);
    } catch (error: any) {
      const friendlyMessage = getFriendlyAiErrorMessage(error);

      console.error(error);
      setGenerationErrorMessage(friendlyMessage);
      setGenerationStatusMessage("");
      setIsAiLoading(false);
      alert(friendlyMessage);
    }
  };

  const handleResetGeneratedContent = () => {
    const hasGeneratedData = Boolean(
      title.trim() ||
      content.trim() ||
      slug.trim() ||
      metaDescription.trim() ||
      focusKeyword.trim() ||
      canonicalUrl.trim() ||
      seoTags.length > 0
    );

    if (!hasGeneratedData) {
      alert("삭제할 생성 결과가 없습니다.");
      return;
    }

    const shouldReset = window.confirm(
      "현재 생성된 본문과 SEO 정보를 모두 삭제하고 화면을 새로고침할까요?"
    );

    if (!shouldReset) return;

    setTitle("");
    setContent("");
    setSlug("");
    setMetaDescription("");
    setFocusKeyword("");
    setCanonicalUrl("");
    setSeoTags([]);

    window.location.reload();
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#0b0b0d]">
      <CreaiboxCreateTab
        targetKeyword={targetKeyword}
        setTargetKeyword={setTargetKeyword}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        slug={slug}
        setSlug={setSlug}
        metaDescription={metaDescription}
        setMetaDescription={setMetaDescription}
        focusKeyword={focusKeyword}
        setFocusKeyword={setFocusKeyword}
        canonicalUrl={canonicalUrl}
        setCanonicalUrl={setCanonicalUrl}
        seoTags={seoTags}
        setSeoTags={setSeoTags}
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
        handleResetGeneratedContent={handleResetGeneratedContent}
        editLink={editLink}
        generationStatusMessage={generationStatusMessage}
        generationErrorMessage={generationErrorMessage}
      />
    </div>
  );
}