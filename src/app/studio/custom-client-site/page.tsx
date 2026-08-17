"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SmartIntentLink from "@/components/common/SmartIntentLink";
import {
  Sparkles,
  ArrowRight,
  Gauge,
  Bot,
  Search,
  Layers,
  CheckCircle2,
  Globe,
  RefreshCw,
  Zap,
  TrendingUp,
  FileText,
  Wrench,
  Cpu,
  Store,
  Settings,
  Plus,
  ShieldCheck,
  LayoutTemplate,
  Check,
  ChevronRight,
  ExternalLink,
  Sliders,
  Shield,
  Clock,
  Layout,
  BarChart3,
  Award,
} from "lucide-react";

export default function CustomClientSiteHomePage() {
  const router = useRouter();
  const [migrationUrl, setMigrationUrl] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleMigrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (migrationUrl.trim()) {
      router.push(`/studio/custom-client-site/migration?url=${encodeURIComponent(migrationUrl.trim())}`);
    } else {
      router.push(`/studio/custom-client-site/migration`);
    }
  };

  // 4대 핵심 빌더 진입 트랙 (AIPress.io 스타일 "Choose Your Lane")
  const startingPaths = [
    {
      badge: "신규 구축",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      title: "새로운 AI 성장형 웹사이트가 필요하신가요?",
      desc: "업종별 프리미엄 템플릿을 선택하거나, AI 매직 빌더에 비즈니스 설명 한 줄만 입력하여 1초 만에 반응형 사이트를 완성하세요.",
      cta: "템플릿 마켓플레이스 탐색",
      link: "/studio/custom-client-site/marketplace",
      icon: Store,
      accent: "hover:border-blue-500/50 hover:shadow-blue-500/10",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      badge: "무제한 이관",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      title: "워드프레스나 아임웹/Wix에서 답답하셨나요?",
      desc: "기존 웹사이트 URL만 입력하면 AI 엔진이 텍스트, 구조, 이미지, 메뉴를 완벽 분석하여 0.01초 초고속 Next.js 기반으로 자동 이관합니다.",
      cta: "기존 사이트 AI 1초 이관",
      link: "/studio/custom-client-site/migration",
      icon: RefreshCw,
      accent: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      badge: "pSEO & 확장",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      title: "수백 개의 검색 상위 랭킹 페이지가 필요하신가요?",
      desc: "지역별(강남, 분당, 해운대 등), 타깃 서비스별 수백 개의 고의도(pSEO) 랜딩페이지와 서브페이지를 무한대로 자동 증설하고 관리하세요.",
      cta: "서브페이지 매직 빌더",
      link: "/studio/custom-client-site/subpage-builder",
      icon: Layers,
      accent: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      badge: "1:1 엔터프라이즈",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      title: "우리 기업만의 하이엔드 맞춤 제작이 필요하신가요?",
      desc: "고유한 비즈니스 로직, 커스텀 API 연동, 브랜딩 맞춤형 UI가 필요하신 경우 CreaiBox 전담 AI 엔지니어링 맞춤 제작을 신청하세요.",
      cta: "1:1 커스텀 제작 신청",
      link: "/studio/custom-client-site/request",
      icon: Sparkles,
      accent: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  // 업종별 대표 템플릿 샘플 데이터
  const showcaseTemplates = [
    {
      id: "ai-saas-dark",
      title: "AI SaaS & 테크 스타트업",
      category: "tech",
      badge: "인기 1위",
      desc: "다크 네온 글래스모피즘, 실시간 기능 쇼케이스, 요금제 테이블, 고전환 CTA 탑재.",
      features: ["0.01s 엣지 로딩", "반응형 벤토 그리드", "GEO 최적화"],
      href: "/studio/custom-client-site/marketplace",
      tag: "Tech / SaaS",
      bgGradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    },
    {
      id: "corporate-consulting",
      title: "글로벌 비즈니스 & 경영 컨설팅",
      category: "business",
      badge: "신규",
      desc: "신뢰감을 주는 모던 미니멀 레이아웃, 포트폴리오 갤러리, 1:1 상담 예약 문의폼 내장.",
      features: ["브랜드 포트폴리오", "실시간 리드 수집", "SEO 메타 자동화"],
      href: "/studio/custom-client-site/marketplace",
      tag: "Business",
      bgGradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    },
    {
      id: "medical-legal",
      title: "병원 · 법률사무소 · 전문직 전문",
      category: "pro",
      badge: "추천",
      desc: "지역 검색(Near Me) 1위 랭킹 특화, 전문의/변호사 소개, 실시간 상담 예약 시스템 연동.",
      features: ["네이버 지도 연동", "모바일 풀와이드", "후기/증례 갤러리"],
      href: "/studio/custom-client-site/marketplace",
      tag: "Professional",
      bgGradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
    },
    {
      id: "ecommerce-brand",
      title: "D2C 브랜드 스토어 & 쇼룸",
      category: "store",
      badge: "베스트",
      desc: "16:9 비주얼 썸네일 쇼케이스, 베스트셀러 큐레이션, 스마트스토어/결제 즉시 아웃링크.",
      features: ["16:9 썸네일 표준", "초경량 상품 카탈로그", "SNS 자동 연동"],
      href: "/studio/custom-client-site/marketplace",
      tag: "Commerce",
      bgGradient: "from-purple-600/20 via-pink-600/10 to-transparent",
    },
  ];

  const filteredTemplates = activeTab === "all"
    ? showcaseTemplates
    : showcaseTemplates.filter((t) => t.category === activeTab);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (AIPress.io 스타일 Dark Gradient & Grid Pattern)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0a0d14] to-[#090b10] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle SVG Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-purple-600/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-slate-300 shadow-inner">
            <Sparkles className="text-cyan-400 animate-pulse" size={15} />
            <span>0.01초 글로벌 엣지 &amp; AI 성장형 웹사이트 엔진</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-white leading-[1.28] tracking-tight [word-break:keep-all] max-w-4xl mx-auto">
            AI가 구축하는 웹사이트:<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              검색 상위 랭킹, 고객 전환, 무한한 확장
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            단순한 껍데기 홈페이지를 넘어, 내 비즈니스를 스스로 학습하는 <strong className="text-slate-200">AI 콘텐츠 에이전트</strong>와 <strong className="text-cyan-300">0.01초 엣지 스피드</strong>, 그리고 수백 개의 고의도 검색 랭킹 페이지를 자동 관리하는 차세대 웹사이트 성장 플랫폼입니다.
          </p>

          {/* Interactive URL Quick Start Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleMigrationSubmit} className="relative flex flex-col sm:flex-row items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl shadow-2xl backdrop-blur-xl focus-within:border-cyan-500/80 transition-all">
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Globe className="text-slate-500 mr-2.5 shrink-0" size={18} />
                <input
                  type="text"
                  value={migrationUrl}
                  onChange={(e) => setMigrationUrl(e.target.value)}
                  placeholder="기존 사이트 URL 입력 (예: mybrand.com) 또는 원하는 주제"
                  className="w-full bg-transparent border-none text-slate-100 text-sm font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-0 py-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
              >
                <Sparkles size={16} />
                <span>1초 AI 시작</span>
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> 0.01초 Vercel Edge CDN
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> Core Web Vitals 100점
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> ChatGPT &amp; Perplexity 최적화
              </span>
            </div>
          </div>

          {/* 4 Hero Quick Feature Cards (AIPress.io Style) */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm hover:border-slate-700 transition-all">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Gauge size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">0.01초 초고속 엣지</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  플러그인 찌꺼기 없는 순수 Next.js 엔진으로 전 세계 어디서든 즉시 열립니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm hover:border-slate-700 transition-all">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">내장 콘텐츠 에이전트</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  내 브랜드 지식을 학습한 AI가 고품질 블로그와 랜딩페이지를 자동 기획합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm hover:border-slate-700 transition-all">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Search size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">SEO &amp; GEO 최적화</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  구글 검색뿐만 아니라 ChatGPT, Perplexity 등 AI 답변 엔진에 우선 인용됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm hover:border-slate-700 transition-all">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">포트폴리오 스케일</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  지역별·서비스별 수백 개의 고의도(pSEO) 랜딩페이지를 무제한 확장 관리합니다.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. DECIDE THE RIGHT STARTING PATH (4대 핵심 진입 트랙)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
            <Sliders size={14} />
            <span>Choose Your Starting Lane</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            내 비즈니스에 맞는 시작 경로를 선택하세요
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            신규 사이트 제작, 타사 솔루션 이관, 대규모 pSEO 확장, 또는 1:1 맞춤형 엔터프라이즈 제작까지 자유롭게 선택할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {startingPaths.map((item, idx) => {
            const Icon = item.icon;
            return (
              <SmartIntentLink
                key={idx}
                href={item.link}
                className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 ${item.accent} hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full border text-xs font-black tracking-wide ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${item.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-sm font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>{item.cta}</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </SmartIntentLink>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. PROBLEM MATRIX ("구형 템플릿의 한계" - AIPress Red Matrix)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800/80 bg-gradient-to-b from-[#0e111a] to-[#090b10] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
              <span>Why Legacy Websites Fail</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              웹사이트는 단순한 브로셔가 아닌<br />
              <span className="text-red-400">24시간 작동하는 고객 유입 엔진</span>이어야 합니다
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              대부분의 웹사이트는 만들고 나면 방치됩니다. 무거운 워드프레스 테마와 드래그앤드롭 빌더는 같은 치명적인 문제를 반복합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 space-y-4 hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">3~5초의 느린 로딩과 모바일 이탈</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                각종 플러그인과 무거운 프레임워크 찌꺼기로 인해 첫 로딩이 느려 방문자의 53%가 이탈하고 검색 순위가 곤두박질칩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 space-y-4 hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">콘텐츠가 멈춰버리는 사이트 방치</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                검색 수요에 맞춰 양질의 블로그와 서비스 페이지를 계속 생산해야 하지만, 인력과 시간 부족으로 첫 오픈 이후 멈춰버립니다.
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 space-y-4 hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">AI 검색(ChatGPT, Perplexity) 미노출</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                생성형 AI가 답변을 요약할 때 인용할 수 있는 구조화된 JSON-LD와 시맨틱 마크업이 없어 차세대 AI 검색에서 완전히 배제됩니다.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-900 border border-red-500/20 text-center max-w-4xl mx-auto space-y-2">
            <p className="text-sm sm:text-base font-bold text-slate-200">
              느린 속도, 얇은 콘텐츠, 차별점 없는 껍데기 템플릿의 악순환을 끊어내세요.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              CreaiBox는 0.01초 글로벌 엣지 서빙과 브랜드 맞춤 AI 에이전트가 결합된 지속 가능한 성장 플랫폼을 제공합니다.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SOLUTION MATRIX ("CreaiBox AI 솔루션" - AIPress Green Matrix)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <span>The CreaiBox Solution</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            더 빠른 웹사이트와<br />
            <span className="text-emerald-400">스마트한 AI 콘텐츠 머신 구축</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            최신 Next.js 프론트엔드, 브랜드 맞춤 AI 에이전트, 테크니컬 SEO, 그리고 무인 자동 운영 시스템을 하나로 통합했습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Zap size={26} />
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">0.01s Fast By Default</div>
              <h3 className="text-lg font-bold text-white">압도적인 0.01초 엣지 스피드</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Vercel Global Edge CDN과 ISR 60s 기술을 기본 내장하여 클릭 즉시 0.01초 만에 화면이 열리는 네이버 뉴스급 로딩을 실현합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot size={26} />
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">Always-On Agents</div>
              <h3 className="text-lg font-bold text-white">내 사이트를 학습한 AI 에이전트</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              내 회사 소개, 서비스, 포트폴리오 지식을 바탕으로 고객 질문에 즉시 답하고 고품질 아티클과 랜딩페이지 원고를 자동 생성합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 space-y-4 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Layers size={26} />
            </div>
            <div>
              <div className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">pSEO at Scale</div>
              <h3 className="text-lg font-bold text-white">수백 개 검색 상위 랭킹 장악</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              지역별 타깃 키워드(예: 강남 홈페이지 제작, 분당 인테리어)에 맞춘 수백 개의 맞춤형 랜딩페이지를 품질 저하 없이 자동 확장합니다.
            </p>
          </div>
        </div>

        {/* Compound Growth Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              초고속 엣지 + 유용한 콘텐츠 + 정형화된 구조 = 폭발적인 유기적 트래픽
            </h3>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              단 한 번의 제작으로 끝나지 않습니다. 구글 색인(Indexing API), AI 검색 엔진(GEO), 전환 최적화까지 비즈니스가 지속적으로 성장하도록 서포트합니다.
            </p>
          </div>
          <SmartIntentLink
            href="/studio/custom-client-site/marketplace"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg hover:scale-105"
          >
            지금 시작하기
          </SmartIntentLink>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BENTO 4-GRID CAPABILITIES (AIPress.io 4 Capabilities)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/80 bg-[#0c0f16] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
              <Cpu size={14} />
              <span>Full System Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              단순한 웹사이트 그 이상,<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                검색과 전환을 지배하는 올인원 시스템
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              모든 페이지가 비즈니스의 강력한 무기가 되도록 필요한 핵심 기술을 완벽하게 통합했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Zap size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">초고속 프론트엔드</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Core Web Vitals 100점, 불필요한 무거운 스크립트 제거, 모바일 최적화 풀와이드 레이아웃 적용.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">SEO, GEO &amp; AI 가시성</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Indexing API 실시간 색인 요청, ChatGPT/Perplexity AI 오버뷰 최적화 구조화 데이터 내장.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <FileText size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">에이전트 원고 생성</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                내 제품, 서비스, 포트폴리오, FAQ를 소스로 고품질 블로그 및 랜딩페이지 원고를 무제한 자동 발행.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                <Wrench size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">실시간 도메인 &amp; 제어</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                무료 서브도메인 즉시 배포, 개인 커스텀 도메인 1초 바인딩, 메뉴와 텍스트 실시간 커스텀.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TEMPLATE SHOWCASE (업종별 시그니처 템플릿 탐색)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400">
              <Store size={14} />
              <span>Premium Template Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              업종별 시그니처 템플릿 쇼케이스
            </h2>
            <p className="text-sm text-slate-400">
              실제 비즈니스에 즉시 배포할 수 있는 고전환 프리미엄 템플릿들을 만나보세요.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: "all", label: "전체" },
              { id: "tech", label: "테크/SaaS" },
              { id: "business", label: "비즈니스" },
              { id: "pro", label: "전문직/병원" },
              { id: "store", label: "커머스" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Preview Header Frame (16:9 Aspect Ratio) */}
              <div className={`relative aspect-[16/9] w-full bg-gradient-to-br ${tpl.bgGradient} p-6 flex flex-col justify-between border-b border-slate-800`}>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-black tracking-wide backdrop-blur-md">
                    {tpl.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-[11px] font-black shadow-md">
                    {tpl.badge}
                  </span>
                </div>

                {/* Mock UI Elements */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-bold text-slate-300 backdrop-blur-md">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>0.01s Next.js Edge Ready</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {tpl.title}
                  </h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {tpl.desc}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {tpl.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <SmartIntentLink
                    href={tpl.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    마켓 상세 스펙 보기 <ChevronRight size={14} />
                  </SmartIntentLink>

                  <SmartIntentLink
                    href="/studio/custom-client-site/marketplace"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md hover:scale-105 transition-all"
                  >
                    <Store size={14} />
                    <span>1초 배포하기</span>
                  </SmartIntentLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <SmartIntentLink
            href="/studio/custom-client-site/marketplace"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all"
          >
            <span>전체 템플릿 마켓플레이스 입장하기</span>
            <ArrowRight size={16} />
          </SmartIntentLink>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. HOW IT WORKS (3단계 무인 구축 파이프라인 - AIPress Style)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/80 bg-[#0b0e14] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <span>3-Step Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              어떻게 작동하나요?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              복잡한 코딩이나 웹 호스팅 설정 없이 3단계만으로 완성됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">비즈니스 모델 및 타깃 분석</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                템플릿을 선택하거나 기존 URL을 입력하면 AI 엔진이 브랜드 컬러, 타깃 고객, 주요 키워드를 정밀 분석합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">0.01초 엣지 웹사이트 자동 구축</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Next.js 기반 코드로 풀 렌더링되며, 무료 서브도메인 또는 개인 맞춤 도메인(내회사.com)에 즉시 배포됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">실시간 색인 &amp; AI 콘텐츠 무한 확장</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Indexing API로 즉시 검색에 반영되며, AI 콘텐츠 에이전트와 서브페이지 매직 빌더로 트래픽을 지속 확장합니다.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BOTTOM HIGH-CONVERSION CTA (AIPress.io Dark Rounded CTA Card)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-2xl">
          
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-black text-cyan-300 uppercase tracking-wider">
              <Sparkles size={13} />
              Start Your AI Growth Engine Today
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight [word-break:keep-all]">
              지금 바로 내 비즈니스를 위한<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                0.01초 AI 웹사이트를 배포하세요
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              더 이상 코딩이나 무거운 템플릿에 시간 낭비하지 마세요. 1초 만에 최신 트렌드의 성장형 웹사이트를 손에 넣으실 수 있습니다.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <SmartIntentLink
                href="/studio/custom-client-site/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 hover:scale-105 transition-all"
              >
                <Store size={18} />
                <span>템플릿 마켓 둘러보기</span>
                <ArrowRight size={16} />
              </SmartIntentLink>

              <SmartIntentLink
                href="/studio/custom-client-site/migration"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-extrabold text-sm border border-slate-700 transition-all"
              >
                <RefreshCw size={18} />
                <span>기존 웹사이트 AI 이관</span>
              </SmartIntentLink>

              <SmartIntentLink
                href="/studio/client-site-builder"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-800 transition-all"
              >
                <Settings size={18} />
                <span>내 사이트 관리</span>
              </SmartIntentLink>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
