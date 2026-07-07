import React from "react";
import { Metadata } from "next";
import PublicCommunityClient from "./client";

const sectionNames: Record<string, string> = {
  chat: "실시간 종합 채팅방",
  writing: "크리에이박스 글쓰기 토론방",
  naver: "네이버 블로그 토론방",
  music: "뮤직 스튜디오 토론방",
  image: "디자인 스튜디오 토론방",
  video: "비디오 스튜디오 토론방",
  youtube: "유튜브 연구 토론방",
  "ai-trend": "AI 트렌드 토론방",
  collab: "협업 프로젝트 소통방",
  money: "수익화 연구 토론방",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "크리에이터 커뮤니티 광장";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 소통 공간입니다. 다양한 크리에이터들과 함께 인공지능 활용 경험 및 수익화 인사이트를 실시간으로 공유해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "크리에이터 커뮤니티", "AI 정보 공유"]
  };
}

export default function Page() {
  return <PublicCommunityClient />;
}
