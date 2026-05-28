"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";

import {
  PenLine,
  ImageIcon,
  Music,
  Video,
  Newspaper,
  TrendingUp,
  ArrowRight,
  Sparkles,
  FileText,
  Library,
  Zap,
  Clock,
  CheckCircle2,
  BarChart3,
  Wand2,
  Mic2,
} from "lucide-react";

export default function StudioPage() {
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState("Studio");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const studioMenus = [
    {
      key: "Writing",
      title: "AI 글쓰기",
      desc: "블로그, 네이버, 워드프레스 글쓰기",
      icon: PenLine,
      href: "/studio/writing/creaibox/create",
      color: "from-blue-600 to-cyan-500",
    },
    {
      key: "Visuals",
      title: "이미지 / 썸네일",
      desc: "이미지, 썸네일, 비주얼 제작",
      icon: ImageIcon,
      href: "/studio/visuals/image",
      color: "from-violet-600 to-fuchsia-500",
    },
    {
      key: "Music",
      title: "음악 / 가사",
      desc: "Suno 프롬프트, 가사, 음악 기획",
      icon: Music,
      href: "/studio/music/lyrics",
      color: "from-rose-600 to-orange-500",
    },
    {
      key: "Script",
      title: "영상 대본",
      desc: "쇼츠, 유튜브, 영상 장면 구성",
      icon: Video,
      href: "/studio/script/gen",
      color: "from-emerald-600 to-teal-500",
    },
    {
      key: "Tools",
      title: "트렌드 분석",
      desc: "키워드, 유튜브, 콘텐츠 리포트",
      icon: TrendingUp,
      href: "/studio/tools/trend",
      color: "from-amber-500 to-yellow-500",
    },
    {
      key: "Writing",
      title: "뉴스 콘텐츠",
      desc: "뉴스형 글쓰기와 이슈 정리",
      icon: Newspaper,
      href: "/studio/writing/news",
      color: "from-indigo-600 to-blue-500",
    },
  ];

  const quickActions = [
    {
      title: "새 블로그 글쓰기",
      desc: "AI로 글 구조부터 본문까지 생성",
      icon: FileText,
      href: "/studio/writing/creaibox/create",
    },
    {
      title: "이미지 만들기",
      desc: "콘텐츠용 이미지 프롬프트 제작",
      icon: Wand2,
      href: "/studio/visuals/image",
    },
    {
      title: "가사 생성하기",
      desc: "음악 제목과 가사 초안 생성",
      icon: Mic2,
      href: "/studio/music/lyrics",
    },
    {
      title: "라이브러리 보기",
      desc: "저장된 작업물 확인",
      icon: Library,
      href: "/studio/library",
    },
  ];

  const recentWorks = [
    {
      title: "워드프레스 블로그 글 초안",
      type: "Writing",
      time: "방금 전",
    },
    {
      title: "Suno 음악 프롬프트 기획",
      type: "Music",
      time: "오늘",
    },
    {
      title: "유튜브 쇼츠 제목 아이디어",
      type: "Trend",
      time: "어제",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar
          activeMenu={activeMenu}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
            aria-label="메뉴 닫기"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

          <div className="flex min-h-0 flex-1">
            <main className="min-w-0 flex-1">
              <div className="px-5 py-8 lg:px-8">
                {/* HERO */}
                <section className="relative overflow-hidden rounded-[24px] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-[#0b1020] to-[#111827] p-8 shadow-2xl">
                  <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
                  <div className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

                  <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                      <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black text-blue-300">
                        <Sparkles size={15} />
                        CreAIbox AI Workspace
                      </div>

                      <h2 className="break-keep text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                        오늘 만들 콘텐츠를
                        <br />
                        여기서 바로 시작하세요
                      </h2>

                      <p className="mt-5 max-w-2xl break-keep text-base font-medium leading-relaxed text-zinc-400">
                        상단 입력창에 만들고 싶은 콘텐츠를 바로 입력하거나,
                        아래 스튜디오 카드에서 원하는 작업을 선택하세요.
                      </p>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() =>
                            router.push("/studio/writing/creaibox/create")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
                        >
                          AI 글쓰기 시작
                          <ArrowRight size={17} />
                        </button>

                        <button
                          onClick={() => router.push("/apivault")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-6 py-4 text-sm font-black text-zinc-200 transition hover:border-blue-500/40 hover:text-white"
                        >
                          API 키 연결
                        </button>
                      </div>
                    </div>

                    {/* STATUS CARDS */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "생성 가능 도구",
                          value: "20+",
                          icon: Zap,
                        },
                        {
                          label: "최근 작업",
                          value: "3",
                          icon: Clock,
                        },
                        {
                          label: "저장된 콘텐츠",
                          value: "Library",
                          icon: Library,
                        },
                        {
                          label: "상태",
                          value: "Beta",
                          icon: CheckCircle2,
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.label}
                            className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
                          >
                            <Icon size={22} className="mb-4 text-blue-400" />

                            <p className="text-2xl font-black text-white">
                              {item.value}
                            </p>

                            <p className="mt-1 text-xs font-bold text-zinc-500">
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* STUDIO MENUS */}
                <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {studioMenus.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={`${item.title}-${item.href}`}
                        onMouseEnter={() => setActiveMenu(item.key)}
                        onClick={() => {
                          setActiveMenu(item.key);
                          router.push(item.href);
                        }}
                        className="group rounded-[20px] border border-zinc-800 bg-zinc-950/70 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-zinc-900"
                      >
                        <div
                          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-r ${item.color} text-white shadow-lg shadow-black/30`}
                        >
                          <Icon size={25} />
                        </div>

                        <h3 className="text-xl font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 break-keep text-sm font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                          Open Tool
                          <ArrowRight size={15} />
                        </div>
                      </button>
                    );
                  })}
                </section>

                {/* QUICK ACTIONS */}
                <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-[20px] border border-zinc-800 bg-zinc-950/70 p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                          Quick Actions
                        </p>

                        <h3 className="mt-1 text-2xl font-black text-white">
                          빠른 실행
                        </h3>
                      </div>

                      <BarChart3 className="text-blue-400" />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {quickActions.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.title}
                            onClick={() => router.push(item.href)}
                            className="group flex items-center gap-4 rounded-[16px] border border-zinc-800 bg-zinc-900/60 p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/10"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-zinc-800 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                              <Icon size={20} />
                            </div>

                            <div>
                              <p className="text-sm font-black text-zinc-100">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs font-medium text-zinc-500">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RECENT WORKS */}
                  <div className="rounded-[20px] border border-zinc-800 bg-zinc-950/70 p-6">
                    <div className="mb-6">
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                        Recent Works
                      </p>

                      <h3 className="mt-1 text-2xl font-black text-white">
                        최근 작업
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {recentWorks.map((work) => (
                        <div
                          key={work.title}
                          className="rounded-[16px] border border-zinc-800 bg-zinc-900/60 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-zinc-100">
                                {work.title}
                              </p>

                              <p className="mt-1 text-xs font-bold text-zinc-500">
                                {work.type}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-md bg-zinc-800 px-3 py-1 text-[10px] font-black text-zinc-400">
                              {work.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </main>

            <Aside />
          </div>
        </div>
      </div>
    </div>
  );
}