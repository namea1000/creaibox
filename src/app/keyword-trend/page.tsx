import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "실시간 급상승 키워드 & 뉴스 - 키워드 트렌드 | 크리에이박스 CreAiBox",
  description: "네이버 및 구글의 실시간 급상승 키워드, 이슈 기사 제목, 연관 검색어를 분석하여 콘텐츠 제작 아이디어를 발굴하세요.",
  keywords: ["크리에이박스", "creaibox", "급상승 키워드", "실시간 검색어", "키워드 트렌드", "네이버 뉴스"],
  openGraph: {
    title: "실시간 급상승 키워드 & 뉴스 - 키워드 트렌드 | 크리에이박스 CreAiBox",
    description: "네이버 및 구글의 실시간 급상승 키워드, 이슈 기사 제목, 연관 검색어를 분석하여 콘텐츠 제작 아이디어를 발굴하세요.",
    url: "https://creaibox.com/keyword-trend",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  redirect("/studio/keyword/realtime");
}
