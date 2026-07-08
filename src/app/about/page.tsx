"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Zap, ShieldCheck, Target, 
  ArrowRight, Terminal, Layers, Cpu,
  PenTool, Image as ImageIcon, Music, Video,
  Search, CheckCircle2, Award, Clock, DollarSign
} from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  
  // 🌟 4대 핵심 AI 스튜디오 정의
  const studios = [
    {
      icon: <PenTool className="text-violet-500" size={28} />,
      name: "AI Writing Studio",
      title: "글쓰기 스튜디오",
      desc: "네이버 블로그, 워드프레스, 티스토리 등 다채로운 플랫폼별 최적화된 콘텐츠 초안을 순식간에 작성합니다.",
      features: [
        "네이버 스마트에디터 최적화 노출 포맷 지원",
        "워드프레스 원클릭 자동 배포 API 연동",
        "SEO 키워드 밀도 및 검색 노출도 분석 엔진 탑재",
        "소셜 미디어 광고 카피 및 뉴스레터 초안 빌더",
      ],
      badge: "인기 스튜디오"
    },
    {
      icon: <ImageIcon className="text-blue-500" size={28} />,
      name: "AI Image Studio",
      title: "이미지 스튜디오",
      desc: "디자이너 없이도 고품질 콘텐츠 썸네일과 마케팅 에셋을 완벽하게 렌더링하고 편집합니다.",
      features: [
        "원클릭 배경 제거 (Background Remover) 기능",
        "AI 고해상도 이미지 업스케일러 (Upscaler)",
        "프롬프트 기반 썸네일 전용 이미지 자동 생성",
        "블로그/SNS 맞춤형 자유비율 이미지 리사이저",
      ],
      badge: "에디터 탑재"
    },
    {
      icon: <Music className="text-emerald-500" size={28} />,
      name: "AI Music Studio",
      title: "뮤직 스튜디오",
      desc: "상업적 저작권 걱정이 없는 독창적인 테마 음악과 가사를 자동 생성하여 콘텐츠 완성도를 극대화합니다.",
      features: [
        "분위기 및 장르별 맞춤형 백그라운드 음원 작곡",
        "고품질 작사 제안 및 운율 맞춤형 작사 빌더",
        "생성 오디오 음원 무제한 저장 및 고품질 다운로드",
        "개인 앨범 기획 및 크리에이티브 오디오 트랙 관리",
      ],
      badge: "창작 특화"
    },
    {
      icon: <Video className="text-rose-500" size={28} />,
      name: "AI Video & Trend",
      title: "영상 및 트렌드 스튜디오",
      desc: "실시간 유튜브 및 키워드 트렌드를 신속하게 추적하고, 동영상 요약과 매력적인 영상 기획안을 빌드합니다.",
      features: [
        "실시간 유튜브 키워드 트렌드 진단 및 검색어 분석",
        "유튜브 동영상 URL 입력 시 핵심 타임라인 및 요약 추출",
        "쇼츠/롱폼 맞춤형 시나리오 대본 구성안 작성",
        "채널 노출 강화를 위한 SEO 메타 타이틀 매핑",
      ],
      badge: "분석형 AI"
    }
  ];

  // 🔄 올인원 창작 프로세스 타임라인 데이터
  const workflowSteps = [
    {
      step: "01",
      title: "아이디어 기획 (Idea Hub)",
      desc: "실시간 키워드 트렌드 검색 엔진을 활용해 대중이 가장 많이 찾는 인기 키워드와 글감을 즉시 발굴합니다."
    },
    {
      step: "02",
      title: "멀티미디어 제작 (AI Studio)",
      desc: "글쓰기 스튜디오에서 초안을 적고, 이미지/뮤직 스튜디오에서 썸네일과 배경 음원을 순식간에 조합합니다."
    },
    {
      step: "03",
      title: "SEO 진단 및 발행 (Publish)",
      desc: "검색 노출도를 검진하고 연동된 네이버나 워드프레스 채널에 원클릭으로 직접 글을 배포합니다."
    }
  ];

  // 🏆 크리에이박스만의 차별화된 강점 데이터
  const strengths = [
    {
      icon: <Award className="text-amber-500" size={24} />,
      title: "국내 포털 최적화 SEO",
      desc: "해외 툴들과 달리 네이버, 구글의 국내 검색 알고리즘과 트렌드 데이터를 긴밀히 반영하여 노출 가능성을 극대화합니다."
    },
    {
      icon: <Clock className="text-sky-500" size={24} />,
      title: "창작 속도 10배 단축",
      desc: "글감 기획, 원고 작성, 어울리는 이미지 서치에 쏟던 하루 온종일의 시간을 단 10분 내외로 압축해 줍니다."
    },
    {
      icon: <DollarSign className="text-emerald-500" size={24} />,
      title: "비용 최적화 솔루션",
      desc: "글쓰기, 배경제거, 작곡 툴을 따로 결제할 필요 없이 크리에이박스 단 하나로 올인원 해결이 가능합니다."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 relative z-10">
        
        {/* 🚀 SECTION 1: HERO VIEW (상단 타이틀 & 브랜드 아이덴티티) */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-2 shadow-sm">
            <Sparkles size={12} /> Introducing CreAibox
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-slate-955 dark:text-white">
            상상력을 현실로 만드는 <br />
            가장 똑똑한 <span className="text-violet-600 dark:text-violet-400">AI 콘텐츠 상자</span>
          </h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed pt-2 max-w-3xl mx-auto break-keep">
            <span className="text-slate-900 dark:text-slate-200 font-black">크리에이박스(CreAibox)</span>는 파편화된 창작 프로세스를 하나로 묶어낸 대한민국 대표 **올인원 멀티미디어 생성 및 분석 플랫폼**입니다. 번거롭던 크리에이티브 파이프라인을 단 하나의 Box 안에서 완벽하게 연결해 줍니다.
          </p>
        </div>

        {/* 💻 SECTION 2: CORE VALUE PROPOSITION (대형 비주얼 보드) */}
        <div className="w-full rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 p-6 md:p-10 mb-28 shadow-sm relative">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1">
              <Terminal size={12} /> what-is-creaibox.sh
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <Target size={14} /> 우리의 핵심 지향점
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-snug">
                아이디어 발굴부터 원클릭 배포까지, 하나의 흐름으로 완성합니다
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium break-keep">
                기존에는 글을 쓰려면 ChatGPT를, 이미지를 찾으려면 Midjourney를, 음악을 만들려면 또 다른 오디오 AI 툴을 전전해야 했습니다. <span className="font-black text-slate-900 dark:text-slate-200">CreAibox</span>는 이러한 번거로운 전환 과정을 제거하고, 한 대시보드 안에서 텍스트·이미지·오디오 제작 및 채널 배포까지 물 흐르듯 가동되는 일체형 경험을 제공합니다.
              </p>
            </div>
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 font-mono text-xs md:text-sm text-blue-400/90 space-y-3 shadow-inner leading-relaxed">
              <p><span className="text-slate-600">1</span> <span className="text-purple-400">const</span> service = <span className="text-emerald-400">"creaibox.com"</span>;</p>
              <p><span className="text-slate-600">2</span> <span className="text-purple-400">const</span> capabilities = &#123;</p>
              <p><span className="text-slate-600">3</span> &nbsp;&nbsp;writing: <span className="text-yellow-400">true</span>,</p>
              <p><span className="text-slate-600">4</span> &nbsp;&nbsp;imageStudio: <span className="text-yellow-400">true</span>,</p>
              <p><span className="text-slate-600">5</span> &nbsp;&nbsp;musicStudio: <span className="text-yellow-400">true</span>,</p>
              <p><span className="text-slate-600">6</span> &nbsp;&nbsp;trendAnalyzer: <span className="text-yellow-400">true</span></p>
              <p><span className="text-slate-600">7</span> &#125;;</p>
              <p><span className="text-slate-600">8</span> </p>
              <p><span className="text-slate-600">9</span> <span className="text-purple-400">if</span> (user.wantsAllInOne) &#123;</p>
              <p><span className="text-slate-600">10</span> &nbsp;&nbsp;console.<span className="text-blue-300">log</span>(<span className="text-emerald-400">"Welcome to CreAibox!"</span>);</p>
              <p><span className="text-slate-600">11</span> &#125;</p>
            </div>
          </div>
        </div>

        {/* 🛠 SECTION 3: THE 4 AI STUDIOS (각 스튜디오 대폭 상세 소개) */}
        <div className="space-y-16 mb-28">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-black">
              <Layers size={14} /> Four Pillars
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-955 dark:text-white">
              크리에이박스 4대 AI 스튜디오
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto break-keep">
              창작 영역의 장벽을 완전히 허물기 위해 준비된 고성능 AI 특화 워크스페이스입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studios.map((studio, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-[28px] border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/20 hover:border-violet-300 dark:hover:border-violet-900 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                      {studio.icon}
                    </div>
                    <span className="rounded-full bg-violet-50 dark:bg-violet-950/60 px-3 py-1 text-xs font-black text-violet-700 dark:text-violet-400">
                      {studio.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                    {studio.name}
                  </h3>
                  <h4 className="text-xl md:text-2xl font-black text-slate-955 dark:text-white mt-1 mb-4">
                    {studio.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 break-keep">
                    {studio.desc}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                  <ul className="space-y-2.5">
                    {studio.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={15} className="text-violet-650 shrink-0 mt-0.5" />
                        <span className="break-keep">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔄 SECTION 4: WORKFLOW TIMELINE (창작 워크플로우 소개) */}
        <div className="w-full rounded-[28px] border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/10 p-8 md:p-12 mb-28 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black">
              <Clock size={14} /> Workflow
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-955 dark:text-white">
              CreAibox가 제안하는 단 하나의 워크플로우
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium break-keep">
              발굴부터 배포까지, 단 몇 번의 조작으로 물 흐르듯 가동되는 통합 크리에이티브 파이프라인을 경험해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="relative space-y-4 p-4 rounded-xl">
                <span className="text-5xl font-black text-violet-200 dark:text-violet-900/40 font-mono block">
                  {step.step}
                </span>
                <h4 className="text-lg font-black text-slate-955 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium break-keep">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 SECTION 5: WHY CREAIBOX? (크리에이박스만의 독보적 강점) */}
        <div className="space-y-12 mb-28">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-955 dark:text-white flex items-center justify-center gap-2">
              <Award className="text-violet-650" size={24} /> Why CreAibox?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">우리가 제공하는 독보적인 실용적 강점들입니다.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {strengths.map((value, idx) => (
              <div 
                key={idx} 
                className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/30 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-900 group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-base font-black text-slate-955 dark:text-white mb-3 tracking-tight">
                  {value.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium break-keep">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🏁 SECTION 6: CALL TO ACTION (하단 정주행 유도 배너) */}
        <div className="w-full rounded-[28px] border border-violet-100 dark:border-violet-950 bg-violet-50 dark:bg-violet-900/10 p-8 md:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-955 dark:text-white">
            지금, AI 콘텐츠 제작의 한계를 넓혀보세요
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed break-keep">
            블로거, 유튜브 마케터, 음원 제작자, 그리고 브랜드를 운영하는 비즈니스 담당자까지. 크리에이박스가 제시하는 완벽한 올인원 인프라를 직접 누려 보세요.
          </p>
          <div className="pt-4">
            <Link href="/studio/writing">
              <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2 group border-none cursor-pointer">
                모든 창작의 시작! 스튜디오 바로가기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}