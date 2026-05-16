"use client";

import React, { useEffect, useState } from 'react';
import { 
  ExternalLink, Clock, RefreshCcw, ChevronLeft, 
  ChevronRight, X, Newspaper, Layers 
} from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
  description: string;
}

export default function ItContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 인페이지 뷰어(모달) 상태 관리
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchItNews = async () => {
  setIsLoading(true);
  try {
    // 🌟 백엔드 API 배달원에게 'IT 과학' 뉴스를 가져오라고 주문을 넣습니다.
    const response = await fetch('/api/news?keyword=' + encodeURIComponent('IT 과학 테크 AI 모바일 인공지능'));
    const data = await response.json();
    setNews(data);
  } catch (error) {
    console.error("IT 뉴스 로드 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchItNews();
  }, []);


  // 🌟 키보드 좌/우 방향키 및 ESC 제어 로직
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

  // 이전/다음 기사 이동 핸들러
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 닫힘 방지
    if (selectedIndex !== null && selectedIndex < news.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 닫힘 방지
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // 로딩 화면 UI
  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4 min-h-[500px]">
        <RefreshCcw className="animate-spin text-emerald-500" size={40} />
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.3em] italic">
          Syncing IT & Science Intelligence...
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
    <Layers size={20} className="text-emerald-500" /> IT & <span className="text-emerald-500">SCIENCE</span>
  </h3>
  <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
    최신 테크, AI 인공지능 트렌드, 모바일 및 차세대 과학 기술 판넬
  </p>
</div>
        <button 
          onClick={fetchItNews}
          className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-emerald-500/50 text-zinc-400 hover:text-white transition-all"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* 🌟 럭셔리 다크 뉴스 그리드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, index) => (
          <div 
            key={index}
            onClick={() => setSelectedIndex(index)} // 클릭 시 해당 인덱스로 모달 개방
            className="group flex gap-5 p-5 bg-zinc-900/20 border border-zinc-800/60 rounded-[28px] hover:border-emerald-500/40 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden"
          >
            {/* 뉴스 대표 이미지 (OG Image) */}
            <div className="w-28 h-24 lg:w-36 lg:h-24 bg-zinc-800 rounded-2xl overflow-hidden shrink-0 relative border border-zinc-800">
              <img 
                src={item.imageUrl} 
                alt="news thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500'; // 멋진 대체 테크 이미지
                }}
              />
            </div>
            
            {/* 뉴스 텍스트 컨텐츠 */}
            <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {item.source}
                </span>
                <h4 className="text-sm lg:text-base font-bold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-2 tracking-tight">
                  {item.title.split(' - ')[0]} {/* 구글 특유의 언론사 꼬리표 잘라내기 */}
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

{/* 🌟 [최종 단계] 실제 사진 + 실제 본문 연동 인앱 매거진 뷰어 모달 */}
{selectedIndex !== null && (
  <div 
    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 lg:p-10 animate-in fade-in duration-200"
    onClick={() => setSelectedIndex(null)}
  >
    {/* 왼쪽 화살표 버튼 */}
    <button 
      onClick={goPrev} 
      disabled={selectedIndex === 0} 
      className={`absolute left-4 lg:left-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${selectedIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-cyan-600 hover:border-cyan-500'}`}
    >
      <ChevronLeft size={28} />
    </button>

    {/* 메인 팝업 카드 */}
    <div 
      className="w-full max-w-[700px] bg-[#090d14] rounded-[32px] overflow-hidden border border-zinc-800/80 shadow-2xl flex flex-col relative p-8 space-y-6 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 상단 바 */}
      <div className="flex justify-between items-center border-b border-zinc-800/60 pb-4">
        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-black rounded-lg border border-cyan-500/20">
          {news[selectedIndex].source}
        </span>
        <button onClick={() => setSelectedIndex(null)} className="p-1.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      {/* 📸 실제 기사의 현장 고화질 썸네일 액자 */}
      <div className="w-full h-64 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 relative shadow-inner">
        <img 
          src={news[selectedIndex].imageUrl} 
          alt="real news cover" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500';
          }}
        />
      </div>

      {/* 뉴스 기사 제목 */}
      <h2 className="text-xl lg:text-2xl font-black text-zinc-100 leading-snug tracking-tight">
        {news[selectedIndex].title}
      </h2>

      {/* 📝 [대망의 본문 출력 영역] 모달을 이탈하지 않고 바로 읽는 가독성 극대화 공간 */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 max-h-48 overflow-y-auto custom-scrollbar">
        <p className="text-sm text-zinc-300 leading-relaxed tracking-normal font-medium">
          {news[selectedIndex].description || '본 기사의 상세 요약본을 구성 중입니다.'}
        </p>
      </div>

      {/* 원문 언론사 페이지 링크 액션 버튼 */}
      <div className="pt-2">
        <a 
          href={news[selectedIndex].link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-center font-black rounded-2xl flex items-center justify-center gap-2 text-base shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          언론사 원문 페이지로 직접 이동 <ExternalLink size={18} />
        </a>
      </div>
    </div>

    {/* 오른쪽 화살표 버튼 */}
    <button 
      onClick={goNext} 
      disabled={selectedIndex === news.length - 1} 
      className={`absolute right-4 lg:right-8 p-3 bg-zinc-900/80 border border-zinc-800 text-white rounded-full transition-all z-20 ${selectedIndex === news.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-cyan-600 hover:border-cyan-500'}`}
    >
      <ChevronRight size={28} />
    </button>
  </div>
)}

    </div>
  );
}