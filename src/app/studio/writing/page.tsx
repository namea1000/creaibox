"use client";

import React from 'react';
import { 
  PenTool, BookOpen, Share2, Target, 
  ChevronRight, Sparkles, Globe, RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritingStudioPage() {
  const router = useRouter();

  // 🌟 글쓰기 도구 리스트 데이터
  const writingTools = [
    {
      id: 'wordpress',
      title: '워드프레스 글쓰기',
      description: 'WP REST API를 활용한 원클릭 자동 배포 및 최적화 포스팅.',
      icon: <Globe className="text-blue-500" size={32} />,
      color: 'group-hover:border-blue-500/50',
      link: '/studio/writing/wp/create', // 🌟 이동할 경로 추가
      tag: 'Distribution'
    },
    {
      id: 'blog',
      title: '네이버 블로그 글쓰기',
      description: '네이버, 티스토리 등 외부 블로그를 위한 SEO 기반 맞춤형 원고 생성.',
      icon: <BookOpen className="text-emerald-500" size={32} />,
      color: 'group-hover:border-emerald-500/50',
      link: '/studio/writing/naver', // 🌟 이동할 경로 추가
      tag: 'External'
    },
    {
      id: 'creaibox',
      title: '크레아이박스 블로그',
      description: 'Creaibox 전용 도메인 블로그에 즉시 기록하고 관리하는 전용 에디터.',
      icon: <Sparkles className="text-purple-500" size={32} />,
      color: 'group-hover:border-purple-500/50',
      link: '/studio/writing/creaibox', // 🌟 이동할 경로 추가
      tag: 'Premium'
    },
    {
      id: 'sns',
      title: 'SNS 글쓰기',
      description: '인스타그램, 스레드, 페이스북에 딱 맞는 감성적이고 파급력 있는 문구.',
      icon: <Share2 className="text-pink-500" size={32} />,
      color: 'group-hover:border-pink-500/50',
      tag: 'Social'
    },
    {
      id: 'copywriting',
      title: '카피라이팅',
      description: '광고 카피, 상세 페이지 제목 등 클릭을 부르는 전략적 마케팅 문구.',
      icon: <Target className="text-orange-500" size={32} />,
      color: 'group-hover:border-orange-500/50',
      tag: 'Marketing'
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12 pt-24 lg:pt-32 pb-48">
        
        {/* 상단 헤더 섹션 */}
        <header className="mb-16 space-y-4 text-left border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <PenTool className="text-blue-500" size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic">Creative Engine</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
            Writing <span className="text-blue-500">Studio</span>
          </h1>
          <p className="text-zinc-500 text-sm lg:text-base font-medium max-w-2xl leading-relaxed italic pl-1">
            생각을 가치로 바꾸는 가장 지능적인 방법. AI 기술을 결합하여 
            상상하는 모든 종류의 글쓰기를 전문가 수준으로 실현합니다.
          </p>
        </header>

        {/* 메인 그리드 박스 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {writingTools.map((tool) => (
            <div 
              key={tool.id}
              // 🌟 클릭 시 link가 있으면 이동하도록 설정
              onClick={() => tool.link && router.push(tool.link)}
              className={`group relative bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8 transition-all duration-500 hover:bg-zinc-900/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${tool.color} overflow-hidden cursor-pointer`}
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {tool.icon}
              </div>

              <div className="relative z-10 space-y-6 text-left">
                {/* 아이콘 박스 추가 (가독성 향상) */}
                <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800 shadow-inner w-fit">
                    {tool.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                    {tool.title}
                    <ChevronRight size={18} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* 개발 중... 플레이스홀더 박스 */}
          <div className="lg:col-span-1 border-2 border-dashed border-zinc-800/30 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-4 opacity-40 bg-black/10">
            <RefreshCw className="text-zinc-800 animate-spin" size={32} />
            <div>
              <h3 className="text-sm font-black text-zinc-700 uppercase italic tracking-widest">New Features</h3>
              <p className="text-[10px] text-zinc-800 font-bold uppercase mt-1">현재 개발 진행 중....</p>
            </div>
          </div>
        </div>

        <footer className="mt-24 text-center border-t border-zinc-900 pt-12">
            <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">
                Creaibox Studio Identity System v1.0
            </div>
        </footer>
      </div>
    </div>
  );
}