"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";

// Import Video components
import VideoMainPage from "@/app/studio/video/page";
import VideoEditorPage from "@/app/studio/video/editor/page";
import VideoTemplateMarketplace from "@/app/studio/video/components/VideoTemplateMarketplace";

const sectionNames: Record<string, string> = {
  editor: "영상 편집기",
  shorts: "쇼츠 & 릴스 제작",
  prompts: "영상 프롬프트",
  subtitle: "자막 & 음성",
  templates: "영상 템플릿",
  thumbnail: "썸네일 연동",
  projects: "프로젝트 관리",
  render: "렌더 / 저장 관리",
  settings: "영상 설정",
};

export default function PublicVideoClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    switch (path) {
      case "editor":
        return <VideoEditorPage />;
      case "templates":
        return <VideoTemplateMarketplace />;
      case "":
        return <VideoMainPage />;
      default:
        return (
          <StudioOperationalSectionPage
            area="video"
            section={path}
            title={sectionNames[path] || "비디오 스튜디오"}
          />
        );
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
