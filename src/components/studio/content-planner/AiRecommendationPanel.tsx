"use client";

import { Brain } from "lucide-react";
import type { RecommendedSeriesItem } from "@/lib/content-planner/types";

type Props = {
  items: RecommendedSeriesItem[];
};

export default function AiRecommendationPanel({ items }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <Brain size={18} />
        </div>
        <h2 className="text-sm font-black text-white">AI 추천 시리즈</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-black text-white">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{item.label}</span>
              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                {item.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}