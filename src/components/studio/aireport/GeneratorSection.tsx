"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Settings2, Sliders, ChevronDown, Check } from "lucide-react";

export default function GeneratorSection() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("medium");
  const [depth, setDepth] = useState("expert");
  const [useSearch, setUseSearch] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedReport(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(`# [AI 산업 트렌드 리포트] ${topic} 상세 분석 보고서

## 1. 개요 및 요약
최근 생성형 인공지능(Generative AI) 기술의 비약적인 발전으로 관련 도구 도입이 산업계 전반으로 빠르게 전파되고 있습니다. 본 보고서는 입력된 연구 주제에 대해 현재 업계 현황과 경쟁 가치를 팩트 시트 중심으로 상세 요약합니다.

## 2. 핵심 트렌드 분석
- **실시간 데이터 의존도 증가**: 최신 주가 정보 및 최신 기술 백서 데이터 연계가 의사 결정의 핵심 차별화 포인트로 격상되었습니다.
- **오프라인 소스 결합 (RAG)**: 기업 내부의 학습되지 않은 독자적 문서를 임베딩하여 활용하는 흐름이 대세로 고착되고 있습니다.

## 3. 요약 결론
AI 기술의 격변기에 시장 주도권을 확보하기 위해서는 단기적 업무 보조를 넘어 스스로 판단하고 오류를 수정해 나가는 '에이전틱 자율 연동(Agentic Workflow)' 기술의 조기 도입이 핵심입니다.
`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 콘텐츠 자동 생성</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              원하는 시장/기술 분석 주제를 입력하면 실시간 인터넷 검색(Search Grounding)을 연동해 고화질 보고서를 자동 설계/작성합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 생성 옵션 설정 폼 */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Settings2 size={14} className="text-purple-400" />
              보고서 생성 옵션
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">리포트 분석 주제</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 2026 국내 AI 헬스케어 스타트업..."
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">분석 분량 규격</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-purple-500 appearance-none"
              >
                <option value="short">📰 짧게 (약 800자)</option>
                <option value="medium">✍️ 보통 (약 1,500자)</option>
                <option value="long">🚀 길게 (약 3,000자)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">분석 깊이 수준</label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-purple-500 appearance-none"
              >
                <option value="general">대중 정보 수준</option>
                <option value="expert">전문 분석가 수준</option>
                <option value="academic">학술 연구 논문 수준</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-850 pt-4 text-xs font-bold text-zinc-650 dark:text-zinc-300">
              <span>Google 실시간 검색 연동</span>
              <button
                type="button"
                onClick={() => setUseSearch(!useSearch)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  useSearch ? "bg-purple-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    useSearch ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-650 text-sm font-black text-white hover:bg-purple-600 transition disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isGenerating ? "리포트 생성 중..." : "AI 리포트 생성 시작"}
            </button>
          </form>
        </div>

        {/* 생성된 리포트 뷰어 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-purple-400" />
            보고서 편집/출력 프레임
          </h3>

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
              <p className="text-xs font-bold text-zinc-500">
                실시간 데이터 검색 매칭 및 논문 요약 엔진 추론 중...
              </p>
            </div>
          )}

          {generatedReport && !isGenerating && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 space-y-4 bg-zinc-950/20 rounded-xl p-5 border border-zinc-850/80">
              <div className="flex justify-end gap-2 mb-4 border-b border-zinc-800 pb-3">
                <button className="rounded bg-zinc-800 px-3 py-1.5 text-[10px] font-bold hover:bg-zinc-700 transition">
                  마크다운 내보내기
                </button>
                <button className="rounded bg-purple-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-purple-500 transition">
                  리포트 영구 저장
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {generatedReport}
              </pre>
            </div>
          )}

          {!generatedReport && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <FileText size={32} className="text-zinc-700 mb-2" />
              <p className="text-xs font-bold">리포트 분석 주제를 왼쪽에 입력하시면 완성된 보고서 결과가 여기에 출력됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
