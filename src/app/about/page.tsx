"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Zap, ShieldCheck, Target, 
  ArrowRight, Terminal, Layers, Cpu 
} from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  
  // 🌟 크리에이박스가 추구하는 3대 핵심 가치 데이터
  const coreValues = [
    {
      icon: <Zap className="text-blue-500" size={24} />,
      title: "무한한 생산성 (Productivity)",
      description: "기획부터 글쓰기, 이미지, 비디오, 뮤직 생성까지 복잡한 크리에이티브 파이프라인을 단 몇 초 만에 완성하여 창작의 병목현상을 해결합니다."
    },
    {
      icon: <Cpu className="text-emerald-500" size={24} />,
      title: "최첨단 AI 인프라 (Advanced Tech)",
      description: "글로벌 최고 수준의 인공지능 모델들을 커스텀 최적화하여, 유저가 복잡한 프롬프트 엔지니어링 없이도 최고 품질의 결과물을 얻도록 지원합니다."
    },
    {
      icon: <ShieldCheck className="text-indigo-500" size={24} />,
      title: "안전한 신뢰성 (Reliability)",
      description: "크리에이박스(CreAibox)의 기술력을 바탕으로 강력한 API 보안 및 데이터 관리 생태계를 구축하여 기업과 개인 창작자 모두 안심하고 사용할 수 있는 환경을 만듭니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pt-20 overflow-hidden relative">
      <Header />
      
      {/* 🌌 배경 엣지 그라데이션 오버레이 */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 relative z-10">
        
        {/* 🚀 SECTION 1: HERO VIEW (상단 타이틀 & 슬로건) */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-white text-blue-600 text-xs font-bold tracking-widest uppercase mb-2 shadow-sm">
            <Sparkles size={12} /> Introducing CreAibox
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-slate-950">
            상상력을 현실로 만드는 <br />
            가장 똑똑한 <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI 상자</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed pt-2">
            <span className="text-slate-900 font-bold">크리에이박스(CreAibox)</span>가 선보이는 올인원 AI 콘텐츠 생성 플랫폼, 크리에이박스입니다. 우리는 번거로운 창작 프로세스를 혁신하여 모든 이들이 제약 없이 크리에이티브를 펼치는 미래를 설계합니다.
          </p>
        </div>

        {/* 💻 SECTION 2: PLATFORM IDENTITY (대형 터미널 포스 비주얼 박스) */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-28 shadow-sm relative">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1">
              <Terminal size={12} /> core-mission.sh
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                <Layers className="text-blue-600" size={20} /> 하나의 Box 안에서 끝나는 올인원 스튜디오
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                우리는 글쓰기, 이미지, 영상, 음악이 각각 파편화되어 있는 기존 AI 툴들의 불편함에 주목했습니다. 크리에이박스는 단 하나의 플랫폼 안에서 콘텐츠 기획부터 멀티미디어 제작, 트렌드 분석 리포트까지 유기적으로 연결되는 완벽한 워크플로우를 제공합니다.
              </p>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-900 font-mono text-xs md:text-sm text-blue-400/90 space-y-2 shadow-inner">
              <p><span className="text-slate-600">1</span> <span className="text-purple-400">const</span> platform = <span className="text-emerald-400">"CreAibox"</span>;</p>
              <p><span className="text-slate-600">2</span> <span className="text-purple-400">const</span> coreTech = [<span className="text-emerald-400">"Text"</span>, <span className="text-emerald-400">"Image"</span>, <span className="text-emerald-400">"Video"</span>, <span className="text-emerald-400">"Music"</span>];</p>
              <p><span className="text-slate-600">3</span> </p>
              <p><span className="text-slate-600">4</span> <span className="text-purple-400">function</span> <span className="text-yellow-400">generateCreativity</span>() &#123;</p>
              <p><span className="text-slate-600">5</span> &nbsp;&nbsp;<span className="text-purple-400">return</span> coreTech.map(tech =&gt; <span className="text-white">`Build_$&123;tech&125;_With_AI`</span>);</p>
              <p><span className="text-slate-600">6</span> &#125;</p>
              <p><span className="text-slate-600">7</span> <span className="text-slate-500">// Result: 상상이 현실이 되는 최단 거리 확정</span></p>
            </div>
          </div>
        </div>

        {/* 🏆 SECTION 3: CORE VALUES (핵심 가치 카드 섹션) */}
        <div className="space-y-12 mb-28">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 flex items-center justify-center gap-2">
              <Target className="text-blue-650" size={22} /> Our Core Values
            </h2>
            <p className="text-sm text-slate-600 font-medium">크리에이박스가 양보하지 않는 세 가지 신념입니다.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => (
              <div 
                key={idx} 
                className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-md group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-base font-black text-slate-950 mb-3 tracking-tight">
                  {value.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🏁 SECTION 4: CALL TO ACTION (하단 정주행 유도 배너) */}
        <div className="w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950">
            지금, 새로운 창작의 시대를 시작하세요
          </h2>
          <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            비즈니스 마케터, 1인 크리에이터, 블로거, 그리고 상상을 멈추지 않는 모든 이들을 위해 준비되어 있습니다. 크리에이박스의 인프라를 직접 경험해 보세요.
          </p>
          <div className="pt-4">
            <Link href="/studio/writing">
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-black rounded-xl shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2 group border-none">
                모든 창작의 시작! 글쓰기 스튜디오 입장하기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}