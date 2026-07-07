import React from "react";
import { Metadata } from "next";
import PublicClientSiteBuilderClient from "./client";

export const metadata: Metadata = {
  title: "AI 홈페이지 제작 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 AI 홈페이지 빌더입니다. 단 몇 번의 마우스 클릭만으로 세련되고 모바일에 대응하는 웹사이트 및 랜딩페이지를 직접 기획 및 발행해 보세요.",
  keywords: ["크리에이박스", "creaibox", "AI 홈페이지 제작", "랜딩페이지 빌더", "무료 홈페이지 만들기"]
};

export default function Page() {
  return <PublicClientSiteBuilderClient />;
}
