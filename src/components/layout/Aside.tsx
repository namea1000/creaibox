"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PanelRightClose,
  PanelRightOpen,
  Handshake,
  Building2,
  LayoutTemplate,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  LifeBuoy,
  BookOpen,
  ShieldCheck,
  FileText,
  Cookie,
  Briefcase,
  Undo2,
} from "lucide-react";

export default function Aside() {
  const [isExpanded, setIsExpanded] = useState(false);

  const businessLinks = [
    { label: "비즈니스 홈", href: "/business", icon: Briefcase, color: "from-blue-700 to-indigo-800", iconColor: "text-blue-350" },
    { label: "협업 / 광고 제안", href: "/business/ads", icon: Handshake, color: "from-blue-600 to-indigo-600", iconColor: "text-blue-400" },
    { label: "기업형 맞춤 제작", href: "/business/enterprise", icon: Building2, color: "from-violet-600 to-blue-600", iconColor: "text-violet-400" },
  ];

  const supportLinks = [
    { label: "FAQ 챗봇 - 가이드 문의", href: "/chatbot", icon: MessageCircle, color: "from-cyan-600 to-blue-600", iconColor: "text-cyan-400" },
    { label: "고객지원", href: "/help", icon: LifeBuoy, color: "from-sky-600 to-blue-600", iconColor: "text-sky-400" },
    { label: "스튜디오 가이드", href: "/about", icon: BookOpen, color: "from-violet-600 to-purple-600", iconColor: "text-violet-400" },
    { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck, color: "from-emerald-600 to-green-600", iconColor: "text-emerald-400" },
    { label: "Terms of Service", href: "/terms", icon: FileText, color: "from-slate-600 to-zinc-600", iconColor: "text-zinc-300" },
    { label: "쿠키 정책", href: "/cookie-policy", icon: Cookie, color: "from-amber-600 to-orange-600", iconColor: "text-amber-400" },
    { label: "환불 정책", href: "/refund-policy", icon: Undo2, color: "from-rose-600 to-orange-500", iconColor: "text-rose-450" },
    { label: "콘텐츠 신고하기", href: "/report", icon: AlertTriangle, color: "from-red-600 to-rose-600", iconColor: "text-red-400" },
  ];

  const GradientLink = ({
    item,
    kakao = false,
  }: {
    item: { label: string; href: string; icon: any; color: string; iconColor?: string };
    kakao?: boolean;
  }) => {
    const Icon = item.icon;

    const baseClass = isExpanded
      ? "w-full justify-between px-3 py-2.5"
      : "h-9 w-9 justify-center items-center px-0 py-0 mx-auto";

    if (kakao) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center rounded-lg bg-[#FEE500] text-[#191919] transition-all duration-300 hover:scale-[1.02] ${baseClass}`}
        >
          {isExpanded ? (
            <div className="flex min-w-0 items-center gap-2.5 w-full justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon size={16} className="shrink-0 fill-[#191919]" />
                <span className="truncate text-[12px] font-black max-w-[150px] opacity-100 transition-all duration-200">
                  {item.label}
                </span>
              </div>
              <ArrowRight size={14} className="shrink-0 opacity-80" />
            </div>
          ) : (
            <>
              <Icon size={16} className="shrink-0 fill-[#191919]" />
              {/* 0ms 실시간 직관 툴팁 */}
              <span className="pointer-events-none absolute right-full top-1/2 z-50 mr-2.5 -translate-y-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
                {item.label}
                <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-zinc-900/95 dark:border-l-zinc-800/95" />
              </span>
            </>
          )}
        </a>
      );
    }

    return (
      <Link
        href={item.href}
        className={`group relative flex items-center rounded-lg bg-gradient-to-br ${item.color} text-white transition-all duration-300 hover:scale-[1.02] ${baseClass}`}
      >
        {isExpanded ? (
          <div className="flex min-w-0 items-center gap-2.5 w-full justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <Icon size={16} className="shrink-0" />
              <span className="truncate text-[12px] font-bold max-w-[150px] opacity-100 transition-all duration-200">
                {item.label}
              </span>
            </div>
            <ArrowRight size={14} className="shrink-0 opacity-70" />
          </div>
        ) : (
          <>
            <Icon size={16} className="shrink-0" />
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute right-full top-1/2 z-50 mr-2.5 -translate-y-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              {item.label}
              <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-zinc-900/95 dark:border-l-zinc-800/95" />
            </span>
          </>
        )}
      </Link>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => {
    if (!isExpanded) return null;
    return (
      <p className="mb-2 ml-1.5 overflow-hidden whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-blue-400/90 transition-all duration-200">
        {children}
      </p>
    );
  };

  return (
    <aside
      id="global-studio-aside"
      className={`
        hidden xl:flex h-full shrink-0 flex-col border-l border-zinc-200 dark:border-slate-800/80
        bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out select-none
        ${isExpanded ? "w-56" : "w-14"}
      `}
    >
      {/* 어사이드 상단 헤더 (스튜디오 헤드탑 높이 h-12 및 수평 라인과 완벽 일치) */}
      <div className={`flex h-12 shrink-0 items-center border-b border-zinc-200 dark:border-slate-800/80 px-3 bg-white dark:bg-slate-900 transition-colors duration-300 ${isExpanded ? "justify-between" : "justify-center"}`}>
        {isExpanded && (
          <span className="text-[12px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Quick Hub
          </span>
        )}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-white cursor-pointer"
        >
          {isExpanded ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          
          {/* 0ms 실시간 직관 툴팁 */}
          <span className="pointer-events-none absolute right-full top-1/2 z-50 mr-2.5 -translate-y-1/2 rounded-lg bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
            {isExpanded ? "오른쪽 패널 접기" : "오른쪽 패널 펼치기"}
            <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-zinc-900/95 dark:border-l-zinc-800/95" />
          </span>
        </button>
      </div>

      <div className={`flex-1 px-2.5 py-4 ${!isExpanded ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"}`}>
        <div className={isExpanded ? "space-y-5" : "space-y-2"}>
          <section className={isExpanded ? "" : "space-y-2"}>
            <SectionTitle>Business Hub</SectionTitle>
            <div className="space-y-2">
              {businessLinks.map((item) => (
                <GradientLink key={item.href} item={item} />
              ))}
            </div>
          </section>

          <section className={isExpanded ? "" : "space-y-2"}>
            <SectionTitle>Support</SectionTitle>

            <div className="space-y-2">
              {supportLinks.map((item) => (
                <GradientLink key={item.href} item={item} />
              ))}

              <GradientLink
                kakao
                item={{
                  label: "카카오톡 채널",
                  href: "http://pf.kakao.com/_RxdxmsX",
                  icon: MessageCircle,
                  color: "",
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}