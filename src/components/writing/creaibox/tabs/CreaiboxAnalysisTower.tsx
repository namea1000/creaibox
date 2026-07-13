"use client";

import React, { useState } from 'react';
import { 
  Check, AlertCircle, ShieldCheck, Cpu, PieChart, 
  BarChart3, CheckCircle2, ChevronDown, ChevronUp, HelpCircle,
  Sparkles, Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";

interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

interface CreaiboxAnalysisTowerProps {
  seoScore: number;
  seoChecks: {
    titleKeyword: boolean;
    contentDensity: boolean;
    duplicateSafe?: boolean;
    lengthCheck?: boolean;
    structureCheck?: boolean;
    subHeadingCheck?: boolean;
  };
  posRatio: {
    noun: number;
    verb: number;
    other: number;
  };
  frequencies: KeywordFrequency[];
  content: string;
  title?: string;
  focusKeyword?: string;
  metaDescription?: string;
  slug?: string;
  canonicalUrl?: string;
  seoTags?: string[];
  crawlabilityScore: number; // 네이버 봇 스코어 -> 크롤링 효율 점수로 변경
  isDensitySafe: boolean;
  isRecreateMode?: boolean;
  similarityScore?: number;
  isDetailMode?: boolean;
  updateLocalData?: (patch: Partial<StudioManuscriptRecord>) => void;
}

type SeoItem = {
  label: string;
  passed: boolean;
  helper?: string;
};

type SeoGroupKey = "basic" | "additional" | "title" | "content";

function normalizeText(value?: string | null) {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function includesKeyword(value: string | undefined, keyword: string) {
  if (!keyword) return false;
  return normalizeText(value).includes(normalizeText(keyword));
}

function countKeywordOccurrences(value: string, keyword: string) {
  if (!keyword) return 0;
  const normalizedValue = normalizeText(value);
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedValue || !normalizedKeyword) return 0;
  return normalizedValue.split(normalizedKeyword).length - 1;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function SeoCheckRow({ item }: { item: SeoItem }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="flex min-w-0 items-start gap-2 text-zinc-400">
        {item.passed ? (
          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
        ) : (
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-400" />
        )}
        <span className="leading-5">{item.label}</span>
      </span>
      <HelpCircle size={14} className="mt-0.5 shrink-0 text-zinc-600" />
    </div>
  );
}

function SeoCheckGroup({
  title,
  items,
  isOpen,
  onToggle,
}: {
  title: string;
  items: SeoItem[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const errorCount = items.filter((item) => !item.passed).length;

  return (
    <div className="border-t border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-14 w-full items-center justify-between px-5 text-left transition hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-2 text-sm font-black text-zinc-100">
          {title}
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${errorCount > 0 ? "bg-rose-400/20 text-rose-300" : "bg-emerald-400/15 text-emerald-300"}`}>
            {errorCount > 0 ? `x ${errorCount} 오류` : "완료"}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-white/70" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/70" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-3 px-5 pb-5 pt-2">
          {items.map((item) => (
            <SeoCheckRow key={item.label} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreaiboxAnalysisTower({
  seoScore, seoChecks, posRatio, frequencies, content, title = "", focusKeyword = "", metaDescription = "", slug = "", canonicalUrl = "", seoTags = [], crawlabilityScore, isDensitySafe,
  isRecreateMode = false, similarityScore = 100, isDetailMode = false, updateLocalData
}: CreaiboxAnalysisTowerProps) {
  const [isSeoOptimizerOpen, setIsSeoOptimizerOpen] = useState(true);
  const [isContentQualityOpen, setIsContentQualityOpen] = useState(true);
  const [openSeoGroups, setOpenSeoGroups] = useState<Record<SeoGroupKey, boolean>>({
    basic: true,
    additional: true,
    title: true,
    content: true,
  });

  const [isOptimizingBody, setIsOptimizingBody] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Retrieve API Key from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("gemini_api_key");
      setApiKey(savedKey);
    }
  }, []);

  const handleOptimizeBodyText = async () => {
    if (!content || !updateLocalData) return;

    const currentKey = localStorage.getItem("gemini_api_key");
    if (!currentKey) {
      alert("API Vault 메뉴에서 Gemini API 키를 먼저 등록해 주세요.");
      return;
    }

    if (!focusKeyword) {
      alert("포커스 키워드가 설정되어 있지 않습니다. 키워드를 먼저 입력해 주세요.");
      return;
    }

    if (!window.confirm("AI 본문 SEO 자동 교정을 진행할까요? 기존 글의 뼈대와 문맥은 보존하면서 SEO 점수 최적화가 자연스럽게 본문에 반영됩니다.")) {
      return;
    }

    setIsOptimizingBody(true);

    try {
      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({
        model: "models/gemini-3.1-flash-lite",
        systemInstruction: `당신은 노련한 웹 전문 SEO 테크니컬 카피라이터입니다.
제시되는 HTML 포스트 본문을 정밀 분석하여, 전체 글의 뼈대, 세부 문맥, 본래의 어조, 기획 의도를 90% 이상 그대로 고스란히 보존(Keep)하면서 다음 4가지 핵심 SEO 지표에 대해서만 '자연스럽고 부드럽게 최소한의 본문 문구 교정'을 적용해 주십시오.
억지로 100점을 맞추기 위해 글을 기계처럼 완전히 새로 쓰거나 틀을 뒤흔들어서 가독성을 해치지 않도록 각별히 유의하십시오.

[핵심 교정 미션]
1. [키워드 초기 배치]: 본문 기사의 시작 부분(첫 2~3개의 문장 또는 첫 문단 구간) 안에 포커스 키워드([focusKeyword])를 자연스럽게 흐름에 맞추어 1회 삽입하십시오.
2. [소제목 키워드 주입]: <h2> 또는 <h3> 부제목 중 최소 1~2개에 포커스 키워드([focusKeyword])를 매끄럽게 포함하도록 타이틀을 수정하십시오. (예: 키워드가 '다이어트'라면 '효과적인 다이어트 비법'과 같이 문맥에 맞춘 조사/단어의 부분 결합 허용)
3. [키워드 밀도 조율]: 본문 전체 텍스트 중 포커스 키워드의 출현 점유율이 약 1.0% 전후 (0.8% ~ 1.5% 사이)가 되도록 조율하십시오. 본문 내에 키워드가 너무 과도하게 연발되면 동의어(대체어)로 순화하여 깎아내고, 반대로 너무 희박한 경우 흐름상 1~2회 추가하십시오.
4. [소제목 논리 구조]: <h2>, <h3> 등의 제목 구조가 체계적인 목차처럼 조화를 이루게 만드십시오.

[출력 규칙]
- 마크다운 백틱(\`\`\`html)이나 "네, 수정했습니다" 같은 안내 멘트 등은 단 한 마디도 적지 마십시오.
- 오직 교정이 완벽히 완료된 순수 HTML 코드(포스트 본문)만 응답으로 즉시 출력하십시오.`,
      });

      const prompt = `Target Focus Keyword: ${focusKeyword}
Current Post Title: ${title}
Current Meta Description: ${metaDescription}
Current HTML Content:
${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Clean up markdown block wraps if AI returned them
      if (text.startsWith("```")) {
        text = text.replace(/^```html\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      if (!text) {
        throw new Error("AI로부터 반환된 교정 본문이 비어있습니다.");
      }

      // 🌟 주석 스키마 보존 가드 (Bypass Guard)
      const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
      const schemaBlocks: string[] = [];
      let match;
      while ((match = schemaRegex.exec(content)) !== null) {
        schemaBlocks.push(match[0]);
      }

      // 기존 본문 뒤에 붙어있던 에디토리얼 설정 주석(CREAIBOX_EDITORIAL_START)도 찾아 보존합니다.
      const editorialRegex = /<!--\s*CREAIBOX_EDITORIAL_START([\s\S]*?)CREAIBOX_EDITORIAL_END\s*-->/gi;
      const editorialMatch = editorialRegex.exec(content);
      const editorialBlock = editorialMatch ? editorialMatch[0] : "";

      // 새 HTML 끝에 주석들을 병합
      let cleanText = text.replace(schemaRegex, "").replace(editorialRegex, "").trim();
      let finalContent = cleanText;
      
      if (editorialBlock) {
        finalContent += `\n\n${editorialBlock}`;
      }
      if (schemaBlocks.length > 0) {
        finalContent += `\n\n${schemaBlocks.join("\n\n")}`;
      }
      finalContent += `\n`;

      updateLocalData({ content: finalContent });
      alert("AI 본문 SEO 자동 교정이 성공적으로 완료되었습니다! 본문 소제목과 키워드 밀도가 자연스럽게 정돈되었습니다.");
    } catch (err: any) {
      console.error("AI SEO optimization error:", err);
      alert(`본문 SEO 교정 실패: ${err.message || "알 수 없는 오류가 발생했습니다."}`);
    } finally {
      setIsOptimizingBody(false);
    }
  };

  const cleanContent = content.replace(/[#*_>`-]/g, " ");
  const compactContentLength = cleanContent.replace(/\s+/g, "").length;
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const headingLines = content.match(/^#{2,4}\s+.+$/gm) ?? [];
  const keywordOccurrences = countKeywordOccurrences(content, focusKeyword);
  const densityBase = Math.max(1, Math.ceil(compactContentLength / 100));
  const keywordDensity = keywordOccurrences / densityBase;
  const hasExternalLink = /https?:\/\/(?!creaibox\.com|www\.creaibox\.com)/i.test(content);
  const hasInternalLink = /https?:\/\/(?:www\.)?creaibox\.com|]\(\//i.test(content);
  const hasRichMedia = /!\[[^\]]*]\([^)]+\)|<img|<video/i.test(content);
  const isParagraphReadable = paragraphs.length > 0 && paragraphs.every((paragraph) => paragraph.length <= 450);
  const isContentReadable = compactContentLength >= 600 && isParagraphReadable;
  const hasRealSemanticRatio = posRatio.noun > 0 || posRatio.verb > 0 || posRatio.other > 0;
  const effectiveCrawlabilityScore =
    crawlabilityScore > 0
      ? crawlabilityScore
      : Math.min(
          100,
          20 +
            (headingLines.length >= 3 ? 25 : 0) +
            ((slug || canonicalUrl).length > 0 && (slug || canonicalUrl).length <= 75 ? 20 : 0) +
            (hasInternalLink ? 15 : 0) +
            (compactContentLength >= 600 ? 20 : 0)
        );

  const basicSeoItems: SeoItem[] = [
    {
      label: "SEO 제목에 포커스 키워드를 추가해 주세요.",
      passed: includesKeyword(title, focusKeyword),
    },
    {
      label: "SEO 메타 설명에 포커스 키워드를 추가해 주세요.",
      passed: includesKeyword(metaDescription, focusKeyword),
    },
    {
      label: "URL에 포커스 키워드를 사용해 주세요.",
      passed: includesKeyword(slug, focusKeyword) || includesKeyword(canonicalUrl, focusKeyword),
    },
    {
      label: "콘텐츠 시작 부분에 포커스 키워드를 사용하세요.",
      passed: includesKeyword(content.slice(0, 240), focusKeyword),
    },
    {
      label: "게시물 콘텐츠에 포커스 키워드를 포함시키세요.",
      passed: includesKeyword(content, focusKeyword),
    },
    {
      label: `콘텐츠 길이가 ${compactContentLength.toLocaleString()}자입니다. 최소 600자 이상을 권장합니다.`,
      passed: compactContentLength >= 600,
    },
  ];

  const additionalSeoItems: SeoItem[] = [
    {
      label: "H2, H3, H4 등과 같은 부제목에 포커스 키워드를 사용하세요.",
      passed: headingLines.some((heading) => includesKeyword(heading, focusKeyword)),
    },
    {
      label: "포커스 키워드를 대체 텍스트로 사용해서 이미지를 추가합니다.",
      passed: Boolean(focusKeyword) && new RegExp(`!\\[[^\\]]*${escapeRegExp(focusKeyword)}[^\\]]*\\]`, "i").test(content),
    },
    {
      label: `키워드 밀도는 ${(keywordDensity * 100).toFixed(1)}%입니다. 1% 근처가 목표치입니다.`,
      passed: Boolean(focusKeyword) && keywordDensity >= 0.008 && keywordDensity <= 0.025,
    },
    {
      label: `URL은 ${(slug || canonicalUrl).length}자 길이입니다.`,
      passed: (slug || canonicalUrl).length > 0 && (slug || canonicalUrl).length <= 75,
    },
    {
      label: "외부 리소스에 링크 아웃을 추가하세요.",
      passed: hasExternalLink,
    },
    {
      label: "내부 링크를 콘텐츠에 추가하세요.",
      passed: hasInternalLink,
    },
    {
      label: "이 콘텐츠에 핵심 키워드를 설정하세요.",
      passed: Boolean(focusKeyword.trim()),
    },
  ];

  const titleReadabilityItems: SeoItem[] = [
    {
      label: "SEO 제목의 앞 부분에서 포커스 키워드를 사용합니다.",
      passed: Boolean(focusKeyword) && normalizeText(title).startsWith(normalizeText(focusKeyword)),
    },
    {
      label: "SEO 제목에 숫자를 사용하고 있습니다.",
      passed: /\d/.test(title),
    },
  ];

  const contentReadabilityItems: SeoItem[] = [
    {
      label: "목차처럼 보이는 소제목 구조를 사용하고 있습니다.",
      passed: headingLines.length >= 3,
    },
    {
      label: "짧은 문단을 사용하고 있습니다.",
      passed: paragraphs.length > 0 && paragraphs.every((paragraph) => paragraph.length <= 450),
    },
    {
      label: "이미지나 비디오와 같은 리치 미디어를 사용하고 있습니다.",
      passed: hasRichMedia,
    },
  ];

  const allSeoItems = [
    ...basicSeoItems,
    ...additionalSeoItems,
    ...titleReadabilityItems,
    ...contentReadabilityItems,
  ];
  const calculatedSeoScore = Math.round(
    (allSeoItems.filter((item) => item.passed).length / Math.max(1, allSeoItems.length)) * 100
  );

  const toggleSeoGroup = (group: SeoGroupKey) => {
    setOpenSeoGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="lg:col-span-2 flex h-full flex-col overflow-y-auto custom-scrollbar">
      
      {/* 1단: Cre Rank Math SEO Optimizer */}
      <section className="border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setIsSeoOptimizerOpen((open) => !open)}
          className="flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#111827] to-[#0d1117] px-5 text-left transition hover:bg-blue-500/5"
        >
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
            Cre Rank Math SEO
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-black text-blue-400">
              SCORE: {calculatedSeoScore}/100
            </span>
            {isSeoOptimizerOpen ? (
              <ChevronUp className="h-4 w-4 text-white/70" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/70" />
            )}
          </span>
        </button>

        {isSeoOptimizerOpen && (
          <div>
            {/* 🌟 AI 본문 SEO 자동 교정 버튼 배치 (기본 SEO 아코디언 카드 위로 올림) */}
            <div className="px-5 py-4 bg-zinc-950/40 border-b border-zinc-800 flex justify-center">
              <button
                type="button"
                onClick={handleOptimizeBodyText}
                disabled={isOptimizingBody || !apiKey}
                className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 rounded-xl transition-all shadow-md text-white text-xs font-black flex items-center justify-center gap-1.5"
              >
                {isOptimizingBody ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>AI 본문 SEO 교정 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>AI 본문 SEO 자동 교정</span>
                  </>
                )}
              </button>
            </div>

            <SeoCheckGroup
              title="기본 SEO"
              items={basicSeoItems}
              isOpen={openSeoGroups.basic}
              onToggle={() => toggleSeoGroup("basic")}
            />
            <SeoCheckGroup
              title="추가"
              items={additionalSeoItems}
              isOpen={openSeoGroups.additional}
              onToggle={() => toggleSeoGroup("additional")}
            />
            <SeoCheckGroup
              title="제목 가독성"
              items={titleReadabilityItems}
              isOpen={openSeoGroups.title}
              onToggle={() => toggleSeoGroup("title")}
            />
            <SeoCheckGroup
              title="콘텐츠 가독성"
              items={contentReadabilityItems}
              isOpen={openSeoGroups.content}
              onToggle={() => toggleSeoGroup("content")}
            />
          </div>
        )}
      </section>

      {/* 2단: Content Quality Guard */}
      <section className="border-t border-zinc-800">
        <button
          type="button"
          onClick={() => setIsContentQualityOpen((open) => !open)}
          className="flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#111827] to-[#0d1117] px-5 text-left transition hover:bg-blue-500/5"
        >
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
            Content Quality Guard
          </span>
          {isContentQualityOpen ? (
            <ChevronUp className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/70" />
          )}
        </button>

        {isContentQualityOpen && (
          <div className="animate-in fade-in duration-300">
            {(isRecreateMode || isDetailMode) && (
              <section className="space-y-4 border-b border-zinc-800 px-5 py-6">
                <h3 className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-[0.12em] text-emerald-400">
                  <BarChart3 size={14} /> Unique Content Guard
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
                    <span className="text-[13px] font-black text-zinc-500">
                      대기
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-zinc-200">콘텐츠 독창성</h4>
                    <p className="mt-0.5 text-[13px] font-medium text-zinc-500">외부 중복 검사 API 연동 후 실제 점수를 표시합니다.</p>
                  </div>
                </div>
              </section>
            )}

            <section className="space-y-4 border-b border-zinc-800 px-5 py-6">
              <h3 className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-[0.12em] text-amber-500">
                <ShieldCheck size={13} /> Content Integrity
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="px-1">
                  <span className="mb-1 block text-[13px] font-bold text-zinc-500">문맥 자연스러움</span>
                  <span className={`text-[13px] font-black ${isParagraphReadable ? "text-emerald-400" : "text-amber-400"}`}>
                    {isParagraphReadable ? "양호" : "점검 필요"}
                  </span>
                </div>
                <div className="px-1">
                  <span className="mb-1 block text-[13px] font-bold text-zinc-500">가독성 점수</span>
                  <span className={`text-[13px] font-black ${isContentReadable ? "text-emerald-400" : "text-amber-400"}`}>
                    {isContentReadable ? "양호" : "점검 필요"}
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-5 border-b border-zinc-800 px-5 py-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[13px] font-black text-zinc-200">
                  <Cpu size={14} className="text-emerald-400" /> Semantic Analysis
                </h3>
              </div>

              <div className="space-y-2.5">
                <span className="flex items-center gap-1 text-[13px] font-medium text-zinc-400">
                  <PieChart size={12} className="text-blue-400" />
                  {hasRealSemanticRatio ? "의미론적 단어 구성 비율" : "형태소 분석 연동 대기"}
                </span>
                <div className="flex h-3.5 w-full overflow-hidden rounded-full border border-zinc-900 bg-zinc-950">
                  {hasRealSemanticRatio ? (
                    <>
                      <div className="h-full bg-blue-500" style={{ width: `${posRatio.noun}%` }} />
                      <div className="h-full bg-emerald-500" style={{ width: `${posRatio.verb}%` }} />
                      <div className="h-full bg-zinc-700" style={{ width: `${posRatio.other}%` }} />
                    </>
                  ) : (
                    <div className="h-full w-full bg-zinc-900" />
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4 px-5 py-6">
              <h3 className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-[0.12em] text-emerald-400">
                <BarChart3 size={13} /> Crawlability Index
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-[13px] font-black text-emerald-400 ring-4 ring-emerald-500/10">
                  {effectiveCrawlabilityScore}%
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-zinc-200">엔진 수집 효율</h4>
                  <p className="text-[13px] font-medium text-zinc-500">제목, URL, 본문 길이, 내부 링크 기준의 추정 점수입니다.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
