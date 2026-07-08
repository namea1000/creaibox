"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSiteBuilder } from "../context";
import SiteCreationWizard from "../components/SiteCreationWizard";
import { Loader2 } from "lucide-react";

function BuilderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeParam = searchParams.get("theme");

  const {
    sites,
    setIsCreatingNewSite,
    refreshData,
  } = useSiteBuilder();

  return (
    <SiteCreationWizard
      initialTemplateId={themeParam || undefined}
      onSuccess={async () => {
        setIsCreatingNewSite(false);
        await refreshData();
        router.push("/studio/client-site-builder");
      }}
      onCancel={
        sites.length > 0
          ? () => {
              setIsCreatingNewSite(false);
              router.push("/studio/client-site-builder");
            }
          : undefined
      }
    />
  );
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
