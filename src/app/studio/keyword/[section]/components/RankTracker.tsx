"use client";

import React, { useState } from "react";
import { LineChart, Search, Loader2, Plus, RefreshCw, Trash2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SiNaver, SiYoutube, SiGoogle } from "react-icons/si";

interface TrackedKeyword {
  id: string;
  keyword: string;
  platform: "naver" | "google" | "youtube";
  targetUrl: string;
  currentRank: number | "100+";
  prevRank: number | "100+";
  lastChecked: string;
  isUpdating?: boolean;
}

export default function RankTracker() {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState<"naver" | "google" | "youtube">("naver");
  const [targetUrl, setTargetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-populate with realistic tracking lists
  const [trackList, setTrackList] = useState<TrackedKeyword[]>([
    {
      id: "1",
      keyword: "AI 글쓰기 도구",
      platform: "naver",
      targetUrl: "creaibox.com/blog/ai-writing",
      currentRank: 3,
      prevRank: 5,
      lastChecked: "오늘 09:30",
    },
    {
      id: "2",
      keyword: "유튜브 쇼츠 만드는법",
      platform: "youtube",
      targetUrl: "youtube.com/c/creaibox_shorts",
      currentRank: 8,
      prevRank: 8,
      lastChecked: "오늘 10:15",
    },
    {
      id: "3",
      keyword: "무료 작곡 프로그램 AI",
      platform: "google",
      targetUrl: "creaibox.com/studio/music",
      currentRank: 12,
      prevRank: 15,
      lastChecked: "어제 18:00",
    },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !targetUrl.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const newKeyword: TrackedKeyword = {
        id: Date.now().toString(),
        keyword: keyword.trim(),
        platform,
        targetUrl: targetUrl.trim(),
        currentRank: Math.floor(Math.random() * 30) + 1,
        prevRank: Math.floor(Math.random() * 40) + 5,
        lastChecked: "방금 전",
      };

      setTrackList([newKeyword, ...trackList]);
      setKeyword("");
      setTargetUrl("");
      setLoading(false);
    }, 800);
  };

  const handleUpdate = (id: string) => {
    setTrackList(prev => prev.map(item => item.id === id ? { ...item, isUpdating: true } : item));

    setTimeout(() => {
      setTrackList(prev =>
        prev.map(item => {
          if (item.id === id) {
            const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2 rank diff
            let newRank = typeof item.currentRank === "number" ? item.currentRank + delta : 10;
            if (newRank < 1) newRank = 1;
            return {
              ...item,
              prevRank: item.currentRank,
              currentRank: newRank,
              lastChecked: "방금 전",
              isUpdating: false,
            };
          }
          return item;
        })
      );
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setTrackList(prev => prev.filter(item => item.id !== id));
  };

  const getRankDelta = (current: number | "100+", prev: number | "100+") => {
    if (current === "100+" || prev === "100+") return { icon: Minus, color: "text-zinc-500", text: "변동없음" };
    const diff = prev - current; // prev=5, current=3 => diff = 2 (ranking up!)
    if (diff > 0) return { icon: ArrowUp, color: "text-emerald-400", text: `+${diff}` };
    if (diff < 0) return { icon: ArrowDown, color: "text-red-400", text: `${diff}` };
    return { icon: Minus, color: "text-zinc-500", text: "-" };
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <LineChart className="text-orange-400" size={20} />
          실시간 순위 추적
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          검색 포털에 등록한 키워드와 내 페이지(블로그, 웹사이트 등)의 주소를 등록하여, 실시간 검색 노출 순위를 지속적으로 추적하고 변동 이력을 기록합니다.
        </p>

        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400">플랫폼</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-300 outline-none focus:border-orange-500/50 transition cursor-pointer"
            >
              <option value="naver">네이버 검색</option>
              <option value="google">구글 검색</option>
              <option value="youtube">유튜브 검색</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400">대상 키워드</label>
            <input
              type="text"
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: AI 쇼츠 만들기"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-orange-500/50 transition"
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-[10px] font-bold text-zinc-400">타겟 도메인/URL 패턴</label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="예: blog.naver.com/myname"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-orange-500/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 text-xs font-black text-white hover:bg-orange-500 disabled:opacity-50 transition shadow-lg shadow-orange-600/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            추적 키워드 등록
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white">추적 리스트 (총 {trackList.length}개)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                <th className="py-3 px-4">포털</th>
                <th className="py-3 px-4">추적 키워드</th>
                <th className="py-3 px-4">식별 URL</th>
                <th className="py-3 px-4">현재 순위</th>
                <th className="py-3 px-4">변동폭</th>
                <th className="py-3 px-4">최종 갱신</th>
                <th className="py-3 px-4 text-right">설정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {trackList.map((item) => {
                const delta = getRankDelta(item.currentRank, item.prevRank);
                const DeltaIcon = delta.icon;

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                    <td className="py-3 px-4">
                      {item.platform === "naver" ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                          <SiNaver size={12} />
                        </div>
                      ) : item.platform === "google" ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-450">
                          <SiGoogle size={12} />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-550">
                          <SiYoutube size={12} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white font-extrabold">{item.keyword}</td>
                    <td className="py-3 px-4 text-zinc-500 max-w-[200px] truncate">{item.targetUrl}</td>
                    <td className="py-3 px-4 text-sm font-black text-white">{item.currentRank}위</td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-1 font-bold ${delta.color}`}>
                        <DeltaIcon size={12} />
                        <span>{delta.text}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{item.lastChecked}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          disabled={item.isUpdating}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 transition"
                        >
                          <RefreshCw size={12} className={item.isUpdating ? "animate-spin text-orange-450" : ""} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-red-400 hover:border-zinc-700 transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
