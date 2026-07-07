"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import Research components
import ResearchMainPage from "@/app/studio/research/page";
import ChatPage from "@/app/studio/research/chat/page";
import ContentPage from "@/app/studio/research/content/page";
import CreatePage from "@/app/studio/research/create/page";
import ImagesPage from "@/app/studio/research/images/page";
import LibraryPage from "@/app/studio/research/library/page";
import ProjectsPage from "@/app/studio/research/projects/page";
import SettingsPage from "@/app/studio/research/settings/page";

export default function PublicResearchClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    switch (path) {
      case "chat":
        return <ChatPage />;
      case "content":
        return <ContentPage />;
      case "create":
        return <CreatePage />;
      case "images":
        return <ImagesPage />;
      case "library":
        return <LibraryPage />;
      case "projects":
        return <ProjectsPage />;
      case "settings":
        return <SettingsPage />;
      case "":
      default:
        return <ResearchMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
