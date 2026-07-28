"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  Globe,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Zap,
  ShieldCheck,
  Award,
  Crown,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function DomainSearchPage() {
  const [activeTab, setActiveTab] = useState<string>("search");

  // Auth & Modal State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    void loadUser();
  }, [supabase]);

  const requireAuth = (action?: () => void): boolean => {
    if (!currentUser) {
      setShowLoginModal(true);
      return false;
    }
    if (action) action();
    return true;
  };

  // State 1: Domain Realtime Availability Check
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTld, setSelectedTld] = useState(".com");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  // State 2: External Domain Transfer-In State
  const [transferDomain, setTransferDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // State 3: Buying State
  const [buyingDomain, setBuyingDomain] = useState<string | null>(null);

  // State 4: FAQ Expand States
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Mock initial search sample data
  const sampleDomains = [
    {
      domain: "auramerino.com",
      available: true,
      wholesalePrice: 18000,
      marketPrice: 25850,
      recommended: true,
      tag: "1초 무제한 커스텀 사이트 연결",
    },
    {
      domain: "auramerino.kr",
      available: true,
      wholesalePrice: 19000,
      marketPrice: 23500,
      recommended: false,
      tag: "1초 무제한 커스텀 사이트 연결",
    },
    {
      domain: "mybrand.com",
      available: true,
      wholesalePrice: 18000,
      marketPrice: 25850,
      recommended: true,
      tag: "1초 무제한 커스텀 사이트 연결",
    },
    {
      domain: "creaibox.io",
      available: false,
      wholesalePrice: 48000,
      marketPrice: 65000,
      recommended: false,
      tag: "이미 타인이 사용 중인 도메인",
    },
  ];

  // Real Search Handler (calls Vercel Domains API + Real DNS)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const cleanName = searchQuery.trim().toLowerCase().replace(/^https?:\/\//, "");
      const res = await fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanName, tld: selectedTld }),
      });
      const data = await res.json();

      if (res.ok && data.results) {
        setSearchResults(data.results);
      } else {
        alert(data.error || "도메인 조회 실패");
      }
    } catch {
      alert("도메인 조회 중 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  // Real Domain Buy Handler
  const handleBuyDomain = async (domainName: string) => {
    if (!requireAuth()) return;
    if (!confirm(`${domainName} 도메인을 18,000원에 구매하시겠습니까?\n(구매 즉시 CreAibox 글로벌 Edge IP로 1초 자동 연동됩니다)`)) {
      return;
    }

    setBuyingDomain(domainName);
    try {
      const res = await fetch("/api/domains/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainName }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`🎉 축하합니다! ${domainName} 도메인 구매가 완료되었습니다!\n${data.message}`);
      } else {
        alert(`도메인 구매 실패: ${data.error}`);
      }
    } catch {
      alert("도메인 결제 처리 중 오류가 발생했습니다.");
    } finally {
      setBuyingDomain(null);
    }
  };

  // Real Domain Transfer-In Handler
  const handleTransferDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!transferDomain.trim()) return;

    setIsTransferring(true);
    try {
      const res = await fetch("/api/domains/transfer-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: transferDomain, authCode }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`🎉 ${transferDomain} 도메인 이관 신청이 완료되었습니다!\n${data.message}`);
        setTransferDomain("");
        setAuthCode("");
      } else {
        alert(`이관 실패: ${data.error}`);
      }
    } catch {
      alert("도메인 이관 처리 중 오류가 발생했습니다.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-10 font-sans selection:bg-cyan-500/30">
      {/* --- HERO HEADER BANNER --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-black text-cyan-300">
              <Globe size={14} className="text-cyan-400 animate-pulse" />
              <span>CreAibox 도메인 센터</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              100% 독창적인 독립 브랜드 도메인 <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">조회 & 1초 자동 구매·이관 센터</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              원하시는 브랜드 도메인 실시간 검색, 국내 타사(G사/W사 등) 1초 이관 신청 및 비즈니스 회원 0원 혜택까지 한눈에 관리하세요. (기존 타사 홈페이지 1초 AI 이관은 <code className="text-cyan-300">커스텀 웹사이트</code> 메뉴에서 가능합니다)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/custom-client-site"
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Zap size={14} />
              <span>커스텀 홈페이지 스튜디오</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- MAIN TAB NAVIGATION BAR (Anchor Jump Buttons) --- */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md pt-2 pb-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => scrollToSection("search")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "search"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Search size={16} />
          <span>1️⃣ 🌐 도메인 실시간 검색 & 1초 구매</span>
        </button>

        <button
          onClick={() => scrollToSection("transfer")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "transfer"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <RefreshCw size={16} />
          <span>2️⃣ 🔄 국내 타사 도메인 1초 이관</span>
        </button>

        <button
          onClick={() => scrollToSection("comparison")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "comparison"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Award size={16} />
          <span>3️⃣ 📊 국내외 도메인 팩트 가격 비교</span>
        </button>

        <button
          onClick={() => scrollToSection("perks")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "perks"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Crown size={16} />
          <span>4️⃣ 👑 비즈니스 회원 0원 혜택 안내</span>
        </button>

        <button
          onClick={() => scrollToSection("faq")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
            activeTab === "faq"
              ? "bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <HelpCircle size={16} />
          <span>5️⃣ ❓ 자주 묻는 질문 (FAQ)</span>
        </button>
      </div>

      {/* --- SECTION 1: 🌐 도메인 실시간 검색 & 1초 구매 --- */}
      <div id="section-search" className="space-y-8 scroll-mt-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Search className="text-cyan-400" /> 원하는 브랜드 도메인 실시간 가용성 & 가격 검색
            </h2>
            <p className="text-xs font-medium text-slate-400">
              원하시는 브랜드명(예: mybrand, auramerino)을 입력하시면 구매 가능 여부와 시중가 대비 할인 가격을 1초 만에 확인합니다.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: auramerino, sotongcheum, mycompany"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            <select
              value={selectedTld}
              onChange={(e) => setSelectedTld(e.target.value)}
              className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-4 text-xs font-bold text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value=".com">.com (추천)</option>
              <option value=".kr">.kr (국내전용)</option>
              <option value=".co.kr">.co.kr (기업전용)</option>
              <option value=".io">.io (테크/스타트업)</option>
              <option value=".net">.net (네트워크)</option>
            </select>

            <button
              type="submit"
              disabled={isSearching}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-black text-white hover:brightness-110 transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isSearching ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              <span>실시간 도메인 검색</span>
            </button>
          </form>

          {/* Real Domain Results List */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" /> 추천 브랜드 도메인 실시간 가용 현황
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                1초 구매 지원 (Vercel IP 76.76.21.21 자동 바인딩)
              </span>
            </div>

            <div className="space-y-3">
              {(searchResults || sampleDomains).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    {item.available ? (
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-rose-400 shrink-0" />
                    )}

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                          {item.domain}
                        </span>
                        {item.recommended && (
                          <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase">
                            Best
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">{item.tag}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500 line-through">
                          시중가 {item.marketPrice?.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-emerald-400">
                          연 {item.wholesalePrice?.toLocaleString()}원
                        </span>
                        <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                          비즈니스 0원
                        </span>
                      </div>
                    </div>

                    {item.available ? (
                      <button
                        onClick={() => handleBuyDomain(item.domain)}
                        disabled={buyingDomain === item.domain}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {buyingDomain === item.domain ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Zap size={14} />
                        )}
                        <span>1초 구매하기</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed shrink-0"
                      >
                        소유 도메인이면 이관하기 ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: 🔄 국내 타사 도메인 1초 이관 --- */}
      <div id="section-transfer" className="space-y-8 scroll-mt-24">
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <RefreshCw className="text-emerald-400" /> 타사(G사/W사 등) 보유 도메인을 CreAibox로 1초 이관 신청
            </h2>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              기존에 다른 곳에서 사용 중이던 도메인의 인증코드(EPP Code)만 입력하시면, 연간 높은 갱신 비용 없이 해외 도매가(18,000원) 및 비즈니스 0원 무상 연장 혜택으로 즉시 이관됩니다.
            </p>
          </div>

          <form onSubmit={handleTransferDomain} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={transferDomain}
                onChange={(e) => setTransferDomain(e.target.value)}
                placeholder="이관할 도메인 주소 (예: mybrand.com)"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none shadow-inner"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="인증코드 (EPP Code / 기관이전 인증키)"
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isTransferring}
              className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-sm font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isTransferring ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              <span>이관 신청</span>
            </button>
          </form>
        </div>
      </div>

      {/* --- SECTION 3: 📊 국내외 도메인 팩트 가격 비교 --- */}
      <div id="section-comparison" className="space-y-8 scroll-mt-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="text-amber-400" /> 국내 타사 vs CreAibox 도메인 리셀러 요금 팩트 비교표
            </h2>
            <p className="text-xs font-medium text-slate-400">
              타사의 부가서비스(WHOIS 비밀보호, SSL 발급비) 꼼수 비용 없이, 순수 도매가 18,000원에 제공합니다.
            </p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-medium text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold">
                  <th className="p-4">구분 / 항목</th>
                  <th className="p-4">국내 타사 (G사 / W사 / C사 등)</th>
                  <th className="p-4 text-cyan-300 font-extrabold">CreAibox 도메인 리셀러</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-4 font-bold text-white">.com / .net 1년 등록비</td>
                  <td className="p-4 text-slate-400">25,850원 ~ 28,600원/년 (VAT 10% 포함)</td>
                  <td className="p-4 text-emerald-400 font-black">18,000원/년 (해외 도매가 100% 동일 적용)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">WHOIS 개인정보 보호 서비스</td>
                  <td className="p-4 text-slate-400">연간 1,500원 ~ 3,000원 추가 비용 유료 부과</td>
                  <td className="p-4 text-cyan-300 font-bold">100% 평생 무상 지원 (0원)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">SSL 보안 인증서 자동 발급</td>
                  <td className="p-4 text-slate-400">별도 보안 인증서 설치비 (연간 3~5만원)</td>
                  <td className="p-4 text-cyan-300 font-bold">Vercel Global Edge SSL 1초 자동 연동 (0원)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">CreAibox 비즈니스 회원 혜택</td>
                  <td className="p-4 text-slate-400">해당 없음</td>
                  <td className="p-4 text-purple-300 font-black">비즈니스 플랜 사용 시 도메인 연장비 평생 0원 무상지원 ⭕</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: 👑 비즈니스 회원 0원 혜택 안내 --- */}
      <div id="section-perks" className="space-y-8 scroll-mt-24">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-6 lg:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-purple-400 shrink-0" />
            <div>
              <h2 className="text-xl font-black text-white">CreAibox 비즈니스 회원 전용: 도메인 갱신비 평생 0원 혜택</h2>
              <p className="text-xs font-medium text-slate-300">
                월 49,000원 Business 플랜 이용자분들께는 매년 발생하는 도메인 연장비를 CreAibox가 100% 전액 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 5: ❓ 자주 묻는 질문 (FAQ) --- */}
      <div id="section-faq" className="space-y-8 scroll-mt-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <HelpCircle className="text-rose-400" /> 도메인 구매 및 이관 자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs font-medium text-slate-400">
              도메인 구매, 이관 및 연동과 관련하여 자주 발생하는 문의사항입니다.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                q: "구매한 도메인은 CreAibox 홈페이지에 몇 초 만에 연동되나요?",
                a: "결제 완료 즉시 Vercel Global Edge IP (76.76.21.21)에 1초 자동 바인딩되어 별도의 complex DNS 설정 없이 즉시 연결됩니다.",
              },
              {
                q: "타사(G사, W사 등)에서 쓰던 도메인도 CreAibox로 옮겨올 수 있나요?",
                a: "네! 타사 도메인 관리 페이지에서 '기관이전 인증키(EPP Code)'를 발급받으신 후 2번 이관 메뉴에 입력하시면 1초 만에 이관 신청이 완료됩니다.",
              },
              {
                q: "기존 타사 홈페이지 1초 AI 이관은 어느 메뉴에서 이용하나요?",
                a: "기존 홈페이지의 텍스트, 이미지, 전화번호, 주소를 CreAibox 자사몰 사이트(000.creaibox.com)로 옮기는 기능은 [커스텀 웹사이트] -> [2️⃣ 기존 홈페이지 1초 AI 이관] 탭에서 이용하실 수 있습니다.",
              },
              {
                q: "WHOIS 개인정보 보호 서비스는 정말 0원인가요?",
                a: "네! 타사의 경우 연간 1,500원~3,000원의 부가 요금을 받지만, CreAibox는 도메인 소유자의 이름, 이메일, 전화번호 노출을 막아주는 개인정보 보호를 평생 100% 무료로 제공합니다.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-200">Q. {faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>

                {expandedFaq === idx && (
                  <div className="p-4 pt-0 text-xs font-medium text-slate-400 border-t border-slate-900 bg-slate-900/30 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Prompt Modal Popup for unauthenticated users taking action */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mx-auto w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <Globe size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">
                로그인이 필요한 서비스입니다
              </h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                실시간 도메인 검색·원클릭 구매 및 타사 도메인 1초 이관 서비스를 이용하기 위해 로그인이 필요합니다. <br />
                로그인 후 1초 만에 나만의 맞춤형 도메인을 연결해 보세요!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login?redirect=/studio/domain-search"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>🔑 로그인 하러 가기</span>
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-400 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <span>둘러보기 계속하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
