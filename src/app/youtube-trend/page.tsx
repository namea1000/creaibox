"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import RisingVideos from "@/app/studio/youtube/[section]/components/RisingVideos";

export default function PublicYoutubeTrendPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            실시간 유튜브 인기 급상승 트렌드
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            전 세계 국가별, 카테고리별 실시간 인기 급상승 동영상을 한눈에 모니터링하고 분석합니다.
          </p>
        </header>

        <RisingVideos />
      </div>
    </PublicStudioLayout>
  );
}
