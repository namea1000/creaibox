"use client";

import React, { useState } from "react";
import { ACHIEVEMENT_ITEMS } from "../lib/constants";
import { Award, GraduationCap, CheckCircle } from "lucide-react";

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "영재교/과고", "특목/자사고", "대입"];

  const filteredItems =
    activeTab === "전체"
      ? ACHIEVEMENT_ITEMS
      : ACHIEVEMENT_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="achievements" className="py-24 bg-white relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-base font-black uppercase tracking-widest text-indigo-600">
            ACHIEVEMENTS
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            명문교 합격 신화로 입증된 교육 성과
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            매년 영재교, 과학고, 자사고 및 명문대에 다수의 합격자를 배출하여 천안 최강의 진학률을 보여줍니다.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-xs font-black tracking-wide transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-102"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-150 transition-all duration-250 group relative overflow-hidden"
            >
              {/* Ribbon Decorative background */}
              <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-50/50 rounded-bl-3xl -z-10 group-hover:bg-indigo-50 transition-colors" />

              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                  {item.category === "대입" ? <GraduationCap size={22} /> : <Award size={22} />}
                </div>
                
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {item.year}학년도
                </span>

                <h3 className="text-md font-extrabold text-slate-800 tracking-tight mt-2 leading-snug">
                  {item.targetSchool}
                </h3>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-center gap-2">
                <span className="text-xs font-black text-slate-500">
                  {item.studentName} 학생
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600 border border-emerald-100 leading-none">
                  <CheckCircle size={8} />
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
