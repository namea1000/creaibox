import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface PublishedPostDetail {
  title: string | null;
  content: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  seo_tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-zinc-200 pb-4 text-[2.15rem] font-black leading-[1.25] tracking-[-0.03em] text-zinc-950">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-6 text-[1.7rem] font-black leading-[1.35] tracking-[-0.02em] text-zinc-950">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-[1.3rem] font-black leading-[1.4] text-zinc-900">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-[1.08rem] leading-[2.02] text-zinc-700">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-black text-zinc-950">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-8 ml-6 list-disc space-y-3 text-[1.05rem] leading-[1.95] text-zinc-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 ml-6 list-decimal space-y-3 text-[1.05rem] leading-[1.95] text-zinc-700">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-blue-600">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-[22px] border border-zinc-200 bg-zinc-50 px-6 py-5 text-[1.02rem] font-medium leading-[1.9] text-zinc-600">
      {children}
    </blockquote>
  ),
  hr: () => <div className="my-10 h-px w-full bg-zinc-200" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-bold text-blue-600 underline decoration-blue-300 decoration-2 underline-offset-4"
    >
      {children}
    </a>
  ),
};

function normalizePublishedContent(content: string) {
  return content
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*\*\*\*+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

async function fetchPublishedPost(slug: string) {
  const supabase = await createClient();
  const decodedSlug = decodeURIComponent(slug);

  const { data, error } = await supabase
    .from("writing_creaibox_posts")
    .select("title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at")
    .eq("slug", decodedSlug)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0] as PublishedPostDetail;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | Creaibox Blog",
    };
  }

  const canonical = post.canonical_url || `https://creaibox.com/blog/${slug}`;

  return {
    title: `${post.title} | Creaibox Blog`,
    description: post.meta_description || post.focus_keyword || "Creaibox 공개 블로그 상세 페이지",
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title || "Creaibox Blog",
      description: post.meta_description || post.focus_keyword || "Creaibox 공개 블로그 상세 페이지",
      type: "article",
      url: canonical,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const tags = post.seo_tags || [];
  const publishedDate = formatDate(post.created_at);
  const normalizedContent = normalizePublishedContent(post.content || "");

  const canonical = post.canonical_url || `https://creaibox.com/blog/${post.slug || slug}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "Creaibox Blog",
    description:
      post.meta_description || post.focus_keyword || "Creaibox 공개 블로그 상세 페이지",
    url: canonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    author: {
      "@type": "Organization",
      name: "CreAIbox",
      url: "https://creaibox.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CreAIbox",
      url: "https://creaibox.com",
    },
    keywords: tags,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://creaibox.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "블로그",
        item: "https://creaibox.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title || "게시글",
        item: canonical,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <Header />

      <main className="pt-28">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            블로그 목록으로 돌아가기
          </Link>

          <article className="mt-8 overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm">
            <header className="border-b border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_42%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-8 py-10 md:px-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">
                <Sparkles size={12} />
                Creaibox Insight
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.18] tracking-[-0.03em] text-zinc-950 md:text-5xl">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} />
                  {publishedDate}
                </span>

                {post.focus_keyword && (
                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-blue-700">
                    {post.focus_keyword}
                  </span>
                )}
              </div>
            </header>

            <div className="bg-white px-8 py-10 md:px-12">
              {post.meta_description && (
                <div className="mb-8 rounded-[24px] border border-zinc-200 bg-zinc-50 px-6 py-5 text-[1.02rem] font-medium leading-[1.8] text-zinc-700">
                  {post.meta_description}
                </div>
              )}

              <div className="mx-auto max-w-[880px]">
                {looksLikeHtml(normalizedContent) ? (
                  <div
                    className="blog-content text-[1.08rem] leading-[2.02] text-zinc-700 [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[2.15rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-zinc-950 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.7rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-zinc-950 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.3rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-900 [&_hr]:my-10 [&_hr]:border-zinc-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[18px] [&_iframe]:border [&_iframe]:border-zinc-200 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[18px] [&_li]:pl-1 [&_li]:marker:text-blue-600 [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.08rem] [&_p]:leading-[2.02] [&_p]:text-zinc-700 [&_strong]:font-black [&_strong]:text-zinc-950 [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-[16px] [&_td]:border [&_td]:border-zinc-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
                    dangerouslySetInnerHTML={{
                      __html: sanitizePublishedHtml(normalizedContent),
                    }}
                  />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogMarkdownComponents}>
                    {normalizedContent}
                  </ReactMarkdown>
                )}
              </div>

              {tags.length > 0 && (
                <div className="mx-auto mt-12 max-w-[880px] border-t border-zinc-200 pt-8">
                  <h2 className="text-sm font-black uppercase tracking-[0.24em] text-zinc-500">
                    SEO Tags
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
