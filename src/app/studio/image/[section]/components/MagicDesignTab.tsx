"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Sliders, ArrowRight, Loader2, Wand2 } from "lucide-react";

interface MagicLayout {
  id: string;
  title: string;
  desc: string;
  imgUrl: string;
  aspect: string;
  width: number;
  height: number;
}

export default function MagicDesignTab() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [dimension, setDimension] = useState("thumbnail");
  const [loading, setLoading] = useState(false);
  const [layouts, setLayouts] = useState<MagicLayout[]>([]);

  const handleGenerateMagicDesign = () => {
    if (!prompt.trim()) return alert("생성하고자 하는 디자인 설명이나 홍보 키워드를 입력해 주세요!");
    setLoading(true);

    setTimeout(() => {
      // Mock generated designs
      const generated: MagicLayout[] = [
        {
          id: "mag-1",
          title: prompt,
          desc: "트렌디 테크 테마 레이아웃",
          imgUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
          aspect: "16:9",
          width: 1280,
          height: 720,
        },
        {
          id: "mag-2",
          title: prompt,
          desc: "네온 퍼플 그라데이션 레이아웃",
          imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
          aspect: "1:1",
          width: 1080,
          height: 1080,
        },
        {
          id: "mag-3",
          title: prompt,
          desc: "내추럴 감성 미니멀 레이아웃",
          imgUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
          aspect: "4:5",
          width: 1080,
          height: 1350,
        },
      ];
      setLayouts(generated);
      setLoading(false);
    }, 1500);
  };

  const handleOpenInWorkspace = (layout: MagicLayout) => {
    router.push(
      `/studio/image/workspace?width=${layout.width}&height=${layout.height}&imageUrl=${encodeURIComponent(layout.imgUrl)}&title=${encodeURIComponent(layout.title)}`
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* AI Prompt Input Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-400 animate-pulse" size={20} />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">AI 매직 디자인 생성기</h2>
        </div>
        <p className="text-xs font-medium text-zinc-500">
          홍보하고자 하는 문구나 주제를 한두 줄로 입력해 보세요. AI가 문구에 맞는 맞춤형 레이아웃 시안들을 3가지 비율로 자동 설계해 줍니다.
        </p>

        <div className="space-y-3">
          <textarea
            placeholder="예: 2026 봄맞이 크리에이터 신메뉴 출시 포스터, 따뜻한 감성, 심플한 레이아웃"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-purple-500/50 resize-none font-medium leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sliders size={14} className="text-zinc-500" />
              <span className="text-[11px] font-bold text-zinc-500">기본 대표 비율:</span>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 font-bold"
              >
                <option value="thumbnail">유튜브 썸네일 (16:9)</option>
                <option value="card">카드뉴스 (1:1)</option>
                <option value="poster">A4 포스터 (A4)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateMagicDesign}
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-zinc-800 text-white text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-purple-400" size={14} /> AI가 맞춤 디자인 레이아웃 배치 중...
                </>
              ) : (
                <>
                  <Wand2 size={13} /> 매직 디자인 자동 빌드
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated layout results display */}
      {layouts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">생성된 AI 매직 레이아웃</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className="group relative rounded-2xl border border-zinc-850 bg-zinc-950 p-4 flex flex-col justify-between overflow-hidden shadow-xl hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 mb-3.5">
                  <img src={layout.imgUrl} alt="Layout preview" className="w-full h-full object-cover" />
                  
                  <span className="absolute top-2.5 left-2.5 text-[8px] font-black px-2 py-0.5 bg-purple-600 text-white rounded shadow-sm">
                    AI SUGGESTED
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 text-[8px] font-bold px-1.5 py-0.2 bg-black/60 backdrop-blur-sm rounded text-zinc-300 font-mono">
                    RATIO {layout.aspect}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-white line-clamp-1">{layout.title}</h4>
                    <p className="text-[10px] font-medium text-zinc-500 mt-1">{layout.desc}</p>
                  </div>
                  <button
                    onClick={() => handleOpenInWorkspace(layout)}
                    className="w-full py-2 rounded-xl bg-zinc-900 group-hover:bg-purple-600/10 border border-zinc-800 group-hover:border-purple-500/30 text-zinc-300 group-hover:text-purple-400 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    편집기에서 다듬기 <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
