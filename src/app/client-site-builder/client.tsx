"use client";

import React from "react";
import PublicStudioLayout from "@/components/layout/PublicStudioLayout";
import { SiteBuilderProvider } from "@/app/studio/client-site-builder/context";
import ClientSiteBuilderHomePage from "@/app/studio/client-site-builder/page";

export default function PublicClientSiteBuilderClient() {
  return (
    <PublicStudioLayout>
      <SiteBuilderProvider>
        <ClientSiteBuilderHomePage />
      </SiteBuilderProvider>
    </PublicStudioLayout>
  );
}
