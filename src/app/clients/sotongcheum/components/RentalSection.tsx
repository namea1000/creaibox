"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RENTAL_ITEMS } from "../lib/constants";

export default function RentalSection() {
  return (
    <section id="rental" className="py-24 bg-slate-50/50 relative scroll-mt-20 border-y border-slate-100/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-blue-600">
            SYSTEM RENTAL
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            행사의 완성도를 높이는 완벽한 시스템 렌탈
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            축제, 체육대회, 기념식 등에 필요한 모든 전문 장비들을 철저한 점검을 거쳐 원스톱으로 제공합니다.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {RENTAL_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-lg transition-all duration-350 group"
            >
              {/* Thumbnail Container */}
              <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm text-slate-800 flex shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Text Area */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                      {item.engName}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200"
          >
            장비 렌탈 견적 문의하러 가기
            <span className="text-blue-600 font-extrabold">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
