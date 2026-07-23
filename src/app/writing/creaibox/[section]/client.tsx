"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import all subpages from studio writing/creaibox
import CreaiboxWritingMainPage from "@/app/studio/writing/creaibox/page";
import NewPostPage from "@/app/studio/writing/creaibox/new-post/page";
import ListPage from "@/app/studio/writing/creaibox/list/page";
import RecreatePage from "@/app/studio/writing/creaibox/recreate/page";
import BlogManagementPage from "@/app/studio/writing/creaibox/blog-management/page";
import ThumbnailPage from "@/app/studio/writing/creaibox/thumbnail/page";
import KnowledgePage from "@/app/studio/writing/creaibox/knowledge/page";
import AnalyticsPage from "@/app/studio/writing/creaibox/analytics/page";
import EditorPage from "@/app/studio/writing/creaibox/editor/page";
import IdeaGeneratorPage from "@/app/studio/writing/creaibox/ideagenerator/page";
import PlanPage from "@/app/studio/writing/creaibox/plan/page";

export default function PublicCreaiboxWritingClient() {
  const { section } = useParams<{ section?: string }>();

  const renderContent = () => {
    switch (section) {
      case "new-post":
        return <NewPostPage />;
      case "list":
        return <ListPage />;
      case "recreate":
        return <RecreatePage />;
      case "blog-management":
        return <BlogManagementPage />;
      case "thumbnail":
        return <ThumbnailPage />;
      case "knowledge":
        return <KnowledgePage />;
      case "analytics":
        return <AnalyticsPage />;
      case "editor":
        return <EditorPage />;
      case "ideagenerator":
        return <IdeaGeneratorPage />;
      case "plan":
        return <PlanPage />;
      default:
        return <CreaiboxWritingMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
