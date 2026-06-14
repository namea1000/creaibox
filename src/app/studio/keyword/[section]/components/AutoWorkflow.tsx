"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Play, ArrowRight, CheckCircle, Database, FileText, Video, Music } from "lucide-react";

export default function AutoWorkflow() {
  const [keyword, setKeyword] = useState("");
  const [selectedFlow, setSelectedFlow] = useState("blog");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "키워드 통계 분석", desc: "검색량 분석 및 연관어 추출 완료" },
    { title: "AI 아웃라인 생성", desc: "고효율 노출형 구조로 본문 개요 작성 완료" },
    { title: "작성 에디터 자동 로딩", desc: "글쓰기/영상 기획 에디터로 컨텍스트 바인딩" },
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
          // Finished, redirect simulation or popup
          setLoading(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const getRedirectUrl = () => {
    const kw = encodeURIComponent(keyword);
    if (selectedFlow === "blog") return `/studio/writing/editor?keyword=${kw}&flow=auto`;
    if (selectedFlow === "shorts") return `/studio/video/editor?keyword=${kw}&flow=shorts`;
    return `/studio/music/planning?keyword=${kw}&flow=music`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Sparkles className="text-yellow-400" size={20} />
          자동 콘텐츠 연결 워크플로우
        </h2>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          번거로운 단계별 연동 과정 없이, 키워드 발굴과 아웃라인 생성을 거쳐 해당 에디터 페이지로 즉시 데이터를 전송하는 파이프라인 자동화 툴입니다.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Inputs card */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">출발 키워드 지정</label>
              <input
                type="text"
                value={keyword}
                disabled={loading}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="자동 연동을 시작할 메인 키워드... (예: 생성형 AI 수익화)"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-yellow-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">대상 워크플로우 목적지</label>
              <div className="grid gap-2 grid-cols-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("blog")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "blog"
                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">블로그 초안 자동작성</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("shorts")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "shorts"
                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Video size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">유튜브 쇼츠 대본화</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedFlow("music")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer text-center ${
                    selectedFlow === "music"
                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                      : "border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Music size={18} className="mb-1.5" />
                  <span className="text-[10px] font-bold">AI 음원 앨범 기획화</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStartFlow}
                disabled={loading || !keyword.trim()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 px-8 text-xs font-black text-black transition shadow-lg shadow-yellow-500/10 shrink-0"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                워크플로우 일괄 실행
              </button>
            </div>
          </div>

          {/* Workflow Map */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white">동작 흐름도</h3>
            
            <div className="space-y-4 relative">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-zinc-800" />

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">1</div>
                <div>
                  <p className="text-xs font-bold text-white">키워드 스캔 & 매핑</p>
                  <p className="text-[9px] text-zinc-555">구글, 네이버 실시간 검색량 필터링</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">2</div>
                <div>
                  <p className="text-xs font-bold text-white">AI 구조화 초안 작성</p>
                  <p className="text-[9px] text-zinc-555">소제목 구조와 추천 프롬프트 결합</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="h-6.5 w-6.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold">3</div>
                <div>
                  <p className="text-xs font-bold text-white">스튜디오 자동 연동</p>
                  <p className="text-[9px] text-zinc-555">선택한 편집기 페이지로 전송 및 활성화</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline execution status */}
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
                      ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
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
                <p className="text-xs font-bold text-white">워크플로우 구성이 성공적으로 완료되었습니다!</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  데이터가 성공적으로 맵핑되어 최종 연동 대기 중입니다. 이동 버튼을 눌러 작업을 계속하세요.
                </p>
              </div>
              <a
                href={getRedirectUrl()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 text-xs font-black text-white transition shrink-0"
              >
                에디터로 이동하기
                <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
