import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles, Tag } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

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
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface PostDetailPageProps {
  params: Promise<{ brand_id: string; slug: string }>;
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-zinc-800 pb-4 text-[1.75rem] font-black leading-[1.25] tracking-[-0.03em] text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-6 text-[1.35rem] font-black leading-[1.35] tracking-[-0.02em] text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-[1.05rem] font-black leading-[1.4] text-zinc-200">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-[1.18rem] leading-[2.02] text-zinc-300">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-black text-white">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-8 ml-6 list-disc space-y-3 text-[1.25rem] leading-[1.95] text-zinc-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 ml-6 list-decimal space-y-3 text-[1.25rem] leading-[1.95] text-zinc-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-blue-500">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-[22px] border border-zinc-800 bg-zinc-900/30 px-6 py-5 text-[1.12rem] font-medium leading-[1.9] text-zinc-400">
      {children}
    </blockquote>
  ),
  hr: () => <div className="my-10 h-px w-full bg-zinc-900" />,
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
      className="my-8 w-full h-auto rounded-[24px] border border-zinc-900"
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

async function fetchPost(brandId: string, slug: string) {
  const supabase = await createClient();
  const decodedSlug = decodeURIComponent(slug);

  // 1. Fetch Profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, brand_id, nickname, extra_configs")
    .eq("brand_id", brandId)
    .eq("brand_id_status", "APPROVED")
    .maybeSingle();

  if (!profile) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, brand_id, nickname, extra_configs")
      .not("extra_configs", "is", null);

    if (profiles) {
      profile = profiles.find((p: any) => {
        const brandIds = p.extra_configs?.brand_ids || [];
        return brandIds.includes(brandId);
      }) || null;
    }
  }

  if (!profile) return null;

  // 2. Fetch Post
  const { data: postData } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at, category_id")
    .eq("user_id", profile.id)
    .eq("slug", decodedSlug)
    .eq("status", "published")
    .maybeSingle();

  if (!postData) return null;

  const post = postData as PublishedPostDetail;

  // 3. Fetch Thumbnail
  const { data: images } = await supabase
    .from("generated_images")
    .select("image_url, is_primary")
    .eq("source_type", "writing_creaibox_posts")
    .eq("image_role", "thumbnail")
    .eq("source_id", post.id);

  const primaryImg = (images || []).find((img) => img.is_primary) || (images || [])[0];
  post.thumbnailUrl = primaryImg ? primaryImg.image_url : null;

  return {
    post,
    profile,
  };
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { brand_id, slug } = await params;
  const result = await fetchPost(brand_id, slug);

  if (!result) {
    return {
      title: "게시글을 찾을 수 없습니다 | CreAibox",
    };
  }

  const { post, profile } = result;
  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  
  // Rank Math style SEO templates compiler
  let seoTitle = `${post.title} | ${blogTitle}`;
  if (profile.extra_configs?.seo_template_title) {
    seoTitle = profile.extra_configs.seo_template_title
      .replace(/%title%/g, post.title || "")
      .replace(/%blog_title%/g, blogTitle);
  }

  let seoDesc = post.meta_description || post.focus_keyword || "CreAibox 블로그 글";
  if (profile.extra_configs?.seo_template_desc) {
    seoDesc = profile.extra_configs.seo_template_desc
      .replace(/%title%/g, post.title || "")
      .replace(/%blog_title%/g, blogTitle)
      .replace(/%description%/g, post.meta_description || "");
  }

  const canonical = post.canonical_url || `https://${brand_id}.creaibox.com/${slug}`;

  const meta: Metadata = {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: "article",
      url: canonical,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  };

  if (profile.extra_configs?.naver_advisor_key) {
    meta.other = {
      "naver-site-verification": profile.extra_configs.naver_advisor_key,
    };
  }

  return meta;
}

export default async function BrandPostDetailPage({ params }: PostDetailPageProps) {
  const { brand_id, slug } = await params;
  const result = await fetchPost(brand_id, slug);

  if (!result) {
    notFound();
  }

  const { post, profile } = result;
  const supabase = await createClient();

  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  const accentColor = profile.extra_configs?.blog_accent_color || "#3b82f6";
  const gaId = profile.extra_configs?.ga_id;

  // Fetch Category details if attached
  let category: BlogCategory | null = null;
  if (post.category_id) {
    const { data: catData } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("id", post.category_id)
      .maybeSingle();
    category = catData as BlogCategory | null;
  }

  // Fetch Categories for Header Nav
  const { data: categoriesData } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true });

  const categories = (categoriesData as BlogCategory[] | null) || [];

  const tags = post.seo_tags || [];
  const publishedDate = formatDate(post.created_at);

  // Extract custom JSON-LD schemas
  const customSchemas: string[] = [];
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = schemaRegex.exec(post.content || "")) !== null) {
    if (match[1]) {
      customSchemas.push(match[1].trim());
    }
  }

  const contentWithoutSchemas = (post.content || "").replace(schemaRegex, "");
  let normalizedContent = normalizePublishedContent(contentWithoutSchemas);

  const canonical = post.canonical_url || `https://${brand_id}.creaibox.com/${slug}`;

  // 🌟 Auto-inject Structured JSON-LD Data
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "CreAibox Blog",
    description: post.meta_description || post.focus_keyword || "CreAibox 블로그 포스팅",
    url: canonical,
    image: post.thumbnailUrl || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    author: {
      "@type": "Person",
      name: profile.nickname || brand_id,
    },
    publisher: {
      "@type": "Organization",
      name: blogTitle,
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
        item: `https://${brand_id}.creaibox.com`,
      },
      ...(category ? [{
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `https://${brand_id}.creaibox.com/category/${category.slug}`,
      }] : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: post.title || "게시글",
        item: canonical,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Dynamic SEO JSON-LD scripts */}
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

      {/* Google Analytics */}
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

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
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
            <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              전체글
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`text-sm font-bold transition-colors ${
                  category && cat.id === category.id ? "text-white underline decoration-blue-500 decoration-2 underline-offset-4" : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main post container */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs font-black text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
        >
          <ArrowLeft size={14} /> 블로그 홈으로 돌아가기
        </Link>

        <article className="mt-8 overflow-hidden rounded-[32px] border border-zinc-900 bg-zinc-900/10">
          <header className="border-b border-zinc-900 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_42%)] px-8 py-12 md:px-12">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-400 transition-colors hover:bg-blue-500/10"
                >
                  <Tag size={10} /> {category.name}
                </Link>
              )}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                <Sparkles size={10} className="text-yellow-400" /> Insight
              </div>
            </div>

            <h1 className="mt-6 text-3xl md:text-[2.5rem] font-black leading-[1.2] tracking-tight text-white">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {publishedDate}
              </span>
              <span>•</span>
              <span>By {profile.nickname || brand_id}</span>
            </div>
          </header>

          <div className="px-8 py-12 md:px-12 space-y-8">
            {post.thumbnailUrl && (
              <div className="w-full overflow-hidden rounded-[24px] border border-zinc-900 aspect-[16/9]">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title || "thumbnail"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {post.meta_description && (
              <div className="rounded-[22px] border border-zinc-800 bg-zinc-900/30 px-6 py-5 text-sm md:text-base font-bold text-zinc-400 leading-relaxed italic">
                {post.meta_description}
              </div>
            )}

            <div className="mx-auto max-w-[1100px] border-t border-zinc-900/80 pt-8">
              {looksLikeHtml(normalizedContent) ? (
                <div
                  className="blog-content text-[1.18rem] leading-[2.02] text-zinc-300 [&_a]:font-bold [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-500 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-zinc-800 [&_blockquote]:bg-zinc-900/20 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-medium [&_br]:block [&_div[data-youtube-video]]:my-8 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-800 [&_h1]:pb-4 [&_h1]:text-[1.75rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h1]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-[1.35rem] [&_h2]:font-black [&_h2]:leading-[1.35] [&_h2]:tracking-[-0.02em] [&_h2]:text-white [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.05rem] [&_h3]:font-black [&_h3]:leading-[1.4] [&_h3]:text-zinc-200 [&_hr]:my-10 [&_hr]:border-zinc-800 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-[18px] [&_iframe]:border [&_iframe]:border-zinc-800 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[18px] [&_img]:border [&_img]:border-zinc-900 [&_li]:pl-1 [&_li]:marker:text-blue-500 [&_ol]:text-[1.25rem] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_p]:mb-6 [&_p]:text-[1.18rem] [&_p]:leading-[2.02] [&_p]:text-zinc-300 [&_strong]:font-black [&_strong]:text-white [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-[16px] [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:border [&_th]:border-zinc-800 [&_th]:bg-zinc-900/40 [&_th]:px-4 [&_th]:py-3 [&_th]:font-black [&_ul]:text-[1.25rem] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3"
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
              <div className="border-t border-zinc-900 pt-8 mt-12">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center text-xs font-bold text-zinc-600">
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
