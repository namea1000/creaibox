"use client";

import React, { useState } from "react";
import { Database, HelpCircle, TrendingUp, Calculator } from "lucide-react";

export default function CpmCalculator() {
  const [views, setViews] = useState<number>(100000); // Default 100k views
  const [cpm, setCpm] = useState<number>(3500); // Default CPM ₩3,500
  const [impressionsPct, setImpressionsPct] = useState<number>(45); // Default 45% ad impressions

  const calculateRevenue = (inputViews: number) => {
    // Ad views = total views * impressions percentage
    const adViews = inputViews * (impressionsPct / 100);
    // Gross revenue = (ad views / 1000) * CPM
    const gross = (adViews / 1000) * cpm;
    // Creator net share = 55%
    const net = gross * 0.55;
    // RPM = (net / total views) * 1000
    const rpm = (net / inputViews) * 1000;

    return {
      gross: Math.floor(gross),
      net: Math.floor(net),
      rpm: rpm.toFixed(1),
    };
  };

  const results = calculateRevenue(views);
  const tiers = [10000, 50000, 100000, 500000, 1000000];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Calculator className="text-violet-400" size={20} />
          유튜브 광고 단가 계산기 (CPM/RPM)
        </h2>
        <p className="text-xs text-zinc-550 mb-6 leading-relaxed">
          조회수와 타겟 카테고리 광고 단가(CPM), 그리고 영상 내 실제 광고 게재 비율을 조절하여 크리에이터의 예상 실수령 수익과 RPM을 즉석에서 계산합니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sliders panel */}
          <div className="space-y-5">
            {/* Views Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>예상 동영상 조회수</span>
                <span className="text-white font-extrabold">{views.toLocaleString()} 회</span>
              </div>
              <input
                type="range"
                min={5000}
                max={2000000}
                step={5000}
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-violet-500"
              />
            </div>

            {/* CPM Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>예상 1,000회 노출당 광고 단가 (CPM)</span>
                <span className="text-white font-extrabold">₩{cpm.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={100}
                value={cpm}
                onChange={(e) => setCpm(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-[9px] text-zinc-600 block">한국 평균 단가: ₩2,500 ~ ₩4,500 내외</span>
            </div>

            {/* Ad impressions percent slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>광고 노출 비율 (게재율)</span>
                <span className="text-white font-extrabold">{impressionsPct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={impressionsPct}
                onChange={(e) => setImpressionsPct(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-[9px] text-zinc-600 block">조회수 중 실제 광고가 로드되어 노출된 평균 비율</span>
            </div>
          </div>

          {/* Metrics Displays */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-550">크리에이터 예상 실수령액 (수수료 45% 제외)</p>
                <p className="text-3xl font-black text-violet-400 mt-1">₩{results.net.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4 text-xs font-bold text-zinc-450">
                <div>
                  <p className="text-[9px] font-bold text-zinc-550">조회수 1,000회당 수익 (RPM)</p>
                  <p className="text-sm font-black text-white mt-1">₩{Number(results.rpm).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-550">광고주 지출 총액 (Gross)</p>
                  <p className="text-sm font-black text-white mt-1">₩{results.gross.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-3 flex gap-2 items-start text-[10px] leading-relaxed text-zinc-500 font-medium">
              <HelpCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              크리에이터 배분율(55%)을 기준으로 자동 연산되었습니다. 실제 수익은 시청 국가, 조회 타겟 연령대 및 동영상 길이에 따라 상이할 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* Views tiers projections table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
          <TrendingUp size={16} className="text-violet-400" />
          누적 조회수별 수익 전망 테이블
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                <th className="py-3 px-4">동영상 조회수</th>
                <th className="py-3 px-4 text-center">예상 광고 노출수</th>
                <th className="py-3 px-4 text-center">광고주 총비용</th>
                <th className="py-3 px-4 text-right">크리에이터 최종 정산 (55%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {tiers.map((tier) => {
                const calculations = calculateRevenue(tier);
                const adViews = tier * (impressionsPct / 100);

                return (
                  <tr key={tier} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                    <td className="py-3 px-4 font-black text-white">{tier.toLocaleString()}회</td>
                    <td className="py-3 px-4 text-center">{Math.floor(adViews).toLocaleString()}회</td>
                    <td className="py-3 px-4 text-center">₩{calculations.gross.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-violet-400 font-extrabold">₩{calculations.net.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
