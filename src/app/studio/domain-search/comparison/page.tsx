"use client";

import React, { useState } from "react";
import DomainTabHeader from "../components/DomainTabHeader";
import { CheckCircle2, XCircle, Sparkles, Calculator, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const TLD_PRICING_TABLE = [
  { tld: ".com", wholesale: 15750, competitor: 28600, privacyIncluded: true, saveRate: "45%" },
  { tld: ".kr", wholesale: 18900, competitor: 23500, privacyIncluded: true, saveRate: "20%" },
  { tld: ".co.kr", wholesale: 18900, competitor: 23500, privacyIncluded: true, saveRate: "20%" },
  { tld: ".io", wholesale: 53186, competitor: 68000, privacyIncluded: true, saveRate: "22%" },
  { tld: ".ai", wholesale: 112000, competitor: 145000, privacyIncluded: true, saveRate: "23%" },
  { tld: ".net", wholesale: 17500, competitor: 27500, privacyIncluded: true, saveRate: "36%" },
  { tld: ".org", wholesale: 18500, competitor: 29000, privacyIncluded: true, saveRate: "36%" },
  { tld: ".shop", wholesale: 4200, competitor: 18500, privacyIncluded: true, saveRate: "77%" },
  { tld: ".store", wholesale: 3900, competitor: 17500, privacyIncluded: true, saveRate: "78%" },
  { tld: ".app", wholesale: 22000, competitor: 33000, privacyIncluded: true, saveRate: "33%" },
];

export default function DomainComparisonPage() {
  const [domainCount, setDomainCount] = useState<number>(1);
  const [years, setYears] = useState<number>(3);

  // Hidden cost calculation
  // Competitor average: 26,000 domain + 3,000 privacy + 35,000 SSL = 64,000 / year
  // CreaiBox: 16,500 domain + 0 privacy + 0 SSL = 16,500 / year
  const competitorTotal = (26000 + 3000 + 35000) * domainCount * years;
  const creaiboxTotal = 16500 * domainCount * years;
  const savedAmount = competitorTotal - creaiboxTotal;

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-7">
        <DomainTabHeader />

        {/* --- SAVINGS SIMULATOR CARD --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator size={18} className="text-emerald-500" />
                <span>3개년 숨은 비용(Hidden Cost) 절감액 실시간 계산기</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                타사의 WHOIS 유료 부가서비스와 SSL 인증서 갱신비를 감안한 실제 총 소유비용(TCO) 비교입니다.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">보유 도메인 수:</span>
                <select
                  value={domainCount}
                  onChange={(e) => setDomainCount(Number(e.target.value))}
                  className="rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 font-bold text-slate-900 dark:text-white text-xs"
                >
                  {[1, 2, 3, 5, 10, 20].map((n) => (
                    <option key={n} value={n}>{n}개</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">운영 기간:</span>
                <select
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 font-bold text-slate-900 dark:text-white text-xs"
                >
                  {[1, 2, 3, 5].map((y) => (
                    <option key={y} value={y}>{y}년</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-slate-500 block">국내 타사 예상 총비용 (도메인+WHOIS+SSL)</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-slate-600 dark:text-zinc-400">
                {competitorTotal.toLocaleString()}원
              </div>
              <p className="text-[11px] text-slate-400">매년 유료 SSL 및 WHOIS 비용 포함</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-slate-500 block">CreaiBox 총비용 (도매 원가+무료혜택)</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                {creaiboxTotal.toLocaleString()}원
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">WHOIS 평생 0원 + Vercel SSL 0원</p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">총 절약 금액 (Savings)</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +{savedAmount.toLocaleString()}원
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">대표님의 소중한 사업 자금 방어</p>
            </div>
          </div>
        </div>

        {/* --- DETAILED 10 TLD PRICING TABLE --- */}
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                주요 10대 확장자(TLD) 공식 공급가 비교표
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                ICANN 및 KISA 등록 기준 연간 도매 원가 비교표입니다. (부가세 포함 기준)
              </p>
            </div>
            <Link
              href="/studio/domain-search"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-white hover:underline"
            >
              <span>도메인 검색하러 가기</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-normal border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-semibold">
                  <th className="p-4 sm:px-6">확장자 (TLD)</th>
                  <th className="p-4 sm:px-6">국내 타사 평균</th>
                  <th className="p-4 sm:px-6 font-bold text-slate-900 dark:text-white">CreaiBox 도매가</th>
                  <th className="p-4 sm:px-6">WHOIS 보호</th>
                  <th className="p-4 sm:px-6 text-right">절감률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                {TLD_PRICING_TABLE.map((row) => (
                  <tr key={row.tld} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {row.tld}
                    </td>
                    <td className="p-4 sm:px-6 font-mono text-slate-400 line-through">
                      연 {row.competitor.toLocaleString()}원
                    </td>
                    <td className="p-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                      연 {row.wholesale.toLocaleString()}원
                    </td>
                    <td className="p-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        평생 무료 (0원)
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">
                        {row.saveRate} 절약
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
