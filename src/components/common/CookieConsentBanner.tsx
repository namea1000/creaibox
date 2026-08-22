"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // 0. 서브도메인 (*.creaibox.com, *.localhost) 및 클라이언트 커스텀 사이트(/clients/...)에서는 쿠키 배너 100% 숨김
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      // 메인 플랫폼 도메인 여부 체크
      const isMainDomain =
        hostname === "creaibox.com" ||
        hostname === "www.creaibox.com" ||
        hostname === "localhost" ||
        hostname === "127.0.0.1";

      const isClientSubpage = pathname.startsWith("/clients/");

      // 서브도메인이거나 클라이언트 커스텀 사이트인 경우 즉시 숨김 처리
      if (!isMainDomain || isClientSubpage) {
        setIsVisible(false);
        return;
      }
    }

    // 1. Check user login status and sync cookie preferences
    const initConsent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          // Query the user profiles database for persistent consent
          const { data: profile } = await supabase
            .from('profiles')
            .select('cookie_consent')
            .eq('id', user.id)
            .single();

          if (profile && profile.cookie_consent !== null) {
            // DB has a saved choice: Sync to local storage & cookie
            const localVal = profile.cookie_consent ? "accepted" : "rejected";
            localStorage.setItem("creaibox_cookie_consent", localVal);
            document.cookie = `cookie_consent=${localVal}; path=/; max-age=31536000; SameSite=Lax`;
            setIsVisible(false);
          } else {
            // DB has no choice yet: Check local storage
            const localVal = localStorage.getItem("creaibox_cookie_consent");
            if (localVal) {
              // Sync local choice back to DB
              setIsVisible(false);
              await supabase
                .from('profiles')
                .update({ cookie_consent: localVal === "accepted" })
                .eq('id', user.id);
            } else {
              // No choice anywhere: Show banner
              setIsVisible(true);
            }
          }
        } else {
          // Anonymous user: Check local storage only
          const localVal = localStorage.getItem("creaibox_cookie_consent");
          if (!localVal) {
            setIsVisible(true);
          }
        }
      } catch (err) {
        console.error("[CookieConsent] Failed to initialize cookie consent:", err);
        // Fallback: Check local storage to hide/show banner
        const localVal = localStorage.getItem("creaibox_cookie_consent");
        if (!localVal) {
          setIsVisible(true);
        }
      }
    };

    void initConsent();
  }, [supabase]);

  const handleConsentChoice = async (choice: 'accepted' | 'rejected') => {
    try {
      // 1. Save to local storage
      localStorage.setItem("creaibox_cookie_consent", choice);
      
      // 2. Set document cookie (expires in 1 year)
      document.cookie = `cookie_consent=${choice}; path=/; max-age=31536000; SameSite=Lax`;
      
      // 3. Close the banner smoothly
      setIsVisible(false);

      // 4. Sync to DB if logged in
      if (user) {
        await supabase
          .from('profiles')
          .update({ cookie_consent: choice === 'accepted' })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error("[CookieConsent] Failed to save consent choice:", err);
    }
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="쿠키 동의 설정"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[440px] max-w-[calc(100vw-2.5rem)] rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100/80 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="space-y-3.5">
        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
          크리에이박스는 여러분의 개인 정보를 소중히 여깁니다
        </h3>
        
        {/* Description */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
          당사의 웹사이트는 사이트의 원활한 작동과 사용자의 상호작용 데이터 수집, 그리고 마케팅 목적을 위해 필요한 쿠키를 사용합니다. 허용 시,{" "}
          <Link 
            href="/cookie-policy" 
            className="text-indigo-600 hover:text-indigo-700 font-bold underline decoration-indigo-300 underline-offset-2 transition-colors"
          >
            쿠키 정책
          </Link>
          에 명시된 대로 광고와 분석을 위한 쿠키 사용에 동의하게 됩니다.
        </p>

        {/* Buttons (3 actions: 모두 허용 / 모두 거부 / 쿠키 설정) */}
        <div className="pt-2 flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => void handleConsentChoice('accepted')}
            className="flex-1 py-2.5 sm:py-3 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold transition shadow-sm shadow-indigo-200 text-center cursor-pointer"
          >
            모두 허용
          </button>
          
          <button
            type="button"
            onClick={() => void handleConsentChoice('rejected')}
            className="flex-1 py-2.5 sm:py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-indigo-600 border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-bold transition text-center cursor-pointer"
          >
            모두 거부
          </button>

          <Link
            href="/cookie-policy"
            className="py-2.5 sm:py-3 px-3 rounded-2xl text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 text-xs sm:text-sm font-bold transition text-center cursor-pointer shrink-0"
          >
            쿠키 설정
          </Link>
        </div>
      </div>
    </aside>
  );
}

