"use client";

import React from "react";
import { useSiteBuilder } from "../context";
import InquiryManager from "../components/InquiryManager";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InquiriesPage() {
  const { sites, selectedSite } = useSiteBuilder();

  // If no sites exist yet
  if (sites.length === 0 || !selectedSite) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
          <MessageSquare size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">운영 중인 홈페이지가 없습니다</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            홈페이지를 개설하면 방문자가 독립된 내 브랜드 사이트 상담 폼을 통해 남긴 상담 문의 내역을 이곳에서 실시간으로 한눈에 관리할 수 있습니다.
          </p>
        </div>
        <Link
          href="/studio/client-site-builder/builder"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-xl transition-all"
        >
          <span>첫 홈페이지 제작하러 가기</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Render inquiries list for selected website
  return <InquiryManager siteId={selectedSite.id} />;
}
