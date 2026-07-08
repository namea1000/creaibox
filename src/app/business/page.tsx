"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Database,
  Briefcase
} from "lucide-react";
import Header from "@/components/layout/Header";

export default function BusinessGatewayLanding() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 font-sans overflow-x-hidden relative transition-colors duration-300">
      <Header />

      {/* 🌌 BACKGROUND NEON GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[140px] pointer-events-none" />

      {/* 🏁 SECTION 1: HERO SCENE */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-widest animate-pulse mx-auto">
          <Sparkles size={12} /> CreAibox B2B Portal
        </div>
        
        <h1 className="text-3.5xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-tight max-w-4xl mx-auto">
          인공지능으로 기업의 <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 dark:from-blue-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
            비즈니스 미래를 혁신하다
          </span>
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-semibold">
          크리에이박스(CreAibox)는 대기업, 공공기관, 프랜차이즈, 크리에이터를 위한 맞춤형 AI 인프라와 트래픽 자동화 솔루션을 제공하는 B2B 혁신 파트너입니다.
        </p>
      </div>

      {/* 🏁 SECTION 2: CORE GATEWAY CARDS (2대 주력 비즈니스) */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10 grid gap-8 md:grid-cols-2">
        
        {/* CARD A: ENTERPRISE SOLUTIONS */}
        <div className="p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20 backdrop-blur-md shadow-lg dark:shadow-2xl flex flex-col justify-between space-y-8 group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
          {/* Card background hover glow */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          
          <div className="space-y-6">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 w-fit">
              <Building2 size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                기업형 맞춤 제작
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                Enterprise Custom Solutions
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold pt-2">
                가맹점 및 대리점 배포를 위한 대량 분양형 자동 홈페이지 생성 엔진, 유출 없는 사내 프라이빗 AI 모델(RAG) 및 맞춤 API 자동화 파이프라인을 구축해 드립니다.
              </p>
            </div>

            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                대리점·가맹점용 대량 자동 생성 웹 빌더
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                보안 서약 기반 사내 RAG 문서 분석 시스템
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                독점 전용 API 게이트웨이 파이프라인 개발
              </li>
            </ul>
          </div>

          <Link
            href="/business/enterprise"
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group-hover:-translate-y-0.5"
          >
            기업 맞춤 제작 견적 신청
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD B: PARTNERSHIP & ADS */}
        <div className="p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20 backdrop-blur-md shadow-lg dark:shadow-2xl flex flex-col justify-between space-y-8 group hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
          {/* Card background hover glow */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

          <div className="space-y-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
              <Users size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                협업 / 광고 제안
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
                Partnership & Advertising
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold pt-2">
                크리에이박스 플랫폼과의 공동 브랜딩 제휴, 단체·교육기관을 위한 대량 라이선스 아카데미 패키지, 유튜버 및 인플루언서 제휴 프로모션 등 시너지를 창출합니다.
              </p>
            </div>

            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                교육 및 대학교 단체를 위한 단체 라이선스 팩
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                인플루언서 연계 수익 셰어 프로모션 제휴
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                플랫폼 내 스폰서십 광고 및 공동 브랜드 마케팅
              </li>
            </ul>
          </div>

          <Link
            href="/business/ads"
            className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group-hover:-translate-y-0.5 border border-emerald-500/20"
          >
            협업 및 제안 신청하기
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* 🏁 SECTION 3: 4대 비즈니스 강점 그리드 */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white">
            왜 기업들은 크리에이박스를 선택할까요?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            크리에이박스만의 독보적인 4대 인공지능 엔터프라이즈 솔루션 역량
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-4 shadow-sm">
            <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">01. Web Scale</div>
            <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white">양산형 홈페이지 생성</h3>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
              여러 가맹 지점이나 도메인을 클릭 한 번으로 대량 빌딩하여 대리점에 즉시 분양 배포할 수 있는 고성능 자동화 아키텍처를 지원합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-4 shadow-sm">
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">02. Safe AI</div>
            <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white">보안 RAG 지식베이스</h3>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
              사내 주요 업무 기밀 및 보고서 데이터가 유출될 염려 없이 안전하게 RAG 파이프라인으로 암호화되어 AI 비서와 매핑되는 보안 솔루션입니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-4 shadow-sm">
            <div className="text-xs font-black text-teal-650 dark:text-teal-400 uppercase tracking-widest">03. Production</div>
            <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white">미디어 자동 대량생산</h3>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
              대량의 상품 설명 텍스트를 기입하면 AI가 썸네일, 홍보 쇼츠 영상, 음원, 블로그 원고까지 한 번에 제작 및 퍼블리싱하는 대량 생성기입니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-4 shadow-sm">
            <div className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">04. Traffic</div>
            <h3 className="text-sm md:text-base font-black text-slate-950 dark:text-white">정밀 SEO 유입 분석</h3>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
              검색엔진의 실시간 트렌드 및 최적화 노출 진단, 유튜브 경쟁사 분석 보고서를 종합하여 잠재 고객 트래픽을 극대화하는 기획 컨설팅을 제공합니다.
            </p>
          </div>

        </div>
      </div>

      {/* 🏁 SECTION 4: FOOTER */}
      <div className="border-t border-slate-200 dark:border-slate-800/60 mt-12 bg-white/40 dark:bg-slate-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-lg font-black text-slate-950 dark:text-white tracking-tight">CreAibox</span>
            <p className="text-[10px] text-slate-500 font-bold">
              인공지능 기반 올인원 콘텐츠 제작 & 비즈니스 자동화 플랫폼
            </p>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-600 font-bold">
            © {currentYear} 크리에이박스(CreAibox). All rights reserved. 
          </div>
        </div>
      </div>

    </div>
  );
}
