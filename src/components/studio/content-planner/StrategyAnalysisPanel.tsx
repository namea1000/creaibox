"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  searchTraffic?: string;
  monetization?: string;
  competition?: string;
  recommendedMix?: string;
};

export default function StrategyAnalysisPanel({
  searchTraffic = "높음",
  monetization = "중간 이상",
  competition = "보통",
  recommendedMix = "블로그 + 쇼츠",
}: Props) {
  const items = [
    ["예상 검색 유입", searchTraffic],
    ["예상 수익화", monetization],
    ["경쟁 강도", competition],
    ["추천 조합", recommendedMix],
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <CheckCircle2 size={18} />
        </div>
        <h2 className="text-sm font-black text-white">콘텐츠 전략 분석</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-black text-cyan-200">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}