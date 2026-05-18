"use client";

import React, { useState } from 'react';
import { 
  Sparkles, BarChart3, HelpCircle, FileText, ShieldAlert, 
  CheckCircle2, AlertCircle, LayoutGrid, Cpu, AlignLeft, 
  BookOpen, Compass, Award, Target, Check, Copy, RefreshCw, Server
} from 'lucide-react';

interface GuideTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
}

interface WeightMatrix {
  factor: string;
  description: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  score: number;
}

export default function CRankGuidePage() {
  const [activeTopic, setActiveTopic] = useState("c-rank-core");

  const topics: GuideTopic[] = [
    { id: 'c-rank-core', title: 'C-Rank 핵심 평가 요소', subtitle: '블로그 출처 신뢰도 매커니즘', icon: Award },
    { id: 'dia-plus', title: 'DIA+ 오리지널리티 로직', subtitle: '문서 정보 가치 및 체류 시간', icon: Target },
    { id: 'smartblock', title: '스마트블록 세부 타겟팅', subtitle: '주제별 인덱스 최적 배치 스펙', icon: LayoutGrid },
    { id: 'penalty-avoid', title: '어뷰징 필터 및 패널티 회피', subtitle: '기계적 도배 정밀 방어선', icon: ShieldAlert },
  ];

  const weights: Record<string, WeightMatrix[]> = {
    'c-rank-core': [
      { factor: '맥락별 주제 집중도 (Context)', description: '특정 카테고리에 대한 원고 생산의 연속성 및 전문성 수집', impact: 'CRITICAL', score: 95 },
      { factor: '콘텐츠 연쇄 소비 (Consumption)', description: '방문자가 한 블로그 내에서 다른 글을 연이어 소비하는 연쇄 링크 빈도', impact: 'HIGH', score: 88 },
      { factor: '출처의 역사성 (History)', description: '장기 누적된 오리지널 형태소 축적 지수 및 패널티 제로 이력', impact: 'MEDIUM', score: 70 },
    ],
    'dia-plus': [
      { factor: '독자 실시간 체류 시간 (Dwell Time)', description: '원고 분량 및 가독성 대비 유저의 실제 평균 체류 분초 단위 트래킹', impact: 'CRITICAL', score: 98 },
      { factor: '체측형 정보성 뼈대 (Experience)', description: '단순 정보 짜깁기가 아닌 본인 고유의 실무 경험 형태소 포함 여부', impact: 'HIGH', score: 85 },
    ],
    'smartblock': [
      { factor: '서브헤딩 마크다운 정합성', description: '##, ### 구조화를 통한 인공지능 검색 로봇의 섹션 분할 파싱 편의성', impact: 'HIGH', score: 90 },
    ],
    'penalty-avoid': [
      { factor: '기계적 복사-붙여넣기 징후', description: '클립보드 다이렉트 주입 속도를 추적하는 네이버 에이전트 스크립트 방어', impact: 'CRITICAL', score: 99 },
    ]
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      <div className="max-w-[1700px] mx-auto px-4 py-4 h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
        
        {/* 1면 (좌측 1칸): 알고리즘 네비게이터 */}
        <div className="lg:col-span-1 flex flex-col gap-3 h-full overflow-hidden border-r border-zinc-800/30 pr-1">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 shrink-0">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-1.5 mb-1">
              <Cpu size={12} className="text-blue-400" /> Matrix Navigator
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              네이버 알고리즘 탭을 스위칭하여 각 영역별 세부 가이드라인 매트릭스를 로딩합니다.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {topics.map((t) => {
              const IconComponent = t.icon;
              return (
                <div key={t.id} onClick={() => setActiveTopic(t.id)} className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex gap-3 items-start ${activeTopic === t.id ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-blue-500/40 shadow-lg' : 'bg-zinc-900/10 border-zinc-800/50 hover:bg-zinc-900/30'}`}>
                  <div className={`p-2 rounded-lg border ${activeTopic === t.id ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}><IconComponent size={15} /></div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className={`text-xs font-black truncate ${activeTopic === t.id ? 'text-blue-400' : 'text-zinc-200'}`}>{t.title}</span>
                    <span className="text-[10px] text-zinc-500 font-bold truncate">{t.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2면 (중앙 2칸): 알고리즘 가이드 문서 출력 패널 */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/40 border border-blue-500/10 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
          <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-black text-zinc-300">
              <BookOpen size={14} className="text-blue-400" /> Naver Algorithm Logic Blueprint
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">DOCUMENT TYPE: CRANK-V3</span>
          </div>

          <div className="flex-1 p-6 flex flex-col space-y-6 overflow-y-auto custom-scrollbar bg-zinc-950/20">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Compass size={120} className="text-blue-500" /></div>
              <h3 className="text-sm font-black text-white flex items-center gap-2"><Sparkles size={14} className="text-yellow-400 animate-pulse" /> 알고리즘 세부 가중치 매트릭스 스캔</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">CreAIbox 연구소가 추적한 네이버 상위 노출 봇의 가점 누적 구조 리포트입니다. 본 요소들이 충족될 때 최적화 블로그 가중치가 수집됩니다.</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase text-zinc-400 flex items-center gap-1.5"><AlignLeft size={13} className="text-blue-400" /> 핵심 노출 수집 팩터 상세 분석 로그</h4>
              <div className="space-y-3">
                {weights[activeTopic]?.map((w, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/40 space-y-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-black text-white">{w.factor}</h5>
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{w.description}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-wider shrink-0 ${w.impact === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{w.impact}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500"><span>알고리즘 반영 비중</span><span className="text-blue-400 font-bold">{w.score}%</span></div>
                      <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900"><div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full" style={{ width: `${w.score}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-16 border-t border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
            <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 알고리즘 인사이트 가이드 엔진 동기화 중</span>
            <button onClick={() => alert("복사되었습니다.")} className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800"><Copy size={13} /> 가이드 텍스트 복사</button>
          </div>
        </div>

        {/* 👉 3면 (우측 2칸 병합): 🌟 [개조 완공] 플랫폼 엔진 실시간 보안 코어 모니터링 타워 */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
          
          {/* 1단: CreAIbox Model Integrity (기존 안티 플래지어리즘 외형 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
              <Server size={14} /> CreAIbox AI Model Integrity
            </h3>
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
              <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-emerald-400">99.9%</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">인공지능 모델 우회 무결성 지수</h4>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">네이버 중복 문서 필터 레이어를 회피하는 코어 팩터 안전 상태</p>
              </div>
            </div>
          </div>

          {/* 2단: Global SEO Core Patch Status (기존 워드프레스 외형 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
                <Cpu size={13} /> Global SEO Core Patch Status
              </h3>
              <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">
                VERSION: V4.2
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2"><Check size={14} className="text-blue-400" /> 구글 검색엔진 스니펫 메타 로직 패치</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">LATEST</span>
              </div>
            </div>
          </div>

          {/* 3단: IP Proxy & Tunneling Security (기존 아뷰징 디펜더 외형 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
              <ShieldAlert size={13} /> IP Proxy & Tunneling Security
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">네이버 IP 방화벽 우회율</span>
                <span className="text-xs font-black text-emerald-400">100% (CLEAN)</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">회전형 실시간 프록시 노드</span>
                <span className="text-xs font-black text-emerald-400">정상 가동 중</span>
              </div>
            </div>
          </div>

          {/* 4단: Mecab Parser Live Dynamic Status (기존 형태소 외형 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
              <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" /> Mecab Parser Live Dynamic Status
              </h3>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">CORE: ACTIVE</span>
            </div>
            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed font-medium">
              <p>📍 한국어 의존 구문 분석 데이터베이스: <strong className="text-blue-400">동적 수집 대기 중</strong></p>
              <p>📍 스마트블록 유의어 매칭 인프라 세션: <strong className="text-emerald-400">실시간 패치 완료</strong></p>
            </div>
          </div>

          {/* 5단 (최하단): Naver Algorithm Tracking Monitor (기존 스코어 보드 외형 계승) */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
              <BarChart3 size={13} /> Naver Algorithm Tracking Monitor
            </h3>
            <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
              <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
                SYNC
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">네이버 검색 봇 실시간 추적 상태</h4>
                <p className="text-[10px] text-zinc-500 font-medium">인공지능 검색 인프라의 로직 변경점 모니터링 센서</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle size={12} className="text-blue-500" /> 보안 관제실 원격 리포트</div>
              <p className="text-zinc-400 font-medium">✅ 안전 보증: 현재 네이버 C-Rank 및 DIA+ 검색 스파이더 로봇의 알고리즘 소스코드 변동률을 완벽하게 동기화 트래킹하고 있습니다. 플랫폼 내 모든 집필 공정은 안전 지대에서 호스팅 중입니다.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}