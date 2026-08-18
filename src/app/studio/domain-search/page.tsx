"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  RefreshCw,
  X,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Script from "next/script";
import DomainTabHeader from "./components/DomainTabHeader";
import PaymentConfirmModal from "@/components/common/PaymentConfirmModal";
import PortOnePgWindowModal from "@/components/common/PortOnePgWindowModal";

const TLD_PRESETS = [
  { tld: ".com", wholesale: 15750, market: 25850, category: "global", label: "글로벌 표준" },
  { tld: ".kr", wholesale: 18900, market: 23500, category: "korea", label: "대한민국 대표" },
  { tld: ".co.kr", wholesale: 18900, market: 23500, category: "korea", label: "기업 전용" },
  { tld: ".io", wholesale: 53186, market: 65000, category: "tech", label: "테크·스타트업" },
  { tld: ".ai", wholesale: 112000, market: 140000, category: "tech", label: "인공지능 특화" },
  { tld: ".net", wholesale: 17500, market: 26500, category: "global", label: "네트워크·인프라" },
  { tld: ".shop", wholesale: 4200, market: 18000, category: "biz", label: "이커머스·쇼핑몰" },
  { tld: ".store", wholesale: 3900, market: 17500, category: "biz", label: "브랜드 스토어" },
];

export default function DomainSearchPage() {
  // Auth & Modal State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Domain Payment Modal States
  const [paymentConfirmModalData, setPaymentConfirmModalData] = useState<{
    isOpen: boolean;
    domainName: string;
    amount: number;
  }>({
    isOpen: false,
    domainName: "",
    amount: 0,
  });
  const [isPgModalOpen, setIsPgModalOpen] = useState<boolean>(false);
  const [activeDomainForPg, setActiveDomainForPg] = useState<{ domainName: string; amount: number } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTld, setSelectedTld] = useState(".com");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  // Buying State
  const [buyingDomain, setBuyingDomain] = useState<string | null>(null);
  const [buySuccessData, setBuySuccessData] = useState<any | null>(null);

  // Filtered TLD list
  const filteredTlds = useMemo(() => {
    if (selectedCategory === "all") return TLD_PRESETS;
    return TLD_PRESETS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Sample Mock Data
  const sampleDomains = [
    {
      domain: "auramerino.com",
      available: true,
      wholesalePrice: 15750,
      marketPrice: 25850,
      recommended: true,
      tag: "즉시 무제한 커스텀 웹사이트 연결 가능",
    },
    {
      domain: "auramerino.kr",
      available: true,
      wholesalePrice: 18900,
      marketPrice: 23500,
      recommended: false,
      tag: "국내 타겟 자사몰 최적화 도메인",
    },
    {
      domain: "auramerino.ai",
      available: true,
      wholesalePrice: 112000,
      marketPrice: 140000,
      recommended: true,
      tag: "차세대 AI 테크 프리미엄 도메인",
    },
    {
      domain: "mybrand.com",
      available: true,
      wholesalePrice: 15750,
      marketPrice: 25850,
      recommended: true,
      tag: "즉시 무제한 커스텀 웹사이트 연결 가능",
    },
    {
      domain: "creaibox.io",
      available: false,
      wholesalePrice: 53186,
      marketPrice: 65000,
      recommended: false,
      tag: "이미 타인이 선점하여 사용 중인 도메인",
    },
  ];

  // Real Search Handler
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
  const handleBuyDomain = (domainName: string, amount: number = 15750) => {
    if (!requireAuth()) return;
    setPaymentConfirmModalData({
      isOpen: true,
      domainName,
      amount,
    });
  };

  const handleConfirmDomainPayment = () => {
    const { domainName, amount } = paymentConfirmModalData;
    setPaymentConfirmModalData({ isOpen: false, domainName: "", amount: 0 });
    setActiveDomainForPg({ domainName, amount });
    setIsPgModalOpen(true);
  };

  const handleDomainPgSuccess = async () => {
    if (!activeDomainForPg) return;
    const { domainName, amount } = activeDomainForPg;

    setIsPgModalOpen(false);
    setBuyingDomain(domainName);

    try {
      const mockPaymentId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const res = await fetch("/api/domains/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domainName,
          paymentId: mockPaymentId,
          amount,
          userEmail: currentUser?.email,
          mock: true,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBuySuccessData(data);
      } else {
        alert(`도메인 구매 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      alert(`도메인 결제 처리 중 오류: ${err.message}`);
    } finally {
      setBuyingDomain(null);
      setActiveDomainForPg(null);
    }
  };

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- TLD QUICK PRICE STATS SUMMARY --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>.com 글로벌 표준</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">39% 절약</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
              연 15,750원
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-through">시중가 25,850원</p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>.kr 한국 공식</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">20% 절약</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
              연 18,900원
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-through">시중가 23,500원</p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>.ai 인공지능 테크</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">원가 연동</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
              연 112,000원
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-through">시중가 140,000원</p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>.shop 이커머스</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">76% 파격</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
              연 4,200원
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-through">시중가 18,000원</p>
          </div>
        </div>

        {/* --- MAIN SEARCH CARD --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                원하는 브랜드 도메인 실시간 검색 및 최저가 즉시 구매
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                원하시는 브랜드 영문명(예: auramerino, mybrand)을 입력하시면 구매 가능 여부와 실시간 도매 공급가를 확인합니다.
              </p>
            </div>

            {/* TLD Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { id: "all", label: "전체 확장자" },
                { id: "global", label: "글로벌 (.com / .net)" },
                { id: "korea", label: "국내 (.kr / .co.kr)" },
                { id: "tech", label: "AI·테크 (.ai / .io)" },
                { id: "biz", label: "쇼핑몰·비즈니스 (.shop / .store)" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="원하는 브랜드 영문명 입력 (예: auramerino, mybrand)"
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
              </div>

              <select
                value={selectedTld}
                onChange={(e) => setSelectedTld(e.target.value)}
                className="rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer"
              >
                {filteredTlds.map((item) => (
                  <option key={item.tld} value={item.tld}>
                    {item.tld} ({item.label} - 연 {item.wholesale.toLocaleString()}원)
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isSearching}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSearching ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>실시간 도메인 검색</span>
              </button>
            </form>
          </div>

          {/* Results Table List */}
          <div className="p-0">
            <div className="px-5 py-3 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                추천 브랜드 도메인 가용성 & 실시간 도매가
              </span>
              <span className="text-[11px] font-normal text-slate-500 dark:text-zinc-400">
                Vercel Global Edge IP (76.76.21.21) 즉시 자동 바인딩 지원
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {(searchResults || sampleDomains).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 hover:bg-slate-50/60 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${
                        item.available ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                          {item.domain}
                        </span>
                        {item.recommended && (
                          <span className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                            추천 도메인
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            item.available
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {item.available ? "구매 가능 ⭕" : "등록 불가 ❌"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{item.tag}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 line-through mr-1.5">
                        시중가 {item.marketPrice?.toLocaleString()}원
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        연 {item.wholesalePrice?.toLocaleString()}원
                      </span>
                    </div>

                    {item.available ? (
                      <button
                        onClick={() => handleBuyDomain(item.domain, item.wholesalePrice)}
                        disabled={buyingDomain === item.domain}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {buyingDomain === item.domain && (
                          <RefreshCw size={12} className="animate-spin" />
                        )}
                        <span>도매가 구매하기</span>
                      </button>
                    ) : (
                      <Link
                        href="/studio/domain-search/transfer"
                        className="rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 px-3.5 py-2 text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                      >
                        소유자면 이관하기 ➔
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3-STEP INTEGRATION BANNER --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-6 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
            🚀 CreaiBox 도메인 구매 후 1초 자동 연동 3단계
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-zinc-400">
            <div className="rounded-md border border-slate-200/60 dark:border-zinc-800/60 p-3 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1. 도메인 검색 & 결제</span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                원하는 독립 도메인을 도매 원가로 즉시 결제(PG)합니다.
              </p>
            </div>
            <div className="rounded-md border border-slate-200/60 dark:border-zinc-800/60 p-3 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">2. Edge IP 자동 바인딩</span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                결제 즉시 Vercel 글로벌 엣지 서버(76.76.21.21)에 A 레코드가 연결됩니다.
              </p>
            </div>
            <div className="rounded-md border border-slate-200/60 dark:border-zinc-800/60 p-3 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">3. 웹사이트·블로그 활성화</span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                커스텀 웹사이트 템플릿과 블로그에 0.01초 만에 전 세계 서빙이 시작됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-zinc-800 rounded-lg p-6 max-w-sm w-full text-center space-y-4 shadow-xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                로그인이 필요한 서비스입니다
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                실시간 도메인 검색 및 간편 구매 서비스를 이용하기 위해 로그인이 필요합니다.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login?redirect=/studio/domain-search"
                className="w-full inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                로그인 하러 가기
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Purchase Success Modal */}
      {buySuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-zinc-800 rounded-lg p-6 max-w-md w-full text-left space-y-4 shadow-xl relative">
            <button
              onClick={() => setBuySuccessData(null)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  도메인 구매 및 Edge 연결 완료
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {buySuccessData.mock ? "모의 테스트 승인 완료" : "결제 승인 완료"}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/50 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">등록 도메인</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{buySuccessData.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">결제 금액</span>
                <span className="font-bold text-slate-900 dark:text-white">연 {(buySuccessData.amount || 15750).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">DNS A Record</span>
                <span className="font-mono text-slate-900 dark:text-white">76.76.21.21</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href="/studio/client-site-builder"
                className="flex-1 inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity text-center"
              >
                웹사이트 템플릿에 연결하기
              </Link>
              <button
                onClick={() => setBuySuccessData(null)}
                className="px-4 py-2.5 rounded-md border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modals */}
      <PaymentConfirmModal
        isOpen={paymentConfirmModalData.isOpen}
        orderName={`CreaiBox 독립 브랜드 도메인 (${paymentConfirmModalData.domainName}) 매입`}
        totalAmount={paymentConfirmModalData.amount}
        customerEmail={currentUser?.email}
        onConfirm={handleConfirmDomainPayment}
        onClose={() => setPaymentConfirmModalData({ isOpen: false, domainName: "", amount: 0 })}
      />

      <PortOnePgWindowModal
        isOpen={isPgModalOpen}
        orderName={activeDomainForPg ? `CreaiBox 독립 브랜드 도메인 (${activeDomainForPg.domainName}) 매입` : "도메인 매입"}
        totalAmount={activeDomainForPg?.amount || 15750}
        customerEmail={currentUser?.email || "customer@creaibox.com"}
        onSuccess={handleDomainPgSuccess}
        onClose={() => setIsPgModalOpen(false)}
      />

      {/* PortOne SDK */}
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="lazyOnload" />
    </div>
  );
}
