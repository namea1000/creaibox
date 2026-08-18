"use client";

import React, { useState, useMemo } from "react";
import DomainTabHeader from "../components/DomainTabHeader";
import { ChevronDown, ChevronUp, MessageSquare, Headphones, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "전체 FAQ" },
  { id: "buy", label: "구매 & 결제" },
  { id: "transfer", label: "타사 이관" },
  { id: "dns", label: "DNS & Edge 연결" },
  { id: "email", label: "이메일 포워딩" },
  { id: "security", label: "보안 & 소유권" },
];

const FAQ_LIST = [
  {
    category: "dns",
    q: "구매한 도메인은 CreaiBox 웹사이트에 몇 초 만에 연동되나요?",
    a: "결제 완료 즉시 Vercel Global Anycast Edge IP (76.76.21.21)에 A 레코드가 1초 만에 자동 바인딩됩니다. 복잡한 네임서버 설정이나 DNS 전파 대기 시간(24~48시간) 없이 즉시 전 세계 300여 개 엣지에서 초고속으로 열립니다.",
  },
  {
    category: "transfer",
    q: "타사(가비아, 후이즈, 카페24 등)에서 이미 쓰던 도메인도 CreaiBox로 가져올 수 있나요?",
    a: "네, 기존 등록업체에서 [도메인 잠금(Lock) 해제] 후 [기관이전 인증키(EPP Code)]를 발급받으신 다음, [타사 도메인 이관] 메뉴에 입력하시면 즉시 이전 신청됩니다. 이전 후 1년 기간이 추가 연장되며 연 18,000원의 도매가가 적용됩니다.",
  },
  {
    category: "transfer",
    q: "기존 타사 홈페이지 디자인과 글을 통째로 옮기려면 어떻게 하나요?",
    a: "기존 웹사이트의 텍스트, 이미지, 로고, 메뉴 구조를 CreaiBox 최신 반응형 자사몰로 이전하는 것은 [AI 웹사이트 빌더] ➔ [기존 홈페이지 이관] 메뉴에서 AI가 100% 전자동으로 수행해 드립니다.",
  },
  {
    category: "security",
    q: "WHOIS 개인정보 보호 서비스는 정말 평생 0원 무료인가요?",
    a: "네, CreaiBox는 국제 표준 규정에 따라 도메인 소유자의 실명, 전화번호, 이메일, 주소가 스팸 수집봇에 노출되지 않도록 프라이버시 마스킹 보호를 평생 100% 무상(0원)으로 기본 제공합니다.",
  },
  {
    category: "email",
    q: "커스텀 이메일 포워딩(ceo@도메인)은 어떤 원리로 동작하나요?",
    a: "독립 브랜드 도메인으로 수신되는 이메일을 대표님의 평소 개인 이메일(Gmail, Naver 등)로 0.01초 만에 전달해 주는 무상태(Stateless) 포워딩 서비스입니다. 비싼 기업용 메일 서버 월 구독료 없이도 명함에 독점 브랜드 이메일을 인쇄하여 사용하실 수 있습니다.",
  },
  {
    category: "buy",
    q: "도메인 구매 시 어떤 결제 수단을 지원하나요?",
    a: "국내 모든 신용카드/체크카드, 카카오페이, 토스페이, 네이버페이, 실시간 계좌이체 등 PortOne PG 모듈을 통해 100% 안전하게 간편 결제하실 수 있습니다.",
  },
  {
    category: "security",
    q: "SSL 보안 인증서(HTTPS)는 별도로 구매해야 하나요?",
    a: "아닙니다. CreaiBox는 Vercel Global Edge 인프라와 결합되어 있어, 도메인 연결 즉시 Let's Encrypt / DigiCert 와일드카드 SSL 인증서가 평생 100% 무료로 자동 발급 및 무중단 자동 갱신됩니다.",
  },
  {
    category: "buy",
    q: "도메인을 실수로 잘못 구매한 경우 환불이 가능한가요?",
    a: "국제 ICANN 레지스트라 규정상 도메인은 등록 즉시 전 세계 네임서버에 배포되는 디지털 자산이므로 등록 완료 후 취소/환불이 제한됩니다. 검색창에서 영문 철자를 정확히 확인하신 후 결제해 주시기 바랍니다.",
  },
];

export default function DomainFaqPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const filteredFaq = useMemo(() => {
    if (selectedCat === "all") return FAQ_LIST;
    return FAQ_LIST.filter((f) => f.category === selectedCat);
  }, [selectedCat]);

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- FAQ MAIN CARD --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              도메인 구매, 이관 및 연동 관련 자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              도메인 등록부터 Vercel Edge 바인딩, 비즈니스 이메일 설정까지 고객님들이 가장 자주 질문하시는 내용입니다.
            </p>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    selectedCat === cat.id
                      ? "bg-black dark:bg-white text-white dark:text-black font-semibold"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {filteredFaq.map((faq, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:px-6 text-left hover:bg-slate-50/60 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 pr-4">
                    Q. {faq.q}
                  </span>
                  {expandedFaq === idx ? (
                    <ChevronUp size={15} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronDown size={15} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                  )}
                </button>

                {expandedFaq === idx && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100/60 dark:border-zinc-800/40 pt-3 bg-slate-50/30 dark:bg-zinc-900/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- 1:1 SUPPORT BANNER --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-900 dark:text-white shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                도메인 설정 및 타사 이전이 어려우신가요?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                CreaiBox 전문 엔지니어가 무료로 DNS 레코드 및 타사 도메인 이관을 완벽 대행해 드립니다.
              </p>
            </div>
          </div>

          <Link
            href="/help/inquiry"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-xs"
          >
            <span>1:1 기술 지원 문의</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
