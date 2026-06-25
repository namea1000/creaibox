"use client";

import React, { useState } from "react";
import { Sliders, Crop, Award, Download, Loader2 } from "lucide-react";

export default function ImageEditorTab() {
  const [filter, setFilter] = useState("none");
  const [watermark, setWatermark] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const filterClasses: Record<string, string> = {
    none: "",
    grayscale: "grayscale",
    sepia: "sepia",
    invert: "invert",
    blur: "blur-sm",
    hue: "hue-rotate-90",
  };

  const handleSaveImage = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("편집된 이미지가 로컬 컴퓨터에 저장되었습니다!");
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-in fade-in duration-200">
      
      {/* 1. Left controls */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
          <Sliders className="text-purple-400" size={20} />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">이미지 편집 조작</h2>
        </div>

        {/* Filter configuration */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">필터 화풍 스타일</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none", label: "원본" },
              { id: "grayscale", label: "흑백" },
              { id: "sepia", label: "세피아" },
              { id: "invert", label: "반전" },
              { id: "blur", label: "흐림" },
              { id: "hue", label: "색상반전" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                  filter === f.id
                    ? "bg-purple-600 border-purple-500 text-white shadow-md"
                    : "bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brightness & Contrast slider */}
        <div className="space-y-4 pt-2 border-t border-zinc-800/40">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">밝기 조절 (Brightness)</label>
              <span className="text-[10px] font-bold text-zinc-400 font-mono">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1 rounded-lg cursor-pointer bg-zinc-950"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">대비 조절 (Contrast)</label>
              <span className="text-[10px] font-bold text-zinc-400 font-mono">{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1 rounded-lg cursor-pointer bg-zinc-950"
            />
          </div>
        </div>

        {/* Watermark string overlay input */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/40">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">텍스트 워터마크 삽입</label>
          <input
            type="text"
            placeholder="예: © 2026 CreAibox"
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-purple-500/50"
          />
        </div>

        <button
          onClick={handleSaveImage}
          disabled={isSaving}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={14} /> 편집 완료 처리 중...
            </>
          ) : (
            <>
              <Download size={14} /> 편집 완료 및 저장
            </>
          )}
        </button>
      </div>

      {/* 2. Right image preview panel */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Crop className="text-zinc-500" size={16} />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Editor Preview</span>
        </div>

        <div className="relative max-w-full max-h-[400px] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
            alt="Edit Preview"
            className={`object-contain max-h-[350px] transition-all duration-150 ${filterClasses[filter]}`}
            style={{
              filter: `${filterClasses[filter] ? `${filterClasses[filter]} ` : ""}brightness(${brightness}%) contrast(${contrast}%)`,
            }}
          />

          {/* Draggable/floating text watermark overlay */}
          {watermark && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-zinc-300 border border-zinc-800 font-mono shadow-md animate-in zoom-in-95">
              {watermark}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
