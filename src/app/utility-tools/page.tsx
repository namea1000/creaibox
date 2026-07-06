"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioToolsHomePage from "@/app/studio/tools/page";

export default function PublicUtilityToolsPage() {
  return (
    <PublicStudioLayout>
      <div className="bg-slate-50 dark:bg-zinc-900/10 transition-colors duration-300 min-h-full">
        <StudioToolsHomePage />
      </div>
    </PublicStudioLayout>
  );
}
