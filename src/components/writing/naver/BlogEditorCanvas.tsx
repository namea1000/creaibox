"use client";

import React, { useEffect, useState } from 'react';
import { 
  ImageIcon, Heading1, Heading2, Bold, Italic, Link2,
  Type, Wand2, Copy, Save, Cpu, Trash2, Send, RefreshCw
} from 'lucide-react';

interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

interface NaverEditorCanvasProps {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  charCount: number;
  images: ImageBlock[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isSaving: boolean;
  isEnhancing: boolean;
  handleImageUploadClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateCaption: (id: string, text: string) => void;
  handleDeleteImage: (id: string) => void;
  handleEnhanceContent: (type: 'expand' | 'tone' | 'correct') => void;
  handleSavePostToSupabase: (status?: any) => Promise<boolean | void>;
  handleCopy?: () => void;
  handleFormDelete?: () => void;
  isRecreateMode?: boolean;
  isDetailMode?: boolean;
  targetKeyword?: string;
  isLoading?: boolean;
}

export default function NaverEditorCanvas({
  title, setTitle, content, setContent, charCount, images, fileInputRef,
  isSaving, isEnhancing, handleImageUploadClick, handleImageChange,
  handleUpdateCaption, handleDeleteImage, handleEnhanceContent, 
  handleSavePostToSupabase, handleCopy, handleFormDelete,
  isRecreateMode = false, isDetailMode = false, targetKeyword = "AI 글쓰기", isLoading = false
}: NaverEditorCanvasProps) {
  const [saveFeedback, setSaveFeedback] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (saveFeedback !== 'saved') return;

    const timer = setTimeout(() => {
      setSaveFeedback('idle');
    }, 3000);

    return () => clearTimeout(timer);
  }, [saveFeedback]);

  const handleSaveClick = async (status?: any) => {
    const result = await handleSavePostToSupabase(status);
    if (result !== false) {
      setSaveFeedback('saved');
    }
  };

  return (
    /* 🌟 [수술 핵심] 우측 관제탑 길이에 밀리지 않도록 에디터 박스 자체의 최소 높이를 min-h-[750px]로 고정 적출 */
    <div className="lg:col-span-6 flex flex-col bg-[#0a0c10] overflow-hidden h-full min-h-[750px]">
      
      {/* 최상단 에디터 포맷터 핫 버튼 제어반 */}
      <div className="h-14 border-b border-zinc-800 bg-[#0b0d12] px-4 flex items-center justify-between overflow-x-auto shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button onClick={handleImageUploadClick} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all text-xs font-bold border border-zinc-800 bg-zinc-900/50 flex items-center gap-1"><ImageIcon size={14} /> 사진 추가</button>
          
          <div className="w-px h-5 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Heading1 size={15} /></button>
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Heading2 size={15} /></button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl font-bold transition-colors"><Bold size={15} /></button>
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl italic transition-colors"><Italic size={15} /></button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Link2 size={15} /></button>
          <div className="w-px h-5 bg-zinc-800 mx-1" />
          
          <button onClick={() => handleEnhanceContent('correct')} className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1 text-zinc-300"><Type size={14} /> 맞춤법</button>
          <button onClick={() => handleEnhanceContent('expand')} disabled={isEnhancing} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl text-xs font-black text-emerald-400 flex items-center gap-1"><Wand2 size={14} /> AI 보강</button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy ? handleCopy : () => { navigator.clipboard.writeText(`제목: ${title}\n\n${content}`); alert(isDetailMode ? "📋 수정실 내 원고 전체가 복사되었습니다!" : "📋 원고 전체가 클립보드에 복사되었습니다!"); }} 
            className="px-2.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1"
          >
            <Copy size={13} /> 전체 복사
          </button>
          <button 
            onClick={() => handleSaveClick(isDetailMode ? 'completed' : undefined)} 
            disabled={isSaving}
            className={isDetailMode ? "px-2.5 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 text-xs font-black active:scale-95 transition-all flex items-center gap-1" : "px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1"}
          >
            <Save size={13} /> {isSaving ? "저장중..." : saveFeedback === 'saved' ? "저장완료" : "원고 저장"}
          </button>
        </div>
      </div>

      {/* 에디터 인풋 메인 프레임 격실 */}
      <div className="flex-1 px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5 flex flex-col space-y-5 overflow-y-auto custom-scrollbar bg-white">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center text-xs font-mono text-zinc-500 gap-1.5">
            <RefreshCw size={14} className="animate-spin text-emerald-400" /> Supabase 원고 복원 데이터 바인딩 중...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <input type="text" placeholder={isRecreateMode ? "AI 글 재창조를 가동하시면 중복 필터를 완전히 회피하는 제목이 빌드됩니다." : "제목을 입력하세요..."} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-xl font-black text-zinc-900 placeholder-zinc-400 focus:outline-none tracking-tight" />
              <span className="text-[10px] font-mono text-zinc-500 shrink-0 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">Chars: <strong className="text-emerald-500">{charCount}</strong></span>
            </div>
            
            {images && images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-zinc-800/50 pb-3">
                {images.map((img) => (
                  <div key={img.id} className="group relative rounded-xl border border-zinc-800 bg-zinc-950 p-2 space-y-2 overflow-hidden shadow-md">
                    <div className="relative w-full h-24 rounded-lg overflow-hidden bg-zinc-900">
                      <img src={img.url} alt="Uploaded Block" className="w-full h-full object-cover" />
                      <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </div>
                    <input type="text" value={img.caption} onChange={(e) => handleUpdateCaption(img.id, e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-[10px] text-zinc-400 focus:outline-none" />
                  </div>
                ))}
              </div>
            )}
            {/* 🌟 [수술 핵심] 텍스트 입력창 자체도 최소 min-h-[550px]를 먹여서 본문이 비어있어도 아래로 훤하게 열려있게 만듭니다. */}
            <textarea placeholder={isRecreateMode ? "재창조 본문 결과 영역..." : "내용을 채워주세요..."} value={content} onChange={(e) => setContent(e.target.value)} className="w-full flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none resize-none leading-relaxed font-medium pt-1 min-h-[550px]" />
          </>
        )}
      </div>

      {/* 에디터 최하단 마감 마스터 필터 */}
      <div className="h-16 border-t border-zinc-800 bg-[#0b0d12] px-6 flex items-center justify-between shrink-0">
        {isDetailMode ? (
          <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 세션 완공 동기화 모드 : #{targetKeyword}</div>
        ) : (
          <span className="text-[11px] text-zinc-500 font-medium">
            {isRecreateMode ? "AI 재창조 원고 검증 파이프라인 대기 중" : "AI 스마트블록 통합 엔진 실시간 동기화 상태"}
          </span>
        )}
        <div className="flex items-center gap-2">
          {isDetailMode ? (
            <>
              <button onClick={handleFormDelete} className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all flex items-center gap-1"><Trash2 size={13} /> 영구 삭제</button>
              <button onClick={() => handleSavePostToSupabase('published')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-500 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg"><Send size={13} /> 네이버로 즉시 발행</button>
            </>
          ) : isRecreateMode ? (
            <>
              <button onClick={handleCopy} className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 transition-all"><Copy size={13} /> 결과 복사</button>
              <button onClick={() => handleSavePostToSupabase()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">원고 최종 저장</button>
            </>
          ) : (
            <span className="text-[11px] text-zinc-600 font-medium flex items-center gap-1">
              <Cpu size={12} className="text-emerald-500" /> Supabase Authenticated Session Token Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
