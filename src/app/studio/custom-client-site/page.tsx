"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import MarketplaceTab from "@/components/studio/custom-client-site/tabs/MarketplaceTab";
import MigrationTab from "@/components/studio/custom-client-site/tabs/MigrationTab";
import ManageTab from "@/components/studio/custom-client-site/tabs/ManageTab";
import RequestTab from "@/components/studio/custom-client-site/tabs/RequestTab";
import AdminDashboardTab from "@/components/studio/custom-client-site/tabs/AdminDashboardTab";
import PreviewModal from "@/components/studio/custom-client-site/modals/PreviewModal";
import DeployModal from "@/components/studio/custom-client-site/modals/DeployModal";

import {
  Sparkles,
  Globe,
  LayoutGrid,
  Settings2,
  Cpu,
  Store,
  Check,
  ExternalLink,
  Eye,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Send,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle2,
  HelpCircle,
  Lock,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Video,
  Activity,
  Tag,
  Flame,
  Plus,
  Pencil,
  Trash2,
  ListPlus,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Bot,
  Terminal,
  Copy,
  Clock,
  User,
  MessageSquareCode,
  CheckCircle,
  CreditCard,
} from "lucide-react";

import {
  CustomMenuItem,
  AdminRequestItem,
  DesignPreset,
  CustomTemplate,
  INDUSTRY_DESIGN_PRESETS,
  CUSTOM_TEMPLATES
} from "@/constants/custom-client-site";
import { INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function CustomClientSiteStudioPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "migration" | "manage" | "request" | "admin_dashboard">("marketplace");
    
  // Site AI Migration State
        
  
  // Admin Dashboard State
        
  // Preview Modal State (KIMI Style with 3-Device Viewport Mode)
  const [previewModalTemplate, setPreviewModalTemplate] = useState<CustomTemplate | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Deploy Modal State
  const [deployModalTemplate, setDeployModalTemplate] = useState<CustomTemplate | null>(null);
  const [deploySiteName, setDeploySiteName] = useState<string>("");
  const [deploySubdomain, setDeploySubdomain] = useState<string>("");
    const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  // Auth & Modal State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const requireAuth = (action?: () => void): boolean => {
    if (!currentUser) {
      setShowLoginModal(true);
      return false;
    }
    if (action) action();
    return true;
  };

  // Management State (Cleared for unauthenticated or fresh users)

  // Handle Deploy Modal Submit
  
  // Handle Request Submit
  
      return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-6 lg:p-10 space-y-8">
      {/* Header Banner (Compact Slim Layout) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-5 sm:p-6 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 text-[11px] font-black text-cyan-300 backdrop-blur-md">
              <Sparkles size={13} className="animate-pulse text-cyan-400" />
              <span>CreAibox 커스텀 홈페이지 허브</span>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight text-white whitespace-nowrap">
              100% 독창적인 프리미엄 커스텀 홈페이지{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                템플릿 쇼핑 & 1초 자동 구축 센터
              </span>
            </h1>

            <p className="text-xs text-slate-300 font-medium leading-normal">
              템플릿 쇼핑, 고객 사이트 실시간 기본정보 편집, AI 신규 제작 신청까지 한눈에 관리하세요.
            </p>
          </div>

          {/* Quick Metrics Bar (Slim Chips) */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">템플릿</p>
              <p className="text-sm font-black text-cyan-400">100+ 종</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">구축 시간</p>
              <p className="text-sm font-black text-emerald-400">단 1초</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">SEO 엔진</p>
              <p className="text-sm font-black text-amber-400">DoFollow</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">AI 전담케어</p>
              <p className="text-sm font-black text-purple-400">24시간</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "marketplace"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <LayoutGrid size={16} />
          <span>1️⃣ 템플릿 쇼핑 & 1초 구축</span>
        </button>

        <button
          onClick={() => setActiveTab("migration")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "migration"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-indigo-500/30"
          }`}
        >
          <Globe size={16} className="text-indigo-400 animate-pulse" />
          <span>2️⃣ 🚀 기존 홈페이지 1초 AI 이관</span>
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "manage"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Settings2 size={16} />
          <span>3️⃣ 내 커스텀 사이트 관리</span>
        </button>

        <button
          onClick={() => setActiveTab("request")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "request"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Cpu size={16} />
          <span>4️⃣ AI 커스텀 신규 제작 신청</span>
        </button>

        <button
          onClick={() => setActiveTab("admin_dashboard")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "admin_dashboard"
              ? "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-rose-500/30"
          }`}
        >
          <Bot size={16} className="text-rose-400 animate-pulse" />
          <span>5️⃣ 👑 관리자: 커스텀 신청 현황 (여러 건)</span>
        </button>

      </div>

      {/* --- TAB 1: 템플릿 쇼핑 & 1초 구축 (Custom Template Marketplace) --- */}
            {activeTab === "marketplace" && (
        <MarketplaceTab
          setPreviewModalTemplate={setPreviewModalTemplate}
          setDeployModalTemplate={setDeployModalTemplate}
          setDeploySiteName={setDeploySiteName}
          setDeploySubdomain={setDeploySubdomain}
          setDeploySuccess={setDeploySuccess}
          requireAuth={requireAuth}
        />
      )}
            {activeTab === "migration" && (
        <MigrationTab requireAuth={requireAuth} />
      )}
            {activeTab === "manage" && (
        <ManageTab currentUser={currentUser} requireAuth={requireAuth} />
      )}
            {activeTab === "request" && (
        <RequestTab requireAuth={requireAuth} />
      )}
            {activeTab === "admin_dashboard" && (
        <AdminDashboardTab requireAuth={requireAuth} setActiveTab={setActiveTab} />
      )}
            <DeployModal
        deployModalTemplate={deployModalTemplate}
        setDeployModalTemplate={setDeployModalTemplate}
        deploySiteName={deploySiteName}
        setDeploySiteName={setDeploySiteName}
        deploySubdomain={deploySubdomain}
        setDeploySubdomain={setDeploySubdomain}
        deploySuccess={deploySuccess}
        setDeploySuccess={setDeploySuccess}
        setActiveTab={setActiveTab}
      />
            <PreviewModal
        requireAuth={requireAuth}
        setDeployModalTemplate={setDeployModalTemplate}
        setDeploySiteName={setDeploySiteName}
        setDeploySubdomain={setDeploySubdomain}
        setDeploySuccess={setDeploySuccess}
        previewModalTemplate={previewModalTemplate}
        setPreviewModalTemplate={setPreviewModalTemplate}
        previewDeviceMode={previewDeviceMode}
        setPreviewDeviceMode={setPreviewDeviceMode}
        onDeploy={(tpl) => {
          setDeployModalTemplate(tpl);
          setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
          setDeploySubdomain(`${tpl.id}-mybrand`);
          setDeploySuccess(false);
          setPreviewModalTemplate(null);
        }}
      />
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mx-auto w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <Globe size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">
                로그인이 필요한 서비스입니다
              </h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                1초 원클릭 커스텀 웹사이트 구축 및 AI 에이전트 제작 신청을 위해 로그인이 필요합니다. <br />
                로그인 후 1초 만에 나만의 맞춤형 커스텀 홈페이지를 만들어 보세요!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login?redirect=/studio/custom-client-site"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>🔑 로그인 하러 가기</span>
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-400 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <span>둘러보기 계속하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
