"use client";

import React, { useState } from "react";
import { PenTool, Sparkles, FileText, Settings, ArrowUpRight } from "lucide-react";

export default function BlogSection() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("informative");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedBlog(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedBlog({
        title: `[분석] ${topic} 기술 동향과 비즈니스 영향 분석`,
        slug: "ai-agentic-work-workflow-trends",
        metaDesc: `최근 빠르게 화두로 떠오르고 있는 ${topic}의 핵심 특징과 실제 산업계 사례, 그리고 앞으로의 시장 파급효과에 대해 자세히 알아봅니다.`,
        content: `## 1. 서론
최근 인공지능 분야의 가장 뜨거운 화두 중 하나는 바로 '${topic}'입니다. 단순한 생성 업무 보조를 넘어 스스로 판단하고 오류를 수정해 나가는 흐름으로 진화하고 있습니다.

## 2. 주요 장점 및 비즈니스 모델
- **의사결정 보조**: 방대한 뉴스 원문 데이터를 RAG 기반으로 요약하여 팩트 중심의 리서치를 즉각 수행합니다.
- **업무 비용 절감**: 반복적인 뉴스 클리핑과 정보 필터링 과정을 자동화하여 시간당 비용을 크게 낮춰줍니다.

## 3. 요약 결론
따라서 향후 시장 경쟁력을 선점하기 위해서는 최신 트랜드 기술을 활용한 자율 업무 환경 수립에 대한 관심과 조기 투자가 핵심 성공 방정식으로 작용할 것입니다.
`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <PenTool size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 기반 블로그 생성 (Blog)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              수집 및 스크랩 완료된 뉴스를 바탕으로 검색 포털 노출에 최적화된 블로그 아티클을 자동 변환/작성합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 블로그 포스팅 상세 폼 */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Settings size={14} className="text-emerald-400" />
              블로그 변환 옵션
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">핵심 뉴스 키워드</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 자율 에이전트 AI"
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-300">작성 어조 설정</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-3 text-xs text-zinc-950 dark:text-zinc-100 outline-none focus:border-emerald-500 appearance-none"
              >
                <option value="informative">💻 전문 정보 전달 분석형</option>
                <option value="friendly">😊 친근한 일상 이야기 대화형</option>
                <option value="review">🔍 꼼꼼한 리뷰 및 팁 공유형</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-650 text-sm font-black text-white hover:bg-emerald-600 transition disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isGenerating ? "원고 변환 중..." : "AI 블로그 원고 작성"}
            </button>
          </form>
        </div>

        {/* 생성 결과 에디터 뷰 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            블로그 에디터 프레임
          </h3>

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
              <p className="text-xs font-bold text-zinc-500">뉴스 원문을 분석하여 SEO 적합 원고 초안 생성 중...</p>
            </div>
          )}

          {generatedBlog && !isGenerating && (
            <div className="space-y-4 text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-950/20 rounded-xl p-5 border border-zinc-850/80">
              <div className="flex justify-end gap-2 mb-4 border-b border-zinc-800 pb-3">
                <button className="rounded bg-zinc-800 px-3 py-1.5 text-[10px] hover:bg-zinc-700 transition">
                  장부 적재
                </button>
                <button className="rounded bg-emerald-600 px-3 py-1.5 text-[10px] text-white hover:bg-emerald-500 transition">
                  블로그 직접 발행
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-zinc-500">블로그 제목</span>
                  <p className="text-sm font-black text-zinc-900 dark:text-white mt-1">{generatedBlog.title}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-[10px] text-zinc-500">SEO 슬러그 (URL)</span>
                    <p className="font-bold text-zinc-900 dark:text-zinc-300 mt-1">{generatedBlog.slug}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500">메타 디스크립션 (160자)</span>
                    <p className="font-medium text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{generatedBlog.metaDesc}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <span className="text-[10px] text-zinc-500 block mb-2">본문 내용 (마크다운)</span>
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-650 dark:text-zinc-300">
                    {generatedBlog.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!generatedBlog && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <PenTool size={32} className="text-zinc-700 mb-2" />
              <p className="text-xs font-bold">오른쪽 생성 도구에 키워드를 입력하시면 생성형 블로그 원고 초안 프레임이 구성됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
