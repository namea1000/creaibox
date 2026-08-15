"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import MarketplaceTab from "@/components/studio/custom-client-site/tabs/MarketplaceTab";
import PreviewModal from "@/components/studio/custom-client-site/modals/PreviewModal";
import DeployModal from "@/components/studio/custom-client-site/modals/DeployModal";
import { CustomTemplate } from "@/constants/custom-client-site";

export default function MarketplacePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Modal States for 1-Click Preview & Instant Deployment
  const [previewModalTemplate, setPreviewModalTemplate] = useState<CustomTemplate | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [deployModalTemplate, setDeployModalTemplate] = useState<CustomTemplate | null>(null);
  const [deploySiteName, setDeploySiteName] = useState<string>("");
  const [deploySubdomain, setDeploySubdomain] = useState<string>("");
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then((res: any) => {
      setCurrentUser(res?.data?.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const requireAuth = (action?: () => void): boolean => {
    if (!currentUser) {
      setShowLoginModal(true);
      return false;
    }
    if (action) action();
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">템플릿 쇼핑 & 1초 구축</h1>
        <p className="text-sm text-slate-400 mt-1">다양한 프리미엄 템플릿을 구경하고 내 서브도메인에 즉시 배포하세요.</p>
      </div>

      <MarketplaceTab 
        requireAuth={requireAuth} 
        setPreviewModalTemplate={setPreviewModalTemplate}
        setDeployModalTemplate={setDeployModalTemplate}
        setDeploySiteName={setDeploySiteName}
        setDeploySubdomain={setDeploySubdomain}
        setDeploySuccess={setDeploySuccess}
      />

      {/* 🖥️ High-Definition 3-Device Viewport Live Preview Modal */}
      <PreviewModal
        previewModalTemplate={previewModalTemplate}
        setPreviewModalTemplate={setPreviewModalTemplate}
        previewDeviceMode={previewDeviceMode}
        setPreviewDeviceMode={setPreviewDeviceMode}
        onDeploy={(tpl) => {
          requireAuth(() => {
            setPreviewModalTemplate(null);
            setDeployModalTemplate(tpl);
            setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
            setDeploySubdomain(`${tpl.id}-mybrand`);
            setDeploySuccess(false);
          });
        }}
        requireAuth={requireAuth}
        setDeployModalTemplate={setDeployModalTemplate}
        setDeploySiteName={setDeploySiteName}
        setDeploySubdomain={setDeploySubdomain}
        setDeploySuccess={setDeploySuccess}
      />

      {/* 🚀 1-Second Instant Deployment Modal */}
      <DeployModal
        deployModalTemplate={deployModalTemplate}
        setDeployModalTemplate={setDeployModalTemplate}
        deploySiteName={deploySiteName}
        setDeploySiteName={setDeploySiteName}
        deploySubdomain={deploySubdomain}
        setDeploySubdomain={setDeploySubdomain}
        deploySuccess={deploySuccess}
        setDeploySuccess={setDeploySuccess}
        setActiveTab={() => {}}
      />

      {/* Unified Simple Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-indigo-500/30 bg-slate-900 shadow-2xl p-6 text-center space-y-6">
            <h3 className="text-xl font-black text-white">로그인이 필요합니다</h3>
            <p className="text-sm font-medium text-slate-300">
              커스텀 웹사이트 제작 및 관리 기능은 로그인 후 이용하실 수 있습니다.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                닫기
              </button>
              <a
                href="/login"
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-black text-white shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                🔑 로그인 하러 가기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
