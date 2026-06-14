"use client";

import React, { useState } from "react";
import { Users, Search, Loader2, PlayCircle, Calendar, Eye, Database } from "lucide-react";
import { SiYoutube } from "react-icons/si";

export default function ChannelDetail() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/youtube?type=channel&query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("채널 정보를 가져오는데 실패했습니다.");
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (numStr: string) => {
    const num = Number(numStr);
    if (isNaN(num)) return numStr;
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Users className="text-red-500" size={20} />
          채널 상세 분석
        </h2>
        <p className="text-xs text-zinc-550 mb-4 leading-relaxed">
          유튜브 채널 명칭이나 핸들(@이름)을 입력하여 구독자 수, 총 조회수, 업로드 비디오 개수 및 최근 동영상 목록을 실시간으로 추적 분석합니다.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="채널 핸들 또는 이름 입력 (예: @suno, 크리에이박스)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-650 px-6 text-xs font-black text-white hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            채널 상세 분석
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1">
            ⚠️ {error}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="text-xs font-bold text-zinc-500">YouTube Data API 호출 중...</p>
        </div>
      )}

      {data && data.channel && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Channel Info & stats */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md text-center space-y-4">
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-zinc-850">
                <img
                  src={data.channel.snippet.thumbnails.medium?.url || "/placeholder.jpg"}
                  alt={data.channel.snippet.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-base font-black text-white">{data.channel.snippet.title}</h3>
                <p className="text-[10px] text-zinc-500 mt-1 font-bold">{data.channel.snippet.customUrl}</p>
              </div>

              <p className="text-[10px] leading-relaxed text-zinc-400 font-medium text-left line-clamp-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-850">
                {data.channel.snippet.description || "채널 설명이 없습니다."}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-left">
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-3 text-center">
                  <p className="text-[9px] font-bold text-zinc-550">구독자</p>
                  <p className="text-xs font-black text-red-400 mt-1">{formatNumber(data.channel.statistics.subscriberCount)}</p>
                </div>
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-3 text-center">
                  <p className="text-[9px] font-bold text-zinc-550">총조회수</p>
                  <p className="text-xs font-black text-white mt-1">{formatNumber(data.channel.statistics.viewCount)}</p>
                </div>
                <div className="rounded-xl border border-zinc-850 bg-zinc-950/20 p-3 text-center">
                  <p className="text-[9px] font-bold text-zinc-550">동영상수</p>
                  <p className="text-xs font-black text-white mt-1">{data.channel.statistics.videoCount}개</p>
                </div>
              </div>
            </div>

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

          {/* Recent uploads */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <PlayCircle className="text-red-500" size={16} />
              최근 업로드 동영상 목록 (최대 5개)
            </h3>

            <div className="space-y-3">
              {data.recentVideos && data.recentVideos.length > 0 ? (
                data.recentVideos.map((video: any, i: number) => (
                  <div key={i} className="flex gap-4 rounded-xl bg-zinc-950/40 p-3.5 border border-zinc-850 hover:border-red-500/20 transition">
                    <div className="h-16 w-28 overflow-hidden rounded-lg border border-zinc-850 shrink-0 bg-zinc-900">
                      <img
                        src={video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url}
                        alt={video.snippet.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{video.snippet.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-555 font-bold mt-2">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                        {video.id.videoId && (
                          <a
                            href={`/studio/youtube/seo?url=https://youtube.com/watch?v=${video.id.videoId}`}
                            className="text-red-400 hover:underline"
                          >
                            SEO 분석 →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500">최근에 발행한 비디오 목록이 없습니다.</p>
              )}
            </div>
            
            <div className="text-[10px] text-zinc-600 font-bold text-right pt-2">
              데이터 출처: {data.source === "youtube-api" ? "YouTube Live Data API" : "Vault Fallback System"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
