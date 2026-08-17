import React, { cache } from "react";
import Link from "@/components/common/SmartIntentLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatImageUrl } from "@/utils/image-url";
import SafeImage from "@/components/common/SafeImage";
import OGLinkCard from "@/components/common/OGLinkCard";
import CodeBlockCopyEnhancer from "@/components/blog/CodeBlockCopyEnhancer";
import PostViewTracker from "@/components/blog/PostViewTracker";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

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
  thumbnailUrl?: string | null;
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-zinc-200 pb-4 text-[1.75rem] font-black leading-[1.25] tracking-[-0.03em] text-zinc-950">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-6 text-[1.35rem] font-black leading-[1.35] tracking-[-0.02em] text-zinc-950">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-[1.05rem] font-black leading-[1.4] text-zinc-900">
      {children}
    </h3>
  ),
  p: ({ children }) => {
    if (typeof children === "string") {
      const trimmed = children.trim();
      if (/^https?:\/\/[^\s]+$/.test(trimmed)) {
        return <OGLinkCard url={trimmed} />;
      }
    }
    if (React.Children.count(children) === 1) {
      const child = React.Children.toArray(children)[0] as any;
      if (child && child.type === "a" && child.props?.href) {
        const href = child.props.href;
        const linkText = child.props.children;
        if (
          typeof linkText === "string" &&
          (linkText.trim() === href.trim() || /^https?:\/\/[^\s]+$/.test(linkText.trim()))
        ) {
          return <OGLinkCard url={href} />;
        }
      }
    }
    return (
      <p className="mb-6 text-[1.05rem] leading-[1.8] text-zinc-700">
        {children}
      </p>
    );
  },
  strong: ({ children }) => (
    <strong className="font-black text-zinc-950">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-8 ml-6 list-disc space-y-3 text-[1.05rem] leading-[1.8] text-zinc-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 ml-6 list-decimal space-y-3 text-[1.05rem] leading-[1.8] text-zinc-700">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-blue-600">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-[22px] border border-zinc-200 bg-zinc-50 px-6 py-5 text-[1.12rem] font-medium leading-[1.9] text-zinc-600">
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
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || "이미지"}
      className="my-8 w-full h-auto rounded-[24px]"
    />
  ),
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse border border-slate-300 bg-white text-sm text-left shadow-none">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100 text-zinc-900 border-b border-slate-300">
      {children}
    </thead>
  ),
  th: ({ children, style }) => (
    <th
      style={style}
      className="border border-slate-300 px-3.5 py-2.5 text-center font-bold text-zinc-900 bg-slate-100 align-middle [&_p]:!my-0 [&_p]:!py-0 [&_p]:!leading-snug"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td
      style={style}
      className="border border-slate-300 px-3.5 py-2.5 align-middle text-zinc-700 font-normal [&_p]:!my-0 [&_p]:!py-0 [&_p]:!leading-snug"
    >
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <div className="cb-code-wrapper my-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f1117] shadow-xl text-left">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#141721] px-4 py-2 text-[11px] font-bold text-zinc-400">
        <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-1 text-[10px] uppercase tracking-wider text-zinc-400 font-black">CODE BLOCK</span>
        </span>
      </div>
      <pre className="m-0 overflow-x-auto p-4 text-[0.85rem] font-mono leading-relaxed text-[#f4f4f5] bg-[#0f1117] border-0">
        {children}
      </pre>
    </div>
  ),
  code: ({ children, className }) => {
    const isInline = !className && typeof children === "string" && !children.includes("\n");
    if (isInline) {
      return (
        <code className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-pink-600">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
};

function normalizePublishedContent(content: string) {
  return content
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/\n\s*---\s*\n/g, "\n\n<hr />\n\n")
    .trim();
}

function looksLikeHtml(content: string) {
  return /<\/?(p|h[1-6]|div|table|blockquote|ul|ol|li|img|iframe|hr|br|strong|em|a|pre|code)\b/i.test(content);
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

function isMainSitePost(canonicalUrl: string | null) {
  if (!canonicalUrl) return true;
  try {
    const url = new URL(canonicalUrl);
    const hostname = url.hostname.toLowerCase();
    
    if (hostname.endsWith("localhost")) {
      const parts = hostname.split(".");
      if (parts.length <= 1 || parts[0] === "www") return true;
      return false;
    }
    
    if (hostname.endsWith("creaibox.com")) {
      const parts = hostname.split(".");
      if (parts.length === 2) return true;
      if (parts.length === 3 && parts[0] === "www") return true;
      return false;
    }

    return false;
  } catch (e) {
    return true;
  }
}

const fetchPublishedPost = cache(async (slug: string) => {
  const supabase = await createAdminClient();
  const decodedSlug = decodeURIComponent(slug);

  // 1. 단일 다이렉트 쿼리로 본문 조회 (한글/영문/인코딩 slug 전체 대응)
  let query = supabase
    .from("writing_creaibox_posts")
    .select("id, title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

  if (decodedSlug === slug) {
    query = query.eq("slug", decodedSlug);
  } else {
    query = query.or(`slug.eq."${decodedSlug}",slug.eq."${slug}"`);
  }

  const { data: posts, error } = await query;

  if (error || !posts || posts.length === 0) {
    return null;
  }

  const post = posts[0] as PublishedPostDetail;
  if (!isMainSitePost(post.canonical_url)) {
    return null;
  }

  // Fetch thumbnail for this post
  const { data: images, error: imagesError } = await supabase
    .from("generated_images")
    .select("image_url, is_primary, created_at")
    .eq("source_type", "writing_creaibox_posts")
    .eq("source_id", post.id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (imagesError) {
    console.error("썸네일 이미지 조회 실패:", imagesError.message);
  }

  const primaryImg = (images || [])[0];
  post.thumbnailUrl = primaryImg ? formatImageUrl(primaryImg.image_url) : null;

  return post;
});

const fetchPublishedPostsList = cache(async () => {
  const supabase = await createAdminClient();

  const { data: posts } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, canonical_url, created_at")
    .eq("status", "published")
    .not("slug", "is", null)
    .or("canonical_url.ilike.https://creaibox.com/blog/%,canonical_url.ilike.https://www.creaibox.com/blog/%,canonical_url.ilike.http://localhost%/blog/%")
    .order("created_at", { ascending: false })
    .limit(50);

  const publishedPostsRaw = (posts || []).filter((post) => post.slug && isMainSitePost(post.canonical_url));
  if (publishedPostsRaw.length === 0) return [];

  const postIds = publishedPostsRaw.map((p) => p.id);
  const { data: images } = await supabase
    .from("generated_images")
    .select("source_id, image_url, is_primary, created_at")
    .eq("source_type", "writing_creaibox_posts")
    .in("source_id", postIds)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  const imageMap: Record<string, { url: string; is_primary: boolean }[]> = {};
  (images || []).forEach((img) => {
    if (!img.source_id) return;
    if (!imageMap[img.source_id]) {
      imageMap[img.source_id] = [];
    }
    imageMap[img.source_id].push({
      url: img.image_url,
      is_primary: !!img.is_primary,
    });
  });

  return publishedPostsRaw.map((post) => {
    const postImages = imageMap[post.id] || [];
    const primaryImg = postImages.find((img) => img.is_primary) || postImages[0];
    return {
      ...post,
      thumbnailUrl: primaryImg ? formatImageUrl(primaryImg.url) : null,
    };
  });
});

// 🌟 빌드 시점에 최신 블로그 글을 Global Edge CDN에 미리 캐시(Pre-render)하여 0.01초 즉시 오픈 보장
export async function generateStaticParams() {
  try {
    const supabase = await createAdminClient();
    const { data: posts } = await supabase
      .from("writing_creaibox_posts")
      .select("slug, canonical_url")
      .eq("status", "published")
      .not("slug", "is", null)
      .or("canonical_url.ilike.https://creaibox.com/blog/%,canonical_url.ilike.https://www.creaibox.com/blog/%,canonical_url.ilike.http://localhost%/blog/%")
      .order("created_at", { ascending: false })
      .limit(50);

    return (posts || [])
      .filter((p) => p.slug && isMainSitePost(p.canonical_url))
      .map((p) => ({
        slug: p.slug as string,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | CreaiBox Blog",
    };
  }

  const rawCanonical = post.canonical_url || `https://creaibox.com/blog/${post.slug || slug}`;
  const canonical = encodeURI(rawCanonical);

  return {
    title: `${post.title} | CreaiBox Blog`,
    description: post.meta_description || post.focus_keyword || "CreaiBox 공개 블로그 상세 페이지",
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title || "CreaiBox Blog",
      description: post.meta_description || post.focus_keyword || "CreaiBox 공개 블로그 상세 페이지",
      type: "article",
      url: canonical,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  };
}

function insertThumbnailIntoHtml(html: string, thumbnailUrl: string, title: string) {
  const imgHtml = `
    <img
      src="${thumbnailUrl}"
      alt="${title.replace(/"/g, '&quot;')}"
      class="my-8 w-full h-auto rounded-[24px]"
    />
  `;
  const idx = html.indexOf("</p>");
  if (idx !== -1) {
    const insertPos = idx + 4; // after </p>
    return html.substring(0, insertPos) + imgHtml + html.substring(insertPos);
  }
  return imgHtml + html;
}

function insertThumbnailIntoMarkdown(markdown: string, thumbnailUrl: string, title: string) {
  const imgMarkdown = `\n\n![${title}](${thumbnailUrl})\n\n`;
  const regex = /\r?\n\r?\n/;
  const match = regex.exec(markdown);
  if (match) {
    const insertPos = match.index + match[0].length;
    return markdown.substring(0, insertPos) + imgMarkdown + markdown.substring(insertPos);
  }
  return imgMarkdown + markdown;
}

async function transformContentWithOgCards(content: string, supabase: any): Promise<string> {
  if (!content) return content;

  const urlRegex = /<p[^>]*>\s*(?:<a[^>]*>)?(https?:\/\/[^\s<]+)(?:<\/a>)?\s*<\/p>|(?:^|\n)\s*(https?:\/\/[^\s<]+)\s*(?=\n|$)/gi;
  const matches = Array.from(content.matchAll(urlRegex));
  if (matches.length === 0) return content;

  let transformed = content;

  for (const match of matches) {
    const fullMatch = match[0];
    const rawUrl = (match[1] || match[2] || "").trim();
    if (!rawUrl) continue;

    try {
      const parsedUrl = new URL(rawUrl);
      const host = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname;

      let cardTitle = rawUrl;
      let cardDesc = "";
      let cardImage: string | null = null;
      let domain = host.replace(/^www\./, "");

      if ((host.endsWith("creaibox.com") || host === "localhost") && pathname.startsWith("/blog/")) {
        domain = "creaibox.com";
        const rawSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
        const slug = decodeURIComponent(rawSlug);

        const { data: postData } = await supabase
          .from("writing_creaibox_posts")
          .select("id, title, meta_description, focus_keyword")
          .eq("slug", slug)
          .limit(1)
          .maybeSingle();

        if (postData) {
          cardTitle = postData.title || "CreaiBox 블로그 포스팅";
          cardDesc = postData.meta_description || postData.focus_keyword || "CreaiBox 오리지널 인사이트 리포트입니다.";

          const { data: imgData } = await supabase
            .from("generated_images")
            .select("image_url, is_primary, created_at")
            .eq("source_type", "writing_creaibox_posts")
            .eq("source_id", postData.id)
            .order("is_primary", { ascending: false })
            .order("created_at", { ascending: false });

          const primaryImg = (imgData || []).find((i: any) => i.is_primary) || (imgData || [])[0];
          if (primaryImg?.image_url) {
            cardImage = primaryImg.image_url;
          }
        }
      }

      const escapedTitle = cardTitle.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const escapedDesc = cardDesc.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const ogCardHtml = `
        <a href="${rawUrl}" target="_blank" rel="noopener noreferrer" class="og-card my-3.5 block max-w-2xl mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-blue-400 hover:shadow-md no-underline group text-left">
          ${
            cardImage
              ? `<div class="w-full aspect-[16/9] overflow-hidden p-0 m-0 leading-none">
                  <img src="${cardImage}" alt="${escapedTitle}" style="margin: 0 !important; padding: 0 !important; display: block !important;" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                 </div>`
              : ""
          }
          <div class="p-4 sm:p-4.5">
            <h4 class="text-[1.1rem] sm:text-lg font-bold text-zinc-950 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors" style="margin: 0 !important;">${escapedTitle}</h4>
            ${escapedDesc ? `<p class="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal" style="margin-top: 6px !important; margin-bottom: 0 !important;">${escapedDesc}</p>` : ""}
            <div class="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>${domain}</span>
            </div>
          </div>
        </a>
      `;

      transformed = transformed.replace(fullMatch, ogCardHtml);
    } catch (e) {
      console.error("OG transformation error:", e);
    }
  }

  return transformed;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await fetchPublishedPostsList();
  const bestPosts = allPosts.slice(0, 5);

  // 🌟 이전 글 / 다음 글 산출 (allPosts는 최신순 created_at desc 정렬됨)
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex !== -1 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const tags = post.seo_tags || [];
  const publishedDate = formatDate(post.created_at);

  // 🌟 본문에 저장된 커스텀 JSON-LD 스키마 추출 (기존 script 형식과 신규 주석 우회 형식 모두 지원)
  const customSchemas: string[] = [];
  const schemaRegex = /<!--\s*CREAIBOX_SCHEMA_START([\s\S]*?)CREAIBOX_SCHEMA_END\s*-->|<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = schemaRegex.exec(post.content || "")) !== null) {
    const rawSchema = (match[1] || match[2] || "").trim();
    if (rawSchema) {
      customSchemas.push(rawSchema);
    }
  }

  // 🌟 에디토리얼 설정 댓글 파싱
  const editorialRegex = /<!-- CREAIBOX_EDITORIAL_START ([\s\S]*?) CREAIBOX_EDITORIAL_END -->/;
  const editorialMatch = (post.content || "").match(editorialRegex);
  let editorial = {
    enabled: true,
    bgColor: "#f8f8f9",
    borderColor: "#e4e4e7",
    textColor: "#52525b",
    subColor: "#2563eb",
    subtitle: "CreaiBox Insight Editorial",
    text: "본 콘텐츠는 AI 올인원 콘텐츠 스튜디오 크리에이박스(CreaiBox)의 공식 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 제작 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreaiBox) 공식 홈페이지 <a href=\"https://creaibox.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"font-bold text-blue-500 hover:text-blue-400 underline\">https://creaibox.com</a> 에서 확인하실 수 있습니다."
  };

  if (editorialMatch && editorialMatch[1]) {
    try {
      const parsed = JSON.parse(editorialMatch[1]);
      editorial = { ...editorial, ...parsed };
    } catch (e) {
      console.error("Failed to parse editorial settings:", e);
    }
  }

  // 구형 번역투 문구가 남아있을 경우 신규 문구로 자동 마이그레이션
  if (editorial.text && editorial.text.includes("올인원 콘텐츠 제작형 생성형 AI 스튜디오")) {
    editorial.text = "본 콘텐츠는 AI 올인원 콘텐츠 스튜디오 크리에이박스(CreaiBox)의 공식 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 제작 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreaiBox) 공식 홈페이지 <a href=\"https://creaibox.com\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"font-bold text-blue-500 hover:text-blue-400 underline\">https://creaibox.com</a> 에서 확인하실 수 있습니다.";
  }

  // 🌟 에디토리얼 설정 댓글 및 스키마 제거
  const contentWithoutEditorial = (post.content || "").replace(editorialRegex, "").trim();
  const contentWithoutSchemas = contentWithoutEditorial.replace(schemaRegex, "");
  let normalizedContent = normalizePublishedContent(contentWithoutSchemas);

  const supabaseAdmin = await createAdminClient();
  normalizedContent = await transformContentWithOgCards(normalizedContent, supabaseAdmin);

  const rawCanonical = post.canonical_url || `https://creaibox.com/blog/${post.slug || slug}`;
  const canonical = encodeURI(rawCanonical);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "CreaiBox Blog",
    description:
      post.meta_description || post.focus_keyword || "CreaiBox 공개 블로그 상세 페이지",
    url: canonical,
    image: post.thumbnailUrl || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    author: {
      "@type": "Organization",
      name: "CreaiBox",
      url: "https://creaibox.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CreaiBox",
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
    <div className="flex flex-col min-h-screen bg-white text-zinc-950">
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
      {customSchemas.map((schemaStr, idx) => {
        try {
          const parsed = JSON.parse(schemaStr);
          return (
            <script
              key={`custom-schema-${idx}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(parsed),
              }}
            />
          );
        } catch (e) {
          console.error("Custom schema JSON parse error:", e);
          return null;
        }
      })}

      <CodeBlockCopyEnhancer />
      <PostViewTracker postId={post.id} />
      <Header />

      <style>{`
        .blog-content pre {
          margin: 1.5rem 0 !important;
          padding: 1.25rem 1.5rem !important;
          overflow-x: auto !important;
          border-radius: 1rem !important;
          background-color: #0f1117 !important;
          color: #f4f4f5 !important;
          border: 1px solid #27272a !important;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5) !important;
          font-family: var(--font-geist-mono), 'Fira Code', 'Consolas', 'Courier New', monospace !important;
          font-size: 0.85rem !important;
          line-height: 1.75 !important;
          position: relative !important;
          text-align: left !important;
        }
        .blog-content pre::before {
          content: "● ● ●  CODE BLOCK" !important;
          display: block !important;
          font-family: inherit !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          color: #71717a !important;
          letter-spacing: 0.08em !important;
          margin-bottom: 0.85rem !important;
          padding-bottom: 0.6rem !important;
          border-bottom: 1px solid #1f2330 !important;
          text-transform: uppercase !important;
        }
        .blog-content pre code {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          font-size: inherit !important;
          font-family: inherit !important;
          border: none !important;
        }
        .blog-content code:not(pre code) {
          background-color: #18181b !important;
          color: #38bdf8 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-size: 0.85em !important;
          font-family: var(--font-geist-mono), monospace !important;
          border: 1px solid #27272a !important;
        }
      `}</style>

      <main className="pt-6 flex-1">
        <div className="mx-auto max-w-[1536px] px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            블로그 목록으로 돌아가기
          </Link>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_460px]">
            {/* 왼쪽 2/3 본문 내용 */}
            <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm h-fit">
              <header className="border-b border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_42%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-4 md:px-7 md:py-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">
                  <Sparkles size={12} />
                  CreaiBox Insight
                </div>

                <h1 className="mt-2.5 text-lg font-black leading-[1.35] tracking-[-0.02em] text-zinc-950 md:text-[1.4rem]">
                  {post.title}
                </h1>
              </header>

              <div className="bg-white px-6 py-8 md:px-8">
                <div className="w-full">
                  {looksLikeHtml(normalizedContent) ? (
                    <div
                      className="blog-content text-[1.05rem] leading-[1.8] text-zinc-700 [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a.og-card]:no-underline [&_a.og-card]:font-normal [&_a.og-card]:text-zinc-950 [&_a.og-card_img]:my-0 [&_a.og-card_img]:m-0 [&_a.og-card_p]:my-0 [&_a.og-card_p]:mb-0 [&_blockquote]:my-8 [&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-zinc-950 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-zinc-950 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-900 [&_hr]:my-10 [&_hr]:border-zinc-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[18px] [&_iframe]:border [&_iframe]:border-zinc-200 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[18px] [&_li]:pl-1 [&_li]:marker:text-blue-600 [&_ol]:text-[1.05rem] [&_ol]:leading-[1.8] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.8] [&_p]:text-zinc-700 [&_strong]:font-black [&_strong]:text-zinc-950 [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-slate-300 [&_table_p]:!my-0 [&_table_p]:!py-0 [&_table_p]:!leading-snug [&_td]:border [&_td]:border-slate-300 [&_td]:!px-3.5 [&_td]:!py-2.5 [&_td]:!align-middle [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:text-zinc-900 [&_th]:!px-3.5 [&_th]:!py-2.5 [&_th]:font-bold [&_th]:!text-center [&_th]:!align-middle [&_ul]:text-[1.05rem] [&_ul]:leading-[1.8] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
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

                {/* CreaiBox Official SEO Outro Card */}
                {editorial.enabled && (
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
                       className="text-[1.05rem] leading-[1.8] [&_a]:text-blue-500 [&_a]:font-bold [&_a]:underline hover:[&_a]:text-blue-400 transition-colors"
                       style={{ color: editorial.textColor }}
                       dangerouslySetInnerHTML={{ __html: editorial.text }}
                     />
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="w-full mt-12 border-t border-zinc-200 pt-8">
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

                {/* 🌟 SEO 구조화 데이터(JSON-LD) 삽입 현황 확인 카드 */}
                {customSchemas.length > 0 && (
                  <div className="w-full mt-10 border-t border-zinc-200 pt-8 text-left">
                    <h2 className="text-sm font-black uppercase tracking-[0.24em] text-zinc-500 flex items-center gap-1.5">
                      <Star size={14} className="text-violet-500 fill-violet-500" />
                      검색엔진 Rich Schema info
                    </h2>
                    <div className="mt-4 p-5 rounded-2xl border border-violet-100 bg-violet-50/20">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase bg-violet-600 text-white px-2 py-0.5 rounded tracking-wide">
                          JSON-LD ACTIVE
                        </span>
                        {customSchemas.map((schemaStr, idx) => {
                          try {
                            const parsed = JSON.parse(schemaStr);
                            const type = parsed["@type"] || "Schema";
                            return (
                              <span key={`badge-${idx}`} className="text-[10px] font-black border border-violet-300 bg-white text-violet-700 px-2 py-0.5 rounded uppercase">
                                {type}
                              </span>
                            );
                          } catch {
                            return null;
                          }
                        })}
                      </div>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-3">
                        💡 이 글의 HTML 헤더 소스코드에 구조화 스키마 메타데이터가 정상적으로 주입되어 있습니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 이전 글 / 다음 글 네비게이션 */}
                <div className="w-full mt-12 border-t border-zinc-200 pt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* 이전 글 */}
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md text-left"
                    >
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {prevPost.thumbnailUrl ? (
                          <SafeImage
                            src={prevPost.thumbnailUrl}
                            alt={prevPost.title || "thumbnail"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          이전 글
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-zinc-800 group-hover:text-blue-600">
                          {prevPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 p-4 text-center text-xs font-bold text-zinc-400 min-h-[98px]">
                      이전 글이 존재하지 않습니다
                    </div>
                  )}

                  {/* 다음 글 */}
                  {nextPost ? (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md text-left"
                    >
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {nextPost.thumbnailUrl ? (
                          <SafeImage
                            src={nextPost.thumbnailUrl}
                            alt={nextPost.title || "thumbnail"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          다음 글
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-zinc-800 group-hover:text-blue-600">
                          {nextPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 p-4 text-center text-xs font-bold text-zinc-400 min-h-[98px]">
                      다음 글이 존재하지 않습니다
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* 오른쪽 1/3 베스트 글 위젯 (Sticky 적용) */}
            <aside className="lg:sticky lg:top-28 h-fit overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              {/* 상단 탭 헤더 (음영 적용) */}
              <div className="bg-zinc-50/90 border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">
                    Best Posts
                  </p>
                  <h2 className="mt-0.5 text-xl font-black text-zinc-950">
                    베스트 글
                  </h2>
                </div>
                <Star className="text-blue-500 fill-blue-500/10" size={20} />
              </div>

              {/* 하단 리스트 (화이트 바탕 + 콤팩트 세로 균형) */}
              <div className="bg-white divide-y divide-zinc-200/60">
                {bestPosts.map((bestPost) => {
                  return (
                    <Link
                      key={bestPost.id}
                      href={`/blog/${bestPost.slug}`}
                      className="group flex items-center gap-3.5 px-6 py-3 transition hover:bg-zinc-50/80"
                    >
                      <div className="relative w-24 sm:w-28 aspect-[16/9] shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {bestPost.thumbnailUrl ? (
                          <SafeImage
                            src={bestPost.thumbnailUrl}
                            alt={bestPost.title || "thumbnail"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h3 className="line-clamp-2 text-[0.98rem] font-normal leading-[1.5] text-zinc-800 group-hover:text-blue-600">
                          {bestPost.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
