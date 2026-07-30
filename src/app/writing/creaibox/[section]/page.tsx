import React from "react";
import { Metadata } from "next";
import PublicCreaiboxWritingClient from "./client";

const sectionNames: Record<string, string> = {
  "new-post": "블로그 새글 쓰기",
  list: "블로그 원고 관리",
  recreate: "네이버/SNS 재발행",
  "blog-management": "블로그 설정 및 관리",
  thumbnail: "크리아이박스 썸네일 메이커",
  knowledge: "AI 지식 & 페르소나 설정",
  analytics: "발행 성과 분석",
  editor: "간편 문서 에디터",
  ideagenerator: "블로그 아이디어 생성기",
  plan: "포스팅 스케줄러",
};

interface Props {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const sectionTitle = sectionNames[section] || "AI 블로그 글쓰기 스튜디오";
  const title = `${sectionTitle} - AI 글쓰기`;
  const description = `크리에이박스 CreAibox의 ${sectionTitle} 도구입니다. 최첨단 AI 인공지능으로 네이버 및 티스토리 고품질 원고를 순식간에 기획하고 스마트하게 발행해 보세요.`;
  return {
    title,
    description,
    keywords: ["크리에이박스", "creaibox", sectionTitle, "블로그 자동 글쓰기", "AI 글쓰기 프로그램"],
    openGraph: {
      title: `${title} | 크리에이박스 CreAibox`,
      description,
      url: `https://creaibox.com/writing/creaibox/${section}`,
      siteName: "CreAibox",
      images: [
        {
          url: "/images/seo/business.webp",
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
      images: ["/images/seo/business.webp"],
    },
  };
}

export default function Page() {
  return <PublicCreaiboxWritingClient />;
}
