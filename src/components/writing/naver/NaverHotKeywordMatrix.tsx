"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Sliders, PenLine, RefreshCw, FileText, 
  ImageIcon, Search, Eye, HelpCircle, Settings2, ArrowUpRight,
  Sparkles, TrendingUp, Database, BarChart3, Zap, CheckCircle2
} from 'lucide-react';

interface KeywordRecord {
  id: string;
  word: string;
  type: string;
  volume: string;
  competition: "높음" | "중간" | "낮음";
  created_at: string;
}

interface NaverHotKeywordMatrixProps {
  blogId: string;
  setBlogId: (value: string) => void;
  isLinked: boolean;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isAnalyzing: boolean;
  hotKeywords: KeywordRecord[];
  blogStats: { grade: string; visitors: string; posts: string };
  handleLinkBlog: () => void;
  handleAnalyzeKeyword: () => void;
}

export default function NaverHotKeywordMatrix({
  blogId,
  setBlogId,
  isLinked,
  isLoading,
  searchQuery,
  setSearchQuery,
  isAnalyzing,
  hotKeywords,
  blogStats,
  handleLinkBlog,
  handleAnalyzeKeyword
}: NaverHotKeywordMatrixProps) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto h-full grid grid-cols-1 lg:grid-cols-4 gap-6 text-zinc-100 font-sans">
      
      {/* 👈 1번째 면: 제일 왼쪽 [내 네이버 블로그 인프라 및 상태 엔진] */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        
        {/* 블로그 연동 센터 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Naver Blog Linker
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            아이디를 연동하시면 현재 블로그의 C-Rank 최적화 지수와 방문자 통계를 크롤링하여 AI가 실시간 분석합니다.
          </p>
          <div className="space-y-2">
            <label className="block text-[11px] text-zinc-500 font-bold">네이버 블로그 ID</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="naver_id"
                value={blogId}
                onChange={(e) => setBlogId(e.target.value)}
                disabled={isLinked}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 font-bold focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
              />
              <button 
                onClick={handleLinkBlog}
                disabled={isLoading || isLinked}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-emerald-600/20 text-emerald-400 disabled:text-emerald-400 text-xs font-black rounded-xl border border-zinc-700/60 transition-all shrink-0"
              >
                {isLoading ? "조회중..." : isLinked ? "연동됨" : "연동"}
              </button>
            </div>
          </div>
          {/* 연동 완료 시 대시보드 */}
          {isLinked && (
            <div className="pt-3 border-t border-zinc-800/60 space-y-3 animate-in fade-in duration-300">
              <div className="flex justify-between items-center bg-zinc-950/40 p-3 rounded-xl border border-zinc-850">
                <span className="text-xs text-zinc-400 font-medium">블로그 최적화 등급</span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-50/10 px-2 py-0.5 rounded-md">{blogStats.grade}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-zinc-950/30 p-2 rounded-xl border border-zinc-850">
                  <p className="text-[10px] text-zinc-500 font-bold">전일 방문자</p>
                  <p className="text-sm font-black text-white mt-0.5">{blogStats.visitors}</p>
                </div>
                <div className="bg-zinc-950/30 p-2 rounded-xl border border-zinc-850">
                  <p className="text-[10px] text-zinc-500 font-bold">누적 포스팅</p>
                  <p className="text-sm font-black text-white mt-0.5">{blogStats.posts}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 9대 핵심 탭 메뉴 다이렉트 퀵 릴리즈 배너 타워 */}
        <div className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/40 space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[500px]">
          <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5 sticky top-0 bg-[#0a0c10] py-1 z-10">
            <Sliders size={13} className="text-blue-400" /> Studio Quick Actions
          </h4>
          <div className="space-y-2">
            
            <Link href="/studio/writing/naver/create" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-emerald-500/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><PenLine size={14} className="text-emerald-400" /> AI 스마트 글쓰기</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/recreate" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-blue-500/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><RefreshCw size={14} className="text-blue-400" /> AI 글 재창조 스튜디오</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/list" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-purple-500/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><FileText size={14} className="text-purple-400" /> 발행 원고 보관 관리</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/thumbnail" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-amber-500/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><ImageIcon size={14} className="text-amber-400" /> 네이버용 썸네일 메이커</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/keyword" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-cyan-400/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><Search size={14} className="text-cyan-400" /> 네이버 황금 키워드 분석</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/diagnosis" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-rose-400/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><Eye size={14} className="text-rose-400" /> 실시간 상위 노출 진단</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-rose-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/guide" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-yellow-400/30 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><HelpCircle size={14} className="text-yellow-400" /> C-Rank 로직 가이드룸</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-yellow-400 transition-colors" />
            </Link>
            <Link href="/studio/writing/naver/api" className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-zinc-400 transition-all flex items-center justify-between text-xs font-bold group">
              <span className="flex items-center gap-2"><Settings2 size={14} className="text-zinc-400" /> 코어 엔진 최적화 세팅</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
      {/* 💻 2번째 면: 가운데 [최첨단 트렌드 관제탑 및 원스톱 검색창] */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
        
        {/* 상단 통합 검색 영역 */}
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/40 to-zinc-950/20 backdrop-blur-md space-y-4 shadow-xl shrink-0">
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" /> 네이버 마케팅 키워드 마스터
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              발행하고자 하는 키워드를 입력하시면 네이버 스마트블록과 문서 배치 우선순위를 1초 만에 스캔합니다.
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeKeyword()}
              placeholder="상위 노출을 노릴 타겟 키워드를 조회해 보세요..."
              className="w-full pl-11 pr-24 py-3 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 placeholder-zinc-600 font-bold focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
            />
            <button 
              onClick={handleAnalyzeKeyword}
              disabled={isAnalyzing}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:text-zinc-400 text-[11px] font-black rounded-lg shadow-md active:scale-95 transition-all"
            >
              {isAnalyzing ? "스캔중..." : "분석하기"}
            </button>
          </div>
        </div>
        {/* 해결책 B: 내부 스크롤 격실 탑재형 트렌드 메인 인덱스 보드 */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md space-y-4 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3 shrink-0">
            <h3 className="text-sm font-black text-zinc-200 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" /> 실시간 네이버 검색 트렌드 매트릭스
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Database size={12} className="text-sky-400" /> Supabase Synced Base
            </span>
          </div>
          {/* 테이블 내부 격실 가동 구역 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border border-zinc-850 rounded-xl bg-zinc-950/40 pr-1">
            <table className="w-full text-left text-xs font-medium">
              <thead className="sticky top-0 bg-zinc-950 border-b border-zinc-850 text-zinc-500 font-bold z-20">
                <tr>
                  <th className="py-3 pl-4 font-bold">역사 순번</th>
                  <th className="py-3 font-bold">분석 키워드</th>
                  <th className="py-3 font-bold">카테고리 범주</th>
                  <th className="py-3 font-bold">월간 검색량</th>
                  <th className="py-3 font-bold text-right pr-4">진입 난이도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/30 text-zinc-300">
                {hotKeywords.map((kw, index) => (
                  <tr key={kw.id} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="py-4 font-mono font-bold pl-4 text-zinc-500">#{hotKeywords.length - index}</td>
                    <td 
                      className="py-4 font-black text-white group-hover:text-emerald-400 transition-colors cursor-pointer"
                      onClick={() => { setSearchQuery(kw.word); alert(`선택된 [${kw.word}] 키워드를 마스터창에 로드했습니다.`); }}
                    >
                      {kw.word}
                    </td>
                    <td className="py-4 text-zinc-400">{kw.type}</td>
                    <td className="py-4 font-mono">{kw.volume}</td>
                    <td className="py-4 text-right pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        kw.competition === "낮음" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        kw.competition === "중간" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {kw.competition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* 👉 3번째 면: 제일 오른쪽 [네이버 C-Rank 및 스마트블록 수집 엔진 분석판] */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        
        {/* 알고리즘 핵심 요약 보드 */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
            <BarChart3 size={14} /> Algorithm Radar
          </h3>
          <div className="space-y-4 text-xs">
            
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-950/40 space-y-1.5">
              <h4 className="font-black text-zinc-200 flex items-center gap-1.5">
                <Zap size={12} className="text-yellow-400" /> 스마트블록(SmartBlock) 대응
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                네이버는 단일 키워드가 아닌 관심사별 세부 그룹으로 문서를 쪼갭니다. 2번 메뉴의 AI 글쓰기 기능을 활용하면 각 블록 매칭 정밀도를 극대화할 수 있습니다.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800/60 bg-zinc-950/40 space-y-1.5">
              <h4 className="font-black text-zinc-200 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" /> 다이아플러스(D.I.A+) 스코어
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                단순 텍스트 짜깁기는 저품질의 타겟이 됩니다. 실제 경험 정보와 고유 이미지 캡션을 추출하여 독창성 점수를 방어하세요.
              </p>
            </div>
          </div>
        </div>
        {/* 에코 시스템 가이드 안내판 */}
        <div className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-950/20 text-[11px] text-zinc-400 leading-relaxed font-medium space-y-2">
          <span className="font-black uppercase text-zinc-500 block tracking-wider">Notice</span>
          <p>크리에이아이박스는 네이버 공식 서치어드바이저 로직과 빅데이터 형태소 수집 기술을 표준 준수합니다. 과도한 어뷰징 및 기계적 복사 글 생성을 차단하며, 가장 우수한 문맥 품질을 지향합니다.</p>
        </div>
      </div>
    </div>
  );
}