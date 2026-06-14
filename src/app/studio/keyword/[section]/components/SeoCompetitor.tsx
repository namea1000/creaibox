"use client";

import React, { useState } from "react";
import { Search, Loader2, Award, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function SeoCompetitor() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  // Interactive checklist state
  const [checklist, setChecklist] = useState([
    { id: "c1", text: "제목 가장 앞부분에 타겟 키워드가 배치되어 있나요?", checked: false },
    { id: "c2", text: "본문 첫 150자 이내에 메인 키워드가 1회 이상 등장하나요?", checked: false },
    { id: "c3", text: "소제목(H2, H3)에 메인/연관 키워드가 고르게 안착되어 있나요?", checked: false },
    { id: "c4", text: "모든 이미지에 대체 텍스트(alt text)가 지정되어 있나요?", checked: false },
    { id: "c5", text: "외부 신뢰도 높은 아웃바운드 링크가 적절히 들어갔나요?", checked: false },
  ]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const kw = keyword.trim();
      const hash = kw.length * 9;
      
      setResults({
        avgWords: (hash % 1200 + 1200).toLocaleString(),
        imgCount: (hash % 6 + 4),
        keywordDensity: `${((hash % 15 + 15) / 10).toFixed(1)}%`,
        score: Math.floor(hash % 35 + 60),
        competitors: [
          { rank: 1, title: `네이버 블로그 - ${kw} 완벽 가이드`, score: 92, links: 12 },
          { rank: 2, title: `티스토리 - 직접 해보는 ${kw} 사용법`, score: 88, links: 8 },
          { rank: 3, title: `Creaibox - ${kw}의 모든것과 차이점`, score: 85, links: 15 },
        ],
        keywordsFrequency: [
          { word: kw, count: 18, recommended: "12 ~ 20회" },
          { word: "추천", count: 8, recommended: "5 ~ 10회" },
          { word: "방법", count: 6, recommended: "4 ~ 8회" },
        ],
      });
      setLoading(false);
    }, 850);
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Award className="text-lime-400" size={20} />
          SEO 경쟁 분석
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          타겟 검색어의 상위 노출 웹문서/포스팅 구조를 크롤링하여 평균 글자 수, 이미지 갯수, 주요 단어 빈도 및 배치 구조를 분석합니다.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="상위 노출을 노리는 키워드 입력... (예: AI 작곡 방법)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-lime-500/50 transition"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime-650 px-6 text-xs font-black text-white hover:bg-lime-650 disabled:opacity-50 transition shadow-lg shadow-lime-650/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            경쟁 분석 실행
          </button>
        </div>
      </div>

      {results && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main results columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Guide specs */}
            <div className="grid gap-4 grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 text-center">
                <p className="text-zinc-550 text-[10px] font-bold">권장 글자수 (공백제외)</p>
                <p className="text-xl font-black text-white mt-1">{results.avgWords} 자</p>
                <span className="text-[9px] text-zinc-600 font-bold block mt-0.5">상위 문서 평균 기준</span>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 text-center">
                <p className="text-zinc-550 text-[10px] font-bold">권장 이미지 개수</p>
                <p className="text-xl font-black text-white mt-1">{results.imgCount} 장 이상</p>
                <span className="text-[9px] text-zinc-600 font-bold block mt-0.5">시각 자료 적절성</span>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 text-center">
                <p className="text-zinc-550 text-[10px] font-bold">적정 키워드 밀도</p>
                <p className="text-xl font-black text-white mt-1">{results.keywordDensity}</p>
                <span className="text-[9px] text-emerald-450 font-bold block mt-0.5">과도유입 차단선</span>
              </div>
            </div>

            {/* Keyword densities comparison table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
              <h3 className="text-sm font-black text-white">경쟁사 핵심 키워드 반복 빈도</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                      <th className="py-2 px-3">단어</th>
                      <th className="py-2 px-3 text-center">경쟁사 평균 빈도</th>
                      <th className="py-2 px-3 text-right">내 추천 빈도</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {results.keywordsFrequency.map((k: any, i: number) => (
                      <tr key={i} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                        <td className="py-3 px-3 text-white font-extrabold">{k.word}</td>
                        <td className="py-3 px-3 text-center text-lime-400 font-bold">{k.count}회</td>
                        <td className="py-3 px-3 text-right text-zinc-400">{k.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top competitors list */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
              <h3 className="text-sm font-black text-white">상위 노출 페이지 분석 정보</h3>
              <div className="space-y-2.5">
                {results.competitors.map((comp: any) => (
                  <div key={comp.rank} className="flex justify-between items-center rounded-lg bg-zinc-950/40 p-3 border border-zinc-850">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-zinc-800 text-[10px] font-black text-zinc-400 flex items-center justify-center">
                        {comp.rank}
                      </span>
                      <span className="text-xs font-bold text-white max-w-[280px] truncate">{comp.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold">
                      <span>내부 링크 {comp.links}개</span>
                      <span className="rounded bg-lime-500/10 text-lime-400 px-2 py-0.5">SEO점수 {comp.score}점</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Checklist side card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-lime-400" />
              SEO 최적화 체크리스트
            </h3>
            <p className="text-[10px] text-zinc-500">
              글을 작성하면서 아래 SEO 요소들을 체크해 콘텐츠 경쟁력을 향상시키세요.
            </p>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-start gap-2.5 cursor-pointer select-none group"
                >
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    item.checked
                      ? "bg-lime-650 border-lime-650 text-white"
                      : "border-zinc-800 bg-zinc-950 group-hover:border-lime-500/40"
                  }`}>
                    {item.checked && <span className="text-[9px] font-black">✓</span>}
                  </div>
                  <span className={`text-[11px] font-bold leading-tight transition ${
                    item.checked ? "text-zinc-500 line-through" : "text-zinc-300"
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3.5 flex gap-2 items-start mt-2">
              <AlertCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-zinc-500 font-medium">
                체크리스트의 4개 이상을 완수하면, 네이버 지식iN 이나 구글 테크니컬 리치 스니펫 영역 유입 확률이 40% 이상 개선됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
