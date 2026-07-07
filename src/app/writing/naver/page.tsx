import React from "react";
import { Metadata } from "next";
import PublicNaverWritingMainClient from "./client";

export const metadata: Metadata = {
  title: "네이버 글쓰기 스튜디오 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 네이버 맞춤형 블로그 포스팅 대시보드입니다. C-Rank 알고리즘 가이드 분석, 키워드 경쟁 및 포스팅 자동 작성을 AI로 설계해 보세요.",
  keywords: ["크리에이박스", "creaibox", "네이버 블로그 자동화", "글쓰기 AI", "상위 노출 진단"]
};

export default function Page() {
  return <PublicNaverWritingMainClient />;
}
