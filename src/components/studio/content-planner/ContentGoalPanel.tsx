"use client";

import { Target } from "lucide-react";

import type { ContentGoal } from "@/lib/content-planner/types";

type ContentGoalPanelProps = {
  goals: ContentGoal[];
  selectedGoals: ContentGoal[];
  onToggleGoal: (goal: ContentGoal) => void;
};

export default function ContentGoalPanel({
  goals,
  selectedGoals,
  onToggleGoal,
}: ContentGoalPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <Target size={18} />
        </div>
        <h2 className="text-sm font-black text-white">콘텐츠 전략 목표</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        {goals.map((goal) => {
          const active = selectedGoals.includes(goal);

          return (
            <button
              key={goal}
              type="button"
              onClick={() => onToggleGoal(goal)}
              className={`rounded-xl border px-3 py-2 text-center transition ${active
                  ? "border-emerald-300 bg-emerald-300/10 text-emerald-100"
                  : "border-white/10 bg-black/20 text-slate-400 hover:border-white/30"
                }`}
            >
              <p className="text-[11px] font-bold leading-none truncate">{goal}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}