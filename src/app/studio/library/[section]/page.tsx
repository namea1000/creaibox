"use client";

import { useParams } from "next/navigation";
import StudioOperationalSectionPage from "@/components/studio/StudioOperationalSectionPage";
import CreaiboxLibraryManager from "./components/CreaiboxLibraryManager";

const sectionNames: Record<string, string> = {
  creaibox: "크리에이박스 콘텐츠",
  naver: "네이버 콘텐츠",
  news: "뉴스 콘텐츠",
  music: "음악 / 가사 콘텐츠",
  image: "이미지 콘텐츠",
  video: "비디오 콘텐츠",
  "free-assets": "미디어 라이브러리",
};

export default function LibrarySectionPage() {
  const { section } = useParams<{ section: string }>();

  if (section === "creaibox" || section === "image") {
    return <CreaiboxLibraryManager />;
  }

  return (
    <StudioOperationalSectionPage area="library" section={section} title={sectionNames[section] || "콘텐츠 라이브러리"} />
  );
}
