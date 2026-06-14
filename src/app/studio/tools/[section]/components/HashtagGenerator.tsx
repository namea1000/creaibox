"use client";

import React, { useState } from "react";
import { Tags, Loader2, Copy, Check, Hash } from "lucide-react";

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ core: string[]; niche: string[]; related: string[] } | null>(null);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const kw = keyword.trim().replace(/\s+/g, "");
      const core = [`#${kw}`, `#${kw}그램`, `#인기${kw}`, `#추천${kw}`];
      const niche = [`#${kw}꿀팁`, `#${kw}하는법`, `#${kw}추천템`, `#${kw}초보`];
      const related = [`#AI크리에이터`, `#콘텐츠제작`, `#크리에이박스`, `#일상소통`];

      setTags({ core, niche, related });
      setLoading(false);
    }, 700);
  };

  const handleCopy = (tagList: string[], groupName: string) => {
    const text = tagList.join(" ");
    navigator.clipboard.writeText(text);
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 1500);
  };

  const copyAll = () => {
    if (!tags) return;
    const all = [...tags.core, ...tags.niche, ...tags.related].join(" ");
    navigator.clipboard.writeText(all);
    setCopiedGroup("all");
    setTimeout(() => setCopiedGroup(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Tags className="text-purple-400" size={20} />
          소셜 해시태그 생성기
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          주제어나 핵심 타겟 검색어를 입력하고 업로드할 플랫폼을 지정하면, 대형 키워드와 세부 니치 키워드가 적절히 조합된 해시태그 묶음을 즉시 생성합니다.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="해시태그를 구성할 핵심 단어 입력... (예: Suno AI, 홈베이킹)"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 pl-4 pr-10 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-purple-500/50 transition"
            />
            <Hash className="absolute right-3.5 top-3.5 text-zinc-600" size={15} />
          </div>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-purple-500/50 transition cursor-pointer"
          >
            <option value="instagram">Instagram 피드/Reels</option>
            <option value="youtube">YouTube 동영상/Shorts</option>
            <option value="blog">Naver 블로그/티스토리</option>
            <option value="tiktok">TikTok 챌린지</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !keyword.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 text-xs font-black text-white hover:bg-purple-500 disabled:opacity-50 transition shadow-lg shadow-purple-600/10 shrink-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Tags size={14} />}
            해시태그 생성
          </button>
        </div>
      </div>

      {tags && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">생성된 해시태그 목록</h3>
            <button
              onClick={copyAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-purple-650 hover:bg-purple-600 px-4 text-xs font-black text-white transition shadow-lg shadow-purple-650/10"
            >
              {copiedGroup === "all" ? <Check size={13} /> : <Copy size={13} />}
              전체 해시태그 일괄 복사
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Core tags */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex flex-col justify-between h-44">
              <div>
                <p className="text-[10px] font-black text-purple-400">대형 핵심 키워드 (조회 폭발)</p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-xs font-bold text-zinc-350">
                  {tags.core.map((tag) => (
                    <span key={tag} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleCopy(tags.core, "core")}
                className="w-full mt-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-[10px] font-bold text-zinc-300 transition text-center"
              >
                {copiedGroup === "core" ? "복사 완료 ✓" : "그룹 복사"}
              </button>
            </div>

            {/* Niche tags */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex flex-col justify-between h-44">
              <div>
                <p className="text-[10px] font-black text-cyan-400">중형 상세 키워드 (노출 확률 높음)</p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-xs font-bold text-zinc-350">
                  {tags.niche.map((tag) => (
                    <span key={tag} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleCopy(tags.niche, "niche")}
                className="w-full mt-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-[10px] font-bold text-zinc-300 transition text-center"
              >
                {copiedGroup === "niche" ? "복사 완료 ✓" : "그룹 복사"}
              </button>
            </div>

            {/* Related tags */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-4 flex flex-col justify-between h-44">
              <div>
                <p className="text-[10px] font-black text-emerald-400">소셜 브랜드/소통 키워드</p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-xs font-bold text-zinc-350">
                  {tags.related.map((tag) => (
                    <span key={tag} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleCopy(tags.related, "related")}
                className="w-full mt-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-[10px] font-bold text-zinc-300 transition text-center"
              >
                {copiedGroup === "related" ? "복사 완료 ✓" : "그룹 복사"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
