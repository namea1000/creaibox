import React from "react";
import { Metadata } from "next";
import PublicUtilityToolsClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "유틸리티 Tools | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 크리에이터 필수 유틸리티 도구 세트입니다. 누끼 제거, QR 생성, 이미지 압축 및 코드 뷰티파이어 등을 무료로 편리하게 사용해 보세요.",
  keywords: ["크리에이박스", "creaibox", "유틸리티 툴", "무료 크리에이터 도구", "누끼 따기 프로그램"]
};

export default function Page() {
  return <PublicUtilityToolsClient />;
}
