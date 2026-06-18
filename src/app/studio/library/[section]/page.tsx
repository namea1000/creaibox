"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";
import CreaiboxLibraryManager from "./components/CreaiboxLibraryManager";

const sectionNames: Record<string, string> = {
  all: "전체 콘텐츠",
  creaibox: "크리아이박스 콘텐츠",
  naver: "네이버 콘텐츠",
  news: "뉴스 콘텐츠",
  music: "음악 / 가사 콘텐츠",
  image: "이미지 콘텐츠",
  video: "비디오 콘텐츠",
  prompts: "프롬프트 보관함",
  templates: "템플릿 라이브러리",
  favorites: "즐겨찾기",
  recent: "최근 작업물",
  drafts: "임시저장",
  published: "발행 완료",
  history: "AI 생성 이력",
  analytics: "사용량 통계",
  trash: "휴지통",
};

export default function LibrarySectionPage() {
  const { section } = useParams<{ section: string }>();

  if (section === "creaibox" || section === "image") {
    return <CreaiboxLibraryManager />;
  }

  return (
    <StudioComingSoonPage
      studioName="콘텐츠 라이브러리"
      sectionName={sectionNames[section] || "콘텐츠 라이브러리"}
      homeHref="/studio/library"
    />
  );
}
