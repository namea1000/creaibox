import React from "react";
import { Metadata } from "next";
import PublicCreaiboxWritingClient from "./client";

const sectionNames: Record<string, string> = {
  "new-post": "블로그 새글 쓰기",
  list: "발행 원고 관리",
  "blog-management": "블로그 연동 관리",
  thumbnail: "크리아이박스 썸네일 메이커",
  knowledge: "AI 지식 & 페르소나 설정",
  analytics: "발행 성과 분석",
  editor: "간편 문서 에디터",
  ideagenerator: "블로그 아이디어 생성기",
  plan: "포스팅 스케줄러",
};

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const sectionTitle = sectionNames[section] || "크리에이박스 AI 글쓰기";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 도구입니다. 최첨단 인공지능 알고리즘으로 양질의 포스팅 글을 순식간에 기획하고 스마트하게 다듬어 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "블로그 자동 글쓰기", "AI 글쓰기 프로그램"]
  };
}

export default function Page() {
  return <PublicCreaiboxWritingClient />;
}
