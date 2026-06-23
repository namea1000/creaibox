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
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-black uppercase tracking-widest text-blue-600">
            BUSINESS AREA
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            소통과 채움의 주요 사업 영역
          </p>
          <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
            신뢰와 가치를 채우는 맞춤형 교육 서비스 및 고품격 행사 대행 서비스를 선보입니다.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BUSINESS_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content Container */}
              <div className="flex-grow p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500 mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-3 pt-4 border-t border-slate-50">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-600 leading-normal">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
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
