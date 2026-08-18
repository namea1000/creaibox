"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

import ChannelDetail from "@/app/studio/youtube/[section]/components/ChannelDetail";
import RisingVideos from "@/app/studio/youtube/[section]/components/RisingVideos";
import PopularVideos from "@/app/studio/youtube/[section]/components/PopularVideos";
import ChannelCompare from "@/app/studio/youtube/[section]/components/ChannelCompare";
import CpmCalculator from "@/app/studio/youtube/[section]/components/CpmCalculator";
import YoutubeSeo from "@/app/studio/youtube/[section]/components/YoutubeSeo";
import ShortsViral from "@/app/studio/youtube/[section]/components/ShortsViral";
import ThumbnailCtr from "@/app/studio/youtube/[section]/components/ThumbnailCtr";
import AiTitleGenerator from "@/app/studio/youtube/[section]/components/AiTitleGenerator";
import StrategyReport from "@/app/studio/youtube/[section]/components/StrategyReport";
import VideoWorkflow from "@/app/studio/youtube/[section]/components/VideoWorkflow";
import YoutubeTop300 from "@/app/studio/youtube/[section]/components/YoutubeTop300";
import YoutubeVideoSearch from "@/app/studio/youtube/[section]/components/YoutubeVideoSearch";
import YoutubeThumbnail from "@/app/studio/youtube/[section]/components/YoutubeThumbnail";

// Import original page components for reports and channel-reports mapping
import YoutubeReportsPage from "@/app/studio/youtube/reports/page";
import YoutubeChannelReportsPage from "@/app/studio/youtube/channel-reports/page";

export default function PublicYoutubeSectionClient() {
  const { section } = useParams<{ section: string }>();

  const renderContent = () => {
    switch (section) {
      case "channel":
        return <ChannelDetail />;
      case "rising":
        return <RisingVideos />;
      case "popular":
        return <PopularVideos />;
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
      case "reports":
        return <YoutubeReportsPage />;
      case "channel-reports":
        return <YoutubeChannelReportsPage />;
      case "workflow":
        return <VideoWorkflow />;
      case "top300":
        return <YoutubeTop300 />;
      case "search":
        return <YoutubeVideoSearch />;
      case "youtube-thumbnail":
        return <YoutubeThumbnail />;
      default:
        return (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-zinc-400">
            존재하지 않는 분석 기능입니다.
          </div>
        );
    }
  };

  return (
    <PublicStudioLayout>
      <div className="w-full px-5 sm:px-8 lg:px-10 py-8 space-y-8">
        {renderContent()}
      </div>
    </PublicStudioLayout>
  );
}
