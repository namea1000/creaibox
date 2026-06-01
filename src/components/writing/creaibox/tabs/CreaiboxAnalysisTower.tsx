"use client";

import React, { useState } from 'react';
import { 
  FileText, Check, AlertCircle, ShieldCheck, Cpu, PieChart, 
  BarChart3, CheckCircle2, ChevronDown, ChevronUp, HelpCircle 
} from 'lucide-react';

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
        className="flex h-11 w-full items-center justify-between text-left transition hover:bg-white/[0.03]"
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
        <div className="space-y-3 pb-5 pt-2">
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
  isRecreateMode = false, similarityScore = 100, isDetailMode = false
}: CreaiboxAnalysisTowerProps) {
  const [isSeoOptimizerOpen, setIsSeoOptimizerOpen] = useState(true);
  const [openSeoGroups, setOpenSeoGroups] = useState<Record<SeoGroupKey, boolean>>({
    basic: true,
    additional: true,
    title: true,
    content: true,
  });

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
          className="flex h-12 w-full items-center justify-between text-left transition hover:bg-white/[0.03]"
        >
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-blue-400">
            <FileText size={13} /> Cre Rank Math SEO Optimizer
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

      {/* 2단: Unique Content Guard */}
      {(isRecreateMode || isDetailMode) && (
        <section className="space-y-4 border-t border-zinc-800 py-6 animate-in fade-in duration-300">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <BarChart3 size={14} /> Unique Content Guard
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
              <span className={`text-sm font-black ${similarityScore < 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                {similarityScore}%
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200">콘텐츠 독창성</h4>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Google이 선호하는 중복 없는 유니크한 원고 점수</p>
            </div>
          </div>
        </section>
      )}

      {/* 3단: Content Quality Integrity */}
      <section className="space-y-4 border-t border-zinc-800 py-6">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
          <ShieldCheck size={13} /> Content Integrity
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="px-1">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">문맥 자연스러움</span>
            <span className="text-xs font-black text-emerald-400">Human-Like</span>
          </div>
          <div className="px-1">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">가독성 점수</span>
            <span className="text-xs font-black text-emerald-400">High Score</span>
          </div>
        </div>
      </section>

      {/* 4단: 형태소 및 의미 분석 */}
      <section className="space-y-5 border-t border-zinc-800 py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" /> Semantic Analysis
          </h3>
        </div>
        
        <div className="space-y-2.5">
          <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
            <PieChart size={12} className="text-blue-400" /> 의미론적 단어 구성 비율
          </span>
          <div className="w-full h-3.5 rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-900">
            <div className="bg-blue-500 h-full" style={{ width: `${posRatio.noun}%` }} />
            <div className="bg-emerald-500 h-full" style={{ width: `${posRatio.verb}%` }} />
            <div className="bg-zinc-700 h-full" style={{ width: `${posRatio.other}%` }} />
          </div>
        </div>
      </section>

      {/* 5단: Crawlability Score */}
      <section className="space-y-4 border-t border-zinc-800 py-6">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
          <BarChart3 size={13} /> Crawlability Index
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
            {crawlabilityScore}%
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">엔진 수집 효율</h4>
            <p className="text-[10px] text-zinc-500 font-medium">검색엔진 로봇이 읽기 가장 좋은 구조인가?</p>
          </div>
        </div>
      </section>
    </div>
  );
}
