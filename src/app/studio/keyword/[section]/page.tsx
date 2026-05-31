"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  bulk: "키워드 대량 조회",
  related: "연관 키워드 발굴",
  morphology: "형태소 분석기",
  rank: "실시간 순위 추적",
  rising: "트렌드 급상승 분석",
  youtube: "유튜브 키워드 분석",
  seo: "SEO 경쟁 분석",
  strategy: "AI 키워드 전략 생성",
  workflow: "자동 콘텐츠 연결",
  dashboard: "트렌드 대시보드",
};

export default function KeywordSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="키워드 트렌드 분석"
      sectionName={sectionNames[section] || "키워드 트렌드 분석"}
      homeHref="/studio/keyword"
    />
  );
}
