"use client";

import React from "react";
import Link from "next/link";
import {
  PlayCircle,
  Users,
  TrendingUp,
  BarChart3,
  Database,
  Search,
  Video,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Bot,
  LayoutDashboard,
  ArrowRight,
  Plus,
  Clock,
  Flame,
  Eye,
  MousePointerClick,
} from "lucide-react";

export default function YoutubeTrendHomePage() {
  const stats = [
    { label: "분석 채널", value: "0", icon: Users },
    { label: "급상승 영상", value: "0", icon: TrendingUp },
    { label: "SEO 분석", value: "0", icon: Search },
    { label: "전략 리포트", value: "0", icon: FileText },
  ];

  const youtubeMenus = [
    {
      title: "채널 상세 분석",
      desc: "채널 성장률, 영상 업로드 패턴, 조회수 흐름을 분석합니다.",
      href: "/studio/youtube/channel",
      icon: Users,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "급상승 영상 트렌드",
      desc: "실시간 인기 영상과 카테고리별 상승 콘텐츠를 추적합니다.",
      href: "/studio/youtube/rising",
      icon: TrendingUp,
      color: "from-orange-600 to-amber-600",
    },
    {
      title: "경쟁 채널 비교",
      desc: "비슷한 주제의 채널을 비교하고 성장 포인트를 찾습니다.",
      href: "/studio/youtube/compare",
      icon: BarChart3,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "광고 단가 계산기",
      desc: "예상 CPM, RPM, 조회수 기반 수익을 계산합니다.",
      href: "/studio/youtube/cpm",
      icon: Database,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "유튜브 SEO 분석",
      desc: "제목, 설명, 태그, 키워드 최적화 상태를 점검합니다.",
      href: "/studio/youtube/seo",
      icon: Search,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "쇼츠 바이럴 분석",
      desc: "Shorts 조회수 패턴, 반복 시청, 후킹 요소를 분석합니다.",
      href: "/studio/youtube/shorts",
      icon: Video,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "썸네일 CTR 연구소",
      desc: "썸네일 구성, 문구, 색감, 클릭률 개선 포인트를 연구합니다.",
      href: "/studio/youtube/thumbnail",
      icon: ImageIcon,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "AI 제목 생성기",
      desc: "키워드 기반으로 클릭을 유도하는 제목 후보를 생성합니다.",
      href: "/studio/youtube/title",
      icon: Sparkles,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "콘텐츠 전략 리포트",
      desc: "채널 방향성, 콘텐츠 시리즈, 업로드 전략을 리포트로 정리합니다.",
      href: "/studio/youtube/report",
      icon: FileText,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "유튜브 자동 제작 연결",
      desc: "제목, 대본, 썸네일, 영상 제작 흐름을 자동화합니다.",
      href: "/studio/youtube/workflow",
      icon: Bot,
      color: "from-cyan-600 to-blue-600",
    },
  ];

  const quickTopics = [
    "쇼츠 알고리즘",
    "썸네일 CTR",
    "유튜브 SEO",
    "수익화 전략",
    "AI 음악 채널",
    "뉴스 쇼츠",
  ];

  return (
    <div className="min-h-full w-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#1a0909] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-400">
                <PlayCircle size={15} />
                YouTube Trend Studio
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                유튜브 트렌드 분석
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                채널 분석, 급상승 영상, 경쟁 채널 비교, SEO, 쇼츠 바이럴,
                썸네일 CTR, 제목 생성까지 유튜브 성장 전략을 한 곳에서 분석합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/youtube/rising"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 transition hover:border-red-500/50 hover:text-white"
              >
                <Flame size={17} />
                급상승 보기
              </Link>

              <Link
                href="/studio/youtube/channel"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-500"
              >
                <Plus size={17} />
                채널 분석
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
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-black text-white">{item.value}</p>
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
              <h2 className="text-xl font-black text-white">분석 메뉴</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                유튜브 채널과 콘텐츠 성장에 필요한 핵심 분석 도구입니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {youtubeMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-red-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={20} />
              <h2 className="text-lg font-black text-white">빠른 분석 주제</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/studio/youtube/report?topic=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-white">최근 분석</h2>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 분석한 채널이나 영상이 없습니다. 채널 URL을 입력하면 분석 기록이 이곳에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <MousePointerClick className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-white">핵심 체크 포인트</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-red-400" />
                조회수 흐름
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon size={15} className="text-amber-400" />
                썸네일 CTR
              </div>
              <div className="flex items-center gap-2">
                <Search size={15} className="text-emerald-400" />
                검색 키워드
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}