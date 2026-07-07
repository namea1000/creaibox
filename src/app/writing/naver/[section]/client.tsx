"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import all subpages from studio writing/naver
import NaverWritingMainPage from "@/app/studio/writing/naver/page";
import CreatePage from "@/app/studio/writing/naver/create/page";
import RecreatePage from "@/app/studio/writing/naver/recreate/page";
import ListPage from "@/app/studio/writing/naver/list/page";
import ThumbnailPage from "@/app/studio/writing/naver/thumbnail/page";
import KeywordPage from "@/app/studio/writing/naver/keyword/page";
import DiagnosisPage from "@/app/studio/writing/naver/diagnosis/page";
import GuidePage from "@/app/studio/writing/naver/guide/page";
import ApiPage from "@/app/studio/writing/naver/api/page";

export default function PublicNaverWritingClient() {
  const { section } = useParams<{ section?: string }>();

  const renderContent = () => {
    switch (section) {
      case "create":
        return <CreatePage />;
      case "recreate":
        return <RecreatePage />;
      case "list":
        return <ListPage />;
      case "thumbnail":
        return <ThumbnailPage />;
      case "keyword":
        return <KeywordPage />;
      case "diagnosis":
        return <DiagnosisPage />;
      case "guide":
        return <GuidePage />;
      case "api":
        return <ApiPage />;
      default:
        return <NaverWritingMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
