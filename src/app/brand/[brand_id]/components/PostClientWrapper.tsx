"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles, Tag, Sun, Moon } from "lucide-react";

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
    <p className={`mb-6 text-[1.18rem] leading-[2.02] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className={`font-black ${theme === "dark" ? "text-white" : "text-zinc-950"}`}>{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className={`mb-8 ml-6 list-disc space-y-3 text-[1.25rem] leading-[1.95] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className={`mb-8 ml-6 list-decimal space-y-3 text-[1.25rem] leading-[1.95] ${
      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
    }`}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-blue-500">{children}</li>
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
      className={`my-8 w-full h-auto rounded-[24px] border ${
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
  nextPost
}: PostClientWrapperProps) {
  // 1. Theme State (default to light)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(`blog_theme_${brand_id}`) as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }
    setIsThemeLoaded(true);
  }, [brand_id]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(`blog_theme_${brand_id}`, nextTheme);
  };

  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  const accentColor = profile.extra_configs?.blog_accent_color || "#3b82f6";
  const tags = post.seo_tags || [];

  // Theme styling helpers based on active state
  const bgStyle = theme === "dark" 
    ? "bg-[#181a20] text-[#e2e8f0]" 
    : "bg-[#f4f6fa] text-[#1e293b]";

  const headerBg = theme === "dark"
    ? "bg-[#1e222b]/80 border-[#2a2f3a]"
    : "bg-white/80 border-[#e2e8f0]";

  const activeHeaderLink = theme === "dark" ? "text-white" : "text-zinc-900";
  const inactiveHeaderLink = theme === "dark" ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black";

  const backBtnStyle = theme === "dark"
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
    ? "blog-content text-[1.18rem] leading-[2.02] text-zinc-300 [&_a]:font-bold [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-500 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[6px] [&_blockquote]:border [&_blockquote]:border-zinc-800 [&_blockquote]:bg-zinc-900/20 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-800 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-white [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-200 [&_hr]:my-10 [&_hr]:border-zinc-800 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[6px] [&_iframe]:border [&_iframe]:border-zinc-800 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[6px] [&_img]:border [&_img]:border-zinc-900 [&_li]:pl-1 [&_li]:marker:text-blue-500 [&_ol]:text-[1.25rem] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.18rem] [&_p]:leading-[2.02] [&_p]:text-zinc-300 [&_strong]:font-black [&_strong]:text-white [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-none [&_table]:border [&_table]:border-zinc-800 [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:border [&_th]:border-zinc-800 [&_th]:bg-zinc-900/40 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_ul]:text-[1.25rem] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
    : "blog-content text-[1.18rem] leading-[2.02] text-zinc-750 [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-500 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[6px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-zinc-900 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-zinc-900 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-800 [&_hr]:my-10 [&_hr]:border-zinc-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[6px] [&_iframe]:border [&_iframe]:border-zinc-200 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[6px] [&_img]:border [&_img]:border-zinc-200 [&_li]:pl-1 [&_li]:marker:text-blue-500 [&_ol]:text-[1.25rem] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.18rem] [&_p]:leading-[2.02] [&_p]:text-zinc-700 [&_strong]:font-black [&_strong]:text-zinc-950 [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-none [&_table]:border [&_table]:border-zinc-200 [&_td]:border [&_td]:border-zinc-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_ul]:text-[1.25rem] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3";

  const footerBorder = theme === "dark" ? "border-zinc-900 bg-[#1e222b]" : "border-zinc-200 bg-white";
  const footerText = theme === "dark" ? "text-zinc-500" : "text-zinc-650";
  const footerDivider = theme === "dark" ? "text-zinc-800" : "text-zinc-350";

  // Prevent flicker on load
  const visibleClass = isThemeLoaded ? "opacity-100" : "opacity-0";

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 theme-${theme} ${bgStyle} ${visibleClass}`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html {
              scroll-behavior: smooth;
            }
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
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${headerBg}`}>
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
      <main className="mx-auto max-w-7xl px-6 py-12 flex-1 w-full">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-black transition ${backBtnStyle}`}
        >
          <ArrowLeft size={14} /> 블로그 홈으로 돌아가기
        </Link>

        <article className={`mt-8 overflow-hidden rounded-[32px] border transition-all duration-300 ${articleBg}`}>
          <header className={`px-8 py-12 md:px-12 transition-all duration-300 ${articleHeaderBg}`}>
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

            <h1 className={`mt-6 text-3xl md:text-[2.5rem] font-black leading-[1.2] tracking-tight ${titleColor}`}>
              {post.title}
            </h1>

          </header>

          <div className="px-8 py-12 md:px-12 space-y-8">
            <div className="mx-auto max-w-[1100px]">
              {looksLikeHtml(normalizedContent) ? (
                <div
                  className={blogContentClass}
                  dangerouslySetInnerHTML={{
                    __html: sanitizePublishedHtml(normalizedContent),
                  }}
                />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={getBlogMarkdownComponents(theme)}>
                  {normalizedContent}
                </ReactMarkdown>
              )}
            </div>

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
          </div>
        </article>

        {/* 🌟 이전 글 / 다음 글 내비게이션 카드 */}
        {(prevPost || nextPost) && (
          <div className={`mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 border-t pt-10 ${theme === "dark" ? "border-zinc-900" : "border-zinc-200"}`}>
            {prevPost ? (
              <Link
                href={`/${prevPost.slug}`}
                className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all hover:border-blue-400 hover:shadow-md ${cardBg}`}
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-950">
                  {prevPost.thumbnailUrl ? (
                    <img
                      src={prevPost.thumbnailUrl}
                      alt={prevPost.title || "thumbnail"}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                      <Sparkles size={16} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                    &larr; 이전 글
                  </span>
                  <h4 className={`mt-1 truncate text-sm font-black transition-colors group-hover:text-blue-400 ${cardText}`}>
                    {prevPost.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/${nextPost.slug}`}
                className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all hover:border-blue-400 hover:shadow-md ${cardBg}`}
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-950">
                  {nextPost.thumbnailUrl ? (
                    <img
                      src={nextPost.thumbnailUrl}
                      alt={nextPost.title || "thumbnail"}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center ${theme === "dark" ? "bg-zinc-900 text-zinc-700" : "bg-zinc-100 text-zinc-400"}`}>
                      <Sparkles size={16} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 text-right">
                    다음 글 &rarr;
                  </span>
                  <h4 className={`mt-1 truncate text-sm font-black transition-colors group-hover:text-blue-400 ${cardText}`}>
                    {nextPost.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
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
