"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Eye, Palette } from "lucide-react";

interface DesignTemplate {
  id: string;
  title: string;
  category: "thumbnail" | "card" | "poster" | "banner" | "logo";
  width: number;
  height: number;
  url: string;
  badge: string;
}

export default function TemplatesTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "전체 템플릿" },
    { id: "thumbnail", label: "📺 유튜브 썸네일" },
    { id: "card", label: "🗂️ 카드뉴스" },
    { id: "poster", label: "📄 홍보 포스터" },
    { id: "banner", label: "📢 웹 광고 배너" },
    { id: "logo", label: "🎨 로고 & BI" },
  ];

  const templates: DesignTemplate[] = [
    {
      id: "tmp-1",
      title: "사이버펑크 감성 유튜브 테크 썸네일",
      category: "thumbnail",
      width: 1280,
      height: 720,
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      badge: "POPULAR",
    },
    {
      id: "tmp-2",
      title: "성공을 부르는 1인 기업 브랜딩 명함",
      category: "logo",
      width: 900,
      height: 500,
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      badge: "NEW",
    },
    {
      id: "tmp-3",
      title: "미니멀리즘 인테리어 카드뉴스 스케치",
      category: "card",
      width: 1080,
      height: 1080,
      url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
      badge: "RECOMMENDED",
    },
    {
      id: "tmp-4",
      title: "트렌디 봄맞이 신상품 론칭 배너",
      category: "banner",
      width: 1200,
      height: 400,
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
      badge: "SALE",
    },
    {
      id: "tmp-5",
      title: "심플 헬스/필라테스 강좌 수강생 모집 포스터",
      category: "poster",
      width: 2480,
      height: 3508,
      url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      badge: "HOT",
    },
    {
      id: "tmp-6",
      title: "미래형 AI 로봇 머신러닝 개발 웹 배너",
      category: "banner",
      width: 1200,
      height: 400,
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      badge: "TECH",
    },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchCategory = activeCategory === "all" || template.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() || template.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleUseTemplate = (template: DesignTemplate) => {
    router.push(
      `/studio/image/workspace?width=${template.width}&height=${template.height}&templateId=${template.id}&imageUrl=${encodeURIComponent(template.url)}&title=${encodeURIComponent(template.title)}`
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* Search and Category navigation bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800/60 backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="템플릿 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-purple-500/50"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/10"
                  : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid layout */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-950 p-3 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:border-purple-500/30"
            >
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.url}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <span className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.8 bg-purple-600 border border-purple-500 rounded text-white shadow-md font-sans">
                  {template.badge}
                </span>

                <span className="absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-zinc-800 rounded text-zinc-300 font-mono">
                  {template.width} x {template.height} px
                </span>
                
                {/* Hover overlay CTA */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
                  >
                    <Palette size={12} /> 템플릿 사용하기
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <h3 className="text-xs font-black text-zinc-200 line-clamp-1 group-hover:text-white transition">
                  {template.title}
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 mt-1.5 uppercase font-mono tracking-wider">
                  category: {template.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 py-20 text-center text-zinc-500 text-xs font-bold">
          검색어와 연치하는 디자인 템플릿이 없습니다.
        </div>
      )}

    </div>
  );
}
