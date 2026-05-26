"use client";

import React from "react";
import { Copy, Sparkles, Wand2 } from "lucide-react";
import type { MusicFormState } from "./types";

export default function LyricsControlPanel({
  form,
  setForm,
  previewPrompt,
  isAiLoading,
  onGenerate,
  onCopy,
}: {
  form: MusicFormState;
  setForm: React.Dispatch<React.SetStateAction<MusicFormState>>;
  previewPrompt: string;
  isAiLoading: boolean;
  onGenerate: () => void;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-[#101014] p-6">
        <h3 className="mb-3 text-lg font-black text-white">생성 실행</h3>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
            생성 곡 수
          </label>

          <select
            value={form.generationCount}
            onChange={(e) =>
              setForm((prev: MusicFormState) => ({
                ...prev,
                generationCount: Number(e.target.value),
              }))
            }
            className="w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm text-white outline-none focus:border-amber-400"
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}곡 생성
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            기존 결과가 있어도 생성 버튼을 다시 누르면 새 결과로 다시 생성됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isAiLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-4 text-sm font-black text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles size={17} />
          {isAiLoading ? "생성 중..." : "가사 & Suno 프롬프트 생성"}
        </button>
      </div>

      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
          <Wand2 className="text-amber-400" size={20} />
          현재 선택 요약
        </h3>

        <div className="space-y-3 text-sm">
          {[
            ["장르", form.genre],
            ["감성", form.mood],
            ["보컬", form.vocal],
            ["BPM", form.tempo],
            ["악기", form.instrument],
            ["언어", form.language],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-b-0"
            >
              <span className="text-zinc-400">{label}</span>
              <span className="text-right font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-[#101014] p-6">
        <h3 className="mb-3 text-lg font-black text-white">미리보기 프롬프트</h3>

        <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm leading-7 text-zinc-300">
          {previewPrompt}
        </div>

        <button
          type="button"
          onClick={() => onCopy(previewPrompt)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800"
        >
          <Copy size={16} />
          프롬프트 복사
        </button>
      </div>
    </div>
  );
}