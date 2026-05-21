"use client";

import React, { useRef } from 'react';
import { ImageIcon, Type, Wand2, Copy, Save, RefreshCw } from 'lucide-react';

export default function NaverManuscriptEditor({ 
  title, setTitle, content, setContent, charCount, 
  handleSave, isSaving, isLoading, handleEnhance, keyword 
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col bg-zinc-900/40 border border-emerald-500/20 rounded-2xl overflow-hidden h-full shadow-2xl">
      <div className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-emerald-500/10 rounded-xl text-xs font-bold border border-zinc-800 flex items-center gap-1"><ImageIcon size={14} /> 사진</button>
          <button onClick={() => handleEnhance('correct')} className="p-2 hover:bg-zinc-800 rounded-xl text-xs flex items-center gap-1"><Type size={14} /> 맞춤법</button>
          <button onClick={() => handleEnhance('expand')} className="p-2 hover:bg-emerald-500/10 rounded-xl text-xs text-emerald-400 font-black flex items-center gap-1"><Wand2 size={14} /> AI 보강</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard.writeText(content); alert("복사완료!"); }} className="px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300 text-xs font-bold"><Copy size={13} /></button>
          <button onClick={handleSave} disabled={isSaving} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black">{isSaving ? "저장중..." : "원고 저장"}</button>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto bg-zinc-950/40 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-500"><RefreshCw className="animate-spin mr-2" size={14} /> 데이터 바인딩 중...</div>
        ) : (
          <>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-xl font-black text-white focus:outline-none" placeholder="제목을 입력하세요..." />
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">Chars: <strong className="text-emerald-400">{charCount}</strong></span>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full flex-1 bg-transparent text-sm text-zinc-300 resize-none focus:outline-none leading-relaxed min-h-[350px]" placeholder="본문 내용을 채워주세요..." />
          </>
        )}
      </div>
    </div>
  );
}