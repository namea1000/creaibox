"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  FileWarning,
  Gauge,
  Link2,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp
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

type DiagnosisTab = 'summary' | 'signals' | 'actions';

const DIAGNOSIS_TABS: Array<{ id: DiagnosisTab; label: string }> = [
  { id: 'summary', label: '진단 요약' },
  { id: 'signals', label: '위험 신호' },
  { id: 'actions', label: '개선 액션' }
];

const DIAGNOSIS_CONTEXT_KEY = 'naver-diagnosis-context-v1';

const INITIAL_HISTORY: DiagnosisHistory[] = [
  { id: '1', url: 'https://blog.naver.com/tech_master/2234567', keyword: 'AI 자동화 수익화', rank: 2, prevRank: 5, status: 'up', date: '2026-05-18' },
  { id: '2', url: 'https://blog.naver.com/food_hunter/2239876', keyword: '천안 맛집 TOP5', rank: 1, prevRank: 1, status: 'stable', date: '2026-05-17' },
  { id: '3', url: 'https://blog.naver.com/money_info/2231122', keyword: '2026 정부지원금', rank: 14, prevRank: 8, status: 'down', date: '2026-05-16' },
  { id: '4', url: 'https://blog.naver.com/realview/2237788', keyword: '가성비 무선 이어폰', rank: 6, prevRank: 11, status: 'up', date: '2026-05-15' }
];

function getExposureStatus(rank: number) {
  if (rank <= 3) return '상위권 안착';
  if (rank <= 10) return '노출 유지';
  if (rank <= 20) return '하락 주의';
  return '재정비 필요';
}

function getStatusTone(status: string) {
  if (status === '상위권 안착') return 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10';
  if (status === '노출 유지') return 'text-blue-300 border-blue-500/20 bg-blue-500/10';
  if (status === '하락 주의') return 'text-amber-300 border-amber-500/20 bg-amber-500/10';
  return 'text-rose-300 border-rose-500/20 bg-rose-500/10';
}

export default function RealtimeDiagnosisPage() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState('https://blog.naver.com/tech_master/2234567');
  const [targetKeyword, setTargetKeyword] = useState('AI 자동화 수익화');
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<DiagnosisTab>('summary');
  const [historyList, setHistoryList] = useState<DiagnosisHistory[]>(INITIAL_HISTORY);
  const [rankNow, setRankNow] = useState(2);
  const [prevRank, setPrevRank] = useState(5);
  const [totalScore, setTotalScore] = useState(88);
  const [bounceRate, setBounceRate] = useState(24.5);
  const [stayTime, setStayTime] = useState(142);
  const [indexScore, setIndexScore] = useState(95);
  const [snippetScore, setSnippetScore] = useState(86);
  const [freshnessScore, setFreshnessScore] = useState(79);

  const diagnosisStatus = useMemo(() => getExposureStatus(rankNow), [rankNow]);

  const diagnosisHeadline = useMemo(() => {
    if (diagnosisStatus === '상위권 안착') {
      return '현재 상위권 노출 흐름이 안정적입니다.';
    }
    if (diagnosisStatus === '노출 유지') {
      return '노출은 유지 중이지만 방어 작업이 필요합니다.';
    }
    if (diagnosisStatus === '하락 주의') {
      return '검색 결과에서 밀리는 신호가 감지되고 있습니다.';
    }
    return '문서 구조와 클릭 신호를 재정비해야 합니다.';
  }, [diagnosisStatus]);

  const scoreCards = useMemo(() => {
    return [
      { label: '현재 노출 순위', value: `${rankNow}위`, tone: 'text-emerald-400' },
      { label: '통합 진단 점수', value: `${totalScore}점`, tone: 'text-blue-400' },
      { label: '체류 시간', value: `${stayTime}초`, tone: 'text-cyan-400' },
      { label: '이탈률', value: `${bounceRate}%`, tone: 'text-amber-400' },
      { label: '스니펫 적합도', value: `${snippetScore}점`, tone: 'text-fuchsia-400' },
      { label: '최신성 지수', value: `${freshnessScore}점`, tone: 'text-rose-400' }
    ];
  }, [bounceRate, freshnessScore, rankNow, snippetScore, stayTime, totalScore]);

  const signalBlocks = useMemo(() => {
    return [
      {
        title: '클릭률 신호',
        score: `${snippetScore}점`,
        summary: '제목과 첫 문단이 검색 의도와 비교적 잘 맞고 있습니다. 다만 제목 각도가 조금 더 선명하면 상단 방어력이 좋아집니다.'
      },
      {
        title: '체류/이탈 신호',
        score: `${stayTime}초 / ${bounceRate}%`,
        summary: '본문 품질은 나쁘지 않지만, 초반 3문단 집중도가 약하면 이탈이 다시 올라갈 수 있습니다.'
      },
      {
        title: '최신성 신호',
        score: `${freshnessScore}점`,
        summary: '키워드 이슈가 빠르게 바뀌는 영역이라 날짜성 문구와 최근 업데이트 근거를 조금 더 강조하는 편이 좋습니다.'
      },
      {
        title: '색인/구조 신호',
        score: `${indexScore}점`,
        summary: '색인 상태는 양호합니다. 소제목 구조와 질문형 섹션을 유지하면 안정적으로 굴릴 수 있습니다.'
      }
    ];
  }, [bounceRate, freshnessScore, indexScore, snippetScore, stayTime]);

  const actionItems = useMemo(() => {
    return [
      '제목 앞부분 18자 안에 핵심 키워드와 차별 포인트를 함께 넣기',
      '첫 문단에서 검색자가 얻는 결론을 먼저 제시해 이탈률 낮추기',
      '중간 소제목 하나를 질문형으로 바꿔 검색 의도 일치도 높이기',
      '최근 데이터나 날짜 문구를 추가해 최신성 신호 보강하기',
      '썸네일 문구와 제목 방향을 맞춰 클릭 기대치와 실제 내용 간격 줄이기'
    ];
  }, []);

  const handleStartDiagnosis = async () => {
    if (!targetUrl.trim()) {
      alert('진단할 네이버 블로그 포스팅 URL을 입력해 주세요!');
      return;
    }

    if (!targetKeyword.trim()) {
      alert('추적할 타겟 핵심 키워드를 입력해 주세요!');
      return;
    }

    setIsScanning(true);

    try {
      const res = await fetch(
        `/api/naver/diagnosis?url=${encodeURIComponent(targetUrl.trim())}&keyword=${encodeURIComponent(targetKeyword.trim())}`
      );

      if (!res.ok) {
        if (res.status === 401) {
          alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData.error || '실시간 노출 진단 중 오류가 발생했습니다.');
        }
        setIsScanning(false);
        return;
      }

      const data = await res.json();

      const previousRank = rankNow;
      const nextRank = data.rank;
      const status: DiagnosisHistory['status'] = 
        nextRank === 101 ? 'out' : 
        nextRank < previousRank ? 'up' : 
        nextRank > previousRank ? 'down' : 'stable';

      const newDiagnosis: DiagnosisHistory = {
        id: String(Date.now()),
        url: targetUrl.trim(),
        keyword: targetKeyword.trim(),
        rank: nextRank,
        prevRank: previousRank,
        status,
        date: data.date
      };

      setRankNow(nextRank);
      setPrevRank(previousRank);
      setTotalScore(data.totalScore);
      setBounceRate(data.bounceRate);
      setStayTime(data.stayTime);
      setIndexScore(data.indexScore);
      setSnippetScore(data.snippetScore);
      setFreshnessScore(data.freshnessScore);
      setHistoryList((prev) => [newDiagnosis, ...prev]);
      setActiveTab('summary');
    } catch (e) {
      console.error(e);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyReport = () => {
    const report = [
      `키워드: ${targetKeyword}`,
      `현재 순위: ${rankNow}위`,
      `이전 순위: ${prevRank}위`,
      `통합 점수: ${totalScore}점`,
      `이탈률: ${bounceRate}%`,
      `체류시간: ${stayTime}초`,
      `판정: ${diagnosisHeadline}`
    ].join('\n');

    navigator.clipboard.writeText(report);
    alert('진단 리포트가 복사되었습니다.');
  };

  const moveWithDiagnosisContext = (destination: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        DIAGNOSIS_CONTEXT_KEY,
        JSON.stringify({
          keyword: targetKeyword,
          url: targetUrl,
          rankNow,
          prevRank,
          totalScore,
          bounceRate,
          stayTime,
          indexScore,
          snippetScore,
          freshnessScore,
          savedAt: new Date().toISOString()
        })
      );
    }

    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 pt-4">
      <div className="max-w-[1680px] mx-auto px-4 pb-6 space-y-4">
        <section className="rounded-[28px] border border-cyan-500/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_26%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(10,12,16,0.98))] shadow-2xl overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  <Activity size={12} /> Realtime Exposure Diagnosis
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    내 글이 왜 뜨는지,
                    <br />
                    왜 밀리는지를 바로 읽는 진단 콘솔
                  </h1>
                  <p className="max-w-3xl text-sm md:text-[15px] leading-7 text-zinc-300">
                    URL과 핵심 키워드를 넣으면 현재 노출 상태, 위험 신호, 고쳐야 할 액션을 한 번에 정리해줍니다.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
                <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">진단할 포스팅 URL</label>
                      <div className="relative">
                        <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          placeholder="https://blog.naver.com/..."
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 pl-11 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">추적 키워드</label>
                        <div className="relative">
                          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="text"
                            value={targetKeyword}
                            onChange={(e) => setTargetKeyword(e.target.value)}
                            placeholder="예: AI 자동화 수익화"
                            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 pl-11 pr-4 py-3.5 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleStartDiagnosis}
                        disabled={isScanning}
                        className="self-end rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-70"
                      >
                        {isScanning ? (
                          <span className="inline-flex items-center gap-2">
                            <RefreshCw size={15} className="animate-spin" />
                            진단 중
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Eye size={15} />
                            실시간 진단 시작
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">즉시 판정</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(diagnosisStatus)}`}>
                        {diagnosisStatus}
                      </span>
                      <span className="text-[12px] font-mono text-zinc-500">{prevRank}위 → {rankNow}위</span>
                    </div>
                    <p className="mt-3 text-lg font-black text-white">{diagnosisHeadline}</p>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      클릭 신호, 체류 시간, 최신성, 색인 구조를 종합해서 지금 가장 손대야 할 우선순위를 보여줍니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {scoreCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{card.label}</p>
                    <p className={`mt-3 text-2xl font-black ${card.tone}`}>{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l border-white/5 bg-black/10 p-6 md:p-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/75 p-5 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 결론</p>
                    <h2 className="mt-2 text-xl font-black text-white">왜 뜨고 왜 밀리는지 요약</h2>
                  </div>
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black text-cyan-300">
                    LIVE
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <TrendingUp size={15} className="text-emerald-400" />
                      <span className="text-sm font-black">상승 요인</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      체류 시간과 스니펫 적합도가 좋아서 검색자가 들어왔을 때 빠르게 이탈하지 않는 문서로 판단됩니다.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <FileWarning size={15} className="text-amber-400" />
                      <span className="text-sm font-black">경고 신호</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      최신성 지표가 흔들리면 순위가 다시 밀릴 수 있습니다. 날짜성 업데이트와 질문형 소제목 보강이 필요합니다.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ShieldCheck size={15} className="text-cyan-400" />
                      <span className="text-sm font-black">안전 진단</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      과도한 스팸 신호나 구조 붕괴는 보이지 않습니다. 지금은 벌점보다 “추가 최적화” 단계에 가깝습니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyReport}
                  className="mt-6 w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-[13px] font-black text-zinc-300 transition-all hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Copy size={14} /> 진단 리포트 복사
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4 flex flex-wrap gap-2">
              {DIAGNOSIS_TABS.map((tab) => (
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
              {activeTab === 'summary' && (
                <>
                  <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Gauge size={16} className="text-cyan-400" />
                        <h3 className="text-lg font-black">노출 상태 카드</h3>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(diagnosisStatus)}`}>
                          {diagnosisStatus}
                        </span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm font-black text-white">
                          {targetKeyword}
                        </span>
                      </div>
                      <p className="mt-4 text-[14px] leading-7 text-zinc-400">
                        현재 순위는 <span className="font-black text-white">{rankNow}위</span>이고, 직전 진단 대비 <span className="font-black text-cyan-300">{prevRank}위 → {rankNow}위</span> 흐름입니다.
                        이 문서는 지금 <span className="font-black text-white">{diagnosisHeadline}</span>
                      </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Clock3 size={16} className="text-amber-400" />
                        <h3 className="text-lg font-black">반응 품질 지표</h3>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          { label: '체류시간', value: `${stayTime}초`, width: `${Math.min(100, stayTime / 2)}%`, tone: 'bg-cyan-400' },
                          { label: '이탈률 안정도', value: `${Math.max(0, 100 - bounceRate).toFixed(1)}점`, width: `${Math.max(10, 100 - bounceRate)}%`, tone: 'bg-emerald-400' },
                          { label: '최신성 유지력', value: `${freshnessScore}점`, width: `${freshnessScore}%`, tone: 'bg-rose-400' }
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-zinc-400">
                              <span>{item.label}</span>
                              <span>{item.value}</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-900">
                              <div className={`h-2 rounded-full ${item.tone}`} style={{ width: item.width }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <h4 className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-500">왜 유지되고 있나</h4>
                      <div className="mt-4 space-y-3 text-[13px] leading-6 text-zinc-400">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">핵심 키워드와 본문 구조가 비교적 자연스럽게 맞물리고 있습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">검색자가 원하는 결론이 초반에 드러나 체류 신호가 안정적인 편입니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">현재까지는 과도한 위험 신호보다 개선 여지가 더 큰 상태입니다.</div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <h4 className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-500">어디서 밀릴 수 있나</h4>
                      <div className="mt-4 space-y-3 text-[13px] leading-6 text-zinc-400">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">제목 각도가 평이하면 새 경쟁 문서가 올라올 때 클릭률에서 밀릴 수 있습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">최근성 문구가 약하면 이슈형 키워드에서 신선도 신호가 떨어질 수 있습니다.</div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">중간 소제목이 단조로우면 체류시간이 줄고 후반 이탈이 빨라질 수 있습니다.</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'signals' && (
                <>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {signalBlocks.map((signal) => (
                      <div key={signal.title} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <AlertTriangle size={15} className="text-amber-400" />
                            <h3 className="text-lg font-black">{signal.title}</h3>
                          </div>
                          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-[11px] font-black text-white">{signal.score}</span>
                        </div>
                        <p className="mt-4 text-[13px] leading-6 text-zinc-400">{signal.summary}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'actions' && (
                <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      <h3 className="text-lg font-black">우선 개선 액션 5선</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {actionItems.map((item, index) => (
                        <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-[13px] text-zinc-300">
                          <span className="mr-2 font-black text-emerald-400">{index + 1}.</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ArrowRight size={15} className="text-cyan-400" />
                      <h3 className="text-lg font-black">다음 작업 연결</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={() => moveWithDiagnosisContext('/studio/writing/naver/list')}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left text-[13px] font-black text-white transition-all hover:border-emerald-500/20"
                      >
                        제목과 도입부를 수정실에서 바로 손보기
                      </button>
                      <button
                        onClick={() => moveWithDiagnosisContext('/studio/writing/naver/recreate')}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left text-[13px] font-black text-white transition-all hover:border-blue-500/20"
                      >
                        이 키워드로 보완 원고 다시 생성하기
                      </button>
                      <button
                        onClick={() => moveWithDiagnosisContext('/studio/writing/naver/thumbnail')}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left text-[13px] font-black text-white transition-all hover:border-amber-500/20"
                      >
                        클릭률 보완용 썸네일 방향 다시 잡기
                      </button>
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
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <h3 className="text-sm font-black">안전 신호</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">LIVE CHECK</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">유사도 방어</p>
                  <p className="mt-2 text-sm font-black text-emerald-300">0.0%</p>
                  <p className="mt-1 text-[12px] leading-5 text-zinc-500">과도한 복제 신호나 급격한 위험도는 감지되지 않습니다.</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">색인 구조</p>
                  <p className="mt-2 text-sm font-black text-cyan-300">{indexScore}점</p>
                  <p className="mt-1 text-[12px] leading-5 text-zinc-500">문서 구조는 양호하며 질문형 섹션 보강 시 더 좋아질 여지가 있습니다.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <BarChart3 size={15} className="text-blue-400" />
                  <h3 className="text-sm font-black">최근 진단 이력</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">{historyList.length} RECORDS</span>
              </div>
              <div className="p-4 space-y-3">
                {historyList.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-black text-white">{item.keyword}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        item.status === 'up'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : item.status === 'down'
                          ? 'bg-rose-500/10 text-rose-300'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {item.prevRank}위 → {item.rank}위
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="truncate">{item.url}</span>
                      <span>{item.date}</span>
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
