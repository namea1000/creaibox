"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

const sectionNames: Record<string, string> = {
  prompts: "프롬프트 라이브러리",
  poster: "포스터 & 전단지",
  "business-card": "디지털 명함",
  banner: "현수막 & 배너",
  webp: "WEBP 압축기",
  editor: "이미지 편집기",
};

export default function ImageSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioComingSoonPage
      studioName="이미지 스튜디오"
      sectionName={sectionNames[section] || "이미지 스튜디오"}
      homeHref="/studio/image"
    />
  );
}
