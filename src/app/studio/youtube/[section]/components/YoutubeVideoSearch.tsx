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

export default function YoutubeVideoSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setActiveQuery(searchQuery);
    setError(null);

    try {
      const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }
      const data = await res.json();
      setVideos(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="space-y-6">
      {/* 🚀 상단 헤더 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[26px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          유튜브 영상 검색
        </h1>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400">
          유튜브 내 키워드, 채널명, 인기 해시태그를 대조하여 트렌드 파괴력이 높은 최적의 인기 영상을 추적합니다.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-2xl">
        <div className="flex w-full items-center gap-2 rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 focus-within:ring-2 focus-within:ring-red-500/40 shadow-xs">
          <Search className="ml-2 text-slate-400 dark:text-zinc-500 shrink-0" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어 또는 관심 키워드를 입력해 보세요 (예: 아이브, 먹방, 스위스)"
            className="w-full bg-transparent py-1.5 pl-1 pr-3 text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-zinc-200 dark:placeholder:text-zinc-600"
          />
          <button
            type="submit"
            className="h-8 shrink-0 rounded-md bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-500 cursor-pointer shadow-xs"
          >
            검색하기
          </button>
        </div>
      </form>

      {/* Grid Results Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-black text-slate-400 dark:text-zinc-500">
            {activeQuery ? `"${activeQuery}" 검색 결과` : "실시간 인기 동영상 추천"} • {videos.length}개 비디오 매핑됨
          </span>
        </div>

        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video w-full rounded-md bg-slate-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          /* Empty State */
          <div className="rounded-md border border-dashed border-slate-300 dark:border-zinc-800 p-16 text-center">
            <span className="text-sm font-bold text-slate-400 dark:text-zinc-600">
              입력하신 검색어에 해당하는 유튜브 영상이 존재하지 않습니다. 다른 단어로 검색해 보세요.
            </span>
          </div>
        ) : (
          /* Grid Video Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-white dark:border-white/5 dark:bg-[#0c0d12]/30 dark:hover:border-red-500/30 dark:hover:bg-[#12131a]/60 hover:shadow-xl"
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
