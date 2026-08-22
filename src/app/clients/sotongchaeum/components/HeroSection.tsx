"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

import { getCustomClientAssetUrl } from "@/lib/r2-client-assets";

export default function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[580px] sm:min-h-[680px] flex items-center justify-center py-28 sm:py-36 bg-slate-100 text-white select-none border-b border-slate-200">
      {/* Full-Bleed Background Photo (Bright Natural Visual without dark overlay) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={getCustomClientAssetUrl("sotongchaeum", "hero-bg.webp")}
          alt="소통과 채움 축제 행사 배경"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Glassmorphic Centered Card Backdrop Container for Ultra-High Legibility */}
        <div className="mx-auto max-w-3xl text-center bg-slate-950/75 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-black text-blue-300 border border-blue-400/30 mb-6 sm:mb-8 shadow-inner">
            <Sparkles size={13} className="text-blue-400" />
            화성시 사회적경제 기업 &middot; 협동조합
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            소통과 채움으로 완성되는 <br />
            <span className="text-cyan-400 drop-shadow-md">특별한 순간</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-200 font-bold max-w-2xl mx-auto">
            공공행사 및 마을 축제 대행부터 마음을 치유하는 감성 교육 프로그램까지, <br className="hidden sm:inline" />
            풍부한 노하우를 바탕으로 처음부터 끝까지 깔끔하게 기획하고 대여해 드립니다.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6 flex-wrap gap-y-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-black tracking-wide text-white transition-all shadow-xl shadow-blue-600/30 active:scale-95 duration-200 cursor-pointer border border-blue-400/40"
            >
              <Calendar size={16} />
              무료 견적 & 컨설팅 신청
            </Link>
            <button
              onClick={() => handleScrollTo("business")}
              className="flex items-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-white transition-all active:scale-95 duration-200 shadow-md cursor-pointer"
            >
              사업 분야 보기
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
