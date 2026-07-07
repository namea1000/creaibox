import React from "react";
import { Metadata } from "next";
import PublicYoutubeSectionClient from "./client";

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
  reports: "급상승 영상분석 리포트",
  "channel-reports": "인기채널 영상분석 리포트",
  workflow: "유튜브 자동 제작 연결",
  top300: "유튜브 랭킹 TOP 300",
  search: "유튜브 영상 검색",
};

interface Props {
  params: {
    section: string;
  };
}

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = sectionNames[params.section] || "유튜브 트렌드 분석";
  return {
    title: `${name} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox에서 제공하는 고도화된 유튜브 ${name} 도구입니다. 최신 지표 추적 및 AI 기반 분석 솔루션으로 채널 성장을 극대화해 보세요.`,
    keywords: ["크리에이박스", "creaibox", name, "유튜브 분석", "인플루언서 랭킹"]
  };
}

export default function Page() {
  return <PublicYoutubeSectionClient />;
}
