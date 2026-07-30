import React from "react";
import { Metadata } from "next";
import PublicClientSiteBuilderClient from "./client";

export const metadata: Metadata = {
  title: "커스텀 웹사이트 & AI 홈페이지 제작 - 크리에이박스",
  description: "크리에이박스 CreAibox에서 제공하는 커스텀 웹사이트 및 AI 홈페이지 빌더입니다. 단 30초 만에 비즈니스에 최적화된 반응형 웹사이트 및 랜딩페이지 시안을 무료로 생성해 보세요.",
  keywords: ["크리에이박스", "creaibox", "커스텀 웹사이트", "AI 홈페이지 제작", "랜딩페이지 빌더"],
  openGraph: {
    title: "커스텀 웹사이트 & AI 홈페이지 제작 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox에서 제공하는 커스텀 웹사이트 및 AI 홈페이지 빌더입니다. 단 30초 만에 비즈니스에 최적화된 반응형 웹사이트 시안을 무료로 생성해 보세요.",
    url: "https://creaibox.com/client-site-builder",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/business.webp",
        width: 1200,
        height: 630,
        alt: "커스텀 웹사이트 빌더",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "커스텀 웹사이트 & AI 홈페이지 제작 | 크리에이박스 CreAibox",
    description: "단 30초 만에 비즈니스에 최적화된 반응형 웹사이트 시안을 무료로 생성해 보세요.",
    images: ["/images/seo/business.webp"],
  },
};

export default function Page() {
  return <PublicClientSiteBuilderClient />;
}
