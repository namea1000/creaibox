"use client";

import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
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
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] rounded-2xl bg-[#000B30]/95 border border-blue-900/40 p-5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/40 text-blue-400">
          <Cookie className="w-6 h-6 animate-pulse" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">쿠키 동의 설정 안내 🍪</h4>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            크리아이박스는 서비스 최적화, 기능 로딩, 개인화 경험 및 사이트 분석을 위해 쿠키를 사용합니다. 
            동의 여부에 따라 유해하지 않은 필수 분석 쿠키의 수집 상태가 제어됩니다. 
            회원님의 선택은 계정 프로필에 동기화되어 안전하게 유지됩니다.
          </p>

          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => void handleConsentChoice('rejected')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-800"
            >
              선택 거부
            </button>
            <button
              onClick={() => void handleConsentChoice('accepted')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/40 transition-all active:scale-[0.98]"
            >
              모든 쿠키 허용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
