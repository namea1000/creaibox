import React from "react";
import { Metadata } from "next";
import PublicYoutubeTrendClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "급상승 유튜브 트랜드 - 인기 영상 랭킹",
  description: "국내 및 해외 인기 유튜브 영상 랭킹, 채널 성장 아웃라이어, 조회수 랭킹 TOP 300 통계를 실시간으로 확인하세요.",
  keywords: ["크리에이박스", "creaibox", "급상승 유튜브", "유튜브 랭킹", "인기 동영상", "유튜브 분석"],
  openGraph: {
    title: "급상승 유튜브 트랜드 - 인기 영상 랭킹 | 크리에이박스 CreAibox",
    description: "국내 및 해외 인기 유튜브 영상 랭킹, 채널 성장 아웃라이어, 조회수 랭킹 TOP 300 통계를 실시간으로 확인하세요.",
    url: "https://creaibox.com/youtube-trend",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/youtube-trend.webp",
        width: 1200,
        height: 630,
        alt: "급상승 유튜브 트랜드 분석",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "급상승 유튜브 트랜드 - 인기 영상 랭킹 | 크리에이박스 CreAibox",
    description: "국내 및 해외 인기 유튜브 영상 랭킹, 채널 성장 아웃라이어, 조회수 랭킹 TOP 300 통계를 실시간으로 확인하세요.",
    images: ["/images/seo/youtube-trend.webp"],
  },
};

export default function Page() {
  return <PublicYoutubeTrendClient />;
}
