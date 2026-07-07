"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";
import CreaiboxLibraryManager from "@/app/studio/library/[section]/components/CreaiboxLibraryManager";

const sectionNames: Record<string, string> = {
  creaibox: "크리에이박스 콘텐츠",
  naver: "네이버 콘텐츠",
  news: "뉴스 콘텐츠",
  music: "음악 / 가사 콘텐츠",
  image: "이미지 콘텐츠",
  video: "비디오 콘텐츠",
  "free-assets": "크리에셋박스",
};

export default function PublicLibrarySectionClient() {
  const { section } = useParams<{ section: string }>();

  return (
    <PublicStudioLayout>
      {section === "creaibox" || section === "image" ? (
        <CreaiboxLibraryManager />
      ) : (
        <StudioOperationalSectionPage
          area="library"
          section={section}
          title={sectionNames[section] || "콘텐츠 라이브러리"}
        />
      )}
    </PublicStudioLayout>
  );
}
