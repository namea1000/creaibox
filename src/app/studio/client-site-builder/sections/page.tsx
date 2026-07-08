"use client";

import React, { Suspense } from "react";
import { useSiteBuilder } from "../context";
import SectionEditor from "../components/SectionEditor";
import { Loader2 } from "lucide-react";

function SectionsPageContent() {
  const { selectedSite, sites } = useSiteBuilder();

  // If there are no sites yet, tell user to build one first
  if (!sites || sites.length === 0 || !selectedSite) {
    return (
      <div className="bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">생성된 홈페이지가 없습니다</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          먼저 'AI 홈페이지 빌더' 메뉴를 통해 나만의 첫 홈페이지를 개설해 보세요!
        </p>
      </div>
    );
  }

  return <SectionEditor siteId={selectedSite.id} />;
}

export default function SectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
          <span className="text-sm font-bold">섹션 편집기를 불러오는 중입니다...</span>
        </div>
      }
    >
      <SectionsPageContent />
    </Suspense>
  );
}
