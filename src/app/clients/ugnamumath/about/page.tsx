"use client";

import React from "react";
import { GraduationCap, MapPin, Phone, Mail, Navigation, Star } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function AboutPage() {
  const philosophies = [
    {
      title: "스스로 생각하는 힘",
      desc: "공식 암기식 교육을 지양하고 개념을 탐구하여 '스스로 답을 도출하는 훈련'을 유도합니다.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "개념의 본질 학습",
      desc: "단순 양치기 문제 풀이가 아닌 하나의 오개념도 남기지 않는 본질적 학습을 지향합니다.",
      color: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      title: "오답의 완벽 추적 관리",
      desc: "매주 백지 테스트와 1:1 오답 첨삭 클리닉으로 구멍 난 지식을 즉각 보완합니다.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Title Header */}
      <section className="bg-gradient-to-b from-indigo-50/20 to-white py-16 sm:py-20 border-b border-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            학원 소개
          </h1>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-indigo-600">
            About Ugnamu Math & Science
          </p>
        </div>
      </section>

      {/* Director Greetings */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Director Visual */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 border border-slate-150 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                  alt="원장 인사말 비주얼"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Badge Overlay */}
              <div className="absolute -bottom-6 -right-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Director</p>
                  <p className="text-sm font-black text-slate-800 mt-1 leading-none">학원장 {COMPANY_INFO.ceo}</p>
                </div>
              </div>
            </div>

            {/* Greetings Content */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                아이들의 수학·과학적 잠재력을 깨우는 <br />
                <span className="text-indigo-600">{COMPANY_INFO.name}</span>입니다.
              </h2>
              <div className="text-sm font-semibold leading-relaxed text-slate-500 space-y-4 whitespace-pre-line">
                {COMPANY_INFO.greetings}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h3 className="text-base font-black uppercase tracking-widest text-indigo-600">PHILOSOPHY</h3>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              어그나무학원이 고집하는 3대 교육 원칙
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophies.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center flex flex-col items-center gap-5"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${p.color} font-black text-lg`}>
                  0{i + 1}
                </div>
                <h4 className="text-lg font-black text-slate-800">{p.title}</h4>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xs">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Directions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Address Details (Left) */}
            <div className="lg:col-span-4 space-y-8 flex flex-col justify-center">
              <div>
                <h3 className="text-base font-black uppercase tracking-widest text-indigo-600">LOCATION</h3>
                <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">학원 찾아오시는 길</p>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-500">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">학원 위치 주소</p>
                    <p className="mt-1 leading-relaxed">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">대표 상담 전화</p>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="mt-1 block hover:text-indigo-600 transition-colors">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(COMPANY_INFO.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-black text-white transition-all shadow-sm active:scale-95 duration-200"
              >
                <Navigation size={14} />
                네이버 지도에서 길찾기
              </a>
            </div>

            {/* Map visual simulator (Right) */}
            <div className="lg:col-span-8">
              <div className="w-full aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 border border-slate-150 shadow-md relative">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                  alt="지도 배경 이미지"
                  className="h-full w-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-indigo-600/5 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm border border-slate-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                      <MapPin className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{COMPANY_INFO.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{COMPANY_INFO.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
