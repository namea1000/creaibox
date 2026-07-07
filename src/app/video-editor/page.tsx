"use client";

import React, { Suspense } from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import VideoEditorShell from "@/components/studio/video/editor/VideoEditorShell";
import { Loader2 } from "lucide-react";

export default function PublicVideoEditorPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin text-rose-500 mb-3" size={32} />
              <span className="text-sm font-bold">영상 편집 엔진을 준비하는 중입니다...</span>
            </div>
          }
        >
          <VideoEditorShell />
        </Suspense>
      </div>
    </PublicStudioLayout>
  );
}
