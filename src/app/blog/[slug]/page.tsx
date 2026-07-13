import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles, Star } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  p: ({ children }) => (
    <p className="mb-6 text-[1.05rem] leading-[1.8] text-zinc-700">
      {children}
    </p>
  ),
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

async function fetchPublishedPost(slug: string) {
  const supabase = await createAdminClient();
  const decodedSlug = decodeURIComponent(slug);

  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "ADMIN");

  const adminIds = (admins || []).map((a) => a.id);

  let data: any[] = [];
  let error: any = null;

  if (adminIds.length > 0) {
    const query = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at")
      .eq("slug", decodedSlug)
      .eq("status", "published")
      .in("user_id", adminIds)
      .order("created_at", { ascending: false })
      .limit(1);
    data = query.data || [];
    error = query.error;
  }

  if (error || !data || data.length === 0) {
    return null;
  }


  const post = data[0] as PublishedPostDetail;
  if (!isMainSitePost(post.canonical_url)) {
    return null;
  }

  // Fetch thumbnail for this post
  const { data: images, error: imagesError } = await supabase
    .from("generated_images")
    .select("image_url, is_primary")
    .eq("source_type", "writing_creaibox_posts")
    .eq("image_role", "thumbnail")
    .eq("source_id", post.id);

  if (imagesError) {
    console.error("썸네일 이미지 조회 실패:", imagesError.message);
  }

  const primaryImg = (images || []).find((img) => img.is_primary) || (images || [])[0];
  post.thumbnailUrl = primaryImg ? primaryImg.image_url : null;

  return post;
}

async function fetchPublishedPostsList() {
  const supabase = await createAdminClient();
  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "ADMIN");

  const adminIds = (admins || []).map((a) => a.id);
  if (adminIds.length === 0) return [];

  const { data: posts } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, canonical_url, created_at")
    .eq("status", "published")
    .in("user_id", adminIds)
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  const publishedPostsRaw = (posts || []).filter((post) => post.slug && isMainSitePost(post.canonical_url));
  if (publishedPostsRaw.length === 0) return [];

  const postIds = publishedPostsRaw.map((p) => p.id);
  const { data: images } = await supabase
    .from("generated_images")
    .select("source_id, image_url, is_primary")
    .eq("source_type", "writing_creaibox_posts")
    .eq("image_role", "thumbnail")
    .in("source_id", postIds);

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
      thumbnailUrl: primaryImg ? primaryImg.url : null,
    };
  });
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | CreAibox Blog",
    };
  }

  const canonical = post.canonical_url || `https://creaibox.com/blog/${slug}`;

  return {
    title: `${post.title} | CreAibox Blog`,
    description: post.meta_description || post.focus_keyword || "CreAibox 공개 블로그 상세 페이지",
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title || "CreAibox Blog",
      description: post.meta_description || post.focus_keyword || "CreAibox 공개 블로그 상세 페이지",
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
    subtitle: "CreAibox Insight Editorial",
    text: "본 콘텐츠는 올인원 콘텐츠 제작형 생성형 AI 스튜디오 크리에이박스(CreAibox)의 오리지널 인사이트 리포트입니다. 인공지능 기반의 고품질 콘텐츠 생성 가이드와 비즈니스 성장 전략에 대한 더 많은 전문 자료는 크리에이박스(CreAibox) 공식 블로그 기사 및 스튜디오 가이드에서 확인하실 수 있습니다."
  };

  if (editorialMatch && editorialMatch[1]) {
    try {
      const parsed = JSON.parse(editorialMatch[1]);
      editorial = { ...editorial, ...parsed };
    } catch (e) {
      console.error("Failed to parse editorial settings:", e);
    }
  }

  // 🌟 에디토리얼 설정 댓글 및 스키마 제거
  const contentWithoutEditorial = (post.content || "").replace(editorialRegex, "").trim();
  const contentWithoutSchemas = contentWithoutEditorial.replace(schemaRegex, "");
  let normalizedContent = normalizePublishedContent(contentWithoutSchemas);

  const canonical = post.canonical_url || `https://creaibox.com/blog/${post.slug || slug}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "CreAibox Blog",
    description:
      post.meta_description || post.focus_keyword || "CreAibox 공개 블로그 상세 페이지",
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
      name: "CreAibox",
      url: "https://creaibox.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CreAibox",
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

      <Header />

      <main className="pt-24 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            블로그 목록으로 돌아가기
          </Link>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_380px]">
            {/* 왼쪽 2/3 본문 내용 */}
            <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm h-fit">
              <header className="border-b border-zinc-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_42%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-6 md:px-8 md:py-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">
                  <Sparkles size={12} />
                  CreAibox Insight
                </div>

                <h1 className="mt-3 text-2xl font-black leading-[1.3] tracking-[-0.02em] text-zinc-950 md:text-[1.85rem]">
                  {post.title}
                </h1>

                {post.focus_keyword && (
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-500">
                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-blue-700">
                      {post.focus_keyword}
                    </span>
                  </div>
                )}
              </header>

              <div className="bg-white px-6 py-8 md:px-8">
                <div className="w-full">
                  {looksLikeHtml(normalizedContent) ? (
                    <div
                      className="blog-content text-[1.05rem] leading-[1.8] text-zinc-700 [&_a]:font-bold [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-zinc-950 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-zinc-950 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-900 [&_hr]:my-10 [&_hr]:border-zinc-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[18px] [&_iframe]:border [&_iframe]:border-zinc-200 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[18px] [&_li]:pl-1 [&_li]:marker:text-blue-600 [&_ol]:text-[1.05rem] [&_ol]:leading-[1.8] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.05rem] [&_p]:leading-[1.8] [&_p]:text-zinc-700 [&_strong]:font-black [&_strong]:text-zinc-950 [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-[16px] [&_td]:border [&_td]:border-zinc-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:border [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_ul]:text-[1.05rem] [&_ul]:leading-[1.8] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
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

                {/* CreAibox Official SEO Outro Card */}
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
                      className="text-[1.05rem] leading-[1.8]"
                      style={{ color: editorial.textColor }}
                    >
                      {editorial.text}
                    </p>
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
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {prevPost.thumbnailUrl ? (
                          <img
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
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {nextPost.thumbnailUrl ? (
                          <img
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
            <aside className="lg:sticky lg:top-28 h-fit rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                    Best Posts
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-zinc-950">
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
                      href={`/blog/${bestPost.slug}`}
                      className="group flex items-center gap-4 rounded-none px-2 py-3 transition hover:bg-white border-b border-zinc-200/60 last:border-b-0"
                    >
                      <div className="relative w-16 aspect-[16/9] shrink-0 overflow-hidden rounded-none border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                        {bestPost.thumbnailUrl ? (
                          <img
                            src={bestPost.thumbnailUrl}
                            alt={bestPost.title || "thumbnail"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-zinc-800 group-hover:text-blue-600">
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
