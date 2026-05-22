"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Copy,
  Eye,
  FileText,
  Flame,
  Layers3,
  LayoutGrid,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Spline,
  Target
} from 'lucide-react';

type GuideTab = 'principles' | 'checklist' | 'pitfalls' | 'playbook';

interface GuideSection {
  id: GuideTab;
  title: string;
  subtitle: string;
}

interface ScenarioPlay {
  title: string;
  summary: string;
  tactic: string;
  route: string;
}

const GUIDE_SECTIONS: GuideSection[] = [
  { id: 'principles', title: '핵심 원칙', subtitle: '네이버 글이 통하는 기본 로직' },
  { id: 'checklist', title: '발행 체크리스트', subtitle: '올리기 전 반드시 확인할 것' },
  { id: 'pitfalls', title: '금지 패턴', subtitle: '밀리기 쉬운 작성 습관' },
  { id: 'playbook', title: '실전 플레이북', subtitle: '바로 적용할 작성 흐름' }
];

export default function CRankGuidePage() {
  const [activeSection, setActiveSection] = useState<GuideTab>('principles');

  const copyGuideSummary = () => {
    const payload = [
      '네이버 글쓰기 핵심 가이드',
      '1. 한 문서 안에서 주제를 한 방향으로 밀어라.',
      '2. 제목, 첫 문단, 소제목이 같은 검색 의도를 향해야 한다.',
      '3. 경험형 문장과 구조화된 정보형 문장을 같이 써라.',
      '4. 과도한 키워드 반복보다 검색자 질문 해결이 우선이다.',
      '5. 발행 후 썸네일과 클릭률까지 함께 관리하라.'
    ].join('\n');

    navigator.clipboard.writeText(payload);
    alert('가이드 요약이 복사되었습니다.');
  };

  const principleCards = useMemo(() => [
    {
      title: '주제 일관성',
      desc: '제목, 첫 문단, 소제목, 결론이 같은 질문을 향해야 합니다. 한 문서 안에서 방향이 흔들리면 검색 의도 적합도가 떨어집니다.'
    },
    {
      title: '경험 + 정보 혼합',
      desc: '정리형 정보만 있으면 평범해지고, 경험담만 있으면 검색형 문서로 약해집니다. 두 가지를 섞어야 체류시간이 좋아집니다.'
    },
    {
      title: '클릭 후 만족도',
      desc: '제목이 강해도 본문 첫 3문단이 기대를 못 채우면 이탈이 빨라집니다. 초반에 바로 핵심 답을 보여줘야 합니다.'
    },
    {
      title: '지속적 최신성',
      desc: '특히 시의성 키워드는 발행 후 끝이 아니라 업데이트가 중요합니다. 날짜, 최근 사례, 최신 흐름이 계속 보강돼야 합니다.'
    }
  ], []);

  const checklistItems = useMemo(() => [
    '제목 앞부분에 핵심 키워드와 차별 포인트가 함께 들어갔는가',
    '첫 문단 3줄 안에 검색자가 얻을 결론이 드러나는가',
    '소제목이 질문형 또는 비교형 구조를 포함하는가',
    '키워드를 억지 반복하지 않고 자연스럽게 녹였는가',
    '중간 문단마다 정보, 사례, 해석이 번갈아 배치되는가',
    '썸네일 방향과 제목의 기대치가 서로 어긋나지 않는가'
  ], []);

  const pitfalls = useMemo(() => [
    {
      title: '제목만 세고 본문이 약한 글',
      detail: '클릭은 받아도 초반 이탈이 빠르게 올라갑니다. 제목의 وعد وعد를 첫 문단에서 바로 회수해야 합니다.'
    },
    {
      title: '키워드만 반복하는 과최적화 문장',
      detail: '문장 흐름이 부자연스러워지고 검색자 만족도가 떨어집니다. 키워드보다 질문 해결 구조가 우선입니다.'
    },
    {
      title: '정보는 많은데 구조가 없는 글',
      detail: '좋은 내용도 읽기 어렵게 보이면 체류시간이 줄어듭니다. 정보의 양보다 섹션 분배가 더 중요할 때가 많습니다.'
    },
    {
      title: '전부 비슷한 톤으로 흘러가는 문서',
      detail: '강조 구간, 사례 구간, 요약 구간이 구분되지 않으면 검색자에게 납작한 문서처럼 보입니다.'
    }
  ], []);

  const playbook = useMemo(() => [
    {
      step: '1. 검색 의도 확정',
      text: '이 키워드가 정보형인지, 비교형인지, 구매형인지 먼저 정합니다.'
    },
    {
      step: '2. 제목 각도 선택',
      text: '단순 설명이 아니라 “왜 지금 봐야 하는지”가 드러나는 제목으로 잡습니다.'
    },
    {
      step: '3. 첫 문단 결론화',
      text: '도입부에서 바로 핵심 답을 주고, 뒤에서 근거와 사례를 풀어갑니다.'
    },
    {
      step: '4. 소제목 분배',
      text: '질문형, 비교형, 체크리스트형 소제목을 섞어 리듬을 만듭니다.'
    },
    {
      step: '5. 발행 후 점검',
      text: '진단 페이지에서 이탈률, 체류시간, 클릭 기대치를 보고 다시 보완합니다.'
    }
  ], []);

  const beforeAfterExamples = useMemo(() => [
    {
      label: '제목 각도',
      weak: '삼성전자 주가 전망',
      strong: '삼성전자 주가 2026년 하반기 전망: 지금 봐야 할 반등 신호 3가지'
    },
    {
      label: '도입부 시작',
      weak: '오늘은 삼성전자 주가에 대해 알아보겠습니다.',
      strong: '지금 삼성전자 주가를 봐야 하는 이유는 반도체 업황 회복 기대가 숫자로 확인되기 시작했기 때문입니다.'
    },
    {
      label: '소제목 구조',
      weak: '주가, 실적, 전망',
      strong: '왜 다시 오르기 시작했나 / 아직 조심해야 할 신호는 무엇인가 / 지금 대응 전략은 어떻게 가져갈까'
    }
  ], []);

  const scenarioPlays = useMemo<ScenarioPlay[]>(() => [
    {
      title: '정보형 키워드',
      summary: '개념 설명, 정리, 순서 안내가 중요한 키워드',
      tactic: '첫 문단에서 결론을 먼저 주고, 본문은 질문형 소제목으로 나눕니다.',
      route: '키워드 분석 → 스마트 글쓰기'
    },
    {
      title: '비교형 키워드',
      summary: 'A vs B, 장단점, 선택 기준이 핵심인 키워드',
      tactic: '표형 정리와 추천 대상 분기를 넣어 검색자가 바로 선택하게 만듭니다.',
      route: '키워드 분석 → 스마트 글쓰기 → 썸네일'
    },
    {
      title: '재작성형 키워드',
      summary: '기존 글을 더 강한 구조로 다시 밀어야 하는 상황',
      tactic: '원본 글의 약한 도입부와 제목을 먼저 교체하고, 소제목 리듬을 다시 짭니다.',
      route: '노출 진단 → AI 글 재창조'
    }
  ], []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 pt-4">
      <div className="max-w-[1680px] mx-auto px-4 pb-6 space-y-4">
        <section className="rounded-[28px] border border-emerald-500/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(10,12,16,0.98))] shadow-2xl overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  <Sparkles size={12} /> Naver Writing Guide
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    알고리즘을 외우는 페이지가 아니라
                    <br />
                    통하는 글을 쓰는 원칙을 익히는 가이드
                  </h1>
                  <p className="max-w-3xl text-sm md:text-[15px] leading-7 text-zinc-300">
                    C-Rank, DIA+, 스마트블록 같은 용어를 외우기보다 중요한 건 하나입니다. 검색자가 기대한 답을 빠르게 주고, 끝까지 읽히는 구조를 만드는 것. 이 페이지는 그 감각을 바로 익히게 만드는 실전 가이드입니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 원칙</p>
                  <p className="mt-3 text-2xl font-black text-emerald-400">4가지</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">발행 체크</p>
                  <p className="mt-3 text-2xl font-black text-blue-400">6항목</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">금지 패턴</p>
                  <p className="mt-3 text-2xl font-black text-amber-400">4유형</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">실전 흐름</p>
                  <p className="mt-3 text-2xl font-black text-fuchsia-400">5단계</p>
                </div>
              </div>
            </div>

            <div className="border-l border-white/5 bg-black/10 p-6 md:p-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/75 p-5 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">빠른 이해</p>
                    <h2 className="mt-2 text-xl font-black text-white">이 가이드의 핵심 한 줄</h2>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-300">
                    SIMPLE
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Compass size={15} className="text-emerald-400" />
                      <span className="text-sm font-black">검색 의도에 맞는 구조를 짜라</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">무슨 말을 하는지보다, 검색자가 어떤 답을 기대하는지에 맞는 구조가 먼저입니다.</p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Eye size={15} className="text-blue-400" />
                      <span className="text-sm font-black">클릭 이후 만족도를 챙겨라</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">제목으로 끌어온 뒤 본문 초반에서 바로 답을 주는 문서가 오래 살아남습니다.</p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ShieldCheck size={15} className="text-cyan-400" />
                      <span className="text-sm font-black">과최적화보다 자연스러운 설득이 우선</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">키워드 반복보다 경험형 문장, 구조화, 정보의 정리력이 더 중요하게 작동합니다.</p>
                  </div>
                </div>

                <button
                  onClick={copyGuideSummary}
                  className="mt-6 w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-[13px] font-black text-zinc-300 transition-all hover:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Copy size={14} /> 가이드 핵심 요약 복사
                  </span>
                </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Flame size={15} className="text-blue-400" />
                      <span className="text-sm font-black">제일 먼저 고칠 곳</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                      제목, 첫 문단, 첫 번째 소제목. 이 세 곳만 바꿔도 읽히는 체감이 확 달라집니다.
                    </p>
                  </div>
                </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4 flex flex-wrap gap-2">
              {GUIDE_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-full px-4 py-2 text-[12px] font-black transition-all ${
                    activeSection === section.id
                      ? 'bg-white text-zinc-950'
                      : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Spline size={15} className="text-blue-400" />
                    <h3 className="text-lg font-black">좋은 문서의 골격</h3>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">1. 제목</p>
                      <p className="mt-2 text-[13px] leading-6 text-zinc-300">핵심 키워드 + 차별 포인트 + 지금 봐야 하는 이유</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">2. 첫 문단</p>
                      <p className="mt-2 text-[13px] leading-6 text-zinc-300">서론을 길게 끌지 말고 결론과 기대 효용을 먼저 제시</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">3. 본문 전개</p>
                      <p className="mt-2 text-[13px] leading-6 text-zinc-300">정보, 사례, 해석, 요약이 반복 리듬을 만들도록 설계</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">4. 마무리</p>
                      <p className="mt-2 text-[13px] leading-6 text-zinc-300">다음 행동이나 선택 기준을 정리해 검색 만족도를 완성</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Layers3 size={15} className="text-emerald-400" />
                    <h3 className="text-lg font-black">전/후 예시</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {beforeAfterExamples.map((example) => (
                      <div key={example.label} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{example.label}</p>
                        <div className="mt-3 rounded-2xl border border-red-500/10 bg-red-500/5 px-3 py-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-300">약한 버전</p>
                          <p className="mt-1 text-[13px] leading-6 text-zinc-400">{example.weak}</p>
                        </div>
                        <div className="mt-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">강한 버전</p>
                          <p className="mt-1 text-[13px] leading-6 text-zinc-200">{example.strong}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {activeSection === 'principles' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {principleCards.map((card) => (
                    <div key={card.title} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Target size={15} className="text-emerald-400" />
                        <h3 className="text-lg font-black">{card.title}</h3>
                      </div>
                      <p className="mt-4 text-[13px] leading-6 text-zinc-400">{card.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'checklist' && (
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <h3 className="text-lg font-black">발행 전 체크리스트</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {checklistItems.map((item, index) => (
                      <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-[13px] text-zinc-300">
                        <span className="mr-2 font-black text-emerald-400">{index + 1}.</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'pitfalls' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {pitfalls.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <AlertTriangle size={15} className="text-amber-400" />
                        <h3 className="text-lg font-black">{item.title}</h3>
                      </div>
                      <p className="mt-4 text-[13px] leading-6 text-zinc-400">{item.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'playbook' && (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <LayoutGrid size={15} className="text-blue-400" />
                      <h3 className="text-lg font-black">실전 플레이북</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                      {playbook.map((item) => (
                        <div key={item.step} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
                          <p className="text-[13px] font-black text-white">{item.step}</p>
                          <p className="mt-1 text-[13px] leading-6 text-zinc-400">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <FileText size={15} className="text-fuchsia-400" />
                      <h3 className="text-lg font-black">상황별 공략 루트</h3>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {scenarioPlays.map((scenario) => (
                        <div key={scenario.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                          <p className="text-sm font-black text-white">{scenario.title}</p>
                          <p className="mt-2 text-[13px] leading-6 text-zinc-400">{scenario.summary}</p>
                          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">핵심 전술</p>
                            <p className="mt-2 text-[13px] leading-6 text-zinc-300">{scenario.tactic}</p>
                          </div>
                          <div className="mt-3 text-[12px] font-black text-emerald-300">{scenario.route}</div>
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
                  <BookOpen size={15} className="text-blue-400" />
                  <h3 className="text-sm font-black">바로 실행</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">NEXT</span>
              </div>
              <div className="p-4 space-y-3">
                <Link href="/studio/writing/naver/create" className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-emerald-500/20 hover:bg-zinc-900">
                  <div>
                    <p className="text-sm font-black text-white">AI 스마트 글쓰기</p>
                    <p className="mt-1 text-[12px] text-zinc-500">가이드 원칙을 바로 원고 생성에 적용</p>
                  </div>
                  <ArrowRight size={16} className="text-emerald-400" />
                </Link>

                <Link href="/studio/writing/naver/keyword" className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-blue-500/20 hover:bg-zinc-900">
                  <div>
                    <p className="text-sm font-black text-white">키워드 분석으로 이동</p>
                    <p className="mt-1 text-[12px] text-zinc-500">검색 의도와 글감 방향 먼저 점검</p>
                  </div>
                  <ArrowRight size={16} className="text-blue-400" />
                </Link>

                <Link href="/studio/writing/naver/diagnosis" className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-amber-500/20 hover:bg-zinc-900">
                  <div>
                    <p className="text-sm font-black text-white">실시간 노출 진단</p>
                    <p className="mt-1 text-[12px] text-zinc-500">발행 후 실제 반응을 다시 점검</p>
                  </div>
                  <ArrowRight size={16} className="text-amber-400" />
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Lightbulb size={15} className="text-amber-400" />
                  <h3 className="text-sm font-black">실전 기억법</h3>
                </div>
                <span className="text-[10px] font-black text-zinc-500">MEMO</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">한 줄 공식</p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    강한 제목 + 빠른 결론 + 구조화된 본문 + 경험형 문장 + 발행 후 보완
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">가장 많이 하는 실수</p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    키워드만 반복하고, 정작 검색자가 원하는 답을 늦게 주는 문서
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">제일 먼저 고칠 곳</p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    제목과 첫 문단, 그리고 첫 번째 소제목
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">실전 판단 기준</p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    이 글을 처음 보는 사람이 10초 안에 “무슨 글인지, 왜 읽어야 하는지” 알 수 있으면 방향이 맞습니다.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
