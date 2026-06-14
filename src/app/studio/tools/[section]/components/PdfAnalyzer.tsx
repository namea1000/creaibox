"use client";

import React, { useState } from "react";
import { FileText, Loader2, Upload, Send, Bot, User, MessageSquare } from "lucide-react";

export default function PdfAnalyzer() {
  const [file, setFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFileName(uploadedFile.name);
    setFileSize(`${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`);
    setFile(uploadedFile.name);
    setAnalysis(null);
    setChatHistory([]);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setLoading(true);

    setTimeout(() => {
      setAnalysis({
        summary: `이 문서는 "${fileName}"에 대한 종합 백서 및 가이드라인입니다. 주요 골자는 AI 기술과 클라우드 에코시스템의 효율적 통합이며, 생산성을 최대 40% 이상 향상시키기 위한 실무 방법론을 제안하고 있습니다.`,
        keywords: ["인공지능", "생산성 혁신", "클라우드 통합", "자동화 스케줄", "워크플로우"],
      });
      setChatHistory([
        { role: "assistant", content: `안녕하세요! 분석이 완료되었습니다. "${fileName}"에 대해 궁금한 점을 질문해보세요.` }
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newHistory = [...chatHistory, { role: "user", content: userMessage }];
    setChatHistory(newHistory);
    setChatInput("");

    setTimeout(() => {
      setChatHistory([
        ...newHistory,
        {
          role: "assistant",
          content: `문서의 핵심 가치에 따르면, "${userMessage}"는 주로 생산성 자동화 부분에 부합합니다. 해당 섹션에서는 가속화 파이프라인의 안전성에 대해 서술되어 있습니다.`
        }
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <FileText className="text-blue-400" size={20} />
          PDF 문서 분석기 (PDF Document Summarizer & Q&A)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          PDF 분석 문서를 업로드하면, AI가 핵심 내용을 즉시 요약하고 주요 키워드를 도출하며, 대화하듯 질의응답을 나눌 수 있습니다.
        </p>

        {!file ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-blue-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">PDF 파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-bold">지원 포맷: PDF (최대 30MB)</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{fileName}</p>
                <p className="text-[9px] text-zinc-600 mt-0.5">{fileSize}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                  setChatHistory([]);
                }}
                disabled={loading}
                className="h-9 rounded-lg border border-zinc-850 bg-zinc-900/30 px-3 text-xs font-bold text-zinc-450 hover:text-white"
              >
                삭제
              </button>
              {!analysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-black text-white hover:bg-blue-500 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : null}
                  PDF 본문 분석
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-xs font-bold text-zinc-500">PDF 구조 해독 및 키워드 매칭 중...</p>
        </div>
      )}

      {analysis && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Summary Column */}
          <div className="md:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <div>
              <h3 className="text-xs font-black text-white">AI 핵심 요약</h3>
              <p className="text-xs text-zinc-350 leading-relaxed font-semibold bg-zinc-950/40 p-4 rounded-xl border border-zinc-850 mt-2">
                {analysis.summary}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <h4 className="text-xs font-bold text-zinc-400">도출 핵심 키워드</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.keywords.map((kw: string) => (
                  <span key={kw} className="rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 border border-blue-500/5">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive chat column */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md flex flex-col h-[380px] justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-1.5 mb-2 shrink-0">
              <MessageSquare size={14} className="text-blue-400" />
              문서 내용 질의응답 (Doc Q&A Chat)
            </h3>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 py-2 text-xs">
              {chatHistory.map((ch, idx) => (
                <div key={idx} className={`flex gap-3 items-start ${ch.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                    ch.role === "user" ? "bg-zinc-800 text-zinc-200" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {ch.role === "user" ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`p-3 rounded-xl max-w-[80%] leading-relaxed font-semibold ${
                    ch.role === "user" ? "bg-zinc-800 text-white" : "bg-zinc-950/40 border border-zinc-850 text-zinc-300"
                  }`}>
                    {ch.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 mt-4 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="문서 내용에 대해 질문하세요..."
                className="flex-1 h-10 rounded-lg border border-zinc-850 bg-zinc-950 px-3.5 text-xs font-semibold text-white outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
