"use client";

import React from 'react';
import { 
  ImageIcon, Palette, Maximize, Scissors, Library, 
  Layout, CreditCard, Presentation, Flag, ChevronRight, RefreshCw, Layers
} from 'lucide-react'; // 🌟 Banner를 Flag로 교체했습니다.
import { useRouter } from 'next/navigation';

// 🌟 이미지 도구 리스트 데이터
const imageTools = [
  {
    id: 'prompt-lib',
    title: '프롬프트 라이브러리',
    description: '최고의 결과물을 만드는 고퀄리티 AI 이미지 프롬프트 저장소.',
    icon: <Library className="text-blue-500" size={32} />,
    color: 'group-hover:border-blue-500/50',
    tag: 'Creative'
  },
  {
    id: 'thumbnail',
    title: '썸네일 메이커',
    description: '유튜브 및 블로그 클릭률을 높이는 임팩트 있는 썸네일 자동 생성.',
    icon: <Layout className="text-emerald-500" size={32} />,
    color: 'group-hover:border-emerald-500/50',
    tag: 'Social'
  },
  {
    id: 'poster',
    title: '포스터 & 전단지',
    description: '이벤트 홍보를 위한 고해상도 포스터 및 전단지 디자인 도구.',
    icon: <Presentation className="text-purple-500" size={32} />,
    color: 'group-hover:border-purple-500/50',
    tag: 'Print'
  },
  {
    id: 'business-card',
    title: '디지털 명함',
    description: '나만의 퍼스널 브랜딩을 완성하는 세련된 비즈니스 카드 디자인.',
    icon: <CreditCard className="text-pink-500" size={32} />,
    color: 'group-hover:border-pink-500/50',
    tag: 'Branding'
  },
  {
    id: 'banner',
    title: '현수막 & 배너',
    description: '웹사이트 헤더부터 오프라인 현수막까지 규격화된 배너 제작.',
    icon: <Flag className="text-orange-500" size={32} />, // 🌟 여기를 수정했습니다.
    color: 'group-hover:border-orange-500/50',
    tag: 'Marketing'
  },
  {
    id: 'compressor',
    title: 'WebP 압축기',
    description: '화질 저하 없이 용량을 줄여 웹사이트 속도를 최적화하는 압축 도구.',
    icon: <Maximize className="text-cyan-500" size={32} />,
    color: 'group-hover:border-cyan-500/50',
    tag: 'Utility'
  },
  {
    id: 'editor',
    title: '이미지 편집기',
    description: '누끼 제거, 필터 적용, 텍스트 삽입 등 브라우저 기반 퀵 편집기.',
    icon: <Scissors className="text-amber-500" size={32} />,
    color: 'group-hover:border-amber-500/50',
    tag: 'Utility'
  }
];

export default function ImageStudioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-600/10 rounded-lg border border-emerald-500/20">
              <Palette className="text-emerald-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Visual Intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
            Visual <span className="text-emerald-500">Studio</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            텍스트가 예술이 되는 순간. 상상 속의 이미지를 현실로 구현하고, 
            전문적인 디자인 결과물을 광속으로 생산하는 비주얼 워크스테이션입니다.
          </p>
        </header>

        {/* 메인 그리드 박스 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {imageTools.map((tool) => (
            <div 
              key={tool.id}
              className={`group relative bg-zinc-900/20 border border-zinc-800/80 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] ${tool.color} overflow-hidden cursor-pointer flex flex-col justify-between min-h-[280px]`}
            >
              <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity scale-150 rotate-12">
                {tool.icon}
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {tool.icon}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center justify-between group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                    <ChevronRight size={18} className="text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="lg:col-span-1 border-2 border-dashed border-zinc-800/30 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-40 bg-black/10">
            <Layers className="text-zinc-800" size={32} />
            <div>
              <h3 className="text-sm font-black text-zinc-700 uppercase italic tracking-widest">More Tools Under Lab</h3>
              <p className="text-[10px] text-zinc-800 font-bold uppercase mt-1">연구소에서 새로운 툴이 제작되고 있습니다</p>
            </div>
          </div>
        </div>

        {/* 하단 개발 진행중 섹션 */}
        <div className="mt-32 py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-8">
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-emerald-500/50" />
            <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />
                <h2 className="relative text-4xl lg:text-6xl font-black italic uppercase tracking-[0.25em] text-zinc-900 select-none">
                  Rendering <span className="text-emerald-950/20">Lab</span>
                </h2>
            </div>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-emerald-500/50" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-emerald-500/30 text-base lg:text-xl font-black uppercase tracking-[0.6em] animate-pulse italic">
              현재 개발 진행중입니다. 곧 오픈 예정입니다.
            </p>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-emerald-900 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Visual Studio Identity System
            </div>
        </footer>
      </div>
    </div>
  );
}