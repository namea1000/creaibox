import React from "react";
import { Metadata } from "next";
import PublicAiReportMainClient from "./client";

export const metadata: Metadata = {
  title: "AI 리포트 스튜디오 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 AI 종합 리포트 및 트렌드 포착 대시보드입니다. 투자, 생산성, 기술 비교 등 다각도로 정리된 인사이트를 확인해 보세요.",
  keywords: ["크리에이박스", "creaibox", "AI 리포트", "마켓 보고서", "인사이트 분석"]
};

export default function Page() {
  return <PublicAiReportMainClient />;
}
