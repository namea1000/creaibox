import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 웹사이트 빌더 & AI 홈페이지 제작 | 크리에이박스 CreaiBox",
  description: "크리에이박스(CreaiBox) AI 웹사이트 빌더로 AI 홈페이지 제작, AI 웹사이트 제작, 홈페이지 무료제작, 웹사이트 무료제작을 단 30초 만에 완성하세요. 기존 사이트 자동 복제·이관부터 반응형 랜딩페이지 구축까지 완벽 지원합니다.",
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
    description: "AI 홈페이지 제작, AI 웹사이트 제작, 홈페이지 무료제작, 웹사이트 무료제작 - 단 30초 만에 비즈니스에 최적화된 반응형 웹사이트 시안을 생성해 보세요.",
    url: "https://creaibox.com/studio/custom-client-site",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function CustomClientSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
