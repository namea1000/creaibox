import React from "react";
import { Metadata } from "next";
import PublicToolsSectionClient from "./client";

const sectionNames: Record<string, string> = {
  "bg-remover": "AI 누끼 제거",
  "pdf-analyzer": "PDF 문서 분석",
  ocr: "AI OCR 문자 추출",
  "prompt-enhancer": "AI 프롬프트 스튜디오",
  "prompt-translator": "AI 프롬프트 스튜디오",
  "prompt-studio": "AI 프롬프트 스튜디오",
  hashtag: "해시태그 생성기",
  "color-picker": "색상 추출기",
  qr: "QR 생성기",
  converter: "포맷 변환기",
  metadata: "메타데이터 추출기",
  "code-beautifier": "코드 뷰티파이어",
};

interface Props {
  params: {
    section: string;
  };
}

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const sectionKey = resolvedParams?.section || "all";
  const name = sectionNames[sectionKey] || "유틸리티 Tools";
  const title = `${name} - 크리에이박스 툴`;
  const description = `크리에이박스 CreaiBox에서 무료로 제공하는 고성능 ${name} 유틸리티 도구입니다. 복잡한 가입 없이 누구나 간편하게 작업 생산성을 높여보세요.`;
  return {
    title,
    description,
    keywords: ["크리에이박스", "creaibox", name, "무료 웹 도구", "작업 자동화"],
    openGraph: {
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      url: `https://creaibox.com/utility-tools/${sectionKey}`,
      siteName: "CreaiBox",
      images: [
        {
          url: "/images/seo/utility-tools.webp",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 크리에이박스 CreaiBox`,
      description,
      images: ["/images/seo/utility-tools.webp"],
    },
  };
}

export default function Page() {
  return <PublicToolsSectionClient />;
}
