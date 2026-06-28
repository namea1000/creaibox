"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Sparkles, 
  Sliders, 
  Download, 
  RefreshCw, 
  ArrowLeftRight, 
  Maximize2, 
  Crop as CropIcon, 
  RotateCw, 
  FileArchive, 
  Palette, 
  HelpCircle, 
  Undo, 
  Grid,
  Settings,
  Scale,
  Sun,
  Eye,
  AlertCircle
} from "lucide-react";

// 편집 단계 히스토리 구조체
interface EditHistory {
  canvasData: ImageData;
  width: number;
  height: number;
}

// 🆕 Next.js SPA 클라이언트 라우팅 간 메모리 캐시 버퍼
let cachedResizerState: {
  imageSrc: string | null;
  imageName: string;
  canvasImageData: ImageData | null;
  history: EditHistory[];
  redoStack: EditHistory[];
  currentWidth: number;
  currentHeight: number;
  originalWidth: number;
  originalHeight: number;
  originalSizeKB: number;
} = {
  imageSrc: null,
  imageName: "",
  canvasImageData: null,
  history: [],
  redoStack: [],
  currentWidth: 0,
  currentHeight: 0,
  originalWidth: 0,
  originalHeight: 0,
  originalSizeKB: 0
};

export default function ImageResizerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"resize" | "crop" | "mirror" | "rotate" | "compress" | "convert" | "pixelate" | "grayscale">("resize");

  // 1. 크기 조절 (Resize) 상태
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [keepRatio, setKeepRatio] = useState<boolean>(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);

  // 2. 자르기 (Crop) 상태
  const [cropAspect, setCropAspect] = useState<"free" | "1:1" | "4:3" | "16:9">("free");
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 10, y: 10, w: 80, h: 80 }); // 백분율 단위 (0~100)
  const [isResizingCrop, setIsResizingCrop] = useState<string | null>(null); // "nw", "ne", "sw", "se", "move" 등 크롭 박스 드래그 핸들러

  // 3. 압축 (Compress) 상태
  const [compressType, setCompressType] = useState<"auto" | "target">("auto");
  const [targetSizeKB, setTargetSizeKB] = useState<number>(500);

  // 4. 변환 (Convert) 상태
  const [targetFormat, setTargetFormat] = useState<"png" | "jpeg" | "webp">("png");

  // 5. 픽셀화 (Pixelate) 상태
  const [pixelSize, setPixelSize] = useState<number>(8);

  // 6. 흑백 (Grayscale) 상태
  const [grayscaleMode, setGrayscaleMode] = useState<"gray" | "binary">("gray");
  const [binaryThreshold, setBinaryThreshold] = useState<number>(128);

  // 7. 히스토리 되돌리기 스택
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [redoStack, setRedoStack] = useState<EditHistory[]>([]);

  // 8. 현재 이미지 가용 스펙
  const [currentSize, setCurrentSize] = useState<{ w: number; h: number; kb: number }>({ w: 0, h: 0, kb: 0 });
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number; kb: number }>({ w: 0, h: 0, kb: 0 });

  // 9. 참조 노드
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartRef = useRef<{ mx: number; my: number; bx: number; by: number; bw: number; bh: number } | null>(null);

  // 🆕 글로벌 인메모리 캐시 상태 동기화 함수 (인자 지원형으로 개선)
  const syncCacheState = (
    customSrc?: string, 
    customName?: string, 
    customOrig?: { w: number; h: number; kb: number }
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cachedResizerState.imageSrc = customSrc || imageSrc;
    cachedResizerState.imageName = customName || imageName;
    cachedResizerState.canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    cachedResizerState.history = history;
    cachedResizerState.redoStack = redoStack;
    cachedResizerState.currentWidth = canvas.width;
    cachedResizerState.currentHeight = canvas.height;

    const oSize = customOrig || originalSize;
    cachedResizerState.originalWidth = oSize.w;
    cachedResizerState.originalHeight = oSize.h;
    cachedResizerState.originalSizeKB = oSize.kb;
  };

  // 🆕 페이지 진입 시 전역 캐시 복원
  useEffect(() => {
    if (cachedResizerState.imageSrc && cachedResizerState.canvasImageData) {
      setImageSrc(cachedResizerState.imageSrc);
      setImageName(cachedResizerState.imageName);
      setHistory(cachedResizerState.history);
      setRedoStack(cachedResizerState.redoStack);
      setResizeWidth(cachedResizerState.currentWidth);
      setResizeHeight(cachedResizerState.currentHeight);
      setOriginalRatio(cachedResizerState.originalWidth / cachedResizerState.originalHeight);
      setOriginalSize({
        w: cachedResizerState.originalWidth,
        h: cachedResizerState.originalHeight,
        kb: cachedResizerState.originalSizeKB
      });
      setCurrentSize({
        w: cachedResizerState.currentWidth,
        h: cachedResizerState.currentHeight,
        kb: cachedResizerState.originalSizeKB
      });
    }
  }, []);

  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) loadImage(file);
  };

  const loadImage = (file: File) => {
    setImageName(file.name);
    setHistory([]);
    setRedoStack([]);
    const sizeKB = Math.round(file.size / 1024);
    
    // 글로벌 캐시 리셋
    cachedResizerState = {
      imageSrc: null,
      imageName: "",
      canvasImageData: null,
      history: [],
      redoStack: [],
      currentWidth: 0,
      currentHeight: 0,
      originalWidth: 0,
      originalHeight: 0,
      originalSizeKB: 0
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setCurrentSize((prev) => ({ ...prev, kb: sizeKB }));
        setOriginalSize((prev) => ({ ...prev, kb: sizeKB }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 이미지 로드 완료 시 캔버스 바인딩
  useEffect(() => {
    if (!imageSrc) return;

    // 만약 이미 메모리에 캐시된 상태라면 해당 픽셀로 다이렉트 복구
    if (cachedResizerState.imageSrc === imageSrc && cachedResizerState.canvasImageData) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = cachedResizerState.currentWidth;
        canvas.height = cachedResizerState.currentHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(cachedResizerState.canvasImageData, 0, 0);
          updatePreviewCanvas();
        }
      }
      // 백그라운드 원본 이미지 객체 연동
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        originalImageRef.current = img;
      };
      return;
    }

    // 신규 이미지 로드인 경우
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImageRef.current = img;
      const ratio = img.naturalWidth / img.naturalHeight;
      setOriginalRatio(ratio);
      setResizeWidth(img.naturalWidth);
      setResizeHeight(img.naturalHeight);
      
      setOriginalSize((prev) => ({ ...prev, w: img.naturalWidth, h: img.naturalHeight }));
      setCurrentSize((prev) => ({ ...prev, w: img.naturalWidth, h: img.naturalHeight }));

      initCanvas(img);
    };
  }, [imageSrc]);

  const initCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    updatePreviewCanvas();

    // 🆕 신규 로드 완료 시 캐시 강제 덮어쓰기 동기화 (비동기 상태 반영 우회용)
    syncCacheState(imageSrc || undefined, imageName || undefined, {
      w: img.naturalWidth,
      h: img.naturalHeight,
      kb: currentSize.kb
    });
  };

  // 10. 편집 히스토리 상태 세이브
  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const state: EditHistory = {
      canvasData: imgData,
      width: canvas.width,
      height: canvas.height
    };

    setHistory((prev) => [...prev, state]);
    setRedoStack([]); // 새 가공 시 Redo 초기화
  };

  // 실행 취소 (Undo)
  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const currentState: EditHistory = {
      canvasData: currentImgData,
      width: canvas.width,
      height: canvas.height
    };

    setRedoStack((prev) => [...prev, currentState]);

    setHistory((prev) => {
      const next = [...prev];
      const prevState = next.pop();
      if (prevState) {
        canvas.width = prevState.width;
        canvas.height = prevState.height;
        ctx.putImageData(prevState.canvasData, 0, 0);
        
        setResizeWidth(prevState.width);
        setResizeHeight(prevState.height);
        setCurrentSize((prevSz) => ({ ...prevSz, w: prevState.width, h: prevState.height }));
        
        updatePreviewCanvas();
        setTimeout(() => syncCacheState(), 50);
      }
      return next;
    });
  };

  // 다시 실행 (Redo)
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const currentState: EditHistory = {
      canvasData: currentImgData,
      width: canvas.width,
      height: canvas.height
    };

    setHistory((prev) => [...prev, currentState]);

    setRedoStack((prev) => {
      const next = [...prev];
      const nextState = next.pop();
      if (nextState) {
        canvas.width = nextState.width;
        canvas.height = nextState.height;
        ctx.putImageData(nextState.canvasData, 0, 0);
        
        setResizeWidth(nextState.width);
        setResizeHeight(nextState.height);
        setCurrentSize((prevSz) => ({ ...prevSz, w: nextState.width, h: nextState.height }));

        updatePreviewCanvas();
        setTimeout(() => syncCacheState(), 50);
      }
      return next;
    });
  };

  // 단축키 Ctrl+Z, Ctrl+Y 연동
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
        } else if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, redoStack]);

  // 11. 가상 프리뷰 드로잉
  const updatePreviewCanvas = () => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !previewCanvas) return;

    const ctxPreview = previewCanvas.getContext("2d");
    if (!ctxPreview) return;

    const containerW = containerRef.current?.clientWidth || 700;
    const containerH = 450;
    const imgRatio = canvas.width / canvas.height;

    let w = containerW;
    let h = containerW / imgRatio;
    if (h > containerH) {
      h = containerH;
      w = containerH * imgRatio;
    }

    previewCanvas.width = w;
    previewCanvas.height = h;

    ctxPreview.clearRect(0, 0, w, h);
    ctxPreview.drawImage(canvas, 0, 0, w, h);
  };

  // 12. 편집 실행 로직들

  // A. 크기 조절 적용
  const applyResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    saveHistoryState();

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = resizeWidth;
    tempCanvas.height = resizeHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0, resizeWidth, resizeHeight);

    canvas.width = resizeWidth;
    canvas.height = resizeHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    setCurrentSize((prev) => ({ ...prev, w: resizeWidth, h: resizeHeight }));
    updatePreviewCanvas();
    syncCacheState();
  };

  // B. 자르기 적용
  const applyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryState();

    const realX = Math.round((cropBox.x / 100) * canvas.width);
    const realY = Math.round((cropBox.y / 100) * canvas.height);
    const realW = Math.round((cropBox.w / 100) * canvas.width);
    const realH = Math.round((cropBox.h / 100) * canvas.height);

    if (realW <= 0 || realH <= 0) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = realW;
    tempCanvas.height = realH;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, realX, realY, realW, realH, 0, 0, realW, realH);

    canvas.width = realW;
    canvas.height = realH;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    setResizeWidth(realW);
    setResizeHeight(realH);
    setCurrentSize((prev) => ({ ...prev, w: realW, h: realH }));
    
    // 크롭 박스 비율 리셋
    setCropBox({ x: 10, y: 10, w: 80, h: 80 });
    updatePreviewCanvas();
    syncCacheState();
  };

  // C. 반전 적용
  const applyMirror = (direction: "horizontal" | "vertical") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryState();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (direction === "horizontal") {
      ctx.scale(-1, 1);
      ctx.drawImage(tempCanvas, -canvas.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.drawImage(tempCanvas, 0, -canvas.height);
    }
    ctx.restore();

    updatePreviewCanvas();
    syncCacheState();
  };

  // D. 회전 적용
  const applyRotate = (angle: 90 | -90) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryState();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0);

    const oldW = canvas.width;
    const oldH = canvas.height;

    // 캔버스 가로세로 치환
    canvas.width = oldH;
    canvas.height = oldW;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -oldW / 2, -oldH / 2);
    ctx.restore();

    setResizeWidth(canvas.width);
    setResizeHeight(canvas.height);
    setCurrentSize((prev) => ({ ...prev, w: canvas.width, h: canvas.height }));
    updatePreviewCanvas();
    syncCacheState();
  };

  // E. 픽셀화 필터 적용
  const applyPixelate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryState();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    const size = pixelSize;

    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;

        for (let dy = 0; dy < size && y + dy < h; dy++) {
          for (let dx = 0; dx < size && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
            count++;
          }
        }

        const rAvg = Math.floor(rSum / count);
        const gAvg = Math.floor(gSum / count);
        const bAvg = Math.floor(bSum / count);

        for (let dy = 0; dy < size && y + dy < h; dy++) {
          for (let dx = 0; dx < size && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            data[idx] = rAvg;
            data[idx + 1] = gAvg;
            data[idx + 2] = bAvg;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    updatePreviewCanvas();
    syncCacheState();
  };

  // F. 흑백 필터 적용
  const applyGrayscale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveHistoryState();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const val = 0.299 * r + 0.587 * g + 0.114 * b;

      if (grayscaleMode === "gray") {
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      } else {
        const binary = val >= binaryThreshold ? 255 : 0;
        data[i] = binary;
        data[i + 1] = binary;
        data[i + 2] = binary;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    updatePreviewCanvas();
    syncCacheState();
  };

  // 13. 자르기(Crop) 상자 드래그 핸들러
  const handleCropMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizingCrop(handle);
    dragStartRef.current = {
      mx: e.clientX,
      my: e.clientY,
      bx: cropBox.x,
      by: cropBox.y,
      bw: cropBox.w,
      bh: cropBox.h
    };
  };

  const handleCropMouseUp = () => {
    setIsResizingCrop(null);
    dragStartRef.current = null;
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isResizingCrop || !dragStartRef.current || !previewCanvasRef.current) return;
    
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStartRef.current.mx) / rect.width) * 100;
    const dy = ((e.clientY - dragStartRef.current.my) / rect.height) * 100;

    let newX = dragStartRef.current.bx;
    let newY = dragStartRef.current.by;
    let newW = dragStartRef.current.bw;
    let newH = dragStartRef.current.bh;

    if (isResizingCrop === "move") {
      newX = Math.max(0, Math.min(100 - newW, dragStartRef.current.bx + dx));
      newY = Math.max(0, Math.min(100 - newH, dragStartRef.current.by + dy));
    } else {
      if (isResizingCrop.includes("n")) {
        const potentialH = dragStartRef.current.bh - dy;
        if (potentialH > 5) {
          newY = Math.max(0, dragStartRef.current.by + dy);
          newH = potentialH;
        }
      }
      if (isResizingCrop.includes("s")) {
        const potentialH = dragStartRef.current.bh + dy;
        newH = Math.max(5, Math.min(100 - newY, potentialH));
      }
      if (isResizingCrop.includes("w")) {
        const potentialW = dragStartRef.current.bw - dx;
        if (potentialW > 5) {
          newX = Math.max(0, dragStartRef.current.bx + dx);
          newW = potentialW;
        }
      }
      if (isResizingCrop.includes("e")) {
        const potentialW = dragStartRef.current.bw + dx;
        newW = Math.max(5, Math.min(100 - newX, potentialW));
      }

      if (cropAspect !== "free") {
        const aspectVal = cropAspect === "1:1" ? 1 : cropAspect === "4:3" ? 4 / 3 : 16 / 9;
        const canvas = canvasRef.current;
        if (canvas) {
          const physAspect = canvas.width / canvas.height;
          newH = (newW * physAspect) / aspectVal;
          if (newY + newH > 100) {
            newH = 100 - newY;
            newW = (newH * aspectVal) / physAspect;
          }
        }
      }
    }

    setCropBox({
      x: Math.round(newX),
      y: Math.round(newY),
      w: Math.round(newW),
      h: Math.round(newH)
    });
  };

  useEffect(() => {
    if (isResizingCrop) {
      const globalUp = () => setIsResizingCrop(null);
      window.addEventListener("mouseup", globalUp);
      return () => window.removeEventListener("mouseup", globalUp);
    }
  }, [isResizingCrop]);

  // 14. 고해상도 변환/압축 이미지 다운로드
  const triggerDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mime = "image/png";
    if (targetFormat === "jpeg") mime = "image/jpeg";
    if (targetFormat === "webp") mime = "image/webp";

    let quality = 0.92;
    if (activeTab === "compress" && compressType === "target") {
      let tempUrl = canvas.toDataURL(mime, quality);
      let sizeBytes = Math.round((tempUrl.length * 3) / 4);
      let targetBytes = targetSizeKB * 1024;
      
      if (sizeBytes > targetBytes) {
        let low = 0.05;
        let high = 0.95;
        for (let iter = 0; iter < 10; iter++) {
          const mid = (low + high) / 2;
          tempUrl = canvas.toDataURL(mime, mid);
          sizeBytes = Math.round((tempUrl.length * 3) / 4);
          if (sizeBytes > targetBytes) {
            high = mid;
          } else {
            low = mid;
            quality = mid;
          }
        }
      }
    }

    const downloadUrl = canvas.toDataURL(mime, quality);
    const link = document.createElement("a");
    const extension = targetFormat;
    link.download = `creaibox_resized_${imageName.split(".")[0] || "image"}.${extension}`;
    link.href = downloadUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 p-6 md:p-10 font-sans">
      
      {/* 🌟 Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Scale className="text-purple-400" /> 이미지 크기 조절기
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            크기 조절, 자르기, 회전, 좌우 반전 및 포맷 변환과 압축 필터링까지 한 번에 처리합니다.
          </p>
        </div>
        {imageSrc && (
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1 gap-1">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                title="실행 취소 (Ctrl + Z)"
              >
                <Undo size={14} />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                title="다시 실행 (Ctrl + Y)"
              >
                <Undo size={14} className="transform scale-x-[-1]" />
              </button>
            </div>

            <button
              onClick={() => {
                setImageSrc(null);
                setImageName("");
                setHistory([]);
                setRedoStack([]);
                // 글로벌 메모리 리셋
                cachedResizerState = {
                  imageSrc: null,
                  imageName: "",
                  canvasImageData: null,
                  history: [],
                  redoStack: [],
                  currentWidth: 0,
                  currentHeight: 0,
                  originalWidth: 0,
                  originalHeight: 0,
                  originalSizeKB: 0
                };
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 px-4 py-2 text-xs font-black transition"
            >
              <RefreshCw size={12} /> 이미지 초기화
            </button>
          </div>
        )}
      </div>

      {/* 🌟 🆕 Top Navigation Tab Bar (이미지 업로드 전에도 항상 보이도록 유지, 밝기 상향) */}
      <div className={`max-w-7xl mx-auto mb-8 bg-zinc-900/40 border border-zinc-850 backdrop-blur-md rounded-2xl p-2.5 transition-opacity duration-300 ${!imageSrc ? "opacity-75 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { id: "resize", label: "크기 조절", icon: Maximize2 },
            { id: "crop", label: "영역 자르기", icon: CropIcon },
            { id: "mirror", label: "좌우 반전", icon: ArrowLeftRight },
            { id: "rotate", label: "각도 회전", icon: RotateCw },
            { id: "compress", label: "용량 압축", icon: FileArchive },
            { id: "convert", label: "포맷 변환", icon: RefreshCw },
            { id: "pixelate", label: "도트 픽셀화", icon: Grid },
            { id: "grayscale", label: "흑백 필터", icon: Sun }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (imageSrc) setActiveTab(tab.id as any);
              }}
              className={`py-3 px-2 flex flex-col items-center justify-center gap-1.5 rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🌟 Bottom Left Option Panel (이미지 업로드 전에도 뼈대 항시 유지, 밝기 상향) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`rounded-2xl border border-zinc-850 bg-zinc-900/40 backdrop-blur-md p-6 space-y-6 transition-opacity duration-300 ${!imageSrc ? "opacity-75 pointer-events-none" : ""}`}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-1.5">
              <Sliders size={14} /> 편집 상세 설정
            </h2>

            {/* A. Resize Tab */}
            {activeTab === "resize" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-300 uppercase">폭 (Width)</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeWidth(val);
                        if (keepRatio) {
                          setResizeHeight(Math.round(val / originalRatio));
                        }
                      }}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-300 uppercase">높이 (Height)</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeHeight(val);
                        if (keepRatio) {
                          setResizeWidth(Math.round(val * originalRatio));
                        }
                      }}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                  <input
                    type="checkbox"
                    checked={keepRatio}
                    onChange={(e) => setKeepRatio(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs text-slate-200 font-bold">고정 가로 세로 비율 유지</span>
                </label>

                <button
                  onClick={applyResize}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/20"
                >
                  크기 조절 적용
                </button>
              </div>
            )}

            {/* B. Crop Tab */}
            {activeTab === "crop" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-200 uppercase">크롭 비율 고정</label>
                  <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1 rounded-xl">
                    {[
                      { id: "free", label: "자유" },
                      { id: "1:1", label: "1:1" },
                      { id: "4:3", label: "4:3" },
                      { id: "16:9", label: "16:9" }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setCropAspect(preset.id as any);
                          if (preset.id !== "free") {
                            const aspectVal = preset.id === "1:1" ? 1 : preset.id === "4:3" ? 4 / 3 : 16 / 9;
                            const canvas = canvasRef.current;
                            if (canvas) {
                              const physAspect = canvas.width / canvas.height;
                              const tempW = 60;
                              const tempH = (tempW * physAspect) / aspectVal;
                              setCropBox({ x: 20, y: 20, w: tempW, h: Math.round(tempH) });
                            }
                          }
                        }}
                        className={`py-1.5 text-[10px] font-bold rounded-lg transition ${
                          cropAspect === preset.id
                            ? "bg-zinc-800 text-white"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-200 font-bold leading-relaxed rounded-xl bg-zinc-950/40 p-3 border border-zinc-850">
                  <AlertCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <p>오른쪽 화면에 나타난 격자 가이드 상자를 직접 마우스 드래그로 조절한 후 적용 버튼을 클릭하세요.</p>
                </div>

                <button
                  onClick={applyCrop}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/20"
                >
                  영역 자르기 적용
                </button>
              </div>
            )}

            {/* C. Mirror Tab */}
            {activeTab === "mirror" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => applyMirror("horizontal")}
                    className="py-3 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs font-black text-white transition"
                  >
                    가로 좌우반전
                  </button>
                  <button
                    onClick={() => applyMirror("vertical")}
                    className="py-3 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs font-black text-white transition"
                  >
                    세로 상하반전
                  </button>
                </div>
              </div>
            )}

            {/* D. Rotate Tab */}
            {activeTab === "rotate" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => applyRotate(-90)}
                    className="py-3 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs font-black text-white transition"
                  >
                    왼쪽 90도 회전
                  </button>
                  <button
                    onClick={() => applyRotate(90)}
                    className="py-3 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs font-black text-white transition"
                  >
                    오른쪽 90도 회전
                  </button>
                </div>
              </div>
            )}

            {/* E. Compress Tab */}
            {activeTab === "compress" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl">
                  <button
                    onClick={() => setCompressType("auto")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      compressType === "auto" ? "bg-zinc-800 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    자동 품질 유지
                  </button>
                  <button
                    onClick={() => setCompressType("target")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      compressType === "target" ? "bg-zinc-800 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    목표 크기 지정
                  </button>
                </div>

                {compressType === "target" && (
                  <div className="space-y-1.5 rounded-xl bg-zinc-950/40 p-4 border border-zinc-850">
                    <label className="text-[10px] font-black text-slate-200 uppercase">목표 용량 크기 (KB)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={targetSizeKB}
                        onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                        className="flex-1 bg-zinc-950 border border-zinc-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none font-bold"
                      />
                      <span className="flex items-center px-3 text-xs bg-zinc-900 border border-zinc-850 rounded-lg text-slate-200 font-bold">
                        KB
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2 text-xs text-slate-200 font-bold leading-relaxed rounded-xl bg-zinc-950/40 p-3 border border-zinc-850">
                  <AlertCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <p>용량 압축은 최하단 다운로드 저장 시점에 가동됩니다.</p>
                </div>
              </div>
            )}

            {/* F. Convert Tab */}
            {activeTab === "convert" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-200 uppercase">출력 포맷 형식</label>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl">
                    {["png", "jpeg", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setTargetFormat(fmt as any)}
                        className={`py-2 text-xs font-black uppercase rounded-lg transition ${
                          targetFormat === fmt ? "bg-zinc-800 text-white animate-pulse" : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* G. Pixelate Tab */}
            {activeTab === "pixelate" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">블록 크기 (Dot Size)</span>
                    <span className="text-purple-400">{pixelSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={pixelSize}
                    onChange={(e) => setPixelSize(Number(e.target.value))}
                    className="w-full accent-purple-500 bg-zinc-900 rounded-lg h-1.5 appearance-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={applyPixelate}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/20"
                >
                  픽셀화 필터 적용
                </button>
              </div>
            )}

            {/* H. Grayscale Tab */}
            {activeTab === "grayscale" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl">
                  <button
                    onClick={() => setGrayscaleMode("gray")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      grayscaleMode === "gray" ? "bg-zinc-800 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    회색 색조
                  </button>
                  <button
                    onClick={() => setGrayscaleMode("binary")}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      grayscaleMode === "binary" ? "bg-zinc-800 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    흑백만 (이진화)
                  </button>
                </div>

                {grayscaleMode === "binary" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">대비 임계값 (Threshold)</span>
                      <span className="text-purple-400">{binaryThreshold}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="240"
                      value={binaryThreshold}
                      onChange={(e) => setBinaryThreshold(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-zinc-900 rounded-lg h-1.5 appearance-none cursor-pointer"
                    />
                  </div>
                )}

                <button
                  onClick={applyGrayscale}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/20"
                >
                  흑백 필터 적용
                </button>
              </div>
            )}

            <button
              onClick={triggerDownload}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-black text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/30"
            >
              <Download size={14} /> 편집 완료 이미지 다운로드
            </button>
          </div>
        </div>

        {/* 🌟 Bottom Right Workspace Area (이미지 없을 때만 드롭존 레이아웃 노출) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {!imageSrc ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex-grow min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 backdrop-blur-md p-10 text-center hover:border-purple-500/50 hover:bg-zinc-900/20 transition duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 text-slate-400 mb-6">
                <Upload size={28} />
              </div>
              <h3 className="text-lg font-black text-white">편집할 이미지를 업로드하세요</h3>
              <p className="text-slate-500 text-xs mt-2 max-w-sm font-bold leading-relaxed">
                가로세로 사이즈 조정, 회전/반전 및 자르기 기능이 무제한 무료로 즉시 가동됩니다.
              </p>
              <label className="mt-8 rounded-xl bg-purple-600 hover:bg-purple-500 hover:scale-105 cursor-pointer px-6 py-3 text-xs font-black text-white transition shadow-lg shadow-purple-900/20">
                파일 직접 선택
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
              
              {/* Image Info Panel */}
              <div className="h-14 border-b border-zinc-850 px-6 flex items-center justify-between bg-zinc-900/20 text-xs font-black">
                <span className="text-slate-400 truncate max-w-xs">{imageName}</span>
                <div className="flex items-center gap-4 text-slate-400 font-bold">
                  <span>현재: {currentSize.w} &times; {currentSize.h} px</span>
                  <span className="text-zinc-700">|</span>
                  <span>원본: {originalSize.w} &times; {originalSize.h} px ({originalSize.kb} KB)</span>
                </div>
              </div>

              {/* Working Invisible Canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Rendering preview display with checkerboard */}
              <div 
                ref={containerRef}
                className="flex-1 min-h-[450px] flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden select-none"
              >
                {/* Checkerboard Grid */}
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

                <div 
                  className="relative"
                  onMouseMove={activeTab === "crop" ? handleCropMouseMove : undefined}
                  onMouseUp={activeTab === "crop" ? handleCropMouseUp : undefined}
                >
                  <canvas
                    ref={previewCanvasRef}
                    className="z-10 rounded-2xl max-w-full max-h-[450px] object-contain shadow-2xl transition border border-white/5"
                  />

                  {/* Crop Box Overlay Grid */}
                  {activeTab === "crop" && previewCanvasRef.current && (
                    <div 
                      className="absolute border-2 border-dashed border-white bg-purple-950/20 z-20 cursor-move"
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.w}%`,
                        height: `${cropBox.h}%`
                      }}
                      onMouseDown={(e) => handleCropMouseDown(e, "move")}
                    >
                      {/* 3x3 Grid Guides */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                        <div className="border-r border-b border-white/30" />
                        <div className="border-r border-b border-white/30" />
                        <div className="border-b border-white/30" />
                        <div className="border-r border-b border-white/30" />
                        <div className="border-r border-b border-white/30" />
                        <div className="border-b border-white/30" />
                        <div className="border-r border-white/30" />
                        <div className="border-r border-white/30" />
                        <div className="pointer-events-none" />
                      </div>

                      {/* Resize Handles (Corner controls) */}
                      {["nw", "ne", "sw", "se"].map((handle) => (
                        <div
                          key={handle}
                          className={`absolute w-3.5 h-3.5 bg-white border border-purple-600 rounded-full z-30 transform -translate-x-1/2 -translate-y-1/2 ${
                            handle.includes("n") ? "top-0" : "bottom-0"
                          } ${handle.includes("w") ? "left-0" : "right-0"} ${
                            handle === "nw" || handle === "se" ? "cursor-nwse-resize" : "cursor-nesw-resize"
                          }`}
                          onMouseDown={(e) => handleCropMouseDown(e, handle)}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
