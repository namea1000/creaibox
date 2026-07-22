import React from "react";
import { Metadata } from "next";
import PublicLibrarySectionClient from "./client";

const sectionNames: Record<string, string> = {
  creaibox: "크리에이박스 콘텐츠",
  naver: "네이버 콘텐츠",
  news: "뉴스 콘텐츠",
  music: "음악 & 가사 콘텐츠",
  image: "이미지 콘텐츠",
  video: "비디오 콘텐츠",
  "free-assets": "미디어 라이브러리 무료 에셋",
};

interface Props {
  params: Promise<{ section?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const segments = resolvedParams.section || [];
  const section = segments[0] || "";
  const sectionTitle = sectionNames[section] || "내 콘텐츠 보관함";
  
  // ⚡ 세부 콘텐츠 유형에 따른 썸네일 파일 분기 매칭
  const imageFilename = section === "music" ? "media-library-music.webp" : "media-library.webp";

  return {
    title: sectionTitle + " | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox의 대외 공개용 " + sectionTitle + " 관리 도구입니다. 풍부한 템플릿과 저장 데이터를 한눈에 확인하고 활용해 보세요.",
    keywords: ["크리에이박스", "creaibox", sectionTitle, "크리에이터 에셋", "AI 콘텐츠 저장소"],
    openGraph: {
      title: sectionTitle + " | 크리에이박스 CreAibox",
      description: "크리에이박스 CreAibox의 대외 공개용 " + sectionTitle + " 관리 도구입니다. 풍부한 템플릿과 저장 데이터를 한눈에 확인하고 활용해 보세요.",
      url: "https://creaibox.com/library/" + (segments.join("/")),
      images: [
        {
          url: "/images/seo/" + imageFilename,
          width: 1200,
          height: 630,
          alt: sectionTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: sectionTitle + " | 크리에이박스 CreAibox",
      description: "크리에이박스 CreAibox의 대외 공개용 " + sectionTitle + " 관리 도구입니다. 풍부한 템플릿과 저장 데이터를 한눈에 확인하고 활용해 보세요.",
      images: ["/images/seo/" + imageFilename],
    },
  };
}

export default function Page() {
  return <PublicLibrarySectionClient />;
}
