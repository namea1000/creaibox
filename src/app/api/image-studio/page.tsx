"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Copy,
  RefreshCw,
  Wand2,
  Grid,
  ArrowDownToLine,
  Globe,
  Tag,
  Download,
} from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  styleDetail: string;
  prompt: string;
  type: "ai" | "stock";
  aspectRatio?: string;
  provider?: string;
}

const styleOptions = [
  {
    label: "하이퍼 리얼리즘 실사",
    value: "hyper-realistic-photo",
    details: ["인물 실사", "제품 사진", "블로그 썸네일", "시네마틱 실사"],
  },
  {
    label: "애니메이션",
    value: "anime",
    details: ["재패니즈 애니", "웹툰 스타일", "픽사풍 3D", "사이버펑크 애니"],
  },
  {
    label: "미니멀 일러스트",
    value: "minimal-vector",
    details: ["플랫 벡터", "네이버 블로그용", "아이콘형", "파스텔톤"],
  },
  {
    label: "3D 입체 그래픽",
    value: "cinematic-3d",
    details: ["팝아트 3D", "제품 광고 3D", "메타버스", "고급 렌더링"],
  },
];

const aspectRatioOptions = [
  { label: "1:1 정사각형", value: "1:1" },
  { label: "16:9 유튜브/블로그 와이드", value: "16:9" },
  { label: "9:16 쇼츠/릴스", value: "9:16" },
  { label: "4:5 인스타 피드", value: "4:5" },
  { label: "3:2 블로그/카메라 비율", value: "3:2" },
];

const modelOptions = [
  { label: "OpenAI", value: "openai" },
  { label: "Gemini", value: "gemini" },
];

export default function NaverThumbnailPage() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic-photo");
  const [selectedStyleDetail, setSelectedStyleDetail] = useState("인물 실사");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [generateCount, setGenerateCount] = useState("1");
  const [downloadFormat, setDownloadFormat] = useState<"png" | "webp">("png");

  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("tech");

  const [gallery, setGallery] = useState<GeneratedImage[]>([]);

  const selectedStyleData = styleOptions.find((s) => s.value === selectedStyle);

  const promptTemplates: Record<string, { categoryLabel: string; items: string[] }> = {
    tech: {
      categoryLabel: "💻 IT / 테크",
      items: [
        "네온 블루 조명이 흐르는 미래형 홀로그램 인공지능 로봇의 두뇌 분석 장면",
        "어두운 방안에서 사이버펑크 스타일 노트북 화면을 보며 열광하는 20대 개발자",
        "스마트폰 액정에서 입체적인 3D 메타버스 그래픽이 우상향 팝업으로 뿜어져 나오는 비주얼",
      ],
    },
    food: {
      categoryLabel: "🍕 맛집 / 요리",
      items: [
        "갓 구워낸 시그니처 화덕 피자 위에서 치즈가 길게 늘어나며 연기가 피어오르는 실사",
        "고급 레스토랑의 미디엄 레어 스테이크가 육즙을 머금은 채 단면이 깔끔하게 잘려 있는 미식 탑뷰",
      ],
    },
    finance: {
      categoryLabel: "💵 금융 / 재테크",
      items: [
        "황금색 비트코인 실물 주화들과 뒤로 우상향 주식 차트가 빛나는 연출",
        "태블릿 화면 위에 디지털 캔들 차트가 폭발적인 상승 곡선을 그리는 모습",
      ],
    },
  };

  const handleSelectTemplate = (promptText: string) => {
    setImagePrompt(promptText);
  };

  const handleAiGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      alert("만들고 싶은 이미지의 묘사나 키워드를 입력해 주세요!");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/image-studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: selectedStyle,
          styleDetail: selectedStyleDetail,
          aspectRatio: selectedAspectRatio,
          provider: selectedProvider,
          count: Number(generateCount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "이미지 생성에 실패했습니다.");
      }

      const newImages: GeneratedImage[] = data.images.map((img: any) => ({
        id: img.id,
        url: img.image_url,
        style: img.style,
        styleDetail: img.style_detail,
        prompt: img.prompt,
        type: "ai",
        aspectRatio: img.aspect_ratio,
        provider: img.provider,
      }));

      setGallery((prev) => [...newImages, ...prev]);
    } catch (error: any) {
      alert(error.message || "이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchStockImages = () => {
    if (!stockSearchQuery) return alert("검색할 무료 이미지 키워드를 입력하세요!");
    setIsStockLoading(true);

    setTimeout(() => {
      const stockImages: GeneratedImage[] = [
        {
          id: `stock-${Date.now()}-1`,
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
          style: "무료 스톡 이미지",
          styleDetail: "Unsplash",
          prompt: stockSearchQuery,
          type: "stock",
        },
      ];

      setGallery((prev) => [...stockImages, ...prev]);
      setIsStockLoading(false);
    }, 1000);
  };

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    alert("이미지 주소가 복사되었습니다.");
  };

  const handleDownload = async (url: string, id: string) => {
    const res = await fetch(`/api/image-studio/download?url=${encodeURIComponent(url)}&format=${downloadFormat}`);
    const blob = await res.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `creaibox-${id}.${downloadFormat}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-4 gap-4 text-zinc-100 overflow-hidden">
      <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto pr-1.5 custom-scrollbar">
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4 shadow-xl shrink-0">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
            <Wand2 size={14} /> AI Image Studio
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">1. 이미지 생성 프롬프트</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="만들고 싶은 이미지를 자세히 입력하세요..."
                className="w-full h-24 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 resize-none font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">2. 이미지 생성 모델</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                {modelOptions.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">3. 스타일 선택</label>
              <select
                value={selectedStyle}
                onChange={(e) => {
                  const nextStyle = e.target.value;
                  const nextStyleData = styleOptions.find((s) => s.value === nextStyle);
                  setSelectedStyle(nextStyle);
                  setSelectedStyleDetail(nextStyleData?.details[0] || "");
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                {styleOptions.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">4. 스타일별 세부 선택</label>
              <select
                value={selectedStyleDetail}
                onChange={(e) => setSelectedStyleDetail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                {selectedStyleData?.details.map((detail) => (
                  <option key={detail} value={detail}>
                    {detail}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">5. 비율 / 사이즈 선택</label>
              <select
                value={selectedAspectRatio}
                onChange={(e) => setSelectedAspectRatio(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                {aspectRatioOptions.map((ratio) => (
                  <option key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1.5">6. 생성 개수</label>
              <select
                value={generateCount}
                onChange={(e) => setGenerateCount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none"
              >
                <option value="1">1장 생성</option>
                <option value="2">2장 생성</option>
                <option value="3">3장 생성</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAiGenerateImage}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-800 text-white text-xs font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin text-blue-400" /> 이미지 생성 및 저장 중...
              </>
            ) : (
              <>
                <Sparkles size={14} /> AI 이미지 생성
              </>
            )}
          </button>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-3 shadow-xl shrink-0">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <Globe size={14} /> Free Stock Finder
          </h3>

          <div className="relative text-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input
              type="text"
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="무료 스톡 사진 검색"
              className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700"
            />
            <button
              onClick={handleSearchStockImages}
              disabled={isStockLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-zinc-800 text-emerald-400 font-black rounded-lg text-[10px]"
            >
              {isStockLoading ? "조회중" : "검색"}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4 shadow-xl flex-1 flex flex-col min-h-[400px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-1.5">
            <Tag size={14} /> Prompt Blueprint Hub
          </h3>

          <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar shrink-0 border-b border-zinc-800/60">
            {Object.entries(promptTemplates).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap border ${activeCategory === key
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
              >
                {value.categoryLabel}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-0.5">
            {promptTemplates[activeCategory]?.items.map((template, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTemplate(template)}
                className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-amber-500/20 text-[11px] text-zinc-400 hover:text-zinc-200 font-medium leading-relaxed transition-all cursor-pointer flex gap-1.5"
              >
                <span className="text-[10px] font-mono font-bold text-amber-500/60">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <span>{template}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
        <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-black text-zinc-200 flex items-center gap-2">
            <Grid size={16} className="text-blue-400" /> 미디어 라이브러리 ({gallery.length})
          </h2>

          <div className="flex items-center gap-2">
            <Download size={14} className="text-emerald-400" />
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as "png" | "webp")}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 text-[11px] font-bold"
            >
              <option value="png">PNG 다운로드</option>
              <option value="webp">WebP 다운로드</option>
            </select>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-zinc-950/25">
          {gallery.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm font-bold">
              아직 생성된 이미지가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-3 overflow-hidden shadow-xl transition-all hover:border-zinc-700/80 flex flex-col"
                >
                  <div className="relative w-full h-54 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt="Generated Asset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600/90 border border-blue-500 text-white">
                        {img.type === "ai" ? "AI" : "STOCK"}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300">
                        {img.provider || "-"}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded-md text-zinc-300">
                        {img.aspectRatio || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-3 pt-1">
                    <div className="space-y-1">
                      <p className="text-[11px] text-zinc-500 font-bold">
                        {img.style} / {img.styleDetail}
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">
                        <span className="text-zinc-500 font-bold">Prompt:</span> {img.prompt}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleCopyUrl(img.url)}
                        className="py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Copy size={13} /> 링크 복사
                      </button>

                      <button
                        onClick={() => handleDownload(img.url, img.id)}
                        className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 border border-zinc-700/60 text-xs font-black flex items-center justify-center gap-1"
                      >
                        <ArrowDownToLine size={13} /> {downloadFormat.toUpperCase()}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}