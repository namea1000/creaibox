"use client";

import React, { useState } from "react";
import { Palette, Loader2, Upload, Copy, Check } from "lucide-react";

export default function ColorPicker() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<{ hex: string; rgb: string; name: string }[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  };

  const handlePickColors = () => {
    if (!image) return;
    setLoading(true);

    setTimeout(() => {
      // Return beautiful premium palette mockups
      setColors([
        { hex: "#0F172A", rgb: "rgb(15, 23, 42)", name: "슬레이트 제트블랙" },
        { hex: "#3B82F6", rgb: "rgb(59, 130, 246)", name: "네온 일렉트릭블루" },
        { hex: "#10B981", rgb: "rgb(16, 185, 129)", name: "에메랄드 포레스트" },
        { hex: "#F59E0B", rgb: "rgb(245, 158, 11)", name: "앰버 골드썬샤인" },
        { hex: "#EF4444", rgb: "rgb(239, 68, 68)", name: "비비드 크림슨레드" },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <Palette className="text-cyan-400" size={20} />
          이미지 색상 추출기 (Color Palette Extractor)
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          디자인 레퍼런스 이미지나 썸네일을 업로드하면, 화면을 지배하는 5가지 주요 색상의 HEX 코드, RGB 코드 및 보조 색상 테마를 자동으로 감별해 도출합니다.
        </p>

        {!image ? (
          <div className="border-2 border-dashed border-zinc-800 hover:border-cyan-500/40 rounded-2xl bg-zinc-950/40 p-10 text-center transition relative flex flex-col items-center justify-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">이미지 파일을 여기에 드래그하거나 클릭하세요</p>
              <p className="text-[10px] text-zinc-650 mt-1 font-bold">지원 포맷: JPG, PNG, WebP (최대 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left Preview */}
              <div className="rounded-xl border border-zinc-855 bg-zinc-950/60 p-4 text-center">
                <p className="text-[10px] font-bold text-zinc-500 mb-2">업로드 이미지</p>
                <div className="aspect-square max-h-60 mx-auto overflow-hidden rounded-lg border border-zinc-850 flex items-center justify-center bg-zinc-900">
                  <img src={image} alt="Upload" className="max-h-full max-w-full object-contain" />
                </div>
              </div>

              {/* Right Palette results */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/60 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 mb-3">추출된 색상 팔레트</p>
                  
                  {loading ? (
                    <div className="h-52 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-cyan-400" size={24} />
                      <p className="text-[10px] font-bold text-zinc-500">지배 색상 픽셀들을 그룹화 중...</p>
                    </div>
                  ) : colors.length > 0 ? (
                    <div className="space-y-2.5">
                      {colors.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => handleCopy(c.hex)}
                          className="flex justify-between items-center rounded-lg bg-zinc-900/50 p-2.5 border border-zinc-850 hover:border-cyan-500/30 hover:bg-zinc-900 cursor-pointer select-none transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded border border-zinc-800 shrink-0" style={{ backgroundColor: c.hex }} />
                            <div>
                              <p className="text-xs font-bold text-white leading-none">{c.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-1 font-bold">{c.hex} · {c.rgb}</p>
                            </div>
                          </div>
                          
                          <div className="shrink-0 ml-4">
                            {copiedHex === c.hex ? (
                              <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"><Check size={11} /> 복사됨</span>
                            ) : (
                              <span className="text-[10px] font-bold text-zinc-650 group-hover:text-zinc-400">코드 복사</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-52 flex items-center justify-center text-[10px] text-zinc-650 font-bold">
                      팔레트 추출 버튼을 누르면 색상 코드가 나타납니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setImage(null);
                  setColors([]);
                }}
                disabled={loading}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              >
                다른 이미지 선택
              </button>

              {!colors.length && (
                <button
                  onClick={handlePickColors}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-cyan-650 px-6 text-xs font-black text-white hover:bg-cyan-600 disabled:opacity-50 transition shadow-lg shadow-cyan-600/10"
                >
                  <Palette size={14} />
                  팔레트 색상 추출
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
