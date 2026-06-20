"use client";

import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, Loader2, Download, RefreshCw, Layers, ImageIcon, Sliders } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  originalSizeStr: string;
  convertedName?: string;
  convertedSizeStr?: string;
  convertedUrl?: string;
  status: "idle" | "converting" | "done" | "error";
  errorMsg?: string;
}

export default function ImageConverterTab() {
  const [dragActive, setDragActive] = useState(false);
  const [format, setFormat] = useState<"webp" | "png" | "jpeg">("webp");
  const [sizePreset, setSizePreset] = useState<"original" | "1920" | "1280" | "640" | "custom">("original");
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [quality, setQuality] = useState(85);
  const [filesQueue, setFilesQueue] = useState<UploadedFile[]>([]);
  const [globalConverting, setGlobalConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToQueue(Array.from(e.target.files));
    }
  };

  const addFilesToQueue = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("이미지 파일만 선택해 주세요.");
      return;
    }

    imageFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      const originalSizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      
      const img = new Image();
      img.onload = () => {
        const newFile: UploadedFile = {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl,
          width: img.width,
          height: img.height,
          originalSizeStr,
          status: "idle",
        };
        setFilesQueue(prev => [newFile, ...prev]);
      };
      img.src = previewUrl;
    });
  };

  const convertSingleFile = async (item: UploadedFile) => {
    // Update status to converting
    setFilesQueue(prev => prev.map(f => f.id === item.id ? { ...f, status: "converting" } : f));
    
    try {
      const result = await performConversion(item.file, item.width, item.height);
      setFilesQueue(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: "done",
        convertedName: result.name,
        convertedSizeStr: result.sizeStr,
        convertedUrl: result.url,
      } : f));
    } catch (err: any) {
      setFilesQueue(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: "error",
        errorMsg: err.message || "변환 오류",
      } : f));
    }
  };

  const performConversion = (
    file: File,
    origWidth: number,
    origHeight: number
  ): Promise<{ url: string; sizeStr: string; name: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context is not available"));
            return;
          }

          let targetWidth = origWidth;
          let targetHeight = origHeight;

          if (sizePreset === "1920" && origWidth > 1920) {
            targetWidth = 1920;
            targetHeight = Math.round((origHeight / origWidth) * 1920);
          } else if (sizePreset === "1280" && origWidth > 1280) {
            targetWidth = 1280;
            targetHeight = Math.round((origHeight / origWidth) * 1280);
          } else if (sizePreset === "640" && origWidth > 640) {
            targetWidth = 640;
            targetHeight = Math.round((origHeight / origWidth) * 640);
          } else if (sizePreset === "custom" && customWidth > 0) {
            targetWidth = customWidth;
            targetHeight = Math.round((origHeight / origWidth) * customWidth);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const mimeType = format === "webp" ? "image/webp" : format === "jpeg" ? "image/jpeg" : "image/png";
          const outQuality = format === "png" ? undefined : quality / 100;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Blob creation failed"));
                return;
              }
              const url = URL.createObjectURL(blob);
              const sizeStr = `${(blob.size / 1024).toFixed(1)} KB`;
              const baseName = file.name.replace(/\.[^/.]+$/, "");
              const name = `${baseName}_converted.${format}`;
              resolve({ url, sizeStr, name });
            },
            mimeType,
            outQuality
          );
        };
        img.onerror = () => reject(new Error("Image load error"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("File read error"));
      reader.readAsDataURL(file);
    });
  };

  const handleBatchConversion = async () => {
    if (filesQueue.length === 0) return;
    setGlobalConverting(true);

    for (const item of filesQueue) {
      if (item.status !== "done") {
        await convertSingleFile(item);
      }
    }
    
    setGlobalConverting(false);
  };

  const clearQueue = () => {
    filesQueue.forEach(item => {
      URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setFilesQueue([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-in fade-in duration-200">
      
      {/* Settings & Upload Panel */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
          <RefreshCw className="text-purple-400" size={20} />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">이미지 확장자 변환기</h2>
        </div>

        {/* 1. Format Selection */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">출력 이미지 확장자 (Format)</label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "webp", label: "WEBP", desc: "고압축 / 투명 배경" },
              { id: "png", label: "PNG", desc: "무손실 / 투명 배경" },
              { id: "jpeg", label: "JPG", desc: "웹 표준 / 실사 사진" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id as any)}
                className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                  format === f.id
                    ? "border-purple-500 bg-purple-500/10 text-white font-black"
                    : "border-zinc-850 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                }`}
              >
                <span className="text-sm tracking-wide">{f.label}</span>
                <span className="text-[9px] text-zinc-500 mt-1">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Resize Selection */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">크기 리사이즈 설정 (Dimensions)</label>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { id: "original", label: "원본 크기" },
              { id: "1920", label: "1920px (대)" },
              { id: "1280", label: "1280px (중)" },
              { id: "640", label: "640px (소)" },
              { id: "custom", label: "직접 입력" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSizePreset(preset.id as any)}
                className={`py-2 px-3 rounded-lg border text-center font-bold transition cursor-pointer ${
                  sizePreset === preset.id
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-zinc-850 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {sizePreset === "custom" && (
            <div className="flex items-center gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900 animate-in slide-in-from-top-2 duration-200">
              <span className="text-xs font-bold text-zinc-400">가로 너비 (Width):</span>
              <input
                type="number"
                min="10"
                max="10000"
                value={customWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1080)}
                className="w-24 px-3 py-1.5 rounded-lg border border-zinc-800 bg-[#0c0e14] text-xs font-mono text-white outline-none focus:border-purple-500/50"
              />
              <span className="text-xs font-bold text-zinc-500">px (높이는 원본 비율에 맞춰 계산됩니다)</span>
            </div>
          )}
        </div>

        {/* 3. Quality Settings (WEBP & JPEG only) */}
        {format !== "png" && (
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">품질 강도 설정 (Quality)</label>
            <div className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900">
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="flex-1 accent-purple-500 h-1 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-black text-purple-400 font-mono w-8 text-right">{quality}%</span>
            </div>
          </div>
        )}

        {/* Drag & Drop zone */}
        <label
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-48 ${
            dragActive ? "border-purple-500 bg-purple-500/5" : "border-zinc-850 bg-zinc-950/20 hover:border-purple-500/30"
          }`}
        >
          <div className="space-y-2.5 flex flex-col items-center">
            <Upload className="text-zinc-500 group-hover:scale-105 transition" size={24} />
            <div>
              <span className="text-xs font-black text-zinc-350 block">여기에 파일 업로드 또는 드래그 앤 드롭</span>
              <span className="text-[10px] text-zinc-650 mt-1 block">모든 이미지 포맷 변환 및 리사이징 지원</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Results queue */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4 flex flex-col h-[520px]">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <Layers className="text-emerald-400" size={20} />
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">변환 대기열 ({filesQueue.length})</h2>
          </div>
          {filesQueue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-400 transition cursor-pointer"
            >
              전체 비우기
            </button>
          )}
        </div>

        {filesQueue.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-0.5">
              {filesQueue.map((item) => (
                <div key={item.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex gap-3 animate-in zoom-in-95 duration-200">
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-zinc-900 shrink-0"
                  />
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-zinc-300 truncate">{item.file.name}</h4>
                      <p className="text-[9px] font-bold text-zinc-550 mt-0.5">
                        원본: {item.width}x{item.height} | {item.originalSizeStr}
                      </p>
                    </div>

                    {item.status === "done" && (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold mt-1">
                        <CheckCircle2 size={11} />
                        <span>변환 완료 ({item.convertedSizeStr})</span>
                      </div>
                    )}

                    {item.status === "converting" && (
                      <div className="flex items-center gap-2 text-[10px] text-purple-400 font-bold mt-1 animate-pulse">
                        <Loader2 size={11} className="animate-spin" />
                        <span>변환 처리 중...</span>
                      </div>
                    )}

                    {item.status === "error" && (
                      <div className="text-[10px] text-red-400 font-bold mt-1">
                        오류: {item.errorMsg}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-end shrink-0">
                    {item.status === "done" ? (
                      <a
                        href={item.convertedUrl}
                        download={item.convertedName}
                        className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition active:scale-95 shadow-md"
                        title="다운로드"
                      >
                        <Download size={13} />
                      </a>
                    ) : (
                      <button
                        onClick={() => convertSingleFile(item)}
                        disabled={item.status === "converting" || globalConverting}
                        className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg transition disabled:opacity-40 cursor-pointer"
                        title="개별 변환"
                      >
                        <RefreshCw size={13} className={item.status === "converting" ? "animate-spin" : ""} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Convert all actions */}
            <div className="pt-2 border-t border-zinc-800/40 shrink-0">
              <button
                type="button"
                onClick={handleBatchConversion}
                disabled={globalConverting}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {globalConverting ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <RefreshCw size={14} />
                )}
                {globalConverting ? "일괄 변환 진행 중..." : "일괄 변환 및 다운로드"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-zinc-600 italic text-xs">
            대기 중인 파일이 없습니다.
          </div>
        )}
      </div>
      
    </div>
  );
}
