"use client";

import React, { Suspense } from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import MusicLyricsPage from "@/app/studio/music/lyrics/page";
import { Loader2 } from "lucide-react";

function LyricGeneratorContent() {
  return <MusicLyricsPage />;
}

export default function PublicLyricGeneratorPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            가사 소재 허브
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            곡 컨셉, 악기 구성, 감성을 선택하여 Suno AI 등 음원 제작 툴에 최적화된 작사 문구를 AI로 생성합니다.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin text-rose-500 mb-3" size={32} />
              <span className="text-sm font-bold">작사 엔진을 준비하는 중입니다...</span>
            </div>
          }
        >
          <LyricGeneratorContent />
        </Suspense>
      </div>
    </PublicStudioLayout>
  );
}
