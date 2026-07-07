"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import Community components
import CommunityMainPage from "@/app/studio/community/page";
import ChatRoom from "@/app/studio/community/[section]/components/ChatRoom";

export default function PublicCommunityClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    if (path === "") {
      return <CommunityMainPage />;
    }
    return <ChatRoom section={path} />;
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
