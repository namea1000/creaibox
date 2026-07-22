"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Lightbulb, Sparkles, ChevronDown, Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ContentType, ContentPlannerFormState } from "@/lib/content-planner/types";
import { topicCategories, topicSubTopics } from "@/lib/content-planner/topic-categories";
import { ideaHubSeries } from "@/lib/content-planner/topic-series";

const mainGroups = [
  "기술 & 디지털",
  "경제 & 비즈니스",
  "생활 & 문화",
  "건강 & 라이프스타일",
  "교육 & 지식",
  "사회 & 국제",
  "법률 & 정책 & 복지",
  "환경 & 지구과학",
  "크리에이티브 & 예술",
  "산업 & 미래",
];

const groupEmojis: Record<string, string> = {
  "기술 & 디지털": "💻",
  "경제 & 비즈니스": "💼",
  "생활 & 문화": "☕",
  "건강 & 라이프스타일": "🧘",
  "교육 & 지식": "🎓",
  "사회 & 국제": "🌏",
  "법률 & 정책 & 복지": "⚖️",
  "환경 & 지구과학": "🌱",
  "크리에이티브 & 예술": "🎨",
  "산업 & 미래": "🏭",
};

type Props = {
  contentTypes: ContentType[];
  itemCountOptions: number[];
  contentType: ContentType;
  itemCount: number;
  mainKeyword: string;
  referenceNote: string;
  onChangeContentType: (value: ContentType) => void;
  onChangeItemCount: (value: number) => void;
  onChangeMainKeyword: (value: string) => void;
  onChangeReferenceNote: (value: string) => void;

  postType: string;
  onChangePostType: (value: string) => void;

  selectedTone: string;
  onChangeSelectedTone: (value: string) => void;
  wordCountGoal: string;
  onChangeWordCountGoal: (value: string) => void;

  strategyLevel: ContentPlannerFormState["strategyLevel"];
  resultFormat: ContentPlannerFormState["resultFormat"];
  onChangeStrategyLevel: (value: ContentPlannerFormState["strategyLevel"]) => void;
  onChangeResultFormat: (value: ContentPlannerFormState["resultFormat"]) => void;
  onGenerate: () => void;
  isGenerating?: boolean;

  largeCategory?: string;
  onChangeLargeCategory?: (value: string) => void;
  mainTopic?: string;
  onChangeMainTopic?: (value: string) => void;
  subTopic?: string;
  onChangeSubTopic?: (value: string) => void;
};

const getContentTypeEmoji = (type: string) => {
  const map: Record<string, string> = {
    "멀티 플랫폼 콘텐츠 기획": "🌐",
    "블로그 글쓰기 콘텐츠": "📝",
    "유튜브 쇼츠 기획": "🎬",
    "유튜브 롱폼 기획": "🎥",
    "틱톡 숏폼 기획": "📱",
    "네이버 클립 기획": "📎",
    "인스타그램 릴스 기획": "📸",
    "SNS 카드뉴스 기획": "🖼️",
    "뉴스레터 기획": "✉️",
    "브랜드 캠페인 기획": "📢",
  };
  return map[type] || "✨";
};

const getItemCountEmoji = (count: number) => {
  const map: Record<number, string> = {
    5: "📄",
    10: "📑",
    20: "🗂️",
    30: "📊",
    50: "📦",
    100: "🚀",
  };
  return map[count] || "🔢";
};

const getStrategyLevelEmoji = (level: string) => {
  const map: Record<string, string> = {
    "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)": "⚡",
    "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)": "💎",
    "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)": "👑",
  };
  return map[level] || "⚙️";
};

const getResultFormatEmoji = (format: string) => {
  const map: Record<string, string> = {
    "기본 시리즈(키워드 연관 글감 병렬적 나열)": "📦",
    "기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상": "📢",
    "2번 + 발행 순서 및 최적의 배포 타이밍 구성": "📅",
  };
  return map[format] || "⚙️";
};

const postTypeOptions = [
  { label: "① 인사이트 & 트렌드", disabled: true },
  { label: "🤖 AI 자동 포스팅", disabled: false },
  { label: "🧠 AI 인사이트 포스팅", disabled: false },
  { label: "📈 트렌드 브리프", disabled: false },
  { label: "📊 시장/기술 분석 리포트", disabled: false },
  { label: "📰 최신 뉴스 및 이슈", disabled: false },
  { label: "📌 오늘의 주요 이슈 정리", disabled: false },

  { label: "② 정보성 콘텐츠", disabled: true },
  { label: "ℹ️ 일반 정보성", disabled: false },
  { label: "💵 생활 정책 및 정부 지원금", disabled: false },
  { label: "🥗 건강 정보 및 영양제 분석", disabled: false },
  { label: "💳 보험/대출/카드 정보", disabled: false },
  { label: "🏠 부동산 정보", disabled: false },

  { label: "③ 금융 & 비즈니스", disabled: true },
  { label: "💰 금융 및 재테크", disabled: false },
  { label: "📈 주식/재테크 분석", disabled: false },
  { label: "🏢 기업 정보 및 주식 정보", disabled: false },
  { label: "🚀 비즈니스/창업 정보", disabled: false },

  { label: "④ 브랜드 & 퍼블리싱", disabled: true },
  { label: "📖 브랜드 스토리 포스팅", disabled: false },
  { label: "📢 서비스 소개형 포스팅", disabled: false },
  { label: "🏢 기업 소개 및 서비스 안내", disabled: false },
  { label: "✉️ 뉴스레터형 콘텐츠", disabled: false },

  { label: "⑤ 도구 & 사용법", disabled: true },
  { label: "📱 앱 설치 및 상세 가이드", disabled: false },
  { label: "🤖 AI 툴 및 웹 서비스 가이드", disabled: false },
  { label: "⚙️ 유틸리티 설치/사용 방법", disabled: false },
  { label: "🔗 바로가기 버튼 생성", disabled: false },

  { label: "⑥ 실무형 가이드", disabled: true },
  { label: "📘 실전 가이드 아티클", disabled: false },
  { label: "🔍 SEO 최적화 포스팅", disabled: false },
  { label: "🔄 튜토리얼 & 워크플로우", disabled: false },
  { label: "✅ 체크리스트형 콘텐츠", disabled: false },
  { label: "⚖️ 비교 분석형 콘텐츠", disabled: false },
  { label: "🧩 문제 해결형 콘텐츠", disabled: false },

  { label: "⑦ 리뷰 & 라이프스타일", disabled: true },
  { label: "📦 일반 제품 리뷰", disabled: false },
  { label: "⚖️ 제품 비교 리뷰", disabled: false },
  { label: "💻 IT 기기 사용 후기", disabled: false },
  { label: "🚗 자동차 모델 리뷰", disabled: false },
  { label: "🎮 게임 리뷰 및 공략", disabled: false },
  { label: "🍳 맛집 리뷰", disabled: false },
  { label: "✈️ 국내 여행 정보", disabled: false },
  { label: "🎬 영화/드라마 정보 및 리뷰", disabled: false },
  { label: "🌟 유명 연예인 인물 정보", disabled: false },

  { label: "⑧ 교육 & 자기계발", disabled: true },
  { label: "🎓 교육/가이드형", disabled: false },
  { label: "🌱 자기계발 포스팅", disabled: false },
  { label: "📚 공부법/학습법", disabled: false },
  { label: "🏫 강의/커리큘럼 소개", disabled: false },
];

export default function ContentConditionPanel({
  contentTypes,
  itemCountOptions,
  contentType,
  itemCount,
  mainKeyword,
  referenceNote,
  onChangeContentType,
  onChangeItemCount,
  onChangeMainKeyword,
  onChangeReferenceNote,
  postType,
  onChangePostType,
  selectedTone,
  onChangeSelectedTone,
  wordCountGoal,
  onChangeWordCountGoal,
  strategyLevel,
  resultFormat,
  onChangeStrategyLevel,
  onChangeResultFormat,
  onGenerate,
  isGenerating = false,
  largeCategory = "",
  onChangeLargeCategory,
  mainTopic = "",
  onChangeMainTopic,
  subTopic = "",
  onChangeSubTopic,
}: Props) {
  const [isPostTypeOpen, setIsPostTypeOpen] = useState(false);
  const postTypeDropdownRef = useRef<HTMLDivElement>(null);
  const [isCustomSubTopic, setIsCustomSubTopic] = useState(false);
  const [isCustomKeyword, setIsCustomKeyword] = useState(false);

  // 🌟 콘텐츠 아이디어 허브 통합 검색 및 모달 상태
  const [ideaSearchQuery, setIdeaSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isIdeaHubModalOpen, setIsIdeaHubModalOpen] = useState(false);
  const [modalGroupFilter, setModalGroupFilter] = useState("ALL");
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (postTypeDropdownRef.current && !postTypeDropdownRef.current.contains(event.target as Node)) {
        setIsPostTypeOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectIdeaItem = (item: {
    largeGroup: string;
    categoryName: string;
    subTopicName: string;
    title: string;
  }) => {
    setIsCustomSubTopic(false);
    setIsCustomKeyword(false);
    onChangeLargeCategory?.(item.largeGroup);
    onChangeMainTopic?.(item.categoryName);
    onChangeSubTopic?.(item.subTopicName);
    onChangeMainKeyword(item.title);
    setIdeaSearchQuery("");
    setIsSearchDropdownOpen(false);
    setIsIdeaHubModalOpen(false);
  };

  const searchResults = useMemo(() => {
    const query = ideaSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: Array<{
      id: string;
      title: string;
      subTopicName: string;
      categoryName: string;
      largeGroup: string;
      emoji: string;
    }> = [];

    for (const idea of ideaHubSeries) {
      if (
        idea.title.toLowerCase().includes(query) ||
        (idea.tags && idea.tags.some((t) => t.toLowerCase().includes(query)))
      ) {
        const sub = topicSubTopics.find((s) => s.id === idea.subTopicId);
        const cat = topicCategories.find((c) => c.id === (sub?.categoryId || idea.categoryId));
        if (cat) {
          results.push({
            id: idea.id,
            title: idea.title,
            subTopicName: sub?.name || "",
            categoryName: cat.name,
            largeGroup: cat.group,
            emoji: cat.emoji || "✨",
          });
        }
        if (results.length >= 25) break;
      }
    }

    if (results.length < 15) {
      for (const sub of topicSubTopics) {
        if (
          sub.name.toLowerCase().includes(query) ||
          (sub.keywords && sub.keywords.some((k) => k.toLowerCase().includes(query)))
        ) {
          const cat = topicCategories.find((c) => c.id === sub.categoryId);
          if (cat) {
            const idea = ideaHubSeries.find((i) => i.subTopicId === sub.id);
            const title = idea ? idea.title : sub.name;
            if (!results.some((r) => r.title === title)) {
              results.push({
                id: sub.id,
                title,
                subTopicName: sub.name,
                categoryName: cat.name,
                largeGroup: cat.group,
                emoji: cat.emoji || "⚡",
              });
            }
          }
          if (results.length >= 25) break;
        }
      }
    }

    return results;
  }, [ideaSearchQuery]);

  const modalFilteredResults = useMemo(() => {
    const query = modalSearchQuery.trim().toLowerCase();
    const list: Array<{
      id: string;
      title: string;
      subTopicName: string;
      categoryName: string;
      largeGroup: string;
      emoji: string;
    }> = [];

    for (const idea of ideaHubSeries) {
      const sub = topicSubTopics.find((s) => s.id === idea.subTopicId);
      const cat = topicCategories.find((c) => c.id === (sub?.categoryId || idea.categoryId));
      if (!cat) continue;

      if (modalGroupFilter !== "ALL" && cat.group !== modalGroupFilter) {
        continue;
      }

      if (
        !query ||
        idea.title.toLowerCase().includes(query) ||
        sub?.name.toLowerCase().includes(query) ||
        cat.name.toLowerCase().includes(query) ||
        (idea.tags && idea.tags.some((t) => t.toLowerCase().includes(query)))
      ) {
        list.push({
          id: idea.id,
          title: idea.title,
          subTopicName: sub?.name || "",
          categoryName: cat.name,
          largeGroup: cat.group,
          emoji: cat.emoji || "✨",
        });
      }
      if (list.length >= 60) break;
    }

    return list;
  }, [modalGroupFilter, modalSearchQuery]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <Lightbulb size={18} />
        </div>
        <h2 className="text-sm font-black text-white">콘텐츠 생성 조건</h2>
      </div>

      <div className="space-y-3">
        {/* 1. 콘텐츠 유형 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">콘텐츠 유형</span>
          <select
            value={contentType}
            onChange={(e) => onChangeContentType(e.target.value as ContentType)}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400"
          >
            {contentTypes.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getContentTypeEmoji(item)} {item}
              </option>
            ))}
          </select>
        </label>

        {/* 2. 포스트 타입 - Custom Premium Dropdown */}
        <div className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400 font-extrabold text-cyan-200">포스트 타입</span>
          <div className="relative w-full" ref={postTypeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsPostTypeOpen(!isPostTypeOpen)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 font-bold"
            >
              <span className="truncate">{postType || "선택해 주세요"}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isPostTypeOpen ? "rotate-180" : ""}`} />
            </button>

            {isPostTypeOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0e1322] p-2 shadow-2xl backdrop-blur-md custom-scrollbar">
                {postTypeOptions.map((item) => {
                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        className="px-3 py-2 text-xs font-black text-cyan-300 border-b border-white/5 mt-3 first:mt-0 bg-white/[0.03] rounded-md"
                      >
                        {item.label}
                      </div>
                    );
                  }

                  const isSelected = postType === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onChangePostType(item.label);
                        setIsPostTypeOpen(false);
                      }}
                      className={`flex w-full items-center px-4 py-2.5 text-left text-xs transition duration-150 rounded-lg mt-0.5 first:mt-0 ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-200 font-bold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 말투 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">말투</span>
          <select
            value={selectedTone}
            onChange={(e) => onChangeSelectedTone(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 font-bold"
          >
            {[
              "💻 전문적이고 통찰력 있는 분석 (기술 블로그)",
              "✍️ 친근하고 명확한 실무 설명 (가이드형 포스팅)",
              "📢 브랜드 중심의 신뢰형 설명 (서비스 소개형)",
              "📈 인사이트 리포트형 톤 (트렌드 분석)",
              "✉️ 가볍고 설득력 있는 뉴스레터형 톤",
            ].map((tone) => (
              <option key={tone} value={tone} className="bg-slate-950">
                {tone}
              </option>
            ))}
          </select>
        </label>

        {/* 길이 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">길이</span>
          <select
            value={wordCountGoal}
            onChange={(e) => onChangeWordCountGoal(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 font-bold"
          >
            {[
              { value: "800", label: "📰 짧게 (약 800자)" },
              { value: "1500", label: "✍️ 보통 (약 1,500자)" },
              { value: "3000", label: "🚀 길게 (약 3,000자)" },
              { value: "5000", label: "📚 아주 길게 (약 5,000자)" },
              { value: "8000", label: "💰 초장문 (약 8,000자)" },
            ].map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-950">
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* 3. 생성 개수 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">생성 개수</span>
          <select
            value={itemCount}
            onChange={(e) => onChangeItemCount(Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400"
          >
            {itemCountOptions.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getItemCountEmoji(item)} {item}개 기획
              </option>
            ))}
          </select>
        </label>

        {/* 4. 전략 수준 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">전략 수준</span>
          <select
            value={strategyLevel}
            onChange={(e) => onChangeStrategyLevel(e.target.value as ContentPlannerFormState["strategyLevel"])}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400"
          >
            {[
              "1. 기본 전략(대중적이고 상식적 수준의 정보성 글)",
              "2. 고급 전략(검색 엔진 최적화 및 사용자 타겟 분석)",
              "3. 전문가 전략(가장 고도화된 심층적 마케팅 구조 설계)",
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getStrategyLevelEmoji(item)} {item}
              </option>
            ))}
          </select>
        </label>

        {/* 5. 결과 구성 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">결과 구성</span>
          <select
            value={resultFormat}
            onChange={(e) => onChangeResultFormat(e.target.value as ContentPlannerFormState["resultFormat"])}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400"
          >
            {[
              "1. 기본 시리즈(키워드 연관 글감 병렬적 나열)",
              "2. 기본 시리즈 + 배포 플랫폼별 적합성 키워드 향상",
              "3. 2번 + 발행 순서 및 최적의 배포 타이밍 구성",
            ].map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {getResultFormatEmoji(item)} {item}
              </option>
            ))}
          </select>
        </label>

        {/* 🔍 콘텐츠 아이디어 / 키워드 통합 검색 바 */}
        <div className="relative mb-2 flex flex-col gap-1.5 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-black text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              아이디어 Hub 키워드 검색
            </span>
            <button
              type="button"
              onClick={() => setIsIdeaHubModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-black text-cyan-300 hover:text-white transition bg-cyan-500/20 hover:bg-cyan-500/40 px-2.5 py-1 rounded-lg border border-cyan-500/30 cursor-pointer shadow-sm"
            >
              <Lightbulb className="h-3 w-3 text-amber-300 animate-pulse" />
              아이디어 허브 팝업
            </button>
          </div>

          <div className="relative flex items-center w-full mt-1">
            <Search className="absolute left-3 h-3.5 w-3.5 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={ideaSearchQuery}
              onChange={(e) => {
                setIdeaSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="주제/키워드 검색 (예: 삼성전자, AI, 부업...)"
              className="w-full bg-[#11141c] border border-cyan-500/30 text-white text-xs pl-8 pr-7 py-2 rounded-xl font-bold focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
            />
            {ideaSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setIdeaSearchQuery("");
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* 드롭다운 실시간 연관 검색 결과 */}
          {isSearchDropdownOpen && ideaSearchQuery.trim() !== "" && (
            <div
              ref={searchDropdownRef}
              className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto rounded-xl border border-cyan-500/40 bg-[#0d1017] shadow-2xl p-1.5 custom-scrollbar"
            >
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs font-semibold text-zinc-400">
                  검색 결과가 없습니다. (직접 입력 가능)
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIdeaItem(item)}
                    className="w-full text-left p-2 rounded-lg hover:bg-cyan-600/20 transition flex flex-col gap-0.5 border-b border-zinc-800/40 last:border-0 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-black text-white group-hover:text-cyan-200">
                      <span>{item.emoji}</span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 group-hover:text-cyan-300">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">{item.largeGroup}</span>
                      <span>›</span>
                      <span>{item.categoryName}</span>
                      <span>›</span>
                      <span className="truncate">{item.subTopicName}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 대분류 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">대분류</span>
          <select
            value={largeCategory}
            onChange={(e) => {
              const newGroup = e.target.value;
              onChangeLargeCategory?.(newGroup);
              setIsCustomSubTopic(false);
              setIsCustomKeyword(false);

              // Find the first category in the new group to auto-select
              const firstCat = topicCategories.find((c) => c.group === newGroup);
              if (firstCat) {
                onChangeMainTopic?.(firstCat.name);

                // Find first subtopic
                const firstSub = topicSubTopics.find((s) => s.categoryId === firstCat.id);
                if (firstSub) {
                  onChangeSubTopic?.(firstSub.name);
                  // Find first idea
                  const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                  onChangeMainKeyword?.(firstIdea ? firstIdea.title : "");
                } else {
                  onChangeSubTopic?.("");
                  onChangeMainKeyword?.("");
                }
              } else {
                onChangeMainTopic?.("");
                onChangeSubTopic?.("");
                onChangeMainKeyword?.("");
              }
            }}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400"
          >
            <option value="" className="bg-slate-950">대분류 선택</option>
            {mainGroups.map((group) => (
              <option key={group} value={group} className="bg-slate-950">
                {groupEmojis[group] || "📁"} {group}
              </option>
            ))}
          </select>
        </label>

        {/* 상세 분야 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">상세 분야</span>
          <select
            value={mainTopic}
            onChange={(e) => {
              const newTopicName = e.target.value;
              onChangeMainTopic?.(newTopicName);
              setIsCustomSubTopic(false);
              setIsCustomKeyword(false);

              const cat = topicCategories.find((c) => c.name === newTopicName);
              if (cat) {
                const firstSub = topicSubTopics.find((s) => s.categoryId === cat.id);
                if (firstSub) {
                  onChangeSubTopic?.(firstSub.name);
                  const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                  onChangeMainKeyword?.(firstIdea ? firstIdea.title : "");
                } else {
                  onChangeSubTopic?.("");
                  onChangeMainKeyword?.("");
                }
              } else {
                onChangeSubTopic?.("");
                onChangeMainKeyword?.("");
              }
            }}
            disabled={!largeCategory}
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-950">
              {largeCategory ? "상세 분야 선택" : "대분류를 먼저 선택해 주세요"}
            </option>
            {topicCategories
              .filter((cat) => cat.group === largeCategory)
              .map((cat) => (
                <option key={cat.id} value={cat.name} className="bg-slate-950">
                  {cat.emoji} {cat.name}
                </option>
              ))}
          </select>
        </label>

        {/* 추천 시리즈 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400">추천 시리즈</span>
          {(() => {
            const currentCategory = topicCategories.find((c) => c.name === mainTopic);
            const filteredSubTopics = currentCategory
              ? topicSubTopics.filter((sub) => sub.categoryId === currentCategory.id)
              : [];

            const isPresetSubTopic = filteredSubTopics.some((sub) => sub.name === subTopic);
            const showCustomSubTopic = isCustomSubTopic || (subTopic !== "" && !isPresetSubTopic);

            if (showCustomSubTopic) {
              return (
                <div className="relative flex items-center w-full">
                  <input
                    value={subTopic}
                    onChange={(e) => {
                      onChangeSubTopic?.(e.target.value);
                      onChangeMainKeyword?.("");
                    }}
                    placeholder="추천 시리즈 직접 입력"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-4 pr-16 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubTopic(false);
                      const firstSub = filteredSubTopics[0];
                      if (firstSub) {
                        onChangeSubTopic?.(firstSub.name);
                        const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === firstSub.id);
                        onChangeMainKeyword?.(firstIdea ? firstIdea.title : "");
                      } else {
                        onChangeSubTopic?.("");
                        onChangeMainKeyword?.("");
                      }
                    }}
                    className="absolute right-3 text-cyan-400 hover:text-cyan-300 text-xs font-bold"
                  >
                    목록 선택
                  </button>
                </div>
              );
            }

            return (
              <select
                value={subTopic}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__custom__") {
                    setIsCustomSubTopic(true);
                    onChangeSubTopic?.("");
                    onChangeMainKeyword?.("");
                  } else {
                    onChangeSubTopic?.(val);
                    const sub = topicSubTopics.find((s) => s.name === val);
                    if (sub) {
                      const firstIdea = ideaHubSeries.find((idea) => idea.subTopicId === sub.id);
                      onChangeMainKeyword?.(firstIdea ? firstIdea.title : "");
                    } else {
                      onChangeMainKeyword?.("");
                    }
                  }
                }}
                disabled={!mainTopic}
                className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-950">
                  {mainTopic ? "추천 시리즈 선택" : "상세 분야를 먼저 선택해 주세요"}
                </option>
                {filteredSubTopics.map((sub) => (
                  <option key={sub.id} value={sub.name} className="bg-slate-950">
                    ⚡ {sub.name}
                  </option>
                ))}
                {mainTopic && (
                  <option value="__custom__" className="bg-slate-950">
                    📝 직접 입력...
                  </option>
                )}
              </select>
            );
          })()}
        </label>

        {/* 메인 키워드 주제 */}
        <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-bold text-slate-400 font-extrabold text-cyan-200">메인 키워드 주제</span>
          {(() => {
            const currentSubTopic = topicSubTopics.find((s) => s.name === subTopic);
            const filteredIdeas = currentSubTopic
              ? ideaHubSeries.filter((idea) => idea.subTopicId === currentSubTopic.id)
              : [];

            const isPresetKeyword = filteredIdeas.some((idea) => idea.title === mainKeyword);
            const showCustomInput = isCustomKeyword || (mainKeyword !== "" && !isPresetKeyword);

            if (showCustomInput) {
              return (
                <div className="relative flex items-center w-full">
                  <input
                    value={mainKeyword}
                    onChange={(e) => onChangeMainKeyword(e.target.value)}
                    placeholder="예: AI 콘텐츠 자동화"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-4 pr-16 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomKeyword(false);
                      const firstIdea = filteredIdeas[0];
                      onChangeMainKeyword(firstIdea ? firstIdea.title : "");
                    }}
                    className="absolute right-3 text-cyan-400 hover:text-cyan-300 text-xs font-bold"
                  >
                    목록 선택
                  </button>
                </div>
              );
            }

            return (
              <select
                value={mainKeyword}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__custom__") {
                    setIsCustomKeyword(true);
                    onChangeMainKeyword("");
                  } else {
                    onChangeMainKeyword(val);
                  }
                }}
                disabled={!subTopic}
                className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white outline-none focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                <option value="" className="bg-slate-950">
                  {subTopic ? "메인 키워드 주제 선택" : "추천 시리즈를 먼저 선택해 주세요"}
                </option>
                {subTopic && (
                  <option value="__custom__" className="bg-slate-950">
                    📝 직접 입력...
                  </option>
                )}
                {filteredIdeas.map((idea) => (
                  <option key={idea.id} value={idea.title} className="bg-slate-950">
                    ✨ {idea.title}
                  </option>
                ))}
              </select>
            );
          })()}
        </label>

        <textarea
          value={referenceNote}
          onChange={(e) => onChangeReferenceNote(e.target.value)}
          placeholder="선택 입력: 기획 방향, 브랜드 톤, 타깃 독자, 원하는 콘텐츠 스타일..."
          rows={4}
          className="min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
        />

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-xs font-black text-slate-950 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              AI 콘텐츠 기획
            </>
          )}
        </button>
      </div>

      {/* 💡 콘텐츠 아이디어 허브 대형 팝업 모달 */}
      {isIdeaHubModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto text-white">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-cyan-500/40 bg-[#0d1017] shadow-2xl text-white overflow-hidden">
            
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#161a27] to-[#10141f] px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20">
                  <Lightbulb className="h-5 w-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    콘텐츠 아이디어 허브
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold">
                      10개 대분류 · 55개 분야 · 2,189+ 시리즈
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    원하시는 키워드나 시리즈를 검색/탐색 후 [이 주제 적용] 버튼을 누르면 기획 폼에 자동으로 세팅됩니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIdeaHubModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 모달 검색바 및 카테고리 필터 */}
            <div className="p-5 border-b border-zinc-800 bg-[#0f131d] space-y-3 shrink-0">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-4 h-4 w-4 text-cyan-400 pointer-events-none" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="관심있는 주제, 키워드, 시리즈를 검색하세요 (예: 삼성전자, AI, 부업, 주식, 영양제...)"
                  className="w-full bg-[#161a24] border border-cyan-500/30 text-white text-xs pl-11 pr-10 py-3 rounded-2xl font-bold focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500 shadow-inner"
                />
                {modalSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setModalSearchQuery("")}
                    className="absolute right-3.5 text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 카테고리 그룹 필터 버튼 */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setModalGroupFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                    modalGroupFilter === "ALL"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                      : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  🔥 전체 (All)
                </button>
                {mainGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setModalGroupFilter(group)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                      modalGroupFilter === group
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                        : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {groupEmojis[group] || "📁"} {group}
                  </button>
                ))}
              </div>
            </div>

            {/* 모달 바디: 카드 Grid 목록 */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0d13]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modalFilteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#121622] p-4 transition hover:border-cyan-500/50 hover:bg-[#161c2c] hover:shadow-xl cursor-pointer"
                    onClick={() => handleSelectIdeaItem(item)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-500/20">
                          {item.emoji} {item.largeGroup}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500">
                          {item.categoryName}
                        </span>
                      </div>
                      
                      <h3 className="text-xs font-black text-white group-hover:text-cyan-200 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-[11px] font-medium text-zinc-400 line-clamp-1">
                        ⚡ 시리즈: {item.subTopicName}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                        클릭시 즉시 세팅
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectIdeaItem(item);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-3 py-1.5 text-xs font-black transition cursor-pointer shadow-md shadow-cyan-400/20"
                      >
                        <span>이 주제 적용</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalFilteredResults.length === 0 && (
                <div className="py-16 text-center text-zinc-500 text-xs font-semibold">
                  검색 결과와 일치하는 키워드가 없습니다. 다른 검색어를 입력해 보세요.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}