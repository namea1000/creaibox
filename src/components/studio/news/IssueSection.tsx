"use client";

import React, { useState } from "react";
import { Radio, Search, TrendingUp, RefreshCw, MessageSquare } from "lucide-react";

export default function IssueSection() {
  const [activeKeyword, setActiveKeyword] = useState("자가 학습 AI 에이전트");

  const hotKeywords = [
    { name: "자가 학습 AI 에이전트", index: 98.4, volume: "125K 건", mentions: "트위터, 레딧 외" },
    { name: "EU AI 법안 의무 발효", index: 87.2, volume: "74K 건", mentions: "유로 테크 뉴스" },
    { name: "엔비디아 FP4 칩 검증", index: 81.5, volume: "62K 건", mentions: "테크 디스커션 카페" },
    { name: "초장문 컨텍스트 윈도우", index: 76.9, volume: "45K 건", mentions: "개발 커뮤니티" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <Radio size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">실시간 이슈 탐지 (Issue)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              국내외 주요 커뮤니티, 뉴스 포털의 급상승 키워드를 감지하여 실시간 작성 가능한 소재로 추천합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 실시간 급상승 키워드 목록 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">실시간 급상승 소재</h3>
            <button className="text-zinc-500 hover:text-red-400 transition" title="새로고침">
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="space-y-2">
            {hotKeywords.map((kw, idx) => {
              const isActive = kw.name === activeKeyword;

              return (
                <button
                  key={kw.name}
                  type="button"
                  onClick={() => setActiveKeyword(kw.name)}
                  className={`w-full rounded-xl border p-3.5 text-left transition flex items-center justify-between gap-3 ${
                    isActive
                      ? "border-red-500/60 bg-red-500/10"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-red-500/35"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <span className={`text-xs font-black ${isActive ? "text-red-400" : "text-zinc-500"}`}>
                      {idx + 1}
                    </span>
                    <span className={`text-xs font-black truncate ${isActive ? "text-red-400" : "text-zinc-900 dark:text-zinc-150"}`}>
                      {kw.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 shrink-0">
                    지수 {kw.index}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택 키워드 트렌드 리포트 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">#{activeKeyword} 트렌드 분석</h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">감지 소스: {hotKeywords.find(k => k.name === activeKeyword)?.mentions}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
              <TrendingUp size={13} />
              소셜 언급량 {hotKeywords.find(k => k.name === activeKeyword)?.volume}
            </span>
          </div>

          {/* 차트 영역 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <MessageSquare size={14} className="text-red-400" />
              최근 12시간 소셜 버즈량 추이
            </h4>
            <div className="flex h-36 w-full items-end justify-between px-4 pb-2 border-b border-zinc-800 pt-8 bg-zinc-950/20 rounded-xl p-3">
              {[
                { time: "00:00", height: "15%" },
                { time: "03:00", height: "25%" },
                { time: "06:00", height: "45%" },
                { time: "09:00", height: "80%" },
                { time: "12:00", height: "100%" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-16">
                  <div
                    className="w-5 rounded-t bg-red-500 transition-all duration-700"
                    style={{ height: item.height }}
                  />
                  <span className="text-[10px] font-black text-zinc-650">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
