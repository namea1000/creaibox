"use client";

import React, { useState } from "react";
import { BarChart3, Search, Loader2, Users, Eye, PlayCircle, Scale } from "lucide-react";

export default function ChannelCompare() {
  const [handleA, setHandleA] = useState("");
  const [handleB, setHandleB] = useState("");
  const [loading, setLoading] = useState(false);
  const [channelA, setChannelA] = useState<any | null>(null);
  const [channelB, setChannelB] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleA.trim() || !handleB.trim()) return;

    setLoading(true);
    setError(null);
    setChannelA(null);
    setChannelB(null);

    try {
      // Fetch channel A
      const resA = await fetch(`/api/youtube?type=channel&query=${encodeURIComponent(handleA)}`);
      if (!resA.ok) throw new Error(`${handleA} 채널 조회 실패`);
      const resultA = await resA.json();
      if (resultA.error) throw new Error(resultA.error);

      // Fetch channel B
      const resB = await fetch(`/api/youtube?type=channel&query=${encodeURIComponent(handleB)}`);
      if (!resB.ok) throw new Error(`${handleB} 채널 조회 실패`);
      const resultB = await resB.json();
      if (resultB.error) throw new Error(resultB.error);

      setChannelA(resultA.channel);
      setChannelB(resultB.channel);
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
    return num.toLocaleString();
  };

  const getComparisonWidths = (valA: string, valB: string) => {
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;
    const sum = numA + numB;
    if (sum === 0) return { pctA: 50, pctB: 50 };
    return {
      pctA: (numA / sum) * 100,
      pctB: (numB / sum) * 100,
    };
  };

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[26px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          경쟁 채널 비교
        </h1>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400">
          두 개의 유튜브 채널을 입력하여 구독자 수, 누적 조회수, 평균 영상 당 노출 등 핵심 지표를 1:1로 비교 분석합니다.
        </p>
      </div>

      <form onSubmit={handleCompare} className="grid gap-3 sm:grid-cols-5 items-end max-w-2xl">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">비교 채널 A</label>
          <input
            type="text"
            required
            value={handleA}
            onChange={(e) => setHandleA(e.target.value)}
            placeholder="예: @suno"
            className="w-full h-10 rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 transition shadow-xs"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">비교 채널 B (경쟁사)</label>
          <input
            type="text"
            required
            value={handleB}
            onChange={(e) => setHandleB(e.target.value)}
            placeholder="예: @udio"
            className="w-full h-10 rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 transition shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !handleA.trim() || !handleB.trim()}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition shadow-xs shrink-0 cursor-pointer"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Scale size={13} />}
          두 채널 분석 비교
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-xs font-bold text-zinc-500">두 채널의 YouTube API 데이터를 조합하는 중...</p>
        </div>
      )}

      {channelA && channelB && (
        <div className="space-y-6">
          {/* Header profiles */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-5 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-zinc-800 shrink-0">
                <img src={channelA.snippet.thumbnails.medium.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-[9px] font-black text-blue-400 uppercase">채널 A</span>
                <h3 className="text-sm font-black text-white">{channelA.snippet.title}</h3>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{channelA.snippet.customUrl}</p>
              </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/10 p-5 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-zinc-800 shrink-0">
                <img src={channelB.snippet.thumbnails.medium.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase">채널 B</span>
                <h3 className="text-sm font-black text-white">{channelB.snippet.title}</h3>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{channelB.snippet.customUrl}</p>
              </div>
            </div>
          </div>

          {/* Comparative metrics */}
          <div className="rounded-md border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-6">
            <h3 className="text-sm font-black text-white">채널 파워 매트릭스 비교</h3>

            {/* Subscriber comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <div className="text-blue-400 font-extrabold flex items-center gap-1">
                  <Users size={12} /> {formatNumber(channelA.statistics.subscriberCount)}
                </div>
                <span className="text-zinc-550 text-[10px]">구독자 수</span>
                <div className="text-zinc-300 font-extrabold">
                  {formatNumber(channelB.statistics.subscriberCount)}
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${getComparisonWidths(channelA.statistics.subscriberCount, channelB.statistics.subscriberCount).pctA}%` }}
                />
                <div
                  className="h-full bg-zinc-700"
                  style={{ width: `${getComparisonWidths(channelA.statistics.subscriberCount, channelB.statistics.subscriberCount).pctB}%` }}
                />
              </div>
            </div>

            {/* Views comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <div className="text-blue-400 font-extrabold flex items-center gap-1">
                  <Eye size={12} /> {formatNumber(channelA.statistics.viewCount)}
                </div>
                <span className="text-zinc-555 text-[10px]">누적 조회수</span>
                <div className="text-zinc-300 font-extrabold">
                  {formatNumber(channelB.statistics.viewCount)}
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${getComparisonWidths(channelA.statistics.viewCount, channelB.statistics.viewCount).pctA}%` }}
                />
                <div
                  className="h-full bg-zinc-700"
                  style={{ width: `${getComparisonWidths(channelA.statistics.viewCount, channelB.statistics.viewCount).pctB}%` }}
                />
              </div>
            </div>

            {/* Video counts comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <div className="text-blue-400 font-extrabold flex items-center gap-1">
                  <PlayCircle size={12} /> {channelA.statistics.videoCount}개
                </div>
                <span className="text-zinc-555 text-[10px]">누적 업로드 비디오</span>
                <div className="text-zinc-300 font-extrabold">
                  {channelB.statistics.videoCount}개
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${getComparisonWidths(channelA.statistics.videoCount, channelB.statistics.videoCount).pctA}%` }}
                />
                <div
                  className="h-full bg-zinc-700"
                  style={{ width: `${getComparisonWidths(channelA.statistics.videoCount, channelB.statistics.videoCount).pctB}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
