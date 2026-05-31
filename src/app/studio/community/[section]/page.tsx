"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  chat: "실시간 채팅",
  writing: "크리아이박스 글쓰기",
  naver: "네이버 블로그",
  music: "뮤직 스튜디오",
  image: "이미지 스튜디오",
  video: "비디오 스튜디오",
  youtube: "유튜브 연구소",
  "ai-trend": "AI 트렌드 토론방",
  collab: "협업 프로젝트",
  money: "수익화 연구소",
};

export default function CommunitySectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="커뮤니티"
      sectionName={sectionNames[section] || "커뮤니티"}
      homeHref="/studio/community"
    />
  );
}
