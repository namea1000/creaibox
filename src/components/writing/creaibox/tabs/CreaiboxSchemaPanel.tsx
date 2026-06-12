"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Zap, Copy, FileCode, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";

interface CreaiboxSchemaPanelProps {
  data?: StudioManuscriptRecord | null;
  updateLocalData?: (patch: Partial<StudioManuscriptRecord>) => void;
}

export default function CreaiboxSchemaPanel({ data, updateLocalData }: CreaiboxSchemaPanelProps) {
  const [schemaType, setSchemaType] = useState("AI_AUTO");
  const [isGenerating, setIsGenerating] = useState(false);
  const [schemaCode, setSchemaCode] = useState("");
  const [hasExistingSchema, setHasExistingSchema] = useState(false);
  const [selectedModel, setSelectedModel] = useState("models/gemini-3.1-flash-lite");
  const [apiKey, setApiKey] = useState<string | null>(null);

  const modelOptions = [
    { id: "models/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (빠름, 효율적)" },
    { id: "models/gemini-2.5-flash", label: "Gemini 2.5 Flash (안정적)" },
    { id: "models/gemini-3-flash-preview", label: "Gemini 3 Flash Preview (최신)" },
  ];

  // 1. Parse existing schema from data.content on mount or when data changes
  useEffect(() => {
    if (!data?.content) {
      setHasExistingSchema(false);
      return;
    }

    const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    const match = schemaRegex.exec(data.content);
    if (match && match[1]) {
      setHasExistingSchema(true);
      // Default the input code to the existing one if no new generation has happened yet
      setSchemaCode((prev) => prev || match[1].trim());
    } else {
      setHasExistingSchema(false);
    }
  }, [data?.content]);

  // Retrieve Gemini API Key from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("gemini_api_key");
      setApiKey(savedKey);
    }
  }, []);

  const handleGenerateSchema = async () => {
    if (!data) return;

    const currentKey = localStorage.getItem("gemini_api_key");
    if (!currentKey) {
      alert("API Vault 메뉴에서 Gemini API 키를 먼저 등록해 주세요.");
      return;
    }

    setIsGenerating(true);
    setSchemaCode("");

    try {
      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({
        model: selectedModel,
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: `You are an expert SEO specialist. Generate a perfect, valid, SEO-optimized JSON-LD schema markup for Google and Naver.
Rules:
1. Return ONLY the raw JSON-LD object. DO NOT wrap it in markdown code blocks (\`\`\`json) or write any other text.
2. The schema type must be '${schemaType}' (if 'AI_AUTO', analyze the provided content and recommend the best schema type such as Article, FAQPage, HowTo, Product, LocalBusiness, etc.).
3. Populate all fields dynamically based on the provided post details.
4. Ensure the JSON is completely valid and parses with JSON.parse.`,
      });

      const prompt = `Post Details:
Title: ${data.title || ""}
Target Keyword: ${data.targetKeyword || data.keyword || ""}
Slug: ${data.slug || ""}
Canonical URL: ${data.canonicalUrl || ""}
Meta Description: ${data.metaDescription || ""}
SEO Tags: ${JSON.stringify(data.seoTags || [])}
Content:
${data.content || ""}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Clean up text if AI wrapped it in code fences despite instruction
      if (text.startsWith("```")) {
        text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Validate JSON structure
      try {
        const parsed = JSON.parse(text);
        setSchemaCode(JSON.stringify(parsed, null, 2));
      } catch (jsonErr) {
        console.error("JSON parsing failed, saving raw text:", jsonErr);
        setSchemaCode(text);
      }
    } catch (err: any) {
      console.error("Schema generation error:", err);
      alert(`스키마 생성 실패: ${err.message || "알 수 없는 오류가 발생했습니다."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySchema = () => {
    if (!data || !updateLocalData) return;

    if (!schemaCode.trim()) {
      alert("생성된 스키마 코드가 없습니다.");
      return;
    }

    // Validate if JSON is parseable before injecting
    try {
      JSON.parse(schemaCode);
    } catch {
      if (!window.confirm("JSON 형식이 올바르지 않습니다. 그대로 삽입할까요?")) {
        return;
      }
    }

    // Strip existing schema script blocks from content
    const schemaRegex = /\n*\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n*/gi;
    const cleanContent = data.content.replace(schemaRegex, "").trim();

    // Append new schema block at the bottom
    const newSchemaBlock = `\n\n<script type="application/ld+json">\n${schemaCode}\n</script>\n`;
    const nextContent = `${cleanContent}${newSchemaBlock}`;

    updateLocalData({ content: nextContent });
    alert("스키마가 본문 하단에 적용되었습니다! 좌측 상단의 '원고 저장' 버튼을 누르면 DB에 영구 반영됩니다.");
  };

  const handleDeleteSchema = () => {
    if (!data || !updateLocalData) return;
    if (!window.confirm("본문에서 기존 스키마 스크립트를 제거할까요?")) return;

    const schemaRegex = /\n*\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n*/gi;
    const nextContent = data.content.replace(schemaRegex, "").trim();

    updateLocalData({ content: nextContent });
    setSchemaCode("");
    alert("본문에서 스키마 스크립트가 제거되었습니다. '원고 저장' 버튼을 눌러야 적용됩니다.");
  };

  const handleCopySchema = () => {
    if (!schemaCode) return;
    navigator.clipboard.writeText(schemaCode);
    alert("스키마 코드가 클립보드에 복사되었습니다.");
  };

  if (!data || !updateLocalData) {
    return (
      <div className="px-5 py-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-5">
          <p className="text-sm font-black text-zinc-100">원고 정보가 없습니다.</p>
          <p className="mt-2 text-xs font-medium leading-6 text-zinc-500">
            원고를 먼저 저장하거나 불러와 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-5 py-4">
      {/* Caching/Loading Status Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col text-left">
          <span className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
            <FileCode className="text-violet-400" size={15} />
            Schema Generator
          </span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
            SEO JSON-LD engine
          </span>
        </div>
        <div className="flex items-center">
          <span
            className={`text-[9px] font-black px-2 py-1 rounded border uppercase ${
              apiKey
                ? "text-emerald-400 border-emerald-950 bg-emerald-950/30"
                : "text-amber-500 border-amber-950 bg-amber-950/30"
            }`}
          >
            ● {apiKey ? "API KEY Active" : "Key Missing"}
          </span>
        </div>
      </div>

      {/* Model Selection & Schema Type Options */}
      <div className="space-y-3.5 text-left">
        <div>
          <label className="block text-xs font-black text-zinc-400 mb-1.5">1. AI 엔진 선택</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
          >
            {modelOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-zinc-400 mb-1.5">2. 스키마 유형 선택</label>
          <select
            value={schemaType}
            onChange={(e) => setSchemaType(e.target.value)}
            className="w-full bg-[#161a23] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded-xl font-bold focus:outline-none focus:border-violet-500 outline-none cursor-pointer"
          >
            <option value="AI_AUTO">AI SMART RECOMMEND (자동 추천)</option>
            <option value="Article">📄 Article (블로그 포스팅/일반 글)</option>
            <option value="FAQPage">❓ FAQPage (자주 묻는 질문 구성)</option>
            <option value="HowTo">🛠️ HowTo (단계별 가이드/방법 설명)</option>
            <option value="Product">⭐ Product (제품/서비스 상세 리뷰)</option>
            <option value="LocalBusiness">🏢 LocalBusiness (지역 업체/매장 소개)</option>
          </select>
        </div>
      </div>

      {/* Status Indicators */}
      {hasExistingSchema && (
        <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-3 flex items-start gap-2.5 text-left">
          <AlertTriangle className="text-blue-400 shrink-0 mt-0.5" size={15} />
          <div>
            <p className="text-[11px] font-black text-zinc-200">기존 스키마 감지됨</p>
            <p className="text-[10px] font-medium leading-relaxed text-zinc-400 mt-1">
              본문에 삽입된 스키마가 존재합니다. 새로 생성하여 적용하면 기존 스키마는 자동으로 덮어씌워집니다.
            </p>
          </div>
        </div>
      )}

      {/* Action: Generate Schema */}
      <button
        onClick={handleGenerateSchema}
        disabled={isGenerating || !apiKey}
        className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 rounded-xl transition-all shadow-lg text-white text-xs font-black flex items-center justify-center gap-1.5"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={15} />
            <span>AI 스키마 마크업 분석 중...</span>
          </>
        ) : (
          <>
            <Zap size={15} className="fill-white" />
            <span>AI 스키마 자동 생성</span>
          </>
        )}
      </button>

      {/* Schema Output Textarea */}
      {schemaCode && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 text-left">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
              JSON-LD Code (미리보기)
            </span>
            <button
              onClick={handleCopySchema}
              className="text-[10px] font-black text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Copy size={11} /> COPY
            </button>
          </div>
          <textarea
            value={schemaCode}
            onChange={(e) => setSchemaCode(e.target.value)}
            className="w-full h-64 p-4 rounded-xl bg-black border border-zinc-800 text-emerald-400 font-mono text-[11px] leading-relaxed custom-scrollbar focus:outline-none focus:border-zinc-700"
          />
        </div>
      )}

      {/* Apply / Delete Actions */}
      {schemaCode && (
        <div className="flex gap-2 pt-2">
          {hasExistingSchema && (
            <button
              onClick={handleDeleteSchema}
              className="flex-1 py-3 border border-rose-900/40 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1"
            >
              <Trash2 size={13} />
              삭제
            </button>
          )}
          <button
            onClick={handleApplySchema}
            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1"
          >
            <CheckCircle size={13} />
            본문에 적용하기
          </button>
        </div>
      )}
    </div>
  );
}
