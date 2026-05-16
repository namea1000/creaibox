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

// 🌟 반드시 export default function 이어야 합니다!
export default function PoliticsContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

 const fetchPoliticsNews = async () => {
  setIsLoading(true);
  try {
    // 🌟 백엔드 API 배달원에게 '국회 정당 대통령 선거 정부' 키워드를 주문합니다!
    const response = await fetch('/api/news?keyword=' + encodeURIComponent('국회 정당 대통령 선거 정부'));
    const data = await response.json();
    setNews(data);
  } catch (error) {
    console.error("정치 뉴스 로드 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchPoliticsNews();
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
        <RefreshCcw className="animate-spin text-blue-500" size={40} />
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.3em] italic">
          Syncing Politics Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
            <Layers size={20} className="text-blue-500" /> POLITICS
          </h3>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
            실시간 정당 및 정책 트렌드 인텔리전스 판넬
          </p>
        </div>
        <button 
          onClick={fetchPoliticsNews}
          className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-blue-500/50 text-zinc-400 hover:text-white transition-all"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, index) => (
          <div 
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="group flex gap-5 p-5 bg-zinc-900/20 border border-zinc-800/60 rounded-[28px] hover:border-blue-500/40 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden"
          >
            <div className="w-28 h-24 lg:w-36 lg:h-24 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 relative border border-zinc-800">
              <img 
                src={item.imageUrl} 
                alt="news thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=500';
                }}
              />
            </div>
            
            <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {item.source}
                </span>
                <h4 className="text-sm lg:text-base font-bold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-2 tracking-tight">
                  {item.title.split(' - ')[0]}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                <Clock size={11} />
                {new Date(item.pubDate).toLocaleDateString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            onClick={goPrev}
            disabled={selectedIndex === 0}
            className={`absolute left-4 lg:left-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${
              selectedIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-500'
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
                <span className="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-md shrink-0">
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
              selectedIndex === news.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-500'
            }`}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}