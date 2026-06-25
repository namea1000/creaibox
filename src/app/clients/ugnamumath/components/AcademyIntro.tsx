"use client";

import React from "react";
import { Award } from "lucide-react";
import { ACADEMY_BRANCHES } from "../lib/constants";

export default function AcademyIntro() {
  return (
    <section id="branches" className="py-24 bg-white relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-indigo-600">
            OUR BRANCHES
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            체계적으로 분화된 어그나무 3개 관 시스템
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            초등 기초부터 고등 수능 및 영재 입시까지, 전문화된 지도가 개별 관 시스템 아래 펼쳐집니다.
          </p>
        </div>

        {/* 3-Column Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACADEMY_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Image & License Badge */}
              <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={branch.imageUrl}
                  alt={branch.name}
                  className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black text-indigo-600 shadow-sm border border-indigo-50">
                  <Award size={10} />
                  {branch.licenseNumber}
                </div>
              </div>

              {/* Text info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-500">
                    {branch.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
