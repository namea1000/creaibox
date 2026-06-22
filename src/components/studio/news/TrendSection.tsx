"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart2, Calendar, Smile, Meh, Frown } from "lucide-react";

export default function TrendSection() {
  const [activeCategory, setActiveCategory] = useState("AI");

  const categories = [
    { id: "AI", label: "인공지능 (AI)", volume: "+34.5%", sentiment: 82 },
    { id: "Fintech", label: "핀테크 (Finance)", volume: "+12.8%", sentiment: 65 },
    { id: "Semiconductor", label: "반도체 (Hardware)", volume: "+42.1%", sentiment: 78 },
  ];

  const activeCat = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 트렌드 분석 (Trend)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              산업군별 뉴스 유입 볼륨 추이와 대중/언론의 주간 긍부정 감성 상태를 종합 계측합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 카테고리 탭 선택 */}
        <div className="lg:col-span-1 space-y-3">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 text-zinc-400 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base font-black ${isActive ? "text-cyan-400" : "text-zinc-900 dark:text-zinc-150"}`}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">
                    {cat.volume}
                  </span>
                </div>
                <div className="mt-3 text-xs font-bold text-zinc-500">
                  뉴스 유입 긍정 지수: <span className="text-zinc-900 dark:text-zinc-300">{cat.sentiment}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 세부 트렌드 및 주간 긍부정 통계 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{activeCat.label} 분석 보고서</h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">유입 성장률: {activeCat.volume}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-black text-cyan-400">
              <Calendar size={13} />
              주간 종합 트렌드
            </span>
          </div>

          {/* 감성 원형 분배도 유사 스택 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">언론/여론 주간 감성 상태</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-4 flex items-center gap-3">
                <Smile className="text-emerald-400" size={24} />
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block">긍정 여론</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{activeCat.sentiment}%</span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-4 flex items-center gap-3">
                <Meh className="text-zinc-400" size={24} />
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block">중립 여론</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{Math.round((100 - activeCat.sentiment) * 0.7)}%</span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-4 flex items-center gap-3">
                <Frown className="text-red-400" size={24} />
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 block">부정 여론</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{Math.round((100 - activeCat.sentiment) * 0.3)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
