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
  Info,
  Users,
  Store,
  Gauge,
  ShieldCheck,
  BookOpen,
  Settings,
  CreditCard,
  LifeBuoy,
} from "lucide-react";

export default function Aside() {
  const [isExpanded, setIsExpanded] = useState(false);

  const businessLinks = [
    { label: "협업 / 광고 제안", href: "/business/ads", icon: Handshake, color: "from-blue-600 to-indigo-600", iconColor: "text-blue-400" },
    { label: "기업형 맞춤 제작", href: "/business/enterprise", icon: Building2, color: "from-violet-600 to-blue-600", iconColor: "text-violet-400" },
    { label: "홈페이지 제작", href: "/business/web-dev", icon: LayoutTemplate, color: "from-emerald-600 to-teal-600", iconColor: "text-emerald-400" },
  ];

  const manageLinks = [
    { label: "관리 대시보드", href: "/dashboard", icon: Gauge, color: "text-blue-400" },
    { label: "마켓플레이스", href: "/marketplace", icon: Store, color: "text-emerald-400" },
    { label: "인포센터", href: "/infocenter", icon: Info, color: "text-amber-400" },
    { label: "커뮤니티", href: "/community", icon: Users, color: "text-pink-400" },
  ];

  const supportLinks = [
    { label: "FAQ / Q&A", href: "/faq", icon: HelpCircle, color: "text-yellow-400" },
    { label: "AI 챗봇", href: "/chatbot", icon: MessageCircle, color: "text-emerald-400" },
    { label: "고객지원", href: "/support", icon: LifeBuoy, color: "text-sky-400" },
    { label: "가이드", href: "/guide", icon: BookOpen, color: "text-violet-400" },
  ];

  const systemLinks = [
    { label: "요금제 관리", href: "/pricing", icon: CreditCard, color: "text-blue-400" },
    { label: "보안 / 정책", href: "/privacy", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "서비스 설정", href: "/settings", icon: Settings, color: "text-zinc-300" },
  ];

  const collapsedMenus = [
    ...businessLinks.map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
      color: item.iconColor,
      type: "link",
    })),
    ...manageLinks.map((item) => ({ ...item, type: "link" })),
    { label: "AI 실시간 채팅", href: "/support/chat", icon: MessageCircle, color: "text-emerald-400", type: "link" },
    ...supportLinks.map((item) => ({ ...item, type: "link" })),
    { label: "AI 트렌드 뉴스레터", href: "#newsletter", icon: BellRing, color: "text-yellow-400", type: "button" },
    ...systemLinks.map((item) => ({ ...item, type: "link" })),
    { label: "콘텐츠 신고하기", href: "/report", icon: AlertTriangle, color: "text-red-500", type: "link" },
    { label: "카카오톡 채널", href: "http://pf.kakao.com/_RxdxmsX", icon: MessageCircle, color: "text-[#191919]", type: "kakao" },
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-2 ml-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-blue-400/90">
      {children}
    </p>
  );

  const SimpleLink = ({
    item,
  }: {
    item: { label: string; href: string; icon: any; color: string };
  }) => {
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-bold text-zinc-200 transition hover:bg-zinc-800/80 hover:text-white"
      >
        <Icon size={15} className={`shrink-0 ${item.color}`} />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`
        hidden xl:flex h-[calc(100vh-5rem)] shrink-0 flex-col border-l border-zinc-800/80
        bg-[#090e15] transition-all duration-300 ease-in-out
        ${isExpanded ? "w-56" : "w-14"}
      `}
    >
      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mb-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white"
          title={isExpanded ? "오른쪽 패널 접기" : "오른쪽 패널 펼치기"}
        >
          {isExpanded ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
        </button>

        {!isExpanded ? (
          <nav className="space-y-3">
            {collapsedMenus.map((item) => {
              const Icon = item.icon;

              if (item.type === "kakao") {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEE500] text-[#191919] transition hover:scale-105"
                  >
                    <Icon size={17} className="fill-[#191919]" />
                  </a>
                );
              }

              if (item.type === "button") {
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
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                >
                  <Icon size={17} className={item.color} />
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="space-y-5">
            <section>
              <SectionTitle>Business Hub</SectionTitle>

              <div className="space-y-2">
                {businessLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-lg bg-gradient-to-br ${item.color} px-3 py-2.5 text-white transition hover:scale-[1.01]`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate text-[12px] font-bold">{item.label}</span>
                      </div>
                      <ArrowRight size={14} className="shrink-0 opacity-70" />
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionTitle>Manage</SectionTitle>
              <div className="space-y-1">
                {manageLinks.map((item) => (
                  <SimpleLink key={item.href} item={item} />
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>Support</SectionTitle>

              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-100">AI 실시간 채팅</span>
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

              <div className="mt-2 space-y-1">
                {supportLinks.map((item) => (
                  <SimpleLink key={item.href} item={item} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-2">
                <BellRing size={15} className="text-yellow-400" />
                <span className="text-xs font-black text-zinc-100">AI 트렌드 뉴스레터</span>
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

            <section>
              <SectionTitle>System</SectionTitle>
              <div className="space-y-1">
                {systemLinks.map((item) => (
                  <SimpleLink key={item.href} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={15} className="text-violet-400" />
                <span className="text-xs font-black text-zinc-100">빠른 팁</span>
              </div>

              <p className="text-[10.5px] leading-relaxed text-zinc-400">
                좌측 폴더형 메뉴에서 스튜디오를 선택하면 세부 작업 메뉴가 펼쳐집니다.
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