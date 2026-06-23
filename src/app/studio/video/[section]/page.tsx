"use client";

import { useParams } from "next/navigation";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";

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

export default function VideoSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioOperationalSectionPage area="video" section={section} title={sectionNames[section] || "비디오 스튜디오"} />
  );
}
