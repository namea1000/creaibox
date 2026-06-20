"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BulkSearch from "./components/BulkSearch";
import RelatedKeywords from "./components/RelatedKeywords";
import MorphologyAnalyzer from "./components/MorphologyAnalyzer";
import RankTracker from "./components/RankTracker";
import RisingTrends from "./components/RisingTrends";
import YoutubeKeywords from "./components/YoutubeKeywords";
import SeoCompetitor from "./components/SeoCompetitor";
import AiStrategy from "./components/AiStrategy";
import AutoWorkflow from "./components/AutoWorkflow";
import TrendDashboard from "./components/TrendDashboard";

const sectionNames: Record<string, string> = {
  bulk: "키워드 대량 조회",
  related: "연관 키워드 발굴",
  morphology: "형태소 분석기",
  rank: "실시간 순위 추적",
  rising: "트렌드 급상승 분석",
  youtube: "유튜브 키워드 분석",
  seo: "SEO 경쟁 분석",
  strategy: "AI 키워드 전략 생성",
  workflow: "자동 콘텐츠 연결",
  dashboard: "트렌드 대시보드",
};

export default function KeywordSectionPage() {
  const { section } = useParams<{ section: string }>();
  const name = sectionNames[section] || "키워드 트렌드 분석";

  const renderContent = () => {
    switch (section) {
      case "bulk":
        return <BulkSearch />;
      case "related":
        return <RelatedKeywords />;
      case "morphology":
        return <MorphologyAnalyzer />;
      case "rank":
        return <RankTracker />;
      case "rising":
        return <RisingTrends />;
      case "youtube":
        return <YoutubeKeywords />;
      case "seo":
        return <SeoCompetitor />;
      case "strategy":
        return <AiStrategy />;
      case "workflow":
        return <AutoWorkflow />;
      case "dashboard":
        return <TrendDashboard />;
      default:
        return (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-zinc-400">
            존재하지 않는 분석 기능입니다.
          </div>
        );
    }
  };

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/studio/keyword"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
              <Link href="/studio/keyword" className="hover:text-zinc-350 transition">
                키워드 트렌드 분석
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
  );
}

