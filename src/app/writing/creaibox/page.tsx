import React from "react";
import { Metadata } from "next";
import PublicCreaiboxWritingMainClient from "./client";

export const metadata: Metadata = {
  title: "AI 블로그 글쓰기 스튜디오 - 크리에이박스",
  description: "크리에이박스 CreAibox에서 제공하는 AI 블로그 글쓰기 스튜디오입니다. 지식 소스, 페르소나 설정 및 고품질 포스팅 작성을 인공지능으로 자동화해 보세요.",
  keywords: ["크리에이박스", "creaibox", "블로그 생성", "AI 카피라이터", "자동 발행 도구"],
  openGraph: {
    title: "AI 블로그 글쓰기 스튜디오 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox에서 제공하는 AI 블로그 글쓰기 스튜디오입니다. 지식 소스, 페르소나 설정 및 고품질 포스팅 작성을 인공지능으로 자동화해 보세요.",
    url: "https://creaibox.com/writing/creaibox",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/business.webp",
        width: 1200,
        height: 630,
        alt: "AI 블로그 글쓰기 스튜디오",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 블로그 글쓰기 스튜디오 | 크리에이박스 CreAibox",
    description: "지식 소스, 페르소나 설정 및 고품질 포스팅 작성을 인공지능으로 자동화해 보세요.",
    images: ["/images/seo/business.webp"],
  },
};

export default function Page() {
  return <PublicCreaiboxWritingMainClient />;
}
