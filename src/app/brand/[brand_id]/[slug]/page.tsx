import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import PostClientWrapper from "../components/PostClientWrapper";

export const dynamic = "force-dynamic";

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

interface PostDetailPageProps {
  params: Promise<{ brand_id: string; slug: string }>;
}

function normalizePublishedContent(content: string) {
  return content
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*\*\*\*+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function injectTableOfContents(htmlContent: string) {
  let headingIndex = 0;
  const headings: { id: string; text: string; level: number }[] = [];

  // Handle Markdown content separately if it doesn't look like HTML
  if (!looksLikeHtml(htmlContent)) {
    let mdHeadingIndex = 0;
    const mdHeadings: { id: string; text: string; level: number }[] = [];
    const lines = htmlContent.split("\n");
    const processedLines = lines.map((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        mdHeadingIndex++;
        const id = `toc-heading-${mdHeadingIndex}`;
        mdHeadings.push({ id, text, level });
        return `<h${level} id="${id}">${text}</h${level}>`;
      }
      return line;
    });

    if (mdHeadings.length === 0) {
      return htmlContent;
    }

    let listHtml = "";
    let h2Count = 0;
    let h3Count = 0;
    let h4Count = 0;

    mdHeadings.forEach((heading) => {
      let prefix = "";
      let indentStyle = "";
      
      if (heading.level === 2) {
        h2Count++;
        h3Count = 0;
        h4Count = 0;
        prefix = `${h2Count}. `;
        indentStyle = "padding-left: 0; font-weight: 700; color: var(--toc-h2);";
      } else if (heading.level === 3) {
        h3Count++;
        h4Count = 0;
        prefix = `${h2Count}-${h3Count}) `;
        indentStyle = "padding-left: 1rem; color: var(--toc-h3); font-size: 0.875rem;";
      } else if (heading.level === 4) {
        h4Count++;
        prefix = `${h2Count}-${h3Count}-${h4Count}. `;
        indentStyle = "padding-left: 2rem; color: var(--toc-h4); font-size: 0.8125rem;";
      }

      listHtml += `
        <li style="list-style: none; margin-bottom: 0.5rem; ${indentStyle}">
          <a href="#${heading.id}" style="text-decoration: none; color: inherit; transition: color 150ms;">
            ${prefix}${heading.text}
          </a>
        </li>
      `;
    });

    const tocHtml = `
<details open class="toc-container" style="margin: 2rem 0; border-radius: 16px; border: 1px solid var(--toc-border); background-color: var(--toc-bg); padding: 1.5rem; max-width: 42rem;">
  <summary class="toc-title" style="cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; font-weight: 900; color: var(--toc-title-color); user-select: none;">
    <span>- 목 차 -</span>
    <span class="toc-toggle" style="font-size: 0.625rem; color: var(--toc-toggle-color); font-weight: 700; border: 1px solid var(--toc-border); padding: 0.125rem 0.5rem; border-radius: 6px; background-color: var(--toc-toggle-bg);">접기/펼치기</span>
  </summary>
  <ul class="toc-list" style="margin-top: 1rem; padding-left: 0; border-top: 1px solid var(--toc-border-inner); padding-top: 1rem; margin-bottom: 0;">
    ${listHtml}
  </ul>
</details>
    `;

    const firstHeadingIdx = processedLines.findIndex(line => line.startsWith("<h2") || line.startsWith("<h3") || line.startsWith("<h4"));
    if (firstHeadingIdx !== -1) {
      processedLines.splice(firstHeadingIdx, 0, tocHtml);
    }
    return processedLines.join("\n");
  }

  // HTML content parsing
  const processedHtml = htmlContent.replace(/<h(2|3|4)\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelStr, attrs, content) => {
    const level = parseInt(levelStr, 10);
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (!text) return match;

    headingIndex++;
    const id = `toc-heading-${headingIndex}`;
    headings.push({ id, text, level });

    if (/id=["']/i.test(attrs)) {
      return `<h${level} ${attrs}>${content}</h${level}>`;
    }
    return `<h${level} id="${id}" ${attrs}>${content}</h${level}>`;
  });

  if (headings.length === 0) {
    return htmlContent;
  }

  let listHtml = "";
  let h2Count = 0;
  let h3Count = 0;
  let h4Count = 0;

  headings.forEach((heading) => {
    let prefix = "";
    let indentStyle = "";
    
    if (heading.level === 2) {
      h2Count++;
      h3Count = 0;
      h4Count = 0;
      prefix = `${h2Count}. `;
      indentStyle = "padding-left: 0; font-weight: 700; color: var(--toc-h2);";
    } else if (heading.level === 3) {
      h3Count++;
      h4Count = 0;
      prefix = `${h2Count}-${h3Count}) `;
      indentStyle = "padding-left: 1rem; color: var(--toc-h3); font-size: 0.875rem;";
    } else if (heading.level === 4) {
      h4Count++;
      prefix = `${h2Count}-${h3Count}-${h4Count}. `;
      indentStyle = "padding-left: 2rem; color: var(--toc-h4); font-size: 0.8125rem;";
    }

    listHtml += `
      <li style="list-style: none; margin-bottom: 0.5rem; ${indentStyle}">
        <a href="#${heading.id}" style="text-decoration: none; color: inherit; transition: color 150ms;">
          ${prefix}${heading.text}
        </a>
      </li>
    `;
  });

  const tocHtml = `
<details open class="toc-container" style="margin: 2rem 0; border-radius: 16px; border: 1px solid var(--toc-border); background-color: var(--toc-bg); padding: 1.5rem; max-width: 42rem;">
  <summary class="toc-title" style="cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; font-weight: 900; color: var(--toc-title-color); user-select: none;">
    <span>- 목 차 -</span>
    <span class="toc-toggle" style="font-size: 0.625rem; color: var(--toc-toggle-color); font-weight: 700; border: 1px solid var(--toc-border); padding: 0.125rem 0.5rem; border-radius: 6px; background-color: var(--toc-toggle-bg);">접기/펼치기</span>
  </summary>
  <ul class="toc-list" style="margin-top: 1rem; padding-left: 0; border-top: 1px solid var(--toc-border-inner); padding-top: 1rem; margin-bottom: 0;">
    ${listHtml}
  </ul>
</details>
  `;

  const firstHeadingMatch = processedHtml.match(/<h[2-4]\b/i);
  if (firstHeadingMatch && firstHeadingMatch.index !== undefined) {
    const idx = firstHeadingMatch.index;
    return processedHtml.slice(0, idx) + tocHtml + processedHtml.slice(idx);
  }

  return processedHtml;
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
  const supabase = await createAdminClient();
  const decodedSlug = decodeURIComponent(slug);

  // 1. Fetch Profile
  let profile: any = null;
  try {
    let { data: primaryProfile, error } = await supabase
      .from("profiles")
      .select("id, brand_id, nickname, extra_configs")
      .eq("brand_id", brandId)
      .eq("brand_id_status", "APPROVED")
      .maybeSingle();

    if (error) {
      console.error("Error fetching primary profile in post detail page:", error);
    }
    profile = primaryProfile;

    if (!profile) {
      const { data: profiles, error: err2 } = await supabase
        .from("profiles")
        .select("id, brand_id, nickname, extra_configs")
        .not("extra_configs", "is", null);

      if (err2) {
        console.error("Error fetching fallback profiles in post detail page:", err2);
      }

      if (profiles) {
        profile = profiles.find((p: any) => {
          const brandIds = p.extra_configs?.brand_ids || [];
          return brandIds.includes(brandId);
        }) || null;
      }
    }
  } catch (err) {
    console.error("fetchPost profile query exception in post detail page:", err);
  }

  if (!profile) return null;

  // 2. Fetch Post
  const { data: postData } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at, category_id, toc_enabled")
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
  const supabase = await createAdminClient();

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

  // Fetch Categories for Header Nav (filtering by active brand_id or null for legacy)
  const { data: categoriesData } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("user_id", profile.id)
    .or(`brand_id.eq.${brand_id},brand_id.is.null`)
    .order("created_at", { ascending: true });

  const categories = (categoriesData as BlogCategory[] | null) || [];

  // Sort categories based on brand_id category order
  const primaryId = profile.brand_id || "";
  const configs = profile.extra_configs || {};
  const orderIds = configs[`category_order_${brand_id}`] || (brand_id === primaryId ? configs.category_order : []) || [];
  if (Array.isArray(orderIds) && orderIds.length > 0) {
    categories.sort((a, b) => {
      const aIdx = orderIds.indexOf(a.id);
      const bIdx = orderIds.indexOf(b.id);
      if (aIdx === -1 && bIdx === -1) return 0;
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  }

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

  if (post.toc_enabled ?? true) {
    normalizedContent = injectTableOfContents(normalizedContent);
  }

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
    <>
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

      <PostClientWrapper
        brand_id={brand_id}
        profile={profile}
        post={post}
        category={category}
        categories={categories}
        publishedDate={publishedDate}
        normalizedContent={normalizedContent}
      />
    </>
  );
}
