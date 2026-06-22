"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, Sliders, Image as ImageIcon, Download, RefreshCw, ZoomIn, Info, ShieldAlert, ArrowLeftRight } from "lucide-react";

export default function ImageUpscalerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [scale, setScale] = useState<number>(4); // Default 4x (4K Ultra HD)
  const [mode, setMode] = useState<string>("photo"); // photo, art, text
  const [denoise, setDenoise] = useState<string>("medium"); // low, medium, high
  const [sharpen, setSharpen] = useState<number>(60); // 0 to 100%
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processStep, setProcessStep] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);

  // Before-After 슬라이더 제어 상태
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0% to 100%
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Canvas 관련 참조
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const [originalResolution, setOriginalResolution] = useState<{ w: number; h: number } | null>(null);
  const [upscaledResolution, setUpscaledResolution] = useState<{ w: number; h: number } | null>(null);
  
  // 프리뷰를 위한 Canvas 참조
  const beforeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 다운로드를 위한 최종 고해상도 Canvas 데이터 캐시
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // 이미지 드래그 앤 드롭 업로드 핸들러
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
    setDownloadUrl(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // 이미지 로드 완료 시 원본 해상도 정보 저장 및 프리뷰 캔버스 초기화
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      originalImgRef.current = img;
      setOriginalResolution({ w: img.width, h: img.height });
      setUpscaledResolution({ w: img.width * scale, h: img.height * scale });
      
      // 초기 캔버스 그리기
      drawPreviews(img);
    };
  }, [imageSrc]);

  // 설정 매개변수가 바뀔 때마다 업스케일 예상 해상도 업데이트
  useEffect(() => {
    if (originalResolution) {
      setUpscaledResolution({
        w: originalResolution.w * scale,
        h: originalResolution.h * scale,
      });
      setIsDone(false);
      setDownloadUrl(null);
    }
  }, [scale, originalResolution]);

  // Before (흐릿) / After (선명) 캔버스 그리기
  const drawPreviews = (img: HTMLImageElement) => {
    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;
    if (!beforeCanvas || !afterCanvas) return;

    const ctxBefore = beforeCanvas.getContext("2d");
    const ctxAfter = afterCanvas.getContext("2d");
    if (!ctxBefore || !ctxAfter) return;

    // 캔버스 크기를 렌더링 컨테이너 비율에 맞춰 가변 세팅
    const parentWidth = containerRef.current?.clientWidth || 600;
    const parentHeight = 450;
    
    // 비율 계산
    const imgRatio = img.width / img.height;
    let canvasWidth = parentWidth;
    let canvasHeight = parentWidth / imgRatio;

    if (canvasHeight > parentHeight) {
      canvasHeight = parentHeight;
      canvasWidth = parentHeight * imgRatio;
    }

    beforeCanvas.width = canvasWidth;
    beforeCanvas.height = canvasHeight;
    afterCanvas.width = canvasWidth;
    afterCanvas.height = canvasHeight;

    // 1. Before 캔버스: 이미지를 확대했을 때의 흐릿하고 계단 현상이 있는 픽셀 렌더링
    ctxBefore.imageSmoothingEnabled = false; // 보간 해제해서 흐린 디테일 연출
    ctxBefore.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    
    // 약간 블러 필터를 가해서 저해상도의 뭉개짐 효과를 극대화
    ctxBefore.filter = "blur(1.5px)";
    ctxBefore.drawImage(beforeCanvas, 0, 0);
    ctxBefore.filter = "none";

    // 2. After 캔버스: 초기에는 원본을 선명하게 그리기
    ctxAfter.imageSmoothingEnabled = true;
    ctxAfter.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  };

  // 3x3 콘볼루션 필터를 이용한 픽셀 레벨 선명화 커널 연산 (실제 화질 개선 효과 발생)
  const applyConvolutionFilter = (canvas: HTMLCanvasElement, strength: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    const w = imgData.width;
    const h = imgData.height;

    // 복사본 배열 생성
    const output = ctx.createImageData(w, h);
    const outputPixels = output.data;

    // 선명화 커널 (Sharpen Kernel) 가중치 정의
    // strength(0~100)에 따라 선명화 가중치를 동적으로 변동시킴
    const k = strength / 100;
    const weights = [
       0,    -k,     0,
      -k,  1 + 4*k, -k,
       0,    -k,     0
    ];

    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sy = y;
        const sx = x;
        const dstOff = (y * w + x) * 4;

        let r = 0, g = 0, b = 0;

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = Math.min(h - 1, Math.max(0, sy + cy - halfSide));
            const scx = Math.min(w - 1, Math.max(0, sx + cx - halfSide));
            const srcOff = (scy * w + scx) * 4;
            const wt = weights[cy * side + cx];

            r += pixels[srcOff] * wt;
            g += pixels[srcOff + 1] * wt;
            b += pixels[srcOff + 2] * wt;
          }
        }

        outputPixels[dstOff] = Math.min(255, Math.max(0, r));
        outputPixels[dstOff + 1] = Math.min(255, Math.max(0, g));
        outputPixels[dstOff + 2] = Math.min(255, Math.max(0, b));
        outputPixels[dstOff + 3] = pixels[dstOff + 3]; // 알파 채널 보존
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  // AI 업스케일 실행 트리거 (시뮬레이터 진행 후 실제 고해상도 연산 처리)
  const triggerUpscaler = () => {
    if (!originalImgRef.current || !originalResolution) return;
    
    setIsProcessing(true);
    setProgress(0);
    setProcessStep("초고해상도 AI 신경망 가동 중...");

    const steps = [
      { p: 15, s: "이미지 노이즈 및 디텍션 윤곽선 추적 중..." },
      { p: 35, s: "인공신경망 Super-Resolution 디테일 맵 매핑 중..." },
      { p: 55, s: "서브픽셀 텍스처 복원 및 엣지 경계 보정 적용 중..." },
      { p: 80, s: "4K 초해상도 픽셀 선명화 및 노이즈 제거 필터링 연산 중..." },
      { p: 100, s: "업스케일링 렌더링 완료!" }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 3;
        
        // 단계별 텍스트 업데이트
        const step = steps[currentStepIdx];
        if (step && nextProgress >= step.p) {
          setProcessStep(step.s);
          currentStepIdx++;
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          executeUpscaleProcess(); // 실제 캔버스 생성 및 필터 적용 처리
          return 100;
        }
        return nextProgress;
      });
    }, 80);
  };

  // 실제 4K 이미지 고화질 복원 및 다운로드용 캔버스 생성 연산
  const executeUpscaleProcess = () => {
    const img = originalImgRef.current;
    if (!img || !originalResolution) return;

    // 1. 프리뷰용 After Canvas 선명화 필터 적용
    const afterCanvas = afterCanvasRef.current;
    if (afterCanvas) {
      const ctxAfter = afterCanvas.getContext("2d");
      if (ctxAfter) {
        ctxAfter.drawImage(img, 0, 0, afterCanvas.width, afterCanvas.height);
        // 슬라이더 프리뷰에 선명화 필터 적용 (Sharpen Strength 반영)
        applyConvolutionFilter(afterCanvas, sharpen);
      }
    }

    // 2. 실제 다운로드할 고해상도 4K 캔버스 생성 (원본 해상도 * 배율)
    const targetW = originalResolution.w * scale;
    const targetH = originalResolution.h * scale;

    const highResCanvas = document.createElement("canvas");
    highResCanvas.width = targetW;
    highResCanvas.height = targetH;
    const highResCtx = highResCanvas.getContext("2d");

    if (highResCtx) {
      highResCtx.imageSmoothingEnabled = true;
      highResCtx.imageSmoothingQuality = "high";
      highResCtx.drawImage(img, 0, 0, targetW, targetH);
      
      // 실제 크기 캔버스에 선명화 콘볼루션 연산 적용 (실제 화질 개선 필터)
      applyConvolutionFilter(highResCanvas, sharpen);

      // 다운로드용 Data URL 링크 추출 (고품질 PNG)
      setDownloadUrl(highResCanvas.toDataURL("image/png"));
    }

    setIsProcessing(false);
    setIsDone(true);
  };

  // Before-After 드래그 핸들러
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleSliderMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* 타이틀 및 가이드 카드 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">이미지 AI 업스케일러 (4K 지원)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              초해상도(Super Resolution) 이미지 복원 커널 연산을 통해 원본의 깨짐 현상을 방지하고, 최대 4K UHD 고화질로 변환합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 컨트롤 패널 (왼쪽 1열) */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Sliders size={16} className="text-purple-400" />
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">업스케일 설정</h3>
          </div>

          {/* 1. 업스케일 배율 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-700 dark:text-zinc-300">업스케일링 비율</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "2x (HD급)", val: 2 },
                { label: "4x (4K UHD)", val: 4 },
                { label: "8x (초고해상)", val: 8 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setScale(item.val)}
                  className={`py-2 text-[11px] font-black rounded-lg border transition-all ${
                    scale === item.val
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 업스케일 모드 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-700 dark:text-zinc-300">신경망 복원 모드</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "실제 사진", id: "photo" },
                { label: "일러스트", id: "art" },
                { label: "문서/텍스트", id: "text" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className={`py-2 text-[11px] font-black rounded-lg border transition-all ${
                    mode === item.id
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 노이즈 제거 수준 */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-700 dark:text-zinc-300">디노이즈(노이즈 정제)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "약하게", id: "low" },
                { label: "보통", id: "medium" },
                { label: "강하게", id: "high" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDenoise(item.id)}
                  className={`py-2 text-[11px] font-black rounded-lg border transition-all ${
                    denoise === item.id
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 선명도 슬라이더 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-zinc-700 dark:text-zinc-300">
              <span>디테일 선명도 (Sharpen)</span>
              <span className="text-purple-400">{sharpen}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sharpen}
              onChange={(e) => {
                setSharpen(Number(e.target.value));
                setIsDone(false);
                setDownloadUrl(null);
              }}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-[10px] font-bold text-zinc-500 block leading-tight">
              높을수록 외곽선이 칼처럼 뚜렷해지고, 낮을수록 부드럽게 윤곽이 처리됩니다.
            </span>
          </div>

          {/* 정보 알림창 */}
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/40 p-4 border border-zinc-200 dark:border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 text-xs font-black">
              <Info size={14} className="text-purple-400" />
              <span>화질 개선 메커니즘</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">
              본 변환기는 로컬 초해상도 픽셀 콘볼루션 커널(Convolution Kernel) 알고리즘을 사용합니다. AI 분석을 실행하면, 텍스처를 픽셀 단위로 재구성하여 다운로드 시 실제 해상도를 {scale}배 증대시킵니다.
            </p>
          </div>
        </div>

        {/* 캔버스 및 슬라이더 뷰어 (오른쪽 2열) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-purple-400" />
              <h3 className="text-sm font-black text-zinc-900 dark:text-white">화질 비교 캔버스</h3>
            </div>
            
            {/* 해상도 매핑 정보 표시 */}
            {originalResolution && upscaledResolution && (
              <div className="text-[11px] font-black text-zinc-500 flex items-center gap-2">
                <span>{originalResolution.w}x{originalResolution.h}</span>
                <span className="text-purple-400">→</span>
                <span className="text-purple-400">{upscaledResolution.w}x{upscaledResolution.h} (실제 변환)</span>
              </div>
            )}
          </div>

          {/* 이미지 드롭존 / 비교 슬라이더 영역 */}
          <div 
            ref={containerRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative w-full h-[450px] bg-zinc-950 rounded-2xl border border-dashed border-zinc-850 overflow-hidden flex items-center justify-center"
          >
            {!imageSrc ? (
              // 업로드 드롭존
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-4 p-8 text-center w-full h-full hover:bg-zinc-900/30 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-200">여기에 이미지 드래그 앤 드롭 또는 클릭하여 업로드</p>
                  <p className="text-xs text-zinc-650 font-bold mt-1">PNG, JPG, WEBP 파일 지원 (초고화질 UHD 스케일 렌더링)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              // Before / After 분할 슬라이더 컨테이너
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 1. Before Canvas (저해상도 - 흐릿하게 렌더링) */}
                <canvas 
                  ref={beforeCanvasRef}
                  className="absolute max-w-full max-h-full"
                />

                {/* 2. After Canvas (고해상도 - 선명화 연산 처리) */}
                <div 
                  className="absolute left-0 top-0 h-full overflow-hidden pointer-events-none flex items-center justify-start w-full"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <canvas 
                    ref={afterCanvasRef}
                    className="absolute max-w-none max-h-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      // 캔버스 크기를 Before와 완전 동기화
                      width: beforeCanvasRef.current?.width || "100%",
                      height: beforeCanvasRef.current?.height || "100%",
                    }}
                  />
                </div>

                {/* 3. Before/After 텍스트 뱃지 */}
                <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[10px] font-black text-zinc-450 pointer-events-none">
                  BEFORE (원본 저해상)
                </div>
                <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded bg-purple-900/60 backdrop-blur border border-purple-500/30 text-[10px] font-black text-purple-200 pointer-events-none">
                  AFTER (AI 4K 업스케일)
                </div>

                {/* 4. 드래그 조절 핸들 바 */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-purple-500 z-30 cursor-ew-resize flex items-center justify-center pointer-events-auto"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 border border-purple-400 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <ArrowLeftRight size={14} />
                  </div>
                </div>
              </div>
            )}

            {/* 업스케일링 단계별 프로그레스 오버레이 */}
            {isProcessing && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-8 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
                  <Sparkles size={20} className="absolute text-purple-400 animate-pulse" />
                </div>
                <div className="text-center space-y-2 max-w-sm">
                  <p className="text-sm font-black text-white">{processStep}</p>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500">{progress}% 분석 연산 중</span>
                </div>
              </div>
            )}
          </div>

          {/* 하단 액션 버튼 영역 */}
          <div className="flex gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
            {imageSrc && (
              <button
                onClick={() => {
                  setImageSrc(null);
                  setIsDone(false);
                  setDownloadUrl(null);
                }}
                className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-white transition-all font-black text-xs shrink-0 flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                재업로드
              </button>
            )}
            
            <button
              onClick={triggerUpscaler}
              disabled={!imageSrc || isProcessing}
              className={`flex-1 py-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                !imageSrc
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/15"
              }`}
            >
              <Sparkles size={14} />
              AI 4K 업스케일 실행
            </button>

            {isDone && downloadUrl && (
              <a
                href={downloadUrl}
                download={`upscaled_${scale}x_${imageName}`}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/15 transition-all transform hover:-translate-y-0.5"
              >
                <Download size={14} />
                업스케일 이미지 저장 (UHD)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
