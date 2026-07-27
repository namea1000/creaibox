"use client";

import React from "react";
import { Heart, MapPin, Phone, Printer, Mail, Sparkles, Target, MessageSquare, Award, Users, ShieldCheck, Navigation } from "lucide-react";
import { COMPANY_INFO, CLIENT_PARTNERS } from "../lib/constants";

function BongdamMapGraphic() {
  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md select-none font-sans group">
      {/* Exact Real Naver Map Image uploaded by user */}
      <img
        src="/images/clients/sotongcheum/sotongcheum_map_real.png"
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
            {/* CEO Profile Image / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 shadow-xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80"
                  alt="김정화 대표"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[11px] font-black text-blue-300 uppercase tracking-widest">SOTONG & CHEUM CEO</p>
                  <p className="text-xl font-extrabold mt-1">대표이사 {COMPANY_INFO.ceo}</p>
                  <p className="text-xs text-slate-200 mt-1 font-semibold">화성특례시 기반 지역 공동체 행사 전문기업</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute -bottom-5 -right-3 bg-white border border-slate-100 p-5 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">COMPANY SLOGAN</p>
                  <p className="text-xs font-black text-slate-900 mt-1 leading-tight">사람과 지역을 잇는 소통과채움</p>
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
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-400/30 mb-5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  비전 (VISION)
                </div>
                <h3 className="text-2xl font-black text-white sm:text-3xl leading-snug">
                  지역과 사람을 연결하는 <br />
                  <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-emerald-300 bg-clip-text text-transparent">
                    공동체 문화 플랫폼
                  </span>
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed border-t border-white/10 pt-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">01</div>
                  <p className="text-xs font-black text-white leading-snug">주민이 참여하는 행사 문화 조성</p>
                  <p className="text-[11px] text-slate-300 leading-normal">주민이 스스로 주인이 되어 함께 즐기는 행사 기획</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">02</div>
                  <p className="text-xs font-black text-white leading-snug">지역의 가치를 발견하고 확산</p>
                  <p className="text-[11px] text-slate-300 leading-normal">지역 고유의 고유 문화 자원과 스토리를 발굴</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-400/30">03</div>
                  <p className="text-xs font-black text-white leading-snug">지속가능한 공동체 문화 형성</p>
                  <p className="text-[11px] text-slate-300 leading-normal">세대 간 갈등을 넘어 지속가능한 연대 형성</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
                alt="공공행사 및 마을 축제 현장"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest">FESTIVAL & EVENT</span>
                <p className="text-xs font-black text-white mt-0.5">공공행사 & 마을 축제 기획/운영</p>
              </div>
            </div>

            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80"
                alt="주민 화합 공동체 행사"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">COMMUNITY CULTURE</span>
                <p className="text-xs font-black text-white mt-0.5">주민 참여형 소통 축제 현장</p>
              </div>
            </div>

            <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="임직원 및 조직 힐링 교육 프로그램"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
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
