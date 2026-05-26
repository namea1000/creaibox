"use client";

import React from "react";
import { Music, Heart, Mic, Gauge, Piano, FileText } from "lucide-react";

import {
  genres,
  moods,
  vocals,
  tempos,
  instruments,
  songStructures,
} from "./lyricsData";

import type { MusicFormState, Option } from "./types";

function SelectChip({
  item,
  active,
  onClick,
}: {
  item: Option;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${active
          ? "border-amber-400 bg-amber-400/10 text-white shadow-[0_0_20px_rgba(245,158,11,0.16)]"
          : "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
        }`}
    >
      <span className="mr-2">{item.icon}</span>
      {item.label}
    </button>
  );
}

function SectionCard({
  number,
  icon,
  title,
  desc,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#101014] p-6 shadow-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-black text-white">
            {number}. {title}
          </h2>
          <p className="text-sm text-zinc-500">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function LyricsInputPanel({
  form,
  setForm,
}: {
  form: MusicFormState;
  setForm: React.Dispatch<React.SetStateAction<MusicFormState>>;
}) {
  const updateForm = <K extends keyof MusicFormState>(
    key: K,
    value: MusicFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionCard number="1" icon={<Music size={20} />} title="장르 선택" desc="음악의 기본 색깔을 선택하세요.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {genres.map((item) => (
            <SelectChip key={item.value} item={item} active={form.genre === item.value} onClick={() => updateForm("genre", item.value)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard number="2" icon={<Heart size={20} />} title="분위기 및 감성 선택" desc="곡의 감정선과 전체 분위기를 정합니다.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {moods.map((item) => (
            <SelectChip key={item.value} item={item} active={form.mood === item.value} onClick={() => updateForm("mood", item.value)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard number="3" icon={<Mic size={20} />} title="보컬 및 창법 선택" desc="보컬 성별, 톤, 창법 스타일을 선택합니다.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {vocals.map((item) => (
            <SelectChip key={item.value} item={item} active={form.vocal === item.value} onClick={() => updateForm("vocal", item.value)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard number="4" icon={<Gauge size={20} />} title="속도 BPM 설정" desc="리듬의 맥박과 곡의 속도를 정합니다.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {tempos.map((item) => (
            <SelectChip key={item.value} item={item} active={form.tempo === item.value} onClick={() => updateForm("tempo", item.value)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard number="5" icon={<Piano size={20} />} title="악기 및 사운드 구성" desc="중심 악기와 사운드 질감을 선택합니다.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {instruments.map((item) => (
            <SelectChip key={item.value} item={item} active={form.instrument === item.value} onClick={() => updateForm("instrument", item.value)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard number="6" icon={<FileText size={20} />} title="가사 언어 및 노래 구조 (Song Structure/Composition Flow)" desc="가사 언어와 노래 구조를 선택합니다.">
        <div className="space-y-4">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={form.language}
              onChange={(e) => updateForm("language", e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm text-white outline-none focus:border-amber-400"
            >
              <option value="Korean">한국어</option>
              <option value="English">영어</option>
              <option value="Japanese">일본어</option>
              <option value="Korean + English">한국어 + 영어</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              노래 구성
            </label>
            <select
              value={form.structure}
              onChange={(e) => updateForm("structure", e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm text-white outline-none focus:border-amber-400"
            >
              {songStructures.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}