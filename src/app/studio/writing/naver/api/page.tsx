"use client";

import React, { useState } from 'react';
import { 
  Sparkles, BarChart3, HelpCircle, FileText, ShieldAlert, 
  CheckCircle2, AlertCircle, LayoutGrid, Cpu, AlignLeft, 
  Settings2, Key, Server, Database, RefreshCw, Check, Copy, Sliders, Save
} from 'lucide-react';

// 세팅 카테고리 규격
interface SettingCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
}

export default function EngineConfigPage() {
  const [activeTab, setActiveTab] = useState("naver-session");
  const [isSaving, setIsSaving] = useState(false);

  // 🌟 폼 상태 관리 (시뮬레이션용 가상 스토리지)
  const [naverId, setNaverId] = useState("creaibox_master");
  const [proxyRegion, setProxyRegion] = useState("kr-seoul");
  const [aiModel, setAiModel] = useState("gpt-4o-mini");

  // 🌟 1면 (좌측): 최적화 세팅 카테고리 디렉토리 디스크립터
  const categories: SettingCategory[] = [
    { id: 'naver-session', title: '네이버 세션 연동', subtitle: '스마트에디터 API 및 쿠키 주입', icon: Key },
    { id: 'proxy-node', title: '프록시 라우팅 인프라', subtitle: '회전형 IP 터널링 우회 가속화', icon: Server },
    { id: 'ai-engine', title: 'LLM 코어 모델 커스텀', subtitle: '초안 집필 인공지능 정밀 조율', icon: Cpu },
    { id: 'storage-sync', title: 'Supabase 미디어 스토리지', subtitle: '사진 블록 업로드 오브젝트 버킷', icon: Database },
  ];

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("CreAibox 인프라 코어 세팅 데이터가 암호화 저장 및 동기화 완료되었습니다!");
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      
      {/* 5칸 와이드 통합 관제 격자망 */}
      <div className="max-w-[1700px] mx-auto px-4 py-4 h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
        
        {/* 1면 (좌측 1칸): 세팅 카테고리 내비게이터 */}
        <div className="lg:col-span-1 flex flex-col gap-3 h-full overflow-hidden border-r border-zinc-800/30 pr-1">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 shrink-0">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-1.5 mb-1">
              <Settings2 size={12} className="text-blue-400" /> Config Engine
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              하드웨어 파이프라인 범주를 선택하여 플랫폼 핵심 연동 세션을 실시간으로 통제합니다.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {categories.map((c) => {
              const IconComponent = c.icon;
              return (
                <div 
                  key={c.id} 
                  onClick={() => setActiveTab(c.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex gap-3 items-start ${
                    activeTab === c.id 
                      ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-blue-500/40 shadow-lg' 
                      : 'bg-zinc-900/10 border-zinc-800/50 hover:bg-zinc-900/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${activeTab === c.id ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                    <IconComponent size={15} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className={`text-xs font-black truncate ${activeTab === c.id ? 'text-blue-400' : 'text-zinc-200'}`}>{c.title}</span>
                    <span className="text-[10px] text-zinc-500 font-bold truncate">{c.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💻 2면 (중앙 2칸 차지): 실시간 인프라 설정 폼 영역 */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/40 border border-blue-500/10 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
          
          <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-black text-zinc-300">
              <Sliders size={14} className="text-blue-400" /> Infrastructure Integration Dashboard
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">SYS: CORES-LOADED</span>
          </div>

          <div className="flex-1 p-6 flex flex-col space-y-6 overflow-y-auto custom-scrollbar bg-zinc-950/20">
            
            {/* 상단 타겟 안내판 */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3 shadow-lg relative overflow-hidden">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400 animate-pulse" /> 테크니컬 최적화 파라미터 제어
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                네이버 상위 노출 및 블로그 스마트블록 발행 우회를 위한 기계실 설정 패널입니다. 해당 값이 비정상적일 경우 크롤링 봇 및 글쓰기 엔진 호스팅이 일시 제동될 수 있습니다.
              </p>
            </div>

            {/* 조건부 입력 양식 폼 */}
            <div className="space-y-4 text-xs">
              {activeTab === 'naver-session' && (
                <div className="space-y-3 p-4 rounded-xl border border-zinc-850 bg-zinc-950/30">
                  <h4 className="text-xs font-black text-white">Naver Account Session Injection</h4>
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 font-bold">1. 자동 발행용 연동 계정 ID</label>
                    <input type="text" value={naverId} onChange={(e)=>setNaverId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-medium focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-zinc-400 font-bold">2. 스마트에디터 ONE 우회 쿠키 세션 (NID_SES)</label>
                    <input type="password" value="****************************************" disabled className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-600 font-medium focus:outline-none cursor-not-allowed" />
                  </div>
                </div>
              )}

              {activeTab === 'proxy-node' && (
                <div className="space-y-3 p-4 rounded-xl border border-zinc-850 bg-zinc-950/30">
                  <h4 className="text-xs font-black text-white">Residential Proxy Routing Node</h4>
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 font-bold">1. 프록시 우회 게이트웨이 리전</label>
                    <select value={proxyRegion} onChange={(e)=>setProxyRegion(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none">
                      <option value="kr-seoul">South Korea (Seoul Node - 최적 속도)</option>
                      <option value="us-west">United States (West Node - 우회 특화)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'ai-engine' && (
                <div className="space-y-3 p-4 rounded-xl border border-zinc-850 bg-zinc-950/30">
                  <h4 className="text-xs font-black text-white">LLM Core Model Engine Configuration</h4>
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 font-bold">1. 메인 AI 초안 작성 모델</label>
                    <select value={aiModel} onChange={(e)=>setAiModel(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-bold focus:outline-none">
                      <option value="gpt-4o-mini">CreAibox Turbo (Fast & Cheap)</option>
                      <option value="gpt-4o">CreAibox Deep-Thinking Pro (High Quality)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'storage-sync' && (
                <div className="space-y-3 p-4 rounded-xl border border-zinc-850 bg-zinc-950/30">
                  <h4 className="text-xs font-black text-white">Supabase Media Storage Cloud Buckets</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">본문에 첨부되는 모든 이미지 파일 및 멀티미디어 블록은 암호화 토큰 처리되어 Supabase S3 독립 버킷에 실시간 안전 호스팅 적재됩니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 저장 단추 포함 푸터 */}
          <div className="h-16 border-t border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 백엔드 파이프라인 하드웨어 원격 연동 상태 대기 중
            </span>
            <button onClick={handleSaveSettings} disabled={isSaving} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
              {isSaving ? <><RefreshCw size={13} className="animate-spin" /> 세팅 암호화 보관 중...</> : <><Save size={13} /> 변경 세팅 최종 저장</>}
            </button>
          </div>
        </div>

        {/* 👉 3면 (우측 2칸 병합): 🌟 플랫폼 최상위 기계실 맞춤형 리소스 스크랩 5단 관제탑 타워 */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
          
          {/* 1단 (최상단): AI Model Framework Cache (기존 유사도 레이어 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
              <Server size={14} /> AI Model Framework Cache
            </h3>
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
              <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-emerald-400">99.8%</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">인공지능 토큰 캐싱 효율화</h4>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">반복 원고 집필 시 버려지는 API 리소스 비용 소모 최적화 밸런스</p>
              </div>
            </div>
          </div>

          {/* 2단: Tech SEO Standard Patch (기존 워드프레스 레이어 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
                <FileText size={13} /> Tech SEO Standard Patch
              </h3>
              <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">
                CORE: LATEST
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2"><Check size={14} className="text-blue-400" /> 워드프레스/네이버 블로그 메타 구조 패치 동기화</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          {/* 3단: High-Speed Proxy Tunneling Network (기존 아뷰징 레이어 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
              <ShieldAlert size={13} /> High-Speed Proxy Tunneling Network
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">회전형 백엔드 프록시 풀</span>
                <span className="text-xs font-black text-emerald-400">14,250 IPs LOADED</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">평균 게이트웨이 레이턴시</span>
                <span className="text-xs font-black text-emerald-400">42ms (VERY FAST)</span>
              </div>
            </div>
          </div>

          {/* 4단: Mecab-Live Parser Cloud Pool (기존 형태소 레이어 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
              <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" /> Mecab-Live Parser Cloud Pool
              </h3>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">NODE: SLEEPING</span>
            </div>
            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed font-medium">
              <p>📍 스마트블록 핵심 구문 분석 가동 세션: <strong className="text-zinc-500">원고 집필 시 오토 트리거링</strong></p>
              <p>📍 한글 형태소 사물 데이터베이스 팩: <strong className="text-emerald-400">최신 딥러닝 트렌드 셋 동기화</strong></p>
            </div>
          </div>

          {/* 5단 (최하단): Core Hardware Load Inspector (기존 크롤러 스코어 레이어 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
              <BarChart3 size={13} /> Core Hardware Load Inspector
            </h3>
            <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
              <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
                100%
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">플랫폼 백엔드 하드웨어 무결성</h4>
                <p className="text-[10px] text-zinc-500 font-medium">실시간 데이터베이스 및 API 터널링 통신 로드율</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle size={12} className="text-blue-500" /> 기계실 원격 관제 로그 피드</div>
              <p className="text-zinc-400 font-medium">✅ 인프라 정상: 현재 네이버 계정 세션 차단 방어막 및 가상 헤드리스 프록시 게이트웨이 파이프라인이 100% 최적 청정 상태로 가동 중입니다. 상위 노출 집필 준비 완료.</p>
            </div>
          </div>

          {/* 하단 풋 노트 */}
          <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 text-[10px] text-zinc-500 font-medium leading-relaxed shadow-inner">
            <span className="text-zinc-400 font-black tracking-wider block mb-1">ENGINE INFRA INSIGHT</span>
            최적화 세팅 변경 시 암호화 샤(SHA-256) 프로토콜을 거쳐 백엔드 인프라 노드에 안전 격리 보관 처리됩니다.
          </div>

        </div>

      </div>
    </div>
  );
}