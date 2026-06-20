"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, Loader2, Download, RefreshCw, Layers } from "lucide-react";

interface CompressedFile {
  name: string;
  originalSize: string;
  compressedSize: string;
  ratio: string;
  url: string;
}

export default function WebpCompressorTab() {
  const [dragActive, setDragActive] = useState(false);
  const [quality, setQuality] = useState(80);
  const [compressing, setCompressing] = useState(false);
  const [compressedList, setCompressedList] = useState<CompressedFile[]>([]);

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
      triggerCompression(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerCompression(Array.from(e.target.files));
    }
  };

  const triggerCompression = (files: File[]) => {
    setCompressing(true);
    
    setTimeout(() => {
      const results: CompressedFile[] = files.map((file, i) => {
        const origSizeKb = file.size / 1024;
        const compressedSizeKb = origSizeKb * (quality / 100) * 0.45; // simulate WebP shrink
        const ratioPercent = Math.round(((origSizeKb - compressedSizeKb) / origSizeKb) * 100);

        return {
          name: file.name.split(".").slice(0, -1).join(".") + ".webp",
          originalSize: `${origSizeKb.toFixed(1)} KB`,
          compressedSize: `${compressedSizeKb.toFixed(1)} KB`,
          ratio: `-${ratioPercent}%`,
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
        };
      });

      setCompressedList(prev => [...results, ...prev]);
      setCompressing(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-in fade-in duration-200">
      
      {/* 1. Drag & Drop File Zone and Settings panel */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
          <Upload className="text-purple-400" size={20} />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">WEBP 일괄 압축기</h2>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">압축 품질 설정 (Quality)</label>
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

        {/* Drag Drop artboard */}
        <label
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-60 ${
            dragActive ? "border-purple-500 bg-purple-500/5" : "border-zinc-850 bg-zinc-950/20 hover:border-purple-500/30"
          }`}
        >
          {compressing ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 className="animate-spin text-purple-500" size={26} />
              <span className="text-xs font-black text-white uppercase tracking-widest">Optimizing Media assets...</span>
            </div>
          ) : (
            <div className="space-y-2.5 flex flex-col items-center">
              <RefreshCw className="text-zinc-600 animate-pulse" size={24} />
              <div>
                <span className="text-xs font-black text-zinc-350 block">여기에 파일 업로드 또는 드래그 앤 드롭</span>
                <span className="text-[10px] text-zinc-650 mt-1 block">JPG, PNG, GIF, WEBP 파일을 지원합니다.</span>
              </div>
            </div>
          )}
          <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      {/* 2. Results list */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3 shrink-0">
          <Layers className="text-emerald-400" size={20} />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">압축 변환 결과 ({compressedList.length})</h2>
        </div>

        {compressedList.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5">
            {compressedList.map((item, idx) => (
              <div key={idx} className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-zinc-300 truncate">{item.name}</h4>
                  <div className="flex gap-2 items-center text-[10px] text-zinc-500 font-mono mt-1">
                    <span className="line-through">{item.originalSize}</span>
                    <span>→</span>
                    <span className="text-emerald-400 font-bold">{item.compressedSize}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 font-sans">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                    {item.ratio}
                  </span>
                  <a
                    href={item.url}
                    download={item.name}
                    className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg transition"
                  >
                    <Download size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-zinc-600 italic text-xs">
            대기 중인 파일이 없습니다.
          </div>
        )}
      </div>

    </div>
  );
}
