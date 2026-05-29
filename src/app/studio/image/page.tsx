"use client";

import React from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Library,
  FileText,
  BadgeDollarSign,
  Megaphone,
  Gauge,
  Wand2,
  Palette,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  Layers,
  Download,
  Crop,
  Brush,
} from "lucide-react";

export default function ImageStudioHomePage() {
  const stats = [
    { label: "이미지 프로젝트", value: "0", icon: ImageIcon },
    { label: "썸네일", value: "0", icon: Palette },
    { label: "프롬프트", value: "0", icon: Sparkles },
    { label: "저장 이미지", value: "0", icon: Download },
  ];

  const menus = [
    {
      title: "프롬프트 라이브러리",
      desc: "Midjourney, Flux, 이미지 생성 프롬프트 관리",
      href: "/studio/image/prompts",
      icon: Library,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "썸네일 메이커",
      desc: "유튜브, 블로그, 뉴스용 썸네일 제작",
      href: "/studio/image/thumbnail",
      icon: ImageIcon,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "포스터 & 전단지",
      desc: "홍보 포스터, 전단지, 이벤트 이미지 제작",
      href: "/studio/image/poster",
      icon: FileText,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "디지털 명함",
      desc: "개인 브랜딩용 명함 이미지 제작",
      href: "/studio/image/business-card",
      icon: BadgeDollarSign,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "현수막 & 배너",
      desc: "웹 배너, 광고 배너, 현수막 시안 제작",
      href: "/studio/image/banner",
      icon: Megaphone,
      color: "from-orange-600 to-amber-600",
    },
    {
      title: "WEBP 압축기",
      desc: "이미지를 가볍게 압축하고 WEBP로 변환",
      href: "/studio/image/webp",
      icon: Gauge,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "이미지 편집기",
      desc: "자르기, 리사이즈, 필터, 간단 편집",
      href: "/studio/image/editor",
      icon: Wand2,
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const quickActions = [
    "유튜브 썸네일",
    "블로그 대표이미지",
    "뉴스 카드",
    "포스터",
    "배너",
    "WEBP 변환",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-purple-400">
                <ImageIcon size={15} />
                Image Studio
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                이미지 스튜디오
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                썸네일, 포스터, 전단지, 배너, 명함, 프롬프트 라이브러리,
                이미지 편집과 WEBP 최적화까지 콘텐츠 이미지 제작을 한 곳에서 처리합니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/image/prompts"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 hover:border-purple-500/50"
              >
                <Library size={17} />
                프롬프트 보기
              </Link>

              <Link
                href="/studio/image/thumbnail"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-black text-white hover:bg-purple-500"
              >
                <Plus size={17} />
                이미지 만들기
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
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
            <h2 className="text-xl font-black">이미지 제작 도구</h2>
            <p className="mt-1 text-sm text-zinc-500">
              콘텐츠에 필요한 이미지를 빠르게 제작하고 최적화하세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-purple-500/40"
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
                      className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-purple-400"
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
              <Sparkles className="text-purple-400" size={20} />
              <h2 className="text-lg font-black">빠른 시작</h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-purple-500/40 hover:text-purple-400"
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
              최근 제작한 이미지와 썸네일 작업물이 여기에 표시됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Layers className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black">추천 워크플로우</h2>
            </div>

            <div className="mt-3 space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Brush size={15} />
                프롬프트 생성
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon size={15} />
                이미지 제작
              </div>
              <div className="flex items-center gap-2">
                <Crop size={15} />
                편집 / 리사이즈
              </div>
              <div className="flex items-center gap-2">
                <Gauge size={15} />
                WEBP 최적화
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}