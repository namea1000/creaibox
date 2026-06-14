"use client";

import React, { useState } from "react";
import { LayoutDashboard, ArrowUpRight, Search, Activity, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export default function TrendDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const cards = [
    { label: "추적 중인 키워드", value: "8개", delta: "+2 이달", color: "text-blue-400" },
    { label: "평균 노출 순위", value: "7.8위", delta: "1.2위 상승", color: "text-emerald-400" },
    { label: "평균 SEO 최적화 지수", value: "86%", delta: "+4% 상승", color: "text-violet-400" },
    { label: "월간 예상 유입량", value: "24,500회", delta: "+15% 증가", color: "text-orange-400" },
  ];

  const channelData = [
    { name: "네이버 블로그/검색", percent: 45, color: "bg-emerald-500", rawVal: "11,025회" },
    { name: "유튜브 (Shorts포함)", percent: 35, color: "bg-red-500", rawVal: "8,575회" },
    { name: "구글 검색 (SEO)", percent: 20, color: "bg-blue-500", rawVal: "4,900회" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md">
            <p className="text-[10px] font-bold text-zinc-500">{c.label}</p>
            <p className="text-2xl font-black text-white mt-1">{c.value}</p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
              <span className={c.color}>{c.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main interactive search trend graph card */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <Activity size={16} className="text-blue-400" />
              최근 6개월 검색 트렌드 추이
            </h3>
            <span className="text-[10px] text-zinc-500 font-bold">합산 트렌드 지수</span>
          </div>

          {/* SVG line chart */}
          <div className="h-48 w-full relative pt-4 flex items-end">
            <svg className="absolute inset-0 w-full h-full text-blue-500/20" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                fill="url(#chartGrad)"
                d="M 0,100 L 0,80 L 20,70 L 40,82 L 60,50 L 80,30 L 100,10 L 100,100 Z"
              />
              {/* Stroke line */}
              <path
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2.5"
                d="M 0,80 L 20,70 L 40,82 L 60,50 L 80,30 L 100,10"
              />
            </svg>

            {/* X Axis indicators */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] font-bold text-zinc-650 px-1 pt-1 border-t border-zinc-800">
              <span>1월</span>
              <span>2월</span>
              <span>3월</span>
              <span>4월</span>
              <span>5월</span>
              <span>현재</span>
            </div>
          </div>
        </div>

        {/* Channel Share Progress bars */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <TrendingUp size={16} className="text-emerald-400" />
            유입 채널 점유율
          </h3>
          
          <div className="space-y-4 pt-2">
            {channelData.map((ch, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-300">{ch.name}</span>
                  <span className="text-white font-extrabold">{ch.percent}% <span className="text-[10px] text-zinc-550 font-normal">({ch.rawVal})</span></span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden">
                  <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${ch.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunity recommendations */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
          <Sparkles size={16} className="text-yellow-400" />
          이달의 추천 키워드 기회
        </h3>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-yellow-400 uppercase">HIGH GROWTH</p>
              <h4 className="text-xs font-extrabold text-white mt-1">Suno AI 앨범 기획</h4>
              <p className="text-[10px] text-zinc-500 mt-1">경쟁강도 보통 · 월 검색량 18,200회</p>
            </div>
            <a
              href="/studio/keyword/strategy?keyword=Suno%20AI%20%EC%95%A8%EB%B2%94%20%EA%B8%B0%ED%9A%8D"
              className="inline-flex h-8 items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-3 text-[10px] font-bold text-zinc-350 transition"
            >
              전략 생성
              <ArrowUpRight size={10} />
            </a>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-cyan-400 uppercase">LOW COMPETITION</p>
              <h4 className="text-xs font-extrabold text-white mt-1">무료 AI 쇼츠 템플릿</h4>
              <p className="text-[10px] text-zinc-500 mt-1">경쟁강도 극히낮음 · 월 검색량 9,500회</p>
            </div>
            <a
              href="/studio/keyword/strategy?keyword=%EB%AC%B4%EB%A3%8C%20AI%20%EC%8A%B5%EC%8A%B5%2520%ED%85%9C%ED%94%8C%EB%A6%BF"
              className="inline-flex h-8 items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-3 text-[10px] font-bold text-zinc-350 transition"
            >
              전략 생성
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
