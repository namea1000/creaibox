"use client";

import React, { Suspense } from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import VideoEditorShell from "@/components/studio/video/editor/VideoEditorShell";
import { Loader2 } from "lucide-react";

export default function PublicVideoEditorPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            영상 편집기
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            별도의 프로그램 설치 없이 브라우저에서 직접 멀티트랙 동영상 편집과 고품질 쇼츠 렌더링을 무료로 수행합니다.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin text-rose-500 mb-3" size={32} />
              <span className="text-sm font-bold">영상 편집 엔진을 준비하는 중입니다...</span>
            </div>
          }
        >
          <VideoEditorShell />
        </Suspense>
      </div>
    </PublicStudioLayout>
  );
}
