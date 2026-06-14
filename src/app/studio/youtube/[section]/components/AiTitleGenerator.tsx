"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check, Info } from "lucide-react";

export default function AiTitleGenerator() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("money");
  const [style, setStyle] = useState("clickbait");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setTitles([]);

    try {
      const prompt = `유튜브 동영상 제목 생성기.
      메인 키워드: "${keyword}"
      카테고리 분야: "${category === "money" ? "수익화/부업" : category === "guide" ? "사용 가이드/꿀팁" : "리뷰/비교"}"
      스타일 형식: "${style === "clickbait" ? "어그로/호기심 자극" : style === "list" ? "리스트형(숫자포함)" : "질문형/이슈성"}"
      
      시청자의 눈길을 사로잡고 클릭률(CTR)을 극대화할 수 있는 유튜브 영상 제목 후보 5개를 번호와 함께 출력해줘. 다른 군더더기 설명 없이 제목 리스트만 작성해줘.`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "youtube-title",
          prompt: prompt,
        }),
      });

      if (!res.ok) throw new Error("API call failed");
      const result = await res.json();
      
      if (result.text) {
        // Parse results by splitting lines and cleaning numbers
        const list = result.text
          .split("\n")
          .map((line: string) => line.replace(/^\d+[\.\s\-]+/, "").trim())
          .filter((line: string) => line.length > 0 && line.length < 100)
          .slice(0, 5);
        
        if (list.length > 0) {
          setTitles(list);
          return;
        }
      }
      throw new Error("Empty text returned");
    } catch (err) {
      console.warn("AI generation failed, using local templates.", err);
      // Fallback local templates
      const kw = keyword.trim();
      const fallbacks = [
        `[충격] ${kw} 하나로 직장 탈출한 비법 (아무도 모름)`,
        `초보자도 10분만에 끝내는 ${kw} 완벽 정복 가이드`,
        `실제 사용해본 ${kw}의 치명적인 단점과 솔직 후기`,
        `${kw} 할 때 절대 하지 말아야 할 실수 3가지`,
        `조회수 폭발하는 ${kw} 제작의 모든 것 (무료 배포)`,
      ];
      setTitles(fallbacks);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Sparkles className="text-yellow-400" size={20} />
          AI 유튜브 제목 생성기
        </h2>
        <p className="text-xs text-zinc-550 mb-4 leading-relaxed">
          메인 키워드를 입력하고 노출 목적에 맞는 어투 및 카테고리를 설정하면, Gemini AI가 시청자의 시선을 끄는 고효율 유튜브 타이틀 5종을 자동 구성합니다.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">핵심 검색 키워드</label>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: Suno AI, 유튜브 쇼츠"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-yellow-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">콘텐츠 카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-yellow-500/50 transition cursor-pointer"
              >
                <option value="money">수익화 / 창업 / 부업</option>
                <option value="guide">튜토리얼 / 기초 가이드</option>
                <option value="review">사용 솔직 리뷰 / 비교분석</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">타이틀 어조 스타일</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-355 outline-none focus:border-yellow-500/50 transition cursor-pointer"
              >
                <option value="clickbait">어그로 (CTR 극대화형)</option>
                <option value="list">리스트형 (숫자 강조)</option>
                <option value="question">호기심 자극 질문형</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 px-8 text-xs font-black text-black transition shadow-lg shadow-yellow-500/10 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  AI 제목 구상 중...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  유튜브 제목 추천받기
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {titles.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">추천 타이틀 리스트</h3>
            <span className="text-[10px] text-zinc-550 flex items-center gap-1"><Info size={12} /> 클릭하면 복사됩니다.</span>
          </div>

          <div className="space-y-2">
            {titles.map((title, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(title, idx)}
                className="flex justify-between items-center rounded-xl bg-zinc-950/40 p-4 border border-zinc-850 hover:border-yellow-500/30 hover:bg-zinc-900 cursor-pointer select-none transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded bg-zinc-800 text-[10px] font-black text-zinc-400 flex items-center justify-center group-hover:bg-yellow-500/10 group-hover:text-yellow-400 transition">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-white leading-normal">{title}</p>
                </div>

                <div className="shrink-0 ml-4">
                  {copiedIdx === idx ? (
                    <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-1"><Check size={12} /> 복사됨</span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400">복사</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
