"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trophy, Loader2, Play, Calendar, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Filter, Search, X, RotateCw, PlaySquare } from "lucide-react";
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
  { code: "GLOBAL", name: "전세계", flag: "🌍", region: "top", isTop: true },
  { code: "KR", name: "대한민국", flag: "🇰🇷", region: "top", isTop: true },
  { code: "US", name: "미국", flag: "🇺🇸", region: "top", isTop: true },
  { code: "JP", name: "일본", flag: "🇯🇵", region: "top", isTop: true },
  { code: "GB", name: "영국", flag: "🇬🇧", region: "top", isTop: true },
  { code: "DE", name: "독일", flag: "🇩🇪", region: "top", isTop: true },
  { code: "FR", name: "프랑스", flag: "🇫🇷", region: "top", isTop: true },
  { code: "CA", name: "캐나다", flag: "🇨🇦", region: "top", isTop: true },
  { code: "ES", name: "스페인", flag: "🇪🇸", region: "top", isTop: true },
  { code: "AU", name: "호주", flag: "🇦🇺", region: "top", isTop: true },
  { code: "BR", name: "브라질", flag: "🇧🇷", region: "top", isTop: true },
  { code: "IN", name: "인도", flag: "🇮🇳", region: "top", isTop: true },
  { code: "TH", name: "태국", flag: "🇹🇭", region: "top", isTop: true },
];

const CATEGORIES = [
  { label: "전체", id: "all" },
  { label: "음악/댄스/가수", id: "10" },
  { label: "교육/키즈/동요", id: "27" },
  { label: "게임", id: "20" },
  { label: "엔터테인먼트/방송", id: "24" },
  { label: "코미디/유머", id: "23" },
  { label: "영화/만화/애니", id: "1" },
  { label: "음식/요리/뷰티", id: "26" },
  { label: "여행/이벤트/명소", id: "19" },
  { label: "뉴스/정치/경제", id: "25" },
  { label: "취미/일상", id: "22" },
  { label: "IT/기술/컴퓨터", id: "28" },
  { label: "애완/반려동물", id: "15" },
  { label: "스포츠/운동", id: "17" },
  { label: "자동차", id: "2" },
];

const PERIODS = [
  { id: "all_time", label: "👑 역대 전체 (All-Time)" },
  { id: "30d", label: "📅 최근 30일" },
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
  const [selectedPeriod, setSelectedPeriod] = useState("all_time");
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [selectedDate, setSelectedDate] = useState<string>(getKstTodayDateStr());
  const [activeFormat, setActiveFormat] = useState<"all" | "video" | "shorts">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal analysis states
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedAnalysisVideo, setSelectedAnalysisVideo] = useState<any>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  const parseDuration = (durationStr?: string, videoObj?: any) => {
    if (!durationStr) return { formatted: "", isShorts: false };
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return { formatted: "", isShorts: false };
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    let isShorts = false;
    if (totalSeconds > 0 && totalSeconds <= 180) {
      const title = (videoObj?.snippet?.title || videoObj?.title || "").toLowerCase();
      const description = (videoObj?.snippet?.description || videoObj?.description || "").toLowerCase();
      const channel = (videoObj?.snippet?.channelTitle || videoObj?.channelTitle || "").toLowerCase();

      const hasShortsKeyword = 
        title.includes("#shorts") || 
        title.includes("#short") || 
        title.includes("shorts") || 
        title.includes("쇼츠") || 
        title.includes("#숏") ||
        title.includes("#shortvideo") ||
        title.includes("#shortsfeed") ||
        description.includes("#shorts") || 
        description.includes("#short") || 
        description.includes("쇼츠");

      const isTopicChannel = channel.includes("- topic") || channel.includes("- 주제") || channel.endsWith("topic") || channel.endsWith("주제");
      const isOfficialArtist = (channel.includes("official") || channel.includes("공식")) && (title.includes(" - ") || title.includes(" – "));
      
      const isMv = 
        title.includes("music video") ||
        title.includes("official video") ||
        title.includes("video oficial") ||
        title.includes("clip oficial") ||
        title.includes("lyric video") ||
        title.includes("official audio") ||
        title.includes("official song") ||
        title.includes("official track") ||
        title.includes("song") ||
        title.includes(" mv") || 
        title.includes("mv ") || 
        title.includes("[mv]") || 
        title.includes("(mv)") || 
        title.includes("'mv'") || 
        title.includes('"mv"') || 
        title.endsWith("mv") ||
        title.includes("m/v") || 
        title.includes("뮤직비디오") || 
        title.includes("뮤비") || 
        title.includes("visualizer") || 
        title.includes("audio") || 
        title.includes("음원");

      const isAnimationOrCinematic = 
        title.includes("animation") || 
        title.includes("animated") || 
        title.includes("cinematic") || 
        title.includes("애니메이션") || 
        title.includes("origin story") || 
        title.includes("short film") || 
        title.includes("단편영화");

      const isNewsOrBroadcast = 
        title.includes("news") || 
        title.includes("뉴스") || 
        title.includes("interview") || 
        title.includes("인터뷰") || 
        channel.includes("news") || 
        channel.includes("뉴스") || 
        title.includes("episode") || 
        title.includes("ep.") || 
        title.includes("에피소드");

      const isLiveOrStage = 
        title.includes("live clip") || 
        title.includes("라이브") || 
        title.includes("on the spot") || 
        title.includes("온더스팟") || 
        title.includes("stage") || 
        title.includes("스페셜") || 
        title.includes("special clip") || 
        title.includes("performance video") || 
        title.includes("퍼포먼스");

      const isTeaserOrTrailer = 
        title.includes("예고편") || 
        title.includes("teaser") || 
        title.includes("trailer") || 
        title.includes("풀버전") || 
        title.includes("full ver") || 
        title.includes("풀영상") || 
        title.includes("하이라이트") || 
        title.includes("highlight");

      const isExplicitLongform = (isTopicChannel || isOfficialArtist || isMv || isAnimationOrCinematic || isNewsOrBroadcast || isLiveOrStage || isTeaserOrTrailer) && !hasShortsKeyword;

      if (isExplicitLongform) {
        isShorts = false;
      } else {
        isShorts = true;
      }
    }

    let formatted = "";
    if (hours > 0) {
      formatted = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return { formatted, isShorts };
  };

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

  const getCountryName = (code: string) => {
    const match = ALL_COUNTRIES.find((c) => c.code === code);
    return match ? `${match.name}(${match.code})` : code;
  };

  const fetchPopular = useCallback(
    async (catId: string, country: string, period: string, targetDate: string, force: boolean = false) => {
      const cacheKey = `${country}_${catId}_${period}_${targetDate}`;

      if (!force && globalPopularCache.has(cacheKey)) {
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
    []
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

  // Real-time Format Stats
  const videoStats = useMemo(() => {
    let all = videos.length;
    let video = 0;
    let shorts = 0;
    videos.forEach((v) => {
      const info = parseDuration(v.contentDetails?.duration || v.duration, v);
      if (info.isShorts) {
        shorts++;
      } else {
        video++;
      }
    });
    return { all, video, shorts };
  }, [videos]);

  // Client-side Instant Filter by Format + Search Query
  const filteredVideos = useMemo(() => {
    let list = videos;
    if (activeFormat === "shorts") {
      list = list.filter((v) => parseDuration(v.contentDetails?.duration || v.duration, v).isShorts);
    } else if (activeFormat === "video") {
      list = list.filter((v) => !parseDuration(v.contentDetails?.duration || v.duration, v).isShorts);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((v) => {
      const title = (v.snippet?.title || v.title || "").toLowerCase();
      const channel = (v.snippet?.channelTitle || v.channelTitle || "").toLowerCase();
      return title.includes(q) || channel.includes(q);
    });
  }, [videos, activeFormat, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl sm:text-3xl font-black text-white mb-2">
            <Trophy className="text-yellow-400" size={28} />
            인기 영상 조회수 랭킹 (Most-Viewed)
          </h2>
          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
            👑 <span className="font-bold text-yellow-300">인기 영상 조회수 랭킹</span>: 전 세계 12개국 & 13개 카테고리별 <span className="text-white font-bold">실제 총 누적 조회수(Total View Count) 최상위 1위~50위 매머드급 대박 영상</span>을 분석합니다. (💡 <span className="text-zinc-400">실시간 유행 핫이슈는 '🔥 급상승 영상 트렌드' 메뉴에서 확인하실 수 있습니다.</span>)
          </p>
        </div>
      </div>

      {/* 🌟 Top Control Bar: Period Filter + Search + Refresh */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-2xl w-full">
        {/* Left: Period Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-zinc-400 mr-1 flex items-center gap-1">
            <Filter size={14} className="text-yellow-400" /> 조회 기간:
          </span>
          {PERIODS.map((p) => {
            const isActive = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPeriod(p.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 border-2 ${
                  isActive
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-md shadow-yellow-500/20 scale-105"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Right: Instant Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-yellow-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="영상 제목 또는 채널명 검색..."
              className="pl-8 pr-7 py-1.5 bg-zinc-900 border border-zinc-750 text-white placeholder-zinc-500 text-xs font-medium rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition w-44 sm:w-60"
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

          <button
            onClick={handleForceRefresh}
            disabled={loading}
            title="실시간 인기 랭킹 즉시 갱신"
            className="px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 bg-yellow-500/10 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <RotateCw size={13} className={loading ? "animate-spin text-yellow-400" : "text-yellow-400"} />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* 2-Column Ultra-Slim Filter Hub */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-4 backdrop-blur-md flex flex-col md:flex-row items-center gap-4 w-full shadow-2xl shadow-black/25">
        {/* Left Column: Format Selector (150px) */}
        <div className="w-full md:w-[150px] shrink-0 flex flex-row md:flex-col justify-center gap-1.5">
          <button
            onClick={() => setActiveFormat("all")}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-between border-2 ${
              activeFormat === "all"
                ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-[1.02]"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
            }`}
          >
            <span>🌟 전체 보기</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-800/80 text-zinc-300 font-bold border border-zinc-700/50">
              {videoStats.all}
            </span>
          </button>

          <button
            onClick={() => setActiveFormat("video")}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-between border-2 ${
              activeFormat === "video"
                ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20 scale-[1.02]"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
            }`}
          >
            <span>🎬 일반 동영상</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-800/80 text-zinc-300 font-bold border border-zinc-700/50">
              {videoStats.video}
            </span>
          </button>

          <button
            onClick={() => setActiveFormat("shorts")}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-between border-2 ${
              activeFormat === "shorts"
                ? "bg-red-500/20 border-red-500 text-red-300 shadow-md shadow-red-500/20 scale-[1.02]"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
            }`}
          >
            <span>⚡ 유튜브 쇼츠</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-800/80 text-zinc-300 font-bold border border-zinc-700/50">
              {videoStats.shorts}
            </span>
          </button>
        </div>

        {/* Right Column: Country + Category Tabs */}
        <div className="flex-1 flex flex-col justify-center gap-2 w-full">
          {/* Row 1: Countries */}
          <div className="flex flex-wrap items-center gap-1.5 w-full">
            {ALL_COUNTRIES.map((ct) => (
              <button
                key={ct.code}
                onClick={() => setSelectedCountry(ct.code)}
                className={`px-3 py-1 text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap border-2 ${
                  selectedCountry === ct.code
                    ? "bg-yellow-950/30 border-yellow-500/70 text-white shadow-lg shadow-yellow-950/40 transform scale-105"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span className="text-sm leading-none">{ct.flag}</span>
                <span>{ct.name}</span>
              </button>
            ))}
          </div>

          {/* Row 2: Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition shrink-0 whitespace-nowrap border-2 ${
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
                  <span>[{getCountryName(selectedCountry)}] YouTube API 실시간 인기 영상 조회수 랭킹 수집 중...</span>
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  일반 롱폼 영상(4분 이상)과 쇼츠(3분 이하)를 독립 검색하여 최고 조회수 순으로 집계 중입니다.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-2">
                  <span>💾</span>
                  <span>[{getCountryName(selectedCountry)}] CreaiBox 클라우드 DB 인기 보관함 읽는 중...</span>
                </p>
              </div>
            )}
          </div>
        ) : filteredVideos.length === 0 ? (
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
                  📭 선택하신 조건의 인기 영상 랭킹 데이터가 존재하지 않습니다.
                </p>
                <p className="text-xs text-zinc-500 font-bold">
                  상단의 <span className="text-yellow-400 font-black">"새로고침"</span> 버튼을 누르시면 실시간 최다 조회수 랭킹을 즉시 수집합니다.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video, idx) => {
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
              const durationInfo = parseDuration(video.contentDetails?.duration || video.duration, video);
              const isShorts = durationInfo.isShorts;

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
                    <div
                      className={`absolute top-6 right-6 z-10 flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-black text-white shadow ${
                        isShorts ? "bg-red-600" : "bg-sky-600"
                      }`}
                    >
                      <Play size={9} fill="currentColor" className="ml-0.5" />
                      {isShorts ? "SHORTS" : "VIDEO"}
                    </div>

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

                  {/* Horizontal 5-Button Action Bar matching RisingVideos */}
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
