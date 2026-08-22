"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { BUSINESS_ITEMS } from "../lib/constants";

export default function BusinessSection() {
  return (
    <section id="business" className="py-24 bg-white relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-blue-600">
            BUSINESS AREA
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            사람을 잇는 소통, <span className="text-blue-600">공동체 문화를 채우는 행사</span>
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            소통과채움은 문화행사, 기념식, 주민자치 사업, 한마음 체육대회, 성과공유회, 워크숍을 통해 <br className="hidden sm:inline" />
            지역과 사람을 연결하고 더 나은 공동체 문화를 만들어갑니다.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUSINESS_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-grow p-8 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold leading-relaxed text-slate-600 mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-3 pt-5 border-t border-slate-100">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="truncate whitespace-nowrap block">{detail}</span>
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
