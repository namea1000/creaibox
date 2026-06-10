"use client";

import React from "react";

type Props = {
  totalChars: number;
  maxCharsLimit: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export default function AiAssistantUsageMeter({
  totalChars,
  maxCharsLimit,
}: Props) {
  const usagePercent =
    maxCharsLimit > 0 ? Math.round((totalChars / maxCharsLimit) * 100) : 0;

  const safePercent = Math.min(Math.max(usagePercent, 0), 100);

  const barColor =
    safePercent >= 95
      ? "bg-red-500"
      : safePercent >= 80
        ? "bg-amber-500"
        : safePercent >= 60
          ? "bg-blue-500"
          : "bg-cyan-500";

  const labelColor =
    safePercent >= 95
      ? "text-red-300"
      : safePercent >= 80
        ? "text-amber-300"
        : "text-cyan-300";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">
            Conversation Storage
          </p>
          <p className="mt-1 text-xs font-bold text-zinc-400">
            채팅창 글자수 사용량
          </p>
        </div>

        <div className="text-right">
          <p className={`text-sm font-black ${labelColor}`}>
            {safePercent}%
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-zinc-500">
            {formatNumber(totalChars)} / {formatNumber(maxCharsLimit)}자
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{
            width: `${safePercent}%`,
          }}
        />
      </div>

      {safePercent >= 80 && safePercent < 100 && (
        <p className="mt-2 text-[11px] font-semibold leading-5 text-amber-200/80">
          사용량이 높습니다. 이 주제가 길어질 경우 새 채팅창을 준비하는 것이 좋습니다.
        </p>
      )}

      {safePercent >= 100 && (
        <p className="mt-2 text-[11px] font-semibold leading-5 text-red-200/80">
          최대 글자수에 도달했습니다. 이 채팅창은 읽기 전용으로 유지됩니다.
        </p>
      )}
    </div>
  );
}