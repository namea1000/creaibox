"use client";

import React from 'react';
import { 
  Video, Film, Clapperboard, Play, Library, 
  Layers, MonitorPlay, Scissors, Cpu, Sparkles, 
  ChevronRight, ArrowRight, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VideoStudioPage() {
  const router = useRouter();

  const videoTools = [
    {
      id: 'video-gen',
      title: 'AI Video Generator',
      description: '글과 이미지를 단숨에 초고화질 영상으로. Kling, Luma, Veo 엔진 탑재.',
      icon: <Cpu className="text-red-500" size={32} />,
      color: 'hover:border-red-500/50',
      tag: 'Core Engine'
    },
    {
      id: 'prompt-lib',
      title: '영상 프롬프트 저장소',
      description: '역동적인 카메라 워킹과 시네마틱 연출을 위한 전용 프롬프트 라이브러리.',
      icon: <Library className="text-amber-500" size={32} />,
      color: 'hover:border-amber-500/50',
      tag: 'Creative'
    },
    {
      id: 'tool-list',
      title: 'AI Video Tool Directory',
      description: '클링, 미드져니 비디오, 구글 Veo 등 글로벌 영상 AI 툴 연동 가이드.',
      icon: <MonitorPlay className="text-blue-500" size={32} />,
      color: 'hover:border-blue-500/50',
      tag: 'Directory'
    },
    {
      id: 'shortform',
      title: '쇼츠 & 릴스 마스터',
      description: '틱톡, 인스타, 유튜브 쇼츠에 최적화된 세로형 영상 자동 편집 및 자막 생성.',
      icon: <Film className="text-pink-500" size={32} />,
      color: 'hover:border-pink-500/50',
      tag: 'Social'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600/10 rounded-lg border border-red-500/20">
              <Video className="text-red-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 italic">Cinematic Engine</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            Video <span className="text-red-500">Studio</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            이미지와 글에 생명력을 불어넣는 시간. AI 생성부터 전문가급 컷 편집까지, 
            브라우저 안에서 모든 영상 제작 프로세스가 완성됩니다.
          </p>
        </header>

        {/* 🌟 핵심 구역: 웹 기반 영상 편집기 (주인공) */}
        <section className="mb-20">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-[48px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[48px] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
              <div className="flex-1 space-y-8 relative z-10 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                  <Zap className="text-red-500 animate-pulse" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 italic">Flagship Feature</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-6xl font-black italic uppercase text-white leading-none">
                    Cloud <span className="text-red-600">Pro Editor</span>
                  </h2>
                  <p className="text-zinc-400 text-lg font-medium leading-relaxed italic">
                    캡컷, 파이널컷 프로의 강력함을 웹에서 경험하세요. <br/>
                    별도의 설치 없이 AI 자막, 멀티 트랙 편집, 크로마키를 지원합니다.
                  </p>
                </div>
                <button className="flex items-center gap-4 px-10 py-5 bg-white text-black font-black italic rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-2xl uppercase tracking-tighter group/btn">
                  LAUNCH WEB EDITOR <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
              
              {/* 편집기 프리뷰 모형 */}
              <div className="flex-1 relative w-full aspect-video bg-black rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden group-hover:border-red-500/30 transition-colors">
                <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
                  <Play size={64} className="text-red-600/50 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-800/80 border-t border-zinc-700 p-4 flex gap-2 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-full w-24 bg-zinc-700/50 rounded-sm border border-zinc-600/30" />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 하단 도구 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoTools.map((tool) => (
            <div 
              key={tool.id}
              className={`group bg-zinc-900/20 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/40 hover:-translate-y-2 border-dashed ${tool.color} cursor-pointer`}
            >
              <div className="p-4 bg-black/40 w-fit rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform mb-6">
                {tool.icon}
              </div>
              <div className="space-y-3 text-left">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800/50 px-2 py-0.5 rounded-full">{tool.tag}</span>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-red-400 transition-colors">{tool.title}</h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🌟 피날레 문구 (사장님 요청) */}
        <div className="mt-32 py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-red-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              Encoding <span className="text-red-900/20">Future</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-red-500" />
          </div>
          <p className="text-red-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse italic pl-2">
            현재 개발 진행중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
            <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
                Creaibox Video Studio Identity System v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}