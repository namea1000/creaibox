"use client";

import React from "react";
import Link from "next/link";
import {
  Music,
  Sparkles,
  Mic2,
  Palette,
  Image as ImageIcon,
  Video,
  Languages,
  PlayCircle,
  Tags,
  Library,
  Save,
  Folder,
  Clock,
  Settings,
  ArrowRight,
  Plus,
  Headphones,
  Disc3,
  Circle,
  Wand2,
  FileText,
  Waves,
} from "lucide-react";

export default function MusicStudioHomePage() {
  const stats = [
    { label: "음악 프로젝트", value: "0", icon: Music },
    { label: "가사 생성", value: "0", icon: Mic2 },
    { label: "커버 이미지", value: "0", icon: ImageIcon },
    { label: "저장된 곡", value: "0", icon: Save },
  ];

  const menus = [
    {
      title: "곡 기획",
      desc: "장르, 분위기, 콘셉트, 앨범 방향성을 설계합니다.",
      href: "/studio/music/planning",
      icon: Sparkles,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "가사 & SUNO",
      desc: "가사 생성, SUNO 프롬프트, 곡 설명을 한 번에 구성합니다.",
      href: "/studio/music/lyrics",
      icon: Mic2,
      color: "from-rose-600 to-pink-600",
    },
    {
      title: "앨범 관리",
      desc: "여러 곡을 하나의 앨범으로 묶고 커버, 장르, 설명을 관리합니다.",
      href: "/studio/music/albums",
      icon: Disc3,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "음악 라이브러리",
      desc: "생성한 가사, Suno 프롬프트, 이미지/영상 프롬프트를 목록으로 관리합니다.",
      href: "/studio/music/library",
      icon: Library,
      color: "from-emerald-600 to-green-600",
    },
    {
      title: "오디오 비주얼라이저",
      desc: "음악에 반응하는 오디오 스펙트럼과 비주얼라이저를 만듭니다.",
      href: "/studio/music/visualizer",
      icon: Waves,
      color: "from-pink-600 to-fuchsia-600",
    },
    {
      title: "스타일 포맷",
      desc: "EDM, Pop, Lo-fi, Ambient 등 스타일 프롬프트를 정리합니다.",
      href: "/studio/music/style-format",
      icon: Palette,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "커버 이미지",
      desc: "앨범 커버, 유튜브 커버, 플레이리스트 이미지를 제작합니다.",
      href: "/studio/music/cover-image",
      icon: ImageIcon,
      color: "from-purple-600 to-fuchsia-600",
    },
    {
      title: "영상 프롬프트",
      desc: "음악 영상, 루프 영상, 비주얼라이저 프롬프트를 만듭니다.",
      href: "/studio/music/video-prompt",
      icon: Video,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "번역",
      desc: "가사, 제목, 설명문을 다국어로 번역합니다.",
      href: "/studio/music/translate",
      icon: Languages,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "유튜브 최적화",
      desc: "제목, 설명문, 태그, SEO 문구를 생성합니다.",
      href: "/studio/music/youtube-seo",
      icon: PlayCircle,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "태그 관리",
      desc: "장르, 분위기, 유튜브 태그, 검색 키워드를 관리합니다.",
      href: "/studio/music/tags",
      icon: Tags,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "플레이리스트",
      desc: "앨범, 믹스, 채널별 플레이리스트를 구성합니다.",
      href: "/studio/music/playlist",
      icon: Library,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "프로젝트",
      desc: "앨범 단위, 채널 단위, 곡 단위 프로젝트를 관리합니다.",
      href: "/studio/music/projects",
      icon: Folder,
      color: "from-sky-600 to-blue-600",
    },
    {
      title: "작업 내역",
      desc: "최근 생성, 수정, 저장한 음악 작업 기록을 확인합니다.",
      href: "/studio/music/history",
      icon: Clock,
      color: "from-slate-600 to-zinc-700",
    },
    {
      title: "설정",
      desc: "기본 장르, 언어, 프롬프트 형식, 저장 옵션을 설정합니다.",
      href: "/studio/music/settings",
      icon: Settings,
      color: "from-zinc-600 to-slate-700",
    },
  ];

  const quickActions = [
    { label: "Suno 곡 만들기", href: "/studio/music/lyrics" },
    { label: "가사 생성", href: "/studio/music/lyrics" },
    { label: "음악 라이브러리", href: "/studio/music/library" },
    { label: "앨범 커버", href: "/studio/music/cover-image" },
    { label: "유튜브 설명문", href: "/studio/music/youtube-seo" },
    { label: "영상 프롬프트", href: "/studio/music/video-prompt" },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#1a0712] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-400">
                <Music size={15} />
                Music Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                뮤직 스튜디오
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                곡 기획, 가사 생성, SUNO 프롬프트, 앨범 커버, 영상 프롬프트,
                유튜브 최적화까지 음악 콘텐츠 제작 흐름을 한 곳에서 관리합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/music/library"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-emerald-500/50"
              >
                <Library size={17} />
                라이브러리 보기
              </Link>

              <Link
                href="/studio/music/lyrics"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-500"
              >
                <Plus size={17} />
                새 곡 만들기
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
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
            <h2 className="text-xl font-black">음악 제작 도구</h2>
            <p className="mt-1 text-sm text-zinc-500">
              곡 아이디어부터 업로드용 메타데이터까지 순서대로 제작하세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-rose-500/40"
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
                      className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-rose-400"
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
              <Headphones className="text-rose-400" size={20} />
              <h2 className="text-lg font-black">빠른 시작</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-rose-500/40 hover:text-rose-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black">최근 작업</h2>
            </div>

            <p className="mt-3 text-sm text-zinc-500">
              최근 생성한 가사, SUNO 프롬프트, 커버 이미지가 여기에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Disc3 className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Sparkles size={15} />
                곡 콘셉트 기획
              </div>

              <div className="flex items-center gap-2">
                <Mic2 size={15} />
                가사 & SUNO 프롬프트 생성
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon size={15} />
                커버 이미지 제작
              </div>

              <div className="flex items-center gap-2">
                <Circle size={15} />
                유튜브 제목 / 설명문 최적화
              </div>

              <div className="flex items-center gap-2">
                <Video size={15} />
                영상 프롬프트 제작
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
          <div className="flex items-center gap-3">
            <Wand2 className="text-rose-400" size={20} />
            <h2 className="text-lg font-black text-white">제작 팁</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            음악 콘텐츠는 곡 제목, SUNO 프롬프트, 커버 이미지, 유튜브 설명문,
            영상 프롬프트를 하나의 프로젝트로 묶어 관리하면 반복 제작 속도가 훨씬 빨라집니다.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500">
            <FileText size={14} />
            다음 단계에서는 곡 프로젝트 DB와 라이브러리 저장 구조를 연결하면 됩니다.
          </div>
        </section>
      </div>
    </div>
  );
}
