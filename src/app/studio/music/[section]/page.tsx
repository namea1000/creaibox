"use client";

import { useParams } from "next/navigation";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";

const sectionNames: Record<string, string> = {
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
};

export default function MusicSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioOperationalSectionPage area="music" section={section} title={sectionNames[section] || "뮤직 스튜디오"} />
  );
}
