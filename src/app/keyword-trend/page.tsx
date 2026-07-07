import React from "react";
import { Metadata } from "next";
import PublicKeywordTrendClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "키워드 트렌드 분석 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 종합 키워드 트렌드 대시보드입니다. 실시간 키워드 통계, 연관 검색어 발굴 및 최신 트렌드를 확인해 보세요.",
  keywords: ["크리에이박스", "creaibox", "키워드 트렌드", "연관 키워드", "실시간 검색어"]
};

export default function Page() {
  return <PublicKeywordTrendClient />;
}
