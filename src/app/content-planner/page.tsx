import React from "react";
import { Metadata } from "next";
import PublicContentPlannerMainClient from "./client";

export const metadata: Metadata = {
  title: "AI 콘텐츠 플래너 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 AI 콘텐츠 플래너 대시보드입니다. 아이디어 스케치, 시나리오 기획, 일관된 콘텐츠 업로드 캘린더 일정을 AI로 수립해 보세요.",
  keywords: ["크리에이박스", "creaibox", "콘텐츠 플래너", "AI 기획서", "마케팅 전략"]
};

export default function Page() {
  return <PublicContentPlannerMainClient />;
}
