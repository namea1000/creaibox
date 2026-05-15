"use client";

import React from 'react';
import { 
  Wrench, Scissors, FileCode, Languages, Hash, 
  Image as ImageIcon, FileText, Zap, Box, 
  ChevronRight, ArrowRight, ExternalLink, Cog
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// 🌟 유틸리티 도구 리스트 데이터
const utilityTools = [
  {
    id: 'bg-remover',
    title: 'AI 누끼 제거',
    description: '클릭 한 번으로 이미지 배경을 깔끔하게 제거하여 소스로 활용.',
    icon: <Scissors className="text-pink-500" size={32} />,
    tag: 'Image'
  },
  {
    id: 'translator',
    title: 'AI 다국어 번역기',
    description: '문맥을 파악하는 지능형 번역으로 글로벌 콘텐츠 원고 작성.',
    icon: <Languages className="text-blue-500" size={32} />,
    tag: 'Text'
  },
  {
    id: 'code-beautify',
    title: '코드 뷰티파이어',
    description: '지저분한 JSON이나 HTML 코드를 읽기 좋게 정렬하고 최적화.',
    icon: <FileCode className="text-emerald-500" size={32} />,
    tag: 'Dev'
  },
  {
    id: 'metadata',
    title: '메타데이터 추출',
    description: '이미지나 영상 파일에 숨겨진 상세 정보와 태그 분석.',
    icon: <Hash className="text-amber-500" size={32} />,
    tag: 'Data'
  },
  {
    id: 'converter',
    title: '포맷 변환기',
    description: 'PNG to WebP, MP4 to GIF 등 다양한 미디어 포맷 즉시 변환.',
    icon: <Zap className="text-purple-500" size={32} />,
    tag: 'File'
  },
  {
    id: 'document-ai',
    title: 'PDF 문서 분석',
    description: '긴 PDF 문서를 업로드하여 요약하거나 필요한 정보만 추출.',
    icon: <FileText className="text-red-500" size={32} />,
    tag: 'Doc'
  }
];

export default function ToolsStationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-zinc-600/10 rounded-lg border border-zinc-500/20">
              <Wrench className="text-zinc-400" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Utility Workshop</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            Universal <span className="text-zinc-500">Tools</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            창작의 효율을 완성하는 마지막 퍼즐. 메인 스튜디오를 보조하는 
            작지만 강력한 도구들이 사장님의 워크플로우를 완벽하게 서포트합니다.
          </p>
        </header>

        {/* 🌟 1. 메인 유틸리티 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {utilityTools.map((tool) => (
            <div 
              key={tool.id}
              className="group relative bg-zinc-900/10 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/30 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12">
                {tool.icon}
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800 group-hover:border-zinc-500/50 transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-800">
                    {tool.tag}
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                    {tool.title}
                    <ChevronRight size={16} className="text-zinc-800 group-hover:text-zinc-400 transition-colors" />
                  </h3>
                  <p className="text-zinc-600 text-xs font-bold leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🌟 2. 외부 추천 서비스 (사장님 요청: 인터넷 유용한 툴) */}
        <section className="bg-zinc-900/10 border border-zinc-900 rounded-[40px] p-10 lg:p-16 mb-32 relative overflow-hidden">
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
              <div className="text-left space-y-2">
                <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Recommended Web Resources</h2>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">창작에 영감을 주는 외부 리소스 큐레이션</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase">
                Suggest a Tool <ExternalLink size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Pexels", type: "Free Stock", link: "https://pexels.com" },
                { name: "Unsplash", type: "High-Res Image", link: "https://unsplash.com" },
                { name: "FlatIcon", type: "SVG Icons", link: "https://flaticon.com" },
                { name: "Google Fonts", type: "Web Typography", link: "https://fonts.google.com" },
              ].map((res) => (
                <a 
                  href={res.link} 
                  target="_blank" 
                  key={res.name}
                  className="flex flex-col p-6 bg-black/40 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all group"
                >
                  <span className="text-sm font-black text-zinc-300 group-hover:text-blue-500">{res.name}</span>
                  <span className="text-[9px] font-bold text-zinc-700 uppercase mt-1 italic">{res.type}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 🌟 3. 하단 개발 진행중 문구 */}
        <div className="py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-zinc-700" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-900">
              Toolbox <span className="text-zinc-950/20">Expansion</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
          <p className="text-zinc-800 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse">
            현재 새로운 유틸리티 도구들을 조립 중입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Universal Station — Identity System
            </div>
        </footer>
      </div>
    </div>
  );
}