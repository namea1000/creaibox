"use client";

import React from "react";
import Link from "next/link";
import {
  Newspaper,
  Rss,
  Sparkles,
  Radio,
  TrendingUp,
  FileText,
  PenTool,
  PlayCircle,
  Image as ImageIcon,
  Video,
  Megaphone,
  Archive,
  LayoutDashboard,
  ArrowRight,
  Search,
  Plus,
  Clock,
  Globe2,
  BarChart3,
} from "lucide-react";

export default function NewsContentHomePage() {
  const stats = [
    { label: "실시간 뉴스", value: "0", icon: Newspaper },
    { label: "오늘 수집", value: "0", icon: Rss },
    { label: "AI 분석", value: "0", icon: Sparkles },
    { label: "발행 콘텐츠", value: "0", icon: Megaphone },
  ];

  const newsMenus = [
    {
      title: "실시간 뉴스 수집",
      desc: "국내외 뉴스, RSS, 관심 키워드 뉴스를 수집합니다.",
      href: "/studio/news/collect",
      icon: Rss,
      color: "from-orange-600 to-red-600",
    },
    {
      title: "AI 뉴스 요약",
      desc: "뉴스 본문을 3줄 요약, 상세 요약, 핵심 키워드로 정리합니다.",
      href: "/studio/news/summary",
      icon: Sparkles,
      color: "from-violet-600 to-blue-600",
    },
    {
      title: "실시간 이슈 탐지",
      desc: "급상승 뉴스와 많이 언급되는 키워드를 빠르게 감지합니다.",
      href: "/studio/news/issue",
      icon: Radio,
      color: "from-red-600 to-rose-600",
    },
    {
      title: "뉴스 트렌드 분석",
      desc: "주간, 월간, 산업별 뉴스 흐름을 분석합니다.",
      href: "/studio/news/trend",
      icon: TrendingUp,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "AI 뉴스 리포트 생성",
      desc: "시장, 산업, 기업, 주식 관련 리포트를 생성합니다.",
      href: "/studio/news/report",
      icon: FileText,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "뉴스 기반 블로그 생성",
      desc: "수집한 뉴스를 SEO 블로그 콘텐츠로 변환합니다.",
      href: "/studio/news/blog",
      icon: PenTool,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "뉴스 기반 유튜브 대본 생성",
      desc: "뉴스 브리핑, 쇼츠, 롱폼 유튜브 대본을 생성합니다.",
      href: "/studio/news/youtube-script",
      icon: PlayCircle,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "뉴스 카드 제작",
      desc: "SNS 카드뉴스, 썸네일, 요약 이미지 콘텐츠를 제작합니다.",
      href: "/studio/news/card",
      icon: ImageIcon,
      color: "from-pink-600 to-fuchsia-600",
    },
    {
      title: "AI 뉴스 앵커",
      desc: "뉴스 원고, 앵커 대본, 영상용 브리핑을 구성합니다.",
      href: "/studio/news/anchor",
      icon: Video,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "뉴스 콘텐츠 자동 발행",
      desc: "블로그, 워드프레스, 네이버 발행 흐름을 자동화합니다.",
      href: "/studio/news/publish",
      icon: Megaphone,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "뉴스 아카이브",
      desc: "저장한 뉴스와 생성된 뉴스 콘텐츠를 관리합니다.",
      href: "/studio/news/archive",
      icon: Archive,
      color: "from-slate-600 to-zinc-600",
    },
    {
      title: "뉴스 대시보드",
      desc: "뉴스 수집량, 인기 키워드, 분석 현황을 확인합니다.",
      href: "/studio/news/dashboard",
      icon: LayoutDashboard,
      color: "from-green-600 to-emerald-600",
    },
  ];

  const quickTopics = [
    "AI 뉴스",
    "경제 뉴스",
    "주식 뉴스",
    "IT 뉴스",
    "부동산 뉴스",
    "유튜브 트렌드",
  ];

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#171008] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <Newspaper size={15} />
                News Content Studio
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                뉴스 콘텐츠
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                실시간 뉴스 수집부터 AI 요약, 뉴스 리포트, 블로그 글쓰기,
                유튜브 대본, 카드뉴스 제작, 자동 발행까지 연결하는 뉴스 콘텐츠 허브입니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/news/collect"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-black text-zinc-700 dark:text-zinc-200 transition hover:border-orange-500/50 hover:text-zinc-900 dark:hover:text-white"
              >
                <Search size={17} />
                뉴스 수집
              </Link>

              <Link
                href="/studio/news/report"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-black text-white transition hover:bg-orange-500"
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
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
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 워크플로우</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                뉴스를 수집하고, 분석하고, 콘텐츠로 변환하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {newsMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
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
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-orange-400"
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
              <Globe2 className="text-orange-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">빠른 뉴스 주제</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/studio/news/collect?keyword=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-300 transition hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">최근 수집 뉴스</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 수집된 뉴스가 없습니다. 뉴스 수집 기능이 연결되면 최근 뉴스가 이곳에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">AI 분석 상태</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              요약, 리포트, 블로그 변환 등 AI 분석 내역이 쌓이면 이곳에서 확인할 수 있습니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}