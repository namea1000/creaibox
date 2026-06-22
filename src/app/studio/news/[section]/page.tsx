"use client";

import { useParams } from "next/navigation";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";
import CollectSection from "@/components/studio/news/CollectSection";
import SummarySection from "@/components/studio/news/SummarySection";
import BlogSection from "@/components/studio/news/BlogSection";
import IssueSection from "@/components/studio/news/IssueSection";
import TrendSection from "@/components/studio/news/TrendSection";
import PublishSection from "@/components/studio/news/PublishSection";
import CardSection from "@/components/studio/news/CardSection";
import AnchorSection from "@/components/studio/news/AnchorSection";
import ArchiveSection from "@/components/studio/news/ArchiveSection";
import DashboardSection from "@/components/studio/news/DashboardSection";

const sectionNames: Record<string, string> = {
  collect: "실시간 뉴스 수집",
  summary: "AI 뉴스 요약",
  blog: "뉴스 기반 블로그 생성",
  issue: "실시간 이슈 탐지",
  trend: "뉴스 트렌드 분석",
  publish: "뉴스 콘텐츠 자동 발행",
  card: "뉴스 카드 제작",
  anchor: "AI 뉴스 앵커",
  archive: "뉴스 아카이브",
  dashboard: "뉴스 대시보드",
};

export default function NewsSectionPage() {
  const { section } = useParams<{ section: string }>();

  const renderSection = () => {
    switch (section) {
      case "collect":
        return <CollectSection />;
      case "summary":
        return <SummarySection />;
      case "blog":
        return <BlogSection />;
      case "issue":
        return <IssueSection />;
      case "trend":
        return <TrendSection />;
      case "publish":
        return <PublishSection />;
      case "card":
        return <CardSection />;
      case "anchor":
        return <AnchorSection />;
      case "archive":
        return <ArchiveSection />;
      case "dashboard":
        return <DashboardSection />;
      default:
        return (
          <StudioComingSoonPage
            studioName="뉴스 콘텐츠"
            sectionName={sectionNames[section] || "뉴스 콘텐츠"}
            homeHref="/studio/news"
          />
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {renderSection()}
    </div>
  );
}
