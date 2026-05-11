'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Key, Database, Activity, Users, 
  Trash2, Plus, RefreshCw, CheckCircle2, AlertTriangle,
  TrendingUp, BarChart3, Lock, Eye, EyeOff
} from 'lucide-react';

// [타입 정의] 무료 풀에 들어갈 키 객체
interface AdminApiKey {
  id: number;
  key: string;
  label: string;      // 예: 구글계정01
  model: string;      // gemini-1.5-flash 고정 또는 선택
  status: 'active' | 'error' | 'limit';
  useCount: number;   // 누적 사용 횟수
  todayCount: number; // 오늘 사용 횟수
  lastUsed: string;   // 마지막 사용 시각
}

export default function APIVaultAdmin() {
  // 실제 구현 시에는 이 데이터를 Supabase나 외부 DB에서 가져와야 합니다.
  const [apiKeys, setApiKeys] = useState<AdminApiKey[]>([
    { id: 1, key: 'AIzaSyA...', label: '관리자계정_01', model: 'gemini-1.5-flash', status: 'active', useCount: 154, todayCount: 12, lastUsed: '10분 전' },
    { id: 2, key: 'AIzaSyB...', label: '관리자계정_02', model: 'gemini-1.5-flash', status: 'active', useCount: 89, todayCount: 5, lastUsed: '1시간 전' },
    { id: 3, key: 'AIzaSyC...', label: '관리자계정_03', model: 'gemini-1.5-flash', status: 'error', useCount: 210, todayCount: 0, lastUsed: '어제' },
  ]);

  const [showKeys, setShowKeys] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // 상단 요약 통계 계산
  const totalCalls = apiKeys.reduce((acc, curr) => acc + curr.todayCount, 0);
  const activeKeys = apiKeys.filter(k => k.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#020406] text-slate-100 p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- 상단 관리자 헤더 --- */}
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white flex items-center gap-3 uppercase">
              <ShieldAlert className="text-red-500 w-10 h-10" /> 
              Admin <span className="text-red-500">Master</span> Vault
            </h1>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
              무료 체험 API 풀 시스템 중앙 관제소 — 사장님 전용 전유물
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
              <Users className="text-blue-500" />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase">Current Users</p>
                <p className="text-xl font-black text-white">12 <span className="text-xs text-zinc-600 font-normal">Online</span></p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
              <Activity className="text-emerald-500" />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase">Today API Calls</p>
                <p className="text-xl font-black text-white">{totalCalls} <span className="text-xs text-zinc-600 font-normal">Total</span></p>
              </div>
            </div>
          </div>
        </header>

        {/* --- 키 관리 및 분석 그리드 --- */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* [왼쪽] 키 리스트 테이블 (8칸) */}
          <section className="col-span-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] overflow-hidden backdrop-blur-xl">
              <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                <h3 className="font-black text-xl flex items-center gap-2 italic uppercase">
                  <Database className="text-blue-500" size={20} /> Free API Pool List
                </h3>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setShowKeys(!showKeys)}
                    className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all text-zinc-400"
                   >
                    {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                   <button 
                    onClick={() => setIsAdding(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-900/20"
                   >
                    <Plus size={16} /> Add New Key
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 uppercase font-black tracking-widest border-b border-zinc-800">
                      <th className="px-8 py-5">No.</th>
                      <th className="px-8 py-5">Account Label</th>
                      <th className="px-8 py-5">Model</th>
                      <th className="px-8 py-5">Usage (Today/Total)</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {apiKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 text-zinc-500 font-mono text-xs">{k.id.toString().padStart(2, '0')}</td>
                        <td className="px-8 py-6">
                          <p className="font-black text-sm text-zinc-200">{k.label}</p>
                          <p className="text-[10px] font-mono text-zinc-600 mt-1">
                            {showKeys ? k.key : '••••••••••••••••••••'}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-tighter border border-zinc-700">
                            {k.model}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-500">{k.todayCount}</span>
                            <span className="text-zinc-700">/</span>
                            <span className="text-zinc-500 text-xs font-bold">{k.useCount}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {k.status === 'active' ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase">
                              <CheckCircle2 size={12} /> Healthy
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase">
                              <AlertTriangle size={12} /> Error
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button className="p-2 text-zinc-500 hover:text-white transition-colors"><RefreshCw size={14} /></button>
                             <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* [오른쪽] 실시간 트래픽 분석 (4칸) */}
          <section className="col-span-4 space-y-8">
            {/* 키 가동율 차트 카드 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-xl">
              <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" /> Pool Health Status
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] font-black uppercase mb-2">
                    <span className="text-zinc-500">Overall Availability</span>
                    <span className="text-emerald-500">{Math.round((activeKeys/apiKeys.length)*100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${(activeKeys/apiKeys.length)*100}%` }} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                    <p className="text-[10px] font-black text-zinc-600 uppercase">Active</p>
                    <p className="text-2xl font-black text-emerald-500 mt-1">{activeKeys}</p>
                  </div>
                  <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                    <p className="text-[10px] font-black text-zinc-600 uppercase">Error/Limit</p>
                    <p className="text-2xl font-black text-red-500 mt-1">{apiKeys.length - activeKeys}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 로그 기록 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-xl flex-1">
              <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-500" /> Live Traffic Log
              </h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex gap-4 text-[11px] border-l border-zinc-800 pl-4 py-1">
                    <span className="text-zinc-600 font-mono">21:44:02</span>
                    <span className="text-blue-400 font-bold uppercase">User_A</span>
                    <span className="text-zinc-400 font-medium">Used Key #02 (Flash)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 보안 경고 */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-6 flex items-center gap-4">
              <Lock className="text-red-500 shrink-0" size={24} />
              <p className="text-[11px] font-bold text-red-200/70 leading-relaxed uppercase tracking-tight">
                본 페이지는 <span className="text-red-500 font-black italic underline">SUPER ADMIN</span> 전용입니다. 외부에 노출 시 모든 무료 API 키가 탈취될 수 있으니 주의하십시오.
              </p>
            </div>
          </section>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] pb-10">
        CreAIbox Strategic Intelligence Systems — Admin Master Console
      </footer>
    </div>
  );
}