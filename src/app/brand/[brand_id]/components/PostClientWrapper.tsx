"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles, Tag, Sun, Moon, Star } from "lucide-react";

interface PublishedPostDetail {
  id: string;
  title: string | null;
  content: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  seo_tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  category_id?: string | null;
  thumbnailUrl?: string | null;
  toc_enabled?: boolean | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface PostClientWrapperProps {
  brand_id: string;
  profile: any;
  post: PublishedPostDetail;
  category: BlogCategory | null;
  categories: BlogCategory[];
  publishedDate: string;
  normalizedContent: string;
  prevPost?: any;
  nextPost?: any;
  bestPosts: any[];
  initialTheme?: "light" | "dark";
  customSchemas?: string[];
}

function looksLikeHtml(content: string) {
  return /<\/?(p|h[1-6]|div|table|blockquote|ul|ol|li|img|iframe|hr|br|strong|em|a)\b/i.test(content);
}

function sanitizePublishedHtml(content: string) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)=["']\s*javascript:[^"']*["']/gi, "")
    .replace(/\s+srcdoc=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

const getBlogMarkdownComponents = (theme: "light" | "dark"): Components => ({
  h1: ({ children }) => (
    <h1 className={`mb-6 border-b pb-4 text-[1.75rem] font-black leading-[1.25] tracking-[-0.03em] ${
      theme === "dark" ? "border-zinc-800 text-white" : "border-zinc-200 text-zinc-900"
    }`}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className={`mt-14 mb-6 text-[1.35rem] font-black leading-[1.35] tracking-[-0.02em] ${
      theme === "dark" ? "text-white" : "text-zinc-900"
    }`}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className={`mt-10 mb-4 text-[1.05rem] font-black leading-[1.4] ${
      theme === "dark" ? "text-zinc-200" : "text-zinc-800"
    }`}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className={`mb-6 text-[1.05rem] leading-[1.8] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className={`font-black ${theme === "dark" ? "text-white" : "text-zinc-950"}`}>{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className={`mb-8 ml-6 list-disc space-y-3 text-[1.05rem] leading-[1.8] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className={`mb-8 ml-6 list-decimal space-y-3 text-[1.05rem] leading-[1.8] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-blue-650">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className={`my-8 rounded-[22px] border px-6 py-5 text-[1.12rem] font-medium leading-[1.9] ${
      theme === "dark" ? "border-zinc-800 bg-zinc-900/30 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"
    }`}>
      {children}
    </blockquote>
  ),
  hr: () => <div className={`my-10 h-px w-full ${theme === "dark" ? "bg-zinc-900" : "bg-zinc-200"}`} />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-bold text-blue-400 underline decoration-blue-500 decoration-2 underline-offset-4 hover:text-blue-300"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || "이미지"}
      className={`my-8 w-full h-auto rounded-[6px] border ${
        theme === "dark" ? "border-zinc-900" : "border-zinc-200"
      }`}
    />
  ),
});

export default function PostClientWrapper({
  brand_id,
  profile,
  post,
  category,
  categories,
  publishedDate,
  normalizedContent,
  prevPost,
  nextPost,
  bestPosts,
  initialTheme,
  customSchemas = []
}: PostClientWrapperProps) {
  // 1. Theme State (default to initialTheme or light)
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme || "light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

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

  const configs = profile.extra_configs || {};
  const isPrimary = brand_id.toLowerCase() === (profile.brand_id || "").toLowerCase();

  const getConf = (key: string, fallback: string = ""): string => {
    if (isPrimary) return configs[key] || fallback;
    return configs[`${key}_${brand_id.toLowerCase()}`] || configs[key] || fallback;
  };

  const blogTitle = getConf("blog_title", `${profile.nickname || brand_id} 블로그`);
  const accentColor = getConf("blog_accent_color", "#3b82f6");
  const tags = post.seo_tags || [];

  // 🌟 에디토리얼 설정 댓글 파싱
  const editorialRegex = /<!-- CREAIBOX_EDITORIAL_START ([\s\S]*?) CREAIBOX_EDITORIAL_END -->/;
  const editorialMatch = (post.content || "").match(editorialRegex);
  let editorial = {
    enabled: true,
    bgColor: "#f8f8f9",
    borderColor: "#e4e4e7",
    textColor: "#52525b",
    subColor: "#2563eb",
    subtitle: "CreAibox Insight Editorial",
    text: "본 콘텐츠는 올인원 콘텐츠 제작형 생성형 AI 스튜디오 크리에이박스(CreAibox)의 오리지널 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 생성 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreAibox) 공식 블로그 기사 및 스튜디오 가이드에서 확인하실 수 있습니다."
  };

  let hasCustomEditorial = false;
  if (editorialMatch && editorialMatch[1]) {
    try {
      const parsed = JSON.parse(editorialMatch[1]);
      editorial = { ...editorial, ...parsed };
      hasCustomEditorial = true;
    } catch (e) {
      console.error("Failed to parse editorial settings in brand page:", e);
    }
  }

  // Clean comment from normalizedContent if present
  const cleanContent = normalizedContent.replace(editorialRegex, "").trim();

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

  const activeHeaderLink = theme === "dark" ? "text-white" : "text-zinc-900";
  const inactiveHeaderLink = theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black";

  const backBtnStyle = theme === "dark"
    ? "border-zinc-850 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
    : "border-zinc-200 bg-white text-zinc-650 hover:border-zinc-300 hover:bg-zinc-50/50";

  const sidebarBtnStyle = theme === "dark"
    ? "border-zinc-850 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-350 hover:bg-zinc-50";

  const articleBg = theme === "dark"
    ? "border-[#2a2f3a] bg-[#1e222b]/40"
    : "border-[#e2e8f0] bg-white";

  const articleHeaderBg = theme === "dark"
    ? "border-b border-[#2a2f3a] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_42%)]"
    : "border-b border-[#e2e8f0] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.03),transparent_42%)]";

  const tagInsightStyle = theme === "dark"
    ? "border-zinc-800 bg-zinc-900/80 text-zinc-400"
    : "border-zinc-200 bg-zinc-50 text-zinc-650";

  const tagCategoryStyle = theme === "dark"
    ? "border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10"
    : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100";

  const titleColor = theme === "dark" ? "text-white" : "text-zinc-900";
  const metaColor = theme === "dark" ? "text-zinc-500" : "text-zinc-650";

  const imageBorder = theme === "dark" ? "border-zinc-900" : "border-zinc-200";

  const cardBg = theme === "dark"
    ? "border-zinc-800 bg-[#1e222b]/40 hover:bg-[#1e222b]/70 hover:border-zinc-700"
    : "border-zinc-200 bg-white hover:bg-zinc-50/50 hover:border-zinc-300/60";

  const cardText = theme === "dark" ? "text-white" : "text-[#1e293b]";

  const excerptBg = theme === "dark"
    ? "border-zinc-800 bg-zinc-900/30 text-zinc-400"
    : "border-zinc-200 bg-zinc-50/50 text-[#475569]";

  const blogContentClass = theme === "dark"
    ? "blog-content text-[1.05rem] leading-[1.8] text-zinc-300 [&_a]:font-bold [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-500 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[6px] [&_blockquote]:border [&_blockquote]:border-zinc-800 [&_blockquote]:bg-zinc-900/20 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-800 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-white [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-200 [&_hr]:my-10 [&_hr]:border-zinc-800 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[6px] [&_iframe]:border [&_iframe]:border-zinc-800 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[6px] [&_img]:border [&_img]:border-zinc-900 [&_li]:pl-1 [&_li]:marker:text-blue-500 [&_ol]:text-[1.05rem] [&_ol]:leading-[1.8] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.8] [&_p]:text-zinc-300 [&_strong]:font-black [&_strong]:text-white [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-none [&_table]:border [&_table]:border-zinc-800 [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:break-keep [&_td]:min-w-[90px] [&_th]:border [&_th]:border-zinc-800 [&_th]:bg-zinc-900/40 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_th]:align-middle [&_th]:break-keep [&_th]:min-w-[90px] [&_ul]:text-[1.05rem] [&_ul]:leading-[1.8] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
    : "blog-content text-[1.05rem] leading-[1.8] text-zinc-750 [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-500 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[6px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-zinc-900 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-zinc-900 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-800 [&_hr]:my-10 [&_hr]:border-zinc-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[6px] [&_iframe]:border [&_iframe]:border-zinc-200 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[6px] [&_img]:border [&_img]:border-zinc-200 [&_li]:pl-1 [&_li]:marker:text-blue-500 [&_ol]:text-[1.05rem] [&_ol]:leading-[1.8] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.8] [&_p]:text-zinc-700 [&_strong]:font-black [&_strong]:text-zinc-950 [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-none [&_table]:border [&_table]:border-zinc-200 [&_td]:border [&_td]:border-zinc-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:break-keep [&_td]:min-w-[90px] [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_th]:align-middle [&_th]:break-keep [&_th]:min-w-[90px] [&_ul]:text-[1.05rem] [&_ul]:leading-[1.8] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3";

  const footerBorder = theme === "dark" ? "border-zinc-900 bg-[#1e222b]" : "border-zinc-200 bg-white";
  const footerText = theme === "dark" ? "text-zinc-500" : "text-zinc-650";
  const footerDivider = theme === "dark" ? "text-zinc-800" : "text-zinc-350";

  // Prevent flicker on load
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
    <div className={`flex flex-col min-h-screen transition-colors duration-150 font-sans selection:bg-blue-500/30 selection:text-blue-200 theme-${theme} ${bgStyle} ${visibleClass}`}>
      {/* Google AdSense Integration */}
      {adsenseClient && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            summary::-webkit-details-marker {
              display: none;
            }
            .theme-dark {
              --toc-border: #27272a;
              --toc-border-inner: #18181b;
              --toc-bg: rgba(24, 24, 27, 0.3);
              --toc-title-color: #d4d4d8;
              --toc-toggle-color: #71717a;
              --toc-toggle-bg: rgba(24, 24, 27, 0.5);
              --toc-h2: #e4e4e7;
              --toc-h3: #a1a1aa;
              --toc-h4: #71717a;
            }
            .theme-light {
              --toc-border: #e2e8f0;
              --toc-border-inner: #f1f5f9;
              --toc-bg: rgba(248, 250, 252, 0.8);
              --toc-title-color: #1e293b;
              --toc-toggle-color: #475569;
              --toc-toggle-bg: #f1f5f9;
              --toc-h2: #1e293b;
              --toc-h3: #475569;
              --toc-h4: #64748b;
            }
          `,
        }}
      />

      {/* Header */}
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

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-bold transition-colors ${inactiveHeaderLink}`}>
              전체글
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`text-sm font-bold transition-colors ${
                  category && cat.id === category.id 
                    ? `${activeHeaderLink} underline decoration-blue-500 decoration-2 underline-offset-4` 
                    : inactiveHeaderLink
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

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
              <Moon size={12} className={`text-zinc-400 transition-opacity z-10 ${theme === "dark" ? "opacity-100" : "opacity-40"}`} />
              <Sun size={12} className={`text-amber-500 transition-opacity z-10 ${theme === "light" ? "opacity-100" : "opacity-40"}`} />
              
              <div 
                className={`absolute top-0.5 left-0.5 bg-blue-500 w-5 h-5 rounded-full transition-transform duration-300 ${
                  theme === "light" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main post container */}
      <main className="mx-auto max-w-7xl px-6 py-4 flex-1 w-full">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition ${backBtnStyle}`}
        >
          <ArrowLeft size={16} /> 블로그 홈으로 돌아가기
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_380px]">
          {/* Left 2/3 Content column */}
          <div className="space-y-8">
            <article className={`overflow-hidden rounded-xl border transition-all duration-300 ${articleBg}`}>
              <header className={`px-6 py-6 md:px-8 md:py-8 transition-all duration-300 ${articleHeaderBg}`}>
                <div className="flex flex-wrap items-center gap-2">
                  {category && (
                    <Link
                      href={`/category/${category.slug}`}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${tagCategoryStyle}`}
                    >
                      <Tag size={10} /> {category.name}
                    </Link>
                  )}
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${tagInsightStyle}`}>
                    <Sparkles size={10} className="text-yellow-400" /> Insight
                  </div>
                </div>

                <h1 className={`mt-6 text-2xl md:text-[1.85rem] font-black leading-[1.3] tracking-[-0.02em] ${titleColor}`}>
                  {post.title}
                </h1>
              </header>

              <div className="px-6 py-8 md:px-8 space-y-8">
                <div className="w-full">
                  {looksLikeHtml(cleanContent) ? (
                    <div
                      className={blogContentClass}
                      dangerouslySetInnerHTML={{
                        __html: sanitizePublishedHtml(cleanContent),
                      }}
                    />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={getBlogMarkdownComponents(theme)}>
                      {cleanContent}
                    </ReactMarkdown>
                  )}
                </div>

                {/* Brand Editorial Card */}
                {editorial.enabled && (
                  hasCustomEditorial ? (
                    <div 
                      className="mt-12 p-6 rounded-2xl border transition-all"
                      style={{
                        backgroundColor: editorial.bgColor,
                        borderColor: editorial.borderColor,
                      }}
                    >
                      <p 
                        className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 select-none"
                        style={{ color: editorial.subColor }}
                      >
                        {editorial.subtitle}
                      </p>
                      <p 
                        className="text-[1.05rem] leading-[1.8]"
                        style={{ color: editorial.textColor }}
                      >
                        {editorial.text}
                      </p>
                    </div>
                  ) : (
                    /* Default CreAibox Citation Card */
                    <div className="mt-12 p-6 rounded-2xl border border-zinc-200/60 bg-zinc-50/30">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 select-none">
                        CreAibox Publisher
                      </p>
                      <p className="text-xs text-zinc-500 leading-[1.6]">
                        본 블로그 포스팅은 올인원 크리에이터 생성형 AI 스튜디오 <a href="https://creaibox.com" target="_blank" rel="noopener noreferrer" className="font-black text-zinc-700 hover:text-blue-500 underline decoration-zinc-400">크리에이박스(CreAibox)</a> 솔루션을 활용하여 자동화 및 최적화 배포된 기사입니다. AI 기반 블로그 및 스마트 마케팅 솔루션에 대한 정보는 공식 웹사이트에서 확인해 보세요.
                      </p>
                    </div>
                  )
                )}

                {tags.length > 0 && (
                  <div className="pt-8 mt-12">
                    <h2 className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">
                      SEO Tags
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-bold text-blue-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🌟 SEO 구조화 데이터(JSON-LD) 삽입 현황 확인 카드 */}
                {customSchemas && customSchemas.length > 0 && (
                  <div className={`w-full mt-10 border-t pt-8 text-left ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"}`}>
                    <h2 className={`text-sm font-black uppercase tracking-[0.24em] flex items-center gap-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                      <Star size={14} className="text-violet-500 fill-violet-500" />
                      검색엔진 Rich Schema info
                    </h2>
                    <div className={`mt-4 p-5 rounded-2xl border ${
                      theme === "dark"
                        ? "border-violet-500/20 bg-violet-950/10 text-violet-300"
                        : "border-violet-100 bg-violet-50/20 text-zinc-650"
                    }`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase bg-violet-600 text-white px-2 py-0.5 rounded tracking-wide">
                          JSON-LD ACTIVE
                        </span>
                        {customSchemas.map((schemaStr, idx) => {
                          try {
                            const parsed = JSON.parse(schemaStr);
                            const type = parsed["@type"] || "Schema";
                            return (
                              <span key={`badge-${idx}`} className={`text-[10px] font-black border px-2 py-0.5 rounded uppercase ${
                                theme === "dark"
                                  ? "border-violet-800 bg-zinc-900 text-violet-300"
                                  : "border-violet-300 bg-white text-violet-700"
                              }`}>
                                {type}
                              </span>
                            );
                          } catch {
                            return null;
                          }
                        })}
                      </div>
                      <p className={`text-xs font-medium leading-relaxed mt-3 ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"}`}>
                        💡 이 글의 HTML 헤더 소스코드에 구조화 스키마 메타데이터가 정상적으로 주입되어 있습니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 🌟 이전 글 / 다음 글 내비게이션 카드 (아티클 내부 하단 배치) */}
                <div className={`w-full mt-12 border-t pt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"}`}>
                  {prevPost ? (
                    <Link
                      href={`/${prevPost.slug}`}
                      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-blue-400 hover:shadow-md ${cardBg}`}
                    >
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                        {prevPost.thumbnailUrl ? (
                          <img
                            src={prevPost.thumbnailUrl}
                            alt={prevPost.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                            <Sparkles size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          이전 글
                        </p>
                        <h4 className={`mt-1 line-clamp-2 text-sm font-black leading-snug transition-colors group-hover:text-blue-500 ${cardText}`}>
                          {prevPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className={`flex items-center justify-center rounded-xl border border-dashed p-4 text-center text-xs font-bold text-zinc-400 min-h-[98px] ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"}`}>
                      이전 글이 존재하지 않습니다
                    </div>
                  )}

                  {nextPost ? (
                    <Link
                      href={`/${nextPost.slug}`}
                      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-blue-400 hover:shadow-md ${cardBg}`}
                    >
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                        {nextPost.thumbnailUrl ? (
                          <img
                            src={nextPost.thumbnailUrl}
                            alt={nextPost.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                            <Sparkles size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          다음 글
                        </p>
                        <h4 className={`mt-1 line-clamp-2 text-sm font-black leading-snug transition-colors group-hover:text-blue-500 ${cardText}`}>
                          {nextPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className={`flex items-center justify-center rounded-xl border border-dashed p-4 text-center text-xs font-bold text-zinc-400 min-h-[98px] ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"}`}>
                      다음 글이 존재하지 않습니다
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* 오른쪽 1/3 베스트 글 위젯 (Sticky 적용) */}
          <aside className={`lg:sticky lg:top-28 h-fit rounded-xl border p-6 transition-all duration-300 ${theme === "dark" ? "border-zinc-800 bg-[#1e222b]/40" : "border-zinc-200 bg-zinc-50"}`}>
            <div className="mb-5 flex items-center justify-between border-b pb-5 border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                  Best Posts
                </p>
                <h2 className={`mt-1 text-2xl font-black ${theme === "dark" ? "text-white" : "text-zinc-950"}`}>
                  베스트 글
                </h2>
              </div>
              <Star className="text-blue-500" size={22} />
            </div>

            <div className="space-y-1">
              {bestPosts.map((bestPost) => {
                return (
                  <Link
                    key={bestPost.id}
                    href={`/${bestPost.slug}`}
                    className="group flex items-center gap-4 rounded-none px-2 py-3 transition hover:bg-white/5 border-b border-zinc-200 dark:border-zinc-800/60 last:border-b-0"
                  >
                    <div className="relative w-16 aspect-[16/9] shrink-0 overflow-hidden rounded-none border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                      {bestPost.thumbnailUrl ? (
                        <img
                          src={bestPost.thumbnailUrl}
                          alt={bestPost.title || "thumbnail"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className={`line-clamp-2 text-[1.05rem] font-bold leading-snug group-hover:text-blue-500 transition-colors ${theme === "dark" ? "text-zinc-200" : "text-zinc-850"}`}>
                        {bestPost.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 transition-colors ${footerBorder}`}>
        <div className={`mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center text-xs font-bold ${footerText}`}>
          <div>
            &copy; {new Date().getFullYear()} {blogTitle}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className={`hover:text-zinc-400 ${theme === "dark" ? "text-zinc-500" : "text-zinc-650"}`}>Home</Link>
            <span className={footerDivider}>|</span>
            <span className="text-zinc-500">Powered by CreAibox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
