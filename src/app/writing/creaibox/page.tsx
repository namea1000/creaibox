import React from "react";
import { Metadata } from "next";
import PublicCreaiboxWritingMainClient from "./client";

export const metadata: Metadata = {
  title: "크리에이박스 블로그 스튜디오 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 크리에이박스 전용 글쓰기 대시보드입니다. 지식 소스, 페르소나 설정 및 고해상도 글 작성 기능을 AI로 경험해 보세요.",
  keywords: ["크리에이박스", "creaibox", "블로그 생성", "AI 카피라이터", "자동 발행 도구"]
};

export default function Page() {
  return <PublicCreaiboxWritingMainClient />;
}
