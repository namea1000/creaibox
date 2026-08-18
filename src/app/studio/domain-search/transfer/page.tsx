"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Globe,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import DomainTabHeader from "../components/DomainTabHeader";

const REGISTRAR_GUIDES = [
  {
    id: "gabia",
    name: "가비아 (Gabia)",
    steps: [
      "가비아 홈페이지 로그인 ➔ [My가비아] ➔ [서비스 관리]로 이동합니다.",
      "이관할 도메인의 [관리툴]을 클릭하고 [도메인 잠금(Lock)]을 '해제'로 변경합니다.",
      "[정보변경/보안관리] ➔ [도메인 인증코드(EPP Code)] 발급 버튼을 눌러 인증키를 복사합니다.",
      "CreaiBox 이관 신청 입력창에 도메인과 인증키를 입력하고 신청합니다.",
    ],
    link: "https://www.gabia.com",
  },
  {
    id: "whois",
    name: "후이즈 (Whois)",
    steps: [
      "후이즈 로그인 ➔ [도메인 관리] ➔ [내 도메인 목록]으로 이동합니다.",
      "도메인 선택 후 [도메인 잠금 설정]을 'OFF'로 변경합니다.",
      "[타사 이전 신청/인증키 확인] 메뉴에서 인증키를 확인하여 복사합니다.",
      "CreaiBox 이관 입력창에 입력 후 이관을 시작합니다.",
    ],
    link: "https://whois.co.kr",
  },
  {
    id: "cafe24",
    name: "카페24 (Cafe24)",
    steps: [
      "카페24 도메인 관리자 로그인 ➔ [도메인 관리] ➔ [도메인 정보조회/변경]으로 이동합니다.",
      "[도메인 락(Lock) 해제]를 클릭하여 잠금을 해제합니다.",
      "[인증코드(EPP) 신청] 버튼을 눌러 이메일 또는 화면에서 인증코드를 복사합니다.",
      "CreaiBox 이관 신청 양식에 입력합니다.",
    ],
    link: "https://domain.cafe24.com",
  },
  {
    id: "godaddy",
    name: "GoDaddy / 해외 등록처",
    steps: [
      "GoDaddy 계정 로그인 ➔ [도메인 포트폴리오]로 이동합니다.",
      "도메인을 클릭하고 [도메인 잠금] 상태를 '해제'합니다.",
      "페이지 하단 [도메인 이전] ➔ [인증 코드 받기]를 클릭하여 EPP 코드를 복사합니다.",
      "CreaiBox에 입력 후 이관을 완료합니다.",
    ],
    link: "https://www.godaddy.com",
  },
];

export default function DomainTransferPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [transferDomain, setTransferDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedRegistrar, setSelectedRegistrar] = useState("gabia");

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

  const currentGuide = REGISTRAR_GUIDES.find((g) => g.id === selectedRegistrar) || REGISTRAR_GUIDES[0];

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- TRANSFER FORM CARD --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  타사(가비아/후이즈/카페24/GoDaddy) 보유 도메인 CreaiBox로 간편 이관
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  기존 등록처에서 발급받은 인증코드(EPP Code)만 입력하시면, 높은 갱신 비용 없이 해외 도매가(연 18,000원) 및 Vercel Edge 1초 바인딩 혜택으로 즉시 이관됩니다.
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                <CheckCircle2 size={13} />
                WHOIS 평생 0원 무료 이관
              </span>
            </div>

            <form onSubmit={handleTransferDomain} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-6 relative">
                <input
                  type="text"
                  value={transferDomain}
                  onChange={(e) => setTransferDomain(e.target.value)}
                  placeholder="이관할 도메인 주소 (예: mybrand.com)"
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
              </div>

              <div className="sm:col-span-4 relative">
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="인증코드 (EPP Code / 기관이전 인증키)"
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isTransferring}
                className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isTransferring && <RefreshCw size={14} className="animate-spin" />}
                <span>도메인 이관 신청</span>
              </button>
            </form>
          </div>

          {/* 4-Step Status Pipeline */}
          <div className="px-5 sm:px-6 py-4 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-3">
              도메인 이관 4단계 실시간 프로세스
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  1. 이관 신청
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">EPP 인증키 접수</p>
              </div>

              <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  2. 인증키 검증
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">ICANN 레지스트라 확인</p>
              </div>

              <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  3. 이전 기관 승인
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">기존 등록업체 자동 이메일</p>
              </div>

              <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  4. Edge 바인딩 완료
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">0.01초 서빙 개시</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- REGISTRAR EPP GUIDE TABS --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs space-y-0">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              주요 도메인 등록업체별 인증키(EPP Code) 발급 가이드
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              현재 도메인이 등록되어 있는 업체를 선택하시면 1분 만에 인증키를 발급받는 방법을 안내해 드립니다.
            </p>

            {/* Registrar Tab Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {REGISTRAR_GUIDES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegistrar(r.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRegistrar === r.id
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-2.5">
              {currentGuide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 dark:text-zinc-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 font-mono font-bold text-slate-900 dark:text-white">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={currentGuide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                <span>{currentGuide.name} 관리 페이지 바로가기</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* --- PRE-TRANSFER CHECKLIST --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-6 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-500" />
            도메인 이관 전 필수 체크리스트 (ICANN 공통 규정)
          </h3>
          <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
            <li>도메인 신규 등록 또는 이전 후 최소 <strong>60일</strong>이 경과해야 타사 이관이 가능합니다.</li>
            <li>도메인 만료일이 최소 <strong>7일 이상</strong> 남아있는 상태에서 이관을 신청해 주세요.</li>
            <li>기존 등록처의 WHOIS 등록자 이메일 주소로 이관 승인 확인 메일이 발송되므로 수신 가능한 메일인지 확인해 주세요.</li>
          </ul>
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
                타사 도메인 이관 신청을 위해 로그인이 필요합니다.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login?redirect=/studio/domain-search/transfer"
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
    </div>
  );
}
