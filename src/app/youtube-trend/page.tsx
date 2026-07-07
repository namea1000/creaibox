import React from "react";
import { Metadata } from "next";
import PublicYoutubeTrendClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "유튜브 트렌드 분석 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 종합 유튜브 트렌드 분석 포털입니다. 실시간 채널 랭킹 TOP 300, 트렌드 분석 및 최신 통계 지표를 확인해 보세요.",
  keywords: ["크리에이박스", "creaibox", "유튜브 트렌드", "유튜브 랭킹", "인플루언서 분석"]
};

export default function Page() {
  return <PublicYoutubeTrendClient />;
}
