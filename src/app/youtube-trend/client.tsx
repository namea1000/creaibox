"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import RisingVideos from "@/app/studio/youtube/[section]/components/RisingVideos";

export default function PublicYoutubeTrendClient() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">
        <RisingVideos />
      </div>
    </PublicStudioLayout>
  );
}
