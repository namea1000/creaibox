"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import ReportStudioPage from "@/app/studio/report/page";

export default function PublicAiReportPage() {
  return (
    <PublicStudioLayout>
      <div className="bg-slate-50 dark:bg-zinc-900/10 transition-colors duration-300 min-h-full">
        <ReportStudioPage />
      </div>
    </PublicStudioLayout>
  );
}
