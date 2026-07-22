"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";
import CreaiboxLibraryManager from "@/app/studio/library/[section]/components/CreaiboxLibraryManager";
import FreeAssetsPage from "@/app/studio/library/free-assets/page";

const sectionNames: Record<string, string> = {
  creaibox: "크리에이박스 콘텐츠",
  naver: "네이버 콘텐츠",
  news: "뉴스 콘텐츠",
  music: "음악 / 가사 콘텐츠",
  image: "이미지 콘텐츠",
  video: "비디오 콘텐츠",
  "free-assets": "미디어 라이브러리",
};

import LibraryHomePage from "@/app/studio/library/page";

export default function PublicLibrarySectionClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const section = segments[0] || "";

  const renderContent = () => {
    if (section === "free-assets") {
      return <FreeAssetsPage />;
    }
    if (section === "creaibox" || section === "image") {
      return <CreaiboxLibraryManager />;
    }
    if (section === "") {
      return <LibraryHomePage />;
    }
    return (
      <StudioOperationalSectionPage
        area="library"
        section={section}
        title={sectionNames[section] || "내 콘텐츠 보관함"}
      />
    );
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
