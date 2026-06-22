"use client";

import React, { useState } from "react";
import { Database, UploadCloud, Search, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResearchSection() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const mockDocs = [
    { name: "NVIDIA_Blackwell_Architecture_Whitepaper.pdf", size: "4.2 MB", status: "임베딩 완료" },
    { name: "Agentic_Workflows_Enterprise_Trends_2026.pdf", size: "1.8 MB", status: "임베딩 완료" },
    { name: "Google_Gemini_1.5_Technical_Report.pdf", size: "5.7 MB", status: "임베딩 완료" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchDone(false);

    setTimeout(() => {
      setIsSearching(false);
      setSearchDone(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 리서치 센터 (Research)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              사용자가 올린 논문 및 PDF 분석 자료를 토크나이징 및 벡터 디비에 저장(RAG)하여 대화형 심층 질의응답을 수행합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PDF 업로더 & 문서 리스트 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 드래그 앤 드롭 */}
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 text-center cursor-pointer hover:border-indigo-500/50 transition">
            <UploadCloud size={32} className="mx-auto text-indigo-400 mb-2.5" />
            <span className="text-xs font-black text-zinc-900 dark:text-zinc-150 block">PDF 보고서/논문 파일 추가</span>
            <span className="text-[10px] font-bold text-zinc-500 mt-1 block">최대 파일당 50MB (PDF, DOCX, TXT)</span>
          </div>

          {/* 등록된 리스트 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">학습된 리서치 보관함</h3>
            <div className="space-y-3">
              {mockDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 p-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={16} className="text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-150">{doc.name}</p>
                      <span className="text-[9px] text-zinc-500">{doc.size}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 벡터 검색 & 시뮬레이션 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">보관된 연구 논문 시맨틱(RAG) 검색</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="예: 블랙웰 아키텍처의 트랜스포머 엔진 구조가 기존 호퍼 대비 개선된 점은?"
                  className="h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 pl-10 pr-3 text-sm text-zinc-950 dark:text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="h-11 rounded-xl bg-indigo-650 px-6 text-sm font-black text-white hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {isSearching ? "분석 중..." : "리서치 질문"}
              </button>
            </div>
          </form>

          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
              <p className="text-xs font-bold text-zinc-500">
                벡터 데이터베이스 유사 청크 검색 및 LLM 요약 추론 중...
              </p>
            </div>
          )}

          {searchDone && !isSearching && (
            <div className="space-y-5 border-t border-zinc-800 pt-6">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  AI 종합 분석 답변
                </span>
                <p className="text-xs font-medium leading-relaxed text-zinc-650 dark:text-zinc-300">
                  엔비디아 블랙웰(Blackwell) 아키텍처의 트랜스포머 엔진은 새로운 2세대 초정밀 FP4 포맷 연산을 도입하여 호퍼(Hopper) 아키텍처 대비 거대언어모델(LLM)의 추론 성능을 최대 30배 가속화합니다. 특히, 텐서 코어는 레이어별 데이터 정밀도를 실시간 자율 스케일링하여 지연 시간(Latency)을 단축시킵니다.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  근거 소스 출처 (2개 문서 매칭됨)
                </span>
                <div className="space-y-1.5 pl-3">
                  <p className="text-[11px] font-bold text-zinc-650 dark:text-zinc-400">
                    1. <span className="underline cursor-pointer">NVIDIA_Blackwell_Architecture_Whitepaper.pdf</span> (Page 14-16, "Transformer Engine FP4 Scaling")
                  </p>
                  <p className="text-[11px] font-bold text-zinc-650 dark:text-zinc-400">
                    2. <span className="underline cursor-pointer">Google_Gemini_1.5_Technical_Report.pdf</span> (Page 32, "Hardware Latency Benchmarks")
                  </p>
                </div>
              </div>
            </div>
          )}

          {!searchDone && !isSearching && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
              <AlertCircle size={28} className="text-zinc-600 mb-2" />
              <p className="text-xs font-bold">리서치 논문 질문을 입력하시면 AI가 등록된 PDF 분석 후 출처와 함께 답합니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
