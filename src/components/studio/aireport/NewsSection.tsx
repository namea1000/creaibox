"use client";

import React, { useState } from "react";
import { Newspaper, Send, Edit, Copy, Check, Sparkles } from "lucide-react";

export default function NewsSection() {
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("daily");

  const newsDigest = {
    title: "Creaibox AI Daily Briefing - 2026년 6월 21일자",
    date: "2026-06-21",
    articles: [
      {
        title: "구글, 기가토큰급 컨텍스트 창을 지원하는 Gemini 1.5 Ultra 개발 로드맵 공개",
        desc: "기존 200만 토큰 한계를 뛰어넘어 1000만 토큰 규모의 초장문 컨텍스트를 한 번에 연산할 수 있는 인프라 가속 기술이 완성 단계에 접어들었다고 구글 브레인 연구진이 발표했습니다.",
      },
      {
        title: "에이전트 중심의 자율 업무 수행 모델 'Agentic Workflow' 도입 가속화",
        desc: "단순 텍스트 생성을 넘어 웹 브라우징, 도구 호출, 추론 피드백 루프를 결합해 스스로 에러를 디버깅하고 코드를 완성하는 AI 워크플로우 도입률이 기업들 사이에서 40% 이상 치솟았습니다.",
      },
    ],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(newsDigest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Newspaper size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 뉴스 브리핑</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              전날의 핵심 기술 및 IT 트렌드 뉴스 원문들을 종합 요약하여 완성형 이메일/블로그 브리핑 형식으로 제공합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 브리핑 템플릿 설정 */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">템플릿 포맷</h3>
            <div className="space-y-2">
              {[
                { id: "daily", label: "📰 일간 테크 브리핑" },
                { id: "weekly", label: "🚀 주간 AI 트렌드 요약" },
                { id: "opinion", label: "💬 업계 오피니언 리포트" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl.id)}
                  className={`w-full rounded-xl border p-3 text-left text-xs font-bold transition ${
                    activeTemplate === tpl.id
                      ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-500/40"
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <button
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "클립보드 복사 완료!" : "뉴스 텍스트 전체 복사"}
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-xs font-black text-white hover:bg-orange-500 transition">
                <Send size={14} />
                구독자에게 메일 발송
              </button>
            </div>
          </div>
        </div>

        {/* 요약문 미리보기 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">{newsDigest.title}</h3>
            <span className="text-xs font-bold text-zinc-500 flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-400" />
              AI 요약 작성완료
            </span>
          </div>

          <div className="space-y-6 text-zinc-800 dark:text-zinc-200">
            {newsDigest.articles.map((art, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-sm font-black text-zinc-900 dark:text-orange-400 flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-400">
                    {idx + 1}
                  </span>
                  {art.title}
                </h4>
                <p className="pl-7 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-300">
                  {art.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-zinc-250 dark:border-zinc-855 bg-zinc-50 dark:bg-zinc-950/20 p-4 text-[11px] font-medium leading-relaxed text-zinc-500">
            <strong>참고 사항:</strong> 본 브리핑은 네이버 뉴스 API 및 국내외 RSS 수집 결과를 기반으로 기계적으로 합성 및 작성되었으며, 최종 발송 전에 세부 수치와 문맥을 사람이 검토하는 것을 권장합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
