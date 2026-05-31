"use client";

import React from "react";
import Link from "next/link";
import {
  PenTool,
  Home,
  Edit3,
  FileText,
  Archive,
  Lightbulb,
  BarChart3,
  Image as ImageIcon,
  Database,
  Settings,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  Search,
  BookOpen,
  Target,
  Wand2,
  Save,
} from "lucide-react";

export default function CreaiboxWritingHomePage() {
  const stats = [
    { label: "저장 원고", value: "0", icon: Archive },
    { label: "생성 글쓰기", value: "0", icon: Edit3 },
    { label: "아이디어", value: "0", icon: Lightbulb },
    { label: "트렌드 분석", value: "0", icon: BarChart3 },
  ];

  const menus = [
    {
      title: "AI 포스팅 글쓰기",
      desc: "키워드만 입력하면 SEO 블로그 글을 자동 생성합니다.",
      href: "/studio/writing/creaibox/create",
      icon: Edit3,
      color: "from-violet-600 to-blue-600",
    },
    {
      title: "AI 포스팅 에디터",
      desc: "생성된 원고를 수정, 확장, 재작성하는 편집 공간입니다.",
      href: "/studio/writing/creaibox/editor",
      icon: FileText,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "발행 콘텐츠 아카이브",
      desc: "저장된 원고, 발행 콘텐츠, 작성 이력을 관리합니다.",
      href: "/studio/writing/creaibox/list",
      icon: Archive,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "아이디어 제너레이터",
      desc: "블로그 주제, 제목, 소제목, 콘텐츠 방향을 제안합니다.",
      href: "/studio/writing/creaibox/ideagenerator",
      icon: Lightbulb,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "트렌드 대시보드",
      desc: "키워드, 검색 흐름, 콘텐츠 트렌드를 확인합니다.",
      href: "/studio/writing/creaibox/analytics",
      icon: BarChart3,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "AI 이미지 워크샵",
      desc: "글에 어울리는 대표 이미지와 썸네일 프롬프트를 만듭니다.",
      href: "/studio/writing/creaibox/image",
      icon: ImageIcon,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "지식 베이스",
      desc: "브랜드 정보, 참고자료, 반복 사용 문구를 저장합니다.",
      href: "/studio/writing/creaibox/knowledge",
      icon: Database,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "엔진 커스텀 세팅",
      desc: "글 길이, 문체, SEO 설정, 생성 옵션을 관리합니다.",
      href: "/studio/writing/creaibox/settings",
      icon: Settings,
      color: "from-slate-600 to-zinc-700",
    },
  ];

  const quickActions = [
    "SEO 블로그 글쓰기",
    "애드센스형 글쓰기",
    "뉴스 기반 글쓰기",
    "제목 10개 생성",
    "소제목 구성",
    "메타디스크립션",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <PenTool size={15} />
                Creaibox Writing Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                크리아이박스 글쓰기
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                키워드 입력부터 SEO 블로그 글쓰기, 제목 생성, 메타데이터,
                이미지 프롬프트, 아카이브 저장까지 콘텐츠 글쓰기 과정을 한 곳에서 관리합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/writing/creaibox/list"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-violet-500/50"
              >
                <Archive size={17} />
                아카이브 보기
              </Link>

              <Link
                href="/studio/writing/creaibox/create"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
              >
                <Plus size={17} />
                새 글쓰기
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
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

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">글쓰기 작업 메뉴</h2>
            <p className="mt-1 text-sm text-zinc-500">
              글쓰기 생성, 편집, 저장, 트렌드 분석까지 순서대로 사용할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
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
                      className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
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
              <Sparkles className="text-violet-400" size={20} />
              <h2 className="text-lg font-black">빠른 시작</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-violet-500/40 hover:text-violet-400"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">최근 작업</h2>
            </div>

            <p className="mt-3 text-sm text-zinc-500">
              최근 생성하거나 저장한 글쓰기 원고가 여기에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Target className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Search size={15} />
                키워드 선정
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={15} />
                글 구조 설계
              </div>

              <div className="flex items-center gap-2">
                <Wand2 size={15} />
                AI 본문 생성
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon size={15} />
                대표 이미지 제작
              </div>

              <div className="flex items-center gap-2">
                <Save size={15} />
                아카이브 저장
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Home className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">제작 팁</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            크리아이박스 글쓰기는 키워드, 글 길이, 문체, SEO 메타데이터,
            이미지 프롬프트를 하나의 흐름으로 묶어 저장하면 이후 블로그 발행과 재활용이 쉬워집니다.
          </p>
        </section>
      </div>
    </div>
  );
}
