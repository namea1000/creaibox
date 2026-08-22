"use client";

import React, { useState } from "react";
import Link from "@/components/common/SmartIntentLink";
import {
  Flame,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Users,
  Play,
  Cpu,
  Bot,
  Layers,
  GraduationCap,
  Megaphone,
} from "lucide-react";

const PARTNERS = [
  "호서대학교",
  "한국콘텐츠진흥원",
  "통일부",
  "충청남도",
  "소상공인시장진흥공단",
  "백석문화대학교",
  "백석대학교",
  "단국대학교",
  "남서울대학교",
  "충남창업보육협회",
  "백석메이커스",
];

const ACCORDION_SERVICES = [
  {
    num: "01",
    title: "AI 실전 교육 & 워크숍 (AI Engineering & Education)",
    desc: "기업 임직원 생성형 AI 실무, 프롬프트 엔지니어링, RAG 챗봇 구축, 대학/청소년/시니어 전 생애주기 맞춤형 커리큘럼",
    href: "/education",
  },
  {
    num: "02",
    title: "전략 기획 & IP 로드맵 (Planning & Patents)",
    desc: "변리법인 세움 20년 자문단(등록률 92%), 특허 출원, 정부지원사업 바우처 제안서 및 공공 입찰 100% 수주 기획",
    href: "/planning",
  },
  {
    num: "03",
    title: "AI 시스템 & 24/7 챗봇 개발 (Application Development)",
    desc: "초고속 Next.js 모던 웹사이트, 24시간 무인 응대 AI 챗봇, AR 키오스크, ERP/CMS 경영 자동화 플랫폼",
    href: "/development",
  },
  {
    num: "04",
    title: "90일 인플루언서 제휴 마케팅 (Growth Marketing)",
    desc: "120만 메이저 인플루언서 매칭, 뷰티/테크/육아/패션/식품 5대 업종별 실전 매출 전환 로드맵 (평균 ROI +320%)",
    href: "/marketing",
  },
  {
    num: "05",
    title: "4차산업 실감체험 힐링캠프 (Experiential Maker Camp)",
    desc: "드론 조종 및 코딩, VR/AR 실감형 체험, 로봇 풋살, 전국 어디든 찾아가는 이동형 4차산업 체험 버스",
    href: "/education",
  },
];

export default function Futuremind2HomePage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "", category: "교육" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="w-full space-y-24 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Blazity 1:1 Left Typography / Right High-Def Video Card) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Typography & Buttons */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono font-bold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-[#f95700]" />
              <span>AI CLOUD & TRANSFORMATION EXPERTS</span>
            </div>

            {/* Giant Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              AI라는 경계 없는<br />
              <span className="text-[#f95700]">마음 하나로,</span><br />
              시간과 공간을 넘어<br />
              <span className="text-[#f95700]">모든 것을 연결합니다</span>
            </h1>

            {/* Sub Paragraph */}
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
              끝없이 펼쳐지는 배움의 세계, <strong>미래교육문화협회(퓨처마인드)</strong>가 그 문을 엽니다.<br />
              대기업부터 창업자, 공공기관, 전 세대의 미래를 위한 엔터프라이즈급 AI 대전환을 완성합니다.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#contact"
                className="px-6 py-3.5 bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20"
              >
                TALK TO AN ARCHITECT (상담 신청)
              </Link>
              <Link
                href="/work"
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200"
              >
                SEE OUR SOLUTIONS
              </Link>
            </div>
          </div>

          {/* Right Side: High-Definition Loop Video Player Card + Partner Badge */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl aspect-[4/3] group">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/hero-video.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-mono text-[10px] text-[#f95700] font-bold">NEXT-GEN AI TRANSFORMATION</span>
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300">
                  Futuremind 2026
                </span>
              </div>
            </div>

            {/* Blazity-style Small Certified Partner Box */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#f95700]">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">CERTIFIED AI PARTNER</p>
                  <p className="text-[10px] text-neutral-400">미래교육문화협회 공인 교육 & 개발 센터</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTNERS LOGO STRIP (Blazity Infinite Strip Style) */}
      {/* ========================================================================= */}
      <section id="partners" className="bg-[#121212] py-8 border-y border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest text-center mb-6">
            TRUSTED BY LEADING UNIVERSITIES & GOVERNMENT INSTITUTIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-neutral-400">
            {PARTNERS.map((partner, idx) => (
              <span key={idx} className="hover:text-white transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW WE WORK & 3 METRICS (Blazity 3x Stats Section) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-neutral-800 pb-12">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider">
              HOW WE WORK
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              비즈니스의 모든 분야에 걸친<br />
              어제의 지혜와 내일의 가능성을 잇습니다
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              대기업과 관공서의 조직 혁신부터 예비·초기 창업자의 도약, 모든 세대의 삶을 위해 존재합니다.
            </p>
          </div>

          {/* 3 Big Stats */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">3x</span>
              <p className="text-xs font-bold text-neutral-200">Faster validation</p>
              <p className="text-[10px] text-neutral-400">3배 빠른 바우처 수주</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-[#f95700] font-mono tracking-tight">+50%</span>
              <p className="text-xs font-bold text-neutral-200">Revenue growth</p>
              <p className="text-[10px] text-neutral-400">실전 매출 전환 극대화</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">-30%</span>
              <p className="text-xs font-bold text-neutral-200">Operational cost</p>
              <p className="text-[10px] text-neutral-400">24/7 AI 무인 자동화</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR SOLUTIONS (Blazity 2 Large Top + 4 Compact Bottom Grid) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider">
            OUR SOLUTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Tools behind our AI-native delivery system
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            교육부터 기획, 개발, 홍보까지 실제 비즈니스 문제 해결을 위해 정제된 솔루션을 제공합니다.
          </p>
        </div>

        {/* Top 2 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link
            href="/education"
            className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                FOR ENTERPRISE & CITIZENS
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f95700] transition-colors">
                AI 실전 교육 & 생애전주기 워크숍
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ChatGPT, Claude를 활용한 기획서·데이터 분석 자동화부터 대학생 부트캠프, 청소년 미래 캠프, 시니어 디지털 리터러시까지 전 과정 1:1 실습
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#f95700] pt-2">
              <span>LEARN MORE</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/planning"
            className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                FOR STARTUPS & BUSINESS
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f95700] transition-colors">
                전략 기획 & IP 바우처 로드맵
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                변리법인 세움 20년 자문단(등록률 92%), 특허 출원, 정부 바우처(70% 지원), 공공기관 입찰 100% 낙찰 제안서 작성 원스톱 대행
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#f95700] pt-2">
              <span>LEARN MORE</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Bottom 4 Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link
            href="/development"
            className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">FOR DEVELOPERS</span>
              <h4 className="text-sm font-bold text-white group-hover:text-[#f95700] transition-colors">
                웹/앱 & 24/7 AI 챗봇
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Next.js 모던 웹, 24시간 고객 응대 AI 챗봇, AR 키오스크, ERP/CMS 구축
              </p>
            </div>
            <span className="text-xs font-bold text-[#f95700] flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </span>
          </Link>

          <Link
            href="/planning"
            className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">FOR PUBLIC BIDDING</span>
              <h4 className="text-sm font-bold text-white group-hover:text-[#f95700] transition-colors">
                공공기관 입찰 100% 제안
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                서울시청·경기도청·교육부 입찰 분석 및 100% 수주 제안서 작성
              </p>
            </div>
            <span className="text-xs font-bold text-[#f95700] flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </span>
          </Link>

          <Link
            href="/marketing"
            className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">FOR MARKETING</span>
              <h4 className="text-sm font-bold text-white group-hover:text-[#f95700] transition-colors">
                90일 인플루언서 제휴
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                120만 메이저 인플루언서 매칭, 뷰티/테크/육아 실전 매출 극대화 (+320%)
              </p>
            </div>
            <span className="text-xs font-bold text-[#f95700] flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </span>
          </Link>

          <Link
            href="/education"
            className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#f95700]/60 transition-all space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">FOR COMMUNITY</span>
              <h4 className="text-sm font-bold text-white group-hover:text-[#f95700] transition-colors">
                어울림 메이커스 체험
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                드론 조종, VR/AR 서바이벌, 로봇 풋살, 찾아가는 이동형 4차산업 버스
              </p>
            </div>
            <span className="text-xs font-bold text-[#f95700] flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </span>
          </Link>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR OFFER ACCORDION (Blazity 01~05 Numbered Accordion Section) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider">
              OUR OFFER
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Full-stack <span className="text-[#f95700]">AI and engineering</span> services
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Vercel AI Cloud 기반의 프로덕션 레벨 AI 시스템부터 세대별 맞춤형 교육까지 완벽하게 수행합니다.
            </p>
            <Link
              href="#contact"
              className="inline-block px-5 py-3 bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-orange-500/20"
            >
              EXPLORE ALL SERVICES
            </Link>
          </div>

          {/* Accordion List */}
          <div className="lg:col-span-7 space-y-3">
            {ACCORDION_SERVICES.map((srv, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-[#141414] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-[#f95700] transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg flex items-center gap-3">
                      <span className="text-[#f95700] font-mono font-black">{srv.num}.</span>
                      <span>{srv.title}</span>
                    </span>
                    <span className="text-neutral-400">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/80 space-y-4">
                      <p>{srv.desc}</p>
                      <Link
                        href={srv.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f95700] hover:underline"
                      >
                        <span>자세히 보기</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CASE STUDIES (Blazity Signature White Card Boxes) */}
      {/* ========================================================================= */}
      <section id="case_studies" className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              CASE STUDIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Delivering projects that drive results
            </h2>
          </div>
          <Link
            href="/work"
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            EXPLORE ALL CASE STUDIES
          </Link>
        </div>

        {/* 3 White Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-950">
          
          <div className="p-8 rounded-2xl bg-white space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 font-mono">스마트팜 바우처 & 입찰</span>
              <h3 className="text-xl font-black tracking-tight text-slate-900">4x 수주 달성</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                바우처 신청부터 공공 입찰까지 퓨처마인드 전담팀과 함께하여 3개월 만에 1억 원 수주 달성!
              </p>
            </div>
            <Link href="/planning" className="text-xs font-black text-slate-950 hover:text-[#f95700] flex items-center gap-1">
              Explore →
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-white space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 font-mono">천안 카페 & 매장 자동화</span>
              <h3 className="text-xl font-black tracking-tight text-slate-900">+70% 업무 자동화</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                60대 사장님이 6주 만에 챗봇을 완성하여 매장 문의와 예약을 100% 무인 자동화로 해결!
              </p>
            </div>
            <Link href="/development" className="text-xs font-black text-slate-950 hover:text-[#f95700] flex items-center gap-1">
              Explore →
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-white space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 font-mono">수출 중소기업 글로벌 진출</span>
              <h3 className="text-xl font-black tracking-tight text-slate-900">150M+ 글로벌 수출</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                AI 비즈니스 영어 교육으로 해외 바이어와 실시간 소통하여 대형 수출 계약을 성사시켰습니다.
              </p>
            </div>
            <Link href="/marketing" className="text-xs font-black text-slate-950 hover:text-[#f95700] flex items-center gap-1">
              Explore →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CONTACT FORM (Blazity Minimalist Tech Form) */}
      {/* ========================================================================= */}
      <section id="contact" className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl border border-neutral-800 bg-[#121212] p-8 sm:p-12 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#f95700] uppercase tracking-wider">
              CONTACT US
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to talk to an architect?
            </h2>
            <p className="text-xs text-neutral-400">
              퓨처마인드의 전문 아키텍트 팀이 귀사의 비즈니스 및 교육 요구사항을 1:1로 진단해 드립니다.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
              <h3 className="text-lg font-bold text-white">상담 신청이 완료되었습니다!</h3>
              <p className="text-xs text-neutral-300">
                24시간 이내에 전담 아키텍트가 신속히 연락드리겠습니다.
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
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#f95700]"
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
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#f95700]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">관심 분야</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#f95700] font-bold"
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
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#f95700]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-[#f95700] hover:bg-[#ea4e00] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                SUBMIT INQUIRY (상담 신청 완료)
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
