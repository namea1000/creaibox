"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

import BgRemover from "@/app/studio/tools/[section]/components/BgRemover";
import PdfAnalyzer from "@/app/studio/tools/[section]/components/PdfAnalyzer";
import OcrExtractor from "@/app/studio/tools/[section]/components/OcrExtractor";
import PromptStudio from "@/app/studio/tools/[section]/components/PromptStudio";
import HashtagGenerator from "@/app/studio/tools/[section]/components/HashtagGenerator";
import YoutubeThumbnail from "@/app/studio/tools/[section]/components/YoutubeThumbnail";
import ColorPicker from "@/app/studio/tools/[section]/components/ColorPicker";
import QrGenerator from "@/app/studio/tools/[section]/components/QrGenerator";
import FormatConverter from "@/app/studio/tools/[section]/components/FormatConverter";
import MetadataExtractor from "@/app/studio/tools/[section]/components/MetadataExtractor";
import CodeBeautifier from "@/app/studio/tools/[section]/components/CodeBeautifier";

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

export default function PublicToolsSectionClient() {
  const { section } = useParams<{ section: string }>();
  const name = sectionNames[section] || "스튜디오 Tools";

  const renderContent = () => {
    switch (section) {
      case "bg-remover":
        return <BgRemover />;
      case "pdf-analyzer":
        return <PdfAnalyzer />;
      case "ocr":
        return <OcrExtractor />;
      case "prompt-enhancer":
        return <PromptStudio defaultTab="enhancer" />;
      case "prompt-translator":
        return <PromptStudio defaultTab="translator" />;
      case "prompt-studio":
        return <PromptStudio defaultTab="enhancer" />;
      case "hashtag":
        return <HashtagGenerator />;
      case "youtube-thumbnail":
        return <YoutubeThumbnail />;
      case "color-picker":
        return <ColorPicker />;
      case "qr":
        return <QrGenerator />;
      case "converter":
        return <FormatConverter />;
      case "metadata":
        return <MetadataExtractor />;
      case "code-beautifier":
        return <CodeBeautifier />;
      default:
        return (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-zinc-400">
            존재하지 않는 스튜디오 도구입니다.
          </div>
        );
    }
  };

  return (
    <PublicStudioLayout>
      <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/utility-tools"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                <Link href="/utility-tools" className="hover:text-zinc-350 transition">
                  유틸리티 Tools
                </Link>
                <span>/</span>
                <span className="text-zinc-400">{name}</span>
              </div>
              <h1 className="text-lg font-black text-zinc-900 dark:text-white">{name}</h1>
            </div>
          </div>

          {/* Dynamic Tool Component */}
          <div className="pt-2">{renderContent()}</div>
        </div>
      </div>
    </PublicStudioLayout>
  );
}
