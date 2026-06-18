"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wand2,
  Type,
  Image as ImageIcon,
  Layers,
  Upload,
  Sparkles,
  Download,
  Trash2,
  RotateCcw,
  Palette,
  Check,
  FolderOpen,
  MousePointer,
  HelpCircle,
  Undo,
  Cloud,
  LayoutGrid,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface CanvasElement {
  id: string;
  type: "text" | "shape" | "image";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  shapeType?: "rect" | "circle" | "star";
}

export default function WorkspaceTab() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // Set dimensions based on presets or URL queries
  const initialWidth = parseInt(searchParams.get("width") || "1080");
  const initialHeight = parseInt(searchParams.get("height") || "1080");
  const initialImg = searchParams.get("imageUrl") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialMode = searchParams.get("mode") || "";

  const [canvasWidth, setCanvasWidth] = useState(initialWidth);
  const [canvasHeight, setCanvasHeight] = useState(initialHeight);
  const [canvasBg, setCanvasBg] = useState("#0d1117");

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // URL mode에 매핑되는 초기 탭 설정
  const defaultTab = useMemo(() => {
    if (initialMode === "bg-removal") return "ai";
    if (initialMode === "adjust" || initialMode === "color") return "brand";
    if (initialMode === "social") return "templates";
    return "templates";
  }, [initialMode]);

  const [sidebarTab, setSidebarTab] = useState<"templates" | "library" | "elements" | "text" | "uploads" | "brand" | "ai">(defaultTab);
  
  // 색조 필터 상태 변수들 (Canva 스타일 보정 도구)
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  // 배경 제거 상태 변수
  const [isBgRemoved, setIsBgRemoved] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  // 라이브러리 저장 상태 변수
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  
  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Drag States
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Download simulation
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize Canvas content with template if provided
  useEffect(() => {
    const defaultElements: CanvasElement[] = [];
    
    if (initialImg) {
      defaultElements.push({
        id: "el-bg-img",
        type: "image",
        content: `/api/free-assets/proxy?url=${encodeURIComponent(decodeURIComponent(initialImg))}`,
        x: 0,
        y: 0,
        width: 100,
        height: 100, // percentage based for background image
      });
    }

    defaultElements.push({
      id: "el-title",
      type: "text",
      content: initialTitle || "여블리 패션 코디 추천",
      x: 10,
      y: 15,
      width: 80,
      height: 15,
      color: "#ffffff",
      fontSize: 32,
      fontWeight: "900",
    });

    defaultElements.push({
      id: "el-sub",
      type: "text",
      content: "2026 트렌드 컬러 가이드",
      x: 10,
      y: 32,
      width: 60,
      height: 8,
      color: "#a78bfa",
      fontSize: 16,
      fontWeight: "bold",
    });

    defaultElements.push({
      id: "el-badge-shape",
      type: "shape",
      content: "",
      shapeType: "rect",
      x: 10,
      y: 8,
      width: 18,
      height: 5,
      color: "#ec4899",
    });

    defaultElements.push({
      id: "el-badge-text",
      type: "text",
      content: "DAILY LOOK",
      x: 11,
      y: 9,
      width: 16,
      height: 4,
      color: "#ffffff",
      fontSize: 10,
      fontWeight: "bold",
    });

    setElements(defaultElements);
    
    if (initialMode === "bg-removal") {
      setIsBgRemoved(true);
      setSelectedId("el-bg-img");
    }
  }, [initialImg, initialTitle, initialMode]);

  // 📚 보관함 이미지 목록 조회 상태 및 함수
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  const fetchLibraryImages = async () => {
    setIsLoadingLibrary(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("generated_images")
        .select("id, image_url, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setLibraryImages(data || []);
    } catch (err) {
      console.error("Fetch library images error:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  // 보관함 탭 활성화 시 목록 새로고침
  useEffect(() => {
    if (sidebarTab === "library") {
      fetchLibraryImages();
    }
  }, [sidebarTab]);

  // Handle drag mechanics
  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);

    const element = elements.find(el => el.id === id);
    if (!element) return;

    // Convert mouse coordinates relative to canvas wrapper
    const canvas = document.getElementById("editor-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: mouseXPercent - element.x,
      y: mouseYPercent - element.y
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId) return;

    const canvas = document.getElementById("editor-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    let newX = mouseXPercent - dragOffset.x;
    let newY = mouseYPercent - dragOffset.y;

    // Constrain within bounds roughly
    newX = Math.max(-10, Math.min(110, newX));
    newY = Math.max(-10, Math.min(110, newY));

    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return { ...el, x: Math.round(newX), y: Math.round(newY) };
      }
      return el;
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Add Elements
  const addTextElement = (size: "h1" | "h2" | "body") => {
    const textConfigs = {
      h1: { content: "새 대형 제목", size: 28, color: "#ffffff", weight: "900", height: 12 },
      h2: { content: "새 부제목", size: 18, color: "#cbd5e1", weight: "bold", height: 8 },
      body: { content: "여기에 본문 텍스트를 입력하세요.", size: 12, color: "#94a3b8", weight: "normal", height: 6 },
    };
    const config = textConfigs[size];
    
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: "text",
      content: config.content,
      x: 20,
      y: 45,
      width: 50,
      height: config.height,
      color: config.color,
      fontSize: config.size,
      fontWeight: config.weight,
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const addShapeElement = (shape: "rect" | "circle" | "star") => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: "shape",
      shapeType: shape,
      content: "",
      x: 30,
      y: 50,
      width: 15,
      height: 15,
      color: "#8b5cf6",
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleInsertImage = (url: string) => {
    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: "image",
      content: url,
      x: 20,
      y: 30,
      width: 40,
      height: 40,
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleGenerateAiImage = () => {
    if (!aiPrompt.trim()) return alert("만들고 싶은 이미지 묘사를 입력하세요!");
    setIsAiGenerating(true);

    setTimeout(() => {
      // Mock generated image insert
      const mockAiUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
      handleInsertImage(mockAiUrl);
      setIsAiGenerating(false);
      setAiPrompt("");
    }, 1800);
  };

  // Delete Selected Layer
  const handleDeleteElement = () => {
    if (!selectedId) return;
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  // Change selected element color
  const handleUpdateElementColor = (color: string) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return { ...el, color };
      }
      return el;
    }));
  };

  // Change selected text content
  const handleUpdateTextContent = (content: string) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return { ...el, content };
      }
      return el;
    }));
  };

  // Change text size
  const handleUpdateFontSize = (change: number) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedId && el.type === "text" && el.fontSize) {
        return { ...el, fontSize: Math.max(8, el.fontSize + change) };
      }
      return el;
    }));
  };

  // Layer order controls
  const handleMoveLayer = (direction: "front" | "back") => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx === -1) return;

    const updated = [...elements];
    const item = updated.splice(idx, 1)[0];
    if (direction === "front") {
      updated.push(item);
    } else {
      updated.unshift(item);
    }
    setElements(updated);
  };

  // 🎨 실시간 레이아웃을 실제 해상도로 드로잉하는 헬퍼 함수
  const drawCanvas = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. 배경 채우기
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 화면상 캔버스 크기를 구해서 텍스트 폰트 크기 조절용 scale 계산
    const editorCanvasEl = document.getElementById("editor-canvas");
    const rect = editorCanvasEl ? editorCanvasEl.getBoundingClientRect() : { width: canvasWidth };
    const scale = canvasWidth / (rect.width || canvasWidth);

    // 2. 요소들 그리기
    for (const el of elements) {
      const isBg = el.id === "el-bg-img";
      const x = isBg ? 0 : (el.x / 100) * canvas.width;
      const y = isBg ? 0 : (el.y / 100) * canvas.height;
      const w = isBg ? canvas.width : (el.width / 100) * canvas.width;
      const h = isBg ? canvas.height : (el.height / 100) * canvas.height;

      if (el.type === "image") {
        // 이미지 로드용 Promise
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const i = new Image();
          i.crossOrigin = "anonymous";
          i.onload = () => resolve(i);
          i.onerror = () => resolve(null);
          i.src = el.content;
        });

        if (img) {
          ctx.save();
          
          // 배경 제거 시 크로마키(multiply) 적용
          if (isBgRemoved && isBg) {
            ctx.globalCompositeOperation = "multiply";
            ctx.globalAlpha = 0.9;
          }

          // 필터 적용
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur * scale}px) grayscale(${grayscale}%) sepia(${sepia}%)`;

          ctx.drawImage(img, x, y, w, h);
          ctx.restore();
        }
      } else if (el.type === "shape") {
        ctx.save();
        ctx.fillStyle = el.color || "#8b5cf6";
        if (el.shapeType === "circle") {
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (el.shapeType === "star") {
          ctx.beginPath();
          const cx = x + w / 2;
          const cy = y + h / 2;
          const spikes = 5;
          const outerRadius = Math.min(w, h) / 2;
          const innerRadius = outerRadius * 0.4;
          let rot = (Math.PI / 2) * 3;
          let sx = cx;
          let sy = cy;
          const step = Math.PI / spikes;

          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            sx = cx + Math.cos(rot) * outerRadius;
            sy = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(sx, sy);
            rot += step;

            sx = cx + Math.cos(rot) * innerRadius;
            sy = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(sx, sy);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
          ctx.fill();
        } else {
          // 기본 사각형 (rect)
          const radius = 4 * scale;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, w, h, radius);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.fill();
        }
        ctx.restore();
      } else if (el.type === "text") {
        ctx.save();
        ctx.fillStyle = el.color || "#ffffff";
        const fontSize = (el.fontSize || 16) * scale;
        ctx.font = `${el.fontWeight || "normal"} ${fontSize}px sans-serif`;
        ctx.textBaseline = "top";
        
        // 줄바꿈 처리
        const words = el.content.split("");
        let line = "";
        const maxWidth = w;
        const lineHeight = fontSize * 1.2;
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n];
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n];
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        ctx.restore();
      }
    }

    return canvas;
  };

  // Trigger compiler download
  const handleCompileDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(10);

    try {
      setDownloadProgress(30);
      const canvas = await drawCanvas();
      if (!canvas) {
        throw new Error("캔버스 렌더링에 실패했습니다.");
      }
      
      setDownloadProgress(70);
      const dataUrl = canvas.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.download = `${initialTitle || "디자인_수정본"}_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
      }, 300);
    } catch (err: any) {
      console.error(err);
      setIsDownloading(false);
      alert(`다운로드 실패: ${err.message || err}`);
    }
  };

  // 사용자의 이미지 라이브러리에 저장
  const handleSaveToLibrary = async () => {
    setIsSavingToLibrary(true);
    setSaveProgress(10);

    try {
      setSaveProgress(30);
      const canvas = await drawCanvas();
      if (!canvas) {
        throw new Error("캔버스 렌더링에 실패했습니다.");
      }

      setSaveProgress(50);
      
      // canvas를 blob으로 변환
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.92);
      });

      if (!blob) {
        throw new Error("이미지 파일 생성에 실패했습니다.");
      }

      setSaveProgress(70);

      // FormData 생성 및 API 호출
      const formData = new FormData();
      formData.append("file", blob, `canvas-${Date.now()}.webp`);
      formData.append("sourceType", "image-studio");
      formData.append("title", initialTitle || "디자인 편집기 작업 이미지");
      formData.append("imageRole", "gallery");

      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `서버 응답 오류 (코드: ${response.status})`);
      }

      setSaveProgress(100);
      setTimeout(() => {
        setIsSavingToLibrary(false);
        alert("성공적으로 보관함(이미지 라이브러리)에 저장되었습니다!");
        fetchLibraryImages();
      }, 300);
    } catch (err: any) {
      console.error(err);
      setIsSavingToLibrary(false);
      alert(`보관함 저장 실패: ${err.message || err}`);
    }
  };

  const selectedEl = useMemo(() => {
    return elements.find(el => el.id === selectedId) || null;
  }, [elements, selectedId]);

  // Templates
  const templateLayouts = [
    { title: "테크 리뷰 카드", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80" },
    { title: "뷰티 데일리룩", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" },
    { title: "미니멀리즘 가구", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=150&q=80" },
  ];

  // Stock Photos
  const stockPhotos = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80",
  ];

  const brandColors = ["#8B5CF6", "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#ffffff", "#000000"];

  return (
    <div className="flex flex-col lg:flex-row border border-zinc-800 bg-[#090d16]/30 rounded-2xl overflow-hidden h-[calc(100vh-170px)] text-left relative shadow-2xl">
      
      {/* Processing download modal overlay */}
      {isDownloading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-850" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            <span className="text-xs font-black text-white font-mono">{downloadProgress}%</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Rendering Design Canvas</h4>
            <p className="text-xs text-zinc-500">HTML5 Canvas 그래픽 데이터 변환 및 패킹 중...</p>
          </div>
        </div>
      )}

      {/* 👈 Left Toolbar Selector */}
      <div className="w-16 border-r border-zinc-800 bg-zinc-950/80 flex flex-col items-center py-4 gap-4 shrink-0">
        {[
          { id: "templates", label: "템플릿", icon: LayoutGrid },
          { id: "library", label: "보관함", icon: FolderOpen },
          { id: "elements", label: "요소", icon: Layers },
          { id: "text", label: "텍스트", icon: Type },
          { id: "uploads", label: "업로드", icon: Upload },
          { id: "brand", label: "브랜드", icon: Palette },
          { id: "ai", label: "AI 그래픽", icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = sidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSidebarTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 w-12 py-2 rounded-xl transition-all cursor-pointer ${
                isActive ? "bg-purple-600/10 text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 👈 Left Secondary Tab Options Panel */}
      <div className="w-72 border-r border-zinc-800 bg-[#06080d]/60 p-4 overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
        {sidebarTab === "templates" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">디자인 템플릿</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              새로운 레이아웃을 클릭하면 편집 영역이 프리셋 템플릿 데이터로 덮어씌워집니다.
            </p>
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {templateLayouts.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // Overwrite canvas with selection
                    if (i === 1) {
                      setElements([
                        { id: "el-bg-img", type: "image", content: t.url, x: 0, y: 0, width: 100, height: 100 },
                        { id: "el-t", type: "text", content: "BEAUTY LOOKS", x: 10, y: 15, width: 80, height: 15, color: "#ffffff", fontSize: 26, fontWeight: "900" }
                      ]);
                    } else {
                      setElements([
                        { id: "el-bg-img", type: "image", content: t.url, x: 0, y: 0, width: 100, height: 100 },
                        { id: "el-t", type: "text", content: "TECH IDEAS", x: 10, y: 15, width: 80, height: 15, color: "#38bdf8", fontSize: 28, fontWeight: "900" }
                      ]);
                    }
                  }}
                  className="group rounded-xl border border-zinc-850 bg-zinc-950 p-2 text-left hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <img src={t.url} alt={t.title} className="w-full h-20 object-cover rounded-lg border border-zinc-900 mb-2" />
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200">{t.title}</span>
                </button>
              ))}
            </div>

            {/* 📏 소셜 미디어 해상도 규격 프리셋 추가 */}
            <div className="border-t border-zinc-900 pt-4 mt-4 space-y-4">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={14} className="text-purple-400" /> 소셜 미디어 규격 변환
              </h4>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {[
                  { name: "인스타그램 피드 (1:1)", w: 1080, h: 1080, desc: "카드뉴스용 스퀘어 규격" },
                  { name: "인스타그램 스토리 (9:16)", w: 1080, h: 1920, desc: "릴스 / 쇼츠 모바일 규격" },
                  { name: "유튜브 썸네일 (16:9)", w: 1280, h: 720, desc: "가로 와이드 스크린" },
                  { name: "페이스북 커버 (1.91:1)", w: 1200, h: 630, desc: "공유용 가로형 규격" },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setCanvasWidth(preset.w);
                      setCanvasHeight(preset.h);
                    }}
                    className="w-full text-left p-3 border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 rounded-xl hover:border-purple-500/30 transition-all flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">{preset.name}</span>
                      <span className="text-[9px] text-zinc-500 font-bold block mt-0.5">{preset.desc}</span>
                    </div>
                    <span className="text-[10px] text-purple-400 font-mono font-black shrink-0 ml-2">
                      {preset.w}x{preset.h}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {sidebarTab === "library" && (
          <div className="space-y-4 flex-1 flex flex-col h-full">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">내 이미지 보관함</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              사용자 이미지 라이브러리에 저장된 작업물 목록입니다. 클릭하면 즉시 캔버스 레이어로 삽입됩니다.
            </p>
            
            {isLoadingLibrary ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <div className="h-5 w-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span className="text-[10px] text-zinc-500">라이브러리 불러오는 중...</span>
              </div>
            ) : libraryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20">
                <FolderOpen className="text-zinc-650 mb-2" size={20} />
                <span className="text-[10px] font-bold text-zinc-500">저장된 이미지가 없습니다.</span>
                <span className="text-[9px] text-zinc-600 mt-1 leading-relaxed px-4">
                  우측 하단의 "보관함에 저장" 버튼을 눌러 첫 작업물을 보관해보세요!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-2 flex-1 overflow-y-auto custom-scrollbar">
                {libraryImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleInsertImage(img.image_url)}
                    className="group rounded-xl border border-zinc-850 bg-zinc-950 p-2 text-left hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col w-full"
                  >
                    <img 
                      src={img.image_url} 
                      alt={img.title || "Library Asset"} 
                      className="w-full h-20 min-h-[80px] object-cover rounded-lg border border-zinc-900 mb-1.5" 
                    />
                    <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-200 block truncate w-full">
                      {img.title || "제목 없음"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {sidebarTab === "elements" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">디자인 요소 추가</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">디자인에 배치할 도형을 선택하여 캔버스에 추가하세요.</p>
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[
                { type: "rect", label: "사각형", style: "rounded-lg" },
                { type: "circle", label: "원형", style: "rounded-full" },
                { type: "star", label: "별모양", style: "clip-path-star" },
              ].map(shape => (
                <button
                  key={shape.type}
                  onClick={() => addShapeElement(shape.type as any)}
                  className="flex flex-col items-center justify-center p-3 border border-zinc-850 bg-zinc-950 rounded-xl hover:border-purple-500/30 transition text-zinc-400 hover:text-white cursor-pointer"
                >
                  <div className={`h-8 w-8 bg-purple-500/10 border border-purple-500/30 ${shape.style} mb-1.5`} />
                  <span className="text-[10px] font-bold">{shape.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">텍스트 상자 추가</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">원하는 크기의 타이포그래피 레이어를 클릭하여 캔버스에 얹어보세요.</p>
            <div className="space-y-2.5 pt-2">
              {[
                { size: "h1" as const, label: "제목 텍스트 추가", class: "text-lg font-black text-white" },
                { size: "h2" as const, label: "부제목 텍스트 추가", class: "text-sm font-bold text-zinc-250" },
                { size: "body" as const, label: "본문 텍스트 추가", class: "text-xs font-medium text-zinc-450" },
              ].map(txt => (
                <button
                  key={txt.size}
                  onClick={() => addTextElement(txt.size)}
                  className="w-full p-4 border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 rounded-xl hover:border-purple-500/30 transition text-left cursor-pointer"
                >
                  <span className={txt.class}>{txt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === "uploads" && (
          <div className="space-y-4 flex-1 flex flex-col">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">파일 업로드</h3>
            
            <label className="border border-dashed border-zinc-850 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/40 bg-zinc-950/40 transition">
              <Upload className="text-zinc-600 mb-2" size={18} />
              <span className="text-[10px] font-bold text-zinc-400">내 이미지 파일 업로드</span>
              <span className="text-[9px] text-zinc-600 mt-1 font-mono">PNG, JPG (MAX 5MB)</span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        handleInsertImage(event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            <div className="space-y-2.5 pt-2 flex-1 overflow-y-auto custom-scrollbar">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">추천 스톡 사진</h4>
              <div className="grid grid-cols-2 gap-2">
                {stockPhotos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => handleInsertImage(photo)}
                    className="rounded-lg overflow-hidden border border-zinc-900 hover:border-purple-500/20 transition cursor-pointer"
                  >
                    <img src={photo} alt="Stock" className="h-16 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {sidebarTab === "brand" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">브랜드 키트</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              사전에 약속된 브랜드 테마 컬러입니다. 선택한 요소가 있을 시 적용되며, 선택 요소가 없을 시 캔버스 배경에 입혀집니다.
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2">
              {brandColors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    if (selectedId) {
                      handleUpdateElementColor(color);
                    } else {
                      setCanvasBg(color);
                    }
                  }}
                  className="h-10 rounded-lg border border-zinc-850 shadow-md relative group cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  style={{ backgroundColor: color }}
                >
                  <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold text-white font-mono uppercase tracking-tighter">
                    APPLY
                  </span>
                </button>
              ))}
            </div>

            {/* 🎨 Canva 스타일 이미지 필터/조정 툴 추가 */}
            <div className="border-t border-zinc-900 pt-4 mt-4 space-y-4">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Palette size={14} className="text-purple-400" /> 이미지 보정 및 필터
              </h4>
              <div className="space-y-3.5">
                {[
                  { key: "brightness", label: "밝기 (Brightness)", min: 0, max: 200, unit: "%", val: brightness, setVal: setBrightness },
                  { key: "contrast", label: "대비 (Contrast)", min: 0, max: 200, unit: "%", val: contrast, setVal: setContrast },
                  { key: "saturate", label: "채도 (Saturation)", min: 0, max: 200, unit: "%", val: saturate, setVal: setSaturate },
                  { key: "blur", label: "흐림 (Blur)", min: 0, max: 20, unit: "px", val: blur, setVal: setBlur },
                  { key: "grayscale", label: "흑백 (Grayscale)", min: 0, max: 100, unit: "%", val: grayscale, setVal: setGrayscale },
                  { key: "sepia", label: "세피아 (Sepia)", min: 0, max: 100, unit: "%", val: sepia, setVal: setSepia },
                ].map((slider) => (
                  <div key={slider.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400">
                      <span>{slider.label}</span>
                      <span className="font-mono text-purple-400">{slider.val}{slider.unit}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      value={slider.val}
                      onChange={(e) => slider.setVal(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setSaturate(100);
                    setBlur(0);
                    setGrayscale(0);
                    setSepia(0);
                  }}
                  className="w-full py-2 border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white transition rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                >
                  보정 값 초기화
                </button>
              </div>
            </div>
          </div>
        )}

        {sidebarTab === "ai" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">AI 이미지 생성</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed">원하는 풍경이나 오브젝트를 타이핑하면 AI가 실시간 드로잉하여 캔버스에 추가합니다.</p>
            <textarea
              placeholder="예: 어두운 방안에서 사이버펑크 스타일 노트북 화면을 보며 열광하는 20대 개발자..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full h-24 p-3 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-purple-500/50 resize-none font-medium leading-relaxed"
            />
            <button
              onClick={handleGenerateAiImage}
              disabled={isAiGenerating || !aiPrompt.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-zinc-800 text-white text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isAiGenerating ? (
                <>AI 그래픽 렌더링 중...</>
              ) : (
                <>
                  <Sparkles size={13} /> 매직 AI 추가
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 💻 Center Canvas Editor Workspace */}
      <div className="flex-1 bg-zinc-950/80 p-6 flex flex-col justify-between items-center relative overflow-hidden">
        
        {/* Top Floating Option Panel */}
        <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex flex-wrap gap-3.5 items-center justify-between shadow-lg mb-4 text-xs font-sans select-none">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 tracking-wider">
              {selectedEl ? `${selectedEl.type.toUpperCase()} LAYER` : "CANVAS ACTIVE"}
            </span>

            {/* Context option actions based on selected elements */}
            {selectedEl?.type === "text" && (
              <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-3">
                <button
                  onClick={() => handleUpdateFontSize(2)}
                  className="h-7 w-7 rounded border border-zinc-800 hover:bg-zinc-800 text-white font-bold"
                >
                  A+
                </button>
                <button
                  onClick={() => handleUpdateFontSize(-2)}
                  className="h-7 w-7 rounded border border-zinc-800 hover:bg-zinc-800 text-white font-bold"
                >
                  A-
                </button>
                <div className="flex gap-1">
                  {brandColors.slice(0, 4).map(c => (
                    <button
                      key={c}
                      onClick={() => handleUpdateElementColor(c)}
                      className="h-4.5 w-4.5 rounded-full border border-zinc-900"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedEl?.type === "image" && (
              <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-3">
                <button
                  type="button"
                  onClick={async () => {
                    setIsRemovingBg(true);
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    setIsBgRemoved(prev => !prev);
                    setIsRemovingBg(false);
                  }}
                  disabled={isRemovingBg}
                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-850 px-3 py-1.5 rounded text-[10px] font-black text-white transition-all cursor-pointer"
                >
                  <Sparkles size={11} className={isRemovingBg ? "animate-spin" : ""} />
                  {isRemovingBg ? "배경 지우는 중..." : isBgRemoved ? "배경 지우기 취소" : "매직 AI 배경 제거"}
                </button>
              </div>
            )}

            {selectedEl?.type === "shape" && (
              <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
                <span className="text-[10px] font-bold text-zinc-500">도형 채우기:</span>
                <div className="flex gap-1">
                  {brandColors.map(c => (
                    <button
                      key={c}
                      onClick={() => handleUpdateElementColor(c)}
                      className="h-4.5 w-4.5 rounded-sm border border-zinc-900"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!selectedEl && (
              <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-3">
                <span className="text-[10px] font-bold text-zinc-500">배경 색상:</span>
                <div className="flex gap-1">
                  {brandColors.map(c => (
                    <button
                      key={c}
                      onClick={() => setCanvasBg(c)}
                      className="h-4.5 w-4.5 rounded-sm border border-zinc-900"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {selectedEl && (
              <>
                <button
                  onClick={() => handleMoveLayer("front")}
                  className="px-2 py-1.5 rounded border border-zinc-850 hover:bg-zinc-800 text-[10px] font-black text-zinc-400 hover:text-white"
                >
                  맨 앞으로
                </button>
                <button
                  onClick={() => handleMoveLayer("back")}
                  className="px-2 py-1.5 rounded border border-zinc-850 hover:bg-zinc-800 text-[10px] font-black text-zinc-400 hover:text-white"
                >
                  맨 뒤로
                </button>
                <button
                  onClick={handleDeleteElement}
                  className="p-1.5 rounded bg-red-950/10 border border-red-900/30 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}

            <button
              onClick={() => {
                setElements([]);
                setSelectedId(null);
                setCanvasBg("#0d1117");
              }}
              className="p-1.5 rounded border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              title="캔버스 초기화"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* 🎨 Canvas Art Board Display */}
        <div className="flex-1 flex items-center justify-center w-full overflow-auto p-4 custom-scrollbar">
          <div
            id="editor-canvas"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="relative shadow-2xl transition-all duration-150 select-none overflow-hidden"
            style={{
              width: "100%",
              maxWidth: `${canvasWidth}px`,
              aspectRatio: `${canvasWidth} / ${canvasHeight}`,
              backgroundColor: canvasBg,
            }}
          >
            {elements.map((el) => {
              const isSelected = selectedId === el.id;
              
              if (el.type === "image") {
                const isBg = el.id === "el-bg-img";
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                    className={`absolute select-none group cursor-move ${
                      isBg ? "w-full h-full inset-0 pointer-events-none z-0" : "z-10"
                    } ${isSelected ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#06080d]" : ""}`}
                    style={
                      isBg
                        ? {}
                        : {
                            left: `${el.x}%`,
                            top: `${el.y}%`,
                            width: `${el.width}%`,
                            height: `${el.height}%`,
                          }
                    }
                  >
                    <img
                      src={el.content}
                      alt="Layer"
                      className="w-full h-full object-cover pointer-events-none rounded-lg transition-all"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`,
                        mixBlendMode: isBgRemoved ? "multiply" : "normal",
                        opacity: isBgRemoved && isBg ? 0.9 : 1,
                      }}
                    />
                  </div>
                );
              }

              if (el.type === "shape") {
                const isCircle = el.shapeType === "circle";
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                    className={`absolute select-none cursor-move z-10 ${
                      isSelected ? "ring-2 ring-purple-500" : ""
                    }`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                    }}
                  >
                    <div
                      className="w-full h-full transition-all"
                      style={{
                        backgroundColor: el.color || "#3b82f6",
                        borderRadius: isCircle ? "9999px" : "4px",
                      }}
                    />
                  </div>
                );
              }

              if (el.type === "text") {
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                    className={`absolute select-none cursor-move z-10 font-sans break-words ${
                      isSelected ? "ring-2 ring-purple-500 p-1 rounded" : ""
                    }`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      color: el.color || "#ffffff",
                      fontSize: el.fontSize ? `${el.fontSize}px` : "16px",
                      fontWeight: el.fontWeight || "normal",
                    }}
                  >
                    {isSelected ? (
                      <input
                        type="text"
                        value={el.content}
                        onChange={(e) => handleUpdateTextContent(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-full bg-zinc-950/80 border border-purple-500 rounded px-1 text-white outline-none font-bold"
                        style={{
                          fontSize: el.fontSize ? `${el.fontSize}px` : "16px",
                          fontWeight: el.fontWeight || "normal",
                        }}
                      />
                    ) : (
                      el.content
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Bottom Save & Compile Area */}
        <div className="w-full max-w-4xl bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-md mt-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isSavingToLibrary ? "bg-purple-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
            <span className="text-zinc-500 font-bold">에디터 상태: </span>
            <span className="text-zinc-350 font-bold">
              {isSavingToLibrary 
                ? `보관함 저장 중... (${saveProgress}%)` 
                : "임시 저장 완료"}
            </span>
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSaveToLibrary}
              disabled={isSavingToLibrary || isDownloading}
              className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-650 border border-zinc-800 hover:border-purple-500/30 text-zinc-300 font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Cloud size={14} className={isSavingToLibrary ? "animate-pulse text-purple-400" : ""} />
              {isSavingToLibrary ? "저장 중..." : "보관함에 저장"}
            </button>
            <button
              onClick={handleCompileDownload}
              disabled={isSavingToLibrary || isDownloading}
              className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download size={14} /> 다운로드
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
