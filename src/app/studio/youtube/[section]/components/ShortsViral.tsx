"use client";

import React, { useState } from "react";
import { Video, HelpCircle, Flame, CheckCircle, RefreshCw } from "lucide-react";

export default function ShortsViral() {
  const [duration, setDuration] = useState<number>(15); // Default 15s shorts
  const [hookType, setHookType] = useState("text");
  
  const calculateViralScore = () => {
    // Generate deterministic values based on duration & hook type
    const durationScore = duration === 15 ? 95 : duration <= 30 ? 82 : 68;
    const hookScore = hookType === "text" ? 90 : hookType === "visual" ? 95 : 75;
    const total = Math.floor((durationScore + hookScore) / 2);
    
    // Retention curve heights for SVG points
    let points = [];
    if (duration === 15) {
      points = [98, 95, 90, 85, 88, 92, 95]; // strong loop repeat bump at end
    } else if (duration <= 30) {
      points = [95, 85, 75, 65, 68, 70, 75];
    } else {
      points = [90, 70, 55, 40, 38, 42, 45];
    }
    
    return { score: total, points };
  };

  const results = calculateViralScore();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Video className="text-rose-500 animate-pulse" size={20} />
          쇼츠 바이럴 분석기 (Shorts Retention Optimizer)
        </h2>
        <p className="text-xs text-zinc-550 mb-6 leading-relaxed">
          유튜브 쇼츠(Shorts) 영상의 핵심 성공 척도인 시청 지속률(Retention Rate)과 무한 루프 반복 시청 가능성을 시뮬레이션하고 필수 후킹 요소를 진단합니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Controls Panel */}
          <div className="space-y-5">
            {/* Duration selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 block">쇼츠 재생 시간</span>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 59].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`h-10 rounded-xl border text-xs font-bold transition ${
                      duration === sec
                        ? "border-rose-500 bg-rose-500/10 text-rose-400"
                        : "border-zinc-850 bg-zinc-950/60 text-zinc-450 hover:text-white"
                    }`}
                  >
                    {sec}초 분량
                  </button>
                ))}
              </div>
            </div>

            {/* Hook type selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 block">첫 3초 후킹 기법</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "text", label: "호기심 텍스트 훅" },
                  { id: "visual", label: "반전 비주얼 슬라이드" },
                  { id: "audio", label: "빠른 템포 비트 드랍" },
                ].map((hk) => (
                  <button
                    key={hk.id}
                    type="button"
                    onClick={() => setHookType(hk.id)}
                    className={`h-12 px-2.5 rounded-xl border text-[10px] font-bold leading-tight transition ${
                      hookType === hk.id
                        ? "border-rose-500 bg-rose-500/10 text-rose-400"
                        : "border-zinc-850 bg-zinc-950/60 text-zinc-450 hover:text-white"
                    }`}
                  >
                    {hk.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Retention graph simulation */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-550">예상 시청 유지력 (Retention Curve)</span>
                <span className="text-xs font-black text-rose-400">루프 지수: {results.score}점</span>
              </div>

              {/* Retention Curve SVG */}
              <div className="h-28 w-full relative pt-2">
                <svg className="w-full h-full text-rose-500/20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path
                    fill="none"
                    stroke="rgb(244, 63, 94)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={`M 0,${100 - results.points[0]} 
                       L 16,${100 - results.points[1]} 
                       L 32,${100 - results.points[2]} 
                       L 48,${100 - results.points[3]} 
                       L 64,${100 - results.points[4]} 
                       L 80,${100 - results.points[5]} 
                       L 100,${100 - results.points[6]}`}
                  />
                  {/* Start Point */}
                  <circle cx="0" cy={100 - results.points[0]} r="4" fill="rgb(244, 63, 94)" />
                  {/* Loop end point bump */}
                  <circle cx="100" cy={100 - results.points[6]} r="4" fill="rgb(244, 63, 94)" />
                </svg>
                <div className="flex justify-between text-[8px] font-bold text-zinc-650 pt-1.5 border-t border-zinc-850">
                  <span>0초 (인트로)</span>
                  <span>절반 시점</span>
                  <span>끝 (루프 연결)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-850 bg-zinc-900/25 p-3 flex gap-2 items-start text-[10px] leading-relaxed text-zinc-550">
              <HelpCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              {duration === 15 ? (
                <span>15초 쇼츠는 100% 이상의 시청 지속률(무한루프 중복시청)을 받기 가장 이상적인 조건입니다.</span>
              ) : (
                <span>재생 시간이 길어질수록 10초대 이탈률이 급증합니다. 중간 반전(Second Hook) 요소를 배치하십시오.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Viral checklist */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
          <Flame size={16} className="text-rose-500" />
          쇼츠 바이럴 릴리즈 체크표
        </h3>

        <div className="grid gap-3 sm:grid-cols-3 text-xs font-bold text-zinc-350">
          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex items-start gap-2.5">
            <CheckCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">무한 루프 엔딩 (Seamless Ending)</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">영상의 마지막 대사가 자연스럽게 인트로의 첫 대사로 이어지도록 컷편집하여 반복 재생 유도.</p>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex items-start gap-2.5">
            <CheckCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">더블 스피드 연출 (Fast Pacing)</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">공백 구간(묵음)을 1프레임도 허용하지 않고, 평균 화제 전환 주기를 1.8초 단위로 타이트하게 배열.</p>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-950/50 p-4 border border-zinc-850 flex items-start gap-2.5">
            <CheckCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white">마이크로 자막 애니메이션</p>
              <p className="text-[10px] text-zinc-555 font-medium mt-1">음성에 싱크되는 키네틱 자막(한 단어씩 튀어나오는 스타일)을 센터 영역에 배치하여 주의 집중.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
