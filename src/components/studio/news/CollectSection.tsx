"use client";

import React, { useState } from "react";
import { Rss, Search, Newspaper, CheckCircle2, ChevronRight, Globe } from "lucide-react";

export default function CollectSection() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNews, setSelectedNews] = useState<string[]>([]);

  const mockNewsFeed = [
    {
      id: "news1",
      title: "구글 딥마인드, 스스로 진화하는 '자가 학습 에이전트' 모델 발표",
      desc: "사람의 피드백 없이도 환경에 최적화된 서브태스크를 도출하고 스스로 디버깅하여 성공율을 98%로 끌어올린 차세대 AI 엔진의 테스트 버전을 공개했습니다.",
      source: "글로벌 테크 데일리",
      date: "1시간 전",
    },
    {
      id: "news2",
      title: "국내 AI 의료 기기 스타트업, 2026년 미국 FDA 3등급 정식 승인 획득",
      desc: "뇌질환 조기 진단 보조 솔루션이 아시아 기업 최초로 엄격한 FDA 3등급 인증을 획득하며 미국 대형 병원 유통망에 전격 탑재될 예정입니다.",
      source: "메디컬 뉴스 투데이",
      date: "3시간 전",
    },
    {
      id: "news3",
      title: "EU AI Act 공식 발효, 글로벌 기업들의 규제 대응 비상등",
      desc: "인공지능 규제법안인 AI Act의 세부 과태료 기준 및 알고리즘 투명성 보고서 의무 조항이 공식 발효되면서 빅테크 기업들의 법무팀 검토가 시작되었습니다.",
      source: "유로 경제 포커스",
      date: "5시간 전",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1200);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedNews((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Rss size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">실시간 뉴스 수집 (Collect)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              관심 이슈 키워드 또는 특정 도메인 RSS 채널을 연동하여 최신 트렌드 뉴스를 수집합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 키워드 검색 엔진 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 자율행동 에이전트, 의료 AI 스타트업..."
              className="h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 pl-10 pr-3 text-sm text-zinc-950 dark:text-zinc-100 outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="h-11 rounded-xl bg-orange-600 px-6 text-sm font-black text-white hover:bg-orange-500 transition disabled:opacity-50"
          >
            {isSearching ? "수집 중..." : "실시간 뉴스 수집"}
          </button>
        </form>
      </div>

      {/* 수집 결과 목록 */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">실시간 뉴스 매칭 목록 ({mockNewsFeed.length}건)</h3>
          <button
            disabled={selectedNews.length === 0}
            className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-black text-white hover:bg-orange-500 transition disabled:opacity-50"
          >
            선택된 {selectedNews.length}개 뉴스 요약하기
          </button>
        </div>

        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />
            <p className="text-xs font-bold text-zinc-500">네이버 뉴스 및 글로벌 RSS 채널 피드 수집 중...</p>
          </div>
        )}

        {!isSearching && (
          <div className="space-y-3">
            {mockNewsFeed.map((news) => {
              const isSelected = selectedNews.includes(news.id);

              return (
                <div
                  key={news.id}
                  onClick={() => handleToggleSelect(news.id)}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition cursor-pointer ${
                    isSelected
                      ? "border-orange-500/60 bg-orange-500/10"
                      : "border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/20 hover:border-orange-500/35"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by row onClick
                    className="h-4 w-4 shrink-0 rounded border-zinc-800 text-orange-600 focus:ring-orange-500 mt-1 cursor-pointer"
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                        {news.source}
                      </span>
                      <span className="text-[10px] text-zinc-500">{news.date}</span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-150 leading-snug">
                      {news.title}
                    </h4>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {news.desc}
                    </p>
                  </div>

                  <button className="shrink-0 text-xs font-black text-orange-400 flex items-center gap-1 hover:text-orange-300 transition mt-1">
                    원문 파싱
                    <ChevronRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
