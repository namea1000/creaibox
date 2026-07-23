"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteBuilderProvider, useSiteBuilder } from "./context";
import UpgradeModal from "./components/UpgradeModal";
import { Globe, Settings, Eye, Phone, MapPin, Loader2, Plus, LayoutDashboard, Wand2, Palette, MessageSquare, FileText, ChevronRight } from "lucide-react";

function SiteBuilderLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    profile,
    sites,
    selectedSite,
    setSelectedSite,
    isCreatingNewSite,
    setIsCreatingNewSite,
    loading,
  } = useSiteBuilder();

  // 1. Loading State (No Full-Screen Spinner, renders interactive shell skeleton)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-pulse">
        {/* Master Header Skeleton */}
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2">
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 w-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-px flex gap-2 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
          ))}
        </div>

        {/* Inner Content Loading Spinner */}
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#06080d]/50 rounded-3xl border border-slate-200 dark:border-slate-800/80">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            스튜디오 데이터를 불러오고 있습니다...
          </span>
        </div>
      </div>
    );
  }

  // 2. Auth Session Check
  if (!profile) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          로그인 세션이 만료되었습니다. 다시 로그인해 주세요.
        </h2>
      </div>
    );
  }

  // 3. Enforce Pro/Business/Enterprise/Admin Membership Restrictions
  const mLevel = (profile.membership_level || "").toLowerCase();
  const role = (profile.role || "").toUpperCase();
  const isAllowed =
    mLevel === "pro" ||
    mLevel === "business" ||
    mLevel === "enterprise" ||
    mLevel === "admin" ||
    role === "ADMIN" ||
    role === "SUPER_ADMIN";

  if (!isAllowed) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <UpgradeModal />
      </div>
    );
  }

  // Build live link URL
  const liveUrl = selectedSite ? `http://${selectedSite.brand_id}.localhost:3000` : "";

  // Switcher Handler
  const handleSiteSwitch = (siteId: string) => {
    const selected = sites.find((s) => s.id === siteId);
    if (selected) {
      setSelectedSite(selected);
      setIsCreatingNewSite(false);
    }
  };

  // Create New Site Trigger
  const handleCreateNewSite = () => {
    setIsCreatingNewSite(true);
    router.push("/studio/client-site-builder/builder");
  };

  // Tabs Definition
  const tabs = [
    { name: "대시보드", href: "/studio/client-site-builder", icon: LayoutDashboard },
    { name: "AI 홈페이지 빌더", href: "/studio/client-site-builder/builder", icon: Plus },
    { name: "섹션 레이아웃 변경", href: "/studio/client-site-builder/sections", icon: Wand2 },
    { name: "디자인 테마 라이브러리", href: "/studio/client-site-builder/themes", icon: Palette },
    { name: "고객 문의 관리", href: "/studio/client-site-builder/inquiries", icon: MessageSquare },
    { name: "페이지 & 글 관리", href: "/studio/client-site-builder/posts", icon: FileText },
    { name: "홈페이지 설정", href: "/studio/client-site-builder/settings", icon: Settings },
  ];

  const hasSites = sites && sites.length > 0 && selectedSite;

  // 4. Render clean full-screen wizard/opening card when user has no website yet
  if (!hasSites) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 animate-fade-in">
        <div className="min-h-[500px]">{children}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Site Master GNB Header */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              운영 중
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {selectedSite.brand_id}.creaibox.com
            </span>

            {/* Multi-site switcher dropdown */}
            {sites.length > 1 && (
              <select
                value={selectedSite.id}
                onChange={(e) => handleSiteSwitch(e.target.value)}
                className="ml-3 text-xs font-black text-slate-700 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-slate-900 dark:text-white">
                    🏢 {s.company_name} ({s.brand_id})
                  </option>
                ))}
              </select>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {selectedSite.company_name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-3">
            {selectedSite.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} /> {selectedSite.phone}
              </span>
            )}
            {selectedSite.address && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {selectedSite.address}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateNewSite}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/85 dark:hover:bg-slate-750 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>➕ 새 홈페이지 추가</span>
          </button>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Eye size={16} />
            <span>내 홈페이지 바로가기</span>
          </a>
        </div>
      </div>

      {/* WordPress-style Tabs GNB Sub-Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-px flex gap-2 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "border-[var(--primary)] dark:border-emerald-500 text-[var(--primary)] dark:text-emerald-400 font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content Render */}
      <div className="min-h-[400px]">{children}</div>
    </div>
  );
}

export default function ClientSiteBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteBuilderProvider>
      <SiteBuilderLayoutContent>{children}</SiteBuilderLayoutContent>
    </SiteBuilderProvider>
  );
}
