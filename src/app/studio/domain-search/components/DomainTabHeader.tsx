"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DomainTabHeaderProps {
  title?: string;
  description?: string;
}

const DOMAIN_TABS = [
  { href: "/studio/domain-search", label: "도메인 검색 & 구매" },
  { href: "/studio/domain-search/transfer", label: "타사 도메인 이관" },
  { href: "/studio/domain-search/email", label: "커스텀 이메일 연동" },
  { href: "/studio/domain-search/comparison", label: "도메인 가격 비교표" },
  { href: "/studio/domain-search/perks", label: "도메인 정책 & 혜택" },
  { href: "/studio/domain-search/faq", label: "자주 묻는 질문 (FAQ)" },
];

export default function DomainTabHeader({
  title = "브랜드 독립 도메인 관리",
  description = "독창적인 독립 브랜드 도메인 실시간 검색, 최저가 도매 구매 및 국내 타사 도메인 간편 이관을 관리합니다.",
}: DomainTabHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {/* --- VERCEL STYLE PAGE TITLE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/studio/custom-client-site"
            className="inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            커스텀 홈페이지 스튜디오 ➔
          </Link>
        </div>
      </div>

      {/* --- VERCEL STYLE UNDERLINE SUB-TABS --- */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200 dark:border-zinc-800 text-xs sm:text-sm font-medium [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {DOMAIN_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 -mb-px whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                isActive
                  ? "border-black dark:border-white text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
