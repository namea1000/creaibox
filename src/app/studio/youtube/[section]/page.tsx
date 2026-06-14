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
    <div className="min-h-full w-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/studio/youtube"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500">
              <Link href="/studio/youtube" className="hover:text-zinc-350 transition">
                유튜브 트렌드 분석
              </Link>
              <span>/</span>
              <span className="text-zinc-400">{name}</span>
            </div>
            <h1 className="text-lg font-black text-white">{name}</h1>
          </div>
        </div>

        {/* Dynamic Tool Component */}
        <div className="pt-2">{renderContent()}</div>
      </div>
    </div>
  );
}

