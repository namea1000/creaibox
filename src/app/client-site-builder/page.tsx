import React from "react";
import { Metadata } from "next";
import PublicClientSiteBuilderClient from "./client";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "AI 웹사이트 빌더 & AI 홈페이지 제작 | 크리에이박스 CreaiBox",
  description: "크리에이박스(CreaiBox) AI 웹사이트 빌더로 AI 홈페이지 제작, AI 웹사이트 제작, 홈페이지 무료제작, 웹사이트 무료제작을 단 30초 만에 완성하세요. 기존 사이트 자동 이관부터 반응형 랜딩페이지 구축까지 완벽 지원합니다.",
  keywords: [
    "AI 웹사이트 빌더",
    "AI 홈페이지 제작",
    "AI 웹사이트 제작",
    "홈페이지 무료제작",
    "웹사이트 무료제작",
    "크리에이박스",
    "creaibox",
    "반응형 웹사이트 제작",
    "랜딩페이지 빌더",
    "홈페이지 자동제작",
    "웹사이트 리디자인"
  ],
  openGraph: {
    title: "AI 웹사이트 빌더 & AI 홈페이지 제작 | 크리에이박스 CreaiBox",
    description: "AI 홈페이지 제작, AI 웹사이트 제작, 홈페이지 무료제작, 웹사이트 무료제작 - 단 30초 만에 비즈니스에 최적화된 반응형 웹사이트 및 랜딩페이지 시안을 무료로 생성해 보세요.",
    url: "https://creaibox.com/client-site-builder",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/business.webp",
        width: 1200,
        height: 630,
        alt: "AI 웹사이트 빌더 & AI 홈페이지 제작",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 웹사이트 빌더 & AI 홈페이지 제작 | 크리에이박스 CreaiBox",
    description: "AI 홈페이지 제작, AI 웹사이트 제작, 홈페이지 무료제작 - 단 30초 만에 비즈니스 반응형 웹사이트를 무료로 생성하세요.",
    images: ["/images/seo/business.webp"],
  },
};

export default function Page() {
  return <PublicClientSiteBuilderClient />;
}
