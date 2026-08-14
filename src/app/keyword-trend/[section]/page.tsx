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

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sectionKey = resolvedParams?.section || "realtime";
  const name = sectionNames[sectionKey] || "실시간 급상승 키워드";
  const title = `${name} - 키워드 트렌드 | 크리에이박스 CreAiBox`;
  const description = `크리에이박스 CreaiBox에서 제공하는 ${name} 솔루션입니다. 네이버 및 구글 실시간 키워드 통계, 연관 검색어 발굴 및 최신 트렌드를 확인해 보세요.`;
  return {
    title,
    description,
    keywords: ["크리에이박스", "creaibox", name, "키워드 분석", "실시간 검색어", "급상승 키워드"],
    openGraph: {
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      url: `https://creaibox.com/keyword-trend/${sectionKey}`,
      siteName: "CreaiBox",
      images: [
        {
          url: "/images/seo/keyword-trend.webp",
          width: 1200,
          height: 630,
          alt: "크리에이박스 키워드 트렌드 분석",
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      images: ["/images/seo/keyword-trend.webp"],
    },
  };
}

export default function Page() {
  return <PublicKeywordSectionClient />;
}
