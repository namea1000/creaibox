"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flame, Loader2, Play, Eye, ThumbsUp, Calendar, ArrowRight, Copy, Check, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
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
  { label: "뮤직", id: "10" },
  { label: "게임", id: "20" },
  { label: "엔터테인먼트", id: "24" },
  { label: "영화/애니", id: "1" },
  { label: "테크/IT", id: "28" },
  { label: "스포츠", id: "17" },
  { label: "뉴스/시사", id: "25" },
];

const COUNTRIES = [
  { code: "KR", name: "대한민국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "BR", name: "브라질", flag: "🇧🇷" },
  { code: "CA", name: "캐나다", flag: "🇨🇦" }
];

export default function RisingVideos() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => getKstTodayDateStr());
  const [selectedCountry, setSelectedCountry] = useState("KR");
  const [source, setSource] = useState("api");
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [selectedVideoForAnalysis, setSelectedVideoForAnalysis] = useState<any>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analyzedVideos, setAnalyzedVideos] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  // 1. Recover recent analyzed reports from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem("creaibox_recent_analyzed_videos");
    if (cached) {
      try {
        setAnalyzedVideos(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to restore recent analyzed videos:", e);
      }
    }
  }, []);

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

  const fetchTrending = useCallback(async (catId = activeCategory, targetDate = selectedDate, country = selectedCountry) => {
    setPlayingVideoId(null);
    setLoading(true);
    setError(null);
    setVisibleCount(20); // Reset page count on new fetch
    try {
      const res = await fetch(`/api/youtube?type=trending&categoryId=${catId}&date=${targetDate}&country=${country}`);
      if (!res.ok) throw new Error("급상승 비디오 리스트를 가져오는데 실패했습니다.");
      const result = await res.json();
      setVideos(result.data || []);
      setSource(result.source);

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
    }
  }, [activeCategory, selectedDate, selectedCountry]);

  useEffect(() => {
    fetchTrending("all", getKstTodayDateStr(), "KR");
  }, []);

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
    const c = COUNTRIES.find((x) => x.code === code);
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
              현재 유튜브 {getCountryName(selectedCountry)} 급상승 트렌드 리스트에 등록된 상위 인기 동영상 리스트를 가져와 조회수 분석을 제공합니다.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-bold">
              매일 오전 05시에 AI가 자동으로 급상승 트렌드 영상을 수집하는 자동 아카이브 시스템입니다. <br/>
              각 영상 하단의 <span className="text-orange-500 font-black">"AI 데이터 분석 리포트"</span> 버튼을 클릭하면 고성능 <span className="text-orange-500 font-black">"AI Gemini Pro"</span>가 시청자 반응 지표와 핵심 바이럴 요인, 내 채널용 변형 기획안을 포함한 정밀 보고서를 작성해 팝업합니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchTrending(activeCategory, selectedDate, selectedCountry)}
          disabled={loading || !isTodaySelected}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-orange-600 px-5 text-xs font-black text-white transition shrink-0 self-start sm:self-center"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} />}
          {isTodaySelected ? "새로고침" : "새로고침 불가"}
        </button>
      </div>

      {/* 🌐 Central Filter Hub (Global Country + Category Selectors) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-md space-y-3.5 shadow-2xl shadow-black/25 flex flex-col items-center w-full">
        {/* 1. Country Selector (Large & Centered) */}
        <div className="flex flex-wrap justify-center gap-2 max-w-5xl w-full">
          {COUNTRIES.map((ct) => (
            <button
              key={ct.code}
              onClick={() => handleCountryChange(ct.code)}
              className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 border-2 ${
                selectedCountry === ct.code
                  ? "bg-orange-950/30 border-orange-500/70 text-white shadow-lg shadow-orange-950/40 transform scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{ct.flag}</span>
              <span>{ct.name}</span>
            </button>
          ))}
        </div>

        {/* Separator Divider */}
        <div className="h-[1px] w-full bg-zinc-850/60" />

        {/* 2. Category Selector & Tabs (Centered) */}
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 text-xs font-black rounded-lg transition border-2 ${
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
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-xs font-bold text-zinc-500">실시간 유튜브 트렌드 스캔 중...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20 border border-zinc-850 rounded-2xl bg-zinc-950/20">
              <p className="text-xs text-zinc-500 font-bold">이 조건에 부합하는 트렌드 영상이 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
              {displayedVideos.map((video, idx) => {
                const videoId = video.id;
                const title = video.snippet?.title || "제목 없음";
                const channel = video.snippet?.channelTitle || "채널 정보 없음";
                const thumbnail = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || "/placeholder.jpg";
                const viewCount = video.statistics?.viewCount || "0";
                const likeCount = video.statistics?.likeCount || "0";
                
                const durationInfo = parseDuration(video.contentDetails?.duration);
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
                const title = video.snippet?.title || "제목 없음";
                const channel = video.snippet?.channelTitle || "채널 정보 없음";
                const thumbnail = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || "/placeholder.jpg";
                const viewCount = video.statistics?.viewCount || "0";
                
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
