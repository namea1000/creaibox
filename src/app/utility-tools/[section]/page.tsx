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
  "youtube-thumbnail": "유튜브 썸네일 다운로더",
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

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreAibox" 브랜드 키워드 동적 메타데이터 주입!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = sectionNames[params.section] || "유틸리티 Tools";
  return {
    title: `${name} | 크리에이박스 CreAibox`,
    description: `크리에이박스 CreAibox에서 무료로 제공하는 고성능 ${name} 유틸리티 도구입니다. 복잡한 가입 없이 누구나 간편하게 작업을 자동화해 보세요.`,
    keywords: ["크리에이박스", "creaibox", name, "무료 웹 도구", "작업 자동화"]
  };
}

export default function Page() {
  return <PublicToolsSectionClient />;
}
