import React from "react";
import { Metadata } from "next";
import PublicDesignClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "디자인 스튜디오 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox에서 제공하는 차세대 온라인 디자인 에디터입니다. 브라우저에서 템플릿과 캔버스를 활용하여 웹 배너, 포스터, 유튜브 썸네일을 즉시 무료로 제작해 보세요.",
  keywords: ["크리에이박스", "creaibox", "디자인 스튜디오", "무료 디자인 캔버스", "썸네일 만들기"]
};

export default function Page() {
  return <PublicDesignClient />;
}
