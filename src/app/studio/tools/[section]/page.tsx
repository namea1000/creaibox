"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  "bg-remover": "AI 누끼 제거",
  "pdf-analyzer": "PDF 문서 분석",
  ocr: "AI OCR 문자 추출",
  "prompt-enhancer": "AI 프롬프트 개선기",
  "prompt-translator": "AI 프롬프트 번역기",
  hashtag: "해시태그 생성기",
  "youtube-thumbnail": "유튜브 썸네일 다운로더",
  "color-picker": "색상 추출기",
  qr: "QR 생성기",
  converter: "포맷 변환기",
  metadata: "메타데이터 추출기",
  "code-beautifier": "코드 뷰티파이어",
};

export default function ToolsSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="스튜디오 Tools"
      sectionName={sectionNames[section] || "스튜디오 Tools"}
      homeHref="/studio/tools"
    />
  );
}
