"use client";

import React from "react";
import Link from "next/link";
import {
  Library,
  PenTool,
  Newspaper,
  Rss,
  Music,
  Image as ImageIcon,
  Video,
  Sparkles,
  Layers,
  Star,
  Clock,
  Save,
  Archive,
  Bot,
  BarChart3,
  FileArchive,
  ArrowRight,
  Search,
  Plus,
  Globe,
} from "lucide-react";

export default function LibraryHomePage() {
  const libraryMenus = [
    { title: "크리에이박스 콘텐츠", desc: "AI 블로그 글쓰기 결과물", href: "/studio/library/creaibox", icon: PenTool, color: "from-violet-600 to-blue-600" },
    { title: "네이버 콘텐츠", desc: "네이버 블로그 원고 관리", href: "/studio/library/naver", icon: Newspaper, color: "from-emerald-600 to-teal-600" },
    { title: "뉴스 콘텐츠", desc: "뉴스 기반 생성 콘텐츠", href: "/studio/library/news", icon: Rss, color: "from-orange-600 to-red-600" },
    { title: "음악 / 가사 콘텐츠", desc: "Suno, 가사, 음악 프로젝트", href: "/studio/library/music", icon: Music, color: "from-rose-600 to-pink-600" },
    { title: "이미지 콘텐츠", desc: "이미지, 썸네일, 커버 저장소", href: "/studio/library/image", icon: ImageIcon, color: "from-purple-600 to-fuchsia-600" },
    { title: "비디오 콘텐츠", desc: "영상, 쇼츠, 릴스 프로젝트", href: "/studio/library/video", icon: Video, color: "from-cyan-600 to-blue-600" },
  ];

  return (
    <div className="min-h-full w-full bg-transparent px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#0b1120] p-7 shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-500 dark:text-blue-400">
                <Library size={15} />
                Content Library
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                내 콘텐츠 보관함
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-650 dark:text-zinc-400 md:text-base">
                CreAibox에서 생성한 글쓰기, 음악, 이미지, 영상, 프롬프트를 한 곳에서 관리하는 통합 콘텐츠 저장소입니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/writing/creaibox/create"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-500"
              >
                <Plus size={17} />
                새 콘텐츠
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">라이브러리 카테고리</h2>
              <p className="mt-1 text-sm font-medium text-zinc-550 dark:text-zinc-400">
                제작 유형별로 콘텐츠를 정리하고 다시 활용하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {libraryMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-blue-500/40 dark:hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-zinc-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-400 dark:text-zinc-600 transition group-hover:translate-x-1 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-500 dark:text-violet-400" size={20} />
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">빠른 활용 팁</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            각 카테고리 보관함에 저장된 글·이미지·영상 결과물을 활용하여 다음 작업에서 빠르게 재사용할 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}