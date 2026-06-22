"use client";

import React, { useState } from "react";
import { TrendingUp, Clock, Compass, Activity, ChevronRight } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  desc: string;
  impact: string;
}

export default function ForecastSection() {
  const milestones: Milestone[] = [
    {
      year: "2026",
      title: "Agentic AI (자율 행동 에디터/비서)",
      desc: "지시하지 않아도 AI 에이전트가 알아서 웹 검색, 코딩, 결제, API 조율 등을 완료하여 결과물을 보고하는 형태로 상용화됩니다.",
      impact: "높음",
    },
    {
      year: "2027",
      title: "멀티모달 비디오 실시간 렌더링",
      desc: "텍스트나 음성 설명만으로 고화질 3D 공간 시뮬레이션 및 실시간 비디오 드라마가 프레임 딜레이 없이 렌더링됩니다.",
      impact: "매우 높음",
    },
    {
      year: "2028",
      title: "양자 컴퓨팅 결합 AI (Quantum AI) 등장",
      desc: "양자 비트 연산을 적용해 수십억 매개변수의 AI 모델 훈련 비용을 1/100 수준으로 낮추고, 분자 결합 예측 등 과학 연구 속도가 기하급수적으로 빨라집니다.",
      impact: "치명적",
    },
    {
      year: "2030",
      title: "범용 인공지능 (AGI) 초입 진입",
      desc: "인류 전체의 평균적인 상식 논리를 뛰어넘어 자율 학술 연구, 새로운 물리 공식 발견 등 인간의 개입이 완전히 배제된 자체 발전 주기가 시작됩니다.",
      impact: "치명적",
    },
  ];

  const [activeYear, setActiveYear] = useState("2026");
  const activeMilestone = milestones.find((m) => m.year === activeYear) || milestones[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 트렌드 예측 (Forecast)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              향후 5개년 인공지능 분야의 중대한 기술 특이점(Singularity) 로드맵과 영향력을 분석합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 타임라인 선택기 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Clock size={14} className="text-purple-400" />
            예측 타임라인
          </h3>
          <div className="relative border-l border-zinc-800 ml-3.5 space-y-6 py-2">
            {milestones.map((ms) => {
              const isActive = ms.year === activeYear;

              return (
                <div key={ms.year} className="relative pl-6">
                  {/* 도트 지점 */}
                  <span
                    className={`absolute left-0 top-1.5 h-3.5 w-3.5 -translate-x-1.5 rounded-full border-2 transition ${
                      isActive
                        ? "border-purple-500 bg-purple-500 shadow-md shadow-purple-500/50"
                        : "border-zinc-700 bg-zinc-900"
                    }`}
                  />
                  <button
                    onClick={() => setActiveYear(ms.year)}
                    className={`text-left text-xs font-bold transition hover:text-purple-400 ${
                      isActive ? "text-purple-400 text-sm font-black" : "text-zinc-500"
                    }`}
                  >
                    {ms.year}년 - {ms.title.split("(")[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 상세 예측 리포트 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">{activeMilestone.year}년 기술 예측</h3>
              <p className="text-sm font-black text-purple-400 mt-1">{activeMilestone.title}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
              <Activity size={13} />
              영향 수준: {activeMilestone.impact}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Compass size={14} className="text-purple-400" />
              예측 개요 및 파급 효과
            </h4>
            <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-300">
              {activeMilestone.desc}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/20 p-4 space-y-2">
            <span className="text-[10px] font-bold text-zinc-500">인류 대비 권장 전략</span>
            <p className="text-xs font-medium text-zinc-650 dark:text-zinc-300 leading-relaxed">
              업무 자동화 수준이 자율 수행 영역으로 넘어가므로, 단순 코드/작문 능력보다는 업무의 설계력 및 여러 AI 에이전트를 모니터링하고 오케스트레이션하는 조율 능력을 확보해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
