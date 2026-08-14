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
  reports: "영상분석 리포트",
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

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sectionKey = resolvedParams?.section || "top300";
  const name = sectionNames[sectionKey] || "급상승 유튜브 트랜드";
  const title = `${name} - 유튜브 트렌드`;
  const description = `크리에이박스 CreaiBox에서 제공하는 ${name} 솔루션입니다. 국내외 인기 유튜브 채널 랭킹, 실시간 급상승 영상 분석 및 AI 아웃라이어 조회를 경험해 보세요.`;
  return {
    title,
    description,
    keywords: ["크리에이박스", "creaibox", name, "유튜브 분석", "인플루언서 랭킹", "인기 동영상"],
    openGraph: {
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      url: `https://creaibox.com/youtube-trend/${sectionKey}`,
      siteName: "CreaiBox",
      images: [
        {
          url: "/images/seo/youtube-trend.webp",
          width: 1200,
          height: 630,
          alt: "크리에이박스 유튜브 트렌드 분석",
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      images: ["/images/seo/youtube-trend.webp"],
    },
  };
}

export default function Page() {
  return <PublicYoutubeSectionClient />;
}
