import React from "react";
import { Metadata } from "next";
import PublicNewsClient from "./client";

const sectionNames: Record<string, string> = {
  collect: "실시간 뉴스 수집",
  summary: "AI 뉴스 요약",
  blog: "뉴스 기반 블로그 생성",
  issue: "실시간 이슈 탐지",
  trend: "뉴스 트렌드 분석",
  publish: "뉴스 콘텐츠 자동 발행",
  card: "뉴스 카드 제작",
  anchor: "AI 뉴스 앵커",
  archive: "뉴스 아카이브",
  dashboard: "뉴스 대시보드",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "AI 뉴스 콘텐츠 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 공간입니다. 실시간 수집 및 요약 분석 가공 모듈을 활용하여 핵심 속보 중심의 뉴스를 자동 정제하고 퍼블리싱해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "실시간 뉴스 수집", "AI 뉴스 요약기"]
  };
}

export default function Page() {
  return <PublicNewsClient />;
}
