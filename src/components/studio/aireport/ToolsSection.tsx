"use client";

import React, { useState } from "react";
import { Layers, Award, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface AiTool {
  name: string;
  provider: string;
  reasoning: number; // score 1-100
  coding: number;
  speed: number;
  cost: string;
  contextWindow: string;
  strengths: string[];
}

export default function ToolsSection() {
  const toolsList: AiTool[] = [
    {
      name: "Gemini 1.5 Pro",
      provider: "Google",
      reasoning: 92,
      coding: 89,
      speed: 85,
      cost: "$7.00 / 1M Token",
      contextWindow: "2M Tokens (최대)",
      strengths: ["매우 큰 컨텍스트 창 (영상/오디오 직접 주입)", "다국어 번역 및 검색 그라운딩", "구글 생태계 연동"],
    },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      reasoning: 96,
      coding: 95,
      speed: 80,
      cost: "$3.00 / 1M Token",
      contextWindow: "200k Tokens",
      strengths: ["최상위급 논리 추론 및 줄글 작문력", "코드 버그 수정 및 리팩토링", "자연스러운 대화 문맥 유지"],
    },
    {
      name: "GPT-4o",
      provider: "OpenAI",
      reasoning: 94,
      coding: 91,
      speed: 90,
      cost: "$5.00 / 1M Token",
      contextWindow: "128k Tokens",
      strengths: ["매우 빠른 응답 속도", "높은 일관성과 범용 업무 수행력", "이미지/멀티모달 고화질 처리"],
    },
    {
      name: "Llama 3 70B Instruct",
      provider: "Meta (Open Source)",
      reasoning: 83,
      coding: 78,
      speed: 95,
      cost: "자체 호스팅 (무료)",
      contextWindow: "8k Tokens",
      strengths: ["오픈소스 라이선스 자유도", "초고속 로컬 추론 가능", "특정 도메인 파인튜닝 용이"],
    },
  ];

  const [selectedTool, setSelectedTool] = useState<string>("Claude 3.5 Sonnet");
  const activeTool = toolsList.find((t) => t.name === selectedTool) || toolsList[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 모델 비교 분석</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              최신 상용 및 오픈소스 LLM의 벤치마크 점수, 비용, 컨텍스트 용량 및 특장점을 실시간 비교합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 모델 선택 목록 */}
        <div className="lg:col-span-1 space-y-3">
          {toolsList.map((tool) => {
            const isSelected = tool.name === selectedTool;

            return (
              <button
                key={tool.name}
                type="button"
                onClick={() => setSelectedTool(tool.name)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-violet-500/60 bg-violet-500/10 text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 text-zinc-400 hover:border-zinc-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base font-black ${isSelected ? "text-violet-400" : "text-zinc-900 dark:text-zinc-150"}`}>
                    {tool.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {tool.provider}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500">추론: </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-300">{tool.reasoning}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">코딩: </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-300">{tool.coding}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">속도: </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-300">{tool.speed}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택한 모델 세부 보기 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{activeTool.name}</h3>
              <p className="text-xs font-bold text-zinc-500 mt-1">제공사: {activeTool.provider}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400">
              <Award size={13} />
              최고 추천 모델
            </span>
          </div>

          {/* 차트/게이지 바 */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-650 dark:text-zinc-300">논리적 추론 / 작문력 (Reasoning)</span>
                <span className="text-violet-400 font-black">{activeTool.reasoning}/100</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeTool.reasoning}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-650 dark:text-zinc-300">코드 작성 / 버그 수정 (Coding)</span>
                <span className="text-violet-400 font-black">{activeTool.coding}/100</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeTool.coding}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-650 dark:text-zinc-300">응답 속도 (Speed)</span>
                <span className="text-violet-400 font-black">{activeTool.speed}/100</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeTool.speed}%` }}
                />
              </div>
            </div>
          </div>

          {/* 스펙 정보 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <span className="text-xs font-bold text-zinc-500">API 사용 비용 (추정)</span>
              <p className="mt-1 text-lg font-black text-zinc-900 dark:text-white">{activeTool.cost}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-4">
              <span className="text-xs font-bold text-zinc-500">컨텍스트 창 크기</span>
              <p className="mt-1 text-lg font-black text-zinc-900 dark:text-white">{activeTool.contextWindow}</p>
            </div>
          </div>

          {/* 강점 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              핵심 특장점 및 강점 분야
            </h4>
            <ul className="space-y-2">
              {activeTool.strengths.map((str, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-zinc-650 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {str}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
