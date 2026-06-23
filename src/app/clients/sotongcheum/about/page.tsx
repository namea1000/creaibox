"use client";

import React from "react";
import { Heart, MapPin, Phone, Printer, Mail, Navigation } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function AboutPage() {
  const values = [
    {
      title: "따뜻한 소통",
      desc: "사람과 사람 사이의 벽을 허물고, 마음을 여는 소통을 추구합니다.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "행복한 채움",
      desc: "정성을 다하는 마음으로 공동체와 개인의 일상에 기쁨을 가득 채웁니다.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "함께하는 상생",
      desc: "화성시의 자랑스러운 사회적기업으로서 지역사회 공헌과 상생을 도모합니다.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <div className="bg-white">
      {/* Visual Header */}
      <section className="bg-gradient-to-b from-blue-50/30 to-white py-16 sm:py-20 border-b border-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            회사 소개
          </h1>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600">
            About Sotong & Cheum
          </p>
        </div>
      </section>

      {/* CEO Greetings */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CEO Profile Image / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 border border-slate-150 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="김정화 대표"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -right-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">CEO</p>
                  <p className="text-sm font-black text-slate-800 mt-1 leading-none">대표이사 {COMPANY_INFO.ceo}</p>
                </div>
              </div>
            </div>

            {/* Greeting Message */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
                소통을 이끌고 마음을 채우는 <br />
                <span className="text-blue-600">소통과채움 협동조합</span>입니다.
              </h2>
              <div className="text-sm font-semibold leading-relaxed text-slate-500 space-y-4 whitespace-pre-line">
                {COMPANY_INFO.greetings}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h3 className="text-base font-black uppercase tracking-widest text-blue-600">CORE VALUE</h3>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              소통과 채움이 지켜나가는 세 가지 가치
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center flex flex-col items-center gap-5"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${v.color} font-black text-lg`}>
                  0{i + 1}
                </div>
                <h4 className="text-lg font-black text-slate-800">{v.title}</h4>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xs">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Map */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Information (Left) */}
            <div className="lg:col-span-4 space-y-8 flex flex-col justify-center">
              <div>
                <h3 className="text-base font-black uppercase tracking-widest text-blue-600">LOCATION</h3>
                <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">찾아오시는 길</p>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-500">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">사무소 주소</p>
                    <p className="mt-1 leading-relaxed">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">대표전화</p>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="mt-1 block hover:text-blue-600 transition-colors">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Printer className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">팩스번호</p>
                    <p className="mt-1">{COMPANY_INFO.fax}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">이메일</p>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="mt-1 block hover:text-blue-600 transition-colors">
                      {COMPANY_INFO.email}
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
                네이버 지도에서 보기
              </a>
            </div>

            {/* Map Placeholder or Visual (Right) */}
            <div className="lg:col-span-8">
              <div className="w-full aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 border border-slate-150 shadow-md relative">
                {/* Simulated high-fidelity map card */}
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                  alt="지도 위치"
                  className="h-full w-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-blue-600/5 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm border border-slate-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
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
