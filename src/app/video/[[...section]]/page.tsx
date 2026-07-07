import React from "react";
import { Metadata } from "next";
import PublicVideoClient from "./client";

const sectionNames: Record<string, string> = {
  editor: "영상 편집기",
  shorts: "쇼츠 & 릴스 제작",
  prompts: "영상 프롬프트",
  subtitle: "자막 & 음성",
  templates: "영상 템플릿 마켓",
  thumbnail: "썸네일 연동",
  projects: "프로젝트 관리",
  render: "렌더 & 저장 관리",
  settings: "영상 설정",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "AI 비디오 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 솔루션입니다. 브라우저 기반의 AI 영상 편집기 및 쇼츠 제작기를 통해 임팩트 있는 비디오를 기획 및 랜더링해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 비디오 제작", "쇼츠 만들기 프로그램"]
  };
}

export default function Page() {
  return <PublicVideoClient />;
}
