import React from "react";
import { Metadata } from "next";
import PublicUtilityToolsClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "크리에이터 유틸리티 툴 모음 - 크리에이박스",
  description: "누끼 따기(배경 제거), AI OCR, 이미지 압축, QR 생성 및 프롬프트 스튜디오 등 크리에이터 무료 유틸리티 도구를 활용하세요.",
  keywords: ["크리에이박스", "creaibox", "유틸리티 툴", "무료 누끼 따기", "배경 제거", "AI OCR"],
  openGraph: {
    title: "크리에이터 유틸리티 툴 모음 | 크리에이박스 CreaiBox",
    description: "누끼 따기(배경 제거), AI OCR, 이미지 압축, QR 생성 및 프롬프트 스튜디오 등 크리에이터 무료 유틸리티 도구를 활용하세요.",
    url: "https://creaibox.com/utility-tools",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/utility-tools.webp",
        width: 1200,
        height: 630,
        alt: "크리에이터 유틸리티 툴 모음",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "크리에이터 유틸리티 툴 모음 | 크리에이박스 CreaiBox",
    description: "누끼 따기(배경 제거), AI OCR, 이미지 압축, QR 생성 및 프롬프트 스튜디오 등 크리에이터 무료 유틸리티 도구를 활용하세요.",
    images: ["/images/seo/utility-tools.webp"],
  },
};

export default function Page() {
  return <PublicUtilityToolsClient />;
}
