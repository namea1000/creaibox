"use client";

import React, { useState } from "react";
import { Gauge, Hourglass, TrendingUp, DollarSign, Calculator, HelpCircle } from "lucide-react";

export default function ProductivitySection() {
  const [employees, setEmployees] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(25000); // 25,000 KRW
  const [hoursSaved, setHoursSaved] = useState(4); // 4 hours/week
  const [licenseCost, setLicenseCost] = useState(30000); // 30,000 KRW/month per user

  // Calculations
  const weeklyHoursSavedTotal = employees * hoursSaved;
  const monthlyHoursSavedTotal = weeklyHoursSavedTotal * 4.33;
  const monthlySavings = monthlyHoursSavedTotal * hourlyRate;
  const totalLicenseCost = employees * licenseCost;
  const netMonthlySavings = Math.max(0, monthlySavings - totalLicenseCost);
  const annualSavings = netMonthlySavings * 12;
  const roi = totalLicenseCost > 0 ? ((netMonthlySavings / totalLicenseCost) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Gauge size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 생산성 리포트 & ROI 계산기</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              조직 내 AI 도구 도입으로 인한 업무 생산성 가치와 투자 대비 효과(ROI)를 실시간 시뮬레이션합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 입력 컨트롤 */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Calculator size={16} />
            시뮬레이션 변수 설정
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-zinc-650 dark:text-zinc-300">도입 인원 (명)</span>
                <span className="text-indigo-400 font-black">{employees} 명</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-zinc-650 dark:text-zinc-300">평균 시급 (원)</span>
                <span className="text-indigo-400 font-black">{hourlyRate.toLocaleString()} 원</span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-zinc-650 dark:text-zinc-300">주당 1인 절감 시간 (시간)</span>
                <span className="text-indigo-400 font-black">{hoursSaved} 시간</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={hoursSaved}
                onChange={(e) => setHoursSaved(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-zinc-650 dark:text-zinc-300">1인당 월 라이선스 비용 (원)</span>
                <span className="text-indigo-400 font-black">{licenseCost.toLocaleString()} 원</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={licenseCost}
                onChange={(e) => setLicenseCost(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 결과 통계 대시보드 */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">월간 총 절감 시간</span>
                <Hourglass size={16} className="text-indigo-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-zinc-900 dark:text-white">
                {monthlyHoursSavedTotal.toFixed(0)} 시간
              </p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                주당 총 {weeklyHoursSavedTotal}시간 절감 기준
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">월간 도입 투자 비용</span>
                <DollarSign size={16} className="text-red-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-zinc-900 dark:text-white">
                {totalLicenseCost.toLocaleString()} 원
              </p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                라이선스 비용 {licenseCost.toLocaleString()}원 × {employees}명
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">순 월간 절감 가치</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-emerald-500">
                {netMonthlySavings.toLocaleString()} 원
              </p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                시간당 생산성 가치 차감 후 순수익
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">예상 투자대비효과 (ROI)</span>
                <Calculator size={16} className="text-amber-400" />
              </div>
              <p className="mt-3 text-3xl font-black text-amber-500">
                {roi}%
              </p>
              <p className="mt-1 text-[11px] font-medium text-zinc-400">
                투자금액 대비 절감 성과 배율
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-indigo-900/20 to-blue-900/20 p-6 text-zinc-100">
            <h4 className="text-sm font-black text-indigo-300">연간 종합 생산성 성과 예측</h4>
            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">연간 순 절감 가치</p>
                <p className="text-4xl font-black text-white mt-1">₩ {annualSavings.toLocaleString()}</p>
              </div>
              <div className="self-end">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-400">
                  <TrendingUp size={12} />
                  생산성 상승률 +{(hoursSaved / 40 * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
