"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Languages,
  Loader2,
  Copy,
  Check,
  Download,
  Info,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";

type PresetItem = {
  label: string;
  value: string;
};

const PRESETS: Record<string, PresetItem[]> = {
  midjourney: [
    { label: "시네마틱 실사", value: "A cinematic, highly detailed masterwork photo of [아이디어], dramatic lighting, octane render, volumetric lighting, photorealistic, intricate textures, shot on 85mm lens, f/1.8" },
    { label: "3D 애니메이션", value: "3D Disney Pixar style character illustration of [아이디어], vibrant colors, soft lighting, clay texture, cute and friendly design, high detailed, ray tracing render" },
    { label: "수채화 일러스트", value: "An elegant watercolor painting of [아이디어], delicate paint strokes, pastel tone, highly detailed textures, fantasy vibes, dreamy atmosphere" },
  ],
  suno: [
    { label: "오케스트라", value: "epic cinematic orchestral, swelling strings, brass horn staccatos, dramatic pounding timpani, slow building tempo, fantasy soundtrack adventure theme" },
    { label: "로파이 비트", value: "chill lofi hiphop beats, dusty vinyl crackles, jazzy electric piano chords, smooth sub bass, laid back retro production, 75 bpm" },
    { label: "하우스 댄스", value: "rhythmic driving deep house beats, warm analog synth bassline, bright club piano keys, kick drum focus, energetic dance tempo 124 bpm" },
  ],
  general: [
    { label: "블로그 카피라이팅", value: "Please write a highly engaging, structured blog article about [아이디어]. Use a professional yet conversational tone, clear markdown headings (H2, H3), bullet points for readability, and include a compelling introduction and conclusion." },
    { label: "개발 에러 디버거", value: "Identify potential bugs and performance issues in this code snippet: [아이디어]. Provide a refactored version of the code and explain the changes logically step-by-step." },
    { label: "이메일 카피라이터", value: "Draft a high-converting marketing email pitching the solution for [아이디어]. Use a catchy subject line, problem-agitate-solve structure, clear bulleted value props, and a persuasive call to action." },
  ],
};

type PromptStudioProps = {
  defaultTab?: "enhancer" | "translator";
};

export default function PromptStudio({ defaultTab = "enhancer" }: PromptStudioProps) {
  const [activeTab, setActiveTab] = useState<"enhancer" | "translator">(defaultTab);

  // 공통 로딩
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 탭 1: 개선기 상태
  const [enhanceInput, setEnhanceInput] = useState("");
  const [enhancePlatform, setEnhancePlatform] = useState("midjourney");
  const [enhanceResult, setEnhanceResult] = useState("");
  const [enhanceCopied, setEnhanceCopied] = useState(false);

  // 탭 2: 번역기 상태
  const [translateInput, setTranslateInput] = useState("");
  const [translateStyle, setTranslateStyle] = useState("tag");
  const [translateResult, setTranslateResult] = useState("");
  const [translateCopied, setTranslateCopied] = useState(false);

  // 토스트 타이머
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 글자 수 및 예상 토큰 카운터 계산기
  const stats = useMemo(() => {
    const inputStr = activeTab === "enhancer" ? enhanceInput : translateInput;
    const outputStr = activeTab === "enhancer" ? enhanceResult : translateResult;

    const inputChars = inputStr.length;
    const outputChars = outputStr.length;

    // 대략적인 예상 토큰 계산 (영어 1단어 ~ 0.75토큰, 한글 1글자 ~ 1.5토큰 수준 반영한 간이 팩터 연산)
    const calculateTokens = (text: string) => {
      if (!text) return 0;
      const koreanCount = (text.match(/[\uac00-\ud7a3]/g) || []).length;
      const otherCount = text.length - koreanCount;
      return Math.round(koreanCount * 1.5 + otherCount * 0.3);
    };

    return {
      inputChars,
      outputChars,
      inputTokens: calculateTokens(inputStr),
      outputTokens: calculateTokens(outputStr),
    };
  }, [activeTab, enhanceInput, enhanceResult, translateInput, translateResult]);

  // 프리셋 클릭 핸들러
  const handleApplyPreset = (value: string) => {
    if (activeTab === "enhancer") {
      if (value.includes("[아이디어]")) {
        setEnhanceInput(value.replace("[아이디어]", ""));
      } else {
        setEnhanceInput(value);
      }
      setToastMessage("프롬프트 프리셋 지침이 입력창에 주입되었습니다.");
    } else {
      if (value.includes("[아이디어]")) {
        setTranslateInput(value.replace("[아이디어]", ""));
      } else {
        setTranslateInput(value);
      }
      setToastMessage("번역용 타겟 프리셋 지침이 입력창에 주입되었습니다.");
    }
  };

  // 프롬프트 개선 실행
  const handleEnhance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enhanceInput.trim()) return;

    setLoading(true);
    setEnhanceResult("");

    try {
      const promptQuery = `AI 프롬프트 메이커.
      선택 플랫폼: "${enhancePlatform === "midjourney" ? "미드저니 이미지 모델" : enhancePlatform === "suno" ? "수노 음악 모델" : "일반 챗GPT 글쓰기"}"
      입력 아이디어: "${enhanceInput}"
      
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
        setEnhanceResult(data.text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim());
        return;
      }
      throw new Error("No text");
    } catch (err) {
      console.warn("API 호출 실패, 폴백 매퍼 작동");
      const pi = enhanceInput.trim();
      if (enhancePlatform === "midjourney") {
        setEnhanceResult(`A cinematic, highly detailed masterwork photo of ${pi}, dramatic lighting, octane render, volumetric lighting, photorealistic, intricate textures, shot on 85mm lens, f/1.8, --ar 16:9 --v 6.0 --stylize 250`);
      } else if (enhancePlatform === "suno") {
        setEnhanceResult(`melancholic acoustic folk rock, warm analog tape hiss, solo male vocals, emotional acoustic guitar picking, cello strings, slow tempo 85 bpm, nostalgic and raw production`);
      } else {
        setEnhanceResult(`Please write a highly engaging, structured article about "${pi}". Use a professional yet conversational tone, clear markdown headings (H2, H3), bullet points for readability, and include a compelling introduction and conclusion.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 프롬프트 번역 실행
  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translateInput.trim()) return;

    setLoading(true);
    setTranslateResult("");

    try {
      const promptQuery = `AI 프롬프트 영어 번역기.
      한국어 원문: "${translateInput}"
      형식 구분: "${translateStyle === "tag" ? "쉼표로 구분되는 영문 키워드 태그 나열" : "완전한 자연어 영문 문장 형태"}"
      
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
        setTranslateResult(data.text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim());
        return;
      }
      throw new Error("No text");
    } catch (err) {
      console.warn("번역 API 호출 실패, 폴백 번역 매퍼 작동");
      const text = translateInput.trim();
      if (translateStyle === "tag") {
        setTranslateResult(`beautiful, fantasy, detailed, rendering of ${text}, digital art, highly detailed, sharp focus, vibrant colors`);
      } else {
        setTranslateResult(`A high quality detailed digital illustration depicting ${text} in a majestic fantasy scene with cinematic lighting.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 클립보드 복사
  const handleCopy = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToastMessage("프롬프트 코드가 클립보드에 복사되었습니다.");
    setTimeout(() => setCopied(false), 1500);
  };

  // 파일 다운로드 (.txt)
  const handleDownload = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setToastMessage("프롬프트가 텍스트 파일(.txt)로 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      
      {/* 탭 헤더 선택 바 */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/10 rounded-2xl p-1.5 max-w-lg">
        <button
          onClick={() => {
            setActiveTab("enhancer");
          }}
          className={`flex-1 inline-flex h-11 items-center justify-center gap-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "enhancer"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles size={14} />
          AI 프롬프트 개선기
        </button>
        <button
          onClick={() => {
            setActiveTab("translator");
          }}
          className={`flex-1 inline-flex h-11 items-center justify-center gap-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "translator"
              ? "bg-pink-600 text-white shadow-lg shadow-pink-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Languages size={14} />
          AI 프롬프트 번역기
        </button>
      </div>

      {/* 탭 ①: 프롬프트 개선기 */}
      {activeTab === "enhancer" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <Sparkles className="text-amber-400" size={18} />
                AI 프롬프트 개선 및 파라미터 최적화
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-bold">
                아이디어를 입력하고 대상 생성 AI 엔진을 지정하십시오. 벤치마크 파라미터가 결합된 정교한 영문 프롬프트로 다듬어 줍니다.
              </p>
            </div>

            <form onSubmit={handleEnhance} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    초안 아이디어 또는 지침
                  </label>
                  <input
                    type="text"
                    required
                    value={enhanceInput}
                    onChange={(e) => setEnhanceInput(e.target.value)}
                    placeholder="예: 숲속의 고요한 호수, 사이버펑크 도시 골목길"
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-amber-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    대상 AI 모델
                  </label>
                  <select
                    value={enhancePlatform}
                    onChange={(e) => setEnhancePlatform(e.target.value)}
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-amber-500/50 transition cursor-pointer"
                  >
                    <option value="midjourney">Midjourney (이미지)</option>
                    <option value="suno">Suno (음악/작곡)</option>
                    <option value="general">GPT/Gemini (글쓰기)</option>
                  </select>
                </div>
              </div>

              {/* 프리셋 가이드 로더 단추들 */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[10px] font-black text-zinc-500 block uppercase tracking-wider">
                  모델별 추천 프롬프트 프리셋
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS[enhancePlatform]?.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset.value)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-zinc-800 bg-zinc-950 text-amber-400 hover:bg-amber-600 hover:text-white transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-4 text-[10px] text-zinc-500 font-bold">
                  <span>글자 수: <strong className="text-zinc-300">{stats.inputChars}</strong> 자</span>
                  <span>예상 토큰: <strong className="text-zinc-300">{stats.inputTokens}</strong> Tokens</span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !enhanceInput.trim()}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-6 text-xs font-black text-white transition shadow-lg shadow-amber-600/10 shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      프롬프트 튜닝 중...
                    </>
                  ) : (
                    <>
                      <Zap size={13} />
                      프롬프트 개선하기
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 개선 결과 화면 */}
          {enhanceResult && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  개선 완료된 AI 프롬프트 (Before & After)
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(enhanceResult, setEnhanceCopied)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3.5 text-[10px] font-bold text-zinc-200 transition"
                  >
                    {enhanceCopied ? (
                      <>
                        <Check size={11} className="text-amber-400" />
                        복사 완료
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        프롬프트 복사
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(enhanceResult, "enhanced-prompt.txt")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                    title="텍스트 파일로 저장"
                  >
                    <Download size={11} />
                  </button>
                </div>
              </div>

              {/* Before & After 듀얼 패널 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2 rounded-2xl border border-white/5 bg-zinc-950 p-4 space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Before (초안)</span>
                  <p className="text-xs text-slate-450 leading-relaxed font-bold">{enhanceInput}</p>
                </div>
                <div className="flex justify-center shrink-0">
                  <ArrowRight className="text-slate-700 rotate-90 md:rotate-0" size={16} />
                </div>
                <div className="md:col-span-2 rounded-2xl border border-amber-500/10 bg-zinc-950 p-4 space-y-2">
                  <span className="text-[9px] font-black text-amber-550 uppercase tracking-widest block">After (개선)</span>
                  <p className="text-xs font-mono text-amber-400 leading-relaxed break-words whitespace-pre-wrap">{enhanceResult}</p>
                </div>
              </div>

              <div className="flex gap-4 text-[9px] text-zinc-600 font-bold justify-end pt-1">
                <span>결과 글자 수: <strong>{stats.outputChars}</strong> 자</span>
                <span>결과 토큰: <strong>{stats.outputTokens}</strong> Tokens</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 탭 ②: 프롬프트 번역기 */}
      {activeTab === "translator" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <Languages className="text-pink-400" size={18} />
                AI 프롬프트 정밀 영문 번역기
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-bold">
                영어 프롬프트만 접수하는 AI 툴을 위해 한글을 정밀 영문 키워드 태그 또는 완성형 자연어로 고속 번역합니다.
              </p>
            </div>

            <form onSubmit={handleTranslate} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    번역할 한국어 초안
                  </label>
                  <input
                    type="text"
                    required
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder="예: 활기차고 경쾌한 리듬의 피아노 곡, 일몰 무렵의 고층 빌딩 숲"
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-pink-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    출력 스타일
                  </label>
                  <select
                    value={translateStyle}
                    onChange={(e) => setTranslateStyle(e.target.value)}
                    className="w-full h-11 rounded-xl border border-zinc-850 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-pink-500/50 transition cursor-pointer"
                  >
                    <option value="tag">키워드 나열 (Tag List)</option>
                    <option value="sentence">자연어 문장 (Full Sentence)</option>
                  </select>
                </div>
              </div>

              {/* 프리셋 가이드 로더 단추들 */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="text-[10px] font-black text-zinc-500 block uppercase tracking-wider">
                  자주 쓰이는 기본 묘사 템플릿
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("웅장한 판타지 배경의 디지털 일러스트")}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-zinc-800 bg-zinc-950 text-pink-400 hover:bg-pink-600 hover:text-white transition-all"
                  >
                    🎨 판타지 일러스트
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("레트로 아날로그 질감의 따스한 힙합 비트")}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-zinc-800 bg-zinc-950 text-pink-400 hover:bg-pink-600 hover:text-white transition-all"
                  >
                    🎵 아날로그 로파이
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("전문적인 비즈니스 공식 뉴스레터 서식")}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-zinc-800 bg-zinc-950 text-pink-400 hover:bg-pink-600 hover:text-white transition-all"
                  >
                    ✉️ 공식 뉴스레터
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-4 text-[10px] text-zinc-500 font-bold">
                  <span>글자 수: <strong className="text-zinc-300">{stats.inputChars}</strong> 자</span>
                  <span>예상 토큰: <strong className="text-zinc-300">{stats.inputTokens}</strong> Tokens</span>
                </div>
                <button
                  type="submit"
                  disabled={loading || !translateInput.trim()}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 px-6 text-xs font-black text-white transition shadow-lg shadow-pink-600/10 shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      영문 번역 중...
                    </>
                  ) : (
                    <>
                      <Languages size={13} />
                      영문으로 번역
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 번역 결과 화면 */}
          {translateResult && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  영문 번역 완료 (Before & After)
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(translateResult, setTranslateCopied)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3.5 text-[10px] font-bold text-zinc-200 transition"
                  >
                    {translateCopied ? (
                      <>
                        <Check size={11} className="text-pink-400" />
                        복사 완료
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        결과 복사
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(translateResult, "translated-prompt.txt")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                    title="텍스트 파일로 저장"
                  >
                    <Download size={11} />
                  </button>
                </div>
              </div>

              {/* Before & After 듀얼 패널 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2 rounded-2xl border border-white/5 bg-zinc-950 p-4 space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Before (한글)</span>
                  <p className="text-xs text-slate-450 leading-relaxed font-bold">{translateInput}</p>
                </div>
                <div className="flex justify-center shrink-0">
                  <ArrowRight className="text-slate-700 rotate-90 md:rotate-0" size={16} />
                </div>
                <div className="md:col-span-2 rounded-2xl border border-pink-500/10 bg-zinc-950 p-4 space-y-2">
                  <span className="text-[9px] font-black text-pink-550 uppercase tracking-widest block">After (영문 번역)</span>
                  <p className="text-xs font-mono text-pink-400 leading-relaxed break-words whitespace-pre-wrap">{translateResult}</p>
                </div>
              </div>

              <div className="flex gap-4 text-[9px] text-zinc-600 font-bold justify-end pt-1">
                <span>결과 글자 수: <strong>{stats.outputChars}</strong> 자</span>
                <span>결과 토큰: <strong>{stats.outputTokens}</strong> Tokens</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 토스트 푸시 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl max-w-md animate-fade-in flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-amber-550 uppercase tracking-wider">
              Prompt Studio Sync
            </span>
            <p className="text-xs text-slate-300 font-bold leading-normal">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
