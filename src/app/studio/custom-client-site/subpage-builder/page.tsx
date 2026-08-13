"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import SubpageBuilderTab from "@/components/studio/custom-client-site/tabs/SubpageBuilderTab";

export default function SubpageBuilderPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

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
        <h1 className="text-2xl font-black text-white">서브 페이지 AI 추가 제작</h1>
        <p className="text-sm text-slate-400 mt-1">타겟 서브페이지 URL과 참조 자료를 입력해 기존 사이트와 톤앤매너가 완벽하게 일치하는 서브페이지를 생성하세요.</p>
      </div>

      <SubpageBuilderTab requireAuth={requireAuth} />

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
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                닫기
              </button>
              <a
                href="/login"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
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
