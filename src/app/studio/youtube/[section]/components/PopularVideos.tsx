"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, Loader2, Play, Eye, ThumbsUp, Calendar, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, BarChart2, ExternalLink, Sparkles, Filter, Search, X, RotateCw, PlaySquare } from "lucide-react";
import VideoAnalysisModal from "./VideoAnalysisModal";
import Link from "next/link";

interface CountryItem {
  code: string;
  name: string;
  flag: string;
  region: "top" | "asia" | "southeast_asia" | "europe" | "north_america" | "latin_america" | "middle_east_africa" | "oceania";
  isTop?: boolean;
}

export const ALL_COUNTRIES: CountryItem[] = [
  // 🇰🇷 동아시아 / 아시아 (9개국)
  { code: "KR", name: "대한민국", flag: "🇰🇷", region: "asia", isTop: true },
  { code: "JP", name: "일본", flag: "🇯🇵", region: "asia", isTop: true },
  { code: "TW", name: "대만", flag: "🇹🇼", region: "asia" },
  { code: "HK", name: "홍콩", flag: "🇭🇰", region: "asia" },
  { code: "MO", name: "마카오", flag: "🇲🇴", region: "asia" },
  { code: "MN", name: "몽골", flag: "🇲🇳", region: "asia" },
  { code: "IN", name: "인도", flag: "🇮🇳", region: "asia", isTop: true },
  { code: "PK", name: "파키스탄", flag: "🇵🇰", region: "asia" },
  { code: "BD", name: "방글라데시", flag: "🇧🇩", region: "asia" },

  // 🌴 동남아시아 (7개국)
  { code: "VN", name: "베트남", flag: "🇻🇳", region: "southeast_asia", isTop: true },
  { code: "TH", name: "태국", flag: "🇹🇭", region: "southeast_asia" },
  { code: "ID", name: "인도네시아", flag: "🇮🇩", region: "southeast_asia" },
  { code: "PH", name: "필리핀", flag: "🇵🇭", region: "southeast_asia" },
  { code: "SG", name: "싱가포르", flag: "🇸🇬", region: "southeast_asia" },
  { code: "MY", name: "말레이시아", flag: "🇲🇾", region: "southeast_asia" },
  { code: "KH", name: "캄보디아", flag: "🇰🇭", region: "southeast_asia" },

  // 🏰 유럽 (24개국)
  { code: "GB", name: "영국", flag: "🇬🇧", region: "europe", isTop: true },
  { code: "DE", name: "독일", flag: "🇩🇪", region: "europe", isTop: true },
  { code: "FR", name: "프랑스", flag: "🇫🇷", region: "europe", isTop: true },
  { code: "ES", name: "스페인", flag: "🇪🇸", region: "europe", isTop: true },
  { code: "IT", name: "이탈리아", flag: "🇮🇹", region: "europe" },
  { code: "NL", name: "네덜란드", flag: "🇳🇱", region: "europe" },
  { code: "SE", name: "스웨덴", flag: "🇸🇪", region: "europe" },
  { code: "PL", name: "폴란드", flag: "🇵🇱", region: "europe" },
  { code: "IE", name: "아일랜드", flag: "🇮🇪", region: "europe" },
  { code: "CH", name: "스위스", flag: "🇨🇭", region: "europe" },
  { code: "AT", name: "오스트리아", flag: "🇦🇹", region: "europe" },
  { code: "BE", name: "벨기에", flag: "🇧🇪", region: "europe" },
  { code: "NO", name: "노르웨이", flag: "🇳🇴", region: "europe" },
  { code: "DK", name: "덴마크", flag: "🇩🇰", region: "europe" },
  { code: "FI", name: "핀란드", flag: "🇫🇮", region: "europe" },
  { code: "PT", name: "포르투갈", flag: "🇵🇹", region: "europe" },
  { code: "GR", name: "그리스", flag: "🇬🇷", region: "europe" },
  { code: "CZ", name: "체코", flag: "🇨🇿", region: "europe" },
  { code: "SK", name: "슬로바키아", flag: "🇸🇰", region: "europe" },
  { code: "HR", name: "크로아티아", flag: "🇭🇷", region: "europe" },
  { code: "EE", name: "에스토니아", flag: "🇪🇪", region: "europe" },
  { code: "HU", name: "헝가리", flag: "🇭🇺", region: "europe" },
  { code: "RO", name: "루마니아", flag: "🇷🇴", region: "europe" },
  { code: "UA", name: "우크라이나", flag: "🇺🇦", region: "europe" },

  // 🦅 북미 (3개국)
  { code: "US", name: "미국", flag: "🇺🇸", region: "north_america", isTop: true },
  { code: "CA", name: "캐나다", flag: "🇨🇦", region: "north_america", isTop: true },
  { code: "MX", name: "멕시코", flag: "🇲🇽", region: "north_america" },

  // 💃 중남미 (6개국)
  { code: "BR", name: "브라질", flag: "🇧🇷", region: "latin_america", isTop: true },
  { code: "AR", name: "아르헨티나", flag: "🇦🇷", region: "latin_america" },
  { code: "CL", name: "칠레", flag: "🇨🇱", region: "latin_america" },
  { code: "CO", name: "콜롬비아", flag: "🇨🇴", region: "latin_america" },
  { code: "PE", name: "페루", flag: "🇵🇪", region: "latin_america" },
  { code: "UY", name: "우루과이", flag: "🇺🇾", region: "latin_america" },

  // 🕌 중동 / 아프리카 (9개국)
  { code: "SA", name: "사우디아라비아", flag: "🇸🇦", region: "middle_east_africa" },
  { code: "AE", name: "아랍에미리트", flag: "🇦🇪", region: "middle_east_africa" },
  { code: "EG", name: "이집트", flag: "🇪🇬", region: "middle_east_africa" },
  { code: "TR", name: "튀르키예", flag: "🇹🇷", region: "middle_east_africa" },
  { code: "IL", name: "이스라엘", flag: "🇮🇱", region: "middle_east_africa" },
  { code: "ZA", name: "남아프리카공화국", flag: "🇿🇦", region: "middle_east_africa" },
  { code: "NG", name: "나이지리아", flag: "🇳🇬", region: "middle_east_africa" },
  { code: "KE", name: "케냐", flag: "🇰🇪", region: "middle_east_africa" },
  { code: "MA", name: "모로코", flag: "🇲🇦", region: "middle_east_africa" },

  // 🦘 오세아니아 (2개국)
  { code: "AU", name: "호주", flag: "🇦🇺", region: "oceania", isTop: true },
  { code: "NZ", name: "뉴질랜드", flag: "🇳🇿", region: "oceania" },
];

const COUNTRIES = ALL_COUNTRIES.filter((c) => c.isTop);

const CATEGORIES = [
  { label: "전체", id: "all" },
  { label: "음악/댄스/가수", id: "10" },
  { label: "게임", id: "20" },
  { label: "엔터테인먼트/방송", id: "24" },
  { label: "코미디/유머", id: "23" },
  { label: "영화/만화/애니", id: "1" },
  { label: "음식/요리/뷰티", id: "26" },
  { label: "뉴스/정치/경제", id: "25" },
  { label: "취미/일상", id: "22" },
  { label: "IT/기술/컴퓨터", id: "28" },
  { label: "애완/반려동물", id: "15" },
  { label: "스포츠/운동", id: "17" },
  { label: "자동차", id: "2" },
];

const PERIODS = [
  { id: "1d", label: "☀️ 오늘(신규)" },
  { id: "7d", label: "🗓️ 최근 7일간(신규)" },
  { id: "30d", label: "📅 최근 30일간(신규)" },
  { id: "recent_all_time", label: "🎬 최근 역대 전체(몇달)" },
  { id: "all_time", label: "👑 역대 전체 (All Time)" },
];

const REGIONAL_GROUPS = [
  { id: "global", name: "🌍 전세계 YouTube 전체" },
  { id: "top", name: "🔥 주요 12개국" },
  { id: "asia", name: "🌏 아시아/동아시아" },
  { id: "southeast_asia", name: "🌴 동남아시아" },
  { id: "europe", name: "🏰 유럽" },
  { id: "north_america", name: "🦅 북미" },
  { id: "latin_america", name: "💃 중남미" },
  { id: "middle_east_africa", name: "🕌 중동/아프리카" },
  { id: "oceania", name: "🦘 오세아니아" },
  { id: "all", name: "🌐 전세계 전체 (60개국)" },
];

function getKstTodayDateStr(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split("T")[0];
}

const globalPopularCache = new Map<string, any>();

export default function PopularVideos() {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<"db" | "youtube" | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("1d");
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [selectedRegionGroup, setSelectedRegionGroup] = useState("top");
  const [selectedDate, setSelectedDate] = useState<string>(getKstTodayDateStr());
  const [activeMode, setActiveMode] = useState<any>("1d");
  const [searchQuery, setSearchQuery] = useState("");

  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    if (isNaN(current.getTime())) return;
    current.setDate(current.getDate() + days);

    const targetDateStr = current.toISOString().split("T")[0];
    const todayStr = getKstTodayDateStr();

    if (targetDateStr > todayStr) return;
    setSelectedDate(targetDateStr);
    if (targetDateStr === todayStr) {
      setActiveMode("today");
    } else {
      setActiveMode("custom");
    }
  };

  // Modal analysis states
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedAnalysisVideo, setSelectedAnalysisVideo] = useState<any>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const parseDuration = (durationStr?: string) => {
    if (!durationStr) return { formatted: "", isShorts: false };
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return { formatted: "", isShorts: false };
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const isShorts = totalSeconds > 0 && totalSeconds <= 60;

    let formatted = "";
    if (hours > 0) {
      formatted = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return { formatted, isShorts };
  };

  // Pagination states
  const [visibleCount, setVisibleCount] = useState(20);
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  // RAM cache

  // ⚡ 0ms Instant RAM Cache Warm-up for ALL Keys in Single Daily Bundle Row on mount
  useEffect(() => {
    async function prewarmBundleCache() {
      try {
        const res = await fetch(`/api/youtube/popular?type=popular-bundle&date=${selectedDate}`);
        const json = await res.json();
        if (json && json.bundle && typeof json.bundle === "object") {
          const bundleObj = json.bundle as Record<string, any[]>;
          Object.keys(bundleObj).forEach((bundleKey) => {
            if (Array.isArray(bundleObj[bundleKey]) && bundleObj[bundleKey].length > 0) {
              const fullCacheKey = `${bundleKey}_${selectedDate}`;
              globalPopularCache.set(fullCacheKey, {
                source: "supabase-db-daily-bundle",
                data: bundleObj[bundleKey],
              });
            }
          });
          console.log(`Pre-warmed RAM cache with ${Object.keys(bundleObj).length} keys from Single Daily Bundle Row.`);
        }
      } catch (err) {
        console.error("Bundle cache prewarm failed:", err);
      }
    }
    prewarmBundleCache();
  }, [selectedDate]);

  const getFilteredCountries = () => {
    if (selectedRegionGroup === "global") return [{ code: "GLOBAL", name: "전세계 전체", flag: "🌍", region: "global" as any, isTop: true }];
    if (selectedRegionGroup === "top") return COUNTRIES;
    if (selectedRegionGroup === "all") return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((c) => c.region === selectedRegionGroup);
  };

  const getCountryName = (code: string) => {
    if (code === "GLOBAL") return "전세계 YouTube 전체(GLOBAL)";
    const c = ALL_COUNTRIES.find((x) => x.code === code);
    return c ? `${c.name}(${c.code})` : "대한민국(KR)";
  };

  const fetchPopular = useCallback(
    async (catId = activeCategory, country = selectedCountry, period = selectedPeriod, date = selectedDate, force = false) => {
      setError(null);
      setVisibleCount(20);

      const targetDate = date;
      const cacheKey = `${country}_${catId}_${period}_${targetDate}`;

      if (force) {
        globalPopularCache.delete(cacheKey);
      } else if (globalPopularCache.has(cacheKey)) {
        const cached = globalPopularCache.get(cacheKey);
        setVideos(cached.data || []);
        return;
      }

      setVideos([]);
      setLoading(true);
      setLoadingStatus("db");

      try {
        let result: any = null;

        if (!force) {
          try {
            const cacheCheckRes = await fetch(
              `/api/youtube/popular?country=${country}&categoryId=${catId}&period=${period}&date=${targetDate}&cacheOnly=true`
            );
            if (cacheCheckRes.ok) {
              const cacheJson = await cacheCheckRes.json();
              if (cacheJson && cacheJson.data && Array.isArray(cacheJson.data) && cacheJson.data.length > 0) {
                result = cacheJson;
              }
            }
          } catch (cacheErr) {
            console.warn("DB Cache check error:", cacheErr);
          }
        }

        if (!result) {
          setLoadingStatus("youtube");
          const res = await fetch(
            `/api/youtube/popular?country=${country}&categoryId=${catId}&period=${period}&date=${targetDate}${
              force ? "&force=true" : ""
            }`
          );
          if (!res.ok) throw new Error("인기 비디오 리스트를 가져오는데 실패했습니다.");
          result = await res.json();
        }

        globalPopularCache.set(cacheKey, result);

        if (result && result.categoriesBundle && typeof result.categoriesBundle === "object") {
          Object.entries(result.categoriesBundle).forEach(([cId, list]) => {
            if (Array.isArray(list) && list.length > 0) {
              const subKey = `${country}_${cId}_${period}_${targetDate}`;
              globalPopularCache.set(subKey, { data: list });
            }
          });
        }

        setVideos(result.data || []);
      } catch (err: any) {
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setLoadingStatus(null);
      }
    },
    [activeCategory, selectedCountry, selectedPeriod, selectedDate]
  );

  useEffect(() => {
    fetchPopular(activeCategory, selectedCountry, selectedPeriod, selectedDate);
  }, [activeCategory, selectedCountry, selectedPeriod, selectedDate, fetchPopular]);

  const handleCopyLink = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `https://youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(link);
    setCopiedVideoId(videoId);
    setTimeout(() => setCopiedVideoId(null), 2000);
  };

  const handleForceRefresh = () => {
    fetchPopular(activeCategory, selectedCountry, selectedPeriod, selectedDate, true);
  };

  const formatNumber = (numStr: string) => {
    const num = Number(numStr);
    if (isNaN(num)) return numStr;
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const title = (video.snippet?.title || video.title || "").toLowerCase();
    const channel = (video.snippet?.channelTitle || video.channelTitle || "").toLowerCase();
    return title.includes(q) || channel.includes(q);
  });

  const displayedVideos = filteredVideos;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl sm:text-3xl font-black text-white mb-2">
            <Trophy className="text-yellow-400 animate-bounce" size={28} />
            인기 영상 조회수 랭킹 (Most-Viewed)
          </h2>
          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
            👑 <span className="font-bold text-yellow-300">인기 영상 조회수 랭킹</span>: 전 세계 60개국 & 15개 카테고리별 <span className="text-white font-bold">실제 총 누적 조회수(Total View Count) 최상위 1위~50위 매머드급 대박 영상</span>을 분석합니다. (💡 <span className="text-zinc-400">실시간 유행 핫이슈는 '🔥 급상승 영상 트렌드' 메뉴에서 확인하실 수 있습니다.</span>)
          </p>
        </div>
      </div>

      {/* 🌟 Date Timeline & Period Selector Hub */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 bg-zinc-950/40 border border-zinc-850 p-4 rounded-2xl w-full">
        {/* 1. Date Navigation & Picker (Left) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="이전 날짜"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 border border-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black text-white">
            <Calendar size={14} className="text-yellow-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              max={getKstTodayDateStr()}
              onChange={(e) => {
                const newDate = e.target.value;
                setSelectedDate(newDate);
                if (newDate === getKstTodayDateStr()) {
                  setActiveMode("today");
                } else {
                  setActiveMode("custom");
                }
              }}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => shiftDate(1)}
            disabled={selectedDate >= getKstTodayDateStr()}
            className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="다음 날짜"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-[1px] bg-zinc-800" />

        {/* 2. Period Filter Buttons & Video Search Bar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-black text-zinc-400 mr-1 flex items-center gap-1">
            <Filter size={14} className="text-yellow-400" /> 조회 기간:
          </span>
          {PERIODS.map((p) => {
            const isActive = activeMode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPeriod(p.id);
                  setSelectedDate(getKstTodayDateStr());
                  setActiveMode(p.id as any);
                }}
                className={`px-3 sm:px-3.5 py-1.5 text-xs font-black rounded-xl transition flex items-center gap-1 border-2 ${
                  isActive
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-md shadow-yellow-500/20 scale-105"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white opacity-80"
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {/* 🔍 Instant Video & Channel Search Bar right to the right of Period buttons */}
          <div className="relative flex items-center ml-1 sm:ml-2">
            <Search size={14} className="absolute left-3 text-yellow-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="영상 제목 또는 채널명 검색..."
              className="pl-8 pr-7 py-1.5 bg-zinc-900 border border-zinc-750 text-white placeholder-zinc-500 text-xs font-medium rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-zinc-400 hover:text-white p-0.5"
                title="검색어 지우기"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* 🔄 Instant Refresh Button */}
          <button
            onClick={handleForceRefresh}
            disabled={loading}
            title="실시간 인기 랭킹 즉시 갱신"
            className="ml-auto sm:ml-2 px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 bg-yellow-500/10 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <RotateCw size={13} className={loading ? "animate-spin text-yellow-400" : "text-yellow-400"} />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 🌐 Global Country & Category Selector Hub */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-md space-y-3.5 shadow-2xl shadow-black/25 flex flex-col items-center w-full">
        {/* 1. Regional Groups */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {REGIONAL_GROUPS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                setSelectedRegionGroup(reg.id);
                setSelectedDate(getKstTodayDateStr());
                if (reg.id === "global") {
                  setSelectedCountry("GLOBAL");
                } else if (selectedCountry === "GLOBAL") {
                  setSelectedCountry("KR");
                }
              }}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition shrink-0 whitespace-nowrap border ${
                selectedRegionGroup === reg.id
                  ? "bg-zinc-100 border-zinc-100 text-zinc-950 shadow-md font-black"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* 2. Countries list */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {getFilteredCountries().map((ct) => (
            <button
              key={ct.code}
              onClick={() => {
                setSelectedCountry(ct.code);
                setSelectedDate(getKstTodayDateStr());
              }}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap border-2 ${
                selectedCountry === ct.code
                  ? "bg-yellow-950/30 border-yellow-500/70 text-white shadow-lg shadow-yellow-950/40 transform scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-base sm:text-lg leading-none">{ct.flag}</span>
              <span>{ct.name}</span>
            </button>
          ))}
        </div>

        <div className="h-[1px] w-full bg-zinc-850/60" />

        {/* 3. Category selector */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedDate(getKstTodayDateStr());
              }}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-black rounded-lg transition shrink-0 whitespace-nowrap border-2 ${
                activeCategory === cat.id
                  ? "bg-yellow-600 border-yellow-500 text-zinc-950 font-black shadow-md shadow-yellow-600/20"
                  : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid & Content Area */}
      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-bold text-red-400">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8 shadow-inner">
            <Loader2 className="animate-spin text-yellow-400" size={36} />
            {loadingStatus === "youtube" ? (
              <div className="text-center space-y-1">
                <p className="text-sm font-black text-yellow-400 flex items-center justify-center gap-2">
                  <span>🌐</span>
                  <span>[{getCountryName(selectedCountry)}] YouTube API 인기 영상 조회수 랭킹 데이터 수집 중...</span>
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  DB 미수집 조건으로, 12개 카테고리 실시간 인기 통합 수집 후 DB에 자동 저장 중입니다.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-2">
                  <span>💾</span>
                  <span>[{getCountryName(selectedCountry)}] CreAiBox DB 클라우드 인기 보관함 읽는 중...</span>
                </p>
              </div>
            )}
          </div>
        ) : displayedVideos.length === 0 ? (
          <div className="text-center py-20 border border-zinc-850 rounded-2xl bg-zinc-950/20 space-y-3 p-6">
            {searchQuery ? (
              <>
                <p className="text-sm text-yellow-300 font-black">
                  🔍 "{searchQuery}" 검색어와 일치하는 영상이 없습니다.
                </p>
                <p className="text-xs text-zinc-500 font-bold">
                  다른 검색어를 입력하시거나 검색창 우측의 X 버튼을 눌러 전체 리스트를 확인해 주세요.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-300 font-black">
                  📭 [{selectedDate}] 일자는 CreAiBox DB 구축 이전 기간이거나 미수집 데이터입니다.
                </p>
                <p className="text-xs text-zinc-500 font-bold">
                  상단의 <span className="text-yellow-400 font-black">"☀️ 오늘"</span> 또는 <span className="text-yellow-400 font-black">"👑 역대 전체"</span> 버튼을 누르시면 인기 랭킹을 즉시 조회하실 수 있습니다.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedVideos.map((video, idx) => {
              const videoId = video.id;
              const title = video.snippet?.title || video.title || "제목 없음";
              const channel = video.snippet?.channelTitle || video.channelTitle || "채널 정보 없음";
              const channelId = video.snippet?.channelId || video.channelId;
              const thumbnail =
                video.snippet?.thumbnails?.medium?.url ||
                video.snippet?.thumbnails?.default?.url ||
                video.thumbnails?.medium?.url ||
                "/placeholder.jpg";
              const viewCount = video.statistics?.viewCount || video.viewCount || "0";
              const likeCount = video.statistics?.likeCount || video.likeCount || "0";
              const publishedAt = video.snippet?.publishedAt ? video.snippet.publishedAt.split("T")[0] : "";
              const durationInfo = parseDuration(video.contentDetails?.duration || video.duration);
              const isShorts = video.isRealShorts !== undefined ? video.isRealShorts : durationInfo.isShorts;

              return (
                <div
                  key={videoId || idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-300 hover:border-yellow-500/50 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-yellow-950/10 overflow-hidden"
                >
                  <div>
                    {/* Rank Badge */}
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-1 rounded-lg bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 border border-yellow-500/30 text-xs font-black text-yellow-400">
                      <Trophy size={12} className="text-yellow-400" /> #{idx + 1}
                    </div>

                    {/* Format/Shorts Label */}
                    {isShorts && (
                      <div className="absolute top-6 right-6 z-10 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">
                        <Play size={9} fill="currentColor" className="ml-0.5" />
                        SHORTS
                      </div>
                    )}

                    {/* Thumbnail or Inline YouTube Player */}
                    {videoId && videoId === playingVideoId ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black mb-3">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                          title={title}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => videoId && setPlayingVideoId(videoId)}
                        className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950 mb-3 cursor-pointer group"
                      >
                        <img
                          src={thumbnail}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                          <div className="flex h-11 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                            <Play size={18} fill="currentColor" className="ml-1" />
                          </div>
                        </div>
                        {durationInfo.formatted && (
                          <div className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-black text-white tracking-wider">
                            {durationInfo.formatted}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Info & Stats */}
                    <div className="space-y-2">
                      {videoId ? (
                        <button
                          onClick={() => setPlayingVideoId(videoId)}
                          className="block text-left w-full line-clamp-2 text-sm font-bold text-zinc-100 group-hover:text-yellow-300 transition-colors cursor-pointer"
                        >
                          {title}
                        </button>
                      ) : (
                        <h3 className="line-clamp-2 text-sm font-bold text-zinc-100 group-hover:text-yellow-300 transition-colors">
                          {title}
                        </h3>
                      )}
                      
                      <div className="mt-1 flex items-center flex-wrap gap-1.5 text-[11px] text-zinc-400 font-bold">
                        <span className="truncate max-w-[130px] text-zinc-300">{channel}</span>
                        <span className="text-zinc-700 font-normal">·</span>
                        <span className="text-yellow-400 font-black">조회수 {formatNumber(viewCount)}</span>
                        {likeCount !== "0" && (
                          <>
                            <span className="text-zinc-700 font-normal">·</span>
                            <span>좋아요 {formatNumber(likeCount)}</span>
                          </>
                        )}
                        {publishedAt && (
                          <>
                            <span className="text-zinc-700 font-normal">·</span>
                            <span className="text-zinc-500">{publishedAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal 4-Button Action Bar matching RisingVideos */}
                  <div className="mt-3.5 border-t border-zinc-800/80 pt-3 flex items-center justify-between gap-1.5 text-[11px] font-black text-zinc-400">
                    {videoId && (
                      <button
                        onClick={() => {
                          setSelectedAnalysisVideo(video);
                          setIsAnalysisModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition"
                      >
                        <Sparkles size={11} />
                        <span>AI 분석 리포트</span>
                      </button>
                    )}

                    {videoId && (
                      <button
                        onClick={(e) => handleCopyLink(videoId, e)}
                        className="inline-flex items-center gap-1 hover:text-white transition"
                      >
                        {copiedVideoId === videoId ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span className="text-emerald-400">복사 완료</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>링크 복사</span>
                          </>
                        )}
                      </button>
                    )}

                    {videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition font-medium"
                      >
                        <PlaySquare size={11} />
                        <span>YouTube에서 직접 보기</span>
                      </a>
                    )}

                    {channelId ? (
                      <a
                        href={`https://youtube.com/channel/${channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white transition"
                      >
                        <ExternalLink size={11} />
                        <span>채널 바로가기</span>
                      </a>
                    ) : (
                      <a
                        href={`https://youtube.com/results?search_query=${encodeURIComponent(channel)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white transition"
                      >
                        <ExternalLink size={11} />
                        <span>채널 바로가기</span>
                      </a>
                    )}

                    {videoId && (
                      <Link
                        href={`/studio/youtube/seo?url=https://youtube.com/watch?v=${videoId}`}
                        className="inline-flex items-center gap-0.5 hover:text-white transition"
                      >
                        <span>SEO 분석</span>
                        <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* AI Analysis Modal */}
      <VideoAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setSelectedAnalysisVideo(null);
        }}
        video={selectedAnalysisVideo}
        reportType="popular"
      />
    </div>
  );
}
