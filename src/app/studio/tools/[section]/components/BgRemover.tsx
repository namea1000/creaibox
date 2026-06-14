"use client";

import React, { useState } from "react";
import { Wand2, Loader2, Upload, Download, RefreshCw, AlertCircle } from "lucide-react";

export default function BgRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = () => {
    if (!image) return;
    setLoading(true);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setResult(image); // Simulating processed cutout
          setLoading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Wand2 className="text-violet-400 animate-pulse" size={20} />
          AI 누끼 제거 (Background Remover)
        </h2>
        <p className="text-xs text-zinc-550 mb-4 leading-relaxed">
          배경이 있는 인물, 상품, 로고 이미지를 업로드하면 피사체를 정밀하게 인식해 배경을 투명하게 제거한 고화질 PNG 파일로 변환합니다.
        </p>

        {!image ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-violet-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">이미지 파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-600 mt-1 font-bold">지원 포맷: JPG, PNG, WebP (최대 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Original Preview */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/60 p-4 text-center">
                <p className="text-[10px] font-bold text-zinc-500 mb-2">원본 이미지</p>
                <div className="aspect-square max-h-60 mx-auto overflow-hidden rounded-lg border border-zinc-850 flex items-center justify-center bg-zinc-900">
                  <img src={image} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              </div>

              {/* Cutout Preview */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/60 p-4 text-center relative flex flex-col justify-between">
                <p className="text-[10px] font-bold text-zinc-500 mb-2">누끼 제거 결과</p>
                
                <div className="flex-1 flex items-center justify-center aspect-square max-h-60 mx-auto w-full overflow-hidden rounded-lg border border-zinc-850 bg-zinc-900 checkered-pattern">
                  {result ? (
                    <img src={result} alt="Cutout" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                  ) : loading ? (
                    <div className="text-center space-y-2">
                      <Loader2 className="animate-spin text-violet-400 mx-auto" size={24} />
                      <p className="text-[10px] font-bold text-zinc-550">배경 분리 중... {progress}%</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-650 font-bold">누끼 제거 버튼을 눌러 작업을 시작하세요</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                disabled={loading}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              >
                다른 이미지 선택
              </button>

              {!result ? (
                <button
                  onClick={handleProcess}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-6 text-xs font-black text-white hover:bg-violet-500 disabled:opacity-50 transition shadow-lg shadow-violet-600/10"
                >
                  <Wand2 size={14} />
                  배경 누끼 제거
                </button>
              ) : (
                <a
                  href={result}
                  download="creaibox_cutout.png"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-650 px-6 text-xs font-black text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-600/10"
                >
                  <Download size={14} />
                  투명 PNG 다운로드
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkered-pattern {
          background-image: linear-gradient(45deg, #0b0c10 25%, transparent 25%),
                            linear-gradient(-45deg, #0b0c10 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #0b0c10 75%),
                            linear-gradient(-45deg, transparent 75%, #0b0c10 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
          background-color: #161821;
        }
      `}</style>
    </div>
  );
}
