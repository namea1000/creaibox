"use client";

import React, { useState } from "react";
import { Sparkles, Clipboard, Check, FileText, BarChart } from "lucide-react";

export default function SummarySection() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("bullet");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "keywords" | "sentiment">("summary");

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSummarizing(true);
    setSummaryData(null);

    setTimeout(() => {
      setIsSummarizing(false);
      setSummaryData({
        title: "구글 딥마인드 자가 학습 에이전트 분석 기사 요약",
        summaryPoints: [
          "인간의 정적 피드백 없이도 시뮬레이션 환경에서 스스로 진화하는 모형을 수립했습니다.",
          "서브태스크 자동 분해 및 실행 실패 시 실시간 코드 디버깅 기능을 장착하여 성공률을 극적으로 높였습니다.",
          "해당 기술은 자율 로보틱스 공정 설계 및 웹 자동화 사무 비서 영역의 킬러 앱이 될 가능성이 큽니다.",
        ],
        keywords: ["DeepMind", "자가 학습 에이전트", "자율 업무 비서", "디버깅 루프"],
        sentiment: { score: 85, label: "매우 긍정적 (시장 기대치 높음)" },
      });
    }, 1500);
  };

  const handleCopy = () => {
    if (!summaryData) return;
    navigator.clipboard.writeText(summaryData.summaryPoints.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 뉴스 요약 (Summary)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              스크랩 완료된 뉴스 기사 URL 또는 원문 텍스트를 파싱하여 핵심 내용만 깔끔하게 요약합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 요약 입력 컨트롤 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">요약 파라미터</h3>

          <form onSubmit={handleSummarize} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">기사 링크 URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://naver.com/news/123..."
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">요약 형식</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-violet-500 appearance-none"
              >
                <option value="bullet">✍️ 글머리 기호 요약</option>
                <option value="threelines">📰 핵심 3줄 요약</option>
                <option value="detailed">📚 에세이 분석 요약</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSummarizing}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-650 text-sm font-black text-white hover:bg-violet-600 transition disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isSummarizing ? "요약 추출 중..." : "AI 요약 추출"}
            </button>
          </form>
        </div>

        {/* 결과 탭 뷰어 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-violet-400" />
              요약본 및 메타데이터 추출기
            </h3>
            {summaryData && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded bg-zinc-800 px-3 py-1.5 text-[10px] font-bold hover:bg-zinc-700 text-zinc-200"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Clipboard size={11} />}
                요약문 복사
              </button>
            )}
          </div>

          {isSummarizing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
              <p className="text-xs font-bold text-zinc-500">기사 원문 스크래핑 및 핵심 문맥 요약 중...</p>
            </div>
          )}

          {summaryData && !isSummarizing && (
            <div className="space-y-4">
              {/* 탭 헤더 */}
              <div className="flex border-b border-zinc-800 text-xs font-bold">
                {[
                  { id: "summary", label: "본문 요약" },
                  { id: "keywords", label: "핵심 키워드" },
                  { id: "sentiment", label: "의견/감성 분석" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2.5 px-4 transition ${
                      activeTab === tab.id
                        ? "border-b-2 border-violet-500 text-violet-400 font-black"
                        : "text-zinc-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 탭 본문 */}
              {activeTab === "summary" && (
                <ul className="space-y-3 pl-2 py-2">
                  {summaryData.summaryPoints.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "keywords" && (
                <div className="flex flex-wrap gap-2 py-2">
                  {summaryData.keywords.map((kw: string) => (
                    <span
                      key={kw}
                      className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {activeTab === "sentiment" && (
                <div className="space-y-3 py-2 text-xs font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">긍정 오피니언 평가</span>
                    <span className="text-emerald-400 font-black">{summaryData.sentiment.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${summaryData.sentiment.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-zinc-400 mt-2">
                    해당 뉴스는 **{summaryData.sentiment.label}** 범주로 판별되었습니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {!summaryData && !isSummarizing && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <FileText size={32} className="text-zinc-700 mb-2" />
              <p className="text-xs font-bold">뉴스 링크 URL을 왼쪽에 입력하시면 기사 요약 분석 결과가 출력됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
