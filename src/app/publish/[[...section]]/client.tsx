"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import Publish components
import PublishMainPage from "@/app/studio/publish/page";
import ChannelsPage from "@/app/studio/publish/channels/page";
import HistoryPage from "@/app/studio/publish/history/page";
import PostsPage from "@/app/studio/publish/posts/page";

export default function PublicPublishClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    switch (path) {
      case "channels":
        return <ChannelsPage />;
      case "history":
        return <HistoryPage />;
      case "posts":
        return <PostsPage />;
      case "":
      default:
        return <PublishMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
