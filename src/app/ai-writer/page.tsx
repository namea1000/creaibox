"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import WritingStudioPage from "@/app/studio/writing/page";

export default function PublicAiWriterPage() {
  return (
    <PublicStudioLayout>
      <div className="bg-slate-50 dark:bg-zinc-900/10 transition-colors duration-300 min-h-full">
        <WritingStudioPage />
      </div>
    </PublicStudioLayout>
  );
}
