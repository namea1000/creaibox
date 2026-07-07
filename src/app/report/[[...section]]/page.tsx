import React from "react";
import { Metadata } from "next";
import PublicReportClient from "./client";

const sectionNames: Record<string, string> = {
  market: "AI 시장 리포트",
  industry: "산업별 AI 분석 리포트",
  news: "AI 뉴스 브리핑 리포트",
  tools: "AI 툴 비교 분석 리포트",
  productivity: "AI 생산성 리포트",
  investment: "AI 투자 분석 리포트",
  forecast: "AI 트렌드 예측 리포트",
  research: "AI 리서치 센터 자료",
  generator: "AI 콘텐츠 자동 생성 리포트",
  dashboard: "AI 인사이트 대시보드",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "AI 리포트 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 공간입니다. 다양한 산업 영역에서 활용 중인 AI 기술의 트렌드 예측 분석 보고서를 열람해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 시장 분석 리포트", "글로벌 트렌드 예측"]
  };
}

export default function Page() {
  return <PublicReportClient />;
}
