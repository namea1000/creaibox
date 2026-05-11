
import React from 'react';
import Link from 'next/link';
import { Sparkles, Key, LayoutDashboard } from 'lucide-react'; // 아이콘 추가로 직관성 업

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-10 text-center">
        {/* 로고 및 인사 */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-2">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase">
            Welcome to CreAibox
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed">
            환영합니다, 사장님! <br /> 
            AI와 함께 당신의 아이디어를 자산으로 만드는 <br />
            특별한 여정을 시작합니다.
          </p>
        </div>

        {/* 메인 액션 카드 */}
        <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-zinc-800 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            {/* 🌟 우선순위 1: API 설정 (연동이 되어야 기능을 쓰니까요!) */}
            <Link href="/apivault" className="block">
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20">
                <Key size={20} /> AI 엔진 설정하기 (API 등록)
              </button>
            </Link>
            
            {/* 🌟 우선순위 2: 글 생성기로 바로 가기 */}
            <Link href="/" className="block">
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-zinc-700">
                <Sparkles size={20} /> 무작정 글 쓰러 가기
              </button>
            </Link>

             {/* 🌟 우선순위 3: 관리자라면? (사장님 전용) */}
             <Link href="/adm/usermanagement" className="block">
              <button className="w-full bg-transparent hover:bg-red-500/10 text-zinc-500 hover:text-red-500 font-bold py-3 rounded-2xl transition-all text-xs uppercase tracking-widest">
                Admin Console
              </button>
            </Link>
          </div>
        </div>

        <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.2em] animate-pulse">
          Your Intelligent Asset Creation Partner
        </p>
      </div>
    </div>
  );
}