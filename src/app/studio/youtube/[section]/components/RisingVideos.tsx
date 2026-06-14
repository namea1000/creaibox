"use client";

import React, { useState, useEffect } from "react";
import { Flame, Loader2, PlayCircle, Eye, ThumbsUp, Calendar, ArrowRight } from "lucide-react";

export default function RisingVideos() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [source, setSource] = useState("api");

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/youtube?type=trending");
      if (!res.ok) throw new Error("급상승 비디오 리스트를 가져오는데 실패했습니다.");
      const result = await res.json();
      setVideos(result.data || []);
      setSource(result.source);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const formatNumber = (numStr: string) => {
    const num = Number(numStr);
    if (isNaN(num)) return numStr;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
            <Flame className="text-orange-500 animate-pulse" size={20} />
            급상승 영상 트렌드
          </h2>
          <p className="text-xs text-zinc-550 leading-relaxed">
            현재 유튜브 대한민국(KR) 급상승 트렌드 리스트에 등록된 상위 인기 동영상 리스트를 가져와 조회수 분석을 제공합니다.
          </p>
        </div>

        <button
          onClick={fetchTrending}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 px-5 text-xs font-black text-white transition shrink-0 self-start sm:self-center"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} />}
          새로고침
        </button>
      </div>

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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, idx) => {
            const videoId = video.id;
            const title = video.snippet?.title || "제목 없음";
            const channel = video.snippet?.channelTitle || "채널 정보 없음";
            const thumbnail = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || "/placeholder.jpg";
            const viewCount = video.statistics?.viewCount || "0";
            const likeCount = video.statistics?.likeCount || "0";
            const published = video.snippet?.publishedAt ? new Date(video.snippet.publishedAt).toLocaleDateString() : "오늘";

            return (
              <div key={idx} className="group rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:border-orange-500/40 p-4 transition flex flex-col justify-between hover:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-850 bg-zinc-950">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 text-xs font-black text-white">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Title & Channel */}
                  <h3 className="mt-3 text-xs font-black text-white line-clamp-2 leading-snug group-hover:text-orange-400 transition">
                    {title}
                  </h3>
                  <p className="mt-1 text-[10px] text-zinc-500 font-bold">{channel}</p>
                </div>

                {/* Footer Metrics */}
                <div className="mt-4 border-t border-zinc-800/60 pt-3 flex justify-between items-center text-[10px] text-zinc-555 font-bold">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} className="text-zinc-500" /> {formatNumber(viewCount)}</span>
                    <span className="flex items-center gap-1"><ThumbsUp size={11} className="text-zinc-500" /> {formatNumber(likeCount)}</span>
                  </div>
                  {videoId && typeof videoId === "string" && (
                    <a
                      href={`/studio/youtube/seo?url=https://youtube.com/watch?v=${videoId}`}
                      className="inline-flex items-center gap-0.5 text-orange-400 hover:text-orange-300 transition"
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
        <div className="text-[10px] text-zinc-650 font-bold text-right">
          데이터 피드: {source === "youtube-api" ? "YouTube Live Data API" : "Vault Fallback System"}
        </div>
      )}
    </div>
  );
}
