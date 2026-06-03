"use client";

import { ImagePlus, Search, Sparkles } from "lucide-react";

export default function CreaiboxContentImagePanel() {
  return (
    <div className="space-y-4 px-5 py-5 text-white">
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white">
          Content Images
        </h3>
        <p className="mt-2 text-[13px] font-medium leading-relaxed text-zinc-500">
          본문 중간에 삽입할 이미지를 검색하거나 AI로 생성하는 영역입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex h-20 flex-col items-start justify-center rounded-md border border-zinc-800 bg-white/[0.03] px-4 text-left transition hover:border-sky-400/40 hover:bg-sky-500/10"
        >
          <span className="flex items-center gap-2 text-[13px] font-black text-sky-300">
            <Search size={16} />
            이미지 검색
          </span>
          <span className="mt-1 text-[12px] font-medium text-zinc-500">
            웹 이미지와 무료 소스 검색
          </span>
        </button>

        <button
          type="button"
          className="flex h-20 flex-col items-start justify-center rounded-md border border-zinc-800 bg-white/[0.03] px-4 text-left transition hover:border-violet-400/40 hover:bg-violet-500/10"
        >
          <span className="flex items-center gap-2 text-[13px] font-black text-violet-300">
            <Sparkles size={16} />
            AI 이미지 생성
          </span>
          <span className="mt-1 text-[12px] font-medium text-zinc-500">
            원고 문맥 기반 이미지 생성
          </span>
        </button>
      </div>

      <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 text-zinc-500">
            <ImagePlus size={18} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-zinc-300">본문 이미지 라이브러리</p>
            <p className="mt-1 text-[12px] font-medium text-zinc-500">
              선택한 이미지를 본문 원하는 위치에 삽입하는 기능을 연결할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
