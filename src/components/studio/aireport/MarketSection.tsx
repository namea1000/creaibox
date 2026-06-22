"use client";

import React, { useState } from "react";
import { BarChart3, Search, FileText, Calendar, ArrowUpRight, TrendingUp } from "lucide-react";

export default function MarketSection() {
  const [query, setQuery] = useState("");
  const marketReports = [
    {
      title: "2026 글로벌 생성형 AI 시장 규모 및 성장 전망",
      category: "글로벌 시장",
      date: "2026-06-19",
      growth: "+32.4% CAGR",
      cagrType: "high",
    },
    {
      title: "LLM 인프라 칩 공급망 병목 현상 및 엔비디아 점유율 분석",
      category: "하드웨어/반도체",
      date: "2026-06-18",
      growth: "시장 점유율 88%",
      cagrType: "neutral",
    },
    {
      title: "기업용 에이전트(Agentic AI) 솔루션 도입 현황 분석 리포트",
      category: "엔터프라이즈 소프트웨어",
      date: "2026-06-15",
      growth: "도입율 +45%",
      cagrType: "high",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 시장 리포트</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              전 세계 인공지능 산업의 하드웨어, 소프트웨어, 서비스 시장 성장 추이와 경쟁 구도를 모니터링합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 리서치 검색 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-4">시장 데이터 빠른 검색</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 생성형 AI 글로벌 시장 규모, AI 반도체 점유율..."
              className="h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 pl-10 pr-3 text-sm text-zinc-950 dark:text-zinc-100 outline-none focus:border-blue-500"
            />
          </div>
          <button className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-black text-white hover:bg-blue-500 transition">
            검색 및 보고서 작성
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 그래프 및 현황 (SVG 활용) */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">글로벌 AI 시장 규모 전망 (2024~2030)</h3>
            <span className="text-[11px] font-black text-blue-400 flex items-center gap-1">
              <TrendingUp size={12} />
              연평균 32.4% 성장
            </span>
          </div>

          <div className="flex h-56 w-full items-end justify-between px-4 pb-2 border-b border-zinc-800 pt-8">
            {[
              { year: "2024", value: 1840, height: "35%" },
              { year: "2025", value: 2430, height: "46%" },
              { year: "2026", value: 3210, height: "61%" },
              { year: "2027", value: 4250, height: "80%" },
              { year: "2028", value: 5630, height: "100%" },
            ].map((bar) => (
              <div key={bar.year} className="flex flex-col items-center gap-2 w-16">
                <span className="text-[10px] font-bold text-zinc-400">${bar.value}B</span>
                <div
                  className="w-8 rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-700"
                  style={{ height: bar.height }}
                />
                <span className="text-xs font-bold text-zinc-500">{bar.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 보고서 목록 */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">최근 생성된 리포트</h3>
          <div className="space-y-3">
            {marketReports.map((report, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/30 p-3.5 hover:border-blue-500/40 hover:bg-zinc-900/35 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {report.category}
                    </span>
                    <h4 className="mt-2 text-xs font-black leading-snug text-zinc-900 dark:text-zinc-150 group-hover:text-blue-400 transition line-clamp-2">
                      {report.title}
                    </h4>
                  </div>
                  <ArrowUpRight size={14} className="shrink-0 text-zinc-650 group-hover:text-blue-400 transition" />
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {report.date}
                  </span>
                  <span className={report.cagrType === "high" ? "text-emerald-400" : "text-zinc-400"}>
                    {report.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
