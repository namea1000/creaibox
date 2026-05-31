"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  market: "AI 시장 리포트",
  industry: "산업별 AI 분석",
  news: "AI 뉴스 브리핑",
  tools: "AI 툴 비교 분석",
  productivity: "AI 생산성 리포트",
  investment: "AI 투자 분석",
  forecast: "AI 트렌드 예측",
  research: "AI 리서치 센터",
  generator: "AI 콘텐츠 자동 생성",
  dashboard: "AI 인사이트 대시보드",
};

export default function ReportSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="AI 리포트"
      sectionName={sectionNames[section] || "AI 리포트"}
      homeHref="/studio/report"
    />
  );
}
