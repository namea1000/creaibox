"use client";

import React from "react";
import { useParams } from "next/navigation";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";

// Import Infocenter components
import InfocenterMainPage from "@/app/studio/infocenter/page";
import ListPage from "@/app/studio/infocenter/list/[category]/page";
import ViewPage from "@/app/studio/infocenter/view/[id]/page";
import WritingPage from "@/app/studio/infocenter/writing/page";

export default function PublicInfocenterClient() {
  const params = useParams<{ section?: string[] }>();
  const segments = params.section || [];
  const path = segments.join("/");

  const renderContent = () => {
    if (segments[0] === "list") {
      return <ListPage />;
    }
    if (segments[0] === "view") {
      return <ViewPage />;
    }
    switch (path) {
      case "writing":
        return <WritingPage />;
      case "":
      default:
        return <InfocenterMainPage />;
    }
  };

  return <PublicStudioLayout>{renderContent()}</PublicStudioLayout>;
}
