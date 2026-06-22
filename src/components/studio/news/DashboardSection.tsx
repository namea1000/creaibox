"use client";

import React from "react";
import { LayoutDashboard, Newspaper, Rss, ShieldCheck, Zap, BarChart2 } from "lucide-react";

export default function DashboardSection() {
  const stats = [
    { label: "실시간 수집 기사", value: "148건", icon: Newspaper, change: "오늘 수집 완료" },
    { label: "자동화 채널 구독", value: "3개 채널", icon: Rss, change: "블로그, Tistory 연동" },
    { label: "AI 번역/요약 호출", value: "89회", icon: Zap, change: "잔여 한도 911회" },
    { label: "자동 포스팅 성공률", value: "98.2%", icon: ShieldCheck, change: "정상 가동 중" },
  ];

  const popularSources = [
    { name: "네이버 뉴스 - IT/과학", shares: "48%", count: "71건" },
    { name: "글로벌 RSS 테크 피드", shares: "32%", count: "47건" },
    { name: "정부 보도 자료 포털", shares: "20%", count: "30건" },
  ];

  return (
    <div className="space-y-6">
      {/* 대시보드 헤더 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 대시보드</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              전체 뉴스 스크랩 수량, 예약 자동 포스팅 결과 현황 및 AI 요약 API 한도를 통합 지휘합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4칸 스태츠 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5"
            >
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-bold">{item.label}</span>
                <Icon size={16} className="text-orange-400" />
              </div>
              <p className="mt-3 text-2xl font-black text-zinc-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                {item.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* 수집 매체 점유율 및 리소스 콘솔 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* 매체 분석 */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart2 size={16} className="text-orange-400" />
            뉴스 수집 매체 점유율 (최근 7일)
          </h3>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {popularSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-150">{source.name}</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-zinc-500">{source.count}</span>
                  <span className="text-orange-400 font-black">{source.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 리포팅 콘솔 로그 */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">실시간 발행 채널 로그</h3>
          <div className="space-y-3 font-mono text-[10px] leading-relaxed text-zinc-500">
            <div className="flex justify-between">
              <span>[23:08:12] 네이버 글쓰기 API 호출</span>
              <span className="text-emerald-400">Success</span>
            </div>
            <div className="flex justify-between">
              <span>[22:45:04] AI 요약본 생성 요청</span>
              <span className="text-emerald-400">Success</span>
            </div>
            <div className="flex justify-between">
              <span>[21:15:32] 워드프레스 REST 인증</span>
              <span className="text-red-400">Failed (No Key)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
