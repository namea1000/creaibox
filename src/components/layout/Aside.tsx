"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PanelRightClose,
  PanelRightOpen,
  Handshake,
  Building2,
  LayoutTemplate,
  Send,
  BellRing,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Megaphone,
  Sparkles,
} from "lucide-react";

export default function Aside() {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickLinks = [
    { label: "협업 / 광고 제안", href: "/business/ads", icon: Handshake, color: "from-blue-600 to-indigo-600" },
    { label: "기업형 맞춤 제작", href: "/business/enterprise", icon: Building2, color: "from-violet-600 to-blue-600" },
    { label: "홈페이지 제작", href: "/business/web-dev", icon: LayoutTemplate, color: "from-emerald-600 to-teal-600" },
  ];

  const iconMenus = [
    { label: "비즈니스", icon: Megaphone, color: "text-blue-400" },
    { label: "AI 채팅", icon: MessageCircle, color: "text-emerald-400" },
    { label: "뉴스레터", icon: BellRing, color: "text-yellow-400" },
    { label: "도움말", icon: HelpCircle, color: "text-violet-400" },
  ];

  return (
    <aside
      className={`
        hidden xl:flex h-[calc(100vh-5rem)] shrink-0 flex-col border-l border-zinc-800/80
        bg-[#090e15] transition-all duration-300 ease-in-out
        ${isExpanded ? "w-52" : "w-14"}
      `}
    >
      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white lg:flex"
          title={isExpanded ? "오른쪽 패널 접기" : "오른쪽 패널 펼치기"}
        >
          {isExpanded ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
        </button>
        {!isExpanded ? (
          <nav className="space-y-3">
            {iconMenus.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  title={item.label}
                  onClick={() => setIsExpanded(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                >
                  <Icon size={17} className={item.color} />
                </button>
              );
            })}

            <a
              href="http://pf.kakao.com/_RxdxmsX"
              target="_blank"
              rel="noopener noreferrer"
              title="카카오톡 채널"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEE500] text-[#191919] transition hover:scale-105"
            >
              <MessageCircle size={17} className="fill-[#191919]" />
            </a>
          </nav>
        ) : (
          <div className="space-y-5">
            <section>
              <p className="mb-2 ml-1.5 text-[14px] font-black uppercase tracking-[0.22em] text-blue-400/90">
                Business Hub
              </p>

              <div className="space-y-2">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-lg bg-gradient-to-br ${item.color} px-3 py-2.5 text-white transition hover:scale-[1.01]`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate text-[12px] font-bold">
                          {item.label}
                        </span>
                      </div>

                      <ArrowRight size={14} className="shrink-0 opacity-70" />
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="mb-2 ml-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-blue-400/90">
                Support
              </p>

              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-100">
                    AI 실시간 채팅
                  </span>
                </div>

                <p className="mb-3 text-[10.5px] leading-relaxed text-zinc-400">
                  작업 중 궁금한 점을 AI 서포터에게 물어보세요.
                </p>

                <Link
                  href="/support/chat"
                  className="block rounded-lg bg-blue-500/10 py-2 text-center text-xs font-bold text-blue-400 transition hover:bg-blue-500/20"
                >
                  채팅 시작하기
                </Link>
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-2">
                <BellRing size={15} className="text-yellow-400" />
                <span className="text-xs font-black text-zinc-100">
                  AI 트렌드 뉴스레터
                </span>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 pr-9 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-md bg-blue-600 p-1.5 text-white hover:bg-blue-500"
                >
                  <Send size={13} />
                </button>
              </form>
            </section>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={15} className="text-violet-400" />
                <span className="text-xs font-black text-zinc-100">빠른 팁</span>
              </div>

              <p className="text-[10.5px] leading-relaxed text-zinc-400">
                작업 유형을 선택하면 좌측 메뉴가 해당 기능에 맞게 정리됩니다.
              </p>
            </section>

            <Link
              href="/report"
              className="group flex items-center gap-2 rounded-lg px-2.5 py-2 transition hover:bg-red-500/10"
            >
              <AlertTriangle size={15} className="text-red-500" />
              <span className="text-xs font-medium text-zinc-400 group-hover:text-red-400">
                콘텐츠 신고하기
              </span>
            </Link>

            <a
              href="http://pf.kakao.com/_RxdxmsX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-3 py-2.5 text-xs font-black text-[#191919] transition hover:scale-[1.01]"
            >
              <MessageCircle size={15} className="fill-[#191919]" />
              <span>카카오톡 채널 추가</span>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}