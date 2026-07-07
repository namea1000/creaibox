import React from "react";
import { Metadata } from "next";
import PublicMusicClient from "./client";

const sectionNames: Record<string, string> = {
  "lyrics/idea-hub": "가사 소재 허브",
  planning: "AI 앨범 기획",
  lyrics: "가사 & SUNO 작곡",
  library: "생성곡 라이브러리",
  albums: "앨범 관리 스튜디오",
  visualizer: "오디오 스펙트럼 비주얼라이저",
  "style-format": "스타일 포맷",
  "cover-image": "커버 이미지 생성기",
  "video-prompt": "영상 프롬프트",
  translate: "가사 번역기",
  "youtube-seo": "유튜브 최적화",
  tags: "태그 관리",
  playlist: "플레이리스트",
  storage: "저장 관리",
  projects: "프로젝트",
  history: "작업 내역",
  settings: "설정",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "AI 뮤직 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 솔루션입니다. AI 작사/작곡 기술(Suno 연동)과 비주얼라이저를 활용해 나만의 음원을 기획하고 퍼블리싱해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 음악 생성", "Suno 작곡 프로그램"]
  };
}

export default function Page() {
  return <PublicMusicClient />;
}
