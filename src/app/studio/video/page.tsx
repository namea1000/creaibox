"use client";

import React from "react";
import Link from "next/link";
import {
  Video,
  PlayCircle,
  Mic2,
  Sparkles,
  Image as ImageIcon,
  LayoutDashboard,
  Folder,
  Save,
  Settings,
  Film,
  Clapperboard,
  Wand2,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  MonitorPlay,
} from "lucide-react";

export default function VideoStudioHomePage() {
  const stats = [
    { label: "영상 프로젝트", value: "0", icon: Video },
    { label: "쇼츠 제작", value: "0", icon: PlayCircle },
    { label: "영상 프롬프트", value: "0", icon: Sparkles },
    { label: "렌더 완료", value: "0", icon: Save },
  ];

  const menus = [
    {
      title: "영상 편집기",
      desc: "CapCut 스타일 웹 기반 영상 편집기",
      href: "/studio/video/editor",
      icon: Video,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "쇼츠 & 릴스 제작",
      desc: "유튜브 쇼츠, 인스타 릴스 자동 제작",
      href: "/studio/video/shorts",
      icon: PlayCircle,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "영상 프롬프트",
      desc: "Kling, Veo, Runway, Pika용 프롬프트 생성",
      href: "/studio/video/prompts",
      icon: Sparkles,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "자막 & 음성",
      desc: "AI 자막 생성 및 음성 변환",
      href: "/studio/video/subtitle",
      icon: Mic2,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "영상 템플릿",
      desc: "쇼츠, 광고, 소개영상 템플릿",
      href: "/studio/video/templates",
      icon: LayoutDashboard,
      color: "from-indigo-600 to-blue-600",
    },
    {
      title: "썸네일 연동",
      desc: "이미지 스튜디오와 연동되는 썸네일 제작",
      href: "/studio/video/thumbnail",
      icon: ImageIcon,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "프로젝트 관리",
      desc: "작업중인 영상 프로젝트 관리",
      href: "/studio/video/projects",
      icon: Folder,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "렌더 / 저장 관리",
      desc: "렌더링 및 파일 저장 관리",
      href: "/studio/video/render",
      icon: Save,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "영상 설정",
      desc: "출력 품질, FPS, 인코딩 설정",
      href: "/studio/video/settings",
      icon: Settings,
      color: "from-zinc-600 to-zinc-800",
    },
  ];

  const quickActions = [
    "유튜브 쇼츠 제작",
    "릴스 자동 생성",
    "AI 영상 프롬프트",
    "자막 생성",
    "영상 편집",
    "썸네일 제작",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#07111f] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-400">
                <Film size={15} />
                Video Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                비디오 스튜디오
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                영상 편집, 쇼츠 제작, AI 영상 프롬프트, 자막 생성,
                썸네일 연동까지 영상 제작에 필요한 모든 기능을 제공합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/video/projects"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-cyan-500/50"
              >
                <Folder size={17} />
                프로젝트 보기
              </Link>

              <Link
                href="/studio/video/editor"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white hover:bg-cyan-500"
              >
                <Plus size={17} />
                새 프로젝트
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
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
            <h2 className="text-xl font-black">비디오 제작 도구</h2>
            <p className="mt-1 text-sm text-zinc-500">
              영상 제작부터 편집, 저장까지 한 번에 관리할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40"
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
                      className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom Widgets */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clapperboard className="text-cyan-400" size={20} />
              <h2 className="text-lg font-black">빠른 시작</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-400"
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
              최근 작업한 영상 프로젝트가 여기에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Sparkles size={15} />
                AI 영상 프롬프트 생성
              </div>

              <div className="flex items-center gap-2">
                <MonitorPlay size={15} />
                영상 생성
              </div>

              <div className="flex items-center gap-2">
                <Wand2 size={15} />
                편집 및 자막 추가
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon size={15} />
                썸네일 생성
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}