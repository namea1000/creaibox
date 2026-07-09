"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Search, Loader2, PlayCircle, Calendar, Eye, Database, Sparkles, ArrowRight, Play, ThumbsUp, MessageSquare, Trash2, Plus, Check, ArrowLeft, Copy, ExternalLink } from "lucide-react";
import VideoAnalysisModal from "./VideoAnalysisModal";

type RecommendationChannel = {
  name: string;
  handle: string;
  category: string;
  avatar?: string;
  desc: string;
  subscribers: string;
  views: string;
  videos: string;
  country: string; // "KR", "US", "JP", etc.
  isUserAdded?: boolean;
};

type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

const COUNTRIES: CountryOption[] = [
  { code: "KR", name: "대한민국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "BR", name: "브라질", flag: "🇧🇷" },
  { code: "CA", name: "캐나다", flag: "🇨🇦" }
];

// Curated real benchmark channels for users (exactly 20 channels per category/country)
import { BENCHMARK_CHANNELS, EXTENDED_BENCHMARK_CHANNELS } from "./benchmarkChannels";

const CATEGORIES = ["나의 채널", "전체", "테크/IT", "게임", "뮤직", "엔터테인먼트", "영화/애니", "뉴스/시사", "스포츠"];

export default function ChannelDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleParam = searchParams.get("handle");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom user radar channels list
  const [radarChannels, setRadarChannels] = useState<RecommendationChannel[]>([]);
  
  // Hybrid avatar loading states
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState("전체");
  
  // 🌐 Country Filter States
  const [selectedCountry, setSelectedCountry] = useState("KR");

  // Video Analysis Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Outperformer radar sorting states
  const [videoSortKey, setVideoSortKey] = useState<"default" | "views" | "likes" | "comments">("default");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Load custom radar channels from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userRadarChannels");
      if (stored) {
        setRadarChannels(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore userRadarChannels", e);
    }
  }, []);

  // Monitor url query param '?handle=' and trigger search/reset accordingly
  useEffect(() => {
    setPlayingVideoId(null);
    if (handleParam) {
      setQuery(handleParam);
      void handleSearch(handleParam);
    } else {
      setData(null);
      setQuery("");
    }
  }, [handleParam]);

  const handleSearch = async (targetQuery = query) => {
    const activeSearchQuery = targetQuery || query;
    if (!activeSearchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/youtube?type=channel&query=${encodeURIComponent(activeSearchQuery)}`);
      if (!res.ok) throw new Error("채널 정보를 가져오는데 실패했습니다.");
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      
      // LocalStorage 캐시에 실시간 채널 정보 저장 (Top 300 리스트와 연동 브릿지)
      try {
        const cached = localStorage.getItem("yt_channel_cache");
        const cacheMap = cached ? JSON.parse(cached) : {};
        const key = (result.handle || activeSearchQuery || "").toLowerCase();
        if (key) {
          cacheMap[key] = {
            subscribers: result.subscribers,
            views: result.views,
            videos: result.videos,
            timestamp: Date.now()
          };
          localStorage.setItem("yt_channel_cache", JSON.stringify(cacheMap));
        }
      } catch (e) {
        console.error("Failed to write to channel cache", e);
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/studio/youtube/channel?handle=${encodeURIComponent(query)}`);
  };

  const handleRecommendClick = (handle: string) => {
    router.push(`/studio/youtube/channel?handle=${encodeURIComponent(handle)}`);
  };

  const handleOpenReport = (video: any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const formatNumber = (numStr: string | number) => {
    const num = Number(numStr);
    if (isNaN(num)) return String(numStr);
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  // Convert subscriber string (e.g. 1720만, 260만, 45만) to absolute number for sorting
  const parseSubscribers = (subStr: string): number => {
    const num = parseFloat(subStr.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return 0;
    if (subStr.includes("억")) return num * 100000000;
    if (subStr.includes("만")) return num * 10000;
    if (subStr.includes("천")) return num * 1000;
    return num;
  };

  // Extract clean keywords tag cloud from raw youtube keywords string
  const parseKeywords = (keywordsStr?: string): string[] => {
    if (!keywordsStr) return [];
    return keywordsStr
      .split(/[\s,]+/)
      .map((k) => k.replace(/["']/g, "").trim())
      .filter((k) => k.length > 1 && k.length < 20 && !k.startsWith("http"))
      .slice(0, 15);
  };

  // Toggle add/remove from my custom radar channels list
  const handleToggleRadar = () => {
    if (!data || !data.channel) return;
    const channelSnippet = data.channel.snippet;
    const channelStats = data.channel.statistics;
    const rawUrl = channelSnippet.customUrl || channelSnippet.title.replace(/\s+/g, "");
    const handle = rawUrl.startsWith("@") ? rawUrl : `@${rawUrl}`;

    const isAdded = radarChannels.some((ch) => ch.handle.toLowerCase() === handle.toLowerCase());

    if (isAdded) {
      // Remove
      const updated = radarChannels.filter((ch) => ch.handle.toLowerCase() !== handle.toLowerCase());
      setRadarChannels(updated);
      localStorage.setItem("userRadarChannels", JSON.stringify(updated));
    } else {
      // Add
      const newChannel: RecommendationChannel = {
        name: channelSnippet.title,
        handle: handle,
        category: "나의 채널",
        avatar: channelSnippet.thumbnails.medium?.url || "",
        desc: channelSnippet.description || "사용자가 등록한 벤치마킹 분석 타겟 채널입니다.",
        subscribers: formatNumber(channelStats.subscriberCount),
        views: formatNumber(channelStats.viewCount),
        videos: `${channelStats.videoCount}개`,
        country: channelSnippet.country || "KR",
        isUserAdded: true,
      };
      const updated = [newChannel, ...radarChannels];
      setRadarChannels(updated);
      localStorage.setItem("userRadarChannels", JSON.stringify(updated));
    }
  };

  // Direct remove button from cards
  const handleRemoveRadarCard = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid recommend click triggering search
    const updated = radarChannels.filter((ch) => ch.handle.toLowerCase() !== handle.toLowerCase());
    setRadarChannels(updated);
    localStorage.setItem("userRadarChannels", JSON.stringify(updated));
  };

  // Determine filtered benchmark list
  const isMyChannelSelected = activeCategory === "나의 채널";
  const filteredBenchmarks = isMyChannelSelected
    ? radarChannels
    : EXTENDED_BENCHMARK_CHANNELS.filter((ch) => {
        const matchCountry = ch.country === selectedCountry;
        const matchCategory = activeCategory === "전체" || ch.category === activeCategory;
        return matchCountry && matchCategory;
      }).slice(0, 48);

  // Dynamic sorting based on subscribers count (descending)
  const sortedBenchmarks = [...filteredBenchmarks].sort((a, b) => {
    return parseSubscribers(b.subscribers) - parseSubscribers(a.subscribers);
  });

  // Check if current search result is in radar list
  const currentHandle = data?.channel?.snippet?.customUrl || "";
  const isCurrentInRadar = currentHandle
    ? radarChannels.some((ch) => ch.handle.toLowerCase() === currentHandle.toLowerCase())
    : false;

  // Dynamic sorting of recent videos
  const sortedVideos = (() => {
    if (!data || !data.recentVideos) return [];
    const list = [...data.recentVideos];
    if (videoSortKey === "default") return list;

    return list.sort((a: any, b: any) => {
      let valA = 0;
      let valB = 0;

      if (videoSortKey === "views") {
        valA = Number(a.statistics?.viewCount || 0);
        valB = Number(b.statistics?.viewCount || 0);
      } else if (videoSortKey === "likes") {
        valA = Number(a.statistics?.likeCount || 0);
        valB = Number(b.statistics?.likeCount || 0);
      } else if (videoSortKey === "comments") {
        valA = Number(a.statistics?.commentCount || 0);
        valB = Number(b.statistics?.commentCount || 0);
      }

      return valB - valA; // Descending
    });
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-red-500" size={20} />
          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full">
            BENCHMARK RADAR
          </span>
        </div>
        <h2 className="flex items-center gap-2 text-2xl font-black text-white mb-2">
          <Users className="text-red-500 animate-pulse" size={24} />
          채널 상세 및 아웃라이어 분석
        </h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-semibold">
          유튜브 채널 명칭이나 핸들(@이름)을 입력하여 구독자 대비 조회수가 비정상적으로 높게 터진 <strong className="text-red-400">"숨은 꿀 영상(Outperformer)"</strong>을 선별하고 기획 요인을 파헤칩니다.
        </p>

        <form onSubmit={handleFormSubmit} className="flex gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="분석할 유튜브 채널의 핸들 또는 이름 입력 (예: @itsub, 잇섭)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-650 px-6 text-xs font-black text-white hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            채널 심층 분석
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Recommended Benchmarking Channels Area (Displayed when not loaded or searching) */}
      {!data && !loading && (
        <div className="space-y-6">
          {/* 🌐 Central Filter Hub (Global Country + Category Selectors) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/20 p-6 backdrop-blur-md space-y-5.5 shadow-2xl shadow-black/25 flex flex-col items-center">
            
            {/* 1. Header Title & Description (Now at the top) */}
            <div className="text-center space-y-1.5 pt-1">
              <h3 className="text-sm font-black text-white flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-yellow-500" />
                카테고리별 추천 벤치마킹 라이벌 채널
              </h3>
              <p className="text-[11px] text-zinc-500 font-bold mt-0.5">
                분야별 구독자 순으로 정렬된 대표 채널 목록입니다. 클릭 시 즉시 분석이 실행됩니다.
              </p>
              {isMyChannelSelected && (
                <div className="pt-1">
                  <span className="text-[9px] text-red-400 font-bold bg-red-950/35 border border-red-900/35 px-2 py-0.5 rounded animate-pulse inline-block">
                    나의 채널 탭은 국가 필터가 적용되지 않습니다
                  </span>
                </div>
              )}
            </div>

            {/* Inner selectors wrapper with tighter spacing */}
            <div className="w-full flex flex-col items-center space-y-3.5">
              {/* 2. Country Selector (Large & Centered) */}
              <div className="flex flex-wrap justify-center gap-2 max-w-5xl w-full">
                {COUNTRIES.map((ct) => (
                  <button
                    key={ct.code}
                    disabled={isMyChannelSelected}
                    onClick={() => setSelectedCountry(ct.code)}
                    className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 border-2 ${
                      isMyChannelSelected
                        ? "opacity-30 cursor-not-allowed bg-zinc-900/50 border-zinc-850 text-zinc-650"
                        : selectedCountry === ct.code
                        ? "bg-red-950/30 border-red-500/70 text-white shadow-lg shadow-red-950/40 transform scale-105"
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

              {/* 3. Category Selector & Tabs (Centered & Close) */}
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition border-2 ${
                      activeCategory === cat
                        ? "bg-red-650 border-red-500 text-white shadow-md shadow-red-650/15"
                        : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty placeholders for custom channels */}
          {isMyChannelSelected && sortedBenchmarks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-800 p-12 text-center max-w-lg mx-auto space-y-3.5 my-6 bg-zinc-900/5">
              <div className="mx-auto h-12 w-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-650">
                <Users size={20} />
              </div>
              <h4 className="text-sm font-black text-zinc-300">나만의 레이더 채널이 비어 있습니다</h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                위 검색창에 모니터링하려는 유튜브 채널을 입력하여 분석한 뒤, 결과 화면에서 <strong className="text-red-400">"나의 레이더에 추가"</strong> 버튼을 눌러 본인만의 벤치마킹 라이브러리를 구축해 보세요.
              </p>
            </div>
          ) : (
            /* Cards Grid sorted by subscribers */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedBenchmarks.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRecommendClick(ch.handle)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 hover:border-red-500/30 hover:bg-zinc-900/40 transition cursor-pointer overflow-hidden text-left"
                >
                  {/* Delete button display for user custom channels */}
                  {isMyChannelSelected && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRadarCard(ch.handle, e)}
                      className="absolute top-3.5 right-3.5 h-6 w-6 rounded bg-zinc-950/80 hover:bg-red-950 border border-zinc-850 hover:border-red-900/50 flex items-center justify-center text-zinc-500 hover:text-red-400 transition"
                      title="레이더에서 삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-13 w-13 overflow-hidden rounded-full border border-red-500/20 shrink-0 bg-gradient-to-br from-red-650/35 to-zinc-950/80 flex items-center justify-center text-red-350 font-black text-base shadow-inner shadow-black/40">
                        {ch.avatar ? (
                          <img
                            src={ch.avatar}
                            alt={ch.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                            }}
                          />
                        ) : !imageErrors[ch.handle] ? (
                          <img
                            src={`https://unavatar.io/youtube/${ch.handle.replace("@", "")}`}
                            alt={ch.name}
                            className="h-full w-full object-cover"
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [ch.handle]: true }));
                            }}
                          />
                        ) : (
                          ch.name.charAt(0)
                        )}
                      </div>
                      <div className="pr-6">
                        <h4 className="text-sm sm:text-base font-black text-white group-hover:text-red-400 transition leading-tight line-clamp-1">{ch.name}</h4>
                        <p className="text-xs text-zinc-500 font-bold mt-1">{ch.handle}</p>
                      </div>
                    </div>

                    {/* 3-Metric Statistics Grid */}
                    <div className="grid grid-cols-3 gap-1 bg-zinc-950/65 p-2 rounded-xl text-center border border-zinc-850/60 shadow-inner">
                      <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">구독자</p>
                        <p className="text-xs text-red-400 font-black mt-0.5">{ch.subscribers}</p>
                      </div>
                      <div className="border-x border-zinc-850/65">
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">총조회수</p>
                        <p className="text-xs text-orange-400 font-black mt-0.5">{ch.views}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">동영상수</p>
                        <p className="text-xs text-cyan-400 font-black mt-0.5">{ch.videos}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-350 leading-relaxed font-bold line-clamp-2 bg-zinc-950/20 p-2.5 rounded-lg border border-zinc-850">
                      {ch.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-850/60 flex items-center justify-between text-xs font-black text-zinc-500 group-hover:text-red-400 transition">
                    <span className="bg-zinc-950 px-2 py-0.5 rounded text-[10px] border border-zinc-850 font-bold flex items-center gap-1">
                      <span>{COUNTRIES.find((c) => c.code === ch.country)?.flag || "🌐"}</span>
                      <span>{ch.category}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">채널 레이더 가동 <ArrowRight size={13} /></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-xs font-black text-zinc-500">YouTube Data API 호출 및 최근 업로드 메타데이터 수집 중...</p>
        </div>
      )}

      {/* Search results mapping outperformer indicators */}
      {data && data.channel && (
        <div className="flex flex-col space-y-4">
          {/* ⚠️ 유튜브 API 쿼터 초과 시 솔직/투명 안내 배너 노출 */}
          {data.source === "mock-fallback" && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4.5 text-left space-y-2">
              <h4 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                ⚠️ 유튜브 라이브 통계 제한 안내 (API 할당량 초과)
              </h4>
              <p className="text-[11px] font-bold text-zinc-400 leading-relaxed">
                현재 구글/유튜브 본사 API의 실시간 호출 한도(일일 트래픽 Quota)가 소진되어 실시간 데이터 연동이 일시적으로 제한된 상태입니다.
                <br />
                이에 따라 신뢰할 수 없는 허위 가짜 값을 표출하는 대신, <strong>정합성이 검증된 벤치마킹 기준 데이터</strong>로 대체하여 안내 배너와 통계를 표기하고 있습니다. 
                <br />
                유튜브 본사 서버의 리셋 시각(매일 오후 5시 전후) 이후에는 자동으로 정상적인 실시간 핫 라이브 정보 조회가 재개됩니다.
              </p>
            </div>
          )}

          {/* Back to list button */}
          <button
            onClick={() => router.push("/studio/youtube/channel")}
            className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white transition bg-zinc-950/60 border border-zinc-850 px-4 py-2.5 rounded-xl self-start"
          >
            <ArrowLeft size={14} /> 추천 목록으로 돌아가기
          </button>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column: Channel Overview Card & Meta Data Details */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden backdrop-blur-md">
                {/* Channel Banner Image */}
                <div className="relative w-full h-24 sm:h-28 bg-zinc-950 overflow-hidden">
                  {data.channel.brandingSettings?.image?.bannerExternalUrl ? (
                    <img
                      src={data.channel.brandingSettings.image.bannerExternalUrl}
                      alt="Channel Banner"
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-red-950/30 via-zinc-900/80 to-zinc-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
                </div>

                <div className="relative px-5 pb-6 text-center space-y-4 -mt-10">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-900 bg-zinc-950 shadow-xl relative z-10">
                    <img
                      src={data.channel.snippet.thumbnails.medium?.url || "/placeholder.jpg"}
                      alt={data.channel.snippet.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{data.channel.snippet.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-bold">
                      {data.channel.snippet.customUrl?.startsWith("@") 
                        ? data.channel.snippet.customUrl 
                        : `@${data.channel.snippet.customUrl || ""}`}
                    </p>
                  </div>

                  {/* Scrollable full description */}
                  <div className="text-left bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-850">
                    <p className="text-[10px] font-black text-zinc-400 mb-1">채널 소개</p>
                    <div className="text-[11px] leading-relaxed text-zinc-350 font-bold max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                      {data.channel.snippet.description || "채널 설명이 없습니다."}
                    </div>
                  </div>

                  {/* 3-Metric stats labels and values */}
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center flex flex-col justify-between min-h-[76px]">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400">구독자</p>
                        <p className="text-sm font-black text-red-400 mt-0.5">{formatNumber(data.channel.statistics.subscriberCount)}</p>
                      </div>
                      <p className="text-[8.5px] font-bold text-zinc-500 mt-1.5 border-t border-zinc-850/60 pt-1 leading-none">
                        업데이트: {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "오늘 실시간"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center flex flex-col justify-between min-h-[76px]">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400">총조회수</p>
                        <p className="text-sm font-black text-white mt-0.5">{formatNumber(data.channel.statistics.viewCount)}</p>
                      </div>
                      <p className="text-[8.5px] font-bold text-zinc-500 mt-1.5 border-t border-zinc-850/60 pt-1 leading-none">
                        조회기준일: 오늘
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-2.5 text-center flex flex-col justify-between min-h-[76px]">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400">동영상수</p>
                        <p className="text-sm font-black text-white mt-0.5">{data.channel.statistics.videoCount}개</p>
                      </div>
                      <p className="text-[8.5px] font-bold text-zinc-500 mt-1.5 border-t border-zinc-850/60 pt-1 leading-none">
                        상태: 정상연동
                      </p>
                    </div>
                  </div>

                  {/* 100일 주기 실시간 동기화 정보 알림 문구 배너 */}
                  <div className="rounded-xl border border-zinc-850 bg-red-950/5 p-3 text-center">
                    <p className="text-[10px] font-extrabold text-red-400 flex items-center justify-center gap-1.5">
                      <span>⚠️</span>
                      <span>채널 정보는 100일에 1번씩 유튜브 API를 통해 실시간 업데이트됩니다.</span>
                    </p>
                  </div>

                  {/* Dynamic Add to Radar Channel toggler */}
                  <button
                    type="button"
                    onClick={handleToggleRadar}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition border shadow-sm ${
                      isCurrentInRadar
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        : "bg-red-950/30 border-red-900/40 text-red-400 hover:bg-red-950/50 hover:border-red-800"
                    }`}
                  >
                    {isCurrentInRadar ? (
                      <>
                        <Check size={14} /> 나의 레이더 해제
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> 나의 레이더 채널 추가
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* NEW: Channel Detailed Metadata Section */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-4">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-zinc-850 pb-2">
                  ℹ️ 채널 상세 프로필 명세
                </h4>
                <div className="space-y-2.5 text-[11px] font-bold text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span>채널 고유 ID</span>
                    <span className="text-zinc-300 font-mono select-all bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850 truncate max-w-[160px]" title={data.channel.id}>
                      {data.channel.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>채널 개설일</span>
                    <span className="text-zinc-200">
                      {data.channel.snippet.publishedAt
                        ? new Date(data.channel.snippet.publishedAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>소속 국가</span>
                    <span className="text-zinc-200">
                      {data.channel.snippet.country
                        ? COUNTRIES.find((c) => c.code === data.channel.snippet.country)?.name || data.channel.snippet.country
                        : "미지정"}
                      {data.channel.snippet.country && ` (${data.channel.snippet.country})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* NEW: Channel Tags/Keywords Cloud */}
              {data.channel.brandingSettings?.channel?.keywords && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-3">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    💡 채널 공식 관심 키워드
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parseKeywords(data.channel.brandingSettings.channel.keywords).map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="border border-zinc-850 bg-zinc-950/60 text-zinc-400 text-[10px] font-black px-2.5 py-1 rounded-lg hover:border-zinc-700 transition"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links to other options */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-xs font-black text-white">관련 연동 메뉴</h4>
                <div className="flex flex-col gap-2">
                  <a
                    href={`/studio/youtube/cpm?views=${data.channel.statistics.viewCount}`}
                    className="flex justify-between items-center rounded-lg bg-zinc-950/50 p-2.5 text-[11px] font-bold text-zinc-300 hover:border-red-500/30 hover:bg-zinc-900 transition border border-zinc-850"
                  >
                    <span className="flex items-center gap-1.5"><Database size={13} className="text-violet-400" /> 수익 및 CPM 계산</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Outperformer Radar Videos list */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <PlayCircle className="text-red-500" size={16} />
                  최근 업로드 분석 및 "숨은 꿀 영상" 레이더
                </h3>
                
                <div className="flex items-center gap-2">
                  {/* Sorting Buttons */}
                  <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-850 text-[10px] font-bold text-zinc-400">
                    <button
                      onClick={() => setVideoSortKey("default")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "default"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      최신순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("views")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "views"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      조회수순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("likes")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "likes"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      좋아요순
                    </button>
                    <button
                      onClick={() => setVideoSortKey("comments")}
                      className={`px-2 py-0.5 rounded transition ${
                        videoSortKey === "comments"
                          ? "bg-zinc-800 text-white font-black"
                          : "hover:text-white"
                      }`}
                    >
                      댓글순
                    </button>
                  </div>

                  <span className="text-[10px] text-zinc-550 font-bold bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded shrink-0">표본 30개</span>
                </div>
              </div>

              <div className="space-y-4">
                {sortedVideos && sortedVideos.length > 0 ? (
                  sortedVideos.map((video: any, idx: number) => {
                    const subscriberCount = Number(data.channel?.statistics?.subscriberCount || 0);
                    const viewCount = Number(video.statistics?.viewCount || 0);
                    
                    const videoId = typeof video.id === "object" ? (video.id?.videoId || video.id?.channelId || String(idx)) : video.id;

                    // Calculate Outperform Ratio (조회수 / 구독자 수) * 100
                    const ratio = subscriberCount > 0 ? (viewCount / subscriberCount) * 100 : 0;
                    
                    // Assign badges and borders for outliers
                    let ratingLabel = "보통 성과";
                    let ratingColor = "border-zinc-800 text-zinc-400";
                    let isOutlier = false;
                    
                    if (ratio >= 100) {
                      ratingLabel = "★ 메가 히트 (벤치마킹 강력추천)";
                      ratingColor = "border-orange-500/50 text-orange-400 bg-orange-950/20";
                      isOutlier = true;
                    } else if (ratio >= 50) {
                      ratingLabel = "우수 성과 (추천)";
                      ratingColor = "border-red-500/35 text-red-400 bg-red-950/15";
                      isOutlier = true;
                    } else if (ratio >= 20) {
                      ratingLabel = "양호 성과";
                      ratingColor = "border-yellow-500/20 text-yellow-500/80 bg-yellow-950/5";
                    }

                    return (
                      <div
                        key={videoId || idx}
                        onClick={() => handleOpenReport({ ...video, id: videoId })}
                        className={`flex flex-col sm:flex-row gap-4 rounded-xl bg-zinc-950/40 p-4 border transition cursor-pointer hover:bg-zinc-900/40 ${
                          isOutlier ? "border-orange-500/30 hover:border-orange-500/50" : "border-zinc-850 hover:border-red-500/20"
                        }`}
                      >
                        {/* Video Thumbnail */}
                        <div className="h-20 w-36 overflow-hidden rounded-lg border border-zinc-850 shrink-0 bg-zinc-900 relative group/thumb cursor-pointer">
                          {videoId && videoId === playingVideoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                              title={video.snippet.title}
                              className="h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <>
                              <img
                                src={video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url}
                                alt={video.snippet.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                              />
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayingVideoId(videoId);
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transform scale-90 group-hover/thumb:scale-100 transition-all duration-200">
                                  <Play size={12} fill="currentColor" className="ml-0.5" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Content details and Outperformer parameters */}
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className={`inline-flex px-2 py-0.5 text-[9px] font-black border rounded ${ratingColor}`}>
                                {ratingLabel}
                              </span>
                              <span className="text-[9px] text-zinc-550 font-bold">
                                구독자수 대비 조회비율: <span className={`font-black ${isOutlier ? "text-orange-400" : "text-zinc-300"}`}>{ratio.toFixed(1)}%</span>
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-zinc-100 group-hover:text-red-400 leading-snug line-clamp-2">
                              {video.snippet.title}
                            </h4>
                          </div>

                          {/* Stats Strip */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-550 font-bold mt-3.5 pt-2 border-t border-zinc-900/60">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(viewCount)}</span>
                              <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatNumber(video.statistics?.likeCount || 0)}</span>
                              <span className="flex items-center gap-1"><MessageSquare size={12} /> {formatNumber(video.statistics?.commentCount || 0)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const url = `https://www.youtube.com/watch?v=${videoId}`;
                                  navigator.clipboard.writeText(url);
                                  alert("유튜브 영상 링크가 클립보드에 복사되었습니다!");
                                }}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 hover:text-white hover:border-zinc-700 transition font-bold"
                              >
                                <Copy size={10} />
                                <span>링크 복사</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const channelHandle = data.channel?.snippet?.customUrl || data.channel?.snippet?.handle || "";
                                  const channelUrl = channelHandle 
                                    ? `https://www.youtube.com/${channelHandle}`
                                    : `https://www.youtube.com/channel/${data.channel?.id || video.snippet?.channelId}`;
                                  window.open(channelUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 hover:text-white hover:border-zinc-700 transition font-bold"
                              >
                                <ExternalLink size={10} />
                                <span>채널 바로가기</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenReport(video);
                                }}
                                className="text-[9px] font-black text-red-400 hover:text-red-300 flex items-center gap-1 pl-1"
                              >
                                AI 데이터 분석 리포트 →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 py-8 text-center">최근에 발행한 비디오 목록이 없습니다.</p>
                )}
              </div>

              <div className="text-[10px] text-zinc-650 font-bold text-right pt-2">
                데이터 출처: {data.source === "database-cache" ? "Supabase DB Cache" : data.source === "youtube-api" ? "YouTube Live Data API" : "Vault Fallback System"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Analysis Modal */}
      {isModalOpen && selectedVideo && (
        <VideoAnalysisModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          videos={data?.recentVideos}
          onVideoSelect={setSelectedVideo}
          reportType="channel"
        />
      )}
    </div>
  );
}
