"use client";

import React from "react";
import { LayoutDashboard, FileText, Database, ShieldAlert, Zap, ArrowUpRight, TrendingUp } from "lucide-react";

export default function DashboardSection() {
  const stats = [
    { label: "생성된 총 리포트", value: "24건", icon: FileText, change: "+3건 오늘" },
    { label: "벡터 스토리지 사용량", value: "38.5 MB", icon: Database, change: "한도 1.0 GB" },
    { label: "누적 API 쿼리 토큰", value: "2.4M Tokens", icon: Zap, change: "한도 10.0M" },
    { label: "평균 리포트 평점 스코어", value: "94.2점", icon: TrendingUp, change: "우수 등급" },
  ];

  const recentActivities = [
    { type: "생성", doc: "2026 AI 헬스케어 동향 분석.pdf", date: "10분 전", size: "1.4 MB" },
    { type: "검색", doc: "블랙웰 아키텍처 RAG 질의", date: "1시간 전", size: "324 tokens" },
    { type: "업로드", doc: "Google_Gemini_1.5_Technical_Report.pdf", date: "어제", size: "5.7 MB" },
  ];

  return (
    <div className="space-y-6">
      {/* 타이틀 헤더 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 인사이트 대시보드</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              전체 AI 리포트 생성 건수, 벡터 데이터베이스 임베딩 상태 및 API 자원 소모량을 원격 모니터링합니다.
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
                <Icon size={16} className="text-indigo-400" />
              </div>
              <p className="mt-3 text-2xl font-black text-zinc-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                {item.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* 최근 활동 및 상태 내역 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* 최근 활동 */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">최근 리서치 활동 이력</h3>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-black text-indigo-400">
                    {act.type}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-150 truncate max-w-xs md:max-w-md">
                    {act.doc}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-zinc-500 block">{act.date}</span>
                  <span className="text-[9px] text-zinc-500">{act.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시스템 리소스 상태 */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">서비스 리소스 상태</h3>
          <div className="space-y-4 text-xs font-bold text-zinc-650 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Gemini API 연동 상태</span>
              <span className="text-emerald-400">정상 연동됨</span>
            </div>
            <div className="flex justify-between">
              <span>벡터 DB 인덱스 노드 수</span>
              <span>124 nodes</span>
            </div>
            <div className="flex justify-between">
              <span>오늘의 리포트 잔여 할당량</span>
              <span>18 / 20회</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
