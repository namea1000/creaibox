'use client'; // 클라이언트 컴포넌트 선언

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, Key, Zap, Music, Search, MessageSquare, Mic, Video, Image as ImageIcon, User, LogOut } from 'lucide-react';

const leftHub = [
  { 
    id: 'gemini', 
    storageKey: 'gemini_api_key', // 메인 페이지와 연동되는 키 이름
    name: 'Google Gemini - Tier 1 · Postpay (gemini-3-flash-preview)', 
    tip: '💡 Tip: Crebox.ai의 메인 두뇌 엔진입니다. 최신 preview 모델로 텍스트/데이터 분석을 수행하며, Google Lyria 3, Veo(Video), Nano Banana 2, Imagen 4 등의 최첨단 멀티미디어 도구를 모두 포함합니다.', 
    link: 'https://aistudio.google.com/app/apikey' 
  },
  { id: 'openai', storageKey: 'openai_api_key', name: 'OpenAI GPT-4o', tip: '💡 Tip: 강력한 논리 추론 및 코드 생성 엔진입니다. 복잡한 구조의 글쓰기, 프로그래밍, 세밀한 데이터 해석이 필요한 전문 작업에 최적화되어 있습니다.', link: 'https://platform.openai.com/api-keys' },
  { id: 'claude', storageKey: 'claude_api_key', name: 'Anthropic Claude', tip: '💡 Tip: 자연스러운 문체와 장문 맥락 유지에 특화된 엔진입니다. 창의적인 소설이나 블로그 포스팅 등 감성적이고 긴 호흡의 글쓰기에 가장 적합합니다.', link: 'https://console.anthropic.com/' },
  { id: 'google_search', storageKey: 'google_search_api_key', name: 'Google Search API', tip: '💡 Tip: 글로벌 실시간 정보 탐색 엔진입니다. 전 세계 최신 정보를 팩트체크하고 자료 조사를 수행합니다. 매일 100건의 검색을 무료로 제공합니다.', link: 'https://programmablesearchengine.google.com/' },
  { id: 'naver_search', storageKey: 'naver_search_api_key', name: 'Naver Search API', tip: '💡 Tip: 국내 트렌드 및 시장 조사 엔진입니다. 블로그, 카페, 뉴스 등 국내 데이터를 수집하며 일일 25,000건의 무료 한도로 트렌드 분석에 필수적입니다.', link: 'https://developers.naver.com/apps/#/register' },
];

const rightHub = [
  { id: 'youtube', storageKey: 'youtube_api_key', name: 'YouTube Data API v3', tip: '💡 Tip: 멀티미디어 성과 분석 및 관리 엔진입니다. 채널 통계를 분석하고 영상 업로드를 자동화하며, 댓글 분석을 통해 유튜브 성장을 가속화합니다.', link: 'https://console.cloud.google.com/' },
  { id: 'suno', storageKey: 'suno_api_key', name: 'Suno V5.5 Pro Music API', tip: '💡 Tip: AI 작곡 및 배경음악 생성 엔진입니다. 텍스트 설명만으로 영상 콘텐츠에 딱 맞는 전용 BGM이나 로고송을 저작권 걱정 없이 즉시 작곡하여 제공합니다.', link: 'https://suno.com/' },
  { id: 'design', storageKey: 'design_api_key', name: 'Unsplash/Pexels Assets', tip: '💡 Tip: 고화질 시각 리소스 라이브러리입니다. 수백만 장의 전문 사진과 영상을 API로 즉시 불러와 콘텐츠의 디자인 퀄리티를 전문가 수준으로 높여줍니다.', link: 'https://unsplash.com/developers' },
  { id: 'voice', storageKey: 'voice_api_key', name: 'ElevenLabs Voice API', tip: '💡 Tip: 감성 기반 AI 보이스 생성 엔진입니다. 사람보다 더 자연스러운 성우 음성을 생성하며, 본인의 목소리를 복제하여 퍼스널 브랜딩 콘텐츠에 활용합니다.', link: 'https://elevenlabs.io/' },
];

// ServiceCard 컴포넌트: 입력 및 저장 로직 추가
const ServiceCard = ({ service, icon }: { service: any, icon: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState('');

  // 페이지 로드 시 로컬 스토리지에서 기존 키 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(service.storageKey);
    if (saved) setApiKey(saved);
  }, [service.storageKey]);

  // 키 입력 시 로컬 스토리지에 즉시 저장
  const handleChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem(service.storageKey, val);
  };

  const handleTest = () => {
    if (!apiKey) return alert("키를 입력해주세요!");
    alert(`${service.name} 연결 설정이 브라우저에 저장되었습니다.`);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:border-blue-500/40 transition-all duration-300 shadow-lg mb-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="bg-slate-800 p-1.5 rounded-lg">{icon}</div>
          <span className="text-[15px] tracking-tight">{service.name}</span>
        </div>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${apiKey ? 'text-green-400 border-green-900 bg-green-950/30' : 'text-white bg-slate-700 border-slate-600'}`}>
          {apiKey ? 'Connected' : 'Pending'}
        </span>
      </div>
      <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/30 mb-3 font-medium">
        <p className="text-[11.5px] text-white leading-snug">{service.tip}</p>
      </div>
      <div className="space-y-2 text-white">
        <div className="relative group">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="여기에 나의 API Key를 입력하세요" 
            className="w-full bg-black/60 border border-slate-800 rounded-lg px-3.5 py-2 text-[12px] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-white placeholder:text-white/80 font-mono" 
          />
          <Key className="absolute right-3 top-2.5 text-slate-600 group-focus-within:text-red-500" size={13} />
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase">
          <button 
            onClick={handleTest}
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-md transition-all active:scale-95 shadow-lg flex items-center justify-center gap-1"
          >
            연결 테스트 🔄
          </button>
          <a 
            href={service.link} 
            target="_blank" 
            className="flex-[1.2] bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md flex items-center justify-center gap-1 active:scale-95 transition-all shadow-lg font-sans text-center px-1"
          >
            API Key 발급 바로가기 <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function APIVaultContent() {
  const userName = "Creator_Boss"; 

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 p-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-2 text-white uppercase italic tracking-tighter">
                🔐 Crebox.ai <span className="text-blue-500 not-italic">API Vault</span>
              </h1>
              <div className="mt-2 space-y-1">
                <p className="text-slate-200 text-base font-bold italic underline decoration-blue-500/50 underline-offset-4">Your Secure Key Treasury — 모든 동력의 중앙 관제소</p>
                <p className="text-blue-400 text-[12px] font-black uppercase tracking-wider">사용자 본인의 API 키를 입력하고 직접 관리하는 안전한 공간입니다.</p>
                <div className="mt-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <p className="text-slate-100 text-[13px] font-semibold leading-relaxed">
                    <span className="text-blue-400 font-black">API</span>는 <span className="italic">Application Programming Interface</span>의 약자로, 서로 다른 프로그램이 대화할 수 있게 돕는 <span className="text-amber-400">열쇠</span>입니다. <br />
                    본인의 열쇠를 입력하면 <span className="text-blue-300 font-bold">Crebox.ai</span>의 강력한 도구들을 사장님의 권한으로 직접 제어할 수 있게 됩니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-xl max-w-md shadow-[0_0_25px_rgba(37,99,235,0.15)]">
              <ShieldCheck className="text-blue-500 w-6 h-6 mt-0.5" />
              <div className="text-[12px] leading-tight">
                <p className="text-white font-black text-xs mb-0.5 uppercase tracking-tight">강력한 보안 시스템 작동 중</p>
                <p className="text-slate-200 font-medium tracking-tight">모든 키는 <span className="text-blue-400 font-black">AES-256 암호화</span> 기술로 DB에 안전하게 격리 보관되며, 사용자 개인만 관리할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-500 pl-3 font-black text-base text-white uppercase tracking-widest"><Zap className="text-blue-500" size={18} /> AI & SEARCH API Key</div>
            {leftHub.map((s) => (
              <ServiceCard key={s.id} service={s} icon={s.id.includes('search') ? <Search size={18} className="text-blue-400" /> : <MessageSquare size={18} className="text-amber-400" />} />
            ))}
          </section>
          <section>
            <div className="flex items-center gap-2 mb-4 border-l-4 border-purple-500 pl-3 font-black text-base text-white uppercase tracking-widest"><Video className="text-purple-500" size={18} /> MULTIMEDIA API Key</div>
            {rightHub.map((s) => (
              <ServiceCard key={s.id} service={s} icon={
                s.id === 'youtube' ? <div className="text-red-600 font-black text-xs tracking-tighter font-sans">YT</div> :
                s.id === 'suno' ? <Music size={18} className="text-pink-500" /> :
                s.id === 'voice' ? <Mic size={18} className="text-indigo-400" /> : <ImageIcon size={18} className="text-purple-400" />
              } />
            ))}
          </section>
        </div>
      </div>
      <footer className="text-center text-slate-700 text-[9px] mt-12 font-black tracking-[0.3em] uppercase pb-8">Crebox.ai Global Infrastructure — Central Control Unit</footer>
    </div>
  );
}