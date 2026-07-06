"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import FreeAssetsPage from "@/app/studio/library/free-assets/page";

export default function PublicMediaLibraryPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            미디어 라이브러리
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            콘텐츠 에디터 및 소셜 디자인에 즉시 활용할 수 있는 AI 생성 이미지와 에셋 컬렉션을 무료로 제공합니다.
          </p>
        </header>

        <FreeAssetsPage />
      </div>
    </PublicStudioLayout>
  );
}
