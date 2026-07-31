"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flame, Loader2, Play, Eye, ThumbsUp, Calendar, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, BarChart2, ExternalLink, Globe, ChevronDown } from "lucide-react";
import VideoAnalysisModal from "./VideoAnalysisModal";

// ISO 8601 duration parser e.g., PT1M15S -> {formatted: "1:15", seconds: 75, isShorts: false}
function parseDuration(durationStr?: string | null): { formatted: string; seconds: number; isShorts: boolean } {
  if (!durationStr) {
    return { formatted: "0:00", seconds: 0, isShorts: false };
  }
  
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return { formatted: "0:00", seconds: 0, isShorts: false };
  }
  
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const isShorts = totalSeconds > 0 && totalSeconds <= 60;
  
  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}:${String(minutes).padStart(2, "0")}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += String(seconds).padStart(2, "0");
  
  return { formatted, seconds: totalSeconds, isShorts };
}

function getKstTodayDateStr(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kst = new Date(utc + 9 * 60 * 60 * 1000);
  return kst.toISOString().split("T")[0];
}

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

const REGIONAL_GROUPS = [
  { id: "top", name: "🔥 주요 12개국" },
  { id: "asia", name: "🌏 아시아/동아시아" },
  { id: "southeast_asia", name: "🌴 동남아시아" },
  { id: "europe", name: "🏰 유럽" },
  { id: "north_america", name: "🦅 북미" },
  { id: "latin_america", name: "💃 중남미" },
  { id: "middle_east_africa", name: "🕌 중동/아프리카" },
  { id: "oceania", name: "🦘 오세아니아" },
  { id: "all", name: "🌐 전세계 전체 (60+개국)" }
];

interface CountryItem {
  code: string;
  name: string;
  flag: string;
  region: string;
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
const OTHER_COUNTRIES = ALL_COUNTRIES.filter((c) => !c.isTop);

export default function RisingVideos() {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<"db" | "youtube" | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => getKstTodayDateStr());
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [selectedRegionGroup, setSelectedRegionGroup] = useState("top");

  const getFilteredCountries = () => {
    if (selectedRegionGroup === "top") return COUNTRIES;
    if (selectedRegionGroup === "all") return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((c) => c.region === selectedRegionGroup);
  };
  const [source, setSource] = useState("api");
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [selectedVideoForAnalysis, setSelectedVideoForAnalysis] = useState<any>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analyzedVideos, setAnalyzedVideos] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(64);
  const [bulkCurrentInfo, setBulkCurrentInfo] = useState("");
  const [refreshCooldown, setRefreshCooldown] = useState<number>(0);

  // 🚀 Instant RAM Cache for 0ms fluid category/country tab switching
  const videoCacheRef = React.useRef<Map<string, any>>(new Map());

  // Recover cooldown from localStorage on mount and run a second counter
  useEffect(() => {
    const checkCooldown = () => {
      const lastTime = localStorage.getItem("creaibox_last_refresh_timestamp");
      if (lastTime) {
        const elapsed = Math.floor((Date.now() - parseInt(lastTime, 10)) / 1000);
        const remaining = 10800 - elapsed; // 3 Hours limit
        if (remaining > 0) {
          setRefreshCooldown(remaining);
        } else {
          setRefreshCooldown(0);
        }
      }
    };

    checkCooldown();
    const timer = setInterval(checkCooldown, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s}초 남음`;
  };

  // 1. Fetch recent analyzed reports directly from DB (allowing incognito mode & non-logged in users to see all reports)
  useEffect(() => {
    async function loadRecentReportsFromDb() {
      try {
        const res = await fetch("/api/youtube/reports?type=trending");
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setAnalyzedVideos(json.data);
          localStorage.setItem("creaibox_recent_analyzed_videos", JSON.stringify(json.data.slice(0, 30)));
          return;
        }
      } catch (e) {
        console.error("Failed to load recent reports from DB:", e);
      }
      const cached = localStorage.getItem("creaibox_recent_analyzed_videos");
      if (cached) {
        try {
          setAnalyzedVideos(JSON.parse(cached));
        } catch (e) {}
      }
    }
    loadRecentReportsFromDb();
  }, []);

  // ⚡ 0ms Instant RAM Cache Warm-up for ALL 60 Countries on mount
  useEffect(() => {
    async function prewarmBundleCache() {
      try {
        const res = await fetch(`/api/youtube?type=trending-bundle&date=${selectedDate}`);
        const json = await res.json();
        if (json && json.bundle && typeof json.bundle === "object") {
          const bundleObj = json.bundle as Record<string, any[]>;
          Object.keys(bundleObj).forEach((dbCatKey) => {
            if (Array.isArray(bundleObj[dbCatKey]) && bundleObj[dbCatKey].length > 0) {
              let countryCode = "KR";
              let catCode = dbCatKey;
              if (dbCatKey.includes("_")) {
                const parts = dbCatKey.split("_");
                if (ALL_COUNTRIES.some((c) => c.code === parts[0])) {
                  countryCode = parts[0];
                  catCode = dbCatKey.slice(parts[0].length + 1);
                }
              }
              const key = `${countryCode}_${catCode}_${selectedDate}`;
              videoCacheRef.current.set(key, {
                source: "supabase-db-daily-bundle",
                data: bundleObj[dbCatKey],
              });
            }
          });

          // If current selected country key is in RAM cache, set videos immediately
          const currentKey = `${selectedCountry}_${activeCategory}_${selectedDate}`;
          if (videoCacheRef.current.has(currentKey)) {
            const cached = videoCacheRef.current.get(currentKey);
            setVideos(cached.data || []);
            setSource(cached.source || "supabase-db-daily-bundle");
            setLoading(false);
          }
        }
      } catch (e) {
        console.error("prewarmBundleCache error:", e);
      }
    }
    prewarmBundleCache();
  }, [selectedDate]);

  // Infinite scroll listener to progressively reveal videos as user scrolls down
  useEffect(() => {
    const mainContainer = document.querySelector("main");
    const target = mainContainer || window;

    const handleScroll = () => {
      if (loading) return;
      if (visibleCount >= videos.length) return;

      let scrollHeight = 0;
      let scrollTop = 0;
      let clientHeight = 0;

      if (mainContainer) {
        scrollHeight = mainContainer.scrollHeight;
        scrollTop = mainContainer.scrollTop;
        clientHeight = mainContainer.clientHeight;
      } else {
        scrollHeight = document.documentElement.scrollHeight;
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        clientHeight = document.documentElement.clientHeight;
      }

      // Trigger load more when user scrolls past 85% of page
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        setVisibleCount((prev) => Math.min(prev + 20, videos.length));
      }
    };

    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, videos.length]);

  // 2. Add or prepend video to list and synchronize with localStorage
  const handleTriggerAnalysis = (video: any) => {
    setSelectedVideoForAnalysis(video);
    setIsAnalysisModalOpen(true);
    setAnalyzedVideos((prev: any[]) => {
      const filtered = prev.filter((v: any) => v.id !== video.id);
      const updated = [video, ...filtered];
      const sliced = updated.slice(0, 30);
      localStorage.setItem("creaibox_recent_analyzed_videos", JSON.stringify(sliced));
      return sliced;
    });
  };

  const handleCopyLink = (videoId: string) => {
    navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`);
    setCopiedVideoId(videoId);
    setTimeout(() => setCopiedVideoId(null), 1500);
  };

  const fetchTrending = useCallback(async (catId = activeCategory, targetDate = selectedDate, country = selectedCountry, force = false) => {
    setPlayingVideoId(null);
    setError(null);
    setVisibleCount(20); // Reset page count on new fetch

    const cacheKey = `${country}_${catId}_${targetDate}`;

    if (force) {
      videoCacheRef.current.delete(cacheKey);
    } else if (videoCacheRef.current.has(cacheKey)) {
      // 🚀 0ms Instant RAM cache hit: no loading screen flash!
      const cached = videoCacheRef.current.get(cacheKey);
      setVideos(cached.data || []);
      setSource(cached.source || "cache");
      return;
    }

    setVideos([]); // 🚀 Clear old country videos so stale country videos are never shown
    setLoading(true);
    setLoadingStatus("db");

    try {
      let result: any = null;

      // 1-Step: Check Supabase DB Cache first
      if (!force) {
        try {
          const cacheCheckRes = await fetch(`/api/youtube?type=trending&categoryId=${catId}&date=${targetDate}&country=${country}&cacheOnly=true`);
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

      // 2-Step: If DB Cache Miss (or force refresh), switch status to YouTube API live fetch!
      if (!result) {
        setLoadingStatus("youtube");
        const res = await fetch(`/api/youtube?type=trending&categoryId=${catId}&date=${targetDate}&country=${country}${force ? '&force=true' : ''}`);
        if (!res.ok) throw new Error("급상승 비디오 리스트를 가져오는데 실패했습니다.");
        result = await res.json();
      }



      videoCacheRef.current.set(cacheKey, result);

      // 🚀 Pre-populate category sub-caches from "all" feed ONLY if category videos exist in the feed
      if (catId === "all" && Array.isArray(result.data)) {
        CATEGORIES.forEach((cat) => {
          if (cat.id === "all") return;
          const catVideos = result.data.filter(
            (v: any) => v.categoryId === cat.id || v.snippet?.categoryId === cat.id
          );
          if (catVideos.length > 0) {
            const subCacheKey = `${country}_${cat.id}_${targetDate}`;
            videoCacheRef.current.set(subCacheKey, {
              source: result.source,
              data: catVideos,
              analyzedVideoIds: result.analyzedVideoIds,
            });
          }
        });
      }

      setVideos(result.data || []);
      setSource(result.source);

      if (force) {
        localStorage.setItem("creaibox_last_refresh_timestamp", Date.now().toString());
        setRefreshCooldown(10800);
      }

      // Prepopulate and merge analyzed news list from database cache hit status (Global Unified Merge)
      if (result.analyzedVideoIds && result.data) {
        const newAnalyzed = result.data.filter((v: any) => result.analyzedVideoIds.includes(v.id));
        setAnalyzedVideos((prev: any[]) => {
          const merged = [...newAnalyzed, ...prev];
          const unique = merged.filter((item, index, self) =>
            self.findIndex((t) => t.id === item.id) === index
          );
          const sliced = unique.slice(0, 30);
          localStorage.setItem("creaibox_recent_analyzed_videos", JSON.stringify(sliced));
          return sliced;
        });
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setLoadingStatus(null);
    }
  }, [activeCategory, selectedDate, selectedCountry]);

  useEffect(() => {
    fetchTrending("all", getKstTodayDateStr(), "KR");
  }, []);

  const handleBulkSync = async () => {
    if (isBulkLoading) return;
    setIsBulkLoading(true);
    setBulkProgress(0);
    setBulkTotal(ALL_COUNTRIES.length);
    setBulkCurrentInfo("전세계 60개국 전체 트렌드 일괄 수집을 시작합니다...");
    videoCacheRef.current.clear();

    const todayStr = getKstTodayDateStr();
    let completed = 0;

    try {
      for (const country of ALL_COUNTRIES) {
        const info = `${country.flag} ${country.name} (${country.code}) - 전체 카테고리 트렌드 수집 중...`;
        setBulkCurrentInfo(info);

        try {
          const res = await fetch(`/api/youtube?type=trending&categoryId=all&date=${todayStr}&country=${country.code}`);
          if (res.ok) {
            const result = await res.json();
            const cacheKey = `${country.code}_all_${todayStr}`;
            videoCacheRef.current.set(cacheKey, result);

            // Pre-populate category sub-caches for this country ONLY if category videos exist in feed
            if (Array.isArray(result.data)) {
              CATEGORIES.forEach((cat) => {
                if (cat.id === "all") return;
                const catVideos = result.data.filter(
                  (v: any) => v.categoryId === cat.id || v.snippet?.categoryId === cat.id
                );
                if (catVideos.length > 0) {
                  const subCacheKey = `${country.code}_${cat.id}_${todayStr}`;
                  videoCacheRef.current.set(subCacheKey, {
                    source: result.source,
                    data: catVideos,
                    analyzedVideoIds: result.analyzedVideoIds,
                  });
                }
              });
            }
          }
        } catch (e) {
          console.error(`Error syncing ${country.code}:`, e);
        }

        completed++;
        setBulkProgress(completed);

        await new Promise(resolve => setTimeout(resolve, 150));
      }
      setBulkCurrentInfo(`🎉 전세계 ${ALL_COUNTRIES.length}개국 전체 트렌드 일괄 수집 완료!`);
      localStorage.setItem("creaibox_last_refresh_timestamp", Date.now().toString());
      setRefreshCooldown(10800);
      fetchTrending(activeCategory, selectedDate, selectedCountry);
    } catch (err: any) {
      console.error("Bulk sync failed:", err);
      setBulkCurrentInfo("⚠️ 일괄 수집 중 일부 오류가 발생했습니다.");
    } finally {
      setTimeout(() => {
        setIsBulkLoading(false);
      }, 3000);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    fetchTrending(catId, selectedDate, selectedCountry);
  };

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    fetchTrending(activeCategory, dateStr, selectedCountry);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    fetchTrending(activeCategory, selectedDate, countryCode);
  };

  const getCountryName = (code: string) => {
    const c = ALL_COUNTRIES.find((x) => x.code === code);
    return c ? `${c.name}(${c.code})` : "대한민국(KR)";
  };

  // Timeline navigation shift helper
  const shiftDate = (days: number) => {
    const current = new Date(selectedDate);
    if (isNaN(current.getTime())) return;
    current.setDate(current.getDate() + days);

    const targetDateStr = current.toISOString().split("T")[0];
    const todayStr = getKstTodayDateStr();

    if (targetDateStr > todayStr) return; // Block forward shifts past today
    handleDateChange(targetDateStr);
  };

  const formatNumber = (numStr: string) => {
    const num = Number(numStr);
    if (isNaN(num)) return numStr;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  const filteredVideos = videos;
  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const isTodaySelected = selectedDate === getKstTodayDateStr();

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl sm:text-3xl font-black text-white mb-2">
            <Flame className="text-orange-500 animate-pulse" size={26} />
            AI 급상승 영상 트렌드 분석 리포트
          </h2>
          <div className="space-y-1.5">
            <p className="text-sm text-zinc-200 leading-relaxed font-black">
              🔥 <span className="text-orange-400 font-bold">급상승 영상 트렌드</span>: 유튜브 실시간 알고리즘이 선정한 <span className="text-white font-bold">지금 이 시각 유행/시청 유입 반응이 가장 폭발적인 급상승 이슈 랭킹</span>을 제공합니다. (💡 <span className="text-zinc-400 font-medium">누적 총 조회수 1위~50위 매머드급 랭킹은 '👑 인기 영상 조회수 랭킹' 메뉴에서 확인하세요.</span>)
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-bold">
              각 영상 하단의 <span className="text-orange-500 font-black">"AI 데이터 분석 리포트"</span> 버튼을 클릭하면 고성능 <span className="text-orange-500 font-black">"AI Gemini Pro"</span>가 시청자 반응 지표와 핵심 바이럴 요인, 내 채널용 변형 기획안을 포함한 정밀 보고서를 작성해 팝업합니다.
            </p>
          </div>
        </div>

    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
      <button
        onClick={handleBulkSync}
        disabled={loading || isBulkLoading || !isTodaySelected || refreshCooldown > 0}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-30 disabled:hover:from-orange-600 px-5 text-xs font-black text-white transition"
      >
        {isBulkLoading ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} />}
        {refreshCooldown > 0 ? `수집 완료 (${formatCooldown(refreshCooldown)})` : (isTodaySelected ? "전체 60개국 일괄수집" : "일괄수집 불가")}
      </button>

      <button
        onClick={() => fetchTrending(activeCategory, selectedDate, selectedCountry, true)}
        disabled={loading || isBulkLoading || !isTodaySelected || refreshCooldown > 0}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 px-5 text-xs font-black text-white transition"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} />}
        {refreshCooldown > 0 ? `새로고침 불가 (${formatCooldown(refreshCooldown)})` : (isTodaySelected ? "새로고침" : "새로고침 불가")}
      </button>
    </div>
  </div>

  {isBulkLoading && (
    <div className="rounded-2xl border border-orange-500/20 bg-zinc-950/40 p-5 shadow-2xl backdrop-blur-md space-y-3 animate-pulse">
      <div className="flex justify-between items-center text-xs font-black text-zinc-300">
        <span className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-orange-500" />
          {bulkCurrentInfo}
        </span>
        <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20">
          {bulkProgress} / {bulkTotal} ({(bulkProgress / bulkTotal * 100).toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
        <div 
          className="bg-gradient-to-r from-orange-600 to-amber-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(bulkProgress / bulkTotal * 100)}%` }}
        />
      </div>
    </div>
  )}

      {/* 🌐 Central Filter Hub (Global Country + Category Selectors) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-md space-y-3.5 shadow-2xl shadow-black/25 flex flex-col items-center w-full">
        {/* 1. 대륙 / 지역 카테고리 탭 (1열) */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {REGIONAL_GROUPS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionGroup(reg.id)}
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

        {/* 2. 대륙별 국가 개별 탭 버튼 목록 (2열) */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {getFilteredCountries().map((ct) => (
            <button
              key={ct.code}
              onClick={() => handleCountryChange(ct.code)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap border-2 ${
                selectedCountry === ct.code
                  ? "bg-orange-950/30 border-orange-500/70 text-white shadow-lg shadow-orange-950/40 transform scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-base sm:text-lg leading-none">{ct.flag}</span>
              <span>{ct.name}</span>
            </button>
          ))}
        </div>

        {/* Separator Divider */}
        <div className="h-[1px] w-full bg-zinc-850/60" />

        {/* 2. Category Selector & Tabs (Centered) */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 w-full max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-black rounded-lg transition shrink-0 whitespace-nowrap border-2 ${
                activeCategory === cat.id
                  ? "bg-orange-650 border-orange-500 text-white shadow-md shadow-orange-650/15"
                  : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split Layout Wrapper */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Video List & Status Messages */}
        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-bold text-red-400">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8 shadow-inner">
              <Loader2 className="animate-spin text-orange-500" size={36} />
              {loadingStatus === "youtube" ? (
                <div className="text-center space-y-1">
                  <p className="text-sm font-black text-orange-400 flex items-center justify-center gap-2">
                    <span>🌐</span>
                    <span>[{getCountryName(selectedCountry)}] YouTube API 실시간 트렌드 데이터 수집 중...</span>
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">
                    DB 미수집 국가로, 12개 카테고리 실시간 인기 통합 수집 후 DB에 자동 저장 중입니다.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-2">
                    <span>💾</span>
                    <span>[{getCountryName(selectedCountry)}] CreAiBox DB 클라우드 트렌드 보관함 읽는 중...</span>
                  </p>
                </div>
              )}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20 border border-zinc-850 rounded-2xl bg-zinc-950/20 space-y-3">
              <p className="text-sm text-zinc-300 font-black">📭 아직 수집된 {getCountryName(selectedCountry)} 트렌드 데이터가 없습니다.</p>
              <p className="text-xs text-zinc-500 font-bold">
                상단의 <span className="text-orange-500 font-black">"전체 60개국 일괄수집"</span> 버튼을 클릭하시거나 일일 무인 자동 수집을 기다려 주세요.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
              {displayedVideos.map((video, idx) => {
                const videoId = video.id;
                const title = video.snippet?.title || video.title || "제목 없음";
                const channel = video.snippet?.channelTitle || video.channelTitle || "채널 정보 없음";
                const thumbnail = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url || "/placeholder.jpg";
                const viewCount = video.statistics?.viewCount || video.viewCount || "0";
                const likeCount = video.statistics?.likeCount || video.likeCount || "0";
                
                const durationInfo = parseDuration(video.contentDetails?.duration || video.duration);
                const isShorts = video.isRealShorts !== undefined ? video.isRealShorts : durationInfo.isShorts;

                return (
                  <div key={idx} className="group rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-orange-500/40 transition flex flex-col justify-between hover:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                    <div>
                      {/* Thumbnail wrapped with YouTube Link or In-page Player */}
                      {videoId && videoId === playingVideoId ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title={title}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : videoId ? (
                        <div
                          onClick={() => setPlayingVideoId(videoId)}
                          className="relative block aspect-video w-full overflow-hidden bg-zinc-950 cursor-pointer"
                        >
                          <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          {/* Play Button Overlay (YouTube Style Red Rectangular Play Badge) */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                            <div className="flex h-11 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                              <Play size={18} fill="currentColor" className="ml-1" />
                            </div>
                          </div>
                          
                          {/* Index badge */}
                          <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 text-xs font-black text-white">
                            {idx + 1}
                          </div>
     
                          {/* Format/Shorts Label */}
                          {isShorts && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">
                              <Play size={9} fill="currentColor" className="ml-0.5" />
                              SHORTS
                            </div>
                          )}
     
                          {/* Playtime duration overlay */}
                          <div className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-black text-white tracking-wider">
                            {durationInfo.formatted}
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                          <img
                            src={thumbnail}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 text-xs font-black text-white">
                            {idx + 1}
                          </div>
                        </div>
                      )}
     
                      {/* Title & Channel padded container (Line 1 & 2) */}
                      <div className="px-4 pt-4">
                        {/* Line 1: Title Link to YouTube */}
                        {videoId ? (
                          <button
                            onClick={() => setPlayingVideoId(videoId)}
                            className="block text-left w-full text-sm font-black text-white line-clamp-1 truncate leading-normal hover:text-orange-400 transition cursor-pointer"
                          >
                            {title}
                          </button>
                        ) : (
                          <h3 className="text-sm font-black text-white line-clamp-1 truncate leading-normal">
                            {title}
                          </h3>
                        )}
                        
                        {/* Line 2: Channel & Stats metadata strip */}
                        <div className="mt-1.5 flex items-center flex-wrap gap-1.5 text-[11px] text-zinc-500 font-bold">
                          <span className="truncate max-w-[120px] text-zinc-400">{channel}</span>
                          <span className="text-zinc-700 font-normal">·</span>
                          <span>조회수 {formatNumber(viewCount)}</span>
                          <span className="text-zinc-700 font-normal">·</span>
                          <span>좋아요 {formatNumber(likeCount)}</span>
                        </div>
                      </div>
                    </div>
     
                    {/* Line 3: Horizontal Action Button bar */}
                    <div className="mt-4 border-t border-zinc-800/40 pt-3.5 mx-4 mb-4 flex items-center justify-between gap-2 text-[11px] font-black text-zinc-400">
                      {videoId && typeof videoId === "string" && (
                        <button
                          onClick={() => handleTriggerAnalysis(video)}
                          className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 transition"
                        >
                          <BarChart2 size={11} />
                          <span>AI 분석 리포트</span>
                        </button>
                      )}
                      {videoId && typeof videoId === "string" && (
                        <button
                          onClick={() => handleCopyLink(videoId)}
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
                      {video.snippet?.channelId && (
                        <a
                          href={`https://youtube.com/channel/${video.snippet.channelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-white transition"
                        >
                          <ExternalLink size={11} />
                          <span>채널 바로가기</span>
                        </a>
                      )}
                      {videoId && typeof videoId === "string" && (
                        <a
                          href={`/studio/youtube/seo?url=https://youtube.com/watch?v=${videoId}`}
                          className="inline-flex items-center gap-0.5 hover:text-white transition"
                        >
                          SEO 분석
                          <ArrowRight size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="text-[10px] text-zinc-650 font-bold text-right mt-4">
              데이터 피드: {source === "youtube-api" ? "YouTube Live Data API" : source.startsWith("supabase-db") ? "Supabase Table Cache" : "Vault Fallback System"}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Aside AI Report News Feed (Always Rendered) */}
        <aside className="lg:sticky lg:top-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-5 max-h-[89vh] overflow-y-auto backdrop-blur-sm self-start w-full">
          {/* 📅 Date Selector Control Row (Moved from Filters) */}
          <div className="flex flex-col gap-2 pb-3.5 border-b border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 font-bold tracking-wider">분석 기준일 선택</span>
            <div className="flex items-center justify-between w-full">
              {/* Archive Mode Status */}
              <div className="min-h-8 flex items-center">
                {!isTodaySelected ? (
                  <span className="inline-flex h-8 items-center rounded-xl bg-cyan-950/40 border border-cyan-850 px-3 text-[9px] font-black text-cyan-400 tracking-wider">
                    아카이브 모드
                  </span>
                ) : (
                  <span className="inline-flex h-8 items-center rounded-xl bg-emerald-950/40 border border-emerald-850 px-3 text-[9px] font-black text-emerald-400 tracking-wider animate-pulse">
                    실시간 트렌드
                  </span>
                )}
              </div>
              
              {/* Timeline shift and date selector container */}
              <div className="flex items-center bg-zinc-950/45 p-1 rounded-xl border border-zinc-900">
                {/* Shift Day Back */}
                <button
                  onClick={() => shiftDate(-1)}
                  disabled={loading}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 disabled:opacity-20 transition"
                  title="하루 전"
                >
                  <ChevronLeft size={15} />
                </button>

                {/* Input Calendar Picker */}
                <div className="relative flex items-center">
                  <Calendar size={12} className="absolute left-2.5 text-zinc-500 pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={getKstTodayDateStr()}
                    className="h-7 w-32 rounded-lg border-0 bg-transparent pl-8 pr-1 text-[10px] font-black text-zinc-300 outline-none cursor-pointer"
                  />
                </div>

                {/* Shift Day Forward */}
                <button
                  onClick={() => shiftDate(1)}
                  disabled={loading || isTodaySelected}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 disabled:opacity-20 transition"
                  title="하루 후"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black text-white italic flex items-center gap-2">
              <BarChart2 className="text-orange-400" size={15} />
              최근 분석된 AI 리포트
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold mt-1 leading-normal">
              참여 비율과 기획 Blueprint가 생성 완료된 뉴스 피드입니다. 클릭 시 상세 보고서가 팝업됩니다.
            </p>
          </div>

          <div className="space-y-2.5">
            {analyzedVideos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-800/80 p-8 text-center bg-zinc-950/10">
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                  아직 분석 완료된 AI 리포트가 없습니다. <br />
                  좌측 영상 카드의 <span className="text-orange-400 font-black">"AI 분석 리포트"</span>를 클릭하여 리포트를 발행해 보세요.
                </p>
              </div>
            ) : (
              analyzedVideos.map((video: any, index: number) => {
                const title = video.snippet?.title || video.title || "제목 없음";
                const channel = video.snippet?.channelTitle || video.channelTitle || video.channelName || "채널 정보 없음";
                const videoId = typeof video.id === "string" ? video.id : video.videoId;
                const thumbnail = video.snippet?.thumbnails?.medium?.url ||
                  video.snippet?.thumbnails?.default?.url ||
                  video.thumbnails?.medium?.url ||
                  video.thumbnails?.default?.url ||
                  video.thumbnail ||
                  (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.jpg");
                const viewCount = video.statistics?.viewCount || video.viewCount || "0";
                
                return (
                  <div
                    key={`news-${video.id || index}`}
                    onClick={() => handleTriggerAnalysis(video)}
                    className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/20 p-2.5 hover:bg-zinc-900/40 hover:border-orange-500/30 transition cursor-pointer overflow-hidden"
                  >
                    {/* News Thumbnail */}
                    <div className="relative h-11 w-20 overflow-hidden rounded bg-zinc-950 shrink-0">
                      <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (videoId && !target.src.includes("hqdefault.jpg")) {
                            target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                          } else {
                            target.src = "/placeholder.jpg";
                          }
                        }}
                      />
                    </div>

                    {/* News Title & Metas */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold">
                        <span className="text-zinc-400 truncate max-w-[80px]">{channel}</span>
                        <span>·</span>
                        <span>조회 {formatNumber(viewCount)}</span>
                      </div>
                      <h3 className="mt-0.5 text-[11px] font-black text-white line-clamp-1 group-hover:text-orange-400 transition leading-normal">
                        {title}
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-orange-400/90 font-bold">
                        ● AI 분석 완료
                      </span>
                    </div>

                    {/* Arrow icon */}
                    <div className="text-zinc-650 group-hover:text-orange-400 transition shrink-0">
                      <ArrowRight size={11} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>

      <VideoAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setSelectedVideoForAnalysis(null);
        }}
        video={selectedVideoForAnalysis}
        videos={videos}
        onVideoSelect={handleTriggerAnalysis}
      />
    </div>
  );
}
