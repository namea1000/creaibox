"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface BlogItem {
  id: string;
  title: string;
  desc: string;
  slug: string;
  dateStr: string;
  thumb: string | null;
  category?: string;
}

interface BlogListPaginatedViewProps {
  posts: BlogItem[];
  companyName: string;
  initialPage?: number;
  categories?: string[];
}

export default function BlogListPaginatedView({
  posts,
  companyName,
  initialPage = 1,
  categories = ["전체", "행사대행", "교육서비스", "가족캠프", "소통소식"],
}: BlogListPaginatedViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [activePage, setActivePage] = useState<number>(initialPage);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  // Reset page to 1 when category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setActivePage(1);
  };

  // Filter posts dynamically
  const filteredPosts = selectedCategory === "전체"
    ? posts
    : posts.filter((p) => (p.category || "소통소식") === selectedCategory);

  const ITEMS_PER_PAGE = 12;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, activePage), totalPages);

  const paginatedPosts = filteredPosts.slice(
    (validPage - 1) * ITEMS_PER_PAGE,
    validPage * ITEMS_PER_PAGE
  );

  const handlePageSelect = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === validPage) return;
    setActivePage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 280, behavior: "smooth" });
      const newUrl = `${window.location.pathname}?page=${newPage}`;
      window.history.pushState({ page: newPage }, "", newUrl);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-3">
        <h3 className="text-lg font-bold text-slate-800">아직 등록된 블로그 글이 없습니다</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          크리에이박스 에디터를 사용하여 첫 비즈니스 블로그 아티클을 작성해 보세요.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 🌟 Interactive Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 border cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <h3 className="text-base font-bold text-slate-800">선택하신 &apos;{selectedCategory}&apos; 카테고리에 글이 없습니다</h3>
          <p className="text-xs text-slate-500 font-medium">다른 카테고리를 선택하시거나 전체보기를 눌러주세요.</p>
        </div>
      ) : (
        /* Posts 3x4 Grid (12 items limit per page) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Panel */}
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  {post.thumb ? (
                    <img
                      src={post.thumb}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/10 via-slate-100 to-indigo-900/10 flex items-center justify-center text-slate-400">
                      <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                        {companyName}
                      </span>
                    </div>
                  )}
                </div>

              {/* Text Content */}
              <div className="p-6 space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-3 leading-relaxed">
                  {post.desc}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <CalendarDays size={14} className="text-slate-400" />
                  <span>{post.dateStr}</span>
                </div>

                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                  <span>글 더보기</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      )}

      {/* 🌟 중앙 하단 페이지네이션 조작 바 (0.00초 즉시 전환) */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 border-t border-slate-200/80 pt-8">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* 이전 페이지 버튼 */}
            {validPage > 1 ? (
              <button
                type="button"
                onClick={() => handlePageSelect(validPage - 1)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-extrabold text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-black transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={16} /> 이전
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed">
                <ChevronLeft size={16} /> 이전
              </span>
            )}

            {/* 페이지 번호들 */}
            <div className="flex items-center gap-1.5 mx-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pNum) => {
                  if (totalPages <= 7) return true;
                  if (pNum === 1 || pNum === totalPages) return true;
                  return Math.abs(pNum - validPage) <= 2;
                })
                .map((pNum, idx, arr) => {
                  const prev = arr[idx - 1];
                  const isEllipsis = prev && pNum - prev > 1;

                  return (
                    <React.Fragment key={pNum}>
                      {isEllipsis && (
                        <span className="px-2 text-xs font-extrabold text-slate-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageSelect(pNum)}
                        className={`min-w-[38px] h-9 px-3 flex items-center justify-center text-xs font-black rounded-xl transition-all cursor-pointer ${
                          validPage === pNum
                            ? "bg-black text-white shadow-md border border-black"
                            : "bg-white text-slate-800 border border-slate-200 hover:border-black hover:bg-slate-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            {/* 다음 페이지 버튼 */}
            {validPage < totalPages ? (
              <button
                type="button"
                onClick={() => handlePageSelect(validPage + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-extrabold text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-black transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                다음 <ChevronRight size={16} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed">
                다음 <ChevronRight size={16} />
              </span>
            )}
          </div>

          {/* 총 정보 카운터 */}
          <span className="text-xs font-bold text-slate-400">
            총 <span className="text-black font-black">{totalPosts}</span>개 포스팅 중{" "}
            <span className="text-black font-black">{validPage}</span> / {totalPages} 페이지
          </span>
        </div>
      )}
    </>
  );
}
