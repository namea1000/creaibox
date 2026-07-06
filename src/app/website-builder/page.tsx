"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import SiteCreationWizard from "@/app/studio/client-site-builder/components/SiteCreationWizard";
import { useRouter } from "next/navigation";

export default function PublicWebsiteBuilderPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/studio/client-site-builder");
  };

  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <header className="space-y-2 text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            AI 홈페이지 제작
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-bold max-w-2xl">
            회사 소개, 학원 홍보 등 비즈니스 성격에 특화된 전문 반응형 웹사이트 기획안을 AI로 수립하고 제작합니다.
          </p>
        </header>

        <div className="bg-slate-50 dark:bg-zinc-900/30 rounded-[32px] border border-slate-200 dark:border-zinc-800/80 p-6 md:p-10">
          <SiteCreationWizard onSuccess={handleSuccess} />
        </div>
      </div>
    </PublicStudioLayout>
  );
}
