"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import NaverWritingMainPage from "@/app/studio/writing/naver/page";

export default function PublicNaverWritingMainClient() {
  return (
    <PublicStudioLayout>
      <NaverWritingMainPage />
    </PublicStudioLayout>
  );
}
