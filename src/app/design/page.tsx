"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import WorkspaceTab from "@/app/studio/image/[section]/components/WorkspaceTab";

export default function PublicDesignPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            디자인 (이미지 스튜디오)
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            웹 브라우저에서 스티커, 텍스트, 템플릿을 드래그앤드롭하여 멋진 썸네일과 소셜 카드를 무료로 편집합니다.
          </p>
        </header>

        <WorkspaceTab />
      </div>
    </PublicStudioLayout>
  );
}
