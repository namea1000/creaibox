"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Pipette, 
  ArrowLeftRight, 
  HelpCircle, 
  AlertCircle, 
  Check, 
  Palette, 
  Paintbrush,
  Eraser,
  Undo
} from "lucide-react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

export default function BackgroundRemoverPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [mode, setMode] = useState<"auto" | "chromakey">("auto");
  
  // 크로마키 스포이트 제어 상태
  const [selectedColor, setSelectedColor] = useState<RGB | null>(null);
  const [threshold, setThreshold] = useState<number>(30); 
  const [feather, setFeather] = useState<number>(10);     
  
  // 수동 브러시 도구 제어 상태
  const [brushMode, setBrushMode] = useState<"none" | "erase" | "restore" | "color">("none");
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushColor, setBrushColor] = useState<string>("#3b82f6");

  // 배경 합성용 상태
  const [bgType, setBgType] = useState<"transparent" | "color" | "gradient">("transparent");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [bgGradient, setBgGradient] = useState<string>("linear-gradient(to right, #ff7e5f, #feb47b)"); 

  // 실행 취소(Undo) 히스토리 스택 상태
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);

  // 작업 처리용 상태
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  
  // UI 마우스 및 슬라이더 제어 상태
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"after" | "before-after">("after");
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // 브러시 마우스 드로잉 상태 추적
  const [isDrawingBrush, setIsDrawingBrush] = useState<boolean>(false);
  const [brushCoords, setBrushCoords] = useState<{ x: number; y: number } | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // 참조 변수
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const isDragging = useRef<boolean>(false);

  // 실행 취소 히스토리 백업 함수
  const saveToHistory = () => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;
    
    const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
    setHistoryStack((prev) => {
      const nextStack = [...prev, imgData];
      if (nextStack.length > 25) {
        nextStack.shift(); // 메모리 관리를 위해 최근 25개까지만 제한 보관
      }
      return nextStack;
    });
  };

  // 실행 취소 처리 함수
  const handleUndo = () => {
    if (historyStack.length === 0) return;
    
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;

    setHistoryStack((prev) => {
      const nextStack = [...prev];
      const lastImgData = nextStack.pop();
      if (lastImgData) {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        ctx.putImageData(lastImgData, 0, 0);
        updatePreviewCanvas();
      }
      return nextStack;
    });
  };

  // 단축키 Ctrl+Z / Cmd+Z 연동
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [historyStack]);

  // 1. 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    setImageName(file.name);
    setIsDone(false);
    setSelectedColor(null);
    setBrushMode("none");
    setHistoryStack([]); // 히스토리 리셋
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. 이미지 객체 생성 및 로딩 완료 시 캔버스 초기화
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImageRef.current = img;
      initCanvases(img);
    };
  }, [imageSrc]);

  // 캔버스 초기화 및 원본 드로잉
  const initCanvases = (img: HTMLImageElement) => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    
    mainCanvas.width = img.naturalWidth;
    mainCanvas.height = img.naturalHeight;
    
    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.drawImage(img, 0, 0);
    
    updatePreviewCanvas();
  };

  // 3. 실시간 캔버스 픽셀 연산 필터 구동 (누끼 제거 핵심 로직)
  const applyBackgroundRemoval = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!originalImageRef.current) return;
    
    // 원본 이미지를 복원하여 캔버스에 새로 그림
    ctx.drawImage(originalImageRef.current, 0, 0);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let targetR = 255;
    let targetG = 255;
    let targetB = 255;

    // A. AI 자동 감지 모드인 경우
    if (mode === "auto") {
      const corners = [
        getPixelColor(data, 0, 0, width),
        getPixelColor(data, width - 1, 0, width),
        getPixelColor(data, 0, height - 1, width),
        getPixelColor(data, width - 1, height - 1, width),
        getPixelColor(data, Math.floor(width / 2), 0, width),
        getPixelColor(data, 0, Math.floor(height / 2), width),
      ];
      
      const validCorners = corners.filter(c => c !== null) as RGB[];
      if (validCorners.length > 0) {
        targetR = Math.floor(validCorners.reduce((acc, c) => acc + c.r, 0) / validCorners.length);
        targetG = Math.floor(validCorners.reduce((acc, c) => acc + c.g, 0) / validCorners.length);
        targetB = Math.floor(validCorners.reduce((acc, c) => acc + c.b, 0) / validCorners.length);
      }
    } else {
      // B. 크로마키 스포이트 모드인 경우
      if (!selectedColor) return;
      targetR = selectedColor.r;
      targetG = selectedColor.g;
      targetB = selectedColor.b;
    }

    // C. 픽셀별 유클리드 거리 및 알파 마스킹 적용
    const tVal = threshold;
    const fVal = feather;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distance = Math.sqrt(
        (r - targetR) ** 2 +
        (g - targetG) ** 2 +
        (b - targetB) ** 2
      );

      if (distance < tVal) {
        if (fVal > 0 && distance > tVal - fVal) {
          const ratio = (distance - (tVal - fVal)) / fVal;
          data[i + 3] = Math.min(data[i + 3], Math.floor(ratio * 255));
        } else {
          data[i + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number): RGB | null => {
    const idx = (y * width + x) * 4;
    if (idx < 0 || idx >= data.length) return null;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2]
    };
  };

  // 4. 프리뷰 및 합성 캔버스 드로잉
  const updatePreviewCanvas = () => {
    const mainCanvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!mainCanvas || !previewCanvas || !originalImageRef.current) return;

    const ctxPreview = previewCanvas.getContext("2d");
    if (!ctxPreview) return;

    const parentWidth = containerRef.current?.clientWidth || 700;
    const parentHeight = 450;
    const imgRatio = originalImageRef.current.width / originalImageRef.current.height;
    
    let w = parentWidth;
    let h = parentWidth / imgRatio;
    if (h > parentHeight) {
      h = parentHeight;
      w = parentHeight * imgRatio;
    }

    previewCanvas.width = w;
    previewCanvas.height = h;

    ctxPreview.clearRect(0, 0, w, h);

    // A. 가상 배경 드로잉
    if (isDone && bgType !== "transparent") {
      ctxPreview.save();
      if (bgType === "color") {
        ctxPreview.fillStyle = bgColor;
        ctxPreview.fillRect(0, 0, w, h);
      } else if (bgType === "gradient") {
        const grad = ctxPreview.createLinearGradient(0, 0, w, h);
        if (bgGradient.includes("ff7e5f")) {
          grad.addColorStop(0, "#ff7e5f");
          grad.addColorStop(1, "#feb47b");
        } else if (bgGradient.includes("8a2be2")) {
          grad.addColorStop(0, "#8a2be2");
          grad.addColorStop(1, "#4a00e0");
        } else if (bgGradient.includes("1a365d")) {
          grad.addColorStop(0, "#1a365d");
          grad.addColorStop(1, "#2b6cb0");
        } else if (bgGradient.includes("00b4db")) {
          grad.addColorStop(0, "#00b4db");
          grad.addColorStop(1, "#0083b0");
        } else {
          grad.addColorStop(0, "#11998e");
          grad.addColorStop(1, "#38ef7d");
        }
        ctxPreview.fillStyle = grad;
        ctxPreview.fillRect(0, 0, w, h);
      }
      ctxPreview.restore();
    }

    // B. 가공 결과물 이미지 그리기
    if (isDone) {
      ctxPreview.drawImage(mainCanvas, 0, 0, w, h);
    } else {
      ctxPreview.drawImage(originalImageRef.current, 0, 0, w, h);
    }
  };

  // 설정 매핑 업데이트 감지
  useEffect(() => {
    if (originalImageRef.current && (isDone || mode === "chromakey")) {
      const mainCanvas = canvasRef.current;
      if (!mainCanvas) return;
      const ctx = mainCanvas.getContext("2d");
      if (!ctx) return;
      
      if (brushMode === "none") {
        applyBackgroundRemoval(ctx, mainCanvas.width, mainCanvas.height);
      }
      updatePreviewCanvas();
    }
  }, [threshold, feather, selectedColor, mode, bgType, bgColor, bgGradient]);

  // 5. AI 자동 제거 구동 액션 (시뮬레이터)
  const triggerAutoRemoval = () => {
    if (!imageSrc) return;
    
    // 동작 전 히스토리 상태 백업
    saveToHistory();

    setIsProcessing(true);
    setIsDone(false);
    
    const steps = [
      "피사체 윤곽 감지 중...",
      "알파 채널 마스크 생성 중...",
      "에징 매트(Edge Matte) 다듬기 적용 중...",
      "누끼 완료 및 투명 PNG 병합 중..."
    ];

    let currentStep = 0;
    setProcessStep(steps[currentStep]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        const mainCanvas = canvasRef.current;
        if (mainCanvas) {
          const ctx = mainCanvas.getContext("2d");
          if (ctx) {
            applyBackgroundRemoval(ctx, mainCanvas.width, mainCanvas.height);
          }
        }
        
        setIsProcessing(false);
        setIsDone(true);
        updatePreviewCanvas();
      }
    }, 600);
  };

  // 6. 스포이트 클릭 감지 픽셀 캡처
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropperActive || !previewCanvasRef.current || !originalImageRef.current) return;
    
    // 작업 개시 전 상태 백업
    saveToHistory();

    const rect = previewCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ratioX = originalImageRef.current.width / previewCanvasRef.current.width;
    const ratioY = originalImageRef.current.height / previewCanvasRef.current.height;
    
    const realX = Math.floor(x * ratioX);
    const realY = Math.floor(y * ratioY);

    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(originalImageRef.current, 0, 0);
    const tempPixel = ctx.getImageData(realX, realY, 1, 1).data;
    
    setSelectedColor({
      r: tempPixel[0],
      g: tempPixel[1],
      b: tempPixel[2]
    });
    
    setIsEyedropperActive(false);
    setIsDone(true); 
  };

  // 7. 수동 브러시 그리기 구현 핵심 함수
  const drawBrushStroke = (clientX: number, clientY: number) => {
    const mainCanvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!mainCanvas || !previewCanvas || !originalImageRef.current || brushMode === "none") return;

    const ctx = mainCanvas.getContext("2d");
    if (!ctx) return;

    const rect = previewCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ratioX = mainCanvas.width / previewCanvas.width;
    const ratioY = mainCanvas.height / previewCanvas.height;
    const realX = x * ratioX;
    const realY = y * ratioY;

    if (!lastPosRef.current) {
      lastPosRef.current = { x: realX, y: realY };
      return;
    }

    const startX = lastPosRef.current.x;
    const startY = lastPosRef.current.y;
    const scaledBrushSize = brushSize * ratioX;

    ctx.save();
    
    if (brushMode === "erase") {
      // 1. 투명 지우개
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(realX, realY);
      ctx.lineWidth = scaledBrushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    } else if (brushMode === "restore") {
      // 2. 🆕 원본 영역 복구 (Canvas Pattern API 기반 무결 구현)
      const pattern = ctx.createPattern(originalImageRef.current, "no-repeat");
      if (pattern) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = pattern;
        ctx.lineWidth = scaledBrushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(realX, realY);
        ctx.stroke();
      }
    } else if (brushMode === "color") {
      // 3. 브러시 컬러 페인팅
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(realX, realY);
      ctx.lineWidth = scaledBrushSize;
      ctx.strokeStyle = brushColor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    ctx.restore();

    lastPosRef.current = { x: realX, y: realY };
    updatePreviewCanvas();
  };

  // 마우스 브러시 이벤트 헬퍼
  const handleBrushMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (brushMode === "none" || isEyedropperActive) return;
    
    // 마우스 그리기 시작할 때 현재 캔버스 상태를 Undo 스택에 저장!
    saveToHistory();

    setIsDrawingBrush(true);
    
    const previewCanvas = previewCanvasRef.current;
    if (previewCanvas) {
      const rect = previewCanvas.getBoundingClientRect();
      const ratioX = (canvasRef.current?.width || 1) / previewCanvas.width;
      const ratioY = (canvasRef.current?.height || 1) / previewCanvas.height;
      const rx = (e.clientX - rect.left) * ratioX;
      const ry = (e.clientY - rect.top) * ratioY;
      lastPosRef.current = { x: rx, y: ry };
    }
  };

  const handleBrushMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;

    const rect = previewCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setBrushCoords({ x, y });

    if (isDrawingBrush) {
      drawBrushStroke(e.clientX, e.clientY);
    }
  };

  const handleBrushMouseUpOrLeave = () => {
    setIsDrawingBrush(false);
    lastPosRef.current = null;
  };

  // 8. 결과물 PNG 다운로드 핸들러
  const handleDownload = () => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;

    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = mainCanvas.width;
    downloadCanvas.height = mainCanvas.height;
    const ctx = downloadCanvas.getContext("2d");
    if (!ctx) return;

    if (bgType !== "transparent") {
      if (bgType === "color") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
      } else if (bgType === "gradient") {
        const grad = ctx.createLinearGradient(0, 0, downloadCanvas.width, downloadCanvas.height);
        if (bgGradient.includes("ff7e5f")) {
          grad.addColorStop(0, "#ff7e5f");
          grad.addColorStop(1, "#feb47b");
        } else if (bgGradient.includes("8a2be2")) {
          grad.addColorStop(0, "#8a2be2");
          grad.addColorStop(1, "#4a00e0");
        } else if (bgGradient.includes("1a365d")) {
          grad.addColorStop(0, "#1a365d");
          grad.addColorStop(1, "#2b6cb0");
        } else if (bgGradient.includes("00b4db")) {
          grad.addColorStop(0, "#00b4db");
          grad.addColorStop(1, "#0083b0");
        } else {
          grad.addColorStop(0, "#11998e");
          grad.addColorStop(1, "#38ef7d");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
      }
    }

    ctx.drawImage(mainCanvas, 0, 0);

    const link = document.createElement("a");
    link.download = `creaibox_nobg_${imageName || "image"}.png`;
    link.href = downloadCanvas.toDataURL("image/png");
    link.click();
  };

  // 9. Before / After 드래그 슬라이더 제어
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current || !previewCanvasRef.current) return;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleSliderMove(e.clientX);
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 p-6 md:p-10 font-sans">
      {/* 🌟 Top Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Sparkles className="text-purple-400" /> AI 이미지 배경 제거 스튜디오
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            원클릭으로 이미지의 배경을 완벽하게 제거하고 새로운 가상 배경을 자유롭게 합성해 보세요.
          </p>
        </div>
        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              setImageName("");
              setIsDone(false);
              setSelectedColor(null);
              setBrushMode("none");
              setHistoryStack([]);
            }}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 px-4 py-2 text-xs font-black transition"
          >
            <RefreshCw size={12} /> 이미지 초기화
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🌟 Left Side Control Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 backdrop-blur-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-1.5">
                <Sliders size={14} /> 편집 컨트롤러
              </h2>
              {/* 🆕 실행 취소 (Undo) 버튼 */}
              <button
                onClick={handleUndo}
                disabled={historyStack.length === 0}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black transition ${
                  historyStack.length === 0
                    ? "border-zinc-800/40 bg-zinc-900/10 text-zinc-500/40 cursor-not-allowed"
                    : "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-650 text-slate-200"
                }`}
                title="이전 단계로 되돌리기 (Ctrl+Z / Cmd+Z)"
              >
                <Undo size={11} /> 실행 취소
              </button>
            </div>

            {/* A. Mode Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400">배경 감지 모드</label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setMode("auto");
                    setIsDone(false);
                    setBrushMode("none");
                  }}
                  className={`py-2 text-xs font-black rounded-lg transition ${
                    mode === "auto" 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  AI 자동 분리
                </button>
                <button
                  onClick={() => {
                    setMode("chromakey");
                    setIsDone(true);
                    setBrushMode("none");
                  }}
                  className={`py-2 text-xs font-black rounded-lg transition ${
                    mode === "chromakey" 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  스마트 크로마키
                </button>
              </div>
            </div>

            {/* B. Mode Specific Options */}
            {mode === "auto" ? (
              <div className="space-y-4 rounded-xl bg-zinc-950/40 p-4 border border-zinc-850">
                <div className="flex items-start gap-2 text-xs text-slate-400 font-bold leading-relaxed">
                  <AlertCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <p>
                    AI 자동 분리는 이미지 외곽의 지배적 배경색 군집을 분석하여 원터치로 깔끔하게 배경을 분리합니다.
                  </p>
                </div>
                {!isDone && imageSrc && (
                  <button
                    onClick={triggerAutoRemoval}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/20 disabled:bg-purple-800 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> {processStep}
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> AI 배경 지우기 시작
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 rounded-xl bg-zinc-950/40 p-4 border border-zinc-850">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 flex items-center justify-between">
                    스포이트 색상 지정
                    {selectedColor && (
                      <span className="flex items-center gap-1 text-[10px] text-green-400">
                        <Check size={10} /> 색상 지정됨
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsEyedropperActive(true);
                        setBrushMode("none"); 
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black transition border flex items-center justify-center gap-1.5 ${
                        isEyedropperActive 
                          ? "bg-amber-600 border-amber-500 text-white animate-pulse" 
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-slate-300"
                      }`}
                    >
                      <Pipette size={13} /> 
                      {isEyedropperActive ? "프리뷰를 클릭하세요" : "스포이트 켜기"}
                    </button>
                    {selectedColor && (
                      <div 
                        className="w-9 h-9 rounded-lg border border-zinc-700" 
                        style={{ backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})` }}
                        title={`RGB: ${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}`}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">감지 임계값 (색 차이 범위)</span>
                    <span className="text-purple-400">{threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-zinc-900 rounded-lg h-1.5 appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">에지 페더 (부드러운 테두리)</span>
                    <span className="text-purple-400">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-zinc-900 rounded-lg h-1.5 appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* C. 🆕 Manual Brush Panel */}
            {isDone && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                  <Paintbrush size={13} className="text-purple-400" /> 수동 브러시 도구
                </label>

                <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1 rounded-xl">
                  {[
                    { mode: "none", label: "이동", icon: ArrowLeftRight },
                    { mode: "erase", label: "지우개", icon: Eraser },
                    { mode: "restore", label: "원본 복구", icon: Undo },
                    { mode: "color", label: "붓칠", icon: Paintbrush }
                  ].map((btn) => (
                    <button
                      key={btn.mode}
                      onClick={() => {
                        setBrushMode(btn.mode as any);
                        setIsEyedropperActive(false); 
                      }}
                      className={`flex flex-col items-center justify-center py-2 rounded-lg transition gap-1 ${
                        brushMode === btn.mode
                          ? "bg-purple-600 text-white font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <btn.icon size={13} />
                      <span className="text-[9px]">{btn.label}</span>
                    </button>
                  ))}
                </div>

                {brushMode !== "none" && (
                  <div className="space-y-4 rounded-xl bg-zinc-950/40 p-3.5 border border-zinc-850">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400">브러시 두께</span>
                        <span className="text-purple-400">{brushSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full accent-purple-500 bg-zinc-900 rounded-lg h-1.5 appearance-none cursor-pointer"
                      />
                    </div>

                    {brushMode === "color" && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">붓칠 색상</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ffffff", "#000000"].map((color) => (
                            <button
                              key={color}
                              onClick={() => setBrushColor(color)}
                              className={`w-5 h-5 rounded-full border border-white/10 transition-transform ${brushColor === color ? "scale-125 ring-2 ring-purple-500" : "hover:scale-110"}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-5 h-5 rounded-full overflow-hidden bg-transparent border-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* D. Virtual Background Compositor */}
            {isDone && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <label className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                  <Palette size={13} className="text-purple-400" /> 가상 배경 합성
                </label>
                
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl">
                  <button
                    onClick={() => setBgType("transparent")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      bgType === "transparent" ? "bg-zinc-800 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    투명
                  </button>
                  <button
                    onClick={() => setBgType("color")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      bgType === "color" ? "bg-zinc-800 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    단색
                  </button>
                  <button
                    onClick={() => setBgType("gradient")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      bgType === "gradient" ? "bg-zinc-800 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    그라데이션
                  </button>
                </div>

                {bgType === "color" && (
                  <div className="space-y-2 rounded-lg bg-zinc-950/30 p-3 border border-zinc-850">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">배경 색상 선택</label>
                    <div className="flex flex-wrap gap-2">
                      {["#ffffff", "#000000", "#f3f4f6", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setBgColor(color)}
                          className={`w-6 h-6 rounded-full border border-white/10 transition-transform ${bgColor === color ? "scale-125 ring-2 ring-purple-500" : "hover:scale-110"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-6 h-6 rounded-full overflow-hidden bg-transparent border-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {bgType === "gradient" && (
                  <div className="space-y-2 rounded-lg bg-zinc-950/30 p-3 border border-zinc-850">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">템플릿 그라데이션</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: "Sunset", val: "linear-gradient(to right, #ff7e5f, #feb47b)" },
                        { name: "Cool Tech", val: "linear-gradient(to right, #8a2be2, #4a00e0)" },
                        { name: "Ocean", val: "linear-gradient(to right, #1a365d, #2b6cb0)" },
                        { name: "Aqua", val: "linear-gradient(to right, #00b4db, #0083b0)" },
                        { name: "Forest", val: "linear-gradient(to right, #11998e, #38ef7d)" }
                      ].map((grad) => (
                        <button
                          key={grad.name}
                          onClick={() => setBgGradient(grad.val)}
                          className={`h-7 rounded-md border border-white/10 transition-transform ${bgGradient === grad.val ? "scale-110 ring-2 ring-purple-500" : "hover:scale-105"}`}
                          style={{ backgroundImage: grad.val }}
                          title={grad.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* E. Output Downloads */}
            {isDone && (
              <button
                onClick={handleDownload}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/30"
              >
                <Download size={14} /> 고해상도 이미지 다운로드
              </button>
            )}
          </div>
        </div>

        {/* 🌟 Right Side Workspace Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {!imageSrc ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex-1 min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 backdrop-blur-md p-10 text-center hover:border-purple-500/50 hover:bg-zinc-900/20 transition duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 text-slate-400 mb-6">
                <Upload size={28} />
              </div>
              <h3 className="text-lg font-black text-white">이미지 파일을 여기에 드롭하세요</h3>
              <p className="text-slate-500 text-xs mt-2 max-w-sm font-bold leading-relaxed">
                PNG, JPG, WEBP 파일을 끌어놓거나 컴퓨터에서 찾아 업로드할 수 있습니다. 100% 브라우저 기반 보안 처리됩니다.
              </p>
              <label className="mt-8 rounded-xl bg-purple-600 hover:bg-purple-500 hover:scale-105 cursor-pointer px-6 py-3 text-xs font-black text-white transition shadow-lg shadow-purple-900/20">
                파일 직접 업로드
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex-grow rounded-3xl border border-zinc-850 bg-zinc-950 overflow-hidden flex flex-col">
              
              {/* Toolbar */}
              <div className="h-14 border-b border-zinc-850 px-6 flex items-center justify-between bg-zinc-900/20 text-xs font-black">
                <span className="text-slate-400 truncate max-w-xs">{imageName}</span>
                
                {isDone && (
                  <div className="flex bg-zinc-900 p-0.5 rounded-lg">
                    <button
                      onClick={() => setPreviewMode("after")}
                      className={`px-3 py-1.5 rounded-md transition ${
                        previewMode === "after" ? "bg-zinc-850 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      결과물
                    </button>
                    <button
                      onClick={() => setPreviewMode("before-after")}
                      className={`px-3 py-1.5 rounded-md transition ${
                        previewMode === "before-after" ? "bg-zinc-850 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      전/후 슬라이더
                    </button>
                  </div>
                )}
              </div>

              {/* Real working invisible offscreen canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Rendering canvas layout */}
              <div 
                ref={containerRef}
                className="flex-1 min-h-[450px] flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden select-none"
              >
                {/* Checkerboard background */}
                <div 
                  className="absolute inset-0 z-0 opacity-40"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #1f2026 25%, transparent 25%), 
                      linear-gradient(-45deg, #1f2026 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #1f2026 75%), 
                      linear-gradient(-45deg, transparent 75%, #1f2026 75%)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0"
                  }}
                />

                {/* 1) Standard Preview mode */}
                {previewMode === "after" ? (
                  <div className="relative">
                    <canvas
                      ref={previewCanvasRef}
                      onClick={handleCanvasClick}
                      onMouseDown={handleBrushMouseDown}
                      onMouseMove={handleBrushMouseMove}
                      onMouseUp={handleBrushMouseUpOrLeave}
                      onMouseLeave={handleBrushMouseUpOrLeave}
                      className={`z-10 rounded-2xl max-w-full max-h-[450px] object-contain shadow-2xl transition border border-white/5 ${
                        isEyedropperActive ? "cursor-cell border-amber-500 ring-4 ring-amber-500/20" : ""
                      } ${brushMode !== "none" ? "cursor-none" : ""}`}
                    />
                    
                    {/* 브러시 크기 모양 오버레이 서클 링 */}
                    {brushMode !== "none" && brushCoords && (
                      <div 
                        className="absolute pointer-events-none rounded-full border border-white bg-black/10 z-30 shadow-md transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: brushCoords.x,
                          top: brushCoords.y,
                          width: `${brushSize}px`,
                          height: `${brushSize}px`,
                          borderColor: brushMode === "color" ? brushColor : "rgba(255, 255, 255, 0.8)",
                          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.3)"
                        }}
                      />
                    )}
                  </div>
                ) : (
                  /* 2) Before / After slider compare mode */
                  <div className="relative z-10 w-full h-full max-h-[450px] flex items-center justify-center overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-[450px] object-contain"
                    />
                    
                    {/* Before Image overlay */}
                    <div 
                      className="absolute inset-y-0 left-0 z-20 pointer-events-none overflow-hidden flex items-center"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      {originalImageRef.current && (
                        <img
                          src={imageSrc}
                          alt="before"
                          className="h-[450px] object-contain max-w-none"
                          style={{
                            width: containerRef.current?.querySelector("canvas")?.clientWidth || "600px"
                          }}
                        />
                      )}
                    </div>

                    {/* Compare slider drag bar handle */}
                    <div 
                      className="absolute inset-y-0 z-30 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                      style={{ left: `${sliderPosition}%` }}
                      onMouseDown={handleMouseDown}
                    >
                      <div className="w-7 h-7 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg border border-zinc-200">
                        <ArrowLeftRight size={12} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Loader Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-600/30 border-t-purple-500 animate-spin" />
                    <span className="text-xs font-black text-white">{processStep}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
