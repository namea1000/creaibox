"use client";

import React from 'react';
import {
  Music, Music2, Languages, Video,
  Clock, PlayCircle, Sparkles,
  ChevronRight, ListMusic
} from 'lucide-react'; // 🌟 Youtube를 Video로 교체했습니다.
import { useRouter } from 'next/navigation';

export default function MusicStudioPage() {
  const router = useRouter();

  const musicTools = [
    {
      id: 'lyrics-gen',
      title: 'AI 가사 생성 & 번역',
      description: '주제만 입력하면 완벽한 라임의 가사 생성. 글로벌 진출을 위한 다국어 번역 지원.',
      icon: <Languages className="text-indigo-400" size={32} />,
      color: 'hover:border-indigo-500/50',
      tag: 'Writing'
    },
    {
      id: 'suno-v5',
      title: 'Suno V5.5 Studio',
      description: '최신 V5.5 엔진 연동. 텍스트로 만드는 고화질 오디오 및 완성곡 생성.',
      icon: <Music2 className="text-cyan-400" size={32} />,
      color: 'hover:border-cyan-500/50',
      tag: 'Composition'
    },
    {
      id: 'youtube-opt',
      title: 'YouTube 최적화 패키지',
      description: '곡 제목, 설명, 고정 댓글 자동 생성 및 음원 배포용 메타데이터 최적화.',
      // 🌟 Youtube 대신 Video 아이콘을 사용하여 에러를 해결했습니다.
      icon: <Video className="text-red-500" size={32} />,
      color: 'hover:border-red-500/50',
      tag: 'Distribution'
    },
    {
      id: 'timeline',
      title: '음원 타임라인 편집',
      description: '생성된 음원의 섹션별 구성 및 타임라인 정밀 조정 유틸리티.',
      icon: <Clock className="text-emerald-400" size={32} />,
      color: 'hover:border-emerald-500/50',
      tag: 'Editing'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">

        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
              <Music className="text-indigo-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 italic">Sonic Intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
            Music <span className="text-indigo-500">Studio</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            멜로디에 담긴 당신의 이야기. 가사 생성부터 풀 파이프라인 작곡까지,
            Creaibox만의 올인원 오디오 워크스테이션입니다.
          </p>
        </header>

        {/* 핵심 구역: 자동 생성 설정 스테이션 */}
        <section className="mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-[48px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-[48px] p-8 lg:p-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div className="flex-1 space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">One-Stop Creation</span>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-white leading-tight">
                      Auto <span className="text-indigo-500">Composition</span> Station
                    </h2>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed italic">
                      가사, 제목, 번역, YouTube 최적화까지 한 번에. <br />
                      생성할 곡의 개수와 스타일 포맷을 설정하고 사장님만의 음원을 광속으로 생산하세요.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    {["City Pop", "K-Pop", "Lo-fi", "Cinematic"].map((style) => (
                      <div key={style} className="bg-black/40 border border-zinc-800 rounded-xl p-3 text-center text-[11px] font-black text-zinc-500 uppercase tracking-tighter hover:border-indigo-500/50 transition-colors cursor-pointer">
                        {style}
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white font-black italic rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl uppercase tracking-tighter group/btn">
                    Launch Auto Station <PlayCircle size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex-1 w-full bg-black/60 rounded-[32px] border border-zinc-800 p-8 space-y-6 shadow-inner relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <ListMusic size={20} className="text-indigo-500" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-3 bg-indigo-500/30 rounded-full animate-pulse" />)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-indigo-500/50 rounded-full w-[${30 + i * 20}%]`} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                    <span>Lyrics Ready</span>
                    <span>Suno V5.5 Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 도구 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {musicTools.map((tool) => (
            <div
              key={tool.id}
              className={`group bg-zinc-900/20 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/40 hover:-translate-y-2 border-dashed ${tool.color} cursor-pointer text-left`}
            >
              <div className="p-4 bg-black/40 w-fit rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform mb-6">
                {tool.icon}
              </div>
              <div className="space-y-3">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800/50 px-2 py-0.5 rounded-full">{tool.tag}</span>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{tool.title}</h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 피날레 문구 */}
        <div className="mt-32 py-20 border-t border-zinc-900 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-indigo-500" />
            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
              Harmonizing <span className="text-indigo-950/20">Future</span>
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>
          <p className="text-indigo-500/40 text-sm lg:text-lg font-black uppercase tracking-[0.5em] animate-pulse italic">
            현재 개발 진행 중입니다. 곧 오픈 예정입니다.
          </p>
        </div>

        <footer className="mt-12 text-center">
          <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.5em] italic">
            Creaibox Music Studio Identity System v1.0
          </div>
        </footer>
      </div>
    </div>
  );
}