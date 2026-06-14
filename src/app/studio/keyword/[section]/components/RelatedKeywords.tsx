"use client";

import React, { useState } from "react";
import { Layers, Search, Loader2, Download, Plus, Copy, Check, ArrowRight } from "lucide-react";

export default function RelatedKeywords() {
  const [seedKeyword, setSeedKeyword] = useState("");
  const [channel, setChannel] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSearch = () => {
    if (!seedKeyword.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Generate realistic longtail keywords based on seed
      const keyword = seedKeyword.trim();
      const prefixes = ["", "쉬운 ", "초보자용 ", "가성비 좋은 ", "추천하는 ", "인기있는 "];
      const suffixes = [" 추천", " 방법", " 후기", " 비교", " 가격", " 사이트", " 팁", " 기초", " 활용법"];
      
      const generated: any[] = [];
      const usedKeywords = new Set<string>();

      // Make a mix of prefixes and suffixes
      for (let i = 0; i < 15; i++) {
        let candidate = "";
        if (i === 0) {
          candidate = keyword;
        } else {
          const prefix = prefixes[i % prefixes.length];
          const suffix = suffixes[(i * 3) % suffixes.length];
          candidate = `${prefix}${keyword}${suffix}`.trim();
        }

        if (!usedKeywords.has(candidate)) {
          usedKeywords.add(candidate);
          const hash = candidate.length * 17 + i * 11;
          const searchVolume = (hash % 120 + 10) * 150;
          const pcVolume = Math.floor(searchVolume * 0.3);
          const mobileVolume = searchVolume - pcVolume;
          const compIdx = hash % 3;
          const competition = ["낮음", "보통", "높음"][compIdx];
          const cpc = (hash % 25 + 1) * 150;
          const trend = (hash % 80) - 30; // -30% to +50%

          generated.push({
            keyword: candidate,
            searchVolume: searchVolume.toLocaleString(),
            pcVolume: pcVolume.toLocaleString(),
            mobileVolume: mobileVolume.toLocaleString(),
            competition,
            cpc: `₩${cpc.toLocaleString()}`,
            trend: trend >= 0 ? `+${trend}%` : `${trend}%`,
            trendType: trend >= 20 ? "up" : trend <= -10 ? "down" : "stable",
          });
        }
      }

      setResults(generated);
      setLoading(false);
    }, 800);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Layers className="text-emerald-400" size={20} />
          연관 키워드 발굴
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          검색창에 시드 키워드를 입력하면, 검색 엔진의 연관검색어와 쇼핑 롱테일 키워드를 AI가 조합 및 분석하여 제시합니다.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 relative">
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="예: 인공지능, 제테크, 홈트레이닝"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 pl-4 pr-10 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/50 transition"
            />
            <Search className="absolute right-3.5 top-3.5 text-zinc-600" size={15} />
          </div>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-300 outline-none focus:border-emerald-500/50 transition cursor-pointer"
          >
            <option value="all">전체 채널</option>
            <option value="naver">네이버 검색</option>
            <option value="google">구글 검색</option>
            <option value="shopping">네이버 쇼핑</option>
          </select>

          <button
            onClick={handleSearch}
            disabled={loading || !seedKeyword.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-black text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-lg shadow-emerald-600/10 shrink-0"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Layers size={14} />
            )}
            연관어 발굴 시작
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">
              연관 키워드 결과 (시드: <span className="text-emerald-400 font-extrabold">{seedKeyword}</span>)
            </h3>
            <button className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-white border border-zinc-800 px-2.5 py-1.5 rounded-lg bg-zinc-950/40 transition">
              <Download size={12} />
              목록 다운로드
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                  <th className="py-3 px-4">키워드</th>
                  <th className="py-3 px-4">합산 검색량</th>
                  <th className="py-3 px-4">PC / Mobile</th>
                  <th className="py-3 px-4">최근 트렌드</th>
                  <th className="py-3 px-4">평균 CPC</th>
                  <th className="py-3 px-4">경쟁 강도</th>
                  <th className="py-3 px-4 text-right">도구</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {results.map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-extrabold">{item.keyword}</span>
                        <button
                          onClick={() => handleCopy(item.keyword, i)}
                          className="text-zinc-600 hover:text-emerald-400 transition"
                          title="복사하기"
                        >
                          {copiedIndex === i ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{item.searchVolume}회</td>
                    <td className="py-3 px-4 text-[10px] text-zinc-500">
                      PC {item.pcVolume} / Mo {item.mobileVolume}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          item.trendType === "up"
                            ? "text-emerald-400"
                            : item.trendType === "down"
                            ? "text-red-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {item.trend}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.cpc}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          item.competition === "높음"
                            ? "bg-red-500/10 text-red-400"
                            : item.competition === "보통"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {item.competition}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/studio/keyword/strategy?keyword=${encodeURIComponent(item.keyword)}`}
                          className="inline-flex h-7 items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2.5 text-[10px] font-bold text-zinc-300 transition"
                        >
                          전략
                        </a>
                        <a
                          href={`/studio/keyword/bulk?keyword=${encodeURIComponent(item.keyword)}`}
                          className="inline-flex h-7 items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2.5 text-[10px] font-bold text-zinc-300 transition"
                        >
                          대량조회
                          <ArrowRight size={8} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
