import React from "react";
import { Metadata } from "next";
import PublicResearchClient from "./client";

const sectionNames: Record<string, string> = {
  chat: "자료 분석 AI 채팅",
  content: "자료 기반 콘텐츠 생성",
  create: "새 자료 분석 등록",
  images: "추출 이미지 보관함",
  library: "자료 도서관",
  projects: "프로젝트 관리",
  settings: "설정",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "자료 분석 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 도구입니다. 논문, PDF, 도표 및 대용량 자료를 AI 업로드 분석하고 즉각 요약 브리핑을 추출해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 논문 분석", "PDF 요약 프로그램"]
  };
}

export default function Page() {
  return <PublicResearchClient />;
}
