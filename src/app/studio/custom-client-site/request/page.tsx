"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import RequestTab from "@/components/studio/custom-client-site/tabs/RequestTab";
import { INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function RequestPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  
  // Reuse the request state logic from the old page
  const [adminRequests, setAdminRequests] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creaibox_admin_requests");
      return stored ? JSON.parse(stored) : INITIAL_ADMIN_REQUESTS;
    }
    return INITIAL_ADMIN_REQUESTS;
  });

  const handleRequestSubmit = (data: any) => {
    const newRequest = {
      id: "REQ-" + Math.floor(Math.random() * 10000),
      ...data,
      status: "검토중",
      date: new Date().toISOString().split("T")[0],
      user_id: currentUser?.id || "guest",
    };
    const updated = [newRequest, ...adminRequests];
    setAdminRequests(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("creaibox_admin_requests", JSON.stringify(updated));
    }
    alert("신청이 완료되었습니다. 관리자 확인 후 연락드리겠습니다.");
  };

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
        <h1 className="text-2xl font-black text-white">커스텀 디자인 신청</h1>
        <p className="text-sm text-slate-400 mt-1">전문 디자이너에게 완벽한 맞춤형 웹사이트 제작을 의뢰하세요.</p>
      </div>

      <RequestTab 
        requireAuth={requireAuth} 
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
