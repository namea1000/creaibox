"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

import TemplatesTab from "@/app/studio/image/[section]/components/TemplatesTab";
import WorkspaceTab from "@/app/studio/image/[section]/components/WorkspaceTab";
import BrandKitTab from "@/app/studio/image/[section]/components/BrandKitTab";
import MagicDesignTab from "@/app/studio/image/[section]/components/MagicDesignTab";
import WebpCompressorTab from "@/app/studio/image/[section]/components/WebpCompressorTab";
import ImageEditorTab from "@/app/studio/image/[section]/components/ImageEditorTab";
import PromptsTab from "@/app/studio/image/[section]/components/PromptsTab";
import CategoryTemplatesTab from "@/app/studio/image/[section]/components/CategoryTemplatesTab";
import ImageConverterTab from "@/app/studio/image/[section]/components/ImageConverterTab";

// 🌟 개별 물리 페이지의 본체 디자인 컴포넌트들 수입
import BackgroundRemoverPage from "@/app/studio/image/bg-remover/page";
import ResizerPage from "@/app/studio/image/resizer/page";
import ThumbnailPage from "@/app/studio/image/thumbnail/page";
import UpscalerPage from "@/app/studio/image/upscaler/page";

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

export default function PublicDesignSectionClient() {
  const { section } = useParams<{ section: string }>();
  const name = sectionNames[section] || "디자인 스튜디오";

  const renderContent = () => {
    switch (section) {
      case "templates":
        return <TemplatesTab />;
      case "workspace":
        return <WorkspaceTab />;
      case "brand-kit":
        return <BrandKitTab />;
      case "magic-design":
        return <MagicDesignTab />;
      case "converter":
        return <ImageConverterTab />;
      case "webp-compressor":
        return <WebpCompressorTab />;
      case "editor":
        return <ImageEditorTab />;
      case "prompts":
        return <PromptsTab />;
      case "poster":
      case "business-card":
      case "banner":
        return <CategoryTemplatesTab category={section} />;
      case "bg-remover":
        return <BackgroundRemoverPage />;
      case "resizer":
        return <ResizerPage />;
      case "thumbnail":
        return <ThumbnailPage />;
      case "upscaler":
        return <UpscalerPage />;
      default:
        return (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-zinc-400">
            존재하지 않는 디자인 스튜디오 메뉴입니다.
          </div>
        );
    }
  };

  return (
    <PublicStudioLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] w-full items-center justify-center bg-zinc-50 dark:bg-[#06080d] text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
            <div className="text-purple-500 animate-pulse font-black italic uppercase tracking-widest text-xs">
              Loading Canva Studio...
            </div>
          </div>
        }
      >
        <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Navigation Breadcrumb */}
            <div className="flex items-center gap-3">
              <Link
                href="/design"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
                  <Link href="/design" className="hover:text-zinc-350 transition">
                    디자인 스튜디오
                  </Link>
                  <span>/</span>
                  <span className="text-zinc-400">{name}</span>
                </div>
                <h1 className="text-lg font-black text-zinc-900 dark:text-white">{name}</h1>
              </div>
            </div>

            {/* Dynamic Component */}
            <div className="pt-2">{renderContent()}</div>
          </div>
        </div>
      </Suspense>
    </PublicStudioLayout>
  );
}
