import React from "react";
import { Metadata } from "next";
import PublicKeywordSectionClient from "./client";

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

interface Props {
  params: {
    section: string;
  };
}

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = sectionNames[params.section] || "키워드 트렌드 분석";
  return {
    title: `${name} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox에서 제공하는 ${name} 도구입니다. 실시간 키워드 조회 및 AI 통합 전략을 활용하여 검색 최상위 랭킹을 차지해 보세요.`,
    keywords: ["크리에이박스", "creaibox", name, "키워드 분석", "실시간 검색어"]
  };
}

export default function Page() {
  return <PublicKeywordSectionClient />;
}
