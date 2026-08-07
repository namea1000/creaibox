"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const [mounted, setMounted] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState(2026);
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleClientSocialClick = (url: string, msg: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (msg) {
      alert(msg);
    }
  };

  if (!mounted) {
    return null;
  }

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "기능", href: "/#features" },
        { label: "사용방법", href: "/#how-it-works" },
        { label: "가격", href: "/pricing" },
        { label: "스튜디오", href: "/studio" },
      ],
    },
    {
      title: "Studio",
      links: [
        { label: "AI 글쓰기", href: "/studio/writing/creaibox/create" },
        { label: "워드프레스 글쓰기", href: "/studio/writing/wp/create" },
        { label: "이미지 제작", href: "/studio/visuals/image" },
        { label: "음악 / 가사", href: "/studio/music/lyrics" },
        { label: "트렌드 분석", href: "/studio/tools/trend" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "블로그", href: "/blog" },
        { label: "가이드", href: "/guide" },
        { label: "고객지원", href: "/support" },
        { label: "인포센터", href: "/infocenter" },
        { label: "문의하기", href: "/contact" },
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* SNS 소셜 채널 연동 카드 섹션 - Dark Block */}
      <section className="w-full bg-slate-950 dark:bg-black py-16 border-t border-slate-900 dark:border-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 카카오톡 */}
          <a
            href="https://pf.kakao.com/_RxdxmsX"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-300/10 to-yellow-500/5 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-500/5 dark:border-yellow-500/15 dark:from-yellow-500/5 dark:to-yellow-600/[0.02]"
          >
            <div className="absolute -bottom-6 -right-6 text-yellow-500/[0.08] transition-transform duration-500 group-hover:scale-110">
              <MessageSquare size={120} fill="currentColor" className="stroke-none" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-500/20">
                  <MessageSquare size={22} fill="currentColor" className="stroke-none animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="mt-4 text-lg font-black text-white">
                  카카오톡 채널 추가
                </h3>
                <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300">
                  실시간 1:1 고객 문의와 크리에이박스의 최신 업데이트 소식을 가장 빠르게 접해보세요.
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-yellow-600 dark:text-yellow-400">
                채널 추가하기
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </a>

          {/* 유튜브 */}
          <a
            href="https://www.youtube.com/@creaibox"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-red-500/25 bg-gradient-to-br from-red-500/10 to-red-600/5 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5 dark:border-red-500/15 dark:from-red-500/5 dark:to-red-600/[0.02]"
          >
            <div className="absolute -bottom-6 -right-6 text-red-500/[0.08] transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" width={120} height={120} fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-500/20">
                  <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" className="animate-pulse" style={{ animationDuration: '3s' }}>
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-black text-white">
                  공식 유튜브 구독
                </h3>
                <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300">
                  AI 글쓰기 요령, 이미지 제작 팁 및 플랫폼 활용 튜토리얼 가이드를 영상으로 확인하세요.
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-red-600 dark:text-red-400">
                채널 구독하기
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </a>

          {/* 인스타그램 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              alert("인스타그램 채널은 현재 준비 중입니다. 조만간 오픈될 예정이오니 많은 기대 부탁드립니다!");
            }}
            className="group relative overflow-hidden rounded-3xl border border-pink-500/25 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-400/5 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5 dark:border-pink-500/15 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-orange-500/[0.02] text-left w-full"
          >
            <div className="absolute -bottom-6 -right-6 text-pink-500/[0.08] transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 24 24" width={120} height={120} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20">
                  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" style={{ animationDuration: '3s' }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-black text-white">
                  인스타그램 팔로우
                </h3>
                <p className="mt-2 text-xs font-bold leading-relaxed text-slate-300">
                  매일 배포되는 트렌디한 카드뉴스로 글로벌 AI 동향 및 유용한 크리에이터 팁을 얻어가세요.
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-pink-600 dark:text-pink-400">
                인스타 팔로우
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </button>
          </div>
        </div>
      </section>

      {/* 🔮 CreAibox 메인 커뮤니티 & 공식 1:1 고객지원 4대 채널 허브 럭셔리 섹션 */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white dark:bg-black">
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-black text-violet-300 backdrop-blur-md mb-3">
              <Sparkles size={14} className="text-violet-400 animate-pulse" />
              OFFICIAL SUPPORT & COMMUNITY
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              CreAibox 공식 실시간 지원 및 소통 채널
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium max-w-2xl mx-auto">
              궁금하신 점이나 문의사항이 있으신가요? 1:1 상담부터 커뮤니티 소식까지 다양한 채널을 이용해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 카카오톡 1:1 채널 */}
            <a
              href="https://pf.kakao.com/_RxdxmsX"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-800/80 dark:bg-zinc-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-black text-amber-300 border border-amber-400/30">
                  FAST 1:1
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  카카오톡 1:1 상담
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                  실시간 빠른 1:1 고객상담 및 가입/결제/도메인 문의
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-amber-400">
                상담하기
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* 이메일 고객센터 */}
            <a
              href="mailto:contact@creaibox.com"
              className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-800/80 dark:bg-zinc-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-black text-blue-300 border border-blue-500/30">
                  EMAIL
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                  이메일 공식 문의
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                  contact@creaibox.com<br />비즈니스 제휴 및 공식 기술 서포트
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-blue-400">
                메일 보내기
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* 네이버 공식 블로그 */}
            <a
              href="https://blog.naver.com/a12347720"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-800/80 dark:bg-zinc-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-lg group-hover:scale-110 transition-transform">
                  N
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                  BLOG
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  네이버 공식 블로그
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                  스튜디오 신기능 업데이트 소식과 AI 활용 꿀팁 노하우
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
                블로그 방문
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            {/* 인스타그램 공식 채널 */}
            <button
              onClick={() => handleClientSocialClick("https://www.instagram.com/creaibox_official/", "인스타그램 공식 채널 준비 중입니다! 빠르게 오픈하도록 하겠습니다.")}
              className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-slate-800/80 dark:bg-zinc-900/80 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-black text-pink-300 border border-pink-500/30">
                  INSTAGRAM
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                  인스타그램 공식 채널
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">
                  AI 아티스트 갤러리 카드뉴스 및 이벤트 소식
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-pink-600 dark:text-pink-400">
                인스타 팔로우
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 상세 내용 및 정보 - Light Block */}
      <footer className="w-full bg-white dark:bg-zinc-950 py-16 border-t border-slate-200/50 dark:border-zinc-900/80 transition-colors duration-300" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <Link href="/" className="flex h-10 items-center overflow-hidden">
                {/* Light Mode Logo */}
                <Image
                  src="/logobg.webp"
                  alt="Creaibox Logo"
                  width={173}
                  height={28}
                  className="h-10 w-auto object-contain dark:hidden"
                  priority
                />
                {/* Dark Mode Logo */}
                <Image
                  src="/logobg_dark.webp"
                  alt="Creaibox Logo"
                  width={173}
                  height={28}
                  className="h-10 w-auto object-contain hidden dark:block"
                  priority
                />
              </Link>

              <p className="max-w-sm break-keep text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                글쓰기, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에.
                CreAibox는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/studio"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] shrink-0"
                >
                  <Sparkles size={16} />
                  스튜디오 시작하기
                </Link>

              {/* 카카오톡 채널 추가 */}
              <a
                href="https://pf.kakao.com/_RxdxmsX"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-900 shadow-md shadow-yellow-500/10 transition hover:scale-105 hover:bg-yellow-500 active:scale-[0.97]"
              >
                <MessageSquare size={18} fill="currentColor" className="stroke-none" />
                {/* 0ms 실시간 직관 툴팁 */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
                  카카오톡 채널 추가
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95" />
                </span>
              </a>

              {/* 공식 유튜브 구독 */}
              <a
                href="https://www.youtube.com/@creaibox"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-500/10 transition hover:scale-105 hover:bg-red-700 active:scale-[0.97]"
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {/* 0ms 실시간 직관 툴팁 */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
                  공식 유튜브 구독
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95" />
                </span>
              </a>

              {/* 인스타그램 팔로우 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert("인스타그램 채널은 현재 준비 중입니다. 조만간 오픈될 예정이오니 많은 기대 부탁드립니다!");
                }}
                className="group relative flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/10 transition hover:scale-105 active:scale-[0.97]"
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                {/* 0ms 실시간 직관 툴팁 */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
                  인스타그램 팔로우
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95" />
                </span>
              </button>

              {/* 이메일 문의 */}
              <a
                href="mailto:contact@creaibox.com"
                className="group relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 shadow-sm transition hover:border-blue-400 dark:hover:border-blue-955/20 hover:bg-blue-50 dark:hover:bg-zinc-850 hover:text-blue-600 dark:hover:text-blue-500"
              >
                <Mail size={18} />
                {/* 0ms 실시간 직관 툴팁 */}
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
                  이메일 문의
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900/95 dark:border-t-zinc-800/95" />
                </span>
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.22em] text-slate-900 dark:text-zinc-300">
                {section.title}
              </h4>

              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-zinc-400 transition hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="translate-x-1 -translate-y-1 opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 사업자 정보 명시 (국세청 정식 사업자등록증 및 전자상거래법 제13조 기준) */}
        <div className="border-t border-slate-200/60 dark:border-zinc-900/80 pt-8 pb-4 text-xs font-medium text-slate-500 dark:text-zinc-400 leading-relaxed" suppressHydrationWarning>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2 font-bold text-slate-700 dark:text-zinc-300">
            <span>상호명: 크리에이박스(CreAibox)</span>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <span>대표자: 남정언</span>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <span>사업자등록번호: 535-69-00459</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span>사업장 소재지: 충청남도 천안시 서북구 불당23로 70, 7층 702호 H24호(불당동, 정우프라자)</span>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <span>이메일 문의: contact@creaibox.com</span>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <span>대표전화: 070-8064-8204</span>
            <span className="text-slate-300 dark:text-zinc-800">|</span>
            <a
              href="https://pf.kakao.com/_RxdxmsX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400 hover:underline transition-colors"
              title="카카오톡 1:1 채널 상담으로 바로 이동합니다"
            >
              고객상담: 카카오톡 1:1 채널 (CreAibox)
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-200 dark:border-zinc-900 pt-4 md:flex-row" suppressHydrationWarning>
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-500">
            © 2026 <span className="text-slate-800 dark:text-zinc-300">크리에이박스(CreAibox)</span>.
            All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs font-bold text-slate-500 dark:text-zinc-500 transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs font-bold text-slate-500 dark:text-zinc-500 transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
}