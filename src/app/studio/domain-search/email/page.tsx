"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import Link from "next/link";
import DomainTabHeader from "../components/DomainTabHeader";
import EmailForwardingManager from "../components/EmailForwardingManager";

export default function DomainEmailPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    void loadUser();
  }, [supabase]);

  const requireAuth = (action?: () => void): boolean => {
    if (!currentUser) {
      setShowLoginModal(true);
      return false;
    }
    if (action) action();
    return true;
  };

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- SECTION: 커스텀 이메일 연동 --- */}
        <EmailForwardingManager
          currentUser={currentUser}
          onRequireAuth={requireAuth}
        />
      </div>

      {/* Login Prompt Modal Popup */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-zinc-800 rounded-lg p-6 max-w-sm w-full text-center space-y-4 shadow-xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                로그인이 필요한 서비스입니다
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                커스텀 이메일 포워딩 주소를 등록하기 위해 로그인이 필요합니다.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login?redirect=/studio/domain-search/email"
                className="w-full inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                로그인 하러 가기
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
