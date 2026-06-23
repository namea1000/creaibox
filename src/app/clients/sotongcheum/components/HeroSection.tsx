"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

export default function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-24 sm:py-32">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6 opacity-30">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-400 to-emerald-400"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black text-blue-600 border border-blue-100/50 mb-8 animate-fade-in">
            <Sparkles size={12} />
            화성시 사회적경제 기업 &middot; 협동조합
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            소통과 채움으로 완성되는 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              특별한 순간
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-slate-500 font-semibold max-w-2xl mx-auto">
            공공행사 및 마을 축제 대행부터 마음을 치유하는 감성 교육 프로그램까지, <br className="hidden sm:inline" />
            풍부한 노하우를 바탕으로 처음부터 끝까지 깔끔하게 기획하고 대여해 드립니다.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black tracking-wide text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/15 hover:shadow-lg hover:shadow-blue-600/25 active:scale-95 duration-200"
            >
              <Calendar size={16} />
              무료 견적 & 컨설팅 신청
            </Link>
            <button
              onClick={() => handleScrollTo("business")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all active:scale-95 duration-200 shadow-sm"
            >
              사업 분야 보기
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Border Shape */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50/50 to-transparent -z-10" />
    </section>
  );
}
