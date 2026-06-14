"use client";

import React, { useState } from "react";
import { Database, Search, Loader2, Download, ArrowRight } from "lucide-react";
import Link from "next/navigation";

export default function BulkSearch() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    
    // Simulate API query latency
    setTimeout(() => {
      const keywords = inputText
        .split(/[\n,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const generated = keywords.map((kw, index) => {
        const hash = kw.length * 13 + index * 7;
        const volume = (hash % 95 + 5) * 1200;
        const cpc = (hash % 18 + 2) * 200;
        const intents = ["구매/상업성", "정보 검색", "탐색/비교"];
        const difficulty = ["높음", "보통", "낮음"];

        return {
          keyword: kw,
          searchVolume: volume.toLocaleString(),
          cpc: `₩${cpc.toLocaleString()}`,
          intent: intents[hash % intents.length],
          difficulty: difficulty[hash % difficulty.length],
          ctr: `${(hash % 12 + 5).toFixed(1)}%`,
        };
      });

      setResults(generated);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Database className="text-cyan-400" size={20} />
          키워드 대량 조회
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          엔터를 누르거나 쉼표(,)로 구분하여 한 번에 여러 개의 키워드를 대량 조회할 수 있습니다. (최대 50개)
        </p>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="여기에 키워드를 입력하세요...&#10;예:&#10;인공지능&#10;챗GPT&#10;크리에이터 오피스"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition"
        />

        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => {
              setInputText("");
              setResults([]);
            }}
            className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            초기화
          </button>
          <button
            onClick={handleSearch}
            disabled={loading || !inputText.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-600 px-6 text-xs font-black text-white hover:bg-cyan-500 disabled:opacity-50 transition shadow-lg shadow-cyan-600/10"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            대량 조회 시작
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white">
              분석 결과 (총 {results.length}개 키워드)
            </h3>
            <button className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-white border border-zinc-800 px-2.5 py-1.5 rounded-lg bg-zinc-950/40">
              <Download size={12} />
              엑셀 다운로드
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                  <th className="py-3 px-4">키워드</th>
                  <th className="py-3 px-4">월간 검색량</th>
                  <th className="py-3 px-4">평균 CTR</th>
                  <th className="py-3 px-4">평균 CPC 입찰가</th>
                  <th className="py-3 px-4">검색 의도</th>
                  <th className="py-3 px-4">난이도</th>
                  <th className="py-3 px-4">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {results.map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                    <td className="py-3 px-4 text-white font-extrabold">{item.keyword}</td>
                    <td className="py-3 px-4">{item.searchVolume}회</td>
                    <td className="py-3 px-4 text-cyan-400">{item.ctr}</td>
                    <td className="py-3 px-4">{item.cpc}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-bold">
                        {item.intent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          item.difficulty === "높음"
                            ? "bg-red-500/10 text-red-400"
                            : item.difficulty === "보통"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/studio/keyword/strategy?keyword=${encodeURIComponent(item.keyword)}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        전략 생성
                        <ArrowRight size={10} />
                      </a>
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
