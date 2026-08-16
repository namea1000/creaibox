"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Store, Settings, Plus, ShieldCheck, Zap, Sparkles, LayoutTemplate } from "lucide-react";

export default function CustomClientSiteHomePage() {
  const router = useRouter();
  const [migrationUrl, setMigrationUrl] = useState("");

  const handleMigrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (migrationUrl.trim()) {
      // TODO: URL을 이관 페이지로 전달하는 로직 추가 가능
      router.push(`/studio/custom-client-site/migration`);
    } else {
      router.push(`/studio/custom-client-site/migration`);
    }
  };

  const subMenus = [
    {
      title: "템플릿 쇼핑 & 1초 구축",
      desc: "다양한 프리미엄 템플릿을 구경하고 내 서브도메인에 즉시 배포하세요.",
      icon: <Store className="text-pink-400" size={24} />,
      link: "/studio/custom-client-site/marketplace",
      color: "from-pink-500/20 to-rose-500/5",
      border: "border-pink-500/20"
    },
    {
      title: "기존 홈페이지 이관",
      desc: "타사 솔루션으로 만든 사이트의 URL을 입력해 AI 엔진으로 구조와 텍스트를 자동 이관하세요.",
      icon: <Globe className="text-blue-400" size={24} />,
      link: "/studio/custom-client-site/migration",
      color: "from-blue-500/20 to-cyan-500/5",
      border: "border-blue-500/20"
    },
    {
      title: "내 커스텀 사이트 관리",
      desc: "내가 구축한 서브도메인의 기본 정보를 실시간으로 수정하고 배포하세요.",
      icon: <Settings className="text-emerald-400" size={24} />,
      link: "/studio/client-site-builder",
      color: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/20"
    },
    {
      title: "AI 커스텀 신규 제작 신청",
      desc: "원하시는 디자인 템플릿이 없으신가요? 맞춤형 커스텀 디자인을 신청해 보세요.",
      icon: <Plus className="text-purple-400" size={24} />,
      link: "/studio/custom-client-site/request",
      color: "from-purple-500/20 to-fuchsia-500/5",
      border: "border-purple-500/20"
    },
    {
      title: "관리자: 커스텀 신청 현황",
      desc: "고객들이 신청한 커스텀 디자인 요청 내역을 확인하고 상태를 변경합니다.",
      icon: <ShieldCheck className="text-amber-400" size={24} />,
      link: "/studio/custom-client-site/admin-dashboard",
      color: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-6 lg:p-10 space-y-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d0f14] to-blue-950/30 border border-slate-800 p-10 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-600/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 text-sm font-bold text-blue-400 backdrop-blur-md">
              <Sparkles size={16} className="animate-pulse" />
              <span>CreaiBox AI 웹사이트 빌더</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
              웹사이트 리디자인,<br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                처음부터 다시 만들<br className="hidden md:block"/> 필요 없습니다.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
              CreaiBox는 기존 사이트 주소, 소셜 프로필, 텍스트 문서 등을 원천 자료로 활용하여 <strong className="text-slate-200">단 즉시 최신 트렌드의 커스텀 웹사이트를 완벽하게 복제 및 구축</strong>해 주는 AI 엔진입니다.
            </p>
            
            <form onSubmit={handleMigrationSubmit} className="max-w-md relative mt-4">
              <input
                type="text"
                value={migrationUrl}
                onChange={(e) => setMigrationUrl(e.target.value)}
                placeholder="이관할 웹사이트 URL을 입력하세요"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 py-4 pl-5 pr-14 text-sm font-semibold text-slate-100 placeholder:text-slate-500 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 text-white shadow-md hover:brightness-110 transition-all"
              >
                <ArrowRight size={20} />
              </button>
              <div className="mt-4">
                <a href="/studio/custom-client-site/marketplace" className="text-sm font-medium text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
                  아직 웹사이트가 없으신가요? 템플릿으로 시작하기 <ArrowRight size={14} />
                </a>
              </div>
            </form>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
             <div className="w-full aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="h-8 border-b border-slate-800 flex items-center gap-2 px-2 relative z-10">
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                   <div className="w-3 h-3 rounded-full bg-slate-700" />
                   <div className="ml-4 h-4 w-32 bg-slate-800 rounded-md" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg">
                        <Globe className="text-slate-500" size={28} />
                     </div>
                     <ArrowRight className="text-blue-500 animate-pulse" size={24} />
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <LayoutTemplate className="text-white" size={28} />
                     </div>
                   </div>
                   <div className="text-center space-y-1">
                     <p className="text-sm font-bold text-slate-200">AI 딥 마이그레이션</p>
                     <p className="text-xs text-slate-500">구식 웹사이트를 최신 Tailwind 레이아웃으로 변환</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5 Sub-Menus Section */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">AI 웹사이트 빌더 스튜디오 메뉴</h2>
          <span className="text-sm text-slate-400 font-medium">원하시는 작업을 선택해 주세요</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subMenus.map((menu, idx) => (
            <a 
              key={idx} 
              href={menu.link}
              className={`group relative overflow-hidden rounded-2xl bg-slate-900 border ${menu.border} p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50 flex flex-col h-full`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${menu.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex-1 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {menu.icon}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{menu.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {menu.desc}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 mt-6 flex items-center text-sm font-bold text-slate-500 group-hover:text-white transition-colors">
                바로가기 <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Feature Showcase: Any Platform */}
      <section className="max-w-6xl mx-auto py-12">
         <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400">
                <Zap size={14} />
                <span>플랫폼 독립적 이관</span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">
                어디서 만들었든 상관없습니다.<br/>
                <span className="text-slate-400">CreaiBox가 다 가져옵니다.</span>
              </h2>
              <p className="text-slate-400 font-medium">
                Wix, WordPress, 아임웹, 카페24 등 기존에 사용하시던 플랫폼이 무엇이든 공개된 웹사이트 URL만 있다면 CreaiBox AI가 콘텐츠와 구조를 분석하여 즉시 새롭게 구축해 드립니다.
              </p>
              <div className="pt-4">
                <a href="/studio/custom-client-site/migration" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-3 text-sm font-bold text-white transition-colors border border-slate-700">
                  지금 바로 이관해 보기
                </a>
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                 <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl" />
                 <div className="relative h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center z-20 border border-purple-400/30">
                       <Sparkles className="text-white" size={40} />
                    </div>
                    
                    {/* Floating icons representing other platforms */}
                    <div className="absolute top-10 left-10 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-xl text-slate-300 border border-slate-700 shadow-lg animate-bounce" style={{animationDuration: '3s'}}>
                      W
                    </div>
                    <div className="absolute bottom-20 left-4 w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center font-black text-sm text-slate-300 border border-slate-700 shadow-lg animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                      Wix
                    </div>
                    <div className="absolute top-20 right-8 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-lg text-slate-300 border border-slate-700 shadow-lg animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
                      IM
                    </div>
                    <div className="absolute bottom-10 right-16 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-sm text-slate-300 border border-slate-700 shadow-lg animate-bounce" style={{animationDuration: '2.5s', animationDelay: '1.5s'}}>
                      C24
                    </div>
                    
                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full z-10 opacity-20 pointer-events-none">
                       <path d="M 80 80 Q 150 100 180 180" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" className="text-purple-400" />
                       <path d="M 60 260 Q 120 250 180 210" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" className="text-purple-400" />
                       <path d="M 320 100 Q 250 150 210 180" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" className="text-purple-400" />
                       <path d="M 280 300 Q 230 250 200 210" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" className="text-purple-400" />
                    </svg>
                 </div>
              </div>
            </div>
         </div>
      </section>

    </div>
  );
}
