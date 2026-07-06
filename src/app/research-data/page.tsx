"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import ResearchStudioPage from "@/app/studio/research/page";

export default function PublicResearchDataPage() {
  return (
    <PublicStudioLayout>
      <div className="bg-slate-50 dark:bg-zinc-900/10 transition-colors duration-300 min-h-full">
        <ResearchStudioPage />
      </div>
    </PublicStudioLayout>
  );
}
