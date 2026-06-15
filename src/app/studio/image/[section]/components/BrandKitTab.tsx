"use client";

import React, { useState } from "react";
import { Palette, Copy, Check, Upload, Trash2, Plus, Type, FileText } from "lucide-react";

export default function BrandKitTab() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const [palettes, setPalettes] = useState([
    { name: "메인 브랜드 팔레트", colors: ["#8B5CF6", "#6366F1", "#EC4899", "#10B981"] },
    { name: "어텀 무드 팔레트", colors: ["#B45309", "#D97706", "#F59E0B", "#FCD34D"] },
  ]);

  const [logos, setLogos] = useState<string[]>([
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
  ]);

  const [newPaletteName, setNewPaletteName] = useState("");
  const [newPaletteColors, setNewPaletteColors] = useState(["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1000);
  };

  const handleAddPalette = () => {
    if (!newPaletteName.trim()) return alert("팔레트 이름을 입력해주세요.");
    setPalettes([...palettes, { name: newPaletteName, colors: newPaletteColors }]);
    setNewPaletteName("");
  };

  const handleAddLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogos([...logos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = (index: number) => {
    setLogos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-in fade-in duration-200">
      
      {/* 1. Palette kit */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
          <Palette className="text-purple-400" size={20} />
          <h2 className="text-lg font-black text-white">브랜드 색상 팔레트</h2>
        </div>
        
        <div className="space-y-4">
          {palettes.map((palette, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-3">
              <h3 className="text-xs font-black text-zinc-300">{palette.name}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {palette.colors.map((color, i) => {
                  const isCopied = copiedColor === color;
                  return (
                    <button
                      key={i}
                      onClick={() => handleCopyColor(color)}
                      className="h-12 rounded-xl relative border border-zinc-850 group cursor-pointer hover:scale-105 active:scale-95 transition-all text-left"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        {isCopied ? <Check size={14} className="text-white" /> : <Copy size={13} className="text-white" />}
                      </div>
                      <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white px-1 py-0.2 rounded bg-black/40 font-mono uppercase">
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add custom brand color palette form */}
        <div className="pt-4 border-t border-zinc-800/40 space-y-3">
          <h3 className="text-xs font-black text-zinc-400">새 브랜드 팔레트 추가</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="예: 크리스마스 이벤트 팔레트"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-purple-500/50"
            />
            <button
              onClick={handleAddPalette}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black transition cursor-pointer"
            >
              추가하기
            </button>
          </div>
        </div>
      </div>

      {/* 2. Logo Assets & Fonts kit */}
      <div className="space-y-6">
        
        {/* Brand Logos */}
        <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
            <FileText className="text-rose-400" size={20} />
            <h2 className="text-lg font-black text-white">공식 브랜드 로고</h2>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            디자인 편집기에서 클릭 한 번으로 바로 삽입할 수 있는 투명 로고 파일입니다.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {logos.map((logo, index) => (
              <div key={index} className="relative group border border-zinc-800 bg-zinc-950/60 rounded-xl p-2 h-20 flex items-center justify-center">
                <img src={logo} alt="Brand Logo" className="max-h-full max-w-full object-contain" />
                <button
                  onClick={() => handleDeleteLogo(index)}
                  className="absolute top-1 right-1 p-1 bg-red-950/80 border border-red-900/40 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
            
            <label className="border border-dashed border-zinc-800 hover:border-purple-500/30 rounded-xl flex flex-col items-center justify-center h-20 cursor-pointer bg-zinc-950/40 transition">
              <Upload className="text-zinc-600" size={15} />
              <span className="text-[9px] text-zinc-500 font-bold mt-1">로고 추가</span>
              <input type="file" hidden accept="image/*" onChange={handleAddLogo} />
            </label>
          </div>
        </div>

        {/* Brand Fonts Guide */}
        <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-3">
            <Type className="text-blue-400" size={20} />
            <h2 className="text-lg font-black text-white">서체 가이드라인</h2>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            브랜드의 표준 폰트 구성입니다. 디자인 일관성을 높이기 위해 본 구성을 추천합니다.
          </p>
          <div className="space-y-2.5">
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-850">
              <p className="text-[10px] font-bold text-zinc-500">메인 헤드라인</p>
              <p className="text-sm font-black text-white mt-1">Inter Black 32pt</p>
            </div>
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-850">
              <p className="text-[10px] font-bold text-zinc-500">서브 코멘트</p>
              <p className="text-xs font-bold text-zinc-300 mt-1">Noto Sans KR Bold 16pt</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
