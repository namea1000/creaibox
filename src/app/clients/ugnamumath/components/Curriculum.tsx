"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { CURRICULUM_ITEMS } from "../lib/constants";

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-24 bg-slate-50/50 relative scroll-mt-20 border-y border-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-indigo-600">
            CURRICULUM
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            수학·과학 전문 집중 교육과정
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            체계적인 레벨별 학습 로드맵과 1:1 대면 밀착 클리닉으로 취약점을 완벽히 해결합니다.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CURRICULUM_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="inline-block rounded-md bg-indigo-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                    {item.target}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-grow p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500 mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Details bullet points */}
                <ul className="space-y-3 pt-4 border-t border-slate-50">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-600 leading-normal">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
