"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";

export default function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white py-24 sm:py-32">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-10 opacity-25">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-400 to-sky-300"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-black text-indigo-600 border border-indigo-150 mb-8 animate-fade-in">
            <Sparkles size={12} />
            천안 불당 수학·과학 전문 교육기관
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            생각의 뿌리를 깊게, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
              학습의 나무를 곧게
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-slate-500 font-semibold max-w-2xl mx-auto">
            원리와 개념의 뿌리부터 흔들림 없이 깊게 세워 나갑니다. <br className="hidden sm:inline" />
            초/중/고 수학·과학 내신 1등급 도약부터 영재교, 과학고 입시 합격 신화까지 함께합니다.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-black tracking-wide text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/15 hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95 duration-200"
            >
              <GraduationCap size={16} />
              무료 입학 상담 신청
            </Link>
            <button
              onClick={() => handleScrollTo("branches")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-all active:scale-95 duration-200 shadow-sm"
            >
              3개관 안내 보기
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
