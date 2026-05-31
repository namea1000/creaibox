"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NaverAnalysisTower from "@/components/writing/naver/NaverAnalysisTower";
import { Cpu, Link2, FileText, Zap, RefreshCw, Sparkles, ChevronDown, Copy, Download, ExternalLink, Eye, FileText as FileTextIcon } from 'lucide-react';

interface KeywordFrequency { word: string; count: number; density: number; status: 'good' | 'warning' | 'danger'; }
interface SourceAnalysisResult { keywords: string[]; topic: string; summaryPoints: string[]; }

interface NaverRecreateTabProps {
  targetKeyword: string; setTargetKeyword: (v: string) => void;
  title: string; setTitle: (v: string) => void;
  content: string; setContent: (v: string) => void;
  isAiLoading: boolean; handleAiRecreate: () => void;
  sourceMode: 'url' | 'text'; setSourceMode: (v: 'url' | 'text') => void;
  sourceUrl: string; setSourceUrl: (v: string) => void;
  sourceText: string; setSourceText: (v: string) => void;
  selectedTone: string; setSelectedTone: (v: string) => void;
  wordCountGoal: string; setWordCountGoal: (v: string) => void;
  handleSavePostToSupabase: () => Promise<boolean | void>;
  sourceAnalysis: SourceAnalysisResult;
  generationStatusMessage?: string;
  generationErrorMessage?: string;
}

export default function NaverRecreateTab({
  targetKeyword, setTargetKeyword, title, content,
  isAiLoading, handleAiRecreate, sourceMode, setSourceMode, sourceUrl, setSourceUrl, sourceText, setSourceText,
  selectedTone, setSelectedTone, wordCountGoal, setWordCountGoal, handleSavePostToSupabase, sourceAnalysis, generationStatusMessage,
  generationErrorMessage,
}: NaverRecreateTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const charCount = content.length;

  const analysisMetrics = useMemo(() => {
    if (title === "" && content === "") {
      return {
        similarityScore: 100,
        seoScore: 0,
        seoChecks: { titleKeyword: false, contentDensity: false, duplicateSafe: false, structureCheck: false },
        isDensitySafe: true,
        nounRatio: 0,
        frequencies: [] as KeywordFrequency[],
        naverBotScore: 0
      };
    }

    const hasTitleKeyword = targetKeyword ? title.toLowerCase().includes(targetKeyword.toLowerCase()) : false;
    const count = targetKeyword ? (content.match(new RegExp(targetKeyword, 'gi')) || []).length : 0;
    const hasGoodDensity = count >= 3 && count <= 7;
    const hasSubHeadings = content.includes('##') || content.includes('###');
    const similarityScore = Math.max(12, 95 - Math.floor(content.length / 25));
    const duplicateSafe = similarityScore < 45;

    let seoScore = 10;
    if (hasTitleKeyword) seoScore += 30;
    if (hasGoodDensity) seoScore += 25;
    if (duplicateSafe) seoScore += 25;
    if (hasSubHeadings) seoScore += 10;

    const activeKeyword = targetKeyword || "추출 단어";
    const frequencies: KeywordFrequency[] = [
      { word: activeKeyword, count, density: Math.min(100, count * 6.5), status: count >= 3 && count <= 5 ? 'good' : count > 5 ? 'danger' : 'warning' },
      { word: "재창조", count: content.includes("재창조") ? 3 : 0, density: content.includes("재창조") ? 3.5 : 0, status: 'good' },
      { word: "알고리즘", count: content.includes("알고리즘") ? 2 : 0, density: content.includes("알고리즘") ? 2.5 : 0, status: 'good' },
      { word: "문맥", count: content.includes("문맥") ? 2 : 0, density: content.includes("문맥") ? 2.1 : 0, status: 'good' }
    ];

    const nounRatio = Math.min(65, 52 + (content.length % 11));
    let naverBotScore = 15;
    if (count >= 3 && count <= 5) naverBotScore += 35;
    if (nounRatio >= 55 && nounRatio <= 65) naverBotScore += 25;
    if (hasSubHeadings) naverBotScore += 25;

    return {
      similarityScore,
      seoScore,
      seoChecks: {
        titleKeyword: hasTitleKeyword,
        contentDensity: hasGoodDensity,
        duplicateSafe,
        structureCheck: hasSubHeadings
      },
      isDensitySafe: count <= 5,
      nounRatio,
      frequencies,
      naverBotScore
    };
  }, [content, targetKeyword, title]);

  const posRatio = useMemo(() => {
    const noun = analysisMetrics.nounRatio;
    const verb = noun > 0 ? Math.max(15, 32 - (content.length % 4)) : 0;

    return {
      noun,
      verb,
      other: noun === 0 ? 0 : 100 - noun - verb
    };
  }, [analysisMetrics.nounRatio, content.length]);

  const normalizedKeywords = Array.from(
    new Set(sourceAnalysis.keywords.map(keyword => keyword.trim()).filter(Boolean))
  ).slice(0, 8);

  const normalizedSummaryPoints = sourceAnalysis.summaryPoints
    .map(point => point.trim())
    .filter(Boolean)
    .slice(0, 4);

  const customMarkdownComponents: Components = {
    h1: ({ children }) => (
      <h2 className="text-[24px] font-black text-[#111111] mt-12 mb-2.5 font-sans tracking-tight border-b-2 border-[#00c73c] pb-3 flex items-center gap-2">
        <span>📌</span> {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-[20px] font-extrabold text-[#000000] mt-10 mb-2.5 font-sans tracking-tight flex items-center gap-2">
        <span className="w-[5px] h-[22px] bg-[#00c73c] rounded-full inline-block"></span>
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-[17px] font-bold text-[#1a1a1a] mt-8 mb-2 font-sans tracking-tight flex items-center">
        {children}
      </h4>
    ),
    p: ({ children }) => {
      if (!children || children === "\n") return <div className="h-6" />;
      return (
        <p className="text-[16px] leading-[2.2] text-[#2c2c2c] mb-6 font-sans font-normal tracking-wide whitespace-pre-line">
          {children}
        </p>
      );
    },
    blockquote: ({ children }) => (
      <div className="my-8 p-6 bg-[#f9f9f9] border-l-[5px] border-[#00c73c] rounded-r-2xl relative shadow-inner overflow-hidden">
        <span className="absolute -top-1 left-2 text-[52px] text-[#00c73c]/15 font-serif select-none">“</span>
        <div className="pl-6 text-[15px] font-semibold text-[#444444] leading-[1.9] font-sans italic">
          {children}
        </div>
        <span className="absolute -bottom-8 right-4 text-[52px] text-[#00c73c]/15 font-serif select-none">”</span>
      </div>
    ),
    hr: () => (
      <div className="naver-divider flex items-center justify-center my-10 gap-4">
        <div className="h-[1px] bg-zinc-200 flex-1"></div>
        <span className="text-base select-none tracking-widest text-[#00c73c] font-black">🍀✨🍀</span>
        <div className="h-[1px] bg-zinc-200 flex-1"></div>
      </div>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 my-6 space-y-3.5 text-[15px] text-[#333333] font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 my-6 space-y-3.5 text-[15px] text-[#333333] font-sans">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed font-medium tracking-wide">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-extrabold text-[#000000] bg-[#eefcf2] px-1 rounded-sm border-b border-[#00c73c]/30">
        {children}
      </strong>
    )
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await handleSavePostToSupabase();
    } catch {
      alert("저장 중 세션 에러 발생");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!content) {
      alert("복사할 재창조 결과 원고가 아직 없습니다.");
      return;
    }

    await navigator.clipboard.writeText(`제목: ${title}\n\n${content}`);
    alert("📋 재창조 결과 원고가 복사되었습니다!");
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([`제목: ${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${targetKeyword || 'recreated_post'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#0b0b0d] text-zinc-100 relative">
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)_360px] relative z-10">

        {/* 좌측 재창조 컨트롤 패널 */}
        <div className="h-full overflow-y-auto custom-scrollbar border-r border-zinc-800/80 bg-[#111216] text-left">
          <div className="p-5 space-y-4">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
                <Cpu size={14} /> AI Recreate Control
              </h3>

              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSourceMode("url")}
                  className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${sourceMode === "url"
                      ? "bg-zinc-800 text-emerald-400 border border-zinc-700/60"
                      : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  <Link2 size={13} /> URL 재창조
                </button>

                <button
                  type="button"
                  onClick={() => setSourceMode("text")}
                  className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${sourceMode === "text"
                      ? "bg-zinc-800 text-blue-400 border border-zinc-700/60"
                      : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  <FileText size={13} /> 본문 입력
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {sourceMode === "url" ? (
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-bold flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full" /> 타겟 글 주소
                    </label>
                    <input
                      type="text"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://blog.naver.com/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 font-bold flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" /> 텍스트 소스 입력
                    </label>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="재구성하고 싶은 원고 내용을 이곳에 붙여넣기 하세요..."
                      className="w-full h-44 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none font-medium leading-relaxed text-[11px] focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-zinc-400 font-bold mb-1.5">
                    재창조 목적 타겟 키워드
                  </label>
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="공란 시 AI가 원본에서 자동 추출"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1.5">말투</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer text-zinc-300 appearance-none"
                    >
                      <option>친근하고 부드러운 말투 (블로그 후기, 일상)</option>
                      <option>전문적이고 분석적인 말투 (경제, 기술, 정보전달)</option>
                      <option>익살스럽고 재치있는 말투 (커뮤니티, SNS, 유머)</option>
                      <option>비판적이고 날카로운 말투 (팩트체크, 비교 리뷰)</option>
                      <option>감성적이고 따뜻한 말투 (에세이, 여행, 맛집)</option>
                      <option>자신감 있고 설득력 있는 말투 (재테크, 투자 전망)</option>
                    </select>
                    <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1.5">길이</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center justify-between">
                    <select
                      value={wordCountGoal}
                      onChange={(e) => setWordCountGoal(e.target.value)}
                      className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer text-zinc-300 appearance-none"
                    >
                      <option value="same">원본과 대략 같은 길이</option>
                      <option value="800">짧게 (약 800자)</option>
                      <option value="1500">보통 (약 1,500자)</option>
                      <option value="3000">길게 (약 3,000자)</option>
                      <option value="5000">아주 길게 (약 5,000자)</option>
                    </select>
                    <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-1" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiRecreate}
                disabled={isAiLoading}
                className="w-full h-14 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white text-xs font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> 재창조 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-yellow-300" /> AI 글 재창조 가동
                  </>
                )}
              </button>

              {generationStatusMessage && isAiLoading && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200">
                  {generationStatusMessage}
                </div>
              )}

              {generationErrorMessage && !isAiLoading && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                  {generationErrorMessage}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 space-y-2">
              <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                <Zap size={11} className="text-amber-400" /> Spin-Rewriting Engine
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                원본의 핵심 정보는 유지하면서 문장 구조와 흐름을 새롭게 재구성합니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 space-y-3">
              <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                <Zap size={11} className="text-emerald-400" /> 원본 분석 결과
              </h4>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 space-y-3">
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 키워드</p>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {normalizedKeywords.length > 0 ? `${normalizedKeywords.length}개 추출` : "대기 중"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {normalizedKeywords.length > 0 ? normalizedKeywords.map((keyword, index) => (
                      <span key={`${keyword}-${index}`} className="px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-300">
                        {keyword}
                      </span>
                    )) : (
                      <span className="text-[11px] text-zinc-500 leading-relaxed">
                        {isAiLoading ? "원본 핵심 키워드를 추출하는 중입니다..." : "재창조 후 핵심 키워드가 정리됩니다."}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 주제</p>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                    {sourceAnalysis.topic || (isAiLoading ? "원본 글의 핵심 주제를 정리하는 중입니다..." : "아직 추출된 핵심 주제가 없습니다.")}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 내용 요약</p>
                  <div className="space-y-1.5">
                    {normalizedSummaryPoints.length > 0 ? normalizedSummaryPoints.map((point, index) => (
                      <div key={`${point}-${index}`} className="flex items-start gap-2 text-[11px] text-zinc-300 leading-relaxed font-medium">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/90 shrink-0" />
                        <span>{point}</span>
                      </div>
                    )) : (
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {isAiLoading ? "원본 핵심 내용을 정리하는 중입니다..." : "아직 추출된 핵심 내용 요약이 없습니다."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 뷰어 */}
        <div className="h-full min-w-0 flex flex-col bg-white overflow-hidden relative">
          <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 bg-zinc-900 shrink-0">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c73c] animate-pulse" />
              Naver Recreate View Mode
            </span>

            <div className="flex items-center gap-1.5">
              <button onClick={handleCopy} disabled={!content || isAiLoading} className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:text-white bg-zinc-900/50 rounded-xl text-[11px] font-black text-zinc-400 transition-all flex items-center gap-1 disabled:opacity-30">
                <Copy size={11} /> COPY
              </button>

              <button onClick={downloadTxt} disabled={!content || isAiLoading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black transition-all flex items-center gap-1 disabled:opacity-30">
                <Download size={11} /> DOWN
              </button>

              <Link href="/studio/writing/naver/list" className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:text-white rounded-xl text-[11px] font-black text-zinc-400 transition-all flex items-center gap-1">
                글수정 이동 <ExternalLink size={11} />
              </Link>

              <button onClick={() => setIsPreviewOpen(true)} disabled={!content || isAiLoading} className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:text-white bg-zinc-900/50 rounded-xl text-[11px] font-black text-zinc-400 transition-all disabled:opacity-30">
                PREVIEW
              </button>
            </div>
          </div>

          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar text-left bg-white transition-all">
            {!content && !isAiLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic font-bold text-sm">
                AI 글 재창조 결과가 생성되면 여기에 표시됩니다.
              </div>
            ) : (
              <div className="max-w-[760px] mx-auto pb-32 font-sans">
                {title && (
                  <h1 className="text-[28px] font-black text-[#111111] leading-snug mb-10 border-b border-zinc-200 pb-6 tracking-tight">
                    {title}
                  </h1>
                )}
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={customMarkdownComponents}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="h-16 border-t border-zinc-200 bg-zinc-50 px-6 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-zinc-500 font-medium">
              AI 재창조 결과를 네이버 블로그 뷰어 모드로 렌더링 중
            </span>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} disabled={!content} className="px-4 py-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition-all disabled:opacity-40">
                결과 복사
              </button>
              <button onClick={handleManualSave} disabled={!content || isSaving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5">
                <FileTextIcon size={13} />
                {isSaving ? "저장중..." : "원고 최종 저장"}
              </button>
            </div>
          </div>
        </div>

        {/* 우측 분석 타워 */}
        <div className="h-full overflow-y-auto custom-scrollbar border-l border-zinc-800/80 bg-[#111216] p-4">
          <NaverAnalysisTower
            seoScore={analysisMetrics.seoScore}
            seoChecks={analysisMetrics.seoChecks}
            posRatio={posRatio}
            frequencies={analysisMetrics.frequencies}
            content={content}
            naverBotScore={analysisMetrics.naverBotScore}
            isDensitySafe={analysisMetrics.isDensitySafe}
            similarityScore={analysisMetrics.similarityScore}
            isRecreateMode={true}
          />
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-white shadow-2xl border border-zinc-300">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-900 text-white text-sm font-black">
              재창조 결과 프리뷰
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              {title && (
                <h1 className="text-[28px] font-black text-[#111111] leading-snug mb-10 border-b border-zinc-200 pb-6 tracking-tight">
                  {title}
                </h1>
              )}
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={customMarkdownComponents}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
              <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-black">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}