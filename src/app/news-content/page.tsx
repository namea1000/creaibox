"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import NewsContentHomePage from "@/app/studio/news/page";

export default function PublicNewsContentPage() {
  return (
    <PublicStudioLayout>
      <div className="bg-slate-50 dark:bg-zinc-900/10 transition-colors duration-300 min-h-full">
        <NewsContentHomePage />
      </div>
    </PublicStudioLayout>
  );
}
