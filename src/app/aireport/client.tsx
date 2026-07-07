"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import ReportMainPage from "@/app/studio/aireport/page";

export default function PublicAiReportMainClient() {
  return (
    <PublicStudioLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <ReportMainPage />
      </div>
    </PublicStudioLayout>
  );
}
