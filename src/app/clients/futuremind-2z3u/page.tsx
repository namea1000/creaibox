"use client";

import React, { useState } from "react";
import Link from "@/components/common/SmartIntentLink";
import {
  ArrowRight,
  GraduationCap,
  Code2,
  Lightbulb,
  CheckCircle2,
  Send,
  Building2,
  Rocket,
  HeartHandshake,
  Check,
  BookOpen,
  Users,
  Sparkles,
  Globe,
  Shield,
  Layers,
  LayoutGrid,
  MapPin,
} from "lucide-react";

const R2_VIDEO_URL = "https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/hero-video.mp4";

interface PartnerItem {
  name: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  iconType: string;
}

const PARTNERS_DATA: PartnerItem[] = [
  { name: "호서대학교", category: "UNIVERSITY", badgeBg: "bg-blue-600", badgeText: "text-white", iconType: "hoseo" },
  { name: "한국콘텐츠진흥원", category: "GOVERNMENT", badgeBg: "bg-rose-500", badgeText: "text-white", iconType: "kocca" },
  { name: "통일부", category: "MINISTRY", badgeBg: "bg-blue-700", badgeText: "text-white", iconType: "korea_gov" },
  { name: "충청남도", category: "GOVERNMENT", badgeBg: "bg-emerald-600", badgeText: "text-white", iconType: "chungnam" },
  { name: "소상공인시장진흥공단", category: "PUBLIC AGENCY", badgeBg: "bg-amber-600", badgeText: "text-white", iconType: "semas" },
  { name: "백석문화대학교", category: "UNIVERSITY", badgeBg: "bg-teal-600", badgeText: "text-white", iconType: "baekseok_c" },
  { name: "백석대학교", category: "UNIVERSITY", badgeBg: "bg-indigo-700", badgeText: "text-white", iconType: "baekseok" },
  { name: "단국대학교", category: "UNIVERSITY", badgeBg: "bg-sky-700", badgeText: "text-white", iconType: "dankook" },
  { name: "남서울대학교", category: "UNIVERSITY", badgeBg: "bg-red-800", badgeText: "text-white", iconType: "namseoul" },
  { name: "충남창업보육협회", category: "ASSOCIATION", badgeBg: "bg-cyan-600", badgeText: "text-white", iconType: "startup" },
  { name: "백석메이커스", category: "INNOVATION", badgeBg: "bg-violet-600", badgeText: "text-white", iconType: "makers" },
];

function PartnerLogoIcon({ type }: { type: string }) {
  switch (type) {
    case "hoseo":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#004a99" />
          <path d="M9 8h4v6h6V8h4v16h-4v-6h-6v6H9V8z" fill="#fff" />
          <circle cx="16" cy="16" r="2.5" fill="#f58220" />
        </svg>
      );
    case "kocca":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#e30613" />
          <path d="M22 10a8 8 0 0 0-12 6.9 8 8 0 0 0 12 6.9v-3.5a4.5 4.5 0 0 1-6.8-3.4 4.5 4.5 0 0 1 6.8-3.4V10z" fill="#fff" />
          <circle cx="21" cy="16.5" r="2" fill="#009fe3" />
        </svg>
      );
    case "korea_gov":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M16 5a11 11 0 0 1 0 22 11 11 0 0 1 0-22z" fill="#003478" />
          <path d="M16 5a11 11 0 0 1 11 11c0 3-1.2 5.8-3.2 7.8A5.5 5.5 0 0 0 16 16a5.5 5.5 0 0 1-5.5-5.5A11 11 0 0 1 16 5z" fill="#c60c30" />
          <circle cx="16" cy="16" r="2" fill="#fff" opacity="0.3" />
        </svg>
      );
    case "chungnam":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#009640" />
          <path d="M16 7c-4 5-8 9-4 15 3-2 6-4 4-9 4 3 6 6 4 9 4-6 0-10-4-15z" fill="#fff" />
          <circle cx="16" cy="14" r="3" fill="#ffcc00" />
        </svg>
      );
    case "semas":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#ea580c" />
          <path d="M10 20c3-6 9-6 12 0-3 3-9 3-12 0z" fill="#fff" />
          <circle cx="16" cy="12" r="3.5" fill="#38bdf8" />
        </svg>
      );
    case "baekseok_c":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#0d9488" />
          <path d="M8 12l8-5 8 5-8 5-8-5z" fill="#fff" />
          <path d="M11 15.5v5.5c0 2.8 2.2 5 5 5s5-2.2 5-5v-5.5l-5 3.1-5-3.1z" fill="#ccfbf1" />
        </svg>
      );
    case "baekseok":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#1e3a8a" />
          <path d="M16 6l9 6v10l-9 5-9-5V12l9-6z" fill="#facc15" />
          <path d="M16 9l6 4v7l-6 3.5-6-3.5V13l6-4z" fill="#1e3a8a" />
          <circle cx="16" cy="16.5" r="2" fill="#fff" />
        </svg>
      );
    case "dankook":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#0284c7" />
          <path d="M10 9h6a7 7 0 0 1 0 14h-6V9zm4 3.5v7h2a3.5 3.5 0 0 0 0-7h-2z" fill="#fff" />
          <path d="M21 9h2v14h-2z" fill="#e0f2fe" />
        </svg>
      );
    case "namseoul":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#881337" />
          <circle cx="16" cy="16" r="11" stroke="#fff" strokeWidth="2" fill="none" />
          <path d="M12 10h3l5 8V10h3v12h-3l-5-8v8h-3V10z" fill="#fff" />
        </svg>
      );
    case "startup":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#0891b2" />
          <path d="M16 7c2 2 5 6 5 10l-5 4-5-4c0-4 3-8 5-10z" fill="#fff" />
          <circle cx="16" cy="13" r="2" fill="#f43f5e" />
          <path d="M11 21l-3 4 5-1 3-3zM21 21l3 4-5-1-3-3z" fill="#fbbf24" />
        </svg>
      );
    case "makers":
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" fill="none">
          <circle cx="16" cy="16" r="15" fill="#7c3aed" />
          <path d="M9 11l7-4 7 4v10l-7 4-7-4V11z" fill="#fff" />
          <path d="M16 7v18M9 11l14 10M23 11L9 21" stroke="#7c3aed" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-neutral-950 font-black text-xs">
          ★
        </div>
      );
  }
}

export default function FuturemindCyanHomePage() {
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", category: "교육" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="w-full space-y-24 pb-0">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (가로 전체가 꽉 찬 풀스크린 고화질 3D 비디오 플레이어) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden px-5 sm:px-8">
        
        {/* Full-Width Video Background Layer (z-0으로 확실하게 배경 전면 노출) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={R2_VIDEO_URL}
          />
          {/* Subtle Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/25 pointer-events-none" />
        </div>

        {/* Center Typography (relative z-10 & Wide 2-Line Title & Subtitle) */}
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10 py-16">
          
          {/* Giant Hero Headline (Strictly 2 Lines) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2] drop-shadow-lg">
            AI라는 경계 없는 마음 하나로,<br />
            <span className="text-cyan-400 drop-shadow-sm">
              시간과 공간을 넘어 모든 것을 연결시킵니다
            </span>
          </h1>

          {/* Sub Copy (Strictly 2 Lines) */}
          <div className="text-sm sm:text-lg lg:text-xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md space-y-1">
            <p>끝없이 펼쳐지는 배움의 세계, <strong className="text-white font-bold">미래교육문화협회(퓨처마인드)</strong>가 그 문을 엽니다.</p>
            <p className="text-white/85">대기업부터 창업자, 공공기관, 전 세대의 미래를 위한 엔터프라이즈급 AI 대전환을 완성합니다.</p>
          </div>

          {/* Action CTA Buttons (각진 모던 스타일) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/work"
              className="w-full sm:w-auto px-9 py-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-black text-sm sm:text-base rounded-lg transition-all duration-200 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>서비스 알아보기</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#contact"
              className="w-full sm:w-auto px-9 py-4 bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-600 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 backdrop-blur-md shadow-lg"
            >
              <span>무료 컨설팅 신청</span>
            </Link>
          </div>

          {/* 3 Core Pillars Rectangular Tech Boxes (각진 스타일 & 큼직한 폰트) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-4xl mx-auto">
            <div className="px-5 py-3.5 rounded-lg bg-neutral-950/80 border border-neutral-700/80 hover:border-cyan-400/60 backdrop-blur-md shadow-xl transition-all text-left flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div className="text-xs sm:text-sm text-neutral-200">
                <span className="text-neutral-400 text-[11px] block font-mono">SOLUTION</span>
                <span>기술을 위한 <strong className="text-cyan-400 font-bold">AI 솔루션</strong></span>
              </div>
            </div>

            <div className="px-5 py-3.5 rounded-lg bg-neutral-950/80 border border-neutral-700/80 hover:border-cyan-400/60 backdrop-blur-md shadow-xl transition-all text-left flex items-center gap-3">
              <span className="text-xl">📈</span>
              <div className="text-xs sm:text-sm text-neutral-200">
                <span className="text-neutral-400 text-[11px] block font-mono">CONSULTING</span>
                <span>조직 성장을 위한 <strong className="text-cyan-400 font-bold">AI 컨설팅</strong></span>
              </div>
            </div>

            <div className="px-5 py-3.5 rounded-lg bg-neutral-950/80 border border-neutral-700/80 hover:border-cyan-400/60 backdrop-blur-md shadow-xl transition-all text-left flex items-center gap-3">
              <span className="text-xl">🎓</span>
              <div className="text-xs sm:text-sm text-neutral-200">
                <span className="text-neutral-400 text-[11px] block font-mono">EDUCATION</span>
                <span>미래를 준비하는 <strong className="text-cyan-400 font-bold">AI 실전교육</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BUSINESS COVERAGE SECTION (우리는 비즈니스의 모든 분야를 아우릅니다 - 미드나잇 딥네이비 테마 & 가운데 정렬) */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-b from-[#090d18] via-[#0c1222] to-[#090d18] border-y border-cyan-900/30 py-20 lg:py-28 px-6 sm:px-8 shadow-2xl">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          {/* Main Giant Headline (Centered) */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25]">
            우리는 <span className="text-cyan-400">비즈니스</span>의<br />
            모든 <span className="text-cyan-400">분야</span>를 아우릅니다.
          </h2>

          {/* Body Paragraphs (Centered) */}
          <div className="space-y-6 text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto font-normal">
            
            <p className="leading-relaxed">
              비즈니스의 모든 분야에 걸친 <strong className="text-cyan-400 font-bold">어제의 지혜</strong>와 <strong className="text-cyan-400 font-bold">내일의 가능성</strong>을 잇습니다.
            </p>

            <p className="leading-relaxed">
              <strong className="text-cyan-400 font-bold">대기업 · 관공서</strong>의 조직의 혁신은 지나온 길의 축적이며,<br />
              <strong className="text-cyan-400 font-bold">예비 · 초기 창업자</strong>의 도약은 새로운 시작의 설렘입니다.
            </p>

            <p className="leading-relaxed pt-2">
              이 모든 여정은 모든 세대인 <strong className="text-cyan-400 font-bold">대학 · 청소년 · 노인</strong>의 삶을 위해 존재합니다.
            </p>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE SERVICE PILLARS (01 AI 개발 / 02 AI컨설팅 / 03 AI교육 - 원본 1:1 포토 카드) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            핵심 서비스 영역
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            기업의 AI 전환을 위한 3가지 축, 퓨처마인드가 완벽하게 지원합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 01 AI 개발 (대기업/관공서) */}
          <Link
            href="/development"
            className="p-7 sm:p-8 rounded-lg bg-[#111622] border border-[#1e293b] hover:border-cyan-400/60 transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">01</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight group-hover:text-cyan-300 transition-colors">AI 개발</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-bold text-cyan-400">대기업/관공서</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">기관과 기업을 위한 AI 솔루션</p>
              </div>
            </div>

            {/* Photo Box (각진 스퀘어) */}
            <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full mt-2 group-hover:scale-[1.02] transition-transform">
              <img
                src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/core-01-development.jpg"
                alt="01 AI 개발 - 대기업/관공서 솔루션"
                className="w-full h-full object-cover brightness-105"
              />
            </div>
          </Link>

          {/* Card 2: 02 AI 컨설팅 (예비/초기 창업자) */}
          <Link
            href="/planning"
            className="p-7 sm:p-8 rounded-lg bg-[#111622] border border-[#1e293b] hover:border-cyan-400/60 transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">02</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight group-hover:text-cyan-300 transition-colors">AI 컨설팅</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-bold text-cyan-400">예비/초기 창업자</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  브랜드부터 블렌딩까지<br />
                  창업자를 위한 AI 원스톱 바우처
                </p>
              </div>
            </div>

            {/* Photo Box (각진 스퀘어) */}
            <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full mt-2 group-hover:scale-[1.02] transition-transform">
              <img
                src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/core-02-consulting.jpg"
                alt="02 AI 컨설팅 - 예비/초기 창업자 바우처"
                className="w-full h-full object-cover brightness-105"
              />
            </div>
          </Link>

          {/* Card 3: 03 AI 교육 (대학/청소년/노인 학생/초중고/주민을 위한) */}
          <Link
            href="/education"
            className="p-7 sm:p-8 rounded-lg bg-[#111622] border border-[#1e293b] hover:border-cyan-400/60 transition-all duration-300 space-y-6 flex flex-col justify-between group shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">03</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight group-hover:text-cyan-300 transition-colors">AI 교육</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-bold text-cyan-400">대학/청소년/노인 학생/초중고/주민을 위한</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">생애전주기 AI 교육</p>
              </div>
            </div>

            {/* Photo Box (각진 스퀘어) */}
            <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full mt-2 group-hover:scale-[1.02] transition-transform">
              <img
                src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/core-03-education.jpg"
                alt="03 AI 교육 - 생애전주기 AI 교육"
                className="w-full h-full object-cover brightness-105"
              />
            </div>
          </Link>

        </div>

        {/* 3 Detailed Category Identity Cyan-Line Cards (로고 우측 대형 타이틀 인라인 레이아웃) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* 1. 개발 */}
          <Link
            href="/development"
            className="p-8 rounded-lg bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 space-y-6 shadow-2xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="space-y-6 relative z-10">
              {/* Header: Icon + Title Inline (로고 오른쪽 대형 폰트 배치) */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Code2 size={28} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                    개발
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  기관과 기업을 위한 맞춤형 AI 시스템 솔루션
                </p>
              </div>

              {/* Rich Tech Chips Grid (순수 한글 칩 구조) */}
              <div className="space-y-4 pt-2">
                
                {/* 플랫폼 구축 */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 플랫폼 구축
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["웹·앱 디자인", "AI 챗봇 엔진", "AR 키오스크"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 스마트 시스템 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 스마트 시스템
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["맞춤형 ERP", "통합 CMS", "스마트팩토리"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 콘텐츠 솔루션 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 콘텐츠 솔루션
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["AR 게임 엔진", "AI 비전 솔루션", "미디어 파사드"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-neutral-800/80 relative z-10">
              <div className="w-full py-2.5 px-4 rounded-md bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 group-hover:border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center justify-between transition-all">
                <span>10대 개발 영역 상세 가이드</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 2. 컨설팅 */}
          <Link
            href="/planning"
            className="p-8 rounded-lg bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 space-y-6 shadow-2xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="space-y-6 relative z-10">
              {/* Header: Icon + Title Inline (로고 오른쪽 대형 폰트 배치) */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Lightbulb size={28} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                    컨설팅
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  브랜드부터 블렌딩까지, 창업자를 위한 AI 원스톱 바우처
                </p>
              </div>

              {/* Rich Tech Chips Grid (순수 한글 칩 구조) */}
              <div className="space-y-4 pt-2">
                
                {/* 홍보 & 마케팅 제휴 */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 홍보 & 마케팅 제휴
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["실전 퍼포먼스 마케팅", "인플루언서 제휴", "90일 매출 퍼널"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 브랜딩 & 디자인 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 브랜딩 & 디자인
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["전문 디자이너 설계", "전환율 UI/UX 최적화", "브랜드 아이덴티티"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 자금 유치 & 지식재산권 판로 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 자금 유치 & 판로 지원
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["R&D 바우처 기획", "공공조달 입찰", "변리사 매칭 지원"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-neutral-800/80 relative z-10">
              <div className="w-full py-2.5 px-4 rounded-md bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 group-hover:border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center justify-between transition-all">
                <span>정부지원사업 기획 보기</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 3. 교육 */}
          <Link
            href="/education"
            className="p-8 rounded-lg bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 space-y-6 shadow-2xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="space-y-6 relative z-10">
              {/* Header: Icon + Title Inline (로고 오른쪽 대형 폰트 배치) */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                    교육
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  생애전주기 맞춤형 AI 실전교육 및 4차산업 체험
                </p>
              </div>

              {/* Rich Tech Chips Grid (순수 한글 칩 구조) */}
              <div className="space-y-4 pt-2">
                
                {/* 창업 & 대학 맞춤 */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 창업 & 대학 교육
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["AI 평생교육원 운영", "대학 맞춤형 캠프", "임직원 역량강화"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 체험 & 메이커스 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 체험 & 메이커스
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["어울림 메이커스", "전국 이동형 캠프", "생성형 AI 실습"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 전세대 생애주기 */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> 전 세대 맞춤 케어
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["초중고 미래 캠프", "시니어 디지털 교육", "AI 실무 역량 인증"].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-sm bg-neutral-900/90 border border-neutral-800 text-[11px] font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-neutral-800/80 relative z-10">
              <div className="w-full py-2.5 px-4 rounded-md bg-cyan-500/10 group-hover:bg-cyan-500/20 border border-cyan-500/20 group-hover:border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center justify-between transition-all">
                <span>생애전주기 교육 커리큘럼 보기</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ASSOCIATION ROLES & FUNCTIONS (미래교육문화협회 5대 주요 역할 - 5단 가로 대형 포토 와이드 카드) */}
      {/* ========================================================================= */}
      <section id="association" className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles size={13} />
            <span>ASSOCIATION ROLES & MISSION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            미래교육문화협회
          </h2>
          <p className="text-sm sm:text-base text-cyan-300 font-medium max-w-3xl mx-auto leading-relaxed">
            4차 산업 혁명 시대에 맞춰 교육과 문화의 융합을 통해 미래 인재를 양성하고,<br className="hidden sm:inline" />
            기술과 창의성을 결합한 다양한 프로그램을 운영하는 비영리 단체입니다.
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed pt-1">
            지역사회와 전국적으로 혁신적인 교육 경험을 제공하며, 미래세대를 위한 체험형 교육을 통해 창의력과 기술적 역량을 키우는 것을 목표로 합니다.
          </p>

          {/* Quick Sub-Section Navigation Pills */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <a
              href="#association"
              className="px-4 py-1.5 rounded-sm bg-cyan-500 text-neutral-950 text-xs font-black hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
            >
              주요 역할 및 기능
            </a>
            <a
              href="#visiting-edu"
              className="px-4 py-1.5 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-500/40 text-xs font-bold transition-all"
            >
              방문 교육
            </a>
          </div>
        </div>

        {/* 5 Giant Horizontal Photo Cards (좌측 글씨 + 우측 고화질 이미지) */}
        <div className="space-y-6">
          
          {/* Card 01: 4차 산업 체험 교육 프로그램 운영 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Typography & Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 flex-shrink-0">
                    01
                  </span>
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">KEY ROLE 01</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      4차 산업 체험 교육 프로그램 운영
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  드론, 로봇, VR/AR 등 4차 산업 기술을 직접 만지고 조종하며 배우는 실감형 교육 프로그램을 운영합니다. 최신 기술에 대한 호기심과 이해를 높이고, 창의적·융합적 사고를 키우는 실전 체험의 장을 제공합니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["드론 비행 & 군집 코딩", "로봇 자율주행 제어", "VR/AR 실감체험", "메이커스 창작 실습"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/role-01-experience.jpg"
                    alt="4차 산업 체험 교육 프로그램 운영"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 02: 지역사회 교육 활성화 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Typography & Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 flex-shrink-0">
                    02
                  </span>
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Users size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">KEY ROLE 02</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      지역사회 교육 활성화
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  지역사회와 협력하여 도서·산간 및 교육 소외지역까지 직접 찾아가는 이동형 4차 산업 체험 버스와 힐링 캠프를 운영합니다. 모든 계층의 주민들이 최신 디지털 기술을 평등하게 배우고 즐길 수 있도록 돕습니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["이동형 힐링 버스", "지역 주민 디지털 역량", "지자체 연계 캠프", "교육 격차 해소"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/role-02-community.jpg"
                    alt="지역사회 교육 활성화"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 03: 미래 인재 양성 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Typography & Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 flex-shrink-0">
                    03
                  </span>
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Lightbulb size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">KEY ROLE 03</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      미래 인재 양성
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  초중고 청소년부터 대학생, 신중년에 이르기까지 전 연령층을 위한 맞춤형 AI·SW 심화 교육 프로그램을 제공합니다. 단순 주입식 학습이 아닌, 실제 비즈니스와 사회 현장에서 요구되는 실무 문제 해결 능력을 육성합니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["초중고 미래 캠프", "대학 산학 프로젝트", "임직원 AI 리스킬링", "실무 문제해결"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/role-03-talent.jpg"
                    alt="미래 인재 양성"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 04: 문화와 기술의 융합 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Typography & Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 flex-shrink-0">
                    04
                  </span>
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">KEY ROLE 04</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      문화와 기술의 융합
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  단순한 공학 기술을 넘어 예술·문화 콘텐츠와 결합한 창의적 융합 프로젝트를 기획합니다. 미래 세대가 예술적 감수성과 테크 역량을 동시에 갖춘 창의 인재로 도약하도록 지원합니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["문화·예술 콘텐츠 융합", "인터랙티브 미디어", "창의 융합 프로젝트", "감성 테크 교육"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/role-04-culture.jpg"
                    alt="문화와 기술의 융합"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 05: 사회문제 해결을 위한 실감형 교육 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Typography & Badges */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 flex-shrink-0">
                    05
                  </span>
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Shield size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">KEY ROLE 05</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      사회문제 해결을 위한 실감형 교육
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  환경, 안전, 보건, 고령화 등 우리 사회가 직면한 다양한 과제를 4차 산업 실감형 교육으로 해결합니다. 학생들이 기술을 통해 사회적 가치를 창출하는 책임감 있는 미래 시민으로 성장하도록 이끕니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["사회문제 해결 프로젝트", "안전·환경 체감 교육", "공공 가치 실현", "디지털 시민의식"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/role-05-society.jpg"
                    alt="사회문제 해결을 위한 실감형 교육"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ASSOCIATION VISITING EDUCATION (미래교육문화협회 방문 교육 - 2대 대형 포토 와이드 박스) */}
      {/* ========================================================================= */}
      <section id="visiting-edu" className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <MapPin size={13} />
            <span>OUTREACH & VISITING EDUCATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            미래교육문화협회 <span className="text-cyan-400">방문 교육</span>
          </h2>
          <p className="text-sm sm:text-base text-cyan-300 font-medium max-w-3xl mx-auto leading-relaxed">
            미래교육문화협회와 제휴하여 지역 주민들을 위한 이동형 4차산업 체험 교육프로그램을 제공합니다.<br className="hidden sm:inline" />
            지역 내 다양한 공간에서 일상생활과 가까운 곳에서 4차 산업 기술을 실감형으로 체험할 수 있는 특별한 기회를 선사합니다.
          </p>
        </div>

        {/* 2 Giant Horizontal Photo Cards (2대 대형 와이드 박스) */}
        <div className="space-y-8">
          
          {/* Visiting Card 1: 찾아가는 방문 서비스 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left: Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">VISITING SERVICE 01</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      찾아가는 방문 서비스
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  퓨처마인드는 지역 행사, 축제, 학교, 커뮤니티 공간으로 직접 찾아가 실감형 4차 산업 체험 교육을 제공합니다. 지리적·환경적 제약 없이 지역 주민과 학생들이 첨단 미래 기술을 가장 가까이에서 체험하고 배울 수 있는 열린 배움 환경을 조성합니다.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
                  {["지역 축제 & 페스티벌", "초·중·고 찾아가는 교실", "커뮤니티 센터 & 도서관", "지자체 맞춤형 현장 캠프", "소외계층 디지털 나눔"].map((tag, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-sm bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/visit-01-mobile.jpg"
                    alt="찾아가는 방문 서비스"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visiting Card 2: 4차산업 실감형 행사/축제/체험교육 */}
          <div className="p-8 sm:p-10 lg:p-12 rounded-lg bg-gradient-to-r from-[#0d1627] via-[#091120] to-[#0d1627] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/20 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left: Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 flex-shrink-0">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-extrabold text-cyan-400 block">FESTIVAL & ACADEMY 02</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                      4차산업 실감형 행사 · 축제 · 체험교육
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                  드론, VR/AR, 로봇 등 4차 산업 기술을 활용한 다채로운 실습 체험 활동이 총망라되어 있습니다. 참가자들은 미래 기술의 무한한 가능성을 직접 오감으로 확인하며, 미래 사회를 주도할 창의적 기술 사고력을 함양합니다.
                </p>

                {/* 4 Key Checkpoints List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
                  {[
                    "드론 조종 및 자율 프로그래밍 체험",
                    "VR/AR 메타버스 실감형 몰입 체험",
                    "로봇 자율 코딩 및 인터랙티브 제어 실습",
                    "AI 생성형 기술 응용 실전 워크숍",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-sm bg-neutral-950/70 border border-neutral-800/90 text-xs text-neutral-200">
                      <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: High-Res Photo Frame */}
              <div className="lg:col-span-5">
                <div className="rounded-md overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[16/10] w-full shadow-2xl group-hover:scale-[1.02] transition-transform">
                  <img
                    src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/visit-02-festival.jpg"
                    alt="4차산업 실감형 행사/축제/체험교육"
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* ========================================================================= */}
      {/* 4. WE WORK & MISSION */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3.5 py-1.5 rounded-sm border border-cyan-500/20">
            WE WORK & MISSION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            비즈니스의 모든 분야에 걸친<br />
            어제의 지혜와 내일의 가능성을 잇습니다
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            대기업과 관공서의 축적된 혁신부터 예비·초기 창업자의 설렘, 모든 세대의 미래를 위해 존재합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-lg bg-[#141414] border border-neutral-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Building2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">대기업 · 관공서</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              조직의 혁신은 지나온 길의 축적입니다. 기관 맞춤형 AI 솔루션 및 경영 자동화 시스템을 구축합니다.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-[#141414] border border-neutral-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Rocket size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">예비 · 초기 창업자</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              도약은 새로운 시작의 설렘입니다. 브랜드부터 블렌딩까지 정부지원 바우처 및 IP 로드맵을 제공합니다.
            </p>
          </div>

          <div className="p-8 rounded-lg bg-[#141414] border border-neutral-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">대학 · 청소년 · 신중년</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              모든 여정은 삶을 위해 존재합니다. 전 생애주기 맞춤형 AI 역량 강화 교육과 미래 일자리 체험을 운영합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPERIENTIAL CAMP (어울림 메이커스 & 4차산업 실감체험) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-cyan-900/30 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              EXPERIENTIAL INNOVATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              4차산업 실감 체험 힐링캠프 & 어울림 메이커스
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              드론, VR/AR, 로봇을 직접 조종하며 배우는 미래 기술 놀이터! 학교 운동장과 마을 축제까지 찾아가는 이동형 버스 가동.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-md bg-black/60 border border-neutral-800 space-y-1">
              <span className="font-bold text-cyan-400">🛸 드론 경기장</span>
              <p className="text-neutral-400 text-[11px]">드론 조종 및 물류 배송 코딩</p>
            </div>
            <div className="p-4 rounded-md bg-black/60 border border-neutral-800 space-y-1">
              <span className="font-bold text-cyan-400">👓 VR/AR 존</span>
              <p className="text-neutral-400 text-[11px]">AR 서바이벌 및 몰입 체험</p>
            </div>
            <div className="p-4 rounded-md bg-black/60 border border-neutral-800 space-y-1">
              <span className="font-bold text-cyan-400">🤖 로봇 풋살장</span>
              <p className="text-neutral-400 text-[11px]">로봇 코딩 및 자율주행 제어</p>
            </div>
            <div className="p-4 rounded-md bg-black/60 border border-neutral-800 space-y-1">
              <span className="font-bold text-cyan-400">🚌 이동형 버스</span>
              <p className="text-neutral-400 text-[11px]">전국 어디든 찾아가는 체험</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CONTACT FORM (무료 상담 신청 폼) */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="rounded-lg border border-neutral-800 bg-[#121212] p-8 sm:p-12 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              CONTACT US
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI 프로젝트 및 교육·컨설팅 신청
            </h2>
            <p className="text-xs text-neutral-400">
              전문 컨설팅팀이 귀사의 비즈니스를 1:1로 진단해 드립니다.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
              <h3 className="text-lg font-bold text-white">상담 신청이 정상 접수되었습니다!</h3>
              <p className="text-xs text-neutral-300">
                24시간 이내에 전담 전문가가 신속히 안내해 드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">이름 / 기업명</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동 (주식회사 퓨처)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1.5">연락처</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">관심 분야</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="교육">AI 교육 및 역량 강화 워크숍</option>
                  <option value="기획">IP 로드맵 / 정부지원사업 / 입찰 기획</option>
                  <option value="개발">AI 웹·앱 / 챗봇 / 시스템 개발</option>
                  <option value="홍보">인플루언서 제휴 및 90일 매출 마케팅</option>
                  <option value="체험">어울림 메이커스 / 4차산업 체험 캠프</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">문의 내용</label>
                <textarea
                  rows={4}
                  placeholder="추진 중인 사업이나 궁금하신 사항을 적어주세요."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-md bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>무료 상담 신청 완료하기</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. PARTNERS & AFFILIATES (협력기관 제휴사 - 컬러 로고 엠블럼 화이트 카드 무한 롤링 마키) */}
      {/* ========================================================================= */}
      <section id="partners" className="w-full pt-10 pb-4 space-y-8 overflow-hidden border-t border-neutral-900 bg-gradient-to-b from-transparent via-[#0a0f1d]/50 to-[#070b14]">
        
        {/* Unified Title Design (Same as 핵심 서비스 영역) */}
        <div className="text-center space-y-3 max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            협력기관 제휴사
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            미래교육문화협회(퓨처마인드)와 함께 혁신을 만들어가는 공공기관, 대학교 및 파트너사입니다.
          </p>
        </div>

        {/* Infinite Marquee Ticker (Slow & Smooth 65s Right-to-Left Scrolling) */}
        <div className="relative w-full overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <style jsx>{`
            @keyframes marqueeScroll {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-marquee-infinite {
              display: flex;
              width: max-content;
              animation: marqueeScroll 65s linear infinite;
            }
            .animate-marquee-infinite:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="animate-marquee-infinite gap-6">
            {/* Double array for seamless loop */}
            {[...PARTNERS_DATA, ...PARTNERS_DATA, ...PARTNERS_DATA].map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-4 min-w-[220px] sm:min-w-[260px] h-[76px] sm:h-[84px] px-7 rounded-lg sm:rounded-xl bg-white text-neutral-900 shadow-[0_12px_28px_rgba(0,0,0,0.35),0_4px_10px_rgba(0,0,0,0.2)] border border-neutral-100 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_16px_36px_rgba(0,194,255,0.2)] transition-all duration-200 cursor-default select-none group"
              >
                {/* Colored Logo Icon Emblem */}
                <div className="group-hover:scale-110 transition-transform flex-shrink-0">
                  <PartnerLogoIcon type={partner.iconType} />
                </div>

                {/* Partner Name Only (Korean Bold & Filled) */}
                <span className="font-black text-base sm:text-lg lg:text-xl text-neutral-950 group-hover:text-cyan-700 transition-colors tracking-tight whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
