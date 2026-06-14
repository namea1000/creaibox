"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Play, ArrowRight, CheckCircle, FileText, Video, Music } from "lucide-react";

export default function VideoWorkflow() {
  const [keyword, setKeyword] = useState("");
  const [selectedFlow, setSelectedFlow] = useState("video");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "비디오 메타데이터 최적화", desc: "검색 유입율 상승 태그 조합 완료" },
    { title: "AI 비디오 스크립트 작성", desc: "도파민 후킹 요소를 결합한 시나리오 대본 빌드" },
    { title: "비디오 에디터 타임라인 싱크", desc: "미디어 리소스 매칭 완료" },
  ];

  const handleStartFlow = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const getRedirectUrl = () => {
    const kw = encodeURIComponent(keyword);
    if (selectedFlow === "video") return `/studio/video/editor?keyword=${kw}&flow=youtube`;
    if (selectedFlow === "writing") return `/studio/writing/creaibox?keyword=${kw}&flow=youtube`;
    return `/studio/music/visualizer?keyword=${kw}&flow=youtube`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Sparkles className="text-cyan-400" size={20} />
          유튜브 자동 제작 워크플로우
        </h2>
        <p className="text-xs text-zinc-550 mb-6 leading-relaxed">
          유튜브 검색에 최적화된 메인 키워드 정보를 바탕으로 시나리오 스크립트 대본 초안을 빌드하고, 영상 타임라인이나 오디오 비주얼라이저 스튜디오로 즉시 바인딩하여 렌더링 작업을 수행합니다.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Inputs */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">시나리오 및 키워드 시드</label>
              <input
                type="text"
                value={keyword}
                disabled={loading}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="자동화 제작을 구상할 주제... (예: 5분 완성 AI 작사 작곡 꿀팁)"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-cyan-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">최종 워크플로우 목적지</label>
              <div className="grid gap-2 grid-cols-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("video")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "video"
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-455"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Video size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">비디오 에디터 타임라인</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("writing")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "writing"
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-455"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">스크립트/시나리오 작성</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("music")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "music"
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-455"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Music size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">비주얼라이저 오디오</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStartFlow}
                disabled={loading || !keyword.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-8 text-xs font-black text-white transition shadow-lg shadow-cyan-600/10 shrink-0"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                연동 파이프라인 일괄 기획
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white">동작 파이프라인</h3>
            
            <div className="space-y-4 relative">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-zinc-850" />

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">1</div>
                <div>
                  <p className="text-xs font-bold text-white">메타 태그 SEO 로드</p>
                  <p className="text-[9px] text-zinc-555">노출 유입 최적화 단어 필터링</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">2</div>
                <div>
                  <p className="text-xs font-bold text-white">AI 시나리오 초고 작성</p>
                  <p className="text-[9px] text-zinc-555">구조와 타임라인 컷 대본 결합</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">3</div>
                <div>
                  <p className="text-xs font-bold text-white">스튜디오 타임라인 싱크</p>
                  <p className="text-[9px] text-zinc-555">미디어 자원 연계 및 에디터 전송</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {currentStep > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
          <h3 className="text-sm font-black text-white mb-4">파이프라인 실행 현황</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 transition ${
                    isDone
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : isActive
                      ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-400"
                      : "border-zinc-850 bg-zinc-950/20 text-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider">Step 0{stepNum}</span>
                    {isDone ? <CheckCircle size={15} /> : isActive ? <Loader2 size={15} className="animate-spin" /> : null}
                  </div>
                  <h4 className={`text-xs font-bold ${isDone || isActive ? "text-white" : "text-zinc-600"}`}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {currentStep === 3 && !loading && (
            <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-xs font-bold text-white">유튜브 제작 파이프라인 자동화 맵핑 완료</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  데이터가 성공적으로 맵핑되어 최종 로드 대기 중입니다. 이동 버튼을 눌러 제작을 완료하세요.
                </p>
              </div>
              <a
                href={getRedirectUrl()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 text-xs font-black text-white transition shrink-0"
              >
                비디오 편집기 스튜디오로 이동
                <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
