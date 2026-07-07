"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import StudioComingSoonPage from "@/components/studio/StudioComingSoonPage";

// Import Report components
import ReportMainPage from "@/app/studio/report/page";
import MarketSection from "@/components/studio/aireport/MarketSection";
import IndustrySection from "@/components/studio/aireport/IndustrySection";
import NewsSection from "@/components/studio/aireport/NewsSection";
import ToolsSection from "@/components/studio/aireport/ToolsSection";
import ProductivitySection from "@/components/studio/aireport/ProductivitySection";
import InvestmentSection from "@/components/studio/aireport/InvestmentSection";
import ForecastSection from "@/components/studio/aireport/ForecastSection";
import ResearchSection from "@/components/studio/aireport/ResearchSection";
import GeneratorSection from "@/components/studio/aireport/GeneratorSection";
import DashboardSection from "@/components/studio/aireport/DashboardSection";

const sectionNames: Record<string, string> = {
  market: "AI 시장 리포트",
  industry: "산업별 AI 분석",
  news: "AI 뉴스 브리핑",
  tools: "AI 툴 비교 분석",
  productivity: "AI 생산성 리포트",
  investment: "AI 투자 분석",
  forecast: "AI 트렌드 예측",
  research: "AI 리서치 센터",
  generator: "AI 콘텐츠 자동 생성",
  dashboard: "AI 인사이트 대시보드",
};

export default function PublicReportClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    switch (path) {
      case "market":
        return <MarketSection />;
      case "industry":
        return <IndustrySection />;
      case "news":
        return <NewsSection />;
      case "tools":
        return <ToolsSection />;
      case "productivity":
        return <ProductivitySection />;
      case "investment":
        return <InvestmentSection />;
      case "forecast":
        return <ForecastSection />;
      case "research":
        return <ResearchSection />;
      case "generator":
        return <GeneratorSection />;
      case "dashboard":
        return <DashboardSection />;
      case "":
        return <ReportMainPage />;
      default:
        return (
          <StudioComingSoonPage
            studioName="AI 리포트"
            sectionName={sectionNames[path] || "AI 리포트"}
            homeHref="/aireport"
          />
        );
    }
  };

  return (
    <PublicStudioLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">{renderContent()}</div>
    </PublicStudioLayout>
  );
}
