import React from "react";
import { Metadata } from "next";
import PublicPublishClient from "./client";

const sectionNames: Record<string, string> = {
  channels: "배포 채널 연동 관리",
  history: "발행 이력 & 상세 통계",
  posts: "SNS 통합 원고 발행",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const segments = section || [];
  const path = segments.join("/");
  const sectionTitle = sectionNames[path] || "채널 배포 스튜디오";
  return {
    title: `${sectionTitle} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox의 대외 공개용 ${sectionTitle} 솔루션입니다. 기획/생성 완료된 쇼츠 영상과 블로그 원고를 멀티 채널에 일괄 자동 배포해 보세요.`,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "SNS 자동 포스팅", "다채널 동시 배포"]
  };
}

export default function Page() {
  return <PublicPublishClient />;
}
