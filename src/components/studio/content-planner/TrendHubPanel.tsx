"use client";

import { BarChart3, Hash, Search, TrendingUp } from "lucide-react";

type Props = {
  keywords: string[];
};

export default function TrendHubPanel({ keywords }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <BarChart3 size={18} />
        </div>
        <h2 className="text-sm font-black text-white">트렌드 · 키워드 허브</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <TrendBox icon={Search} title="구글 검색" desc="검색량·경쟁도·관련 키워드" />
        <TrendBox icon={TrendingUp} title="구글 트렌드" desc="최근 7일·30일 급상승 흐름" />
        <TrendBox icon={Hash} title="네이버 트렌드" desc="블로그·클립·국내 검색 흐름" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300"
          >
            #{keyword}
          </span>
        ))}
      </div>
    </section>
  );
}

function TrendBox({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <Icon className="text-cyan-300" size={20} />
      <p className="mt-3 text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
    </div>
  );
}