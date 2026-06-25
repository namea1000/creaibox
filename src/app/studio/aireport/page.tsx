"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  BarChart3,
  Building2,
  Newspaper,
  Layers,
  Gauge,
  LineChart,
  TrendingUp,
  Database,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  Plus,
  Search,
  Clock,
  Bot,
  BriefcaseBusiness,
} from "lucide-react";

export default function AIReportHomePage() {
  const stats = [
    { label: "생성 리포트", value: "0", icon: FileText },
    { label: "시장 분석", value: "0", icon: BarChart3 },
    { label: "산업 분석", value: "0", icon: Building2 },
    { label: "AI 인사이트", value: "0", icon: Sparkles },
  ];

  const reportMenus = [
    {
      title: "AI 시장 리포트",
      desc: "AI 시장 규모, 주요 기업, 기술 변화 흐름을 정리합니다.",
      href: "/studio/report/market",
      icon: BarChart3,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "산업별 AI 분석",
      desc: "교육, 금융, 의료, 콘텐츠 등 산업별 AI 적용 현황을 분석합니다.",
      href: "/studio/report/industry",
      icon: Building2,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "AI 뉴스 브리핑",
      desc: "AI 관련 최신 뉴스와 이슈를 브리핑 형식으로 정리합니다.",
      href: "/studio/report/news",
      icon: Newspaper,
      color: "from-orange-600 to-red-600",
    },
    {
      title: "AI 툴 비교 분석",
      desc: "ChatGPT, Claude, Gemini, Midjourney 등 주요 AI 툴을 비교합니다.",
      href: "/studio/report/tools",
      icon: Layers,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "AI 생산성 리포트",
      desc: "업무 자동화, 콘텐츠 제작, 개발 생산성 향상 포인트를 분석합니다.",
      href: "/studio/report/productivity",
      icon: Gauge,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "AI 투자 분석",
      desc: "AI 관련 기업, 반도체, 클라우드, 인프라 투자 포인트를 정리합니다.",
      href: "/studio/report/investment",
      icon: LineChart,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "AI 트렌드 예측",
      desc: "향후 AI 기술, 산업, 콘텐츠 시장의 변화 방향을 예측합니다.",
      href: "/studio/report/forecast",
      icon: TrendingUp,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "AI 리서치 센터",
      desc: "리포트 작성에 필요한 자료, 키워드, 인용 정보를 정리합니다.",
      href: "/studio/report/research",
      icon: Database,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "AI 콘텐츠 자동 생성",
      desc: "분석 자료를 블로그, 보고서, 카드뉴스 형태로 변환합니다.",
      href: "/studio/report/generator",
      icon: Sparkles,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "AI 인사이트 대시보드",
      desc: "리포트 생성 현황과 주요 AI 트렌드 지표를 확인합니다.",
      href: "/studio/report/dashboard",
      icon: LayoutDashboard,
      color: "from-green-600 to-emerald-600",
    },
  ];

  const quickTopics = [
    "AI 시장 전망",
    "생성형 AI",
    "AI 반도체",
    "AI 교육",
    "AI 콘텐츠",
    "AI 투자",
  ];

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#0e1020] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                <FileText size={15} />
                AI Report Studio
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                AI 리포트
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                AI 시장, 산업, 투자, 생산성, 툴 비교, 뉴스 브리핑까지.
                CreAibox에서 AI 기반 리포트를 빠르게 생성하고 콘텐츠로 확장하세요.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/report/research"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-black text-zinc-700 dark:text-zinc-200 transition hover:border-indigo-500/50 hover:text-zinc-900 dark:hover:text-white"
              >
                <Search size={17} />
                리서치 시작
              </Link>

              <Link
                href="/studio/report/generator"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-black text-white transition hover:bg-indigo-500"
              >
                <Plus size={17} />
                리포트 생성
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 리포트 메뉴</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                분석 주제를 선택하고 리포트를 콘텐츠로 확장하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reportMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-zinc-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-indigo-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Bot className="text-indigo-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">빠른 리포트 주제</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/studio/report/generator?topic=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-300 transition hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">최근 리포트</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 생성된 리포트가 없습니다. 리포트 생성 기능이 연결되면 최근 작업물이 이곳에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">활용 방향</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              생성된 리포트는 블로그 글, 뉴스레터, 유튜브 대본, 카드뉴스, 투자 메모 등으로 확장할 수 있습니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}