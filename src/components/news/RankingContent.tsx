"use client";

import React, { useEffect, useState } from 'react';
import { 
  ExternalLink, Clock, RefreshCcw, ChevronLeft, 
  ChevronRight, X, Layers 
} from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
}

export default function RankingContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 🌟 랭킹 뉴스 전용 패칭 엔진 가동 (함수명 명확하게 일치시켜 빌드 에러 차단)
  const fetchRankingNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news?keyword=' + encodeURIComponent('인기뉴스 화제 이슈 실시간 HOT'));
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("랭킹 뉴스 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingNews();
  }, []);

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

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < news.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4 min-h-[500px]">
        {/* 🌟 랭킹 보드 전용 테마 컬러 싱크 매칭 */}
        <RefreshCcw className="animate-spin text-orange-500" size={40} />
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.3em] italic">
          Sorting Hot Boards... {/* 🌟 빌드 에러를 유발하던 IT 과학 찌꺼기 완벽 교정 */}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto">
      
      {/* 서브 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
            <Layers size={20} className="text-orange-500" /> HOT <span className="text-orange-500">RANKING</span>
          </h3>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
            대중들이 지금 이 순간 가장 많이 주목하고 있는 실시간 HOT 화제 뉴스
          </p>
        </div>
        <button 
          onClick={fetchRankingNews}
          className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 text-zinc-400 hover:text-white transition-all"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* 🌟 럭셔리 다크 뉴스 그리드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, index) => (
          <div 
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="group flex gap-5 p-5 bg-zinc-900/20 border border-zinc-800/60 rounded-[28px] hover:border-orange-500/40 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden"
          >
            {/* 🌟 실시간 순위 넘버링 뱃지 레이아웃 주입 */}
            <div className="absolute top-3 left-3 w-7 h-7 bg-orange-600/90 text-white rounded-full flex items-center justify-center text-xs font-black italic z-10 shadow-md">
              {index + 1}
            </div>

            {/* 뉴스 대표 이미지 */}
            <div className="w-28 h-24 lg:w-36 lg:h-24 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 relative border border-zinc-800">
              <img 
                src={item.imageUrl} 
                alt="news thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500'; // 🌟 트렌디한 랭킹용 매거진 배너 이미지 대체
                }}
              />
            </div>
            
            {/* 뉴스 텍스트 컨텐츠 */}
            <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-md">
                  {item.source}
                </span>
                <h4 className="text-sm lg:text-base font-bold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-2 tracking-tight pl-1">
                  {item.title.split(' - ')[0]}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 pl-1">
                <Clock size={11} />
                {new Date(item.pubDate).toLocaleDateString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 초호화 인페이지 슬라이드 뷰어 모달 */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            onClick={goPrev}
            disabled={selectedIndex === 0}
            className={`absolute left-4 lg:left-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-orange-600 hover:border-orange-500'
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
                <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-md shrink-0">
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
            onClick={goNext}
            disabled={selectedIndex === news.length - 1}
            className={`absolute right-4 lg:right-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === news.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-orange-600 hover:border-orange-500'
            }`}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

    </div>
  );
}