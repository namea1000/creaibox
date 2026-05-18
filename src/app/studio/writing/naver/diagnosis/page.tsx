"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, BarChart3, HelpCircle, RefreshCw, 
  Copy, Globe, ArrowUpRight, ArrowDownRight, ShieldAlert, 
  CheckCircle2, AlertCircle, LayoutGrid, Cpu, AlignLeft, 
  LineChart, FileText, Eye, Calendar, Clock, Tag, Check, Users, Gauge
} from 'lucide-react';

interface DiagnosisHistory {
  id: string;
  url: string;
  keyword: string;
  rank: number;
  prevRank: number;
  status: 'up' | 'down' | 'stable' | 'out';
  date: string;
}

interface BlockMatrix {
  blockName: string;
  exposureType: string;
  score: number;
  status: 'safe' | 'warning';
}

export default function RealtimeDiagnosisPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [searchHistoryTerm, setSearchHistoryTerm] = useState("");

  // 🌟 [관제탑 레이더 엔진 상태 관리] 노출 진단에 완전히 특화된 가상 변수 시스템
  const [totalScore, setTotalScore] = useState(88);
  const [bounceRate, setBounceRate] = useState(24.5); // 이탈률
  const [stayTime, setStayTime] = useState(142); // 평균 체류시간 (초)
  const [indexScore, setIndexScore] = useState(95); // 스마트블록 색인 점수

  // 가상 진단 이력 스트림
  const [historyList, setHistoryList] = useState<DiagnosisHistory[]>([
    { id: '1', url: 'https://blog.naver.com/tech_master/2234567', keyword: 'AI 자동화 수익화', rank: 2, prevRank: 5, status: 'up', date: '2026-05-18' },
    { id: '2', url: 'https://blog.naver.com/food_hunter/2239876', keyword: '천안 맛집 TOP5', rank: 1, prevRank: 1, status: 'stable', date: '2026-05-17' },
    { id: '3', url: 'https://blog.naver.com/money_info/2231122', keyword: '2026 정부지원금', rank: 14, prevRank: 8, status: 'down', date: '2026-05-16' },
  ]);

  // 스마트블록 매칭 매트릭스 데이터
  const [matrixData, setMatrixData] = useState<BlockMatrix[]>([
    { blockName: '인기글 스마트블록', exposureType: 'VIEW 탭 통합 섹션', score: 94, status: 'safe' },
    { blockName: '20대 재테크 트렌드', exposureType: '연령별 커스텀 블록', score: 88, status: 'safe' },
    { blockName: '부업 추천 가이드', exposureType: '관심사 스마트블록', score: 72, status: 'warning' },
  ]);

  const handleStartDiagnosis = () => {
    if (!targetUrl) return alert("진단할 네이버 블로그 포스팅 URL을 입력해 주세요!");
    if (!targetKeyword) return alert("추적할 타겟 핵심 키워드를 입력해 주세요!");

    setIsScanning(true);

    setTimeout(() => {
      const newDiagnosis: DiagnosisHistory = {
        id: Date.now().toString(),
        url: targetUrl,
        keyword: targetKeyword,
        rank: Math.floor(Math.random() * 3) + 1, 
        prevRank: Math.floor(Math.random() * 10) + 4,
        status: 'up',
        date: new Date().toISOString().split('T')[0]
      };

      setHistoryList(prev => [newDiagnosis, ...prev]);
      setTotalScore(Math.floor(Math.random() * 10) + 88);
      setBounceRate(parseFloat((Math.random() * 10 + 20).toFixed(1)));
      setStayTime(Math.floor(Math.random() * 40) + 130);
      setIndexScore(Math.floor(Math.random() * 10) + 90);
      
      setIsScanning(false);
      alert("네이버 스마트블록 검색 봇 노출 추적 및 특화 진단이 완료되었습니다!");
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      <div className="max-w-[1700px] mx-auto px-4 py-4 h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
        
        {/* 1면 (좌측): 진단 제어 레이더 폼 */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-hidden border-r border-zinc-800/30 pr-1">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
              <Cpu size={14} /> Diagnosis Radar
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">1. 진단 포스팅 URL</label>
                <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-medium focus:outline-none focus:border-blue-500/50" placeholder="https://blog.naver.com/..." />
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-1.5">2. 추적 타겟 키워드</label>
                <input type="text" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-bold focus:outline-none focus:border-blue-500/50" placeholder="예: AI 자동화" />
              </div>
            </div>
            <button onClick={handleStartDiagnosis} disabled={isScanning} className="w-full py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-black rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
              {isScanning ? <><RefreshCw size={14} className="animate-spin text-blue-400" /> 순위 및 지수 트래킹 중...</> : <><Search size={14} /> 실시간 노출 진단 개시</>}
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden gap-2">
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
              <input type="text" placeholder="과거 진단 키워드 검색..." value={searchHistoryTerm} onChange={(e) => setSearchHistoryTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-[11px] rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 focus:outline-none" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {historyList.filter(h => h.keyword.toLowerCase().includes(searchHistoryTerm.toLowerCase())).map((h) => (
                <div key={h.id} className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all text-left flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-zinc-200 truncate max-w-[120px]">{h.keyword}</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] font-black">
                      <span className="text-zinc-500">현재:</span>
                      <span className={h.rank <= 3 ? 'text-emerald-400' : 'text-amber-400'}>{h.rank}위</span>
                      {h.status === 'up' && <ArrowUpRight size={12} className="text-emerald-400" />}
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-600 font-bold truncate">{h.url}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2면 (중앙 2칸): 통계 차트 및 블록 리포트 */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/40 border border-blue-500/10 rounded-2xl overflow-hidden backdrop-blur-md h-full shadow-2xl">
          <div className="h-14 border-b border-zinc-800 bg-zinc-950/60 px-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-black text-zinc-300">
              <LineChart size={14} className="text-blue-400" /> 실시간 랭킹 트래킹 통계 데이터 스트림
            </div>
            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1"><Calendar size={12} /> Sync Date: 2026-05-18</span>
          </div>

          <div className="flex-1 p-6 flex flex-col space-y-5 overflow-y-auto custom-scrollbar bg-zinc-950/20">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-4 shadow-lg relative min-h-[200px] flex flex-col justify-between">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">스마트블록 세부 색인 트랜잭션 플롯</h4>
                  <p className="text-[10px] text-zinc-600 font-medium">최근 시간대별 검색 노출 순위 다이어그램</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">실시간 연동 중</span>
              </div>
              <div className="h-28 w-full flex items-end gap-5 px-4 border-b border-zinc-800 pb-1 font-mono text-[10px] text-zinc-600">
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span>5위</span>
                  <div className="w-full bg-zinc-900 rounded-t-md h-8 border border-zinc-800" />
                  <span>48h 전</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span>3위</span>
                  <div className="w-full bg-zinc-900 rounded-t-md h-16 border border-zinc-800" />
                  <span>24h 전</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-blue-400 font-black">2위</span>
                  <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md h-24 border border-blue-500/30" />
                  <span className="text-zinc-400 font-bold">현재 상태</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase text-zinc-400 flex items-center gap-1.5"><LayoutGrid size={13} className="text-blue-400" /> 네이버 인공지능 스마트블록 타겟 수집 분포 분석 매트릭스</h4>
              <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/40">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-zinc-950/80 border-b border-zinc-850 text-zinc-500 font-bold">
                      <th className="p-3 pl-4">식별된 스마트블록 카테고리</th>
                      <th className="p-3">섹션 노출 속성</th>
                      <th className="p-3">로봇 매칭 지수</th>
                      <th className="p-3 text-right pr-4">안전 등급 레벨</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850/40 text-zinc-300">
                    {matrixData.map((m, i) => (
                      <tr key={i} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="p-3 pl-4 font-black text-white flex items-center gap-1.5"><Tag size={12} className="text-blue-500" /> {m.blockName}</td>
                        <td className="p-3 text-zinc-400 font-medium">{m.exposureType}</td>
                        <td className="p-3 font-mono font-black text-blue-400">{m.score}점</td>
                        <td className="p-3 text-right pr-4"><span className={`text-[9px] font-black px-2 py-0.5 rounded ${m.status === 'safe' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{m.status === 'safe' ? '상위 장악' : '경쟁 심화'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="h-16 border-t border-zinc-800 bg-zinc-950/60 px-6 flex items-center justify-between shrink-0">
            <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 검색 인플루언서 탭 패킷 실시간 다이렉트 호스팅 스트림 가동 중</span>
            <button onClick={() => alert("복사완료!")} className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 flex items-center gap-1.5"><Copy size={13} /> 진단 리포트 복사</button>
          </div>
        </div>

        {/* 👉 3면 (우측 2칸 병합): 🌟 [노출 진단 특화형] 완벽 통일성 구축 스마트 5단 타워 */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
          
          {/* 1단: Anti-Plagiarism Guard */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5"><BarChart3 size={14} /> Anti-Plagiarism Guard</h3>
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
              <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0"><span className="text-sm font-black text-emerald-400">0.0%</span></div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">타사 유사 원고 인용 침해율</h4>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">포스팅 오리지널 문서 상태 입증 스펙</p>
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5 font-medium"><CheckCircle2 size={14} className="text-emerald-400" /> 유사 백링크 중복 필터 세이프존</span>
                <span className="text-[10px] font-bold text-emerald-400">통과</span>
              </div>
            </div>
          </div>

          {/* 2단: Wordpress SEO Analyzer */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5"><FileText size={13} /> Wordpress SEO Analyzer</h3>
              <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">SCORE: {totalScore}/100</div>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2"><Check size={14} className="text-blue-400" /> 검색 엔진 스니펫 마크다운 구조 검사</span>
                <span className="text-[10px] font-mono text-zinc-500">적정</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2"><Check size={14} className="text-blue-400" /> 이미지 Alt 캡션 키워드 수집 가치</span>
                <span className="text-[10px] font-mono text-zinc-500">정상</span>
              </div>
            </div>
          </div>

          {/* 3단: Naver Anti-Abusing Defender */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
              <ShieldAlert size={13} /> Naver Anti-Abusing Defender
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">인위적 매크로 트래픽 유입</span>
                <span className="text-xs font-black text-emerald-400">0.0% (클린)</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">C-Rank 패널티 누적도</span>
                <span className="text-xs font-black text-emerald-400">안전 등급 수렴</span>
              </div>
            </div>
          </div>

          {/* 🔥 4단 (신설 대체): Naver Traffic & Bounce Radar */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-cyan-400 flex items-center gap-1.5">
              <Gauge size={13} /> Naver Traffic & Bounce Radar
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">유저 평균 이탈률 (Bounce)</span>
                <span className="text-xs font-black text-cyan-400">{bounceRate}% (매우 낮음)</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-[10px] text-zinc-500 font-bold block mb-1">문서 실시간 평균 체류시간</span>
                <span className="text-xs font-black text-cyan-400">{stayTime}초 (고품질 문서)</span>
              </div>
            </div>
          </div>

          {/* 🔥 5단 (신설 대체): SmartBlock Ranking Index */}
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
              <BarChart3 size={13} /> SmartBlock Ranking Index
            </h3>
            <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
              <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
                {indexScore}%
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">알고리즘 통합 색인 점수</h4>
                <p className="text-[10px] text-zinc-500 font-medium">네이버 스마트블록 검색 스파이더 봇 크롤 스코어</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle size={12} className="text-blue-500" /> 인프라 통합 모니터링 소견</div>
              <p className="text-zinc-400 font-medium">✅ 스캔 결과: 현재 체류 시간이 안정적이고 이탈률이 낮아 품질 가중치 최상위권입니다. 타사 포스팅의 대량 스팸 백링크 공격이 없는 한, 현재의 스마트블록 상위권 랭크는 장기 집권할 것으로 진단됩니다.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 text-[10px] text-zinc-500 font-medium leading-relaxed shadow-inner">
            <span className="text-zinc-400 font-black tracking-wider block mb-1">INTELLIGENCE REPORT</span>
            실시간 스마트블록 순위 트래킹 레이어는 네이버 모바일 통합 검색 서비스의 패킷 변동률을 정밀 흡수하여 오차 없는 데이터 동적 스트림을 제공합니다.
          </div>

        </div>

      </div>
    </div>
  );
}