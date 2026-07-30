import React from "react";
import { Metadata } from "next";
import PublicKeywordTrendClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "실시간 급상승 키워드 & 뉴스 - 키워드 트렌드",
  description: "네이버 및 구글의 실시간 급상승 키워드, 이슈 기사 제목, 연관 검색어를 분석하여 콘텐츠 제작 아이디어를 발굴하세요.",
  keywords: ["크리에이박스", "creaibox", "급상승 키워드", "실시간 검색어", "키워드 트렌드", "네이버 뉴스"],
  openGraph: {
    title: "실시간 급상승 키워드 & 뉴스 - 키워드 트렌드 | 크리에이박스 CreAibox",
    description: "네이버 및 구글의 실시간 급상승 키워드, 이슈 기사 제목, 연관 검색어를 분석하여 콘텐츠 제작 아이디어를 발굴하세요.",
    url: "https://creaibox.com/keyword-trend",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/keyword-trend.webp",
        width: 1200,
        height: 630,
        alt: "실시간 급상승 키워드 분석",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "실시간 급상승 키워드 & 뉴스 - 키워드 트렌드 | 크리에이박스 CreAibox",
    description: "네이버 및 구글의 실시간 급상승 키워드, 이슈 기사 제목, 연관 검색어를 분석하여 콘텐츠 제작 아이디어를 발굴하세요.",
    images: ["/images/seo/keyword-trend.webp"],
  },
};

export default function Page() {
  return <PublicKeywordTrendClient />;
}
