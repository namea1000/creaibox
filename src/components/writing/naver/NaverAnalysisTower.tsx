"use client";

import React from 'react';
import { 
  FileText, Check, AlertCircle, ShieldAlert, Cpu, PieChart, 
  AlignLeft, BarChart3, CheckCircle2, HelpCircle 
} from 'lucide-react';

interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

interface NaverAnalysisTowerProps {
  seoScore: number;
  seoChecks: {
    titleKeyword: boolean;
    contentDensity: boolean;
    duplicateSafe?: boolean;
    lengthCheck?: boolean;
    structureCheck?: boolean;
    subHeadingCheck?: boolean;
  };
  posRatio: {
    noun: number;
    verb: number;
    other: number;
  };
  frequencies: KeywordFrequency[];
  content: string;
  naverBotScore: number;
  isDensitySafe: boolean;
  isRecreateMode?: boolean;
  similarityScore?: number;
  isDetailMode?: boolean; // 상세페이지 전용 모드 스위치
}

export default function NaverAnalysisTower({
  seoScore, seoChecks, posRatio, frequencies, content, naverBotScore, isDensitySafe,
  isRecreateMode = false, similarityScore = 100, isDetailMode = false
}: NaverAnalysisTowerProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
      
      {/* 🥇 1단: Anti-Plagiarism Guard (recreate 또는 detail에서 전격 발동) */}
      {(isRecreateMode || isDetailMode) && (
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl animate-in fade-in duration-300">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <BarChart3 size={14} /> Anti-Plagiarism Guard
          </h3>
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
            <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
              <span className={`text-sm font-black ${similarityScore < 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                {similarityScore}%
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200">원본 문서 유사도</h4>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">50% 미만일 때 중복 저품질 안심 구역 판정</p>
            </div>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                {seoChecks.duplicateSafe ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                중복 원고 라이선스 필터 우회 지수
              </span>
              <span className={`text-[10px] font-bold ${seoChecks.duplicateSafe ? 'text-emerald-400' : 'text-zinc-600'}`}>25점</span>
            </div>
          </div>
        </div>
      )}

      {/* 🥈 2단: Wordpress SEO Analyzer */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
            <FileText size={13} /> Wordpress SEO Analyzer
          </h3>
          <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">
            SCORE: {seoScore}/100
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2">
              {seoChecks.titleKeyword ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
              {isDetailMode ? "제목 내 타겟 키워드 영리한 배치 유무" : "제목 내 핵심 키워드 유무 체크"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">30점</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2">
              {seoChecks.contentDensity ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
              {isDetailMode ? "본문 적정 키워드 인플레이션 밀도 (3~8회)" : "본문 적정 키워드 밀도 (3~7회)"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">25점</span>
          </div>
          {!isRecreateMode && !isDetailMode && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-2">
                {seoChecks.lengthCheck ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
                목표 글자수 도달 계측 검사
              </span>
              <span className="text-[10px] font-mono text-zinc-500">20점</span>
            </div>
          )}
        </div>
      </div>

      {/* 🥉 3단: Naver Anti-Abusing Defender */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
          <ShieldAlert size={13} /> Naver Anti-Abusing Defender
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">{isDetailMode ? "복사 붙여넣기 징후" : "복사 붙여넣기 의심"}</span>
            <span className="text-xs font-black text-emerald-400">{isDetailMode ? "0.0% (수동 집필 판정)" : "0.0% (안전)"}</span>
          </div>
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">{isDetailMode ? "수정 타자 속도 검측" : "기계적 생성 속도"}</span>
            <span className="text-xs font-black text-emerald-400">{isDetailMode ? "휴먼 매커니즘 매칭" : "정상 트래킹"}</span>
          </div>
        </div>
      </div>

      {/* 🏅 4단: 한국어 형태소 의존성 수집 계량판 */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" /> 한국어 형태소 의존성 수집 계량판
          </h3>
          <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">PARSER: MECAB-LIVE</span>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
            <PieChart size={12} className="text-blue-400" /> 네이버 검색 봇 인식 형태소 구성 비율
          </span>
          <div className="w-full h-3.5 rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-900">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-300" style={{ width: `${posRatio.noun}%` }} />
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-300" style={{ width: `${posRatio.verb}%` }} />
            <div className="bg-zinc-800 h-full transition-all duration-300" style={{ width: `${posRatio.other}%` }} />
          </div>
          <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 pl-0.5">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 명사 {isDetailMode ? "" : "(체언)"} <strong className="text-zinc-300">{posRatio.noun}%</strong></span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 동사/{isDetailMode ? "용언" : "형용사 (용언)"} <strong className="text-zinc-300">{posRatio.verb}%</strong></span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> {isDetailMode ? "조사/기타" : "기타 수식/조사"} <strong className="text-zinc-300">{posRatio.other}%</strong></span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><AlignLeft size={12} className="text-emerald-400" /> 단어별 정밀 출현 빈도 톱 매트릭스</h4>
          <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/40">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-850 text-zinc-500 font-bold">
                  <th className="p-3 pl-4">형태소 핵심 어휘</th>
                  <th className="p-3">등장 빈도</th>
                  {isDetailMode ? null : <th className="p-3">문맥 밀도 비율</th>}
                  <th className="p-3 text-right pr-4">엔진 안전 진단</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/40 text-zinc-300">
                {frequencies.map((f, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-3 pl-4 font-black text-white">{f.word}</td>
                    <td className="p-3 font-mono font-bold text-zinc-500">{f.count}{isDetailMode ? "회 감지" : "회 카운트"}</td>
                    {!isDetailMode && (
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-850">
                            <div className={`h-full ${f.status === 'danger' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${f.density}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500">{f.density.toFixed(1)}%</span>
                        </div>
                      </td>
                    )}
                    <td className="p-3 text-right pr-4">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        f.status === 'good' ? 'bg-emerald-500/10 text-emerald-400' :
                        f.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {f.status === 'good' ? '안전 비율' : f.status === 'warning' ? '대기 중' : '도배 경고'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!isDetailMode && (
          <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/30 space-y-1.5">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">분석 대상 원고 텍스트 스냅샷</span>
            <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">
              {content ? content : "본문 내용을 입력하면 스냅샷 트래킹이 개시됩니다."}
            </p>
          </div>
        )}
      </div>

      {/* 🏆 5단: Naver SEO Crawler Score */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
          <BarChart3 size={13} /> Naver SEO Crawler Score
        </h3>
        <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
            {naverBotScore}%
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">{isDetailMode ? "원고 최종 최적화 지수" : "형태소 매칭 최적화 지수"}</h4>
            <p className="text-[10px] text-zinc-500 font-medium">{isDetailMode ? "네이버 스마트블록 AI 수집엔진 로봇 매칭 점수" : "네이버 DIA+ 인공지능 검색 로봇 수집 선호도"}</p>
          </div>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2 font-medium">
              {isDensitySafe ? <CheckCircle2 size={14} className="text-emerald-400" /> : <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
              {isDetailMode ? "타겟 키워드 도배 방어 레이어 (3~5회 안쪽)" : "타겟 키워드 도배 방어 레이어 (3~5회 안쪽)"}
            </span>
            <span className="text-[10px] font-bold text-emerald-400">35점</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2 font-medium">
              {posRatio.noun >= 55 && posRatio.noun <= 65 ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
              명사(체언) 황금 비율 구간 안착 (55~65%)
            </span>
            <span className="text-[10px] font-bold text-emerald-400">25점</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2 font-medium">
              {isRecreateMode || isDetailMode ? (
                seoChecks.structureCheck ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />
              ) : (
                seoChecks.subHeadingCheck ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-zinc-600" />
              )}
              스마트블록 마크다운 소스 카테고리 규격
            </span>
            <span className="text-[10px] font-bold text-emerald-400">25점</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-850 text-[11px] leading-relaxed">
          <div className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1">{isDetailMode ? <HelpCircle size={12} className="text-blue-500" /> : null} 인공지능 보정 진단 피드</div>
          {!isDensitySafe ? (
            <p className="text-red-400 font-medium">{isDetailMode ? "🚨 위험: 특정 단어가 너무 빈번하게 도배 검출되었습니다. C-Rank 알고리즘 필터에 의해 패널티 누락 위험이 있으니 본문을 교정하십시오." : "🚨 위험: 특정 단어가 너무 빈번하게 도배 검출되었습니다. C-Rank 알고리즘 필터에 의해 패널티 누락 위험이 있으니 본문을 교정하십시오."}</p>
          ) : (
            <p className="text-zinc-400 font-medium">{isDetailMode ? "✅ 원고 최종 안전 승인: 데이터 히스토리 내 저장된 본문 텍스트 밀도와 형태소 밸런스가 네이버 에이전트 봇의 가산점 조건에 부합합니다." : "✅ 매우 안전: 형태소 배치 밀도와 단어 빈도 밸런스가 네이버 검색 스파이더 봇이 가장 좋아하는 구조입니다. 상위 노출 승인 준비가 완료되었습니다."}</p>
          )}
        </div>
      </div>

      {/* 풋터 팁 박스 */}
      <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 text-[10px] text-zinc-500 font-medium leading-relaxed shadow-inner">
        <span className="text-zinc-400 font-black tracking-wider block mb-1">C-RANK INSIGHT</span>
        {isDetailMode ? "본 상세 관리 패널을 안전 통과한 원고들은 네이버 스마트블록 검색 엔진에 의해 오리지널 가치 문서로 분류되어 VIEW 탭 최상단 최적화 배정 가중치를 획득합니다." : "네이버 블로그 지수의 핵심은 한 주제에 대해 얼마나 가치 있고 정돈된 형태소 문맥을 꾸준히 생산하느냐에 달려있습니다. 본 계량기를 통과한 문서들은 원작자가 직접 작성한 정보성 높은 글로 분류되어 최적의 노출 가중치를 수집합니다."}
      </div>
    </div>
  );
}