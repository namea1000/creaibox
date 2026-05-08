import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function NaverSearchTab() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // 새 창으로 네이버 검색 결과 전송
    window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#05070a] p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#03C75A] italic tracking-tighter uppercase mb-1">
          Naver Quick Search
        </h2>
        <p className="text-[15px] font-bold text-zinc-500 uppercase tracking-widest">
          국내 최신 정보와 블로그 트렌드는 네이버에서 바로 확인하세요.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full mt-12">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="네이버에서 검색할 내용을 입력하세요..."
            className="w-full bg-zinc-900/50 border-2 border-zinc-800 text-white px-6 py-5 rounded-2xl text-lg focus:outline-none focus:border-[#03C75A] transition-all duration-300 pr-16"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#03C75A] p-3 rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Search className="text-white w-6 h-6" />
          </button>
        </form>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <p className="text-[#03C75A] text-[15px] font-black uppercase mb-1">Search Tip</p>
            <p className="text-zinc-600 text-xs">엔터를 치거나 돋보기를 누르면 새 탭에서 결과가 열립니다.</p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <p className="text-[#03C75A] text-[15px] font-black uppercase mb-1">Data Source</p>
            <p className="text-zinc-600 text-xs">블로그, 카페, 뉴스 등 국내 데이터를 수집할 때 유리합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}