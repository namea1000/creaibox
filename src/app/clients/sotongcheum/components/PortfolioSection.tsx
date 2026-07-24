"use client";

import React, { useState } from "react";
import { PORTFOLIO_ITEMS } from "../lib/constants";
import { Calendar, Tag } from "lucide-react";

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "행사대행", "교육서비스", "가족캠프"];

  const filteredItems =
    activeTab === "전체"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="portfolio" className="py-24 bg-white relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-base font-black uppercase tracking-widest text-blue-600">
            PORTFOLIO
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            소통과 채움의 생생한 현장 실적
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            축제 기획부터 강사 출강, 렌탈 운영까지 성공적으로 진행했던 대표적인 사례들입니다.
          </p>
        </div>

        {/* Filtering Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-xs font-black tracking-wide transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10 scale-102"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1 rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black text-blue-600 shadow-sm border border-blue-50">
                  <Tag size={10} />
                  {item.category}
                </div>
              </div>

              {/* Text info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {item.date}
                  </span>
                  <span className="text-slate-300">소통과채움</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
