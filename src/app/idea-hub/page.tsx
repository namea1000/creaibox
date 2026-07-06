"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import IdeaHub from "@/app/studio/content-planner/idea-hub/page";

export default function PublicIdeaHubPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            콘텐츠 아이디어 허브
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            다양한 카테고리별 실시간 콘텐츠 제작 아이디어 추천과 연계 글감 기획 시리즈를 제공합니다.
          </p>
        </header>

        <IdeaHub />
      </div>
    </PublicStudioLayout>
  );
}
