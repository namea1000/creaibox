"use client";

import React, { useEffect, useState } from 'react';
import { Flame, Bell, RefreshCcw, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
}

export default function NewsHomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [headline, setHeadline] = useState<NewsItem | null>(null);
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 뉴스 홈에서도 클릭한 기사를 모달로 띄우기 위한 상태값 추가
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchMainNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news?keyword=' + encodeURIComponent('주요뉴스 속보'));
      const data = await response.json();
      
      if (data && data.length > 0) {
        setNews(data); // 전체 데이터 보관
        setHeadline(data[0]); // 메인 헤드라인
        setBreakingNews(data.slice(1, 11)); // 속보를 10개로 넉넉하게 배치
      }
    } catch (error) {
      console.error("뉴스 홈 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainNews();
  }, []);

  // 모달 안에서 키보드 좌우 화살표, ESC로 조작하는 스마트 기능
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

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4 min-h-[500px]">
        <RefreshCcw className="animate-spin text-emerald-500" size={40} />
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.3em] italic">
          Connecting to Global News Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1200px] mx-auto">
      
      {/* 뉴스 상단 헤더 */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
            <Bell size={12} className="animate-bounce" /> Live News Update
          </div>
          <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            News <span className="text-emerald-500">Center</span>
          </h2>
        </div>
        <button 
          onClick={fetchMainNews}
          className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500/50 text-zinc-400 hover:text-white transition-all"
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      {/* 헤드라인 & 주요 뉴스 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 메인 헤드라인 카드 (이제 <a> 태그 대신 클릭 시 내부 모달 작동!) */}
        {headline && (
          <div 
            onClick={() => setSelectedIndex(0)}
            className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-[32px] border border-zinc-800 aspect-video block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img 
              src={headline.imageUrl} 
              alt="headline img"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800';
              }}
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 space-y-3 w-full">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg">
                {headline.source}
              </span>
              <h3 className="text-xl lg:text-3xl font-black text-white leading-tight tracking-tight line-clamp-2">
                {headline.title.split(' - ')[0]}
              </h3>
            </div>
          </div>
        )}

        {/* 속보/급상승 리스트 (클릭 시 개별 인덱스로 모달 오픈!) */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 sticky top-0 bg-[#05070a]/90 backdrop-blur-md z-10">
              <Flame size={18} className="text-orange-500" />
              <h3 className="text-lg font-black italic uppercase text-white tracking-tighter">Breaking News</h3>
            </div>
            <div className="space-y-4 mt-4">
              {breakingNews.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedIndex(index + 1)} // 헤드라인이 0번이므로 index + 1
                  className="flex items-center gap-4 group cursor-pointer border-b border-zinc-800/50 pb-4 last:border-0 min-w-0"
                >
                  <span className="text-emerald-500 font-black italic text-lg shrink-0">{index + 1}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors truncate">
                      {item.title.split(' - ')[0]}
                    </p>
                    <span className="text-[10px] text-zinc-600 font-medium">{item.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 팝업창 모달 뷰어 아키텍처 (대문 전용) */}
      {selectedIndex !== null && news[selectedIndex] && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); if(selectedIndex > 0) setSelectedIndex(selectedIndex - 1); }}
            disabled={selectedIndex === 0}
            className={`absolute left-4 lg:left-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-emerald-600 hover:border-emerald-500'
            }`}
          >
            <ChevronLeft size={28} />
          </button>

          <div 
            className="w-full max-w-[1100px] h-[85vh] bg-[#05070a] rounded-[32px] overflow-hidden border border-zinc-800/80 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 bg-zinc-900/50 border-b border-zinc-800/80 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-md shrink-0">
                  {news[selectedIndex].source}
                </span>
                <span className="text-zinc-400 text-xs font-bold truncate max-w-[300px] lg:max-w-[600px]">
                  {news[selectedIndex].title}
                </span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <a 
                  href={news[selectedIndex].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700/50"
                >
                  원문 새창보기 <ExternalLink size={12} />
                </a>
                <button 
                  onClick={() => setSelectedIndex(null)}
                  className="p-1.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white relative">
              <iframe 
                src={news[selectedIndex].link} 
                className="w-full h-full border-0"
                title="news-viewer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); if(selectedIndex < news.length - 1) setSelectedIndex(selectedIndex + 1); }}
            disabled={selectedIndex === news.length - 1}
            className={`absolute right-4 lg:right-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === news.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-emerald-600 hover:border-emerald-500'
            }`}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* 섹션 하단 테일 */}
      <div className="py-16 border-t border-zinc-900 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl lg:text-3xl font-black italic uppercase tracking-[0.2em] text-zinc-800">
          Creaibox News <span className="text-emerald-500/20">Aggregator</span>
        </h2>
        <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-[0.4em] italic">
          구글 RSS 및 오픈그래프 융합 미디어 아키텍처 가동 중
        </p>
      </div>

    </div>
  );
}