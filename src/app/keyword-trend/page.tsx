"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import RisingTrends from "@/app/studio/keyword/[section]/components/RisingTrends";

export default function PublicKeywordTrendPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            실시간 트렌드 급상승 키워드
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            인터넷 및 검색 포털에서 급상승하고 있는 주요 실시간 키워드 트렌드를 시각적으로 분석합니다.
          </p>
        </header>

        <RisingTrends />
      </div>
    </PublicStudioLayout>
  );
}
