"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSiteBuilder } from "../context";
import SiteCreationWizard from "../components/SiteCreationWizard";
import SectionEditor from "../components/SectionEditor";
import { Loader2 } from "lucide-react";

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");

  const {
    sites,
    selectedSite,
    isCreatingNewSite,
    setIsCreatingNewSite,
    refreshData,
  } = useSiteBuilder();

  // 1. Render creation wizard if there are no sites or user explicitly clicked 'New Site'
  if (sites.length === 0 || isCreatingNewSite) {
    return (
      <SiteCreationWizard
        initialTemplateId={themeParam || undefined}
        onSuccess={() => {
          setIsCreatingNewSite(false);
          refreshData();
        }}
        onCancel={sites.length > 0 ? () => setIsCreatingNewSite(false) : undefined}
      />
    );
  }

  // 2. Render live Section Editor if site exists
  return <SectionEditor siteId={selectedSite.id} />;
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
          <span className="text-sm font-bold">빌더를 준비하는 중입니다...</span>
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  );
}
