"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import ContentPlannerMainPage from "@/app/studio/content-planner/page";

export default function PublicContentPlannerMainClient() {
  return (
    <PublicStudioLayout>
      <ContentPlannerMainPage />
    </PublicStudioLayout>
  );
}
