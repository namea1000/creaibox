import React from "react";
import { Metadata } from "next";
import PublicContentPlannerClient from "./client";

const sectionNames: Record<string, string> = {
  "idea-hub": "콘텐츠 아이디어 허브",
  planning: "AI 콘텐츠 기획 스튜디오",
  library: "기획 라이브러리",
  calendar: "콘텐츠 캘린더",
  workflow: "기획 자동화 워크플로우",
  trends: "트렌드 키워드 분석",
  strategy: "AI 마케팅 전략",
  settings: "플래너 설정",
};

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const sectionTitle = sectionNames[section] || "콘텐츠 아이디어 허브";
  const title = `${sectionTitle} - 콘텐츠 기획`;
  const description = `크리에이박스 CreAibox의 ${sectionTitle} 솔루션입니다. 체계적인 아이디어 스케치, 키워드 시리즈 추천 및 콘텐츠 캘린더를 AI로 편리하게 기획해 보세요.`;
  return {
    title,
    description,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "AI 콘텐츠 플래너", "마케팅 캘린더"],
    openGraph: {
      title: `${title} | 크리에이박스 CreAibox`,
      description,
      url: `https://creaibox.com/content-planner/${section}`,
      siteName: "CreAibox",
      images: [
        {
          url: "/images/seo/content-planner.webp",
          width: 1200,
          height: 630,
          alt: sectionTitle,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 크리에이박스 CreAibox`,
      description,
      images: ["/images/seo/content-planner.webp"],
    },
  };
}

export default function Page() {
  return <PublicContentPlannerClient />;
}
