"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Flame, Loader2, Play, Eye, ThumbsUp, Calendar, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, BarChart2, ExternalLink, Globe, ChevronDown, PlaySquare, Film, Sparkles } from "lucide-react";
import VideoAnalysisModal from "./VideoAnalysisModal";

// ISO 8601 duration parser with Smart Shorts (최대 3분 및 해시태그/화면비율/가로예고편 예외 처리)
function parseDuration(durationStr?: string | null, videoObj?: any): { formatted: string; seconds: number; isShorts: boolean } {
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
  
  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}:${String(minutes).padStart(2, "0")}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += String(seconds).padStart(2, "0");
  
  // 🌟 [핵심] 스마트 3분 쇼츠 & 가로 기획물(MV, 공식 음원, 라이브 무대, 예고편) 정밀 화이트리스트 판별
  let isShorts = false;

  if (totalSeconds > 0 && totalSeconds <= 180) { // 유튜브 공식 최대 3분(180초) 쇼츠 범위
    const title = (videoObj?.snippet?.title || videoObj?.title || "").toLowerCase();
    const description = (videoObj?.snippet?.description || videoObj?.description || "").toLowerCase();
    const channel = (videoObj?.snippet?.channelTitle || videoObj?.channelTitle || "").toLowerCase();

    // 1. 명시적인 쇼츠 키워드가 있는 경우 무조건 쇼츠!
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

    // 2. 가로 16:9 기획 영상 정밀 예외 판별 (글로벌 화이트리스트)
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
      // 🚀 3분 이하 중 위 가로 기획물이 아닌 것은 100% 쇼츠로 분류!
      isShorts = true;
    }
  }

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

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  region: string;
  isTop?: boolean;
}

export const ALL_COUNTRIES: CountryItem[] = [
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

const COUNTRIES = ALL_COUNTRIES;
const OTHER_COUNTRIES = ALL_COUNTRIES.filter((c) => !c.isTop);

const globalVideoCache = new Map<string, any>();

export default function RisingVideos() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(() => {
    const today = getKstTodayDateStr();
    return !globalVideoCache.has(`KR_all_${today}`);
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  const [loadingStatus, setLoadingStatus] = useState<"db" | "youtube" | null>(null);
  const [videos, setVideos] = useState<any[]>(() => {
    const today = getKstTodayDateStr();
    const cacheKey = `KR_all_${today}`;
    if (globalVideoCache.has(cacheKey)) {
      return globalVideoCache.get(cacheKey).data || [];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => getKstTodayDateStr());
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [selectedRegionGroup, setSelectedRegionGroup] = useState("top");

  // 🌟 [신규] 영상 포맷 필터: 'all' (전체) | 'video' (일반 동영상) | 'shorts' (유튜브 쇼츠)
  const [videoFormatFilter, setVideoFormatFilter] = useState<"all" | "video" | "shorts">("all");

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
  const [analyzedVideos, setAnalyzedVideos] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("creaibox_recent_analyzed_videos");
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return [];
  });
  const [visibleCount, setVisibleCount] = useState(20);

  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(64);
  const [bulkCurrentInfo, setBulkCurrentInfo] = useState("");
  const [refreshCooldown, setRefreshCooldown] = useState<number>(0);

  // 🚀 Instant RAM Cache for 0ms fluid category/country tab switching

  // Refresh cooldown removed upon request
  const formatCooldown = (seconds: number) => {
    return "";
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
        }
      } catch (e) {
        console.error("Failed to load recent reports from DB:", e);
      }
    }
    loadRecentReportsFromDb();
  }, []);

const COUNTRY_CODES = new Set(ALL_COUNTRIES.map((c) => c.code));

  // ⚡ 0ms Instant RAM Cache Warm-up for ALL 60 Countries on mount (Non-blocking async)
  useEffect(() => {
    let isCancelled = false;

    async function prewarmBundleCache() {
      try {
        const res = await fetch(`/api/youtube?type=trending-bundle&date=${selectedDate}`);
        if (!res.ok) return;
        const json = await res.json();
        if (isCancelled) return;

        if (json && json.bundle && typeof json.bundle === "object") {
          const bundleObj = json.bundle as Record<string, any[]>;

          setTimeout(() => {
            if (isCancelled) return;

            // 1. Populate raw keys into RAM cache first
            Object.keys(bundleObj).forEach((dbCatKey) => {
              if (Array.isArray(bundleObj[dbCatKey]) && bundleObj[dbCatKey].length > 0) {
                let countryCode = "KR";
                let catCode = dbCatKey;
                if (dbCatKey.includes("_")) {
                  const parts = dbCatKey.split("_");
                  if (COUNTRY_CODES.has(parts[0])) {
                    countryCode = parts[0];
                    catCode = dbCatKey.slice(parts[0].length + 1);
                  }
                } else {
                  countryCode = "KR";
                }
                const key = `${countryCode}_${catCode}_${selectedDate}`;
                globalVideoCache.set(key, {
                  source: "supabase-db-daily-bundle",
                  data: bundleObj[dbCatKey],
                });
              }
            });

            // 2. Aggregate all subcategories for each country's 'all' key to guarantee 100+ videos
            ALL_COUNTRIES.forEach((c) => {
              const countryCode = c.code;
              const combined: any[] = [];
              const seenIds = new Set<string>();
              const prefix = countryCode === "KR" ? "" : `${countryCode}_`;

              Object.keys(bundleObj).forEach((k) => {
                const isMatch = countryCode === "KR"
                  ? (k === "all" || k.startsWith("KR_") || (!k.includes("_") && !/^[A-Z]{2}_/.test(k)))
                  : k.startsWith(prefix);
                if (isMatch && Array.isArray(bundleObj[k])) {
                  bundleObj[k].forEach((v) => {
                    if (v && v.id && !seenIds.has(v.id)) {
                      seenIds.add(v.id);
                      combined.push(v);
                    }
                  });
                }
              });

              if (combined.length > 0) {
                combined.sort((a, b) => {
                  const vA = Number(a.statistics?.viewCount || a.viewCount || 0);
                  const vB = Number(b.statistics?.viewCount || b.viewCount || 0);
                  return vB - vA;
                });
                const allCacheKey = `${countryCode}_all_${selectedDate}`;
                globalVideoCache.set(allCacheKey, {
                  source: "supabase-db-daily-bundle",
                  data: combined,
                });
              }
            });

            // 3. If current selected country key is in RAM cache, set videos immediately
            const currentKey = `${selectedCountry}_${activeCategory}_${selectedDate}`;
            if (globalVideoCache.has(currentKey)) {
              const cached = globalVideoCache.get(currentKey);
              setVideos(cached.data || []);
              setSource(cached.source || "supabase-db-daily-bundle");
              setLoading(false);
            }
          }, 0);
        }
      } catch (e) {
        console.error("prewarmBundleCache error:", e);
      }
    }

    prewarmBundleCache();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate, selectedCountry, activeCategory]);

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
      globalVideoCache.delete(cacheKey);
    } else if (globalVideoCache.has(cacheKey)) {
      // 🚀 0ms Instant RAM cache hit: no loading screen flash!
      const cached = globalVideoCache.get(cacheKey);
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
        if (result.error) {
          throw new Error(result.error);
        }
      }



      globalVideoCache.set(cacheKey, result);

      // 🚀 Pre-populate category sub-caches from "all" feed ONLY if category videos exist in the feed
      if (catId === "all" && Array.isArray(result.data)) {
        CATEGORIES.forEach((cat) => {
          if (cat.id === "all") return;
          const catVideos = result.data.filter(
            (v: any) => v.categoryId === cat.id || v.snippet?.categoryId === cat.id
          );
          if (catVideos.length > 0) {
            const subCacheKey = `${country}_${cat.id}_${targetDate}`;
            globalVideoCache.set(subCacheKey, {
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
    setBulkCurrentInfo("🚀 12개 주요국 2-Phase 스마트 트렌드 일괄 수집 시작 (100개 수집 + 20개 핀포인트 보충)...");
    globalVideoCache.clear();

    try {
      const cronRes = await fetch("/api/cron/sync-trending");
      if (!cronRes.ok) {
        throw new Error(`Cron sync returned HTTP ${cronRes.status}`);
      }
      const cronData = await cronRes.json();
      console.log("Cron 2-Phase sync completed:", cronData);

      setBulkProgress(ALL_COUNTRIES.length);
      setBulkCurrentInfo(`🎉 12개 주요국 트렌드 수집 완료! (${cronData.summary?.storedKeysCount || 0}개 트렌드 키 최신화)`);
      localStorage.setItem("creaibox_last_refresh_timestamp", Date.now().toString());
      setRefreshCooldown(10800);
      
      // Reload current view with freshly built DB bundle
      await fetchTrending(activeCategory, selectedDate, selectedCountry, true);
    } catch (err: any) {
      console.error("Bulk sync failed:", err);
      setBulkCurrentInfo("⚠️ 일괄 수집 중 오류가 발생했습니다: " + (err.message || String(err)));
    } finally {
      setTimeout(() => {
        setIsBulkLoading(false);
      }, 2000);
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

  // 🌟 영상 통계 집계 (전체 / 일반 동영상 / 유튜브 쇼츠)
  const videoStats = useMemo(() => {
    let videoCount = 0;
    let shortsCount = 0;
    videos.forEach((v) => {
      const durationInfo = parseDuration(v.contentDetails?.duration || v.duration, v);
      if (durationInfo.isShorts) {
        shortsCount++;
      } else {
        videoCount++;
      }
    });
    return {
      all: videos.length,
      video: videoCount,
      shorts: shortsCount,
    };
  }, [videos]);

  // 🌟 포맷 필터링 적용된 영상 목록
  const filteredVideos = useMemo(() => {
    if (videoFormatFilter === "video") {
      return videos.filter((v) => {
        const durationInfo = parseDuration(v.contentDetails?.duration || v.duration, v);
        return !durationInfo.isShorts;
      });
    }
    if (videoFormatFilter === "shorts") {
      return videos.filter((v) => {
        const durationInfo = parseDuration(v.contentDetails?.duration || v.duration, v);
        return durationInfo.isShorts;
      });
    }
    return videos;
  }, [videos, videoFormatFilter]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const isTodaySelected = selectedDate === getKstTodayDateStr();

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              급상승 영상 트렌드
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-zinc-400 mt-1">
              유튜브 실시간 알고리즘이 선정한 지금 이 시각 시청 유입 반응이 가장 폭발적인 급상승 이슈 랭킹을 제공합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={handleBulkSync}
              disabled={loading || isBulkLoading || !isTodaySelected}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded bg-orange-600 hover:bg-orange-500 disabled:opacity-30 px-3.5 text-xs font-semibold text-white transition shadow-xs cursor-pointer"
            >
              {isBulkLoading ? <Loader2 size={13} className="animate-spin" /> : <Flame size={13} />}
              {isTodaySelected ? "전체 12개국 일괄수집" : "일괄수집 불가"}
            </button>

            <button
              onClick={() => fetchTrending(activeCategory, selectedDate, selectedCountry, true)}
              disabled={loading || isBulkLoading || !isTodaySelected}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-30 px-3.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition shadow-xs cursor-pointer"
            >
              {loading ? <Loader2 size={13} className="animate-spin text-orange-500" /> : <Flame size={13} className="text-orange-500" />}
              {isTodaySelected ? "새로고침" : "새로고침 불가"}
            </button>
          </div>
        </div>
      </div>

      {isBulkLoading && (
        <div className="rounded-md border border-orange-500/20 bg-zinc-950/40 p-3 shadow-xs space-y-1.5 animate-pulse">
          <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin text-orange-500" />
              {bulkCurrentInfo}
            </span>
            <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-sm border border-orange-500/20 text-[10px]">
              {bulkProgress} / {bulkTotal} ({(bulkProgress / bulkTotal * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-sm overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-orange-600 to-amber-400 h-full transition-all duration-300 rounded-sm"
              style={{ width: `${(bulkProgress / bulkTotal * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 🌐 필터 허브 */}
      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch gap-3.5 w-full">
        {/* 포맷 선택 */}
        <div className="w-full sm:w-[155px] shrink-0 flex flex-col justify-center gap-1.5">
          <button
            onClick={() => setVideoFormatFilter("all")}
            className={`flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer border ${
              videoFormatFilter === "all"
                ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xs"
                : "bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>🌟</span>
              <span className="whitespace-nowrap">전체 보기</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
              videoFormatFilter === "all" ? "bg-white/20 dark:bg-black/20 text-white dark:text-zinc-900" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"
            }`}>
              {videoStats.all}
            </span>
          </button>

          <button
            onClick={() => setVideoFormatFilter("video")}
            className={`flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer border ${
              videoFormatFilter === "video"
                ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                : "bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Film size={13} className={videoFormatFilter === "video" ? "text-white" : "text-blue-500"} />
              <span className="whitespace-nowrap">일반 동영상</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
              videoFormatFilter === "video" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"
            }`}>
              {videoStats.video}
            </span>
          </button>

          <button
            onClick={() => setVideoFormatFilter("shorts")}
            className={`flex items-center justify-between px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer border ${
              videoFormatFilter === "shorts"
                ? "bg-red-600 text-white border-red-500 shadow-xs"
                : "bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Play size={11} fill="currentColor" className={videoFormatFilter === "shorts" ? "text-white" : "text-red-500"} />
              <span className="whitespace-nowrap">유튜브 쇼츠</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
              videoFormatFilter === "shorts" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"
            }`}>
              {videoStats.shorts}
            </span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="hidden sm:block w-[1px] self-stretch bg-zinc-200 dark:bg-zinc-800" />

        {/* 국가 + 카테고리 선택 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          {/* 국가 선택 */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_COUNTRIES.map((ct) => (
              <button
                key={ct.code}
                onClick={() => handleCountryChange(ct.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition flex items-center gap-1.5 shrink-0 whitespace-nowrap border cursor-pointer ${
                  selectedCountry === ct.code
                    ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold shadow-xs"
                    : "bg-white dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="text-sm leading-none">{ct.flag}</span>
                <span>{ct.name}</span>
              </button>
            ))}
          </div>

          {/* 카테고리 선택 */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition shrink-0 whitespace-nowrap border cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent font-bold"
                    : "bg-white dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Split Layout Wrapper */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Video List & Status Messages */}
        <div className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 p-4 text-xs font-bold text-red-400">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3.5 bg-zinc-900/40 rounded-md border border-zinc-800/80 p-8 shadow-inner">
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
            <div className="text-center py-20 border border-zinc-800/80 rounded-md bg-zinc-950/60 p-8 space-y-3 shadow-inner">
              <div className="text-4xl">🌐</div>
              <p className="text-sm text-zinc-100 font-extrabold">
                [{getCountryName(selectedCountry)}] 해당 국가의 급상승 트렌드 수집 데이터가 없습니다.
              </p>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-md mx-auto">
                선택하신 날짜({selectedDate})는 CreaiBox DB 구축 이전 기간이거나 포털/유튜브 API 제공 범위 외 데이터입니다.
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
                
                const durationInfo = parseDuration(video.contentDetails?.duration || video.duration, video);
                const isShorts = durationInfo.isShorts;

                return (
                  <div key={idx} className="group rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700 transition flex flex-col justify-between shadow-xs overflow-hidden">
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
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                            <div className="flex h-9 w-13 items-center justify-center rounded bg-red-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                              <Play size={15} fill="currentColor" className="ml-0.5" />
                            </div>
                          </div>
                          
                          {/* Index badge */}
                          <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-sm bg-black/75 text-[11px] font-bold text-white">
                            {idx + 1}
                          </div>
     
                          {/* Format/Shorts Label */}
                          {isShorts && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                              <Play size={9} fill="currentColor" className="ml-0.5" />
                              SHORTS
                            </div>
                          )}
     
                          {/* Playtime duration overlay */}
                          <div className="absolute bottom-2 right-2 rounded-sm bg-black/85 px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">
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
                          <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-sm bg-black/75 text-[11px] font-bold text-white">
                            {idx + 1}
                          </div>
                        </div>
                      )}
     
                      {/* Title & Channel padded container */}
                      <div className="px-4 pt-3">
                        {videoId ? (
                          <button
                            onClick={() => setPlayingVideoId(videoId)}
                            className="block text-left w-full text-sm font-bold text-slate-900 dark:text-white line-clamp-1 truncate leading-normal hover:text-orange-500 transition cursor-pointer"
                          >
                            {title}
                          </button>
                        ) : (
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 truncate leading-normal">
                            {title}
                          </h3>
                        )}
                        
                        <div className="mt-1 flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                          <span className="truncate max-w-[140px] text-slate-700 dark:text-zinc-300 font-semibold">{channel}</span>
                          <span className="text-slate-300 dark:text-zinc-700">·</span>
                          <span>조회수 {formatNumber(viewCount)}</span>
                          <span className="text-slate-300 dark:text-zinc-700">·</span>
                          <span>좋아요 {formatNumber(likeCount)}</span>
                        </div>
                      </div>
                    </div>
     
                    {/* Action Button Bar */}
                    <div className="mt-3 border-t border-slate-100 dark:border-zinc-800/60 pt-2.5 mx-4 mb-2.5 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                      {videoId && typeof videoId === "string" && (
                        <button
                          onClick={() => handleTriggerAnalysis(video)}
                          className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition font-bold cursor-pointer"
                        >
                          <BarChart2 size={12} />
                          <span>AI 분석</span>
                        </button>
                      )}
                      {videoId && typeof videoId === "string" && (
                        <button
                          onClick={() => handleCopyLink(videoId)}
                          className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                        >
                          {copiedVideoId === videoId ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-500">복사 완료</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>링크 복사</span>
                            </>
                          )}
                        </button>
                      )}
                      {videoId && typeof videoId === "string" && (
                        <a
                          href={`https://www.youtube.com/watch?v=${videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition font-medium"
                        >
                          <PlaySquare size={11} />
                          <span>YouTube</span>
                        </a>
                      )}
                      {video.snippet?.channelId && (
                        <a
                          href={`https://youtube.com/channel/${video.snippet.channelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition"
                        >
                          <ExternalLink size={11} />
                          <span>채널</span>
                        </a>
                      )}
                      {videoId && typeof videoId === "string" && (
                        <a
                          href={`/studio/youtube/seo?url=https://youtube.com/watch?v=${videoId}`}
                          className="inline-flex items-center gap-0.5 hover:text-slate-900 dark:hover:text-white transition"
                        >
                          SEO
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
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium text-right mt-4">
              데이터 피드: {source === "youtube-api" ? "YouTube Live Data API" : source.startsWith("supabase-db") ? "Supabase Table Cache" : "Vault Fallback System"}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Aside AI Report News Feed */}
        <aside className="lg:sticky lg:top-6 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 space-y-4 max-h-[89vh] overflow-y-auto shadow-xs self-start w-full">
          {/* 📅 Date Selector Control Row */}
          <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">분석 기준일 선택</span>
            <div className="flex items-center justify-between w-full">
              {/* Archive Mode Status */}
              <div className="min-h-8 flex items-center">
                {!isTodaySelected ? (
                  <span className="inline-flex h-6.5 items-center rounded-sm bg-cyan-500/10 border border-cyan-500/30 px-2 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    아카이브 모드
                  </span>
                ) : (
                  <span className="inline-flex h-6.5 items-center rounded-sm bg-emerald-500/10 border border-emerald-500/30 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                    실시간 트렌드
                  </span>
                )}
              </div>
              
              {/* Timeline shift and date selector container */}
              <div className="flex items-center bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-0.5 rounded shadow-xs">
                <button
                  onClick={() => shiftDate(-1)}
                  disabled={loading}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-20 transition cursor-pointer"
                  title="하루 전"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="relative flex items-center">
                  <Calendar size={12} className="absolute left-2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={getKstTodayDateStr()}
                    className="h-6 w-28 border-0 bg-transparent pl-7 pr-1 text-[11px] font-semibold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => shiftDate(1)}
                  disabled={loading || isTodaySelected}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-20 transition cursor-pointer"
                  title="하루 후"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BarChart2 className="text-orange-500" size={15} />
              최근 분석된 AI 리포트
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
              참여 비율과 기획 Blueprint 생성이 완료된 리포트입니다. 클릭 시 상세 보고서가 팝업됩니다.
            </p>
          </div>

          <div className="space-y-2">
            {analyzedVideos.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center bg-slate-50/50 dark:bg-zinc-950/20">
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  아직 분석 완료된 AI 리포트가 없습니다. <br />
                  좌측 카드의 <span className="text-orange-600 dark:text-orange-400 font-bold">"AI 분석"</span>을 클릭하여 리포트를 발행해 보세요.
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
                    className="group flex items-center gap-2.5 rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 p-2 hover:bg-slate-50 dark:hover:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700 transition cursor-pointer overflow-hidden shadow-xs"
                  >
                    {/* News Thumbnail */}
                    <div className="relative h-10 w-18 overflow-hidden rounded-sm bg-zinc-950 shrink-0">
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
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-zinc-500 font-medium">
                        <span className="text-slate-700 dark:text-zinc-400 truncate max-w-[80px] font-semibold">{channel}</span>
                        <span>·</span>
                        <span>조회 {formatNumber(viewCount)}</span>
                      </div>
                      <h3 className="mt-0.5 text-[11px] font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition leading-normal">
                        {title}
                      </h3>
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-orange-600 dark:text-orange-400 font-semibold">
                        ● AI 분석 완료
                      </span>
                    </div>

                    {/* Arrow icon */}
                    <div className="text-slate-400 dark:text-zinc-600 group-hover:text-orange-500 transition shrink-0">
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
