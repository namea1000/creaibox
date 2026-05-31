"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  collect: "실시간 뉴스 수집",
  summary: "AI 뉴스 요약",
  blog: "뉴스 기반 블로그 생성",
  issue: "실시간 이슈 탐지",
  trend: "뉴스 트렌드 분석",
  publish: "뉴스 콘텐츠 자동 발행",
  card: "뉴스 카드 제작",
  anchor: "AI 뉴스 앵커",
  archive: "뉴스 아카이브",
  dashboard: "뉴스 대시보드",
};

export default function NewsSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="뉴스 콘텐츠"
      sectionName={sectionNames[section] || "뉴스 콘텐츠"}
      homeHref="/studio/news"
    />
  );
}
