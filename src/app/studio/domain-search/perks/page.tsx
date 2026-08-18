"use client";

import React from "react";
import DomainTabHeader from "../components/DomainTabHeader";
import {
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Clock,
  Bell,
  RefreshCw,
  Server,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const LIFECYCLE_STEPS = [
  {
    step: "1. 신규 등록 (Active)",
    duration: "1년 ~ 10년",
    desc: "도메인 구매 즉시 활성화되며 Vercel Global Edge IP (76.76.21.21)에 1초 바인딩됩니다.",
    badge: "정상 운영",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    step: "2. 사전 갱신 알림 (Reminder)",
    duration: "만료 30일 / 7일 전",
    desc: "도메인 낙장을 방지하기 위해 등록자 이메일과 카카오 알림톡으로 갱신 안내를 자동 발송합니다.",
    badge: "안심 알림",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    step: "3. 만료 유예 기간 (Grace Period)",
    duration: "만료 후 0일 ~ 30일",
    desc: "만료 직후 웹사이트 접속은 일시 중단되나, 추가 벌금 없이 원가 그대로 즉시 복구·연장 가능합니다.",
    badge: "무벌금 복구",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    step: "4. 복구 상환 기간 (Redemption Period)",
    duration: "만료 후 30일 ~ 60일",
    desc: "ICANN 중앙 레지스트라 보관 기간으로, 레지스트라 복구 수수료 납부 후 복구 가능합니다.",
    badge: "상환 보호",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    step: "5. 완전 삭제 및 공개 방어 (Pending Delete)",
    duration: "만료 후 60일 이후",
    desc: "CreaiBox는 회원의 소중한 브랜드 도메인이 스나이퍼 봇에 강탈되지 않도록 사전 갱신을 강력 지원합니다.",
    badge: "낙장 방어",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export default function DomainPerksPage() {
  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- 4 CORE PILLARS --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              CreaiBox 도메인 4대 핵심 정책 & 회원 특별 혜택
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              모든 회원은 거품 없는 해외 도매 원가로 도메인을 등록·연장할 수 있으며, 구매 즉시 Vercel Global Edge 네트워크와 완벽하게 바인딩됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Globe size={18} className="text-cyan-500" />
                <span>1. Vercel Global Anycast Edge 0.01초 자동 바인딩</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                복잡한 네임서버 및 DNS 레코드 수동 설정 없이, 도메인 구매 즉시 Vercel 전 세계 300여 개 글로벌 Anycast Edge 서버(76.76.21.21)에 1초 만에 자동 연결됩니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Lock size={18} className="text-emerald-500" />
                <span>2. WHOIS 개인정보 보호 평생 무료 (0원)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                도메인 소유자의 이름, 자택/회사 주소, 전화번호, 이메일이 스팸 수집봇에 노출되지 않도록 강력한 프라이버시 마스킹을 평생 100% 무상(0원)으로 제공합니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <ShieldCheck size={18} className="text-indigo-500" />
                <span>3. 와일드카드 SSL 보안 인증서 무한 자동 갱신</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                타사에서 매년 3~5만 원씩 부과하는 SSL 발급 비용 없이, Let's Encrypt / DigiCert 고성능 와일드카드 인증서가 평생 자동으로 발급 및 무중단 갱신됩니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Zap size={18} className="text-amber-500" />
                <span>4. 투명한 무마진 도매 원가 공급 원칙</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                중간 유통 대행사의 과도한 마진 거품을 완전히 제거하고, 국제 ICANN 공식 레지스트라 원가 그대로 회원님들께 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* --- DOMAIN LIFECYCLE TIMELINE --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-slate-500" />
                <span>도메인 수명 주기 (Lifecycle) 및 낙장 방어 정책</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                ICANN 표준 규정에 따른 도메인 만료 및 보호 타임라인입니다.
              </p>
            </div>

            <Link
              href="/studio/domain-search"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white hover:underline"
            >
              <span>도메인 등록하기</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5 pt-2">
            {LIFECYCLE_STEPS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.step}</span>
                    <span className="text-[11px] font-mono text-slate-400">({item.duration})</span>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 leading-snug">{item.desc}</p>
                </div>

                <span className={`self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${item.badgeColor} shrink-0`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
