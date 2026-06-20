"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Copy,
  Database,
  FileText,
  LayoutGrid,
  Lightbulb,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface GoldenKeyword {
  id: string;
  keyword: string;
  monthlySearch: number;
  totalDocs: number;
  saturation: number;
  grade: 'S급 황금' | 'A급 우수' | '경쟁과열' | '진입불가';
  createdAt: string;
}

interface TrendItem {
  rank: number;
  keyword: string;
  category: string;
  growth: number;
}

interface RelatedKeyword {
  keyword: string;
  docCount: number;
  intent: '정보성' | '상업성' | '급상승';
  tip: string;
}

type AnalysisTab = 'opportunity' | 'related' | 'execution';

const INITIAL_TRENDS: TrendItem[] = [
  { rank: 1, keyword: '직장인 부업 자동화', category: '비즈니스', growth: 145 },
  { rank: 2, keyword: '소상공인 정책자금 2026', category: '금융/정부', growth: 92 },
  { rank: 3, keyword: 'AI 글쓰기 툴 비교', category: 'IT/테크', growth: 64 },
  { rank: 4, keyword: '주식 자동매매 프로그램', category: '재테크', growth: 48 },
  { rank: 5, keyword: '천안 맛집 TOP 5', category: '여행/맛집', growth: 37 },
  { rank: 6, keyword: 'HBM 반도체 공급망', category: 'IT/테크', growth: 120 },
  { rank: 7, keyword: '2026 청년도약계좌 조건', category: '재테크', growth: 85 },
  { rank: 8, keyword: '무자본 창업 아이템', category: '비즈니스', growth: 110 }
];

const INITIAL_GOLDEN_LIST: GoldenKeyword[] = [
  { id: '1', keyword: '무자본 AI 수익화', monthlySearch: 14800, totalDocs: 1200, saturation: 8.1, grade: 'S급 황금', createdAt: '2026-05-18' },
  { id: '2', keyword: '정부지원금 대출 자격', monthlySearch: 35000, totalDocs: 8500, saturation: 24.2, grade: 'A급 우수', createdAt: '2026-05-17' },
  { id: '3', keyword: '강남 공유오피스 가격', monthlySearch: 19000, totalDocs: 24000, saturation: 126.3, grade: '경쟁과열', createdAt: '2026-05-15' },
  { id: '4', keyword: '천안 맛집 TOP5', monthlySearch: 22000, totalDocs: 180000, saturation: 818.1, grade: '진입불가', createdAt: '2026-05-16' },
  { id: '5', keyword: '직장인 이직 자소서 꿀팁', monthlySearch: 8500, totalDocs: 1100, saturation: 12.9, grade: 'S급 황금', createdAt: '2026-05-14' }
];

const INITIAL_RELATED: RelatedKeyword[] = [
  { keyword: '하이닉스 반도체 주가 전망 2026', docCount: 52000, intent: '급상승', tip: '연도 키워드를 제목과 소제목에 분리 배치하면 클릭 유도가 강합니다.' },
  { keyword: '하이닉스 반도체 HBM 고대역폭메모리', docCount: 18500, intent: '정보성', tip: '기술 설명형 본문으로 깊이를 주면 체류시간 확보에 유리합니다.' },
  { keyword: '하이닉스 반도체 엔비디아 납품', docCount: 67000, intent: '급상승', tip: '당일 뉴스 문맥과 연결하면 트렌드성 노출을 노리기 좋습니다.' },
  { keyword: '하이닉스 반도체 배당금 기준일', docCount: 12400, intent: '상업성', tip: '재테크형 독자를 묶는 후속 글감으로 확장하기 좋습니다.' },
  { keyword: '하이닉스 반도체 성과급 구조', docCount: 31000, intent: '정보성', tip: '커뮤니티 인용을 넣으면 경험형 문서 톤을 살릴 수 있습니다.' }
];

const ANALYSIS_TABS: Array<{ id: AnalysisTab; label: string }> = [
  { id: 'opportunity', label: '기회 분석' },
  { id: 'related', label: '연관 키워드' },
  { id: 'execution', label: '실행 전략' }
];

function formatNumber(value: number) {
  return `${value.toLocaleString()}회`;
}

function getGradeFromSaturation(saturation: number): GoldenKeyword['grade'] {
  if (saturation < 20) return 'S급 황금';
  if (saturation < 80) return 'A급 우수';
  if (saturation < 180) return '경쟁과열';
  return '진입불가';
}

function getIntentMix(grade: GoldenKeyword['grade']) {
  if (grade === 'S급 황금') return { info: 46, action: 34, trend: 20 };
  if (grade === 'A급 우수') return { info: 40, action: 30, trend: 30 };
  if (grade === '경쟁과열') return { info: 35, action: 20, trend: 45 };
  return { info: 55, action: 10, trend: 35 };
}

export default function NaverKeywordAnalysisPage() {
  const [scanKeyword, setScanKeyword] = useState('하이닉스 반도체');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('opportunity');
  const [trendList] = useState<TrendItem[]>(INITIAL_TRENDS);
  const [goldenList, setGoldenList] = useState<GoldenKeyword[]>(INITIAL_GOLDEN_LIST);
  const [relatedList, setRelatedList] = useState<RelatedKeyword[]>(INITIAL_RELATED);

  const activeRecord = useMemo(() => {
    return goldenList.find((item) => item.keyword === scanKeyword) || goldenList[0];
  }, [goldenList, scanKeyword]);

  const diagnosis = useMemo(() => {
    if (!activeRecord) {
      return {
        headline: '키워드를 먼저 스캔해 주세요.',
        summary: '검색량, 문서 수, 경쟁 구도를 분석한 뒤 실제 글감 의사결정으로 연결합니다.'
      };
    }

    if (activeRecord.grade === 'S급 황금') {
      return {
        headline: '지금 바로 써도 좋은 황금 키워드입니다.',
        summary: '문서 포화도가 낮고 검색 수요가 살아 있어서 네이버 블로그형 정보성 문서로 공략하기 좋습니다.'
      };
    }

    if (activeRecord.grade === 'A급 우수') {
      return {
        headline: '조건부 추천 키워드입니다.',
        summary: '직접 경쟁은 있지만 제목 각도와 롱테일 조합을 잘 잡으면 충분히 진입 가능합니다.'
      };
    }

    if (activeRecord.grade === '경쟁과열') {
      return {
        headline: '메인 키워드 단독 진입은 부담이 있습니다.',
        summary: '지역, 연도, 비교, 질문형 보조 키워드를 섞어서 우회 진입하는 전략이 더 안전합니다.'
      };
    }

    return {
      headline: '메인 키워드로는 진입이 어렵습니다.',
      summary: '직접 공략보다 연관 질문형 키워드로 각도를 바꿔 2차 글감을 만드는 편이 유리합니다.'
    };
  }, [activeRecord]);

  const keywordMetrics = useMemo(() => {
    if (!activeRecord) {
      return [];
    }

    const publishingScore = Math.max(8, 100 - Math.min(activeRecord.saturation, 92));
    const clickPotential = Math.min(96, Math.round((activeRecord.monthlySearch / Math.max(activeRecord.totalDocs, 1)) * 120));
    const intentMix = getIntentMix(activeRecord.grade);

    return [
      { label: '월 검색량', value: formatNumber(activeRecord.monthlySearch), tone: 'text-blue-400' },
      { label: '문서 포화도', value: `${activeRecord.saturation}%`, tone: 'text-amber-400' },
      { label: '발행 적합도', value: `${publishingScore}점`, tone: 'text-emerald-400' },
      { label: '클릭 잠재력', value: `${clickPotential}점`, tone: 'text-fuchsia-400' },
      { label: '정보형 비중', value: `${intentMix.info}%`, tone: 'text-cyan-400' },
      { label: '트렌드성 비중', value: `${intentMix.trend}%`, tone: 'text-rose-400' }
    ];
  }, [activeRecord]);

  const executionPlan = useMemo(() => {
    const baseKeyword = activeRecord?.keyword || scanKeyword;
    return {
      titleIdeas: [
        `${baseKeyword} 완전정리: 지금 확인해야 할 핵심 포인트`,
        `2026년 ${baseKeyword} 분석: 초보자도 이해되는 실전 가이드`,
        `${baseKeyword} 왜 뜨나? 데이터로 보는 핵심 변화`,
        `${baseKeyword} 관련주·이슈·전망 한 번에 보는 정리`,
        `${baseKeyword} 검색자가 실제로 궁금해하는 질문 5가지`
      ],
      outline: [
        '왜 지금 이 키워드가 다시 뜨는가',
        '검색자가 가장 많이 묻는 핵심 질문',
        '비교해야 할 대안 또는 연관 키워드',
        '실전 판단 포인트와 주의할 오해',
        '마무리 요약과 다음 행동 제안'
      ],
      thumbnail: [
        '메인 피사체 1개 중심의 강한 장면',
        '키워드와 직접 연결되는 상징물 배치',
        '복잡한 텍스트 대신 대비 강한 색 조합',
        '정보형 주제면 차트/기기/문서형 오브젝트 활용'
      ]
    };
  }, [activeRecord, scanKeyword]);

  const handleStartKeywordScan = () => {
    if (!scanKeyword.trim()) {
      alert('추적 스캔할 타겟 키워드를 입력해 주세요!');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const searchVolume = Math.floor(Math.random() * 90000) + 8000;
      const docCount = Math.floor(Math.random() * 60000) + 800;
      const calculatedSaturation = parseFloat(((docCount / searchVolume) * 100).toFixed(1));
      const finalGrade = getGradeFromSaturation(calculatedSaturation);

      const newKeywordRow: GoldenKeyword = {
        id: String(Date.now()),
        keyword: scanKeyword.trim(),
        monthlySearch: searchVolume,
        totalDocs: docCount,
        saturation: calculatedSaturation,
        grade: finalGrade,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setGoldenList((prev) => [newKeywordRow, ...prev.filter((item) => item.keyword !== scanKeyword.trim())]);
      setRelatedList([
        { keyword: `${scanKeyword} 전망 분석`, docCount: Math.floor(Math.random() * 40000) + 10000, intent: '정보성', tip: '핵심 질문형 제목과 함께 쓰면 체류시간이 길어집니다.' },
        { keyword: `${scanKeyword} 최신 뉴스`, docCount: Math.floor(Math.random() * 30000) + 5000, intent: '급상승', tip: '실시간 이슈 연결형 본문으로 빠르게 발행하는 것이 중요합니다.' },
        { keyword: `${scanKeyword} 비교`, docCount: Math.floor(Math.random() * 18000) + 3000, intent: '상업성', tip: '대체재나 경쟁 대상을 함께 묶으면 클릭률이 높아집니다.' },
        { keyword: `${scanKeyword} 장단점`, docCount: Math.floor(Math.random() * 12000) + 1500, intent: '정보성', tip: '후기형 말투와 궁합이 좋아 블로그 문체에 잘 맞습니다.' },
        { keyword: `${scanKeyword} 추천`, docCount: Math.floor(Math.random() * 15000) + 2200, intent: '상업성', tip: '목록형 구성과 썸네일 조합이 특히 잘 먹히는 키워드입니다.' },
        { keyword: `${scanKeyword} 2026`, docCount: Math.floor(Math.random() * 9000) + 1000, intent: '급상승', tip: '연도 키워드를 붙이면 최신성 신호를 강조하기 좋습니다.' }
      ]);
      setActiveTab('opportunity');
      setIsAnalyzing(false);
    }, 1100);
  };

  const handleCopyRelatedKeywords = () => {
    navigator.clipboard.writeText(relatedList.map((item) => item.keyword).join(', '));
    alert('연관 키워드가 복사되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 pt-4">
      <div className="max-w-[1680px] mx-auto px-4 pb-6 space-y-4">
        <section className="rounded-[28px] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(10,12,16,0.98))] overflow-hidden shadow-2xl">
          <div className="grid gap-0 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  <Sparkles size={12} /> Keyword Decision Console
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    키워드 데이터를 보는 페이지가 아니라
                    <br />
                    글감 의사결정을 내리는 콘솔
                  </h1>
                  <p className="max-w-3xl text-sm md:text-[15px] leading-7 text-zinc-300">
                    검색량, 문서 포화도, 검색 의도, 실행 전략을 한 화면에서 판단하고 바로 글쓰기와 썸네일 작업으로 이어지게 만듭니다.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
                <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
                      추적할 메인 키워드
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={scanKeyword}
                          onChange={(e) => setScanKeyword(e.target.value)}
                          placeholder="예: 하이닉스 반도체"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 pl-11 pr-4 py-3.5 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40"
                        />
                      </div>
                      <button
                        onClick={handleStartKeywordScan}
                        disabled={isAnalyzing}
                        className="min-w-[180px] rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 px-5 py-3.5 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70"
                      >
                        {isAnalyzing ? (
                          <span className="inline-flex items-center gap-2">
                            <RefreshCw size={15} className="animate-spin" />
                            분석 중
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <BrainCircuit size={15} />
                            기회 스캔 시작
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">즉시 판정</p>
                    <p className="mt-3 text-lg font-black text-white">{diagnosis.headline}</p>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">{diagnosis.summary}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {keywordMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{metric.label}</p>
                    <p className={`mt-3 text-2xl font-black ${metric.tone}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l border-white/5 bg-black/10 p-6 md:p-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/75 p-5 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">실행 허브</p>
                    <h2 className="mt-2 text-xl font-black text-white">분석 끝나면 바로 작업으로</h2>
                  </div>
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-black text-blue-300">
                    READY
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Link href={`/studio/writing/naver/create`} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-emerald-500/30 hover:bg-zinc-900">
                    <div>
                      <p className="text-sm font-black text-white">이 키워드로 AI 스마트 글쓰기</p>
                      <p className="mt-1 text-[12px] text-zinc-500">메인 키워드를 그대로 넘겨 바로 원고 생성</p>
                    </div>
                    <ArrowRight size={16} className="text-emerald-400" />
                  </Link>

                  <Link href={`/studio/writing/naver/recreate`} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-blue-500/30 hover:bg-zinc-900">
                    <div>
                      <p className="text-sm font-black text-white">이 키워드로 AI 글 재창조</p>
                      <p className="mt-1 text-[12px] text-zinc-500">연관 기사나 경쟁 문서를 재구성하는 흐름</p>
                    </div>
                    <ArrowRight size={16} className="text-blue-400" />
                  </Link>

                  <Link href={`/studio/writing/naver/thumbnail`} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-amber-500/30 hover:bg-zinc-900">
                    <div>
                      <p className="text-sm font-black text-white">이 키워드로 썸네일 만들기</p>
                      <p className="mt-1 text-[12px] text-zinc-500">핵심 시각 요소를 바로 이미지 프롬프트로 연결</p>
                    </div>
                    <ArrowRight size={16} className="text-amber-400" />
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span className="text-sm font-black">이번 키워드 추천 액션</span>
                  </div>
                  <div className="grid gap-2 text-[12px] text-zinc-400">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">1. 메인 제목은 짧고 강하게, 질문형 보조 제목을 붙이기</div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">2. 연관 키워드 2개만 섞어 과도한 포화 신호 피하기</div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">3. 정보형 구조로 먼저 진입하고 상업형 CTA는 후반에 배치하기</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4 flex flex-wrap gap-2">
              {ANALYSIS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-[12px] font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-zinc-950'
                      : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {activeTab === 'opportunity' && activeRecord && (
                <>
                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <BarChart3 size={16} className="text-blue-400" />
                        <h3 className="text-lg font-black">키워드 판정 카드</h3>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm font-black text-white">
                          {activeRecord.keyword}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-black ${
                          activeRecord.grade === 'S급 황금'
                            ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
                            : activeRecord.grade === 'A급 우수'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : activeRecord.grade === '경쟁과열'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {activeRecord.grade}
                        </span>
                      </div>
                      <p className="mt-4 text-[14px] leading-7 text-zinc-400">
                        월 검색량은 <span className="font-black text-white">{formatNumber(activeRecord.monthlySearch)}</span>,
                        경쟁 문서 수는 <span className="font-black text-white">{activeRecord.totalDocs.toLocaleString()}개</span> 수준입니다.
                        이 키워드는 현재 <span className="font-black text-emerald-300">{diagnosis.headline}</span>
                      </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Lightbulb size={16} className="text-amber-400" />
                        <h3 className="text-lg font-black">검색 의도 분해</h3>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          { label: '정보형', value: `${getIntentMix(activeRecord.grade).info}%`, tone: 'bg-cyan-400' },
                          { label: '행동형', value: `${getIntentMix(activeRecord.grade).action}%`, tone: 'bg-emerald-400' },
                          { label: '트렌드형', value: `${getIntentMix(activeRecord.grade).trend}%`, tone: 'bg-rose-400' }
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-zinc-400">
                              <span>{item.label}</span>
                              <span>{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-900">
                              <div className={`h-2 rounded-full ${item.tone}`} style={{ width: item.value }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <h4 className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-500">왜 지금 써야 하나</h4>
                      <div className="mt-4 space-y-3 text-[13px] leading-6 text-zinc-400">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">검색량과 문서량 간격이 아직 남아 있어 신규 문서 진입 여지가 있습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">실시간 이슈, 비교 포인트, 질문형 제목으로 클릭각을 만들기 좋습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">네이버 블로그형 정보성 문체와 궁합이 좋아 체류시간 확보에 유리합니다.</div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <h4 className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-500">주의할 포화 신호</h4>
                      <div className="mt-4 space-y-3 text-[13px] leading-6 text-zinc-400">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">메인 키워드만 반복하는 제목은 경쟁 문서와 겹쳐 보일 수 있습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">서브 키워드는 2개 정도만 섞고, 정보 구조를 명확하게 나누는 편이 안전합니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">트렌드형 키워드일수록 발행 속도가 중요하므로 장문보다 구조화가 우선입니다.</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'related' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-white">연관 키워드 클러스터</h3>
                      <p className="mt-1 text-[13px] text-zinc-500">메인 키워드와 함께 쓰기 좋은 롱테일, 질문형, 비교형 조합입니다.</p>
                    </div>
                    <button onClick={handleCopyRelatedKeywords} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-[12px] font-black text-zinc-300 transition-all hover:text-white">
                      <span className="inline-flex items-center gap-2">
                        <Copy size={13} /> 연관 키워드 전체 복사
                      </span>
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {relatedList.map((item) => (
                      <div key={item.keyword} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-white">{item.keyword}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                            item.intent === '급상승'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                              : item.intent === '상업성'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}>
                            {item.intent}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">{item.docCount.toLocaleString()}개 문서</span>
                        </div>
                        <p className="mt-2 text-[13px] leading-6 text-zinc-400">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'execution' && (
                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <FileText size={15} className="text-emerald-400" />
                      <h3 className="text-lg font-black">추천 제목 5선</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {executionPlan.titleIdeas.map((item) => (
                        <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-[13px] font-medium text-zinc-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <LayoutGrid size={15} className="text-blue-400" />
                      <h3 className="text-lg font-black">소제목 구조 추천</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {executionPlan.outline.map((item, index) => (
                        <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-[13px] text-zinc-300">
                          <span className="mr-2 text-blue-400 font-black">{index + 1}.</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Lightbulb size={15} className="text-amber-400" />
                      <h3 className="text-lg font-black">썸네일 방향</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {executionPlan.thumbnail.map((item) => (
                        <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-[13px] text-zinc-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <TrendingUp size={15} className="text-emerald-400" />
                  <h3 className="text-sm font-black">실시간 트렌드</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">{trendList.length} INSIDE</span>
              </div>
              <div className="p-4 space-y-2">
                {trendList.map((trend) => (
                  <button
                    key={trend.rank}
                    onClick={() => setScanKeyword(trend.keyword)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left transition-all hover:border-emerald-500/20 hover:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono font-black text-emerald-400">{trend.rank}. {trend.category}</p>
                        <p className="mt-1 truncate text-[13px] font-bold text-white">{trend.keyword}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-300">+{trend.growth}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Database size={15} className="text-blue-400" />
                  <h3 className="text-sm font-black">내 보관함</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">{goldenList.length} RECORDS</span>
              </div>
              <div className="p-4 space-y-3">
                {goldenList.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-black text-white">{item.keyword}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        item.grade === 'S급 황금'
                          ? 'bg-yellow-500/10 text-yellow-300'
                          : item.grade === 'A급 우수'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : item.grade === '경쟁과열'
                          ? 'bg-rose-500/10 text-rose-300'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {item.grade}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{formatNumber(item.monthlySearch)}</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
