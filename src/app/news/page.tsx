"use client";

import React, { useEffect, useState } from 'react';
import { Flame, Bell, RefreshCcw, ChevronLeft, ChevronRight, X, ExternalLink, Award, Globe, ShieldAlert, Cpu } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
  description: string;
}

const CATEGORIES = [
  { id: 'all', name: '종합', keyword: '주요뉴스 속보' },
  { id: 'politics', name: '정치', keyword: '정치 속보 국회' },
  { id: 'economy', name: '경제', keyword: '경제 금융 시황' },
  { id: 'society', name: '사회', keyword: '사회 뉴스 사건' },
  { id: 'culture', name: '생활/문화', keyword: '문화 예술 생활 트렌드' },
  { id: 'world', name: '세계', keyword: '국제 세계 뉴스 외신' },
  { id: 'it', name: 'IT/과학', keyword: 'IT 과학 테크 AI 반도체' }
];

export default function NewsHomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [headline, setHeadline] = useState<NewsItem | null>(null);
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [gridNews, setGridNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchMainNews = async (catId: string) => {
    setIsLoading(true);
    const targetCat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
    try {
      const response = await fetch('/api/news?keyword=' + encodeURIComponent(targetCat.keyword));
      const data = await response.json();

      if (data && data.length > 0) {
        setNews(data);
        setHeadline(data[0]);
        setBreakingNews(data.slice(1, 6)); // 속보는 딱 5개로 정갈하게
        setGridNews(data.slice(6, 12)); // 하단 그리드에 남은 6개
      } else {
        setNews([]);
        setHeadline(null);
        setBreakingNews([]);
        setGridNews([]);
      }
    } catch (error) {
      console.error("뉴스 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainNews(activeCategory);
  }, [activeCategory]);

  // 모달 제어 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight' && selectedIndex < news.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, news]);

  // 시간 표시 포맷 함수
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return '방금 전';
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffHours < 24) return `${diffHours}시간 전`;
      return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    } catch (e) {
      return '';
    }
  };

  // Skeleton UI Renderer (체감 속도 300% 향상용 골격 레이아웃)
  const renderSkeleton = () => (
    <div className="space-y-10 animate-pulse">
      {/* 헤드라인 & 속보 Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full aspect-video bg-zinc-800/60 rounded-[24px]" />
          <div className="h-6 w-1/4 bg-zinc-800/60 rounded-md" />
          <div className="h-8 w-3/4 bg-zinc-800/60 rounded-md" />
          <div className="h-4 w-full bg-zinc-800/60 rounded-md" />
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-[24px] p-6 space-y-6">
          <div className="h-6 w-1/3 bg-zinc-800/60 rounded-md" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-zinc-800/60 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-5/6 bg-zinc-800/60 rounded-md" />
                  <div className="h-3 w-1/4 bg-zinc-800/60 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 그리드 6개 카드형 Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="border border-zinc-800/80 rounded-2xl p-4 space-y-4">
            <div className="w-full h-40 bg-zinc-800/60 rounded-xl" />
            <div className="h-5 w-5/6 bg-zinc-800/60 rounded-md" />
            <div className="h-3 w-1/3 bg-zinc-800/60 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1240px] mx-auto min-h-screen">
      
      {/* 뉴스 상단 포털 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800/80 pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-500 font-extrabold text-xs uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-Time News Hub
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Creaibox</span>
            <span className="text-emerald-500 font-light border-l border-zinc-700 pl-2">NEWS</span>
          </h2>
        </div>
        
        {/* 네이버 뉴스 형태 카테고리 탭 네비게이션 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-black rounded-full transition-all whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/10'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button 
            onClick={() => fetchMainNews(activeCategory)}
            className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all shrink-0 ml-1"
          >
            <RefreshCcw size={13} />
          </button>
        </div>
      </div>

      {isLoading ? renderSkeleton() : (
        <div className="space-y-10">
          {/* 헤드라인 & 속보 메인 레이아웃 (네이버 뉴스 홈구조) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. 메인 헤드라인 (좌측 2칸 차지) */}
            {headline && (
              <div 
                onClick={() => setSelectedIndex(0)}
                className="lg:col-span-2 group cursor-pointer space-y-4"
              >
                <div className="relative overflow-hidden rounded-[24px] border border-zinc-200 dark:border-zinc-800/80 bg-zinc-900 aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <img 
                    src={headline.imageUrl} 
                    alt={headline.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800';
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-500/90 text-white text-[10px] font-black rounded">
                      {headline.source}
                    </span>
                    <span className="px-2.5 py-0.5 bg-black/60 text-zinc-300 text-[10px] font-bold rounded">
                      {formatTime(headline.pubDate)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl lg:text-2xl font-black text-zinc-900 dark:text-white leading-snug group-hover:text-emerald-500 transition-colors">
                    {headline.title}
                  </h3>
                  <p className="text-xs text-zinc-650 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
                    {headline.description}
                  </p>
                </div>
              </div>
            )}

            {/* 2. 주요 속보 리스트 (우측 1칸 차지) */}
            <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/80 rounded-[24px] p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white">실시간 주요 뉴스</h3>
                </div>
                <div className="space-y-3">
                  {breakingNews.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedIndex(index + 1)} // 헤드라인이 0이므로 index + 1
                      className="flex gap-3 group cursor-pointer border-b border-zinc-200 dark:border-zinc-800/30 pb-3 last:border-0"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-zinc-800/30">
                        <img 
                          src={item.imageUrl} 
                          alt="thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=150';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-350 leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold">
                          <span>{item.source}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span>{formatTime(item.pubDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. 하단 카테고리 뉴스 피드 (3열 카드 그리드) */}
          {gridNews.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-emerald-500" />
                <h3 className="text-base font-black text-zinc-900 dark:text-white">이 시각 테마 뉴스</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridNews.map((item, index) => {
                  const globalIndex = index + 6; // 헤드라인(0) + 속보(5) 다음 순서
                  return (
                    <div 
                      key={index}
                      onClick={() => setSelectedIndex(globalIndex)}
                      className="group cursor-pointer border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/10 rounded-2xl p-4 hover:border-emerald-500/40 hover:shadow-md dark:hover:bg-zinc-900/20 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-950">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300';
                            }}
                          />
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-emerald-500 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-550 dark:text-zinc-500 font-bold pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                        <span>{item.source}</span>
                        <span>{formatTime(item.pubDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🌟 팝업창 모달 뷰어 (Iframe 기반 우회) */}
      {selectedIndex !== null && news[selectedIndex] && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 md:p-6 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); if(selectedIndex > 0) setSelectedIndex(selectedIndex - 1); }}
            disabled={selectedIndex === 0}
            className={`absolute left-2 md:left-4 lg:left-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-emerald-600 hover:border-emerald-500'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            className="w-full max-w-[1100px] h-[88vh] bg-[#05070a] rounded-[24px] overflow-hidden border border-zinc-800 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 bg-zinc-900/80 border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded shrink-0">
                  {news[selectedIndex].source}
                </span>
                <span className="text-zinc-350 text-xs font-black truncate max-w-[200px] md:max-w-[500px] lg:max-w-[700px]">
                  {news[selectedIndex].title}
                </span>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <a 
                  href={news[selectedIndex].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700/50"
                >
                  기사 원문보기 <ExternalLink size={11} />
                </a>
                <button 
                  onClick={() => setSelectedIndex(null)}
                  className="p-1.5 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Iframe View (CORS 및 프레임 킬러 우회를 위한 가이드 표시) */}
            <div className="flex-1 bg-white relative flex flex-col">
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-amber-500" />
                일부 언론사 사이트는 보안 정책상 임베디드 뷰를 차단할 수 있습니다. 화면이 로드되지 않을 시 우측 상단의 '기사 원문보기'를 클릭하십시오.
              </div>
              <iframe 
                src={news[selectedIndex].link} 
                className="w-full flex-1 border-0"
                title="news-viewer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); if(selectedIndex < news.length - 1) setSelectedIndex(selectedIndex + 1); }}
            disabled={selectedIndex === news.length - 1}
            className={`absolute right-2 md:right-4 lg:right-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === news.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-emerald-600 hover:border-emerald-500'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* 섹션 하단 테일 */}
      <div className="py-12 border-t border-zinc-200 dark:border-zinc-900/60 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-xl font-black text-zinc-400 dark:text-zinc-700 tracking-wider">
          CREAIBOX NEWS AGGREGATOR
        </h2>
        <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.4em] italic">
          High-Speed Decoded URL & Scraped Data Engine
        </p>
      </div>

    </div>
  );
}