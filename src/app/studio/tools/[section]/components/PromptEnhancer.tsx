"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check, ShieldAlert } from "lucide-react";

export default function PromptEnhancer() {
  const [promptInput, setPromptInput] = useState("");
  const [platform, setPlatform] = useState("midjourney");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEnhance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const promptQuery = `AI 프롬프트 메이커.
      선택 플랫폼: "${platform === "midjourney" ? "미드저니 이미지 모델" : platform === "suno" ? "수노 음악 모델" : "일반 챗GPT 글쓰기"}"
      입력 아이디어: "${promptInput}"
      
      이 기본 입력을 바탕으로 위 플랫폼에서 가장 화려하고 멋진 결과물을 얻을 수 있도록 영문 고급 프롬프트로 확장해줘. 부가 설명 없이 프롬프트 코드만 코드박스 형태로 깔끔하게 작성해줘.`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt-enhancer",
          prompt: promptQuery,
        }),
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      if (data.text) {
        setResult(data.text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim());
        return;
      }
      throw new Error("No text");
    } catch (err) {
      console.warn("Enhance failed, using template.");
      const pi = promptInput.trim();
      if (platform === "midjourney") {
        setResult(`A cinematic, highly detailed masterwork photo of ${pi}, dramatic lighting, octane render, volumetric lighting, photorealistic, intricate textures, shot on 85mm lens, f/1.8, --ar 16:9 --v 6.0 --stylize 250`);
      } else if (platform === "suno") {
        setResult(`melancholic acoustic folk rock, warm analog tape hiss, solo male vocals, emotional acoustic guitar picking, cello strings, slow tempo 85 bpm, nostalgic and raw production`);
      } else {
        setResult(`Please write a highly engaging, structured article about "${pi}". Use a professional yet conversational tone, clear markdown headings (H2, H3), bullet points for readability, and include a compelling introduction and conclusion.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Sparkles className="text-amber-400" size={20} />
          AI 프롬프트 개선기
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          한글 또는 짤막한 핵심 아이디어를 입력하면, 선택한 생성 AI 엔진의 파라미터 규칙과 서술 형식에 최적화된 고품질 영문 프롬프트로 다듬어 확장합니다.
        </p>

        <form onSubmit={handleEnhance} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">초안 아이디어 프롬프트</label>
              <input
                type="text"
                required
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="예: 피아노 치는 고양이, 슬픈 발라드 음악"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-amber-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">대상 AI 모델</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-amber-500/50 transition cursor-pointer"
              >
                <option value="midjourney">Midjourney (이미지)</option>
                <option value="suno">Suno (작곡 음악)</option>
                <option value="general">GPT/Gemini (글쓰기)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !promptInput.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-8 text-xs font-black text-white transition shadow-lg shadow-amber-600/10 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  프롬프트 튜닝 중...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  고급 프롬프트 개선
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">개선된 AI 프롬프트 결과</h3>
            <button
              onClick={handleCopy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 text-xs font-bold text-zinc-200 transition"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-amber-400" />
                  복사 완료
                </>
              ) : (
                <>
                  <Copy size={13} />
                  프롬프트 복사
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 font-mono text-xs text-amber-400 leading-relaxed break-all">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
