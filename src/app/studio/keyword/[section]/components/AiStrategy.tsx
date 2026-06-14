"use client";

import React, { useState } from "react";
import { Bot, Loader2, Sparkles, Send, Copy, Check } from "lucide-react";

export default function AiStrategy() {
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("all");
  const [tone, setTone] = useState("trendy");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const kw = keyword.trim();
      
      setStrategy({
        titles: [
          { type: "CTR 극대화 형", text: `[충격] ${kw}로 하루만에 수익 100만원 번 직장인의 비법` },
          { type: "정보 제공 형", text: `${kw} 기초 사용법부터 심화 수익화 5단계 총정리` },
          { type: "스토리텔링 형", text: "음악 전공자도 놀란 AI 작곡의 현실... 진짜 음악가의 미래는?" },
        ],
        outlines: [
          { sub: "1. 서론: 왜 지금가장 뜨거운 감자가 되었는가?", details: "검색 트렌드 급상승 추이 언급 및 대중적 흥미 유발" },
          { sub: `2. 본론 1: ${kw}의 핵심 기능과 차별화 특징`, details: "초보자가 바로 따라할 수 있는 단계별 인터페이스 설명" },
          { sub: `3. 본론 2: ${kw}를 활용한 3가지 실전 부업 수익 모델`, details: "단순 취미를 넘어선 유튜브, 음원 유통 연계법 제시" },
          { sub: "4. 결론: AI 시대, 크리에이터의 자세와 유의할 점", details: "저작권 라이선스 유의점 및 향후 업데이트 방향성 정리" },
        ],
        tags: [`#${kw}`, `#${kw}수익`, `#AI크리에이터`, `#부업추천`],
      });
      setLoading(false);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Bot className="text-purple-400" size={20} />
          AI 키워드 전략 생성기
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          분석한 핵심 키워드 정보를 바탕으로 타겟 타겟층에 어울리는 추천 제목, 본문 아웃라인(개요), 해시태그 조합을 생성합니다.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">타겟 키워드</label>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: Suno AI 작곡"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-purple-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">핵심 타겟층</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-300 outline-none focus:border-purple-500/50 transition cursor-pointer"
              >
                <option value="all">대중 전체 (일반 독자)</option>
                <option value="creators">유튜브 크리에이터 / 블로거</option>
                <option value="office">2030 직장인 부업러</option>
                <option value="beginner">생초보자 / 입문자</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">어조 (Tone & Manner)</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-300 outline-none focus:border-purple-500/50 transition cursor-pointer"
              >
                <option value="trendy">트렌디하고 흥미진진한</option>
                <option value="pro">전문적이고 신뢰감 높은</option>
                <option value="friendly">친근하고 대화체 형식의</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 text-xs font-black text-white hover:bg-purple-500 disabled:opacity-50 transition shadow-lg shadow-purple-600/10 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  전략 기획서 구성 중...
                </>
              ) : (
                <>
                  <Bot size={14} />
                  AI 전략 기획서 생성
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {strategy && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Outlines & Titles */}
          <div className="md:col-span-2 space-y-6">
            {/* Title options */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-purple-400" />
                추천 제목 타이틀 (노출율 최적화)
              </h3>
              
              <div className="space-y-2.5">
                {strategy.titles.map((title: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center rounded-xl bg-zinc-950/40 p-3.5 border border-zinc-850"
                  >
                    <div>
                      <span className="inline-block rounded bg-purple-500/10 text-purple-400 text-[9px] font-black px-1.5 py-0.5 mb-1.5">
                        {title.type}
                      </span>
                      <p className="text-xs font-bold text-white">{title.text}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(title.text, `t-${idx}`)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/20 px-3 text-[10px] font-bold text-zinc-300 hover:text-white transition"
                    >
                      {copiedText === `t-${idx}` ? <Check size={12} className="text-purple-400" /> : "복사"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtopics outline */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-black text-white">추천 글쓰기 목차 구조 (Outline)</h3>
              
              <div className="space-y-3">
                {strategy.outlines.map((outline: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-purple-500/30 pl-4 py-1">
                    <p className="text-xs font-bold text-white">{outline.sub}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{outline.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hashtags & workflow redirects */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
              <h3 className="text-sm font-black text-white">연관 추천 해시태그</h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {strategy.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    onClick={() => handleCopy(tag, `tag-${idx}`)}
                    className="cursor-pointer select-none rounded bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1 text-[11px] text-zinc-300 font-bold transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-black text-white">콘텐츠 즉시 연동</h3>
              <p className="text-[10px] text-zinc-500 leading-normal">
                구성된 키워드와 개요를 가져가 작성을 시작하세요.
              </p>
              
              <div className="space-y-2">
                <a
                  href={`/studio/writing/editor?keyword=${encodeURIComponent(keyword)}`}
                  className="flex justify-between items-center rounded-lg bg-purple-650 hover:bg-purple-600 p-3 text-xs font-black text-white transition shadow-lg shadow-purple-600/10"
                >
                  <span>AI 글쓰기 에디터로 이동</span>
                  <span>→</span>
                </a>
                <a
                  href={`/studio/music/planning?keyword=${encodeURIComponent(keyword)}`}
                  className="flex justify-between items-center rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-xs font-bold text-zinc-300 hover:border-purple-500/30 hover:bg-zinc-900 transition"
                >
                  <span>AI 작곡 기획서로 이동</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
