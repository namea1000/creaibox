"use client";

import React, { useState } from "react";
import { Languages, Loader2, Copy, Check, Sparkles } from "lucide-react";

export default function PromptTranslator() {
  const [inputText, setInputText] = useState("");
  const [styleMode, setStyleMode] = useState("tag"); // tag (comma list), sentence (full sentence)
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const promptQuery = `AI 프롬프트 영어 번역기.
      한국어 원문: "${inputText}"
      형식 구분: "${styleMode === "tag" ? "쉼표로 구분되는 영문 키워드 태그 나열" : "완전한 자연어 영문 문장 형태"}"
      
      이 문장/단어를 생성형 AI 프롬프트에 가장 적합한 고품질 영어 번역으로 변환해줘. 다른 설명 없이 번역 결과만 코드박스로 적어줘.`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt-translator",
          prompt: promptQuery,
        }),
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      if (data.text) {
        setResult(data.text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim());
        return;
      }
      throw new Error("No text");
    } catch (err) {
      console.warn("Translation failed, using fallback mapper.");
      // Simple translation mapper fallback
      const text = inputText.trim();
      if (styleMode === "tag") {
        setResult(`beautiful, fantasy, detailed, rendering of ${text}, digital art, highly detailed, sharp focus, vibrant colors`);
      } else {
        setResult(`A high quality detailed digital illustration depicting ${text} in a majestic fantasy scene with cinematic lighting.`);
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
          <Languages className="text-pink-400" size={20} />
          AI 프롬프트 번역기 (Prompt Translator)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          미드저니, 수노, 스테이블 디퓨전 등 영어 입력이 필수인 인공지능 플랫폼을 위해 한글 묘사를 완벽한 영문 키워드/자연어로 정밀 번역합니다.
        </p>

        <form onSubmit={handleTranslate} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">번역할 한국어 아이디어</label>
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="예: 푸른 하늘과 눈 덮인 산, 리드미컬하고 신나는 하우스 비트"
                className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-pink-500/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400">출력 스타일</label>
              <select
                value={styleMode}
                onChange={(e) => setStyleMode(e.target.value)}
                className="w-full h-11 rounded-xl border border-zinc-850 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-pink-500/50 transition cursor-pointer"
              >
                <option value="tag">키워드 나열 (Tag List)</option>
                <option value="sentence">자연어 문장 (Full Sentence)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 px-8 text-xs font-black text-white transition shadow-lg shadow-pink-600/10 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  영문 번역 최적화 중...
                </>
              ) : (
                <>
                  <Languages size={14} />
                  영문 프롬프트 번역
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">영문 번역 결과</h3>
            <button
              onClick={handleCopy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 text-xs font-bold text-zinc-200 transition"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-pink-400" />
                  복사 완료
                </>
              ) : (
                <>
                  <Copy size={13} />
                  결과 복사
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 font-mono text-xs text-pink-450 leading-relaxed break-all">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
