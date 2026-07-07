"use client";

import React, { Suspense } from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import WorkspaceTab from "@/app/studio/image/[section]/components/WorkspaceTab";

export default function PublicDesignClient() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            디자인 스튜디오
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            웹 브라우저에서 스티커, 텍스트, 템플릿을 드래그앤드롭하여 멋진 썸네일과 소셜 카드를 무료로 편집합니다.
          </p>
        </header>

        <Suspense fallback={
          <div className="h-[600px] w-full bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border border-slate-100 dark:border-zinc-800/80 animate-pulse flex items-center justify-center">
            <span className="text-sm font-bold text-slate-400 dark:text-zinc-600">워크스페이스를 불러오는 중...</span>
          </div>
        }>
          <WorkspaceTab />
        </Suspense>
      </div>
    </PublicStudioLayout>
  );
}
