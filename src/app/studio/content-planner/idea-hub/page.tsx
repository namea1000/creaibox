"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Lightbulb,
  Sparkles,
  Flame,
  Star,
  Grid3X3,
  ArrowRight,
  Dice5,
  PenLine,
  ChevronRight,
} from "lucide-react";

import { ideaHubSeries } from "@/lib/content-planner/topic-series";
import { topicCategories, topicSubTopics } from "@/lib/content-planner/topic-categories";

const categoryLabelMap: Record<string, string> = {
  "ai-tech": "AI & 기술",
  "economy-business": "경제 & 비즈니스",
  "crypto-blockchain": "가상자산 & 블록체인",
  "real-estate-property": "부동산",
  "travel-leisure": "여행",
  "sports-outdoor": "스포츠",
  "health-medical": "건강",
  "digital-platform": "디지털 플랫폼",
  "education-learning": "교육",
  "entertainment-culture": "엔터테인먼트",
  "finance-investment": "금융 & 투자",
  "business-management": "비즈니스 관리",
  "design-creative": "디자인 & 크리에이티브",
  "game-esports": "게임 & e스포츠",
  "environment-esg": "환경 & ESG",
  "law-policy": "법률 & 정책",
};

const categoryMapping: Record<string, string[]> = {
  "sports": ["sports", "sports-outdoor", "sports-automobile"],
  "travel": ["travel", "travel-leisure", "travel-place"],
  "food": ["food", "food-cooking", "food-cooking-health"],
  "health": ["health", "health-medical", "food-cooking-health"],
  "lifestyle": ["lifestyle", "lifestyle-culture", "hobbies-lifestyle", "family-life", "fashion-beauty-style", "home-hobby-diy", "parenting-family-life"],
  "pets": ["pets", "pets-lifestyle"],
  "education": ["education", "education-learning", "education-knowledge", "education-career"],
  "people": ["people", "people-biography"],
  "philosophy-humanities": ["philosophy-humanities", "religion-philosophy-humanities"],
  "religion-spirituality": ["religion-spirituality", "religion-philosophy-humanities"],
  "science": ["science", "science-future-tech", "nature-science-universe"],
  "nature-space": ["nature-space", "nature-science-universe"],
  "art-design": ["art-design", "design-creative"],
  "gaming": ["gaming", "game-esports"],
  "manufacturing-industry": ["manufacturing-industry", "industry-manufacturing"],
  "environment-esg": ["environment-esg"],
  "politics-society": ["politics-society", "society-global", "law-government-society"],
  "countries-regions": ["countries-regions", "society-global", "travel-place"],
  "law": ["law", "law-policy", "law-government-society"],
  "economy-finance": ["economy-finance", "finance-investing", "finance-investment", "economy-business"],
  "business": ["business", "business-management", "career-business", "economy-business"],
  "career": ["career", "career-business", "education-career"],
  "real-estate": ["real-estate", "real-estate-property"],
  "car": ["car", "sports-automobile"],
  "it-digital": ["it-digital", "digital-platform"],
  "ai-tech": ["ai-tech", "ai-business-future"],
  "cyber-security": ["cyber-security"],
  "data-analytics": ["data-analytics"],
  "company-brand": ["company-brand"],
  "shopping": ["shopping"],
  "history": ["history"],
  "government-welfare": ["government-welfare"],
  "military-security": ["military-security"]
};

function getCategoryMappedIds(id: string): string[] {
  return categoryMapping[id] || [id];
}

function getUiCategoryId(fileCategoryId: string): string {
  for (const [uiId, mapped] of Object.entries(categoryMapping)) {
    if (mapped.includes(fileCategoryId)) {
      return uiId;
    }
  }
  return fileCategoryId;
}

function formatLabel(value: string) {
  const uiId = getUiCategoryId(value);
  const cat = topicCategories.find((c) => c.id === uiId);
  if (cat) return cat.name;

  const sub = topicSubTopics.find((s) => s.id === value);
  if (sub) return sub.name;

  return categoryLabelMap[value] || value.replaceAll("-", " ");
}

function buildPlanningHref(item: {
  title: string;
  categoryId: string;
  subTopicId: string;
}) {
  const uiId = getUiCategoryId(item.categoryId);
  const cat = topicCategories.find((c) => c.id === uiId);
  const mainGroup = cat ? cat.group : "기술 & 디지털";

  const params = new URLSearchParams({
    mainKeywordTopic: item.title,
    largeCategory: mainGroup,
    detailedArea: formatLabel(item.categoryId),
    recommendedSeries: formatLabel(item.subTopicId),
  });

  return `/studio/content-planner/planning?${params.toString()}`;
}

export default function IdeaHubPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedMainGroup, setSelectedMainGroup] = useState("기술 & 디지털");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ai-tech");
  const [selectedSubTopicId, setSelectedSubTopicId] = useState("chatgpt");

  const mainGroups = [
    "기술 & 디지털",
    "경제 & 비즈니스",
    "생활 & 문화",
    "교육 & 지식",
    "사회 & 국제",
    "크리에이티브",
    "산업 & 미래",
  ];

  const handleSelectMainGroup = (group: string) => {
    setSelectedMainGroup(group);
    const firstCat = topicCategories.find((c) => c.group === group);
    if (firstCat) {
      setSelectedCategoryId(firstCat.id);
      const firstSub = topicSubTopics.find((sub) => sub.categoryId === firstCat.id);
      setSelectedSubTopicId(firstSub ? firstSub.id : "");
    } else {
      setSelectedCategoryId("");
      setSelectedSubTopicId("");
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const firstSub = topicSubTopics.find((sub) => sub.categoryId === catId);
    setSelectedSubTopicId(firstSub ? firstSub.id : "");
  };

  const getGroupIdeaCount = useCallback((groupName: string) => {
    const catIds = topicCategories
      .filter((c) => c.group === groupName)
      .flatMap((c) => getCategoryMappedIds(c.id));
    const catIdSet = new Set(catIds);
    return ideaHubSeries.filter((item) => catIdSet.has(item.categoryId)).length;
  }, []);

  const getCategoryIdeaCount = useCallback((categoryId: string) => {
    const mappedIds = new Set(getCategoryMappedIds(categoryId));
    return ideaHubSeries.filter((item) => mappedIds.has(item.categoryId)).length;
  }, []);

  const getSubTopicIdeaCount = useCallback((subTopicId: string) => {
    return ideaHubSeries.filter((item) => item.subTopicId === subTopicId).length;
  }, []);

  const subCategories = useMemo(() => {
    return topicCategories.filter((cat) => cat.group === selectedMainGroup);
  }, [selectedMainGroup]);

  const subTopics = useMemo(() => {
    return topicSubTopics.filter((sub) => sub.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const selectedSubTopicName = useMemo(() => {
    const sub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
    return sub ? sub.name : "추천 시리즈";
  }, [selectedSubTopicId]);

  const filteredSeries = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (normalized) {
      return ideaHubSeries.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.categoryId.toLowerCase().includes(normalized) ||
          item.subTopicId.toLowerCase().includes(normalized) ||
          item.description?.toLowerCase().includes(normalized)
        );
      });
    }

    if (selectedSubTopicId) {
      return ideaHubSeries.filter((item) => item.subTopicId === selectedSubTopicId);
    }

    const mappedIds = new Set(getCategoryMappedIds(selectedCategoryId));
    return ideaHubSeries.filter((item) => mappedIds.has(item.categoryId));
  }, [keyword, selectedCategoryId, selectedSubTopicId]);

  const featuredSeriesCount = useMemo(
    () => ideaHubSeries.filter((item) => item.featured).length,
    []
  );

  const popularSeries = useMemo(() => ideaHubSeries.slice(0, 5), []);
  const [randomSeries, setRandomSeries] = useState<typeof ideaHubSeries>([]);

  useEffect(() => {
    setRandomSeries([...ideaHubSeries].sort(() => 0.5 - Math.random()).slice(0, 5));
  }, []);

  const totalSubTopics = new Set(ideaHubSeries.map((item) => item.subTopicId)).size;

  return (
    <div className="min-h-full bg-[#06080d] px-4 py-6 text-zinc-100 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#111936] via-[#0b1020] to-[#05070c] p-6 shadow-2xl md:p-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-black text-violet-200">
              <Sparkles size={14} />
              아이디어가 곧 콘텐츠가 됩니다
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              콘텐츠 아이디어 <span className="text-cyan-300">허브</span>
            </h1>

            <p className="mt-3 text-sm font-bold text-zinc-400 md:text-base">
              {mainGroups.length}개 대주제 분류 · {topicCategories.length}개 세부 분야 · {ideaHubSeries.length.toLocaleString()}+ 콘텐츠 아이디어
            </p>

            <div className="mx-auto mt-5 flex max-w-2xl gap-2">
              <div className="relative flex-1">
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="관심있는 주제나 키워드를 검색하세요..."
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-4 pr-10 text-xs font-bold text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                )}
              </div>
              <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-xs font-black text-white hover:bg-violet-500 transition-colors">
                <Search size={15} />
                검색
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {[
            { label: "대주제 분류", value: `${mainGroups.length}`, icon: Grid3X3 },
            { label: "상세 분야", value: `${topicCategories.length}`, icon: Lightbulb },
            { label: "세부 아이디어", value: `${ideaHubSeries.length.toLocaleString()}+`, icon: Sparkles },
            { label: "추천 시리즈", value: `${featuredSeriesCount}+`, icon: Star },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 flex items-center gap-4"
              >
                <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-400">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{item.value}</p>
                  <p className="text-[10px] font-bold text-zinc-500">{item.label}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* 4-Column Core Interface Grouped */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
          
          {/* Columns 1-4: Unified Directory Container */}
          <div className="lg:col-span-10 flex flex-col rounded-3xl border border-violet-500/15 bg-gradient-to-br from-[#0e1329] via-[#090b16] to-[#04060d] p-5 shadow-2xl">
            {/* Header Tab Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3.5 mb-4 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <h2 className="text-sm font-black tracking-tight text-violet-200">콘텐츠 아이디어 디렉토리</h2>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold text-violet-300 border border-violet-500/20 w-fit">
                <span>실시간 연동형 아이디어 흐름</span>
              </div>
            </div>

            {/* Inner Directory Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-10 items-start flex-1">
              
              {/* Column 1: 대주제 분류 카테고리 (col-span-2) */}
              <div className="lg:col-span-2 lg:sticky lg:top-8">
                <div className="flex flex-col h-[650px] rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-4 shadow-xl">
                  <h3 className="text-xs font-black tracking-wider text-slate-500 uppercase mb-3 px-1.5 flex items-center gap-1.5">
                    <Grid3X3 size={13} className="text-cyan-400" />
                    대주제 분류
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {mainGroups.map((group) => {
                      const isSelected = selectedMainGroup === group;
                      const count = getGroupIdeaCount(group);
                      return (
                        <button
                          key={group}
                          onClick={() => handleSelectMainGroup(group)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition duration-200 border text-xs ${
                            isSelected
                              ? "border-cyan-400/25 bg-cyan-500/10 text-cyan-200 font-black"
                              : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                          }`}
                        >
                          <span className="truncate mr-1">{group}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                            isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-zinc-900 text-slate-600"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 2: 소분류 (col-span-2) */}
              <div className="lg:col-span-2 lg:sticky lg:top-8">
                <div className="flex flex-col h-[650px] rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-4 shadow-xl">
                  <h3 className="text-xs font-black tracking-wider text-slate-500 uppercase mb-3 px-1.5 flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-violet-400" />
                    상세 분야
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {subCategories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      const count = getCategoryIdeaCount(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition duration-200 border text-xs ${
                            isSelected
                              ? "border-violet-400/25 bg-violet-500/10 text-violet-200 font-black"
                              : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                          }`}
                        >
                          <span className="truncate flex items-center gap-2 mr-1">
                            <span className="shrink-0">{cat.emoji || "📁"}</span>
                            <span className="truncate">{cat.name}</span>
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                            isSelected ? "bg-violet-500/20 text-violet-300" : "bg-zinc-900 text-slate-600"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Column 3: 2차 상세 분야 (col-span-2) */}
              <div className="lg:col-span-2 lg:sticky lg:top-8">
                <div className="flex flex-col h-[650px] rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-4 shadow-xl">
                  <h3 className="text-xs font-black tracking-wider text-slate-500 uppercase mb-3 px-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-400" />
                    2차 상세 분야
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {subTopics.length === 0 ? (
                      <div className="text-center text-zinc-600 text-xs py-8 font-bold">
                        상세 분야가 없습니다.
                      </div>
                    ) : (
                      subTopics.map((sub) => {
                        const isSelected = selectedSubTopicId === sub.id;
                        const count = getSubTopicIdeaCount(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubTopicId(sub.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition duration-200 border text-xs ${
                              isSelected
                                ? "border-indigo-400/25 bg-indigo-500/10 text-indigo-200 font-black"
                                : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                            }`}
                          >
                            <span className="truncate mr-1">{sub.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                              isSelected ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-900 text-slate-600"
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Column 4: 추천 시리즈 리스트 (col-span-4) */}
              <div className="lg:col-span-4">
                <div className="flex flex-col min-h-[650px] rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-4 shadow-xl">
                  <h3 className="text-xs font-black tracking-wider text-slate-500 uppercase mb-3 px-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Flame size={13} className="text-orange-400 animate-pulse" />
                      {keyword ? "검색 결과" : selectedSubTopicName}
                    </span>
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                      {filteredSeries.length}개 시리즈
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {filteredSeries.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-xs text-slate-500">
                        추천 시리즈 기획안이 없습니다.
                      </div>
                    ) : (
                      filteredSeries.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/50 transition duration-200 flex flex-col justify-between gap-2 shadow-md"
                        >
                          <h4 className="text-xs font-black text-white leading-relaxed line-clamp-2">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] font-bold bg-zinc-950/60 text-slate-500 px-1.5 py-0.5 rounded border border-zinc-800/50">
                                {formatLabel(item.categoryId)}
                              </span>
                              <span className="text-[9px] font-bold bg-zinc-950/60 text-slate-500 px-1.5 py-0.5 rounded border border-zinc-800/50">
                                {formatLabel(item.subTopicId)}
                              </span>
                            </div>
                            <Link
                              href={buildPlanningHref(item)}
                              className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-2.5 text-[9px] font-black text-slate-950 transition duration-200 shadow-sm shrink-0"
                            >
                              이 주제로 기획
                              <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Column 5: 인기 / 랜덤 / 선택흐름 (col-span-2) */}
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <div className="flex flex-col space-y-4">
              
              {/* 실시간 인기 콘텐츠 */}
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-xl flex flex-col min-h-[200px]">
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1.5 px-0.5">
                  <Star className="text-amber-300 shrink-0" size={14} />
                  인기 콘텐츠
                </h3>
                <div className="space-y-1.5">
                  {popularSeries.map((item, index) => (
                    <Link
                      key={item.id}
                      href={buildPlanningHref(item)}
                      className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2.5 text-xs hover:border-violet-500/40 transition duration-150 group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate text-white group-hover:text-violet-300">
                          {index + 1}. {item.title}
                        </p>
                        <p className="mt-0.5 text-[9px] text-zinc-500 font-medium">
                          {formatLabel(item.categoryId)}
                        </p>
                      </div>
                      <ChevronRight size={13} className="text-zinc-600 shrink-0 ml-1.5 group-hover:text-violet-400" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* 랜덤 아이디어 생성 */}
              <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 shadow-xl flex flex-col min-h-[200px]">
                <h3 className="text-xs font-black tracking-wider text-violet-300 uppercase mb-2 flex items-center gap-1.5 px-0.5">
                  <Dice5 className="shrink-0" size={14} />
                  랜덤 아이디어
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold mb-3 leading-relaxed">
                  무작위로 추천되는 주제로 기획을 시작하세요.
                </p>
                <div className="space-y-1.5">
                  {randomSeries.map((item) => (
                    <Link
                      key={item.id}
                      href={buildPlanningHref(item)}
                      className="block rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2.5 text-xs font-bold text-slate-300 hover:border-violet-400/40 transition duration-150 truncate"
                    >
                      🎲 {item.title}
                    </Link>
                  ))}
                </div>
              </section>

              {/* 선택 흐름 */}
              <section className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4 shadow-xl shrink-0">
                <h3 className="text-xs font-black tracking-wider text-cyan-300 uppercase mb-3 flex items-center gap-1.5 px-0.5">
                  <PenLine className="shrink-0" size={14} />
                  선택 흐름
                </h3>
                <div className="space-y-2 text-[10px] font-bold text-zinc-400">
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <span className="h-5 w-5 rounded bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">1</span>
                    <span>대주제 카테고리 분류 선택</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <span className="h-5 w-5 rounded bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">2</span>
                    <span>1차 상세 분야 선택</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <span className="h-5 w-5 rounded bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">3</span>
                    <span>2차 상세 분야 선택</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <span className="h-5 w-5 rounded bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">4</span>
                    <span>시리즈 카드에서 [이 주제로 기획] 클릭</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <span className="h-5 w-5 rounded bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">5</span>
                    <span>AI 기획 조건 자동 연동 후 생성 실행</span>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>

        {/* Footer Banner */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-blue-600 to-violet-600 p-5 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">무한한 아이디어, 무한한 가능성</h2>
              <p className="mt-1 text-xs font-bold text-blue-100">
                마음에 드는 아이디어를 선택하고 바로 AI 콘텐츠 기획을 시작하세요.
              </p>
            </div>

            <Link
              href="/studio/content-planner/planning"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/15 px-5 text-xs font-black text-white hover:bg-white/25 transition duration-200"
            >
              지금 글쓰기 시작하기
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}