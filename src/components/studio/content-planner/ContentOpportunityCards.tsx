"use client";

import {
  Flame,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export type OpportunityCardItem = {
  label: string;
  value: string | number;
  description?: string;
};

type ContentOpportunityCardsProps = {
  items: OpportunityCardItem[];
};

const iconMap = {
  "트렌드 키워드": TrendingUp,
  "황금 키워드": Sparkles,
  "돈 되는 키워드": Flame,
  "급상승 키워드": Zap,
};

export default function ContentOpportunityCards({
  items,
}: ContentOpportunityCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {items.map((item) => {
        const Icon =
          iconMap[item.label as keyof typeof iconMap] ??
          TrendingUp;

        return (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 transition hover:border-cyan-400/40 hover:bg-cyan-500/[0.03]"
          >
            <Icon
              className="mb-4 text-amber-300"
              size={22}
            />

            <div className="text-3xl font-black text-white">
              {item.value}
            </div>

            <div className="mt-1 text-xs font-bold text-slate-500">
              {item.label}
            </div>

            {item.description && (
              <div className="mt-3 text-xs leading-5 text-slate-500">
                {item.description}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}