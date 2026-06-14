"use client";

import React, { useState } from "react";
import { Search, Loader2, Download, Copy, Check, Sparkles } from "lucide-react";
import { SiYoutube } from "react-icons/si";

export default function YoutubeKeywords() {
  const [keyword, setKeyword] = useState("");
  const [videoType, setVideoType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const kw = keyword.trim();
      const score = Math.floor((kw.length * 7) % 45 + 50); // 50 to 95 score
      
      const tags = [
        kw,
        `${kw} 추천`,
        `${kw} 팁`,
        `${kw} 쇼츠`,
        `쉬운 ${kw}`,
        `${kw} 초보`,
        `${kw} 리뷰`,
        `${kw} 정주행`,
        `AI ${kw}`,
      ];

      setResults({
        score,
        monthlySearches: (kw.length * 4500 + 8000).toLocaleString(),
        ctr: `${((kw.length * 1.2) % 6 + 4).toFixed(1)}%`,
        competition: score > 75 ? "높음" : score > 60 ? "보통" : "낮음",
        tags,
        topVideos: [
          { title: `${kw} 이렇게만 하면 무조건 100만뷰 나옵니다`, creator: "크리에이터 마스터", views: "45만회" },
          { title: `초보자를 위한 ${kw} 기초 가이드 A to Z`, creator: "AI 에듀", views: "12만회" },
        ],
      });
      setLoading(false);
    }, 900);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <SiYoutube className="text-red-500" size={20} />
          유튜브 키워드 & 태그 분석
        </h2>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          유튜브 영상 제목, 설명, 태그에 삽입할 키워드를 분석하고 시청 클릭률(CTR) 예측치와 태그 조합 추천을 생성합니다.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="예: Suno AI 작곡법, 유튜브 shorts 팁"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 pl-4 pr-10 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
            />
            <Search className="absolute right-3.5 top-3.5 text-zinc-600" size={15} />
          </div>

          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-300 outline-none focus:border-red-500/50 transition cursor-pointer"
          >
            <option value="all">동영상 형태 (전체)</option>
            <option value="shorts">Shorts 전용</option>
            <option value="long">롱폼 동영상 전용</option>
          </select>

          <button
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-650 px-6 text-xs font-black text-white hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            유튜브 분석 시작
          </button>
        </div>
      </div>

      {results && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main tags & list */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-5">
            <div>
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-1">
                <Sparkles size={14} className="text-red-400" />
                추천 비디오 태그 조합
              </h3>
              <p className="text-[10px] text-zinc-500 mb-4">
                태그를 클릭하면 자동으로 클립보드에 복사됩니다. 업로드 시 동영상 태그란에 간편하게 붙여넣으세요.
              </p>

              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleCopyTag(tag)}
                    className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-red-500/40 hover:text-white transition"
                  >
                    <span>#{tag}</span>
                    {copiedTag === tag ? <Check size={10} className="text-red-400" /> : <Copy size={10} className="text-zinc-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-4">
              <h3 className="text-sm font-black text-white mb-3">유사 키워드 상위 노출 영상</h3>
              <div className="space-y-2">
                {results.topVideos.map((v: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center rounded-lg bg-zinc-950/40 p-3 border border-zinc-850">
                    <div>
                      <p className="text-xs font-bold text-white leading-normal">{v.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{v.creator}</p>
                    </div>
                    <span className="text-xs font-extrabold text-red-400 shrink-0 ml-4">{v.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric scores */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-6">
            <div>
              <h3 className="text-sm font-black text-white mb-2">키워드 분석 점수</h3>
              <div className="relative flex items-center justify-center py-4">
                <div className="text-center">
                  <span className="text-4xl font-black text-white">{results.score}</span>
                  <span className="text-zinc-500 text-xs font-bold">/100</span>
                  <p className="text-[10px] text-emerald-450 font-bold mt-1">유튜브 노출 경쟁 우수</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-zinc-800/60 pt-4">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>월간 유튜브 검색량</span>
                <span className="text-white font-extrabold">{results.monthlySearches}회</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>예측 클릭률 (CTR)</span>
                <span className="text-white font-extrabold">{results.ctr}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>태그 경쟁도</span>
                <span className={`font-black ${
                  results.competition === "낮음" ? "text-emerald-400" : results.competition === "보통" ? "text-yellow-400" : "text-red-400"
                }`}>{results.competition}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
