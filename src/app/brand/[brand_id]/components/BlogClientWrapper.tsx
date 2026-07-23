"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarDays, Sparkles, ArrowRight, Rss, ArrowLeft, Tag,
  Sun, Moon, Search, X 
} from "lucide-react";

interface PublishedPost {
  id: string;
  title: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  seo_tags: string[] | null;
  created_at: string | null;
  category_id?: string | null;
  thumbnailUrl?: string | null;
  canonical_url?: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogClientWrapperProps {
  brand_id: string;
  profile: any;
  categories: BlogCategory[];
  initialPosts: PublishedPost[];
  initialTheme?: "light" | "dark";
}

export default function BlogClientWrapper({
  brand_id,
  profile,
  categories,
  initialPosts,
  initialTheme
}: BlogClientWrapperProps) {
  // 1. Theme State (default to initialTheme or light)
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme || "light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // 2. Search & Pagination States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  // Reset pagination on search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(`blog_theme_${brand_id}`) as "light" | "dark" | null;
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
    setIsThemeLoaded(true);
  }, [brand_id]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(`blog_theme_${brand_id}`, nextTheme);
    document.cookie = `blog_theme_${brand_id}=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
  };

  // Helper formatting functions
  const buildExcerpt = (post: PublishedPost) => {
    const source = (post.meta_description || post.focus_keyword || "인사이트 포스팅").trim();
    return source.length > 130 ? `${source.slice(0, 130)}...` : source;
  };

  const formatDate = (value: string | null) => {
    if (!value) return "날짜 미상";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "날짜 미상";
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  };

  // 3. Filter posts based on searchQuery
  const filteredPosts = initialPosts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (post.title || "").toLowerCase().includes(q);
    const descMatch = (post.meta_description || "").toLowerCase().includes(q);
    const tagMatch = (post.seo_tags || []).some(t => t.toLowerCase().includes(q));
    return titleMatch || descMatch || tagMatch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const configs = profile.extra_configs || {};
  const isPrimary = brand_id.toLowerCase() === (profile.brand_id || "").toLowerCase();

  const getConf = (key: string, fallback: string = ""): string => {
    if (isPrimary) return configs[key] || fallback;
    return configs[`${key}_${brand_id.toLowerCase()}`] || configs[key] || fallback;
  };

  const blogTitle = getConf("blog_title", `${profile.nickname || brand_id} 블로그`);
  const blogDesc = getConf("blog_description", "CreAibox에서 생성한 고품질 콘텐츠 블로그입니다.");
  const template = getConf("blog_template", "card");
  const accentColor = getConf("blog_accent_color", "#3b82f6");
  const gaId = getConf("ga_id");
  const primaryId = profile.brand_id || "";
  let adsensePubId = "";
  if (configs[`adsense_pub_id_${brand_id}`]) {
    adsensePubId = configs[`adsense_pub_id_${brand_id}`];
  } else if (brand_id === primaryId && configs.adsense_pub_id) {
    adsensePubId = configs.adsense_pub_id;
  }

  // 4. Custom Palette for Downhubs-like Soft Gray Dark Mode vs clean Light Mode
  // Theme styling helpers based on active state
  const bgStyle = theme === "dark" 
    ? "bg-[#181a20] text-[#e2e8f0]" 
    : "bg-[#f4f6fa] text-[#1e293b]";

  const headerBg = theme === "dark"
    ? "bg-[#1e222b] border-[#2a2f3a]"
    : "bg-white border-[#e2e8f0]";

  const cardBg = theme === "dark"
    ? "border-[#2a2f3a] bg-[#1e222b]/40 hover:bg-[#1e222b]/70 hover:border-[#383e4c]"
    : "border-[#e2e8f0] bg-white hover:bg-zinc-50/50 hover:border-zinc-300/60";

  const cardText = theme === "dark" ? "text-white" : "text-[#1e293b]";
  const cardDesc = theme === "dark" ? "text-zinc-400" : "text-[#475569]";
  const cardBorder = theme === "dark" ? "border-[#2a2f3a]" : "border-[#e2e8f0]";

  const inputStyle = theme === "dark"
    ? "border-[#2a2f3a] bg-[#15171d] text-white focus:border-[#3b82f6]"
    : "border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] focus:border-[#3b82f6]";

  const toggleBtnBg = theme === "dark" ? "bg-[#15171d]" : "bg-zinc-100";

  // Prevent flicker on load by using a loader-free placeholder state or empty class during load
  const visibleClass = "opacity-100";

  // Format AdSense client ID correctly (must be in ca-pub-XXXXXXXXXXXXXXXX format)
  const adsenseClient = adsensePubId
    ? (adsensePubId.startsWith("ca-pub-")
        ? adsensePubId
        : (adsensePubId.startsWith("pub-")
            ? `ca-${adsensePubId}`
            : `ca-pub-${adsensePubId}`))
    : "";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-150 font-sans selection:bg-blue-500/30 selection:text-blue-200 ${bgStyle} ${visibleClass}`}>
      {/* Google AdSense Integration */}
      {adsenseClient && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      )}

      {/* Google Analytics Integration */}
      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        </>
      )}

      {/* 🌟 Premium Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors ${headerBg}`}>
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span 
              className="text-2xl font-black italic tracking-tighter uppercase transition-colors"
              style={{ color: accentColor }}
            >
              {blogTitle}
            </span>
          </Link>

          {/* Navigation Categories */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-bold transition-colors ${theme === "dark" ? "text-zinc-100 hover:text-white" : "text-zinc-800 hover:text-black"}`}>
              전체글
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`text-sm font-bold transition-colors ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Controls: Theme Switcher & Search */}
          <div className="flex items-center gap-4">
            {/* 🌓 Theme Toggle Switch (Downhubs-like capsule switch with dashed border) */}
            <button
              onClick={toggleTheme}
              className={`relative flex items-center justify-between w-14 h-7 rounded-full p-1 cursor-pointer border-2 border-dashed transition-colors duration-300 ${
                theme === "dark" 
                  ? "border-zinc-500 bg-[#15171d]" 
                  : "border-zinc-400 bg-zinc-100"
              }`}
              aria-label="Toggle theme"
            >
              {/* Moon Icon */}
              <Moon size={12} className={`text-zinc-400 transition-opacity z-10 ${theme === "dark" ? "opacity-100" : "opacity-40"}`} />
              {/* Sun Icon */}
              <Sun size={12} className={`text-amber-500 transition-opacity z-10 ${theme === "light" ? "opacity-100" : "opacity-40"}`} />
              
              {/* Thumb */}
              <div 
                className={`absolute top-0.5 left-0.5 bg-blue-500 w-5 h-5 rounded-full transition-transform duration-300 ${
                  theme === "light" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>

            {/* 🔍 Search Toggle / Bar */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="검색어 입력..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-40 md:w-56 px-3 py-1.5 text-xs font-bold rounded-lg border outline-none transition-colors ${inputStyle}`}
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }} 
                    aria-label="검색창 닫기"
                    className={`p-1.5 rounded-lg transition-colors ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="검색창 열기"
                  className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}`}
                >
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 Premium Gradient Banner Section */}
      <section className={`relative overflow-hidden border-b transition-colors ${theme === "dark" ? "border-[#2a2f3a] bg-zinc-900/10 py-4" : "border-[#e2e8f0] bg-zinc-200/20 py-4"}`}>
        {/* Colorful backgrounds */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_50%)]" />
        <div 
          className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(circle_at_bottom_left,var(--accent),transparent_40%)]" 
          style={{ "--accent": accentColor } as React.CSSProperties}
        />
        
        <div className="mx-auto max-w-7xl px-6 text-center space-y-3">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur-sm ${
            theme === "dark" 
              ? "border-zinc-800 bg-[#1e222b]/60 text-zinc-300" 
              : "border-zinc-200 bg-white/60 text-zinc-600"
          }`}>
            <Sparkles size={12} className="text-yellow-400" /> Professional Media Publisher
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
            {blogTitle}
          </h1>
        </div>
      </section>

      {/* 🌟 Main content body */}
      <main className="mx-auto max-w-7xl px-6 py-16 flex-1 w-full">
        {currentPosts.length === 0 ? (
          <div className={`border px-8 py-24 text-center space-y-4 rounded-2xl ${theme === "dark" ? "border-zinc-900 bg-zinc-900/10" : "border-zinc-200 bg-white"}`}>
            <p className={`text-lg font-black ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
              {searchQuery ? "검색 결과에 맞는 글이 없습니다." : "아직 발행된 글이 없습니다."}
            </p>
            <p className="text-sm font-bold text-zinc-500">
              {searchQuery ? "다른 키워드로 검색을 시도해 보세요." : "CreAibox 글쓰기 에디터에서 글을 작성하고 승인된 브랜드 블로그에 발행해 보세요."}
            </p>
          </div>
        ) : (
          <div>
            {/* Visual Templates Rendering */}
            
            {/* 1. NEWS Template */}
            {template === "news" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {currentPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  const postCategory = categories.find(c => c.id === post.category_id);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className={`block border-b pb-6 transition-all hover:opacity-80 ${theme === "dark" ? "border-zinc-850" : "border-zinc-200"}`}
                    >
                      <div className="flex items-center gap-2 text-xs font-black tracking-wider text-zinc-500 mb-2">
                        {postCategory && (
                          <span className={`flex items-center gap-1 border rounded px-2 py-0.5 ${
                            theme === "dark" 
                              ? "text-zinc-400 border-zinc-800 bg-[#1e222b]" 
                              : "text-zinc-600 border-zinc-200 bg-white"
                          }`}>
                            <Tag size={10} /> {postCategory.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <h2 className={`text-2xl font-black group-hover:text-blue-400 transition-colors ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                        {post.title}
                      </h2>
                      <p className={`mt-3 text-sm font-bold leading-relaxed line-clamp-2 ${cardDesc}`}>
                        {excerpt}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 2. LIST Template */}
            {template === "list" && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {currentPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  const postCategory = categories.find(c => c.id === post.category_id);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className={`group flex flex-col md:flex-row gap-6 rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${cardBg}`}
                    >
                      <div className="relative aspect-[16/10] md:w-[260px] shrink-0 overflow-hidden rounded-[6px] bg-zinc-950">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                            <Sparkles size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                            {postCategory && (
                              <span className={`text-xs font-black ${theme === "dark" ? "text-zinc-300" : "text-zinc-600"}`}>{postCategory.name}</span>
                            )}
                            {postCategory && <span>•</span>}
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <h2 className={`text-lg font-black transition-colors group-hover:text-blue-400 line-clamp-2 ${cardText}`}>
                            {post.title}
                          </h2>
                          <p className={`text-sm font-bold leading-relaxed line-clamp-2 ${cardDesc}`}>
                            {excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 3. CARD Template (Default) */}
            {template === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  const postCategory = categories.find(c => c.id === post.category_id);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className={`group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 ${cardBg}`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                            <Sparkles size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-1 flex-col p-6 justify-between">
                        {/* 상단: 제목 & 설명 */}
                        <div className="space-y-3">
                          <h2 className={`line-clamp-2 text-lg font-black leading-tight transition-colors group-hover:text-blue-400 ${cardText}`}>
                            {post.title}
                          </h2>
                          <p className={`line-clamp-3 text-sm font-bold leading-relaxed ${cardDesc}`}>
                            {excerpt}
                          </p>
                        </div>
                        
                        {/* 하단: 날짜 | 카테고리 (가운데) | 글 더보기 -> (우측) */}
                        <div className={`mt-3.5 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                          theme === "dark" ? "border-zinc-800/80 text-zinc-500" : "border-zinc-100 text-zinc-500"
                        }`}>
                          {/* 날짜 */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <CalendarDays size={13} />
                            <span>{formatDate(post.created_at)}</span>
                          </div>

                          {/* 가운데: 카테고리 */}
                          <div className="flex-1 flex justify-center items-center px-2 min-w-0">
                            {postCategory && (
                              <span className={`inline-flex items-center justify-center truncate max-w-full rounded px-2 py-0.5 text-[10px] font-black border leading-none ${
                                theme === "dark"
                                  ? "text-zinc-400 border-zinc-800 bg-[#1e222b]/50"
                                  : "text-zinc-600 border-zinc-200 bg-zinc-50"
                              }`}>
                                {postCategory.name}
                              </span>
                            )}
                          </div>

                          {/* 제일 오른쪽: 글 더보기 -> */}
                          <div className="flex items-center gap-1 shrink-0 text-blue-500 group-hover:text-blue-400 transition-colors font-black">
                            <span>글 더보기</span>
                            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                    currentPage === 1
                      ? "cursor-not-allowed border-zinc-200/40 text-zinc-400/50"
                      : theme === "dark"
                      ? "border-zinc-800 bg-[#1e222b] text-zinc-300 hover:border-blue-400 hover:text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-400 hover:text-blue-700"
                  }`}
                >
                  <ArrowLeft size={12} /> 이전
                </button>
                <span className={`text-xs font-bold ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-black transition-colors ${
                    currentPage === totalPages
                      ? "cursor-not-allowed border-zinc-200/40 text-zinc-400/50"
                      : theme === "dark"
                      ? "border-zinc-800 bg-[#1e222b] text-zinc-300 hover:border-blue-400 hover:text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-400 hover:text-blue-700"
                  }`}
                >
                  다음 <ArrowRight size={12} />
                </button>
              </div>
            )}

          </div>
        )}
      </main>

      {/* 🌟 Footer */}
      <footer className={`border-t py-12 transition-colors ${theme === "dark" ? "border-zinc-900 bg-[#1e222b]" : "border-zinc-200 bg-white"}`}>
        <div className={`mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center text-xs font-bold ${theme === "dark" ? "text-zinc-500" : "text-zinc-650"}`}>
          <div>
            &copy; {new Date().getFullYear()} {blogTitle}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className={`hover:text-zinc-400 ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"}`}>Home</Link>
            <span className={`${theme === "dark" ? "text-zinc-800" : "text-zinc-350"}`}>|</span>
            <span className="text-zinc-500">Powered by CreAibox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
