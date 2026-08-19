"use client";

import React from "react";
import { Heart, MapPin, Phone, Printer, Mail, Sparkles, Target, MessageSquare, Award, Users, ShieldCheck, Navigation } from "lucide-react";
import { COMPANY_INFO, CLIENT_PARTNERS } from "../lib/constants";
import { getCustomClientAssetUrl } from "@/lib/r2-client-assets";

function BongdamMapGraphic() {
  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md select-none font-sans group">
      {/* Exact Real Naver Map Image uploaded by user */}
      <img
        src={getCustomClientAssetUrl("sotongcheum", "map-real.webp")}
        alt="소통과채움 동화길 51 지도 위치"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Subtle Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

      {/* Center Target Pin & Highlight Badge */}
      <div className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
        {/* Animated Pulse Halo */}
        <div className="absolute -top-2 w-16 h-16 bg-red-500/40 rounded-full animate-ping" />
        <div className="absolute top-1 w-10 h-10 bg-red-500/50 rounded-full animate-pulse" />

        {/* Floating Location Card Badge */}
        <div className="bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 mb-2 backdrop-blur-md">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div>
            <p className="text-xs font-black text-white leading-none">{COMPANY_INFO.name}</p>
            <p className="text-[10px] font-bold text-red-400 mt-1 leading-none">경기도 화성시 봉담읍 동화길 51, 401호</p>
          </div>
        </div>

        {/* Red Map Pin Icon */}
        <div className="relative">
          <MapPin className="w-10 h-10 text-red-600 fill-red-500 filter drop-shadow-2xl" />
        </div>
      </div>

      {/* Map Header Badges */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-black text-slate-800">화성시 봉담읍 동화길 51 네이버 지도</span>
      </div>

      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-black text-[#03C75A] flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#03C75A]" />
        <span>네이버 지도 정밀 좌표 연결</span>
        <Navigation size={13} />
      </div>

      {/* Bottom Overlay Hint */}
      <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-[11px] font-bold flex items-center gap-2 group-hover:bg-[#03C75A] transition-colors shadow-lg">
        <Navigation size={13} />
        <span>클릭 시 네이버 지도로 즉시 이동합니다</span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const coreValues = [
    {
      title: "소통",
      engTitle: "Communication",
      desc: "주민과 지역사회를 연결합니다.",
      color: "bg-blue-50/90 text-blue-600 border-blue-100",
      icon: <MessageSquare className="h-5 w-5" />,
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "채움",
      engTitle: "Value",
      desc: "행사에 가치와 감동을 더합니다.",
      color: "bg-emerald-50/90 text-emerald-600 border-emerald-100",
      icon: <Award className="h-5 w-5" />,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "공동체",
      engTitle: "Community",
      desc: "함께 성장하는 문화를 만듭니다.",
      color: "bg-indigo-50/90 text-indigo-600 border-indigo-100",
      icon: <Users className="h-5 w-5" />,
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "신뢰",
      engTitle: "Trust",
      desc: "안전하고 책임감 있게 운영합니다.",
      color: "bg-amber-50/90 text-amber-600 border-amber-100",
      icon: <ShieldCheck className="h-5 w-5" />,
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
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
            {/* Corporate Brand Emblem Visual (Left) */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border border-slate-800 shadow-2xl p-8 sm:p-10 flex flex-col justify-between items-center text-center relative overflow-hidden select-none">
                {/* Background Glow & Pattern */}
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-cyan-600/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top Badge */}
                <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">OFFICIAL BRAND EMBLEM</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* Center Brand Emblem & Logo */}
                <div className="relative z-10 my-auto flex flex-col items-center space-y-4">
                  {/* Official Speech-Bubble Heart Logo Icon Badge */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-2xl shadow-blue-500/30">
                    <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600/20 blur-md" />
                      <div className="relative flex items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                          <Heart className="w-7 h-7 fill-white text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      소통과 채움
                    </h3>
                    <p className="text-xs font-black tracking-widest text-cyan-400 uppercase mt-1">
                      SOTONG & CHEUM
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-bold border border-white/15 shadow-inner">
                    <Sparkles size={12} className="text-cyan-400" />
                    사람과 지역을 잇는 공동체 문화 플랫폼
                  </div>
                </div>

                {/* Bottom Enterprise Info */}
                <div className="relative z-10 w-full pt-4 border-t border-white/10 text-center">
                  <p className="text-[11px] font-bold text-slate-300">화성특례시 사회적경제 기업 &middot; 협동조합</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">지역사회와 함께 성장하는 행사 전문기업</p>
                </div>
              </div>
            </div>

            {/* Greeting Message */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-extrabold uppercase tracking-wider block w-fit mb-3">
                  <Sparkles size={13} />
                  소통으로 연결하고, 공동체의 가치를 채우다
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl leading-snug">
                  사람을 잇는 소통, <br />
                  <span className="text-blue-600">공동체 문화를 채우다</span>
                </h2>
                <p className="mt-3 text-sm font-bold text-slate-600">
                  지역과 사람을 연결하고 공동체 문화를 채우는 행사 전문기업, 소통과채움
                </p>
              </div>

              <div className="text-sm font-medium leading-relaxed text-slate-600 space-y-4 whitespace-pre-line border-t border-slate-100 pt-6">
                {COMPANY_INFO.greetings}
              </div>

              {/* CEO Info at the Very Bottom of Greetings Area */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">SOTONG & CHEUM CEO</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">대표이사 {COMPANY_INFO.ceo}</p>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">화성특례시 기반 지역 공동체 행사 전문기업</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-black text-slate-700">
                  소통과채움 협동조합
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden select-none">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Vision Card (With Custom AI Night Festival Background Image Inside Box - Center Aligned) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/20 p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-5 shadow-2xl relative overflow-hidden min-h-[380px]">
              {/* Background Photo Inside Vision Card */}
              <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                <img
                  src={getCustomClientAssetUrl("sotongcheum", "vision-bg.webp")}
                  alt="소통과채움 비전 배경"
                  className="w-full h-full object-cover object-center"
                />
                {/* Balanced Translucent Overlay for Full Image Visibility */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[0.5px]" />
              </div>

              {/* Card Content (Relative Z-10, Center Aligned Horizontally & Vertically) */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/25 text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-400/40 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  비전 (VISION)
                </div>
                <h3 className="text-2xl font-black text-white sm:text-3xl leading-snug drop-shadow-md">
                  지역과 사람을 연결하는 <br />
                  <span className="text-blue-400 bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">
                    공동체 문화 플랫폼
                  </span>
                </h3>
              </div>
              <p className="relative z-10 text-xs font-medium text-slate-200 leading-relaxed border-t border-white/15 pt-4 text-center max-w-sm mx-auto drop-shadow-sm">
                소통과채움은 단순한 행사 진행을 넘어, 주민과 지역사회가 참여와 공감을 통해 함께 성장하는 지속가능한 공동체 문화 생태계를 구축합니다.
              </p>
            </div>

            {/* Mission Card */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500" />
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-400/30 mb-5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  미션 (MISSION)
                </div>
                <h3 className="text-2xl font-black text-white sm:text-3xl">
                  소통과채움이 실현해 나가는 <span className="text-emerald-400">3대 미션</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4.5 sm:p-4 lg:p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">01</div>
                    <span className="text-[10px] font-bold text-blue-300/70 uppercase tracking-wider">MISSION 01</span>
                  </div>
                  <p className="text-xs sm:text-[11px] md:text-xs font-black text-white leading-snug whitespace-nowrap">주민이 참여하는 행사 문화 조성</p>
                  <p className="text-[11px] text-slate-300 leading-normal">주민이 스스로 주인이 되어 함께 즐기는 행사 기획</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4.5 sm:p-4 lg:p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">02</div>
                    <span className="text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider">MISSION 02</span>
                  </div>
                  <p className="text-xs sm:text-[11px] md:text-xs font-black text-white leading-snug whitespace-nowrap">지역의 가치를 발견하고 확산</p>
                  <p className="text-[11px] text-slate-300 leading-normal">지역 고유의 문화 자원과 스토리를 발굴</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4.5 sm:p-4 lg:p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-400/30">03</div>
                    <span className="text-[10px] font-bold text-indigo-300/70 uppercase tracking-wider">MISSION 03</span>
                  </div>
                  <p className="text-xs sm:text-[11px] md:text-xs font-black text-white leading-snug whitespace-nowrap">지속가능한 공동체 문화 형성</p>
                  <p className="text-[11px] text-slate-300 leading-normal">세대 간 갈등을 넘어 지속가능한 연대 형성</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Strip (Custom AI Real Images) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src={getCustomClientAssetUrl("sotongcheum", "biz-cultural-event.webp")}
                alt="공공행사 및 마을 축제 기획/운영"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest">FESTIVAL & EVENT</span>
                <p className="text-xs font-black text-white mt-0.5">공공행사 & 마을 축제 기획/운영</p>
              </div>
            </div>

            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src={getCustomClientAssetUrl("sotongcheum", "biz-local-autonomy.webp")}
                alt="주민 참여형 소통 축제 현장"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">COMMUNITY CULTURE</span>
                <p className="text-xs font-black text-white mt-0.5">주민 참여형 소통 축제 현장</p>
              </div>
            </div>

            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src={getCustomClientAssetUrl("sotongcheum", "biz-workshop.webp")}
                alt="감성 힐링 & 체험 교육 워크숍"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">HEALING EDUCATION</span>
                <p className="text-xs font-black text-white mt-0.5">감성 힐링 & 체험 교육 워크숍</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Section */}
      <section className="py-24 bg-slate-50/70 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 block mb-2">CORE VALUE</span>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              핵심가치 (Core Value)
            </h3>
            <p className="mt-3 text-sm font-extrabold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block border border-blue-100">
              소통과채움은 이 부분이 중요합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Real Photographic Header Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={v.image}
                    alt={v.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${v.color} shadow-md backdrop-blur-md`}>
                      {v.icon}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block">{v.engTitle}</span>
                    <h4 className="text-xl font-black text-white leading-tight mt-0.5">{v.title}</h4>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between text-center bg-white border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer (Client Partners) Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-black uppercase tracking-widest text-blue-600">
              OUR CLIENTS
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              소통과채움과 함께하는 <span className="text-blue-600">주요 고객사 & 협력 기관</span>
            </p>
            <p className="mt-4 text-md text-slate-500 font-semibold leading-relaxed">
              지자체, 공공기관, 주민자치회, 교육기관 및 유관 단체와 함께 신뢰와 가치를 채워가고 있습니다.
            </p>
          </div>

          {/* Grouped Clients Display */}
          <div className="space-y-12">
            {CLIENT_PARTNERS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <h3 className="text-base font-black text-slate-900">{group.category}</h3>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs font-bold text-slate-400">{group.items.length}개 기관</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {group.items.map((client, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-blue-300 px-4 py-3.5 rounded-2xl flex items-center justify-center text-center transition-all duration-200 hover:shadow-md group cursor-default"
                    >
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                        {client}
                      </span>
                    </div>
                  ))}
                </div>
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

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={COMPANY_INFO.naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#03C75A] hover:bg-[#02b351] py-3 px-4 text-xs font-black text-white transition-all shadow-md shadow-emerald-500/20 active:scale-95 duration-200"
                >
                  <Navigation size={15} />
                  네이버 지도 길찾기 & 바로보기
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(COMPANY_INFO.address);
                    alert("사무소 주소가 복사되었습니다!\n" + COMPANY_INFO.address);
                  }}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 py-3 px-4 text-xs font-black text-slate-700 transition-colors border border-slate-200"
                >
                  주소 복사
                </button>
              </div>
            </div>

            {/* Map Interactive Banner Card (Right) */}
            <div className="lg:col-span-8">
              <a
                href={COMPANY_INFO.naverMapUrl}
                target="_blank"
                rel="noreferrer"
                className="group w-full block rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <BongdamMapGraphic />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
