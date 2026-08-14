"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  PenTool,
  Plus,
  FileText,
  Repeat,
  Sparkles,
  FolderKanban,
  Calendar,
  Zap,
  Settings,
  Image as ImageIcon,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Rss,
  Code2,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
} from "lucide-react";

export default function CreaiboxBlogHubPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    recreatedPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadBlogStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        // Fetch counts from writing_creaibox_posts
        const { count: total } = await supabase
          .from("writing_creaibox_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { count: published } = await supabase
          .from("writing_creaibox_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "published");

        const { count: draft } = await supabase
          .from("writing_creaibox_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "draft");

        const { count: recreated } = await supabase
          .from("writing_creaibox_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("post_type", "naver_recreated");

        setStats({
          totalPosts: total ?? 0,
          publishedPosts: published ?? 0,
          draftPosts: draft ?? 0,
          recreatedPosts: recreated ?? 0,
        });
      } catch (err) {
        console.error("Error loading blog stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBlogStats();
  }, [supabase]);

  // Selling points for CreaiBox Blog
  const sellingPoints = [
    {
      icon: Zap,
      badge: "Google Indexing API",
      title: "구글 1초 실시간 색인",
      desc: "글 발행 즉시 구글봇(Googlebot)으로 수집 핑(Ping) 100% 무설정 자동 송신. 수 분 내 구글 실시간 검색 노출 보장.",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconColor: "text-amber-500 dark:text-amber-400",
      borderColor: "border-amber-500/30",
    },
    {
      icon: ShieldCheck,
      badge: "C-Rank & DIA+ 파괴",
      title: "네이버/SNS 4대 재창조",
      desc: "어순·어휘 전면 파괴 원고 재창조 엔진으로 네이버 유사 문서 패널티 100% 우회 및 상위 노출 랭킹 획득.",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: "text-emerald-500 dark:text-emerald-400",
      borderColor: "border-emerald-500/30",
    },
    {
      icon: Rss,
      badge: "Auto Sitemap & RSS",
      title: "동적 사이트맵 & /feed",
      desc: "네이버 서치어드바이저 500 에러 예방 가상 환영 기사 주입 및 멀티테넌트 서브도메인 피드 실시간 서빙.",
      gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-blue-500 dark:text-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Code2,
      badge: "JSON-LD Schema",
      title: "구조화 스키마 1초 주입",
      desc: "구글, 네이버 로봇 전용 표준 마크업(Article, FAQPage 등) 자동 생성 및 HTML Head 내부 실시간 주입.",
      gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
      iconColor: "text-violet-500 dark:text-violet-400",
      borderColor: "border-violet-500/30",
    },
  ];

  // Align 100% with Sidebar submenus for "크리에이박스 블로그"
  const blogSubmenuCards = [
    {
      title: "블로그 새글 쓰기",
      desc: "구글 1초 색인 & 네이버 최적화 AI 포스팅 작성 에디터로 진입합니다.",
      href: "/studio/writing/creaibox/new-post",
      icon: Plus,
      color: "from-violet-600 to-indigo-600",
      badge: "추천",
    },
    {
      title: "블로그 원고 관리",
      desc: "저장된 전체 원고의 수정, 발행 상태, 구글 핑 송신 이력을 통합 관리합니다.",
      href: "/studio/writing/creaibox/list",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "네이버/SNS 재발행",
      desc: "크리에이박스 원고를 유사 문서 패널티 없이 네이버/SNS 전용으로 4대 재창조합니다.",
      href: "/studio/writing/creaibox/recreate",
      icon: Repeat,
      color: "from-emerald-600 to-teal-600",
      badge: "인기",
    },
    {
      title: "블로그 설정 및 관리",
      desc: "블로그 헤더, 작가/브랜드 프로필, 대표 도메인 및 뱃지 노출 옵션을 설정합니다.",
      href: "/studio/writing/creaibox/blog-management",
      icon: Settings,
      color: "from-slate-600 to-zinc-700",
    },
    {
      title: "AI 콘텐츠 기획",
      desc: "키워드 기반 주제, 타겟 독자, 연계 목차 및 기획 시리즈를 자동 조립합니다.",
      href: "/studio/content-planner/generator",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "기획 라이브러리",
      desc: "생성된 캠페인 기획서 및 원고 세트를 한눈에 보관하고 불러옵니다.",
      href: "/studio/content-planner/library",
      icon: FolderKanban,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "콘텐츠 캘린더",
      desc: "월별 블로그 발행 일정과 SNS 업로드 스케줄을 달력 뷰로 시각화합니다.",
      href: "/studio/content-planner/calendar",
      icon: Calendar,
      color: "from-purple-600 to-violet-600",
    },
    {
      title: "자동화 워크플로우",
      desc: "무인 자동 발행 스케줄링 및 무인 자동화 워크플로우 프로세스를 관리합니다.",
      href: "/studio/content-planner/workflow",
      icon: Zap,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "썸네일 생성 관리",
      desc: "블로그와 SNS 노출 반응률을 높이는 AI 고화질 대표 썸네일 이미지를 만듭니다.",
      href: "/studio/writing/creaibox/thumbnail",
      icon: ImageIcon,
      color: "from-fuchsia-600 to-pink-600",
    },
    {
      title: "지식 & 페르소나 설정",
      desc: "나만의 고유 말투(어조) 페르소나와 전문 인용 지식 아카이브를 등록합니다.",
      href: "/studio/writing/creaibox/persona-knowledge",
      icon: UserCheck,
      color: "from-indigo-600 to-blue-600",
    },
  ];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#06080d] px-5 py-8 text-slate-800 dark:text-slate-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 🌟 MAIN HEADER & HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-[#0d111c] dark:via-[#131929] dark:to-[#090b14] p-7 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                <PenTool size={14} />
                CreaiBox Blog Hub
              </div>

              <h1 className="text-3xl font-black text-slate-900 dark:text-white md:text-5xl tracking-tight">
                크리에이박스 블로그
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base font-medium">
                <strong className="text-violet-600 dark:text-violet-400 font-bold">
                  구글 1초 실시간 색인(Google Indexing API)
                </strong>
                과{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  네이버 DIA+ / C-Rank 4대 재창조
                </strong>
                로 무장한 독보적인 AI 블로그 스튜디오입니다. 글 작성부터 SEO 최적화, 썸네일 제작, 무인 색인 전송까지 한 곳에서 완벽하게 관리하세요.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/studio/writing/creaibox/list"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 text-sm font-black text-slate-700 dark:text-slate-200 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-white transition shadow-sm"
              >
                <BookOpen size={16} />
                원고 관리 아카이브
              </Link>

              <Link
                href="/studio/writing/creaibox/new-post"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-black text-white hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25"
              >
                <Plus size={18} />
                블로그 새글 쓰기
              </Link>
            </div>
          </div>
        </section>

        {/* 🚀 REAL-TIME STATS COUNTER */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm transition-colors">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <FileText size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {isLoading ? "-" : stats.totalPosts}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
              전체 작성 포스트
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm transition-colors">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {isLoading ? "-" : stats.publishedPosts}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
              구글/네이버 발행 완료
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm transition-colors">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PenTool size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {isLoading ? "-" : stats.draftPosts}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
              작성 중임 임시 보관
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-sm transition-colors">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Repeat size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {isLoading ? "-" : stats.recreatedPosts}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
              네이버/SNS 재발행 수
            </p>
          </div>
        </section>

        {/* 💎 DISTINCTIVE SELLING POINTS (장점 및 차별화 셀링포인트) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="text-amber-500" size={22} />
              크리에이박스 블로그 4대 차별화 핵심 기술 (USP)
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              타사 블로그 도구와 비교 불가능한 검색 노출 및 자동화 독점 기술입니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sellingPoints.map((sp) => {
              const Icon = sp.icon;
              return (
                <div
                  key={sp.title}
                  className={`relative overflow-hidden rounded-2xl border ${sp.borderColor} bg-gradient-to-b ${sp.gradient} bg-white dark:bg-zinc-900/80 p-5 shadow-sm dark:shadow-none transition hover:-translate-y-1`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-block rounded-md bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[11px] font-black text-slate-700 dark:text-slate-200">
                      {sp.badge}
                    </span>
                    <Icon className={sp.iconColor} size={22} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {sp.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                    {sp.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 📑 MAIN SUBMENU GRID CARDS (좌측 서브 메뉴들과 100% 매칭) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutGrid className="text-violet-500" size={22} />
              블로그 작업 및 관리 센터 (10대 핵심 기능)
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              좌측 사이드바 서브메뉴와 100% 동기화된 블로그 스튜디오 직관 기능 메뉴입니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogSubmenuCards.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 transition hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none"
                >
                  {item.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-black text-violet-600 dark:text-violet-400 border border-violet-500/20">
                      {item.badge}
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-slate-400 dark:text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 💡 HELPFUL BLOG OPERATIONAL TIP */}
        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 transition-colors">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-500 dark:text-violet-400" size={20} />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              크리에이박스 블로그 가동 팁
            </h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            글 작성 시 <strong className="text-violet-600 dark:text-violet-400">[지식 & 페르소나 설정]</strong>에서 본인만의 어조와 인용 자료를 등록해두면, AI가 매번 자동으로 나만의 독특한 필체로 블로그 원고를 완성해 줍니다. 
            또한 작성 완료 즉시 <strong className="text-emerald-600 dark:text-emerald-400">[네이버/SNS 재발행]</strong> 메뉴를 활용하면 1개 원고로 네이버 블로그 상위 노출 랭킹까지 한 번에 확보하실 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
