"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Database,
  Layers,
  BarChart3,
  LineChart,
  TrendingUp,
  PlayCircle,
  Bot,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  Plus,
  Clock,
  Target,
  Hash,
  Radar,
} from "lucide-react";

export default function KeywordTrendHomePage() {
  const stats = [
    { label: "분석 키워드", value: "0", icon: Search },
    { label: "연관 키워드", value: "0", icon: Layers },
    { label: "순위 추적", value: "0", icon: LineChart },
    { label: "전략 생성", value: "0", icon: Bot },
  ];

  const keywordMenus = [
    {
      title: "키워드 대량 조회",
      desc: "여러 키워드의 검색량, 경쟁도, 트렌드를 한 번에 확인합니다.",
      href: "/studio/keyword/bulk",
      icon: Database,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "연관 키워드 발굴",
      desc: "메인 키워드와 연결되는 롱테일 키워드를 찾아냅니다.",
      href: "/studio/keyword/related",
      icon: Layers,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "형태소 분석기",
      desc: "문장과 제목에서 핵심 단어, 명사, 검색어 후보를 추출합니다.",
      href: "/studio/keyword/morphology",
      icon: BarChart3,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "실시간 순위 추적",
      desc: "선택한 키워드의 노출 순위와 변동 흐름을 추적합니다.",
      href: "/studio/keyword/rank",
      icon: LineChart,
      color: "from-orange-600 to-amber-600",
    },
    {
      title: "트렌드 급상승 분석",
      desc: "최근 빠르게 상승하는 검색어와 관심 주제를 감지합니다.",
      href: "/studio/keyword/rising",
      icon: TrendingUp,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "유튜브 키워드 분석",
      desc: "유튜브 제목, 설명, 태그에 적합한 키워드를 분석합니다.",
      href: "/studio/keyword/youtube",
      icon: PlayCircle,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "SEO 경쟁 분석",
      desc: "상위 노출 콘텐츠의 제목, 키워드, 문서 구조를 비교합니다.",
      href: "/studio/keyword/seo",
      icon: Search,
      color: "from-lime-600 to-green-600",
    },
    {
      title: "AI 키워드 전략 생성",
      desc: "타겟 키워드 기반으로 콘텐츠 전략과 제목 방향을 제안합니다.",
      href: "/studio/keyword/strategy",
      icon: Bot,
      color: "from-purple-600 to-fuchsia-600",
    },
    {
      title: "자동 콘텐츠 연결",
      desc: "분석한 키워드를 글쓰기, 뉴스, 유튜브 제작 흐름과 연결합니다.",
      href: "/studio/keyword/workflow",
      icon: Sparkles,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "트렌드 대시보드",
      desc: "키워드 변화, 급상승 주제, 분석 현황을 한눈에 확인합니다.",
      href: "/studio/keyword/dashboard",
      icon: LayoutDashboard,
      color: "from-blue-600 to-indigo-600",
    },
  ];

  const quickKeywords = [
    "AI",
    "유튜브 쇼츠",
    "애드센스",
    "삼성전자",
    "부동산 전망",
    "Suno AI",
    "Midjourney",
    "ChatGPT",
  ];

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#061519] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-400">
                <Search size={15} />
                Keyword Trend Studio
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                키워드 트렌드 분석
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                검색 키워드, 연관어, 급상승 트렌드, SEO 경쟁도, 유튜브 키워드까지
                콘텐츠 제작 전에 필요한 키워드 전략을 한 곳에서 분석합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/keyword/rising"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-black text-zinc-700 dark:text-zinc-200 transition hover:border-cyan-500/50 hover:text-zinc-900 dark:hover:text-white"
              >
                <TrendingUp size={17} />
                급상승 보기
              </Link>

              <Link
                href="/studio/keyword/strategy"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white transition hover:bg-cyan-500"
              >
                <Plus size={17} />
                전략 생성
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
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
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">분석 메뉴</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                콘텐츠 제작 전 검색 수요와 경쟁 환경을 먼저 확인하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {keywordMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
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
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
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
              <Hash className="text-cyan-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">빠른 키워드</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickKeywords.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/studio/keyword/strategy?keyword=${encodeURIComponent(keyword)}`}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">최근 분석</h2>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 분석한 키워드가 없습니다. 키워드 분석 기록이 쌓이면 이곳에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Target className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Radar size={15} className="text-cyan-400" />
                키워드 발굴
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-violet-400" />
                경쟁 분석
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-amber-400" />
                콘텐츠 전략 생성
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}