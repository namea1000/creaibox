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

interface CategoryClientWrapperProps {
  brand_id: string;
  profile: any;
  category: BlogCategory;
  categories: BlogCategory[];
  initialPosts: PublishedPost[];
  initialTheme?: "light" | "dark";
}

export default function CategoryClientWrapper({
  brand_id,
  profile,
  category,
  categories,
  initialPosts,
  initialTheme
}: CategoryClientWrapperProps) {
  // 1. Theme State (default to initialTheme or light)
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme || "light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // 2. Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter posts based on searchQuery
  const filteredPosts = initialPosts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (post.title || "").toLowerCase().includes(q);
    const descMatch = (post.meta_description || "").toLowerCase().includes(q);
    const tagMatch = (post.seo_tags || []).some(t => t.toLowerCase().includes(q));
    return titleMatch || descMatch || tagMatch;
  });

  const configs = profile.extra_configs || {};
  const isPrimary = brand_id.toLowerCase() === (profile.brand_id || "").toLowerCase();

  const getConf = (key: string, fallback: string = ""): string => {
    if (isPrimary) return configs[key] || fallback;
    return configs[`${key}_${brand_id.toLowerCase()}`] || configs[key] || fallback;
  };

  const blogTitle = getConf("blog_title", `${profile.nickname || brand_id} 블로그`);
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

  const activeHeaderLink = theme === "dark" ? "text-white" : "text-zinc-900";
  const inactiveHeaderLink = theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black";

  const introBg = theme === "dark"
    ? "border-b border-[#2a2f3a] bg-zinc-900/10"
    : "border-b border-[#e2e8f0] bg-white/40";

  const introText = theme === "dark" ? "text-zinc-400" : "text-zinc-500";

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
      
      {/* 🌟 Premium Header (Matching Main and Detail) */}
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
            <Link href="/" className={`text-sm font-bold transition-colors ${inactiveHeaderLink}`}>
              전체글
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`text-sm font-bold transition-colors ${
                  cat.id === category.id 
                    ? `${activeHeaderLink} underline decoration-blue-500 decoration-2 underline-offset-4` 
                    : inactiveHeaderLink
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Controls: Theme Switcher & Search */}
          <div className="flex items-center gap-4">
            {/* 🌓 Theme Toggle Switch */}
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

      {/* Category Intro Section */}
      <section className={`relative py-4 ${introBg}`}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_40%)]" />
        
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="space-y-2 flex flex-col items-center">
            <Link 
              href="/"
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${introText} hover:opacity-80 transition-opacity`}
            >
              <ArrowLeft size={12} /> 블로그 홈
            </Link>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-3 ${cardText}`}>
              <Tag className="text-blue-500 shrink-0" size={24} />
              {category.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Main content body */}
      <main className="mx-auto max-w-7xl px-6 py-16 flex-1">
        {filteredPosts.length === 0 ? (
          <div className={`rounded-[32px] border px-8 py-24 text-center space-y-4 ${cardBg}`}>
            <p className={`text-lg font-black ${cardText}`}>검색 결과 혹은 이 카테고리에 발행된 글이 없습니다.</p>
            <p className={`text-sm font-bold ${cardDesc}`}>
              다른 키워드로 검색을 시도해 보세요.
            </p>
          </div>
        ) : (
          <div>
            {/* Visual Templates Rendering */}
            
            {/* 1. NEWS Template */}
            {template === "news" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {filteredPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group block border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-all hover:opacity-80"
                    >
                      <div className="text-xs font-black tracking-wider text-zinc-500 mb-2">
                        {formatDate(post.created_at)}
                      </div>
                      <h2 className={`text-2xl font-black group-hover:text-blue-400 transition-colors ${cardText}`}>
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
                {filteredPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
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
                      <div className="flex flex-col justify-between py-1">
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-zinc-500">
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <h2 className={`text-2xl font-black group-hover:text-blue-400 transition-colors line-clamp-2 ${cardText}`}>
                            {post.title}
                          </h2>
                          <p className={`text-sm font-bold leading-relaxed line-clamp-2 ${cardDesc}`}>
                            {excerpt}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-black uppercase italic tracking-wider text-blue-400 group-hover:text-blue-300">
                          Read Post <ArrowRight size={12} />
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
                {filteredPosts.map((post) => {
                  const excerpt = buildExcerpt(post);
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
                        <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs font-bold ${
                          theme === "dark" ? "border-zinc-800/80 text-zinc-500" : "border-zinc-100 text-zinc-500"
                        }`}>
                          {/* 날짜 */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <CalendarDays size={13} />
                            <span>{formatDate(post.created_at)}</span>
                          </div>

                          {/* 가운데: 카테고리 */}
                          <div className="flex-1 text-center px-2 min-w-0">
                            <span className={`inline-block truncate max-w-full rounded px-2 py-0.5 border ${
                              theme === "dark"
                                ? "text-zinc-400 border-zinc-800 bg-[#1e222b]/50"
                                : "text-zinc-600 border-zinc-200 bg-zinc-50"
                            }`}>
                              {category.name}
                            </span>
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

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 transition-colors ${theme === "dark" ? "border-zinc-900 bg-[#1e222b]" : "border-zinc-200 bg-white"}`}>
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center text-xs font-bold text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {blogTitle}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-400">Home</Link>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500">Powered by CreAibox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
