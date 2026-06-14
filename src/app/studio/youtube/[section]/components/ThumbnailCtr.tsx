"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, AlertCircle, CheckCircle, Eye } from "lucide-react";

export default function ThumbnailCtr() {
  const [title, setTitle] = useState("썸네일에 적을 문구를 입력하세요");
  const [bgColor, setBgColor] = useState("from-red-650 to-orange-600");
  const [faceVisible, setFaceVisible] = useState(true);
  const [textCount, setTextCount] = useState("optimal"); // optimal (3-5 words), cluttered (6+)

  const colors = [
    { name: "비비드 레드-오렌지", value: "from-red-650 to-orange-600" },
    { name: "일렉트릭 바이올렛", value: "from-purple-700 to-indigo-800" },
    { name: "딥 자칼 블랙-다크", value: "from-zinc-900 to-[#120505]" },
  ];

  const getCTRGrade = () => {
    let pct = 4.2; // base CTR
    if (faceVisible) pct += 1.8;
    if (textCount === "optimal") pct += 2.2;
    if (bgColor.includes("red") || bgColor.includes("purple")) pct += 1.2;
    return pct.toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <ImageIcon className="text-amber-400" size={20} />
          썸네일 CTR 연구소 (Thumbnail stand-out simulator)
        </h2>
        <p className="text-xs text-zinc-555 mb-6 leading-relaxed">
          업로드할 썸네일의 시각 구조와 인물 표정 배치, 텍스트 가독성을 점검하고 유튜브 홈 화면 피드 경쟁사 썸네일 틈에서 클릭 효율(CTR)을 예측 시뮬레이션합니다.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls column */}
          <div className="space-y-5 rounded-2xl border border-zinc-850 bg-zinc-950/20 p-5">
            <h3 className="text-xs font-black text-white">썸네일 스타일링 조절</h3>

            {/* Title text input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">썸네일 오버레이 텍스트</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 text-xs font-semibold text-white outline-none focus:border-amber-500/50 transition"
              />
            </div>

            {/* Colors */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">배경 그라데이션 (시각적 자극)</label>
              <div className="space-y-1.5">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setBgColor(c.value)}
                    className={`w-full h-9 rounded-lg border text-[10px] font-bold transition flex items-center justify-between px-3 ${
                      bgColor === c.value
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{c.name}</span>
                    <div className={`h-3.5 w-7 rounded bg-gradient-to-r ${c.value}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Face option */}
            <div className="flex items-center justify-between py-1.5 border-t border-zinc-800/60 mt-3 text-xs font-bold text-zinc-350 select-none">
              <span>인물(얼굴 감정 표정) 포함</span>
              <button
                type="button"
                onClick={() => setFaceVisible(!faceVisible)}
                className={`h-6 w-11 rounded-full relative transition-colors duration-200 focus:outline-none ${
                  faceVisible ? "bg-amber-600" : "bg-zinc-800"
                }`}
              >
                <span className={`h-4.5 w-4.5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
                  faceVisible ? "translate-x-5.5" : "translate-x-0.5"
                }`} />
              </button>
            </div>

            {/* Word density */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
              <span className="text-[10px] font-bold text-zinc-400 block">오버레이 글자 밀도</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "optimal", label: "3~5 단어 (권장)" },
                  { id: "cluttered", label: "6단어 이상 (복잡)" },
                ].map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => setTextCount(tc.id)}
                    className={`h-9 rounded-lg border text-[10px] font-bold transition ${
                      textCount === tc.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Preview cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-850 bg-zinc-950/20 p-5 space-y-3">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">YOUTUBE HOME FEED SIMULATION</span>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Competitor Card */}
                <div className="rounded-xl border border-zinc-850 bg-zinc-950 overflow-hidden space-y-2 pb-3.5">
                  <div className="aspect-video w-full bg-zinc-900 relative">
                    <img src="https://images.unsplash.com/photo-1546074177-ffedd79d494d?w=320&q=80" alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[8px] text-white font-bold">12:35</span>
                  </div>
                  <div className="px-3">
                    <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">유튜브를 뒤흔든 최적화 노하우... 100만 유튜버의 비밀 대공개</h4>
                    <p className="text-[9px] text-zinc-500 mt-1 font-bold">크리에이터 클래스</p>
                  </div>
                </div>

                {/* Simulated Custom Card */}
                <div className="rounded-xl border border-amber-500/40 bg-zinc-950 overflow-hidden space-y-2 pb-3.5 ring-1 ring-amber-500/10">
                  <div className={`aspect-video w-full bg-gradient-to-br ${bgColor} relative flex flex-col justify-between p-3`}>
                    <div className="flex justify-between items-start">
                      <span className="rounded bg-black/40 text-[8px] px-1 text-white font-bold">PREVIEW</span>
                      {faceVisible && <span className="text-xl">😲</span>}
                    </div>
                    
                    <p className="text-white font-black text-sm drop-shadow-md tracking-tight leading-snug line-clamp-2 uppercase">
                      {title}
                    </p>
                    
                    <span className="absolute bottom-1 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[8px] text-white font-bold">08:45</span>
                  </div>
                  <div className="px-3">
                    <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">조회수가 폭발하는 진짜 AI 썸네일 가이드</h4>
                    <p className="text-[9px] text-zinc-555 mt-1 font-bold">내 유튜브 채널</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standout Rating card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/15 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">예측 클릭 효율 (CTR)</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">배치 요소를 바탕으로 산출된 예측치</p>
                </div>
              </div>

              <div className="text-right sm:text-right text-center">
                <span className="text-3xl font-black text-amber-400">{getCTRGrade()}%</span>
                <p className="text-[9px] text-zinc-555 font-bold mt-0.5">상위 15% 진입 가능 수준</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standout criteria rules checklist */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
          <Sparkles size={16} className="text-amber-400" />
          썸네일 시각성 극대화 꿀팁
        </h3>

        <div className="grid gap-3 sm:grid-cols-3 text-xs font-bold text-zinc-350">
          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex gap-2.5 items-start">
            <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">우측 하단 안전 구역 준수</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">유튜브 재생 시간 뱃지가 우측 하단 구석에 강제 렌더링되므로, 중요한 글자나 강조 인물은 좌측/중앙에 배치하십시오.</p>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex gap-2.5 items-start">
            <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">고대비 단색 배경</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">복잡하고 자잘한 뒷배경은 모바일에서 형체를 알아보기 힘듭니다. 심플한 단색이나 단조로운 그라디언트를 사용하세요.</p>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex gap-2.5 items-start">
            <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">감정 표현 극대화</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">사람이 들어가는 경우 무표정보다는 놀람, 화남, 웃음 등 안면 근육 표정이 극도로 부각된 구도가 40% 이상 클릭율이 높습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
