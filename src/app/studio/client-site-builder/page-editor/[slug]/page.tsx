"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSiteBuilder } from "../../context";
import PageEditor from "@/components/studio/client-site-builder/PageEditor";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PageEditorRoute() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "home";

  const { selectedSite, loading } = useSiteBuilder();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-emerald-500 mx-auto" size={36} />
          <p className="text-sm font-bold text-slate-400">사이트 정보 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!selectedSite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <AlertCircle className="text-slate-400" size={40} />
        <div className="text-center space-y-2">
          <h3 className="text-base font-black text-slate-900 dark:text-white">홈페이지를 먼저 선택해주세요</h3>
          <p className="text-sm text-slate-500">운영 중인 홈페이지가 없거나 선택되지 않았습니다.</p>
        </div>
        <Link
          href="/studio/client-site-builder"
          className="flex items-center gap-2 px-5 py-3 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl transition-all"
        >
          <ArrowLeft size={16} />
          홈페이지 빌더로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-8 md:-m-8">
      {/* Back nav */}
      <div className="bg-slate-900 px-6 py-2 border-b border-slate-800 flex items-center gap-3">
        <Link
          href="/studio/client-site-builder/posts"
          className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          페이지 & 글 관리로 돌아가기
        </Link>
      </div>
      <PageEditor
        siteId={selectedSite.id}
        brandId={selectedSite.brand_id}
        slug={slug}
        companyName={selectedSite.company_name || selectedSite.brand_id}
      />
    </div>
  );
}
