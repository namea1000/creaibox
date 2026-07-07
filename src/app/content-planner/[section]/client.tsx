"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import all subpages from studio content-planner
import ContentPlannerMainPage from "@/app/studio/content-planner/page";
import IdeaHubPage from "@/app/studio/content-planner/idea-hub/page";
import PlanningPage from "@/app/studio/content-planner/planning/page";
import LibraryPage from "@/app/studio/content-planner/library/page";
import CalendarPage from "@/app/studio/content-planner/calendar/page";
import WorkflowPage from "@/app/studio/content-planner/workflow/page";
import TrendsPage from "@/app/studio/content-planner/trends/page";
import StrategyPage from "@/app/studio/content-planner/strategy/page";
import SettingsPage from "@/app/studio/content-planner/settings/page";

export default function PublicContentPlannerClient() {
  const { section } = useParams<{ section?: string }>();

  const renderContent = () => {
    switch (section) {
      case "idea-hub":
        return <IdeaHubPage />;
      case "planning":
        return <PlanningPage />;
      case "library":
        return <LibraryPage />;
      case "calendar":
        return <CalendarPage />;
      case "workflow":
        return <WorkflowPage />;
      case "trends":
        return <TrendsPage />;
      case "strategy":
        return <StrategyPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <ContentPlannerMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
