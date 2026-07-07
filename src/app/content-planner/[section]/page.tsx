import React from "react";
import { Metadata } from "next";
import PublicContentPlannerClient from "./client";

const sectionNames: Record<string, string> = {
  "idea-hub": "콘텐츠 아이디어 허브",
  planning: "AI 콘텐츠 기획 스튜디오",
  library: "기획 라이브러리",
  calendar: "콘텐츠 캘린더",
  workflow: "기획 자동화 워크플로우",
  trends: "트렌드 키워드 분석",
  strategy: "AI 마케팅 전략",
  settings: "플래너 설정",
};

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const sectionTitle = sectionNames[section] || "AI 콘텐츠 플래너";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 솔루션입니다. 체계적인 아이디어 스케치부터 콘텐츠 캘린더 관리까지 AI로 편리하게 자동화해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 콘텐츠 플래너", "마케팅 캘린더"]
  };
}

export default function Page() {
  return <PublicContentPlannerClient />;
}
