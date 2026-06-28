"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ChannelDetail from "./components/ChannelDetail";
import RisingVideos from "./components/RisingVideos";
import ChannelCompare from "./components/ChannelCompare";
import CpmCalculator from "./components/CpmCalculator";
import YoutubeSeo from "./components/YoutubeSeo";
import ShortsViral from "./components/ShortsViral";
import ThumbnailCtr from "./components/ThumbnailCtr";
import AiTitleGenerator from "./components/AiTitleGenerator";
import StrategyReport from "./components/StrategyReport";
import VideoWorkflow from "./components/VideoWorkflow";

const sectionNames: Record<string, string> = {
  channel: "채널 상세 분석",
  rising: "급상승 영상 트렌드",
  compare: "경쟁 채널 비교",
  cpm: "광고 단가 계산기",
  seo: "유튜브 SEO 분석",
  shorts: "쇼츠 바이럴 분석",
  thumbnail: "썸네일 CTR 연구소",
  title: "AI 제목 생성기",
  report: "콘텐츠 전략 리포트",
  workflow: "유튜브 자동 제작 연결",
};

export default function YoutubeSectionPage() {
  const { section } = useParams<{ section: string }>();
  const name = sectionNames[section] || "유튜브 트렌드 분석";

  const renderContent = () => {
    switch (section) {
      case "channel":
        return <ChannelDetail />;
      case "rising":
        return <RisingVideos />;
      case "compare":
        return <ChannelCompare />;
      case "cpm":
        return <CpmCalculator />;
      case "seo":
        return <YoutubeSeo />;
      case "shorts":
        return <ShortsViral />;
      case "thumbnail":
        return <ThumbnailCtr />;
      case "title":
        return <AiTitleGenerator />;
      case "report":
        return <StrategyReport />;
      case "workflow":
        return <VideoWorkflow />;
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
      <div className="mx-auto max-w-7xl">
        {/* Dynamic Tool Component */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

