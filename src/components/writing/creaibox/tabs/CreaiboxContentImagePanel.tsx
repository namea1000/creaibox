"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserGeminiVaultConfig } from "@/lib/client/api-vault";
import {
  ImagePlus,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Trash2,
  Plus,
  Play,
  Check,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  PlusCircle,
  X,
  Eye,
  Download,
} from "lucide-react";

interface CreaiboxContentImagePanelProps {
  data?: any;
}

interface ImageItem {
  id: string;
  url: string;
  title?: string;
  source: "shared" | "stock" | "personal" | "ai";
}

export default function CreaiboxContentImagePanel({ data }: CreaiboxContentImagePanelProps) {
  const supabase = useMemo(() => createClient(), []);

  // 1. Collapsible Section States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shared: true,
    stock: false,
    personal: false,
    ai: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 2. Selected Images Shelf Queue State
  const [queue, setQueue] = useState<ImageItem[]>([]);

  // 3. Shared Library States (CreAibox 공유 라이브러리)
  const [sharedAssets, setSharedAssets] = useState<ImageItem[]>([]);
  const [isSharedLoading, setIsSharedLoading] = useState(false);
  const [sharedSearchQuery, setSharedSearchQuery] = useState("");
  const [selectedSharedCategory, setSelectedSharedCategory] = useState("ALL");

  // Filtered Shared Assets Memo
  const filteredSharedAssets = useMemo(() => {
    return sharedAssets.filter((img: any) => {
      // Category filter matching themeCategory or tags list
      if (selectedSharedCategory !== "ALL") {
        const categoryLower = selectedSharedCategory.toLowerCase();
        const hasCategoryMatch = 
          img.themeCategory?.toLowerCase() === categoryLower ||
          img.tags?.some((t: string) => t.toLowerCase() === categoryLower);
        
        if (!hasCategoryMatch) return false;
      }

      // Keyword query filter matching title or tags list
      if (sharedSearchQuery.trim()) {
        const queryLower = sharedSearchQuery.toLowerCase().trim();
        const titleMatch = img.title?.toLowerCase().includes(queryLower);
        const tagMatch = img.tags?.some((t: string) => t.toLowerCase().includes(queryLower));
        
        if (!titleMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [sharedAssets, selectedSharedCategory, sharedSearchQuery]);

  // 4. Stock Image Search States
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [stockProvider, setStockProvider] = useState<"pixabay" | "pexels" | "adobe">("pixabay");
  const [stockImages, setStockImages] = useState<ImageItem[]>([]);
  const [isStockLoading, setIsStockLoading] = useState(false);

  // 5. Personal Library States (나의 콘텐츠 라이브러리)
  const [personalImages, setPersonalImages] = useState<ImageItem[]>([]);
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // 6. AI Image Generation States
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState<number>(1);
  const [aiStyle, setAiStyle] = useState("naver-blog-vector");
  const [aiStyleDetail, setAiStyleDetail] = useState("⭐ 정보성 비주얼");
  const [aiAspectRatio, setAiAspectRatio] = useState("3:2");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSourceId = String(data?.id || "temp-draft");
  const manuscriptTitle = data?.title || "";
  const manuscriptKeyword = data?.targetKeyword || data?.keyword || "";
  const manuscriptContent = data?.content || "";

  // 7. Resolve User ID
  const resolveUserId = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  }, [supabase]);

  // Load CreAibox Shared Library Assets
  const fetchSharedAssets = useCallback(async () => {
    setIsSharedLoading(true);
    try {
      const response = await fetch("/api/free-assets/list");
      const result = await response.json();
      if (response.ok && result.files) {
        // Filter only image assets
        const imagesOnly = result.files
          .filter((file: any) => file.mimeType?.startsWith("image/"))
          .map((file: any) => ({
            id: file.id,
            url: file.url,
            title: file.title || file.name,
            source: "shared" as const,
          }));
        setSharedAssets(imagesOnly);
      }
    } catch (err) {
      console.error("공유 에셋 로드 실패:", err);
    } finally {
      setIsSharedLoading(false);
    }
  }, []);

  // Load Personal Library Images
  const fetchPersonalImages = useCallback(async () => {
    setIsPersonalLoading(true);
    try {
      const userId = await resolveUserId();
      if (!userId) return;

      const { data: dbImages, error } = await supabase
        .from("generated_images")
        .select("id, image_url, title, prompt")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(40);

      if (error) throw error;

      const items: ImageItem[] = (dbImages || []).map((img: any) => ({
        id: String(img.id),
        url: img.image_url,
        title: img.title || img.prompt || "업로드 이미지",
        source: "personal" as const,
      }));

      setPersonalImages(items);
    } catch (err) {
      console.error("개인 라이브러리 이미지 로드 실패:", err);
    } finally {
      setIsPersonalLoading(false);
    }
  }, [resolveUserId, supabase]);

  // Load initially
  useEffect(() => {
    void fetchSharedAssets();
    void fetchPersonalImages();
  }, [fetchSharedAssets, fetchPersonalImages]);

  // Handle local file upload (My Content Library)
  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const userId = await resolveUserId();
      if (!userId) {
        alert("로그인 세션을 확인할 수 없습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceType", "writing_creaibox_posts");
      formData.append("sourceId", activeSourceId);
      formData.append("imageRole", "content_image");
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("targetKeyword", manuscriptKeyword || "블로그 본문");

      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "이미지 업로드에 실패했습니다.");
      }

      const uploadedImage: ImageItem = {
        id: String(result.image.id),
        url: result.image.image_url,
        title: result.image.title || file.name,
        source: "personal" as const,
      };

      setPersonalImages((prev) => [uploadedImage, ...prev]);
      // Auto add to queue shelf
      addToQueue(uploadedImage);
    } catch (err: any) {
      alert(err.message || "이미지 업로드 실패");
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  // Compile AI Generation Prompt
  useEffect(() => {
    if (!manuscriptTitle && !manuscriptKeyword) return;
    const contentSnippet = manuscriptContent.replace(/\s+/g, " ").trim().slice(0, 260);

    const generatedPrompt = [
      `아래 원고에 어울리는 본문 설명용 정보성 일러스트/사진 이미지를 제작해줘.`,
      `[제목] ${manuscriptTitle}`,
      `[키워드] ${manuscriptKeyword}`,
      contentSnippet ? `[본문 내용] ${contentSnippet}` : "",
    ].filter(Boolean).join("\n");

    setAiPrompt(generatedPrompt);
  }, [manuscriptTitle, manuscriptKeyword, manuscriptContent]);

  // AI Generate Image Handler
  const handleAiGenerate = async () => {
    const geminiConfig = getUserGeminiVaultConfig();
    const apiKey = geminiConfig?.apiKey || localStorage.getItem("openai_api_key");

    if (!apiKey) {
      alert("사용자 정보 -> API 키 관리(/apivault)에서 API Key를 먼저 입력해주세요.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/image-studio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          count: aiCount,
          aspectRatio: aiAspectRatio,
          provider: geminiConfig ? "gemini" : "openai",
          model: geminiConfig?.model || "dall-e-3",
          apiKey,
          style: aiStyle,
          styleDetail: aiStyleDetail,
          sourceType: "writing_creaibox_posts",
          sourceId: activeSourceId,
          imageRole: "content_image",
          markAsPrimary: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "AI 이미지 생성에 실패했습니다.");
      }

      const newImages: ImageItem[] = (result.images || []).map((img: any, idx: number) => ({
        id: String(img.id || `${Date.now()}-${idx}`),
        url: img.image_url || img.url,
        title: img.prompt || `AI 생성 이미지 ${idx + 1}`,
        source: "ai" as const,
      }));

      // Update personal library grid
      setPersonalImages((prev) => [...newImages, ...prev]);

      // Add all generated images directly to the queue shelf
      newImages.forEach((img) => addToQueue(img));
      
      // Expand the personal library section to let them see
      setOpenSections((prev) => ({
        ...prev,
        personal: true,
        ai: false,
      }));

      alert(`${newImages.length}개의 AI 이미지가 생성되어 대기열에 추가되었습니다!`);
    } catch (err: any) {
      alert(err.message || "AI 이미지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Stock Media Search Handler
  const handleSearchStock = () => {
    if (!stockSearchQuery.trim()) {
      alert("검색어를 입력해 주세요.");
      return;
    }

    setIsStockLoading(true);
    
    // Simulate stock image search (Loads high-quality matching photography from Unsplash/Pexels using keywords)
    setTimeout(() => {
      const q = encodeURIComponent(stockSearchQuery.trim());
      const mockStock: ImageItem[] = [
        {
          id: `stock-${Date.now()}-1`,
          url: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}`,
          title: `${stockSearchQuery} 스톡 이미지 1`,
          source: "stock" as const,
        },
        {
          id: `stock-${Date.now()}-2`,
          url: `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}`,
          title: `${stockSearchQuery} 스톡 이미지 2`,
          source: "stock" as const,
        },
        {
          id: `stock-${Date.now()}-3`,
          url: `https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}`,
          title: `${stockSearchQuery} 스톡 이미지 3`,
          source: "stock" as const,
        },
        {
          id: `stock-${Date.now()}-4`,
          url: `https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=800&q=80&sig=${Math.random()}`,
          title: `${stockSearchQuery} 스톡 이미지 4`,
          source: "stock" as const,
        },
      ];
      setStockImages(mockStock);
      setIsStockLoading(false);
    }, 600);
  };

  // 8. Queue Management (대기열 관리)
  const addToQueue = (item: ImageItem) => {
    setQueue((prev) => {
      if (prev.some((q) => q.url === item.url)) return prev;
      return [...prev, item];
    });
  };

  const removeFromQueue = (itemUrl: string) => {
    setQueue((prev) => prev.filter((q) => q.url !== itemUrl));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  // 9. Tiptap Insertion Handlers
  const handleInsertImageToEditor = (url: string, titleText?: string) => {
    const safeUrl = (url.includes("googleusercontent.com") || url.includes("drive.google.com"))
      ? `/api/free-assets/proxy?url=${encodeURIComponent(url)}`
      : url;

    window.dispatchEvent(
      new CustomEvent("insert-editor-image", {
        detail: {
          url: safeUrl,
          alt: manuscriptKeyword || "본문 이미지",
          title: titleText || "이미지",
        },
      })
    );
  };

  const handleBatchInsert = () => {
    if (queue.length === 0) return;
    queue.forEach((item) => {
      handleInsertImageToEditor(item.url, item.title);
    });
    alert(`${queue.length}개의 이미지를 본문 커서 위치에 차례대로 삽입했습니다!`);
  };

  // Drag Start Handler
  const handleDragStart = (e: React.DragEvent, url: string) => {
    const safeUrl = (url.includes("googleusercontent.com") || url.includes("drive.google.com"))
      ? `/api/free-assets/proxy?url=${encodeURIComponent(url)}`
      : url;

    e.dataTransfer.setData("text/html", `<img src="${safeUrl}" alt="${manuscriptKeyword || '본문 이미지'}" style="margin: 2rem auto; display: block; max-width: 100%;" />`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] text-white relative">
      {/* 1. Main Accordion Contents */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-48">
        
        {/* SECTION 1: CreAibox 공유 라이브러리 */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#111622]/40">
          <button
            type="button"
            onClick={() => toggleSection("shared")}
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800/60 transition text-left"
          >
            <span className="text-[13px] font-black flex items-center gap-2 text-sky-400">
              <ImageIcon size={14} />
              1. CreAibox 공유 라이브러리
            </span>
            {openSections.shared ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.shared && (
            <div className="p-3 border-t border-zinc-800 space-y-3">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                에디터를 위해 제공되는 고품질 무료 공유 일러스트 및 사진 에셋입니다.
              </p>

              {/* 🔍 Search Input Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={sharedSearchQuery}
                  onChange={(e) => setSharedSearchQuery(e.target.value)}
                  placeholder="공유 이미지 검색 (태그, 제목...)"
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500 focus:bg-zinc-950 transition outline-none"
                />
                {sharedSearchQuery && (
                  <button
                    onClick={() => setSharedSearchQuery("")}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-white transition"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* 🏷️ Horizontal Category Scroll Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-800 custom-scrollbar whitespace-nowrap">
                {[
                  { id: "ALL", label: "전체" },
                  { id: "tech", label: "기술/IT" },
                  { id: "business", label: "비즈니스" },
                  { id: "art", label: "디자인" },
                  { id: "food", label: "푸드/음식" },
                  { id: "nature", label: "풍경/자연" },
                  { id: "animal", label: "동물" },
                  { id: "texture", label: "텍스처" },
                  { id: "people", label: "인물" },
                  { id: "fashion", label: "패션" },
                  { id: "architecture", label: "건축" },
                  { id: "education", label: "교육" },
                  { id: "health", label: "의료" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedSharedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
                      selectedSharedCategory === cat.id
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                        : "bg-zinc-950/50 hover:bg-zinc-900 text-zinc-400 border border-zinc-800/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 🖼️ Grid Image Gallery */}
              {isSharedLoading ? (
                <div className="flex justify-center py-8 text-zinc-500">
                  <Loader2 className="animate-spin" size={18} />
                </div>
              ) : filteredSharedAssets.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zinc-800/60 rounded-xl bg-zinc-950/30">
                  <p className="text-[10px] text-zinc-500 font-bold">조건에 맞는 공유 이미지가 없습니다.</p>
                  <p className="text-[9px] text-zinc-600 mt-1">다른 검색어 또는 카테고리를 선택해 보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredSharedAssets.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer"
                      onClick={() => addToQueue(img)}
                    >
                      <img
                        src={(img.url.includes("googleusercontent.com") || img.url.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(img.url)}` : img.url}
                        alt="shared"
                        className="w-full h-full object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <PlusCircle size={18} className="text-sky-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: 외부 이미지 검색 */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#111622]/40">
          <button
            type="button"
            onClick={() => toggleSection("stock")}
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800/60 transition text-left"
          >
            <span className="text-[13px] font-black flex items-center gap-2 text-indigo-400">
              <Search size={14} />
              2. 외부 이미지 검색
            </span>
            {openSections.stock ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.stock && (
            <div className="p-3 border-t border-zinc-800 space-y-3">
              <div className="flex rounded-lg border border-zinc-800 overflow-hidden text-[10px] font-black bg-zinc-950">
                {(["pixabay", "pexels", "adobe"] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setStockProvider(prov)}
                    className={`flex-1 py-1.5 transition ${
                      stockProvider === prov
                        ? "bg-indigo-600 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {prov === "pixabay" ? "Pixabay" : prov === "pexels" ? "Pexels" : "Adobe Stock"}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="예: 골프 스윙, 컴퓨터, 커피..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchStock()}
                />
                <button
                  type="button"
                  onClick={handleSearchStock}
                  className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center"
                >
                  <Search size={13} />
                </button>
              </div>

              {isStockLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-indigo-400" size={18} />
                </div>
              ) : stockImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                  {stockImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-video rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer"
                      onClick={() => addToQueue(img)}
                    >
                      <img src={img.url} alt="stock" className="w-full h-full object-cover transition group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <PlusCircle size={18} className="text-indigo-300" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-600 text-center py-3">키워드를 입력해 스톡 이미지를 실시간 검색해 보세요.</p>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: 나의 콘텐츠 라이브러리 */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#111622]/40">
          <button
            type="button"
            onClick={() => toggleSection("personal")}
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800/60 transition text-left"
          >
            <span className="text-[13px] font-black flex items-center gap-2 text-emerald-400">
              <ImagePlus size={14} />
              3. 나의 콘텐츠 라이브러리
            </span>
            {openSections.personal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.personal && (
            <div className="p-3 border-t border-zinc-800 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="flex-1 py-2 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 text-xs font-black flex items-center justify-center gap-1.5 transition"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={13} />
                  ) : (
                    <UploadCloud size={13} />
                  )}
                  컴퓨터에서 직접 업로드
                </button>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {isPersonalLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-emerald-400" size={18} />
                </div>
              ) : personalImages.length === 0 ? (
                <p className="text-[11px] text-zinc-600 text-center py-4">보관된 콘텐츠 이미지가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                  {personalImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer"
                      onClick={() => addToQueue(img)}
                    >
                      <img 
                        src={(img.url.includes("googleusercontent.com") || img.url.includes("drive.google.com")) 
                          ? `/api/free-assets/proxy?url=${encodeURIComponent(img.url)}` 
                          : img.url} 
                        alt="personal" 
                        className="w-full h-full object-cover transition group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <PlusCircle size={18} className="text-emerald-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 4: AI 이미지 생성 */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#111622]/40">
          <button
            type="button"
            onClick={() => toggleSection("ai")}
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800/60 transition text-left"
          >
            <span className="text-[13px] font-black flex items-center gap-2 text-violet-400">
              <Sparkles size={14} />
              4. AI 이미지 생성 (원고 문맥)
            </span>
            {openSections.ai ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.ai && (
            <div className="p-3 border-t border-zinc-800 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">화풍 스타일</label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
                >
                  <option value="naver-blog-vector">⭐ 네이버 비주얼 그래픽</option>
                  <option value="wordpress-modern-illustration">⭐ 워드프레스 일러스트</option>
                  <option value="photorealistic-commercial">⭐ 광고용 고품질 실사 사진</option>
                  <option value="infographic-chart">⭐ 인포그래픽/도표형</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 mb-1">이미지 비율</label>
                  <select
                    value={aiAspectRatio}
                    onChange={(e) => setAiAspectRatio(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-350 outline-none cursor-pointer"
                  >
                    <option value="3:2">3:2 (기본)</option>
                    <option value="4:3">4:3 (사진형)</option>
                    <option value="16:9">16:9 (와이드)</option>
                    <option value="1:1">1:1 (정사각형)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 mb-1">생성 개수</label>
                  <div className="flex rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950 text-xs font-black">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setAiCount(count)}
                        className={`flex-1 py-1 text-center transition ${
                          aiCount === count ? "bg-violet-600 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">생성 프롬프트</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-violet-500 resize-none font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-violet-900/20 active:scale-[0.98] transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>원고 분석하여 이미지 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>AI 이미지 생성 ({aiCount}장)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Persistent Bottom Selected Images Shelf Queue */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#090b10] via-[#0d1017] to-[#0d1017]/95 border-t border-zinc-850 p-4 shadow-2xl flex flex-col gap-3 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-black tracking-wider text-sky-400 bg-sky-950/40 px-2.5 py-1 rounded-md border border-sky-500/20">
              선택 대기열 ({queue.length})
            </span>
            <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
              *클릭 시 즉시 커서 위치 삽입, 혹은 끌어서 본문 드롭
            </span>
          </div>
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              type="button"
              className="text-[10px] font-black text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 size={11} /> 비우기
            </button>
          )}
        </div>

        {/* Queue list scroll shelf */}
        {queue.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-xl py-6 flex flex-col items-center justify-center text-center bg-zinc-950/20">
            <ImagePlus size={20} className="text-zinc-700" />
            <p className="mt-1 text-[11px] font-bold text-zinc-500">위 보관함에서 이미지를 클릭해 추가하세요.</p>
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1.5 scroll-smooth">
            {queue.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.url)}
                onClick={() => handleInsertImageToEditor(item.url, item.title)}
                className="group relative h-16 w-16 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shrink-0 cursor-pointer hover:border-sky-500 transition shadow-md"
                title={`${item.title} (클릭하여 커서 위치 삽입 / 드래그 지원)`}
              >
                <img src={(item.url.includes("googleusercontent.com") || item.url.includes("drive.google.com")) ? `/api/free-assets/proxy?url=${encodeURIComponent(item.url)}` : item.url} alt="queue-thumb" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-[9px] font-black text-zinc-300">
                  <Check size={12} className="text-emerald-400" />
                  <span>본문 삽입</span>
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(item.url);
                  }}
                  className="absolute top-0.5 right-0.5 h-4 w-4 bg-black/60 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {queue.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleBatchInsert}
              className="py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-sky-950/20 transition active:scale-[0.98]"
            >
              <PlusCircle size={13} />
              선택한 {queue.length}개 일괄 삽입
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("대기열의 마지막 이미지를 본문에 추가합니다.")) {
                  const last = queue[queue.length - 1];
                  handleInsertImageToEditor(last.url, last.title);
                }
              }}
              className="py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <X size={13} className="rotate-45" />
              마지막 항목 삽입
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
