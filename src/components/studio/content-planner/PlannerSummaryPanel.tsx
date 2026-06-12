"use client";

import { PenLine } from "lucide-react";

type Props = {
  goalSummary: string;
  platformSummary: string;
  contentType: string;
  itemCount: number;
  mainKeyword: string;
};

export default function PlannerSummaryPanel({
  goalSummary,
  platformSummary,
  contentType,
  itemCount,
  mainKeyword,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <PenLine size={18} />
        </div>
        <h2 className="text-sm font-black text-white">기획 요약</h2>
      </div>

      <SummaryRow label="콘텐츠 목표" value={goalSummary || "미선택"} />
      <SummaryRow label="제작 플랫폼" value={platformSummary || "미선택"} />
      <SummaryRow label="콘텐츠 유형" value={contentType} />
      <SummaryRow label="생성 개수" value={`${itemCount}개`} />
      <SummaryRow label="메인 키워드" value={mainKeyword || "미입력"} />
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-3 last:border-b-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}