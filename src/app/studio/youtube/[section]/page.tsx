"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  channel: "채널 상세 분석",
  rising: "급상승 영상 트렌드",
  compare: "경쟁 채널 비교",
  cpm: "광고 단가 계산기",
  seo: "유튜브 SEO 분석",
  shorts: "쇼츠 바이럴 분석",
  thumbnail: "썸네일 CTR 연구소",
  title: "AI 제목 생성기",
  report: "콘텐츠 전략 리포트",
  workflow: "유튜브 자동 제작 연결",
};

export default function YoutubeSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="유튜브 트렌드 분석"
      sectionName={sectionNames[section] || "유튜브 트렌드 분석"}
      homeHref="/studio/youtube"
    />
  );
}
