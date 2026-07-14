"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Zap, Copy, FileCode, CheckCircle, AlertTriangle, Trash2, Eye, Globe } from "lucide-react";
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

    // Support both older script formats and new comment block formats to bypass Tiptap filters
    const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    const match = schemaRegex.exec(data.content);
    if (match) {
      const rawSchema = (match[1] || match[2] || "").trim();
      if (rawSchema) {
        setHasExistingSchema(true);
        setSchemaCode((prev) => prev || rawSchema);
      }
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

    let currentType = "Article";
    try {
      const parsed = JSON.parse(schemaCode);
      currentType = parsed["@type"] || "Article";
    } catch {
      if (!window.confirm("JSON 형식이 올바르지 않습니다. 그대로 삽입할까요?")) {
        return;
      }
    }

    // 🌟 스마트 스키마 병합 엔진 (Smart Schema Upsert Merger)
    // 1. 기존 본문에 등록되어 있는 스키마 블록들을 파싱하여 타입별 Map으로 적재합니다.
    const existingSchemasMap = new Map<string, string>();
    const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = schemaRegex.exec(data.content || "")) !== null) {
      const code = (match[1] || match[2] || "").trim();
      if (code) {
        try {
          const parsed = JSON.parse(code);
          const type = parsed["@type"] || "Schema";
          existingSchemasMap.set(type, code);
        } catch {
          // 파싱이 불가능한 임의의 JSON인 경우 유니크 키로 저장하여 삭제를 방지합니다.
          existingSchemasMap.set(`Custom_${Date.now()}`, code);
        }
      }
    }

    // 2. 현재 생성한 스키마 타입의 값을 새로 엎어치거나 추가합니다!
    existingSchemasMap.set(currentType, schemaCode.trim());

    // 3. 본문 내의 모든 구버전/신버전 스키마 마크업들을 깨끗이 지웁니다.
    const cleanRegex = /\n*\s*(<!--\s*CREAIBOX_SCHEMA_START[\s\S]*?CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">[\s\S]*?<\/script>)\s*\n*/gi;
    const cleanContent = data.content.replace(cleanRegex, "").trim();

    // 4. Map에 모인 모든 유니크 스키마 블록들을 차례대로 본문 하단에 덧붙여 줍니다!
    let newSchemaBlocks = "";
    existingSchemasMap.forEach((code) => {
      newSchemaBlocks += `\n\n<!-- CREAIBOX_SCHEMA_START\n${code}\nCREAIBOX_SCHEMA_END -->`;
    });
    
    const nextContent = `${cleanContent}${newSchemaBlocks}\n`;

    updateLocalData({ content: nextContent });
    // Keep schemaCode state intact even after applying to the content to allow manual code modifications
    alert(`[${currentType}] 스키마가 본문 하단에 성공적으로 가동되었습니다! 타 스키마들과 병합 완료되어 여러 개의 구조화 데이터가 동시 작동합니다.`);
  };

  const handleDeleteSchema = () => {
    if (!data || !updateLocalData) return;
    if (!window.confirm("본문에서 기존 스키마 마크업을 완전히 제거할까요?")) return;

    const cleanRegex = /\n*\s*(<!--\s*CREAIBOX_SCHEMA_START[\s\S]*?CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">[\s\S]*?<\/script>)\s*\n*/gi;
    const nextContent = data.content.replace(cleanRegex, "").trim();

    updateLocalData({ content: nextContent });
    setSchemaCode("");
    alert("본문에서 스키마 마크업이 제거되었습니다. '원고 저장' 버튼을 눌러야 적용됩니다.");
  };

  const handleCopySchema = () => {
    if (!schemaCode) return;
    navigator.clipboard.writeText(schemaCode);
    alert("스키마 코드가 클립보드에 복사되었습니다.");
  };

  // 🌟 다중 구조화 스키마 리치 결과 통합 미리보기 리스트 생성기 (Multi-Schema Preview List Engine)
  const schemasList = useMemo(() => {
    const list: Array<{
      type: string;
      headline: string;
      description: string;
      url: string;
      isPending?: boolean;
    }> = [];
    const processedTypes = new Set<string>();

    let pendingType = "";
    if (schemaCode) {
      try {
        const parsed = JSON.parse(schemaCode);
        pendingType = parsed["@type"] || "Article";
      } catch {}
    }

    // 1. 본문 데이터에 이미 등록되어 있는 스키마 블록들을 파싱하여 적재합니다.
    const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = schemaRegex.exec(data?.content || "")) !== null) {
      const code = (match[1] || match[2] || "").trim();
      if (code) {
        try {
          const parsed = JSON.parse(code);
          const type = parsed["@type"] || "Schema";
          
          // 만약 방금 새로 생성한 임시 스키마(대기 중)와 타입이 겹치는 경우, 대기 중인 최신 스키마가 우선이므로 스킵합니다.
          if (type === pendingType) continue;

          if (!processedTypes.has(type)) {
            processedTypes.add(type);

            const headline = parsed.headline || parsed.name || data?.title || "제목 정보가 스키마에 없습니다.";
            let description = parsed.description;
            
            if (!description && type === "FAQPage" && Array.isArray(parsed.mainEntity) && parsed.mainEntity.length > 0) {
              description = parsed.mainEntity.map((faq: any, idx: number) => {
                const q = faq.name || "";
                const a = faq.acceptedAnswer?.text || "";
                return `Q${idx + 1}. ${q}\nA${idx + 1}. ${a}`;
              }).join("\n\n");
            }

            if (!description && type === "HowTo") {
              const steps = parsed.step || parsed.steps || [];
              if (Array.isArray(steps) && steps.length > 0) {
                description = steps.map((s: any, idx: number) => {
                  if (typeof s === "string") return `Step ${idx + 1}. ${s}`;
                  const sName = s.name || "";
                  const sText = s.text || "";
                  return `[단계 ${idx + 1}] ${sName}${sText ? `: ${sText}` : ""}`;
                }).join("\n");
              } else if (typeof steps === "object" && steps !== null) {
                const sName = (steps as any).name || "";
                const sText = (steps as any).text || "";
                description = `[단계 1] ${sName}${sText ? `: ${sText}` : ""}`;
              }
            }

            if (!description && type === "Product") {
              const brandName = typeof parsed.brand === "object" ? (parsed.brand?.name || "") : (parsed.brand || "");
              const price = parsed.offers?.price || "";
              const currency = parsed.offers?.priceCurrency || "";
              const availability = parsed.offers?.availability === "https://schema.org/InStock" ? "재고 있음" : "";
              const rating = parsed.aggregateRating?.ratingValue || "";
              const count = parsed.aggregateRating?.reviewCount || parsed.aggregateRating?.ratingCount || "";
              const lines = [];
              if (brandName) lines.push(`브랜드: ${brandName}`);
              if (price) lines.push(`가격: ${price} ${currency} ${availability ? `(${availability})` : ""}`);
              if (rating) lines.push(`평점: ⭐ ${rating} / 5.0 ${count ? `(리뷰 ${count}개)` : ""}`);
              if (parsed.description) lines.push(`제품 설명: ${parsed.description}`);
              if (lines.length > 0) {
                description = lines.join("\n");
              }
            }

            if (!description && type === "LocalBusiness") {
              const phone = parsed.telephone || "";
              const addr = typeof parsed.address === "object"
                ? `${parsed.address?.addressRegion || ""} ${parsed.address?.addressLocality || ""} ${parsed.address?.streetAddress || ""}`.trim()
                : (parsed.address || "");
              const openHours = parsed.openingHoursSpecification || parsed.openingHours || "";
              let parsedHours = "";
              if (Array.isArray(openHours)) {
                parsedHours = openHours.map((oh: any) => {
                  const days = Array.isArray(oh.dayOfWeek) ? oh.dayOfWeek.join(", ") : (oh.dayOfWeek || "");
                  return `${days}: ${oh.opens || ""} ~ ${oh.closes || ""}`;
                }).join(" / ");
              } else if (typeof openHours === "string") {
                parsedHours = openHours;
              }
              const lines = [];
              if (addr) lines.push(`주소: ${addr}`);
              if (phone) lines.push(`연락처: ${phone}`);
              if (parsedHours) lines.push(`영업시간: ${parsedHours}`);
              if (parsed.description) lines.push(`소개: ${parsed.description}`);
              if (lines.length > 0) {
                description = lines.join("\n");
              }
            }

            if (!description) {
              description = data?.metaDescription || "본문 내용 요약 혹은 메타 설명 정보가 없습니다.";
            }

            const url = parsed.mainEntityOfPage?.["@id"] || parsed.url || data?.canonicalUrl || "https://creaibox.com/blog-slug";

            list.push({ type, headline, description, url, isPending: false });
          }
        } catch {}
      }
    }

    // 2. 방금 AI가 새로 생성해내어 대기 중인 임시 스키마 코드(schemaCode)가 있으면 리스트 최상단에 주입합니다!
    if (schemaCode) {
      try {
        const parsed = JSON.parse(schemaCode);
        const type = parsed["@type"] || "Article";

        const headline = parsed.headline || parsed.name || data?.title || "제목 정보가 스키마에 없습니다.";
        let description = parsed.description;
        
        if (!description && type === "FAQPage" && Array.isArray(parsed.mainEntity) && parsed.mainEntity.length > 0) {
          description = parsed.mainEntity.map((faq: any, idx: number) => {
            const q = faq.name || "";
            const a = faq.acceptedAnswer?.text || "";
            return `Q${idx + 1}. ${q}\nA${idx + 1}. ${a}`;
          }).join("\n\n");
        }

        if (!description && type === "HowTo") {
          const steps = parsed.step || parsed.steps || [];
          if (Array.isArray(steps) && steps.length > 0) {
            description = steps.map((s: any, idx: number) => {
              if (typeof s === "string") return `Step ${idx + 1}. ${s}`;
              const sName = s.name || "";
              const sText = s.text || "";
              return `[단계 ${idx + 1}] ${sName}${sText ? `: ${sText}` : ""}`;
            }).join("\n");
          } else if (typeof steps === "object" && steps !== null) {
            const sName = (steps as any).name || "";
            const sText = (steps as any).text || "";
            description = `[단계 1] ${sName}${sText ? `: ${sText}` : ""}`;
          }
        }

        if (!description && type === "Product") {
          const brandName = typeof parsed.brand === "object" ? (parsed.brand?.name || "") : (parsed.brand || "");
          const price = parsed.offers?.price || "";
          const currency = parsed.offers?.priceCurrency || "";
          const availability = parsed.offers?.availability === "https://schema.org/InStock" ? "재고 있음" : "";
          const rating = parsed.aggregateRating?.ratingValue || "";
          const count = parsed.aggregateRating?.reviewCount || parsed.aggregateRating?.ratingCount || "";
          const lines = [];
          if (brandName) lines.push(`브랜드: ${brandName}`);
          if (price) lines.push(`가격: ${price} ${currency} ${availability ? `(${availability})` : ""}`);
          if (rating) lines.push(`평점: ⭐ ${rating} / 5.0 ${count ? `(리뷰 ${count}개)` : ""}`);
          if (parsed.description) lines.push(`제품 설명: ${parsed.description}`);
          if (lines.length > 0) {
            description = lines.join("\n");
          }
        }

        if (!description && type === "LocalBusiness") {
          const phone = parsed.telephone || "";
          const addr = typeof parsed.address === "object"
            ? `${parsed.address?.addressRegion || ""} ${parsed.address?.addressLocality || ""} ${parsed.address?.streetAddress || ""}`.trim()
            : (parsed.address || "");
          const openHours = parsed.openingHoursSpecification || parsed.openingHours || "";
          let parsedHours = "";
          if (Array.isArray(openHours)) {
            parsedHours = openHours.map((oh: any) => {
              const days = Array.isArray(oh.dayOfWeek) ? oh.dayOfWeek.join(", ") : (oh.dayOfWeek || "");
              return `${days}: ${oh.opens || ""} ~ ${oh.closes || ""}`;
            }).join(" / ");
          } else if (typeof openHours === "string") {
            parsedHours = openHours;
          }
          const lines = [];
          if (addr) lines.push(`주소: ${addr}`);
          if (phone) lines.push(`연락처: ${phone}`);
          if (parsedHours) lines.push(`영업시간: ${parsedHours}`);
          if (parsed.description) lines.push(`소개: ${parsed.description}`);
          if (lines.length > 0) {
            description = lines.join("\n");
          }
        }

        if (!description) {
          description = data?.metaDescription || "본문 내용 요약 혹은 메타 설명 정보가 없습니다.";
        }

        const url = parsed.mainEntityOfPage?.["@id"] || parsed.url || data?.canonicalUrl || "https://creaibox.com/blog-slug";

        list.unshift({ type, headline, description, url, isPending: true });
      } catch {}
    }

    return list;
  }, [schemaCode, data]);

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
              JSON-LD Code
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
            className="w-full h-40 p-3.5 rounded-xl bg-black border border-zinc-800 text-emerald-400 font-mono text-[10px] leading-relaxed custom-scrollbar focus:outline-none focus:border-zinc-700"
          />
        </div>
      )}

      {/* Apply / Delete Actions */}
      {schemaCode && (
        <div className="flex gap-2 pt-1">
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

      {/* 🔍 Google/Naver Search Rich Snippet Result Previews (Multi-Card Container) */}
      {schemasList.length > 0 && (
        <div className="space-y-4 pt-4 text-left animate-in fade-in duration-500 border-t border-zinc-855">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Eye size={12} className="text-sky-400" />
              검색엔진(구글, 네이버 등) 노출 미리보기(Preview)
            </span>
            <span className="text-[9px] text-zinc-500 font-bold leading-normal">
              💡 본문에 장착되었거나 적용 대기 중인 모든 스키마의 가상 검색 결과 카드입니다.
            </span>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {schemasList.map((preview, index) => (
              <div key={`${preview.type}-${index}`} className="bg-[#0b0f19] border border-zinc-800 rounded-xl p-3.5 space-y-1.5 shadow-inner">
                <div className="flex items-start gap-1.5 text-zinc-400 text-[10px] leading-relaxed">
                  <Globe size={11} className="text-zinc-500 shrink-0 mt-0.5" />
                  <span className="break-all font-medium">{preview.url}</span>
                </div>
                <h4 className="text-[13px] font-black text-[#8ab4f8] hover:underline cursor-pointer leading-tight">
                  {preview.headline}
                </h4>
                <p className="text-[11px] leading-relaxed text-zinc-400 whitespace-pre-wrap break-all">
                  {preview.description}
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-zinc-500 font-bold uppercase">
                  <span>구조화 유형: {preview.type}</span>
                  {preview.isPending ? (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded leading-none text-[8.5px] font-black tracking-wide">
                      적용 대기 중
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none text-[8.5px] font-black tracking-wide">
                      장착 완료
                    </span>
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
