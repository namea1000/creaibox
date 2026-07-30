"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Coffee,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileText,
  Lock,
  Send,
  X,
  ChevronRight,
  MessageSquare,
  Zap,
  Check
} from "lucide-react";

export default function HelloWorkClientPage() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("독립 오피스 (1인~다인실)");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "독립 오피스 (1인~다인실)",
    memo: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("성함과 연락처를 입력해 주세요.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsInquiryModalOpen(false);
      setFormData({ name: "", phone: "", serviceType: "독립 오피스 (1인~다인실)", memo: "" });
      alert("입주/상담 신청이 완료되었습니다. 담당자가 확인 후 신속히 연락드리겠습니다!");
    }, 1200);
  };

  const openModalWithService = (serviceName: string) => {
    setSelectedService(serviceName);
    setFormData((prev) => ({ ...prev, serviceType: serviceName }));
    setIsInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* 🌟 1. Top Announcement Header Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-bold tracking-tight shadow-md flex items-center justify-center gap-2">
        <Sparkles size={16} className="animate-pulse text-slate-950" />
        <span>[천안 불당동] 100% 성인 전용 프리미엄 공유오피스 & 비상주 오피스 당일 사업자등록 가능!</span>
        <button
          onClick={() => openModalWithService("당일 입주/비상주 할인 문의")}
          className="ml-2 rounded-full bg-slate-950 px-3 py-0.5 text-[11px] font-extrabold text-amber-400 hover:bg-slate-900 transition-all"
        >
          할인 혜택 문의하기 ➔
        </button>
      </div>

      {/* 🌟 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/client-site-builder/hellowork" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 font-black text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              HW
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                헬로우워크 <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">천안불당점</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">100% 성인 전용 몰입 오피스 & 비상주 스페이스</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition-colors">공간 & 서비스</a>
            <a href="#non-resident" className="hover:text-amber-400 transition-colors">비상주 오피스</a>
            <a href="#amenities" className="hover:text-amber-400 transition-colors">프리미엄 편의시설</a>
            <a href="#location" className="hover:text-amber-400 transition-colors">오시는 길</a>
          </nav>

          {/* Action Call Button */}
          <div className="flex items-center gap-3">
            <a
              href="tel:010-8695-5132"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-500/50 hover:text-amber-400 transition-all"
            >
              <Phone size={14} className="text-amber-400" />
              010-8695-5132
            </a>
            <button
              onClick={() => openModalWithService("1:1 방문/입주 문의")}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] transition-all"
            >
              1:1 입주/상담 신청
            </button>
          </div>
        </div>
      </header>

      {/* 🌟 3. Hero Visual Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_30%,#f59e0b_0%,transparent_60%)]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black text-amber-400 shadow-inner">
                <ShieldCheck size={16} />
                <span>중고등학생 출입 제로 · 100% 성인 전용 몰입 환경</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                조용함과 몰입의 차이가
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  성공과 성과를 만듭니다.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                천안 불당동 핵심 상권에 위치한 <strong>헬로우워크 천안불당점</strong>은 성인 수험생, 프리랜서, 
                1인 기업가를 위한 최상급 <strong>독립 공유오피스, 비상주 주소지 서비스, 몰입 스터디룸</strong>을 제공합니다.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-slate-300 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <Clock size={16} className="text-amber-400 shrink-0" />
                  <span>24시간 365일</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <Award size={16} className="text-amber-400 shrink-0" />
                  <span>데스커 & 시디즈</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <Building2 size={16} className="text-amber-400 shrink-0" />
                  <span>비상주 사업자 주소</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <Coffee size={16} className="text-amber-400 shrink-0" />
                  <span>원두커피 무제한</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => openModalWithService("방문 투어 예약")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
                >
                  <Sparkles size={18} />
                  무료 방문 투어 / 1:1 상담 예약
                </button>
                <a
                  href="https://map.naver.com/p/search/%ED%97%AC%EB%A1%9C%EC%9A%B0%EC%9B%8C%ED%81%AC/place/1943385526"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-4 text-sm font-bold text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition-all"
                >
                  <MapPin size={18} className="text-emerald-400" />
                  네이버 지도 길찾기 ➔
                </a>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-500/10 group">
                <Image
                  src="/images/clients/hellowork_hero.png"
                  alt="헬로우워크 천안불당점 인테리어"
                  width={800}
                  height={800}
                  className="object-cover w-full h-[460px] group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">헬로우워크 천안불당점 라운지</h4>
                      <p className="text-xs text-slate-400 mt-0.5">충남 천안시 서북구 불당23로 70 (정우프라자 7층)</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      영업 중
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 4. Core Strengths & Why Hello Work */}
      <section id="services" className="py-20 bg-slate-900/40 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              WHY HELLO WORK BUL DANG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              왜 많은 수험생과 사업자가 <br className="sm:hidden" />
              <span className="text-amber-400">헬로우워크</span>를 선택할까요?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              시끄럽고 번잡한 일반 스터디카페나 집에서는 얻을 수 없는 압도적 몰입감을 약속합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-5 hover:border-amber-500/40 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-black text-white">100% 성인 전용 프리미엄 라운지</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                중고등학생의 출입을 전면 제한하여 조용하고 차분한 소음 환경을 보장합니다. 성인 시험 준비생, 공시생, 전문 직장인에게 최적화되어 있습니다.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 소음/떠드는 소리 0% 차단</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 성인 전용 맞춤 커뮤니티</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-5 hover:border-amber-500/40 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-black text-white">데스커 책상 & 시디즈 인체공학 의자</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                하루 종일 앉아 일해도 피로가 적은 시디즈 고급 의자와 고급 데스커(DESKER) 워크데스크가 전 좌석에 기본 세팅되어 있습니다.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 1인 독립 개별 도어락 오피스</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 세련된 원목 & 파티션 구조</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-5 hover:border-amber-500/40 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-black text-white">24시간 보안 & 연중무휴 출입</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                365일 24시간 원하는 언제든 자유롭게 출입 가능하며, 캡스/지문인식 첨단 출입 제어 시스템으로 야간에도 안전하게 이용할 수 있습니다.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 24시간 CCTV 및 보안 시스템</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> 개인 락커 및 도어락 완비</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 5. Non-Resident Office Section (비상주 오피스) */}
      <section id="non-resident" className="py-20 relative overflow-hidden border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-black text-amber-400">
                  <Building2 size={16} />
                  천안 서북구 불당동 정식 사업자등록 주소지 제공
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  비상주 오피스 (Virtual Office)
                  <br />
                  <span className="text-amber-400">당일 사업자등록 & 우편물 관리</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  사무실에 상주하지 않고 천안 불당동의 신뢰성 높은 사업자 주소지가 필요하신 
                  <strong> 1인 기업, 린스타트업, 통신판매업, 프리랜서</strong>분들을 위한 최적의 비상주 오피스 서비스입니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3.5">
                    <Check size={16} className="text-amber-400" />
                    <span>신속 당일 사업자 주소지 임대계약</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3.5">
                    <Check size={16} className="text-amber-400" />
                    <span>우편물/등기 수령 실시간 문자 알림</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3.5">
                    <Check size={16} className="text-amber-400" />
                    <span>실태조사/현장 방문 미팅룸 지원</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-950 border border-slate-800 p-3.5">
                    <Check size={16} className="text-amber-400" />
                    <span>장기 계약 시 특별 할인 혜택 제공</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => openModalWithService("비상주 오피스 견적 문의")}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-xs sm:text-sm font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                  >
                    비상주 오피스 가격 & 견적 문의하기 ➔
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center justify-between">
                    <span>비상주 오피스 추천 대상</span>
                    <span className="text-xs text-amber-400">BENEFITS</span>
                  </h4>
                  <div className="space-y-3 text-xs text-slate-300 font-medium">
                    <p className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      💡 <strong>전자상거래 & 쇼핑몰</strong>: 집 주소 노출 없이 불당동 사업자등록이 필요한 대표님
                    </p>
                    <p className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      💡 <strong>프리랜서 & 1인 기업</strong>: 출장이 잦거나 집에서 주로 작업하시는 창업자분
                    </p>
                    <p className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      💡 <strong>지사 & 관공서 수주</strong>: 천안 서북구 지역 법인/개인 지사 주소지가 필요한 기업
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 🌟 6. Amenities & Cafe Lounge */}
      <section id="amenities" className="py-20 bg-slate-900/30 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <Image
                  src="/images/clients/hellowork_lounge.png"
                  alt="헬로우워크 프리미엄 카페 라운지"
                  width={800}
                  height={600}
                  className="object-cover w-full h-[400px]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                PREMIUM AMENITIES
              </span>

              <h2 className="text-3xl font-black text-white leading-tight">
                업무의 피로를 풀어주는 <br />
                <span className="text-amber-400">카페 라운지 & 야외 테라스</span>
              </h2>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                최고급 원두커피와 다채로운 우려낸 티, 간식이 탕비실에 준비되어 있습니다. 
                답답할 때는 야외 테라스에 나가 시원한 바람을 쐬며 힐링 휴식을 취해보세요.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-200 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Coffee size={18} className="text-amber-400" />
                  <span>원두커피 & 티 무제한</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Wifi size={18} className="text-amber-400" />
                  <span>10G 초고속 전용선 Wi-Fi</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <FileText size={18} className="text-amber-400" />
                  <span>초고속 프린터/스캐너 무료</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Sparkles size={18} className="text-amber-400" />
                  <span>야외 휴식 테라스 보유</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 7. Location & Contact Info */}
      <section id="location" className="py-20 border-b border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <h2 className="text-3xl font-black text-white">오시는 길 & 매장 정보</h2>
            <p className="text-sm text-slate-400 font-medium">
              충남 천안시 불당동 핵심 상권 정우프라자 7층 (701~702호)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Info Card */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950 p-8 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">도로명 주소</h4>
                    <p className="text-sm font-bold text-white mt-1">충남 천안시 서북구 불당23로 70 (정우프라자 7층 701~702호)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">문의 / 상담 전화</h4>
                    <a href="tel:010-8695-5132" className="text-sm font-bold text-amber-400 hover:underline mt-1 block">
                      010-8695-5132
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">이용 시간</h4>
                    <p className="text-sm font-bold text-white mt-1">24시간 365일 연중무휴 (보안 지문/QR 출입)</p>
                  </div>
                </div>
              </div>

              {/* Naver Map & Blog Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <a
                  href="https://map.naver.com/p/search/%ED%97%AC%EB%A1%9C%EC%9A%B0%EC%9B%8C%ED%81%AC/place/1943385526"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between rounded-xl bg-emerald-600/20 border border-emerald-500/40 p-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600/30 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} /> N 네이버 지도에서 위치 및 길찾기 보기
                  </span>
                  <ExternalLink size={14} />
                </a>

                <a
                  href="https://blog.naver.com/hellowork_buldang"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 p-4 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-amber-400" /> N 공식 네이버 블로그 구경하기
                  </span>
                  <ExternalLink size={14} />
                </a>
              </div>

            </div>

            {/* Right Interactive Embed Map Container */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-950 p-4 h-[420px] relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
              <div className="relative z-10 space-y-4 max-w-md px-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MapPin size={32} />
                </div>
                <h3 className="text-lg font-black text-white">네이버 지도로 확인하기</h3>
                <p className="text-xs text-slate-400 font-medium">
                  천안시 서북구 불당23로 70 정우프라자 7층 헬로우워크 천안불당점 위치를 네이버 지도에서 확인해 보세요.
                </p>
                <a
                  href="https://map.naver.com/p/search/%ED%97%AC%EB%A1%9C%EC%9A%B0%EC%9B%8C%ED%81%AC/place/1943385526"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  네이버 지도 앱으로 열기 ➔
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 8. Bottom Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
            <span>헬로우워크 천안불당점</span>
            <span>|</span>
            <span>대표 문의: 010-8695-5132</span>
            <span>|</span>
            <span>충남 천안시 서북구 불당23로 70 (정우프라자 7층)</span>
          </div>
          <p>© 2026 Hello Work Buldang. All Rights Reserved. Powered by CreAibox Client Builder.</p>
        </div>
      </footer>

      {/* 🌟 9. Interactive Inquiry Modal Dialog */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                1:1 입주 및 방문 문의
              </span>
              <h3 className="text-xl font-black text-white">헬로우워크 상담 신청</h3>
              <p className="text-xs text-slate-400 font-medium">
                원하시는 문의 유형을 선택하고 연락처를 남겨주시면 빠르게 연락해 드립니다.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold text-slate-300">
              <div>
                <label className="block mb-1 text-slate-400">문의 희망 서비스</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="독립 오피스 (1인~다인실)">독립 오피스 (1인~다인실)</option>
                  <option value="비상주 오피스 (사업자등록 주소지)">비상주 오피스 (사업자등록 주소지)</option>
                  <option value="성인 전용 몰입 스터디카페">성인 전용 몰입 스터디카페</option>
                  <option value="무료 방문 투어 예약">무료 방문 투어 예약</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">성함 *</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">연락처 *</label>
                <input
                  type="tel"
                  placeholder="예: 010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">추가 메모 / 입주 희망일</label>
                <textarea
                  rows={3}
                  placeholder="희망하는 입주 시기나 문의사항을 자유롭게 작성해 주세요."
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-sm font-black text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                {formSubmitted ? (
                  <>신청 정보를 전송하는 중입니다...</>
                ) : (
                  <>
                    <Send size={16} /> 1:1 상담 및 방문 신청 완료하기
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
