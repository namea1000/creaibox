"use client";

import React, { useState, useMemo } from "react";
import { Search, Heart, Play, Eye, Calendar, Tag, Compass, Sparkles } from "lucide-react";

interface YoutubeVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  uploadDate: string;
  tags: string[];
}

const mockVideos: YoutubeVideo[] = [
  { id: "v1", title: "[MV] IVE (아이브) - Accendio", channelName: "IVE", thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=360&auto=format&fit=crop&q=60", duration: "3:42", views: 24500000, likes: 980000, uploadDate: "2026-05-15", tags: ["IVE", "아이브", "KPOP", "음악"] },
  { id: "v2", title: "BTS (방탄소년단) - Dynamite Official MV", channelName: "BANGTANTV", thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=360&auto=format&fit=crop&q=60", duration: "3:43", views: 1890000000, likes: 36000000, uploadDate: "2020-08-21", tags: ["BTS", "방탄소년단", "Dynamite", "KPOP"] },
  { id: "v3", title: "역대급 불닭볶음면 먹방! 치즈돈까스 조합 최고", channelName: "떵개떵", thumbnail: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=360&auto=format&fit=crop&q=60", duration: "12:15", views: 1250000, likes: 34000, uploadDate: "2026-07-01", tags: ["먹방", "불닭볶음면", "치즈돈까스", "음식"] },
  { id: "v4", title: "[여행] 스위스 그린델발트 기차 여행 10일 풀코스 가이드", channelName: "빠니보틀", thumbnail: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=360&auto=format&fit=crop&q=60", duration: "24:30", views: 890000, likes: 21000, uploadDate: "2026-06-20", tags: ["여행", "스위스", "그린델발트", "유럽"] },
  { id: "v5", title: "Faker가 보여주는 미드 아리 하이라이트 플레이", channelName: "T1 Faker", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=360&auto=format&fit=crop&q=60", duration: "10:45", views: 3200000, likes: 89000, uploadDate: "2026-07-05", tags: ["리그오브레전드", "롤", "Faker", "아리"] },
  { id: "v6", title: "삼성 갤럭시 S26 Ultra 심층 분석 리뷰! 진짜 달라졌나?", channelName: "잇섭 ITSub", thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=360&auto=format&fit=crop&q=60", duration: "18:20", views: 1450000, likes: 42000, uploadDate: "2026-07-06", tags: ["삼성", "갤럭시", "S26Ultra", "IT"] },
  { id: "v7", title: "세계에서 가장 아름다운 휴양지 TOP 5 코스 추천", channelName: "곽튜브", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=360&auto=format&fit=crop&q=60", duration: "15:40", views: 920000, likes: 18000, uploadDate: "2026-06-28", tags: ["여행", "휴양지", "세계여행", "추천"] },
  { id: "v8", title: "AI 음악 생태계가 뒤바뀐다? Suno AI v4 최초 리뷰", channelName: "크리에이박스", thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=360&auto=format&fit=crop&q=60", duration: "8:50", views: 560000, likes: 12000, uploadDate: "2026-07-02", tags: ["SunoAI", "인공지능", "작곡", "음악"] }
];

export default function YoutubeVideoSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setActiveQuery(searchQuery);
      setIsLoading(false);
    }, 600); // 0.6초 실시간 로딩 효과 모킹
  };

  const filteredVideos = useMemo(() => {
    if (!activeQuery.trim()) return mockVideos;
    const lowerQ = activeQuery.toLowerCase();
    return mockVideos.filter(
      (vid) =>
        vid.title.toLowerCase().includes(lowerQ) ||
        vid.channelName.toLowerCase().includes(lowerQ) ||
        vid.tags.some((tag) => tag.toLowerCase().includes(lowerQ))
    );
  }, [activeQuery]);

  const formatNumber = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억회`;
    }
    if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만회`;
    }
    return `${num.toLocaleString()}회`;
  };

  return (
    <div className="space-y-8">
      {/* Search Bar Header */}
      <div className="relative overflow-hidden rounded-[24px] border border-red-500/10 bg-[#0e0a0a]/50 p-8 dark:border-red-500/20 dark:bg-zinc-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-black text-red-500 border border-red-500/10">
              <Compass size={12} className="animate-spin-slow" />
              VIDEO INTELLIGENCE SEARCH
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              유튜브 인기 영상 입체 검색
            </h2>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              유튜브 내 키워드, 채널명, 인기 해시태그를 대조하여 트렌드 파괴력이 높은 최적의 인기 영상을 추적합니다.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="flex w-full items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 p-1.5 focus-within:ring-2 focus-within:ring-red-500/40">
              <Search className="ml-2 text-slate-400 dark:text-zinc-500 shrink-0" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어 또는 관심 키워드를 입력해 보세요 (예: 아이브, 먹방, 스위스)"
                className="w-full bg-transparent py-2 pl-1 pr-3 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 dark:text-zinc-200 dark:placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="h-9 shrink-0 rounded-lg bg-red-500 px-4 text-xs font-extrabold text-white transition hover:bg-red-600 active:scale-[0.98] shadow-md shadow-red-500/25"
              >
                검색하기
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid Results Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-black text-slate-400 dark:text-zinc-500">
            {activeQuery ? `"${activeQuery}" 검색 결과` : "실시간 인기 동영상 추천"} • {filteredVideos.length}개 비디오 매핑됨
          </span>
        </div>

        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video w-full rounded-2xl bg-slate-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 p-16 text-center">
            <span className="text-sm font-bold text-slate-400 dark:text-zinc-600">
              입력하신 검색어에 해당하는 인기 유튜브 영상이 존재하지 않습니다. 다른 단어로 검색해 보세요.
            </span>
          </div>
        ) : (
          /* Grid Video Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-white dark:border-white/5 dark:bg-[#0c0d12]/30 dark:hover:border-red-500/30 dark:hover:bg-[#12131a]/60 hover:shadow-xl"
              >
                {/* Thumbnail and duration */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-black text-white tracking-widest">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:scale-110 active:scale-[0.95]">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info Detail */}
                <div className="flex flex-1 flex-col p-4 text-left space-y-2.5">
                  <h3 className="line-clamp-2 text-xs font-black leading-relaxed text-slate-800 dark:text-zinc-200 group-hover:text-red-500 transition-colors">
                    {video.title}
                  </h3>

                  <div className="space-y-1">
                    <p className="truncate text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                      {video.channelName}
                    </p>
                    
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 dark:text-zinc-500">
                      <span className="flex items-center gap-0.5">
                        <Eye size={11} />
                        {formatNumber(video.views)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Heart size={11} className="text-red-500/80" />
                        {video.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800/80">
                    {video.tags.slice(0, 3).map((tg) => (
                      <span
                        key={tg}
                        className="inline-flex items-center gap-0.5 rounded bg-slate-100 dark:bg-zinc-800/50 px-1.5 py-0.5 text-[8px] font-black text-slate-500 dark:text-zinc-400"
                      >
                        <Tag size={7} />
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
