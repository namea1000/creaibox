"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import RisingVideos from "@/app/studio/youtube/[section]/components/RisingVideos";

export default function PublicYoutubeTrendClient() {
  return (
    <PublicStudioLayout>
      <div className="w-full px-5 sm:px-8 lg:px-10 py-8 space-y-8">
        <RisingVideos />
      </div>
    </PublicStudioLayout>
  );
}
