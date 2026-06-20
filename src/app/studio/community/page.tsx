"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  MessageCircle,
  PenTool,
  Newspaper,
  Music,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Bot,
  Share2,
  BadgeDollarSign,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  UserPlus,
} from "lucide-react";

export default function CommunityHomePage() {
  const stats = [
    { label: "실시간 접속", value: "0", icon: Users },
    { label: "채팅방", value: "8", icon: MessageCircle },
    { label: "협업 프로젝트", value: "0", icon: Share2 },
    { label: "오늘 인기", value: "0", icon: Flame },
  ];

  const rooms = [
    { title: "실시간 채팅", desc: "전체 크리에이터 로비", href: "/studio/community/chat", icon: MessageCircle, color: "from-blue-600 to-indigo-600" },
    { title: "크리아이박스 글쓰기", desc: "SEO, 블로그, 애드센스", href: "/studio/community/writing", icon: PenTool, color: "from-violet-600 to-blue-600" },
    { title: "네이버 블로그", desc: "C-Rank, 노출, 키워드", href: "/studio/community/naver", icon: Newspaper, color: "from-emerald-600 to-teal-600" },
    { title: "뮤직 스튜디오", desc: "Suno, 가사, 커버 이미지", href: "/studio/community/music", icon: Music, color: "from-rose-600 to-pink-600" },
    { title: "이미지 스튜디오", desc: "Midjourney, Flux, 프롬프트", href: "/studio/community/image", icon: ImageIcon, color: "from-purple-600 to-fuchsia-600" },
    { title: "비디오 스튜디오", desc: "Kling, Veo, 영상 제작", href: "/studio/community/video", icon: Video, color: "from-cyan-600 to-blue-600" },
    { title: "유튜브 연구소", desc: "쇼츠, CTR, 썸네일 전략", href: "/studio/community/youtube", icon: PlayCircle, color: "from-red-600 to-orange-600" },
    { title: "AI 트렌드 토론방", desc: "GPT, Claude, Gemini, AI 뉴스", href: "/studio/community/ai-trend", icon: Bot, color: "from-sky-600 to-violet-600" },
    { title: "협업 프로젝트", desc: "팀원 모집과 공동 제작", href: "/studio/community/collab", icon: Share2, color: "from-amber-600 to-orange-600" },
    { title: "수익화 연구소", desc: "애드센스, 유튜브, AI 부업", href: "/studio/community/money", icon: BadgeDollarSign, color: "from-green-600 to-emerald-600" },
  ];

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#111827] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-pink-400">
                <Users size={15} />
                Creator Community
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                커뮤니티
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                글쓰기, 음악, 이미지, 영상, 유튜브, AI 트렌드까지. 크리에이터들이 주제별 채팅방에서 실시간으로 소통하고 협업하는 공간입니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/community/chat"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-black text-zinc-700 dark:text-zinc-200 transition hover:border-pink-500/50 hover:text-zinc-900 dark:hover:text-white"
              >
                <MessageCircle size={17} />
                채팅 로비
              </Link>

              <Link
                href="/studio/community/collab"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-pink-600 px-4 text-sm font-black text-white transition hover:bg-pink-500"
              >
                <UserPlus size={17} />
                협업 시작
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">{item.label}</p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">실시간 채팅방</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                스튜디오별 주제에 맞춰 대화하고, 정보와 작업물을 공유하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
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
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-pink-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Sparkles className="text-violet-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">커뮤니티 활용 팁</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              작업 중 막히는 부분은 해당 스튜디오 채팅방에 질문하고, 좋은 프롬프트나 제작 노하우는 다른 크리에이터들과 공유하세요.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">최근 활동</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 표시할 활동이 없습니다. 채팅방과 협업 프로젝트가 활성화되면 이곳에 최근 활동이 표시됩니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}