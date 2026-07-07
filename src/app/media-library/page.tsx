"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import FreeAssetsPage from "@/app/studio/library/free-assets/page";

export default function PublicMediaLibraryPage() {
  return (
    <PublicStudioLayout>
      <div className="space-y-6">

        <FreeAssetsPage />
      </div>
    </PublicStudioLayout>
  );
}
