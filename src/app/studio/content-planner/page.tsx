"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Library,
  CalendarDays,
  TrendingUp,
  Target,
  FileText,
  BarChart3,
  ArrowRight,
  Plus,
  Compass,
  Lightbulb,
  Wand2,
  Bot,
  Settings,
} from "lucide-react";

import {
  ContentOpportunityCards,
  AiRecommendationPanel,
  TrendHubPanel,
  StrategyAnalysisPanel,
} from "@/components/studio/content-planner";

import {
  mockOpportunityCards,
  mockRecommendedSeries,
  mockTrendKeywords,
} from "@/lib/content-planner/mock-data";

export default function ContentPlannerHomePage() {
  const stats = [
    { label: "전략 목표", value: "8개", icon: Target },
    { label: "제작 채널", value: "10개", icon: FileText },
    { label: "분석 키워드", value: "126개", icon: TrendingUp },
    { label: "기획 흐름", value: "통합", icon: BarChart3 },
  ];

  const menus = [
    {
      title: "AI 콘텐츠 기획",
      desc: "목표, 플랫폼, 키워드를 선택해 블로그·쇼츠·SNS 콘텐츠 시리즈를 생성합니다.",
      href: "/studio/content-planner/planning",
      icon: Sparkles,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "기획 라이브러리",
      desc: "저장된 콘텐츠 캠페인과 개별 기획 아이템을 다시 열고 제작으로 연결합니다.",
      href: "/studio/content-planner/library",
      icon: Library,
      color: "from-emerald-600 to-green-600",
    },
    {
      title: "콘텐츠 캘린더",
      desc: "기획한 콘텐츠를 주간·월간 발행 일정으로 배치합니다.",
      href: "/studio/content-planner/calendar",
      icon: CalendarDays,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "트렌드 키워드",
      desc: "Google, Naver, YouTube 트렌드 기반의 콘텐츠 기회를 확인합니다.",
      href: "/studio/content-planner/trends",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "전략 및 타겟 분석",
      desc: "목표 독자 성향, 도달 가능성, 예상 유입 및 수익성 전략을 분석합니다.",
      href: "/studio/content-planner/strategy",
      icon: Target,
      color: "from-rose-500 to-pink-600",
    },
    {
      title: "자동화 워크플로우",
      desc: "기획 완료된 콘텐츠를 블로그 및 동영상 스튜디오로 자동 전송하는 규칙을 설정합니다.",
      href: "/studio/content-planner/workflow",
      icon: Bot,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "플래너 설정",
      desc: "기본 대상 국가, 브랜드 톤앤매너, 기본 플랫폼 및 동기화 주기를 구성합니다.",
      href: "/studio/content-planner/settings",
      icon: Settings,
      color: "from-zinc-600 to-slate-700",
    },
  ];

  const quickActions = [
    { label: "AI 기획 시작", href: "/studio/content-planner/planning" },
    { label: "라이브러리", href: "/studio/content-planner/library" },
    { label: "콘텐츠 캘린더", href: "/studio/content-planner/calendar" },
    { label: "트렌드 분석", href: "/studio/content-planner/trends" },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Banner */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#07131a] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-400">
                <Compass size={15} />
                AI Content Planner
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                AI 콘텐츠 플래너
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                콘텐츠 플래너는 CreAIbox 전체 콘텐츠 제작의 출발점입니다.
                하나의 키워드와 전략에서 블로그, 네이버, 쇼츠, 롱폼, SNS 콘텐츠까지 확장합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/content-planner/library"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-emerald-500/50"
              >
                <Library size={17} />
                라이브러리 보기
              </Link>

              <Link
                href="/studio/content-planner/planning"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white hover:bg-cyan-500"
              >
                <Plus size={17} />
                새 기획 시작
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-8">
            {/* Stats Grid */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Icon size={20} />
                    </div>

                    <p className="text-2xl font-black">{item.value}</p>

                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Menu Cards */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-black">콘텐츠 기획 도구</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  콘텐츠 기획부터 채널별 배포, 일정 관리까지 한 번에 관리하세요.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {menus.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                          >
                            <Icon size={22} />
                          </div>

                          <div>
                            <h3 className="font-black">{item.title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <ArrowRight
                          size={18}
                          className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Opportunity Cards */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-black">콘텐츠 기회 키회드</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  수익화 및 유입 가능성이 높은 키워드 유형 분석 결과입니다.
                </p>
              </div>
              <ContentOpportunityCards items={mockOpportunityCards} />
            </section>

            {/* Bottom Panels - Trend & Strategy */}
            <TrendHubPanel keywords={mockTrendKeywords} />
            <StrategyAnalysisPanel />
          </div>

          <aside className="space-y-6">
            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="text-cyan-400" size={20} />
                <h2 className="text-lg font-black">빠른 시작</h2>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <AiRecommendationPanel items={mockRecommendedSeries} />
          </aside>
        </div>

        {/* Tip Banner */}
        <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <div className="flex items-center gap-3">
            <Wand2 className="text-cyan-400" size={20} />
            <h2 className="text-lg font-black text-white">기획 팁</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            AI 콘텐츠 플래너는 하나의 메인 전략 키워드를 바탕으로 여러 채널(블로그, SNS, 숏폼 등)의 시리즈 기획안을 한 번에 생성합니다.
            기획된 내용들은 라이브러리에 보관되며, 클릭 한 번으로 글쓰기 및 비디오 편집기 등 각 제작 스튜디오로 보내 바로 콘텐츠 제작을 시작할 수 있습니다.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
            <FileText size={14} />
            다음 단계에서는 기획된 캠페인 데이터를 개별 채널의 포스팅 원고 또는 영상 자막 프롬프트와 직접 연동하면 됩니다.
          </div>
        </section>
      </div>
    </div>
  );
}