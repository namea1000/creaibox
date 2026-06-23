"use client";

import { useParams } from "next/navigation";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";

const sectionNames: Record<string, string> = {
  image: "AI 이미지 워크샵",
  knowledge: "지식 베이스",
  settings: "엔진 커스텀 세팅",
};

export default function CreaiboxWritingSectionPage() {
  const { section } = useParams<{ section: string }>();

  return (
    <StudioOperationalSectionPage area="creaibox" section={section} title={sectionNames[section] || "크리아이박스 글쓰기"} />
  );
}
