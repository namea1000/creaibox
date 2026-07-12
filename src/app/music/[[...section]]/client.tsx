"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";

// Import Suno music app page components
import MusicMainPage from "@/app/studio/music/page";
import LyricsIdeaHubPage from "@/app/studio/music/lyrics/idea-hub/page";
import PlanningPage from "@/app/studio/music/planning/page";
import LyricsPage from "@/app/studio/music/lyrics/page";
import LibraryPage from "@/app/studio/music/library/page";
import AlbumsPage from "@/app/studio/music/albums/page";
import VisualizerPage from "@/app/studio/music/visualizer/page";
import CreMusicPage from "@/app/studio/music/cre-music/page";
import SunoGeneratorPage from "@/app/studio/music/suno-generator/page";

const sectionNames: Record<string, string> = {
  "cre-music": "Cre Music 플레이어",
  "style-format": "스타일 포맷",
  "cover-image": "커버 이미지",
  "video-prompt": "영상 프롬프트",
  translate: "번역",
  "youtube-seo": "유튜브 최적화",
  tags: "태그 관리",
  playlist: "플레이리스트",
  storage: "저장 관리",
  projects: "프로젝트",
  history: "작업 내역",
  settings: "설정",
  "suno-generator": "Suno 곡 생성",
};

export default function PublicMusicClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    switch (path) {
      case "planning":
        return <PlanningPage />;
      case "lyrics":
        return <LyricsPage />;
      case "lyrics/idea-hub":
        return <LyricsIdeaHubPage />;
      case "library":
        return <LibraryPage />;
      case "cre-music":
        return <CreMusicPage />;
      case "albums":
        return <AlbumsPage />;
      case "visualizer":
        return <VisualizerPage />;
      case "suno-generator":
        return <SunoGeneratorPage />;
      case "":
        return <MusicMainPage />;
      default:
        // For operational sections
        return (
          <StudioOperationalSectionPage
            area="music"
            section={path}
            title={sectionNames[path] || "뮤직 스튜디오"}
          />
        );
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
