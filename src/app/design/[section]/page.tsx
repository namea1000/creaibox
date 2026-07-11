import React from "react";
import { Metadata } from "next";
import PublicDesignSectionClient from "./client";

const sectionNames: Record<string, string> = {
  templates: "템플릿 라이브러리",
  workspace: "디자인 편집기 (캔버스)",
  "brand-kit": "브랜드 키트",
  "magic-design": "AI 매직 디자인",
  converter: "이미지 확장자 변환기",
  "webp-compressor": "WEBP 일괄 압축기",
  editor: "이미지 편집기",
  prompts: "프롬프트 라이브러리",
  poster: "포스터 & 전단지",
  "business-card": "디지털 명함",
  banner: "현수막 & 배너",
  "bg-remover": "이미지 배경 제거기",
  resizer: "이미지 크기 조절기",
  thumbnail: "썸네일 메이커",
  upscaler: "이미지 AI 업스케일러"
};

interface Props {
  params: {
    section: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = sectionNames[params.section] || "디자인 스튜디오";
  return {
    title: name + " | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox에서 제공하는 차세대 AI 기반 " + name + " 도구입니다. 복잡한 설치 없이 브라우저 상에서 고퀄리티 비주얼 에셋을 즉시 제작해 보세요.",
    keywords: ["크리에이박스", "creaibox", name, "무료 디자인 툴", "AI 이미지 편집"],
    openGraph: {
      title: name + " | 크리에이박스 CreAibox",
      description: "크리에이박스 CreAibox에서 제공하는 차세대 AI 기반 " + name + " 도구입니다. 복잡한 설치 없이 브라우저 상에서 고퀄리티 비주얼 에셋을 즉시 제작해 보세요.",
      url: "https://creaibox.com/design/" + params.section,
      images: [
        {
          url: "/images/seo/themes.webp",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name + " | 크리에이박스 CreAibox",
      description: "크리에이박스 CreAibox에서 제공하는 차세대 AI 기반 " + name + " 도구입니다. 복잡한 설치 없이 브라우저 상에서 고퀄리티 비주얼 에셋을 즉시 제작해 보세요.",
      images: ["/images/seo/themes.webp"],
    },
  };
}

export default function Page() {
  return <PublicDesignSectionClient />;
}
