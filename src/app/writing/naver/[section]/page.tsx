import React from "react";
import { Metadata } from "next";
import PublicNaverWritingClient from "./client";

const sectionNames: Record<string, string> = {
  create: "AI 스마트 글쓰기",
  recreate: "AI 글 재창조",
  list: "발행 원고 관리",
  thumbnail: "네이버용 썸네일 메이커",
  keyword: "네이버 키워드 분석",
  diagnosis: "실시간 노출 진단",
  guide: "C-Rank 가이드북",
  api: "엔진 최적화 세팅",
};

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const sectionTitle = sectionNames[section] || "네이버 AI 글쓰기";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 솔루션입니다. 네이버 블로그에 최적화된 키워드 발굴과 C-Rank 상위 노출 원고 작성을 AI로 편리하게 달성해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "네이버 상위노출", "블로그 육성 프로그램"]
  };
}

export default function Page() {
  return <PublicNaverWritingClient />;
}
