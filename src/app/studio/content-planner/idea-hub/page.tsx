"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
  ChevronRight,
} from "lucide-react";

import { ideaHubSeries } from "@/lib/content-planner/topic-series";
import { topicCategories, topicSubTopics } from "@/lib/content-planner/topic-categories";
import { fetchContentPlannerCampaigns } from "@/lib/content-planner/supabase";

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
  "military-security": ["military-security"],

  // 15 New categories mapping
  "startup-venture": ["startup-venture", "career-business"],
  "wellness-mindfulness": ["wellness-mindfulness", "hobbies-lifestyle"],
  "interior-homedecor": ["interior-homedecor", "home-hobby-diy"],
  "silver-life": ["silver-life", "family-life"],
  "fashion-beauty": ["fashion-beauty", "fashion-beauty-style"],
  "tax-strategy": ["tax-strategy", "law-policy"],
  "rights-remedy": ["rights-remedy", "law-policy"],
  "climate-eco-tech": ["climate-eco-tech", "environment-esg"],
  "space-industry": ["space-industry", "science-future-tech"],
  "video-production": ["video-production", "design-creative"],
  "content-planning": ["content-planning", "design-creative"],
  "music-audio": ["music-audio", "design-creative"],
  "creator-platform": ["creator-platform", "digital-platform"],
  "future-mobility": ["future-mobility", "industry-manufacturing"],
  "bio-healthcare": ["bio-healthcare", "health-medical"]
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

  const [createdCampaignKeywords, setCreatedCampaignKeywords] = useState<Set<string>>(new Set());

  const heroRef = useRef<HTMLElement>(null);
  const plannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!keyword.trim()) return;
      
      const target = event.target as Node;
      const clickedHero = heroRef.current?.contains(target);
      const clickedPlanner = plannerRef.current?.contains(target);

      if (!clickedHero && !clickedPlanner) {
        setKeyword("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [keyword]);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const { data } = await fetchContentPlannerCampaigns();
        if (data) {
          const keywords = new Set(data.map((c: { main_keyword?: string | null }) => c.main_keyword?.trim().toLowerCase() || ""));
          setCreatedCampaignKeywords(keywords);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    }
    void loadCampaigns();
  }, []);

  // Automatically select the matching subtopic/category when the keyword changes
  useEffect(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return;

    // Try to find an exact match first (e.g. "축구" matches "축구" subtopic name)
    let matchedSub = topicSubTopics.find(
      (sub) => sub.name.toLowerCase() === query
    );

    // If no exact match, try to find a partial match or a keywords match
    if (!matchedSub) {
      matchedSub = topicSubTopics.find(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          query.includes(sub.name.toLowerCase()) ||
          sub.keywords.some((kw) => {
            const kwLow = kw.toLowerCase();
            return kwLow === query || kwLow.includes(query) || query.includes(kwLow);
          })
      );
    }

    if (matchedSub) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSubTopicId(matchedSub.id);
      setSelectedCategoryId(matchedSub.categoryId);
      const cat = topicCategories.find((c) => c.id === matchedSub.categoryId);
      if (cat) {
        setSelectedMainGroup(cat.group);
      }
    }
  }, [keyword]);

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
    setKeyword("");
  };

  const handleSelectCategory = useCallback((catId: string, group: string) => {
    setSelectedCategoryId(catId);
    setSelectedMainGroup(group);
    const firstSub = topicSubTopics.find((sub) => sub.categoryId === catId);
    setSelectedSubTopicId(firstSub ? firstSub.id : "");
    setKeyword("");
  }, []);

  const getCategoryIdeaCount = useCallback((categoryId: string) => {
    const mappedIds = new Set(getCategoryMappedIds(categoryId));
    return ideaHubSeries.filter((item) => mappedIds.has(item.categoryId)).length;
  }, []);

  const getSubTopicIdeaCount = useCallback((subTopicId: string) => {
    return ideaHubSeries.filter((item) => item.subTopicId === subTopicId).length;
  }, []);

  const filteredSeries = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (normalized) {
      // If the keyword exactly or partially matches the selected subtopic's name or keywords, filter directly by that subtopic ID.
      // This avoids 0 results for subtopics with symbols/multiple words (e.g. "달리기 (러닝)", "스키 & 스노보드", "제미나이").
      const selectedSub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
      if (selectedSub && (
        normalized === selectedSub.name.trim().toLowerCase() ||
        selectedSub.name.trim().toLowerCase().includes(normalized) ||
        normalized.includes(selectedSub.name.trim().toLowerCase()) ||
        selectedSub.keywords.some((kw) => {
          const kwLow = kw.toLowerCase();
          return kwLow === normalized || kwLow.includes(normalized) || normalized.includes(kwLow);
        })
      )) {
        return ideaHubSeries.filter((item) => item.subTopicId === selectedSubTopicId);
      }

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

  const subTopics = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (normalized) {
      const selectedSub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
      // If the keyword exactly or partially matches the selected subtopic's name or keywords (user clicked or searched a subtopic),
      // show all subtopics of that subtopic's category.
      if (selectedSub && (
        normalized === selectedSub.name.trim().toLowerCase() ||
        selectedSub.name.trim().toLowerCase().includes(normalized) ||
        normalized.includes(selectedSub.name.trim().toLowerCase()) ||
        selectedSub.keywords.some((kw) => {
          const kwLow = kw.toLowerCase();
          return kwLow === normalized || kwLow.includes(normalized) || normalized.includes(kwLow);
        })
      )) {
        return topicSubTopics.filter((sub) => sub.categoryId === selectedSub.categoryId);
      }

      // Otherwise, filter subtopics by checking if they have matching ideas in the search results.
      const matchingSubTopicIds = new Set(filteredSeries.map((item) => item.subTopicId));
      return topicSubTopics.filter((sub) => matchingSubTopicIds.has(sub.id));
    }

    return topicSubTopics.filter((sub) => sub.categoryId === selectedCategoryId);
  }, [keyword, filteredSeries, selectedCategoryId, selectedSubTopicId]);

  const selectedSubTopicName = useMemo(() => {
    const sub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
    return sub ? sub.name : "추천 시리즈";
  }, [selectedSubTopicId]);

  const featuredSeriesCount = useMemo(
    () => ideaHubSeries.filter((item) => item.featured).length,
    []
  );

  const popularSeries = useMemo(() => ideaHubSeries.slice(0, 5), []);
  const [randomSeries, setRandomSeries] = useState<typeof ideaHubSeries>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRandomSeries([...ideaHubSeries].sort(() => 0.5 - Math.random()).slice(0, 5));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalSubTopics = new Set(ideaHubSeries.map((item) => item.subTopicId)).size;

  return (
    <div className="min-h-full bg-[#06080d] px-4 py-6 text-zinc-100 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Hero Banner with floating glowing effects */}
        <section ref={heroRef} className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#05070c] p-6 shadow-2xl md:p-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-4xl text-center z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-black text-violet-200">
              <Sparkles size={14} />
              아이디어가 곧 콘텐츠가 됩니다
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              콘텐츠 아이디어 <span className="text-cyan-300">허브</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm font-bold text-zinc-400">
              {mainGroups.length}개 대분류 · {topicCategories.length}개 상세 분야 · {totalSubTopics}개 추천 시리즈 · {ideaHubSeries.length.toLocaleString()}+ 메인 키워드 주제 · 오늘은 무엇을 기획할까요?
            </p>

            <div className="mx-auto mt-6 flex max-w-2xl gap-2">
              <div className="relative flex-1">
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="관심있는 주제나 키워드를 검색하세요..."
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-4 pr-10 text-xs font-bold text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400 focus:bg-zinc-950 transition duration-150"
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
              <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 text-xs font-black text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/15">
                <Search size={15} />
                검색
              </button>
            </div>

            {/* Quick Categories Navigation */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {topicCategories.filter(c => c.featured).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id, cat.group)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition duration-200 border ${
                    selectedCategoryId === cat.id
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg"
                      : "bg-zinc-900/60 border-zinc-800/80 text-slate-300 hover:border-zinc-700"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Stats Grid */}
        {keyword.trim() === "" && (
          <section className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {[
              { label: "대분류", value: `${mainGroups.length}`, icon: Grid3X3 },
              { label: "상세 분야", value: `${topicCategories.length}`, icon: Lightbulb },
              { label: "추천 시리즈", value: `${featuredSeriesCount}+`, icon: Star },
              { label: "메인 키워드 주제", value: `${ideaHubSeries.length.toLocaleString()}+`, icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center gap-4 hover:border-zinc-700/60 transition duration-150"
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
        )}

        {/* 실시간 인기 콘텐츠 */}
        {keyword.trim() === "" && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Flame className="text-orange-400 animate-pulse" size={18} />
              <h2 className="text-sm font-black text-white">실시간 인기 콘텐츠</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {popularSeries.map((item, index) => {
                const isPlanned = createdCampaignKeywords.has(item.title.trim().toLowerCase());
                const count = [23456, 18342, 15678, 14223, 12987][index] || 10230;
                return (
                  <div
                    key={item.id}
                    className="relative p-4 rounded-2xl border border-zinc-800 bg-[#0b0d14]/40 hover:border-zinc-700 transition duration-200 flex flex-col justify-between gap-4 min-h-[125px]"
                  >
                    <div className="absolute top-3 right-3 text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      {index + 1}위
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold">{formatLabel(item.categoryId)}</p>
                      <h3 className="mt-1 text-xs font-black text-white leading-relaxed line-clamp-2 pr-6">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-white/[0.04] pt-2.5">
                      <span className="text-[9px] text-zinc-500 font-medium">🔥 {count.toLocaleString()}명 기획</span>
                      <Link
                        href={buildPlanningHref(item)}
                        className={`text-[9px] font-bold px-2 py-1 rounded transition duration-150 ${
                          isPlanned
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                        }`}
                      >
                        {isPlanned ? "기획완료" : "기획하기"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 대분류 (10개) & 상세 분야 탐색 (50개) */}
        {keyword.trim() === "" && (
          <section className="space-y-5">
            <div className="flex flex-col px-1">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Grid3X3 className="text-cyan-400" size={18} />
                대분류 탐색 ({mainGroups.length}개)
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
                대분류를 선택하면 해당하는 상세 분야들이 하이라이트(라이트업) 됩니다.
              </p>
            </div>

            {/* 10 Large Categories Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {mainGroups.map((group) => {
                const isSelected = selectedMainGroup === group;
                const emojis: Record<string, string> = {
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
                const englishLabels: Record<string, string> = {
                  "기술 & 디지털": "Tech & Digital",
                  "경제 & 비즈니스": "Economy & Business",
                  "생활 & 문화": "Life & Culture",
                  "건강 & 라이프스타일": "Health & Lifestyle",
                  "교육 & 지식": "Education & Knowledge",
                  "사회 & 국제": "Society & Global",
                  "법률 & 정책 & 복지": "Law, Policy & Welfare",
                  "환경 & 지구과학": "Environment & Earth",
                  "크리에이티브 & 예술": "Creative & Art",
                  "산업 & 미래": "Industry & Future",
                };
                return (
                  <button
                    key={group}
                    onClick={() => handleSelectMainGroup(group)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-violet-600/90 border-violet-500 text-white shadow-lg shadow-violet-600/15"
                        : "bg-[#0b0d14]/40 border-zinc-800 text-white hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-xl mb-1.5">{emojis[group] || "📁"}</span>
                    <span className="text-xs font-black truncate w-full">{group}</span>
                    <span className={`text-xs font-black mt-1 truncate w-full ${isSelected ? "text-violet-200" : "text-zinc-500"}`}>
                      {englishLabels[group]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 상세 분야 탐색 (35개) Heading */}
            <div className="flex flex-col px-1 pt-2">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Lightbulb className="text-violet-400" size={18} />
                상세 분야 탐색 ({topicCategories.length}개)
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
                선택한 대분류에 속하는 분야들이 환하게 켜집니다. 클릭하면 아래 [클릭만 하면 바로 기획] 섹션에 추천 시리즈와 메인 키워드를 보실 수 있습니다.
              </p>
            </div>

            {/* 50 Category items Grid with highlight / dim animation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {topicCategories.map((cat) => {
                const isGroupActive = cat.group === selectedMainGroup;
                const isSelected = selectedCategoryId === cat.id;
                const ideaCount = getCategoryIdeaCount(cat.id);
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id, cat.group)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      isGroupActive
                        ? isSelected
                          ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 scale-[1.02] opacity-100 z-10"
                          : "border-violet-500 bg-violet-500/5 text-violet-200 opacity-100 shadow-sm"
                        : "border-zinc-800 bg-[#0b0d14]/40 hover:border-zinc-700 hover:bg-zinc-900/20 opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xl shrink-0 transition-transform duration-300 ${
                        isGroupActive ? "scale-110" : "scale-100"
                      }`}>{cat.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate text-white">
                          {cat.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 font-bold truncate mt-0.5">
                          {ideaCount.toLocaleString()}개 아이디어
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={13} className={`shrink-0 ml-1 transition-colors ${
                      isGroupActive ? "text-violet-400" : "text-zinc-500"
                    }`} />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 🎯 클릭만 하면 바로 작성 (Interactive Planner Section) */}
        <section id="interactive-planner" ref={plannerRef} className="space-y-3 scroll-mt-6">
          <div className="flex flex-col px-1">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="text-violet-400 animate-pulse" size={18} />
              클릭만 하면 바로 기획
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold mt-0.5">상세 분야와 추천 시리즈를 선택하면 메인 키워드 주제가 나타납니다</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* 1 & 2 통합: 추천 시리즈 및 상세 정보 (Col 1) */}
            <div className="lg:col-span-2 flex flex-col h-full rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-3 shadow-xl justify-between">
              
              {/* 추천 시리즈 영역 */}
              <div className="flex flex-col flex-1 min-h-0">
                <h3 className="text-xs font-black text-slate-400 uppercase pb-2 mb-2 px-1 flex items-center gap-1.5 shrink-0">
                  <Lightbulb size={13} className="text-violet-400" />
                  추천 시리즈
                </h3>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 pb-4 custom-scrollbar">
                  {subTopics.length === 0 ? (
                    <div className="text-center text-zinc-600 text-xs py-8 font-bold">
                      추천 시리즈가 없습니다.
                    </div>
                  ) : (
                    subTopics.map((sub) => {
                      const isSelected = selectedSubTopicId === sub.id;
                      const count = getSubTopicIdeaCount(sub.id);
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubTopicId(sub.id);
                            if (keyword.trim() !== "") {
                              setKeyword(sub.name);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition duration-200 border text-xs ${
                            isSelected
                              ? "border-violet-400/25 bg-violet-500/10 text-violet-200 font-black"
                              : "border-transparent text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="truncate mr-1">{sub.name}</span>
                          <span className={`text-[9px] px-1 py-0.5 rounded-full shrink-0 font-bold ${
                            isSelected ? "bg-violet-500/20 text-violet-300" : "bg-zinc-900 text-slate-600"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 시리즈 상세 정보 영역 */}
              <div className="mt-4 border-t border-white/[0.06] pt-3 shrink-0">
                <h4 className="text-xs font-black text-slate-400 pb-2 mb-2 px-1 flex items-center gap-1.5">
                  <span>ℹ️ 상세 정보</span>
                </h4>
                {selectedSubTopicId ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-lg shrink-0">
                        {topicCategories.find(c => c.id === selectedCategoryId)?.emoji || "💡"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white truncate">{selectedSubTopicName}</h4>
                        <p className="text-[9px] text-cyan-400 font-bold mt-0.5">{formatLabel(selectedCategoryId)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-bold line-clamp-2">
                        {topicSubTopics.find(s => s.id === selectedSubTopicId)?.description || 
                         `${selectedSubTopicName} 기획 아이디어를 확인하세요.`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 text-[9px] text-zinc-500 font-bold">
                      <div>아이디어: <span className="text-cyan-300 font-black">{filteredSeries.length}개</span></div>
                      <div>시리즈: <span className="text-violet-300 font-black">{topicSubTopics.find(s => s.id === selectedSubTopicId)?.ideaCount || 10}개</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-600 text-xs py-4 font-bold">
                    시리즈를 선택해주세요.
                  </div>
                )}
              </div>

            </div>

            {/* 3. 메인 키워드 주제 목록 (Col 2) */}
            <div className="lg:col-span-10 flex flex-col rounded-2xl border border-white/[0.04] bg-[#050711]/60 p-4 shadow-xl">
              <div className="flex items-center justify-between pb-2.5 mb-3 px-1.5">
                <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <Flame size={13} className="text-orange-400 animate-pulse" />
                  메인 키워드 주제
                </h3>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                  {keyword ? "검색 결과" : selectedSubTopicName} · {filteredSeries.length}개
                </span>
              </div>
              
              <div className="pr-1 pl-1 pb-2">
                {filteredSeries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-xs text-slate-500">
                    메인 키워드 주제 기획안이 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {filteredSeries.map((item, idx) => {
                      const isPlanned = createdCampaignKeywords.has(item.title.trim().toLowerCase());
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/60 transition duration-150 gap-2 shadow-sm h-10 min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-xs font-bold text-zinc-500 shrink-0 w-4">{idx + 1}</span>
                            <span className="text-xs font-black text-white truncate" title={item.title}>
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition duration-200 shrink-0 ${
                              isPlanned
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-zinc-950/40 border border-zinc-900 text-slate-600"
                            }`}>
                              {isPlanned ? "완료" : "대기"}
                            </span>
                            <Link
                              href={buildPlanningHref(item)}
                              className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-2 text-[9px] font-black text-slate-950 transition duration-150 shadow-sm"
                            >
                              기획
                              <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Three-Column Cards Grid */}
        {keyword.trim() === "" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* SEO 트래픽 높은 주제 */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 shadow-xl flex flex-col justify-between min-h-[260px]">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-1.5 px-0.5 border-b border-white/[0.04] pb-2">
                  <Star className="text-amber-300 shrink-0" size={14} />
                  SEO 트래픽 높은 주제
                </h3>
                <div className="space-y-1.5">
                  {popularSeries.map((item, index) => {
                    const vol = [1250000, 823000, 512000, 498000, 451000][index] || 320000;
                    return (
                      <Link
                        key={item.id}
                        href={buildPlanningHref(item)}
                        className="flex items-center justify-between rounded-xl border border-zinc-800/40 bg-zinc-950/40 p-2.5 text-xs hover:border-violet-500/40 transition duration-150 group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold truncate text-white group-hover:text-violet-300">
                            {index + 1}. {item.title}
                          </p>
                          <p className="mt-0.5 text-[9px] text-zinc-500 font-medium">
                            월 검색량: {vol.toLocaleString()}회
                          </p>
                        </div>
                        <ChevronRight size={13} className="text-zinc-600 shrink-0 ml-1.5 group-hover:text-violet-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 시리즈 콘텐츠 추천 */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 shadow-xl flex flex-col justify-between min-h-[260px]">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-1.5 px-0.5 border-b border-white/[0.04] pb-2">
                  <Sparkles className="text-cyan-300 shrink-0" size={14} />
                  시리즈 콘텐츠 추천
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularSeries.slice(0, 4).map((item, index) => {
                    const seriesTitle = [
                      "AI 비즈니스 마스터 시리즈",
                      "호주 유학 완전 정복",
                      "비트코인 투자 가이드",
                      "전기차 완벽 가이드"
                    ][index] || item.title;
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2.5 flex flex-col justify-between min-h-[95px]"
                      >
                        <p className="text-[10px] font-black text-white line-clamp-2 leading-relaxed">
                          {seriesTitle}
                        </p>
                        <Link
                          href={buildPlanningHref(item)}
                          className="mt-1 text-[8px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          시리즈 보기
                          <ChevronRight size={8} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 랜덤 아이디어 생성 */}
            <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 shadow-xl flex flex-col justify-between min-h-[260px]">
              <div>
                <h3 className="text-xs font-black text-violet-300 uppercase mb-2 flex items-center gap-1.5 px-0.5 border-b border-white/[0.04] pb-2">
                  <Dice5 className="shrink-0" size={14} />
                  랜덤 아이디어 생성
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold mb-4 leading-relaxed">
                  무작위로 추천되는 주제로 기획을 시작해 매력적인 기획안을 받아보세요!
                </p>
                <div className="space-y-1.5">
                  {randomSeries.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={buildPlanningHref(item)}
                      className="block rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-2 text-xs font-bold text-slate-300 hover:border-violet-400/40 transition duration-150 truncate"
                    >
                      🎲 {item.title}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setRandomSeries([...ideaHubSeries].sort(() => 0.5 - Math.random()).slice(0, 5));
                }}
                className="w-full mt-3 inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-violet-600 px-4 text-xs font-black text-white hover:bg-violet-500 transition-colors shadow-md"
              >
                새로운 아이디어 추천받기
              </button>
            </section>

          </div>
        )}

        {/* 오늘의 추천 콘텐츠 (Colored Border Cards Grid) */}
        {keyword.trim() === "" && (
          <section className="space-y-3">
            <div className="flex flex-col px-1">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Star className="text-amber-400 animate-pulse" size={18} />
                오늘의 추천 콘텐츠
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold mt-0.5">AI가 추천하는 오늘 가장 핫한 주제들</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {popularSeries.map((item, index) => {
                const borderColors = [
                  "border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5",
                  "border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/5",
                  "border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5",
                  "border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5",
                  "border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/5"
                ][index] || "border-zinc-800";
                
                const badgeColors = [
                  "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  "bg-rose-500/10 text-rose-400 border-rose-500/20"
                ][index] || "bg-zinc-800 text-zinc-400";
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border bg-zinc-950/20 transition duration-200 flex flex-col justify-between gap-4 min-h-[150px] ${borderColors}`}
                  >
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badgeColors}`}>
                        {formatLabel(item.categoryId)}
                      </span>
                      <h3 className="mt-2.5 text-xs font-black text-white leading-relaxed line-clamp-3">
                        {item.title}
                      </h3>
                    </div>
                    <Link
                      href={buildPlanningHref(item)}
                      className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-black text-zinc-300 transition duration-150 shadow-sm"
                    >
                      이 주제로 기획
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer Banner */}
        {keyword.trim() === "" && (
          <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-blue-600 to-violet-600 p-5 shadow-lg flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">무한한 아이디어, 무한한 가능성</h2>
              <p className="mt-1 text-xs font-bold text-blue-100">
                Creaibox와 함께라면 매일 새로운 콘텐츠 기획을 손쉽게 얻을 수 있습니다.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-white shrink-0">
                <div>
                  <span className="text-cyan-300 text-sm font-black">10</span> 대분류
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>
                  <span className="text-cyan-300 text-sm font-black">50</span> 상세 분야
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>
                  <span className="text-cyan-300 text-sm font-black">500+</span> 추천 시리즈
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>
                  <span className="text-cyan-300 text-sm font-black">10,000+</span> 콘텐츠 아이디어
                </div>
              </div>
              
              <Link
                href="/studio/content-planner/planning"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-black text-slate-900 hover:bg-slate-100 transition duration-200"
              >
                지금 기획 시작하기
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
