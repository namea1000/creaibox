"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import YoutubeTop300 from "@/app/studio/youtube/[section]/components/YoutubeTop300";

export default function PublicYoutubeTrendClient() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <YoutubeTop300 />
      </div>
    </PublicStudioLayout>
  );
}
