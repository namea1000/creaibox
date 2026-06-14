"use client";

import React, { useState } from "react";
import { Search, Loader2, Copy, Check, Sparkles, CheckCircle2, AlertTriangle, Eye, ThumbsUp } from "lucide-react";

export default function YoutubeSeo() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/youtube?type=seo&url=${encodeURIComponent(videoUrl)}`);
      if (!res.ok) throw new Error("동영상 정보를 가져오는데 실패했습니다.");
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      
      // Calculate SEO metrics based on video meta
      const video = result.video;
      const titleLen = video.snippet?.title?.length || 0;
      const descLen = video.snippet?.description?.length || 0;
      const tagCount = video.snippet?.tags?.length || 0;
      
      let score = 50;
      const audits = [];

      // Audit title
      if (titleLen >= 20 && titleLen <= 60) {
        score += 20;
        audits.push({ check: "동영상 제목 길이", status: "pass", text: `적당합니다 (${titleLen}자)` });
      } else {
        score += 10;
        audits.push({ check: "동영상 제목 길이", status: "warn", text: `20자~60자 사이가 최적입니다 (현재 ${titleLen}자)` });
      }

      // Audit description
      if (descLen >= 200) {
        score += 20;
        audits.push({ check: "동영상 설명 분량", status: "pass", text: `본문 정보량이 풍부합니다 (${descLen}자)` });
      } else {
        score += 5;
        audits.push({ check: "동영상 설명 분량", status: "warn", text: `200자 이상 작성을 권장합니다 (현재 ${descLen}자)` });
      }

      // Audit tags
      if (tagCount >= 5) {
        score += 10;
        audits.push({ check: "태그 등록 개수", status: "pass", text: `충분히 등록되었습니다 (총 ${tagCount}개)` });
      } else {
        score += 2;
        audits.push({ check: "태그 등록 개수", status: "warn", text: `5개 이상의 핵심 태그 등록을 권장합니다` });
      }

      setData({
        video,
        score: Math.min(100, score),
        audits,
        source: result.source,
      });
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
          <Search className="text-emerald-400" size={20} />
          유튜브 SEO 분석기
        </h2>
        <p className="text-xs text-zinc-550 mb-4 leading-relaxed">
          분석하려는 유튜브 동영상의 URL 주소 또는 비디오 ID를 입력하여 상위 노출에 필요한 제목 구조, 태그 구성, 본문 매치도를 감사(Audit)합니다.
        </p>

        <form onSubmit={handleAudit} className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="유튜브 동영상 링크 입력 (예: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-emerald-500/50 transition"
          />
          <button
            type="submit"
            disabled={loading || !videoUrl.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-black text-white hover:bg-emerald-500 disabled:opacity-50 transition shadow-lg shadow-emerald-600/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            SEO 진단 시작
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 font-bold mt-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
          <p className="text-xs font-bold text-zinc-500">동영상 SEO 진단 점검표 로딩 중...</p>
        </div>
      )}

      {data && data.video && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main audit lists */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-5">
            <div>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1">AUDIT SUMMARY</span>
              <h3 className="text-xs font-black text-white leading-snug line-clamp-2 bg-zinc-950/40 p-3 rounded-lg border border-zinc-850">
                {data.video.snippet.title}
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-white">상세 진단 내역</h4>
              <div className="space-y-2">
                {data.audits.map((aud: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-zinc-950/40 p-3.5 border border-zinc-850">
                    {aud.status === "pass" ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{aud.check}</p>
                      <p className="text-[10px] text-zinc-450 mt-1 leading-normal">{aud.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags lists */}
            {data.video.snippet.tags && (
              <div className="border-t border-zinc-800/60 pt-4 space-y-3">
                <h4 className="text-xs font-black text-white">등록된 영상 태그 (클릭하여 복사)</h4>
                <div className="flex flex-wrap gap-2">
                  {data.video.snippet.tags.map((tag: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleCopyTag(tag)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[11px] font-bold text-zinc-350 hover:border-emerald-500/40 hover:text-white transition"
                    >
                      <span>#{tag}</span>
                      {copiedTag === tag ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} className="text-zinc-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEO Score card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-6">
            <div className="text-center">
              <h3 className="text-sm font-black text-white">종합 SEO 지수</h3>
              
              <div className="relative flex items-center justify-center py-6">
                <div>
                  <span className="text-5xl font-black text-white">{data.score}</span>
                  <span className="text-zinc-550 text-xs font-bold">/100</span>
                  <p className={`text-[10px] font-black mt-2 ${data.score >= 80 ? "text-emerald-400" : "text-yellow-400"}`}>
                    {data.score >= 80 ? "최적화 상태 우수" : "추가 최적화 필요"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-400">영상 통계 메트릭</h4>
              <div className="space-y-2 text-[11px] font-bold text-zinc-450">
                <div className="flex justify-between items-center">
                  <span>누적 조회수</span>
                  <span className="text-white">{Number(data.video.statistics?.viewCount || 0).toLocaleString()}회</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>추천수 (좋아요)</span>
                  <span className="text-white">{Number(data.video.statistics?.likeCount || 0).toLocaleString()}개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>댓글 피드백</span>
                  <span className="text-white">{Number(data.video.statistics?.commentCount || 0).toLocaleString()}개</span>
                </div>
              </div>
            </div>
            
            <div className="text-[9px] text-zinc-650 font-bold text-right pt-2">
              데이터 출처: {data.source === "youtube-api" ? "YouTube Live Data" : "Fallback Model"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
