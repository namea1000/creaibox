"use client";

import { ChevronRight, Send } from "lucide-react";

type Props = {
  onAction?: (label: string) => void;
};

const actions = [
  "블로그 전체 제작",
  "네이버 전체 제작",
  "쇼츠 전체 제작",
  "롱폼 전체 제작",
  "SNS 전체 제작",
  "콘텐츠 캘린더로 보내기",
];

export default function PlannerActionPanel({ onAction }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <Send size={18} />
        </div>
        <h2 className="text-sm font-black text-white">확장 제작 액션</h2>
      </div>

      <div className="space-y-2">
        {actions.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onAction?.(label)}
            className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 text-left text-xs font-bold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200"
          >
            {label}
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}