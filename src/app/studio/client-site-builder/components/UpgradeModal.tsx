"use client";

import React from "react";
import { ShieldAlert, Check, ArrowLeft, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpgradeModal() {
  const router = useRouter();

  const benefits = [
    "AI 기반 블로그/웹사이트 크롤링 및 자동 홈페이지 기획",
    "워드프레스식 카테고리별 디자인 템플릿 제공 및 선언적 확장",
    "클라이언트 전용 격리 저장소 (WebP 최적화 업로드)",
    "방문객 입학/상담/견적문의 DB 연동 및 자동 유입 시스템",
    "구글 애널리틱스(GA4) 연동 및 일간 방문자(PV/UV) 트래픽 통계",
    "개인 독립 도메인(CNAME/A레코드) 연동 지원"
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 bg-zinc-100 dark:bg-[#06080d] select-none">
      <div className="relative overflow-hidden w-full max-w-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20 shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">
            PREMIUM ENTERPRISE SERVICE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Business 요금제 전용 서비스
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            AI 홈페이지 빌더 및 CMS 시스템은 **비즈니스(Business) 요금제** 이상의 고객님께만 제공하는 프리미엄 서비스입니다.
          </p>

          {/* Benefits Grid */}
          <div className="w-full max-w-md my-8 text-left border-t border-b border-slate-100 dark:border-slate-800/80 py-6 space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-bold leading-normal">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
            <button
              onClick={() => router.push("/studio")}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-sm font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>스튜디오 홈으로</span>
            </button>
            <a
              href="mailto:contact@creaibox.com?subject=[비즈니스 플랜 문의] AI 홈페이지 빌더 기능 문의"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>비즈니스 플랜 도입 문의</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
