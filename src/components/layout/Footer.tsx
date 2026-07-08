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
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("studio_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }

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

      {/* 푸터 상세 내용 및 정보 - Light Block */}
      <footer className="w-full bg-white dark:bg-zinc-950 py-16 border-t border-slate-200/50 dark:border-zinc-900/80 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <Link href="/" className="flex h-10 items-center overflow-hidden">
                <Image
                  src={theme === "dark" ? "/logobg_dark.webp" : "/logobg.webp"}
                  alt="Creaibox Logo"
                  width={173}
                  height={28}
                  className="object-contain"
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
                title="카카오톡 채널 추가"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-slate-900 shadow-md shadow-yellow-500/10 transition hover:scale-105 hover:bg-yellow-500 active:scale-[0.97]"
              >
                <MessageSquare size={18} fill="currentColor" className="stroke-none" />
              </a>

              {/* 공식 유튜브 구독 */}
              <a
                href="https://www.youtube.com/@creaibox"
                target="_blank"
                rel="noopener noreferrer"
                title="공식 유튜브 구독"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-500/10 transition hover:scale-105 hover:bg-red-700 active:scale-[0.97]"
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* 인스타그램 팔로우 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert("인스타그램 채널은 현재 준비 중입니다. 조만간 오픈될 예정이오니 많은 기대 부탁드립니다!");
                }}
                title="인스타그램 팔로우"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/10 transition hover:scale-105 active:scale-[0.97]"
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>

              {/* 이메일 문의 */}
              <a
                href="mailto:contact@creaibox.com"
                title="이메일 문의"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 shadow-sm transition hover:border-blue-400 dark:hover:border-blue-955/20 hover:bg-blue-50 dark:hover:bg-zinc-850 hover:text-blue-600 dark:hover:text-blue-500"
              >
                <Mail size={18} />
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

        <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-200 dark:border-zinc-900 pt-4 md:flex-row">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-500">
            © {currentYear} <span className="text-slate-800 dark:text-zinc-300">크리에이박스(CreAibox)</span>.
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
              className="text-xs font-bold text-slate-500 dark:text-zinc-505 transition hover:text-violet-600 dark:hover:text-violet-400"
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