import React, { cache } from "react";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/admin";
import PostClientWrapper from "../components/PostClientWrapper";
import PostViewTracker from "@/components/blog/PostViewTracker";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;

// 🌟 강제 정적(Static) 라우트 변환: 빈 배열 반환으로 빌드 타임에는 아무것도 생성하지 않되,
// 런타임에 접속되는 모든 동적 경로를 ISR(Static)로 취급하여 무조건 Edge Cache 및 자동 Viewport 프리패칭 활성화
export async function generateStaticParams() {
  return [];
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
  category_id?: string | null;
  thumbnailUrl?: string | null;
  toc_enabled?: boolean | null;
  published_snapshot?: any;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface PostDetailPageProps {
  params: Promise<{ brand_id: string; slug: string }>;
}

function isPostForBrand(postCanonicalUrl: string | null, targetBrandId: string, profileConfigs: any) {
  if (!postCanonicalUrl) return false;
  const canonicalLower = postCanonicalUrl.toLowerCase();
  
  const isSubdomain = 
    canonicalLower.includes(`://${targetBrandId.toLowerCase()}.creaibox.com`) ||
    canonicalLower.includes(`://${targetBrandId.toLowerCase()}.localhost:3000`);
  if (isSubdomain) return true;

  const customDomain = profileConfigs?.[`custom_domain_${targetBrandId}`] || 
    (targetBrandId === profileConfigs?.brand_id ? profileConfigs?.custom_domain : "");
  
  if (customDomain) {
    const isCustom = canonicalLower.includes(`://${customDomain.toLowerCase()}/`) || 
                     canonicalLower.endsWith(`://${customDomain.toLowerCase()}`);
    if (isCustom) return true;
  }
  
  return false;
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
      let indentStyle = "";
      
      if (heading.level === 2) {
        indentStyle = "padding-left: 0; font-weight: 700; color: var(--toc-h2);";
      } else if (heading.level === 3) {
        indentStyle = "padding-left: 1rem; color: var(--toc-h3); font-size: 0.875rem;";
      } else if (heading.level === 4) {
        indentStyle = "padding-left: 2rem; color: var(--toc-h4); font-size: 0.8125rem;";
      }

      listHtml += `
        <li style="list-style: none; margin-bottom: 0.5rem; ${indentStyle}">
          <a href="#${heading.id}" style="text-decoration: none; color: inherit; transition: color 150ms;">
            ${heading.text}
          </a>
        </li>
      `;
    });

    const tocHtml = `
<details open class="toc-container" style="margin: 2rem auto; border-radius: 16px; border: 1px solid var(--toc-border); background-color: var(--toc-bg); padding: 1.5rem; max-width: 42rem;">
  <summary class="toc-title" style="cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 900; color: var(--toc-title-color); user-select: none; position: relative;">
    <span>- 목 차 -</span>
    <span class="toc-toggle" style="position: absolute; right: 0; font-size: 0.625rem; color: var(--toc-toggle-color); font-weight: 700; border: 1px solid var(--toc-border); padding: 0.125rem 0.5rem; border-radius: 6px; background-color: var(--toc-toggle-bg);">접기/펼치기</span>
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
    let indentStyle = "";
    
    if (heading.level === 2) {
      indentStyle = "padding-left: 0; font-weight: 700; color: var(--toc-h2);";
    } else if (heading.level === 3) {
      indentStyle = "padding-left: 1rem; color: var(--toc-h3); font-size: 0.875rem;";
    } else if (heading.level === 4) {
      indentStyle = "padding-left: 2rem; color: var(--toc-h4); font-size: 0.8125rem;";
    }

    listHtml += `
      <li style="list-style: none; margin-bottom: 0.5rem; ${indentStyle}">
        <a href="#${heading.id}" style="text-decoration: none; color: inherit; transition: color 150ms;">
          ${heading.text}
        </a>
      </li>
    `;
  });

  const tocHtml = `
<details open class="toc-container" style="margin: 2rem auto; border-radius: 16px; border: 1px solid var(--toc-border); background-color: var(--toc-bg); padding: 1.5rem; max-width: 42rem;">
  <summary class="toc-title" style="cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 900; color: var(--toc-title-color); user-select: none; position: relative;">
    <span>- 목 차 -</span>
    <span class="toc-toggle" style="position: absolute; right: 0; font-size: 0.625rem; color: var(--toc-toggle-color); font-weight: 700; border: 1px solid var(--toc-border); padding: 0.125rem 0.5rem; border-radius: 6px; background-color: var(--toc-toggle-bg);">접기/펼치기</span>
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

const fetchPost = cache(async (brandId: string, slug: string) => {
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
  let query = supabase
    .from("writing_creaibox_posts")
    .select("id, title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at, updated_at, category_id, toc_enabled, published_snapshot")
    .eq("user_id", profile.id)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

  if (decodedSlug === slug) {
    query = query.eq("slug", decodedSlug);
  } else {
    query = query.or(`slug.eq."${decodedSlug}",slug.eq."${slug}"`);
  }

  const { data: postDataList } = await query;
  const postData = postDataList?.[0];

  if (!postData) return null;

  const post = postData as PublishedPostDetail;

  if (post.published_snapshot) {
    const snapshot = post.published_snapshot as any;
    post.title = snapshot.title ?? post.title;
    post.content = snapshot.content ?? post.content;
    post.slug = snapshot.slug ?? post.slug;
    post.meta_description = snapshot.meta_description ?? post.meta_description;
    post.focus_keyword = snapshot.focus_keyword ?? post.focus_keyword;
    post.canonical_url = snapshot.canonical_url ?? post.canonical_url;
    post.seo_tags = snapshot.seo_tags ?? post.seo_tags;
    post.category_id = snapshot.category_id ?? post.category_id;
    if (snapshot.toc_enabled !== undefined) {
      post.toc_enabled = snapshot.toc_enabled;
    }
  }

  // 3. Fetch Thumbnail
  const { data: images } = await supabase
    .from("generated_images")
    .select("image_url, is_primary, created_at")
    .eq("source_type", "writing_creaibox_posts")
    .eq("source_id", post.id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  const primaryImg = (images || []).find((img) => img.is_primary) || (images || [])[0];
  post.thumbnailUrl = primaryImg ? primaryImg.image_url : null;

  return {
    post,
    profile,
  };
});

function cleanGoogleVerificationKey(rawKey: string): string {
  if (!rawKey) return "";
  const clean = rawKey.trim();
  const metaMatch = /content=["']([^"']+)["']/i.exec(clean);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }
  if (clean.startsWith("google-site-verification=")) {
    return clean.replace("google-site-verification=", "").trim();
  }
  return clean;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { brand_id, slug } = await params;
  const result = await fetchPost(brand_id, slug);

  if (!result) {
    return {
      title: "게시글을 찾을 수 없습니다 | CreaiBox",
    };
  }

  const { post, profile } = result;
  const configs = profile.extra_configs || {};
  const isPrimary = brand_id.toLowerCase() === (profile.brand_id || "").toLowerCase();

  const getConf = (key: string, fallback: string = ""): string => {
    const brandKey = `${key}_${brand_id.toLowerCase()}`;
    if (configs[brandKey] !== undefined && configs[brandKey] !== null && String(configs[brandKey]).trim() !== "") {
      return String(configs[brandKey]);
    }
    if (configs[key] !== undefined && configs[key] !== null && String(configs[key]).trim() !== "") {
      return String(configs[key]);
    }
    return fallback;
  };

  const blogTitle = getConf("blog_title", `${profile.nickname || brand_id} 블로그`);
  
  // Rank Math style SEO templates compiler
  let seoTitle = "";
  const seoTemplateTitle = getConf("seo_template_title");
  if (seoTemplateTitle) {
    seoTitle = seoTemplateTitle
      .replace(/%title%/g, post.title || "")
      .replace(/%blog_title%/g, blogTitle);
  } else {
    seoTitle = `${post.title} - ${blogTitle}`;
  }

  if (blogTitle && !seoTitle.includes(blogTitle)) {
    seoTitle = `${seoTitle} - ${blogTitle}`;
  }

  let seoDesc = post.meta_description || post.focus_keyword || "CreaiBox 블로그 글";
  const seoTemplateDesc = getConf("seo_template_desc");
  if (seoTemplateDesc) {
    seoDesc = seoTemplateDesc
      .replace(/%title%/g, post.title || "")
      .replace(/%blog_title%/g, blogTitle)
      .replace(/%description%/g, post.meta_description || "");
  }

  const rawCanonical = post.canonical_url || `https://${brand_id}.creaibox.com/${slug}`;
  const canonical = encodeURI(rawCanonical);

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

  const naverKey = getConf("naver_advisor_key");
  const googleKey = getConf("google_search_console_key");
  const cleanGoogleKey = cleanGoogleVerificationKey(googleKey);
  if (naverKey || cleanGoogleKey) {
    meta.other = {
      ...(naverKey ? { "naver-site-verification": naverKey } : {}),
      ...(cleanGoogleKey ? { "google-site-verification": cleanGoogleKey } : {}),
    };
  }

  return meta;
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
            .select("source_id, image_url, is_primary, created_at")
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
              ? `<div class="w-full aspect-[16/9] overflow-hidden border-b border-zinc-100 p-0 m-0 leading-none">
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

export default async function BrandPostDetailPage({ params }: PostDetailPageProps) {
  try {
    const { brand_id, slug } = await params;
    const initialTheme: "light" | "dark" = "light";

    const result = await fetchPost(brand_id, slug);

    if (!result) {
      notFound();
    }

    const { post, profile } = result;
    const supabase = await createAdminClient();

    const configs = profile.extra_configs || {};
    const isPrimary = brand_id.toLowerCase() === (profile.brand_id || "").toLowerCase();

    const getConf = (key: string, fallback: string = ""): string => {
      if (isPrimary) return configs[key] || fallback;
      return configs[`${key}_${brand_id.toLowerCase()}`] || configs[key] || fallback;
    };

    const blogTitle = getConf("blog_title", `${profile.nickname || brand_id} 블로그`);
    const accentColor = getConf("blog_accent_color", "#3b82f6");
    const gaId = getConf("ga_id");

  // Fetch Category details, categories list, and sibling posts list in parallel for speed optimization
  const [categoryResult, categoriesResult, siblingPostsResult] = await Promise.all([
    post.category_id
      ? supabase.from("blog_categories").select("*").eq("id", post.category_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("blog_categories")
      .select("*")
      .eq("user_id", profile.id)
      .or(`brand_id.eq.${brand_id},brand_id.is.null`)
      .order("created_at", { ascending: true }),
    supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, created_at, canonical_url")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false })
  ]);

  const category = categoryResult.data as BlogCategory | null;
  const categories = (categoriesResult.data as BlogCategory[] | null) || [];

  // Sort categories based on brand_id category order
  const primaryId = profile.brand_id || "";
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

  const postsRaw = siblingPostsResult.data || [];
  let brandPosts: any[] = [];
  
  if (postsRaw.length > 0) {
    const isPrimary = brand_id === profile.brand_id;
    const filteredRaw = postsRaw.filter((p) => {
      if (!p.canonical_url) return isPrimary;
      return isPostForBrand(p.canonical_url, brand_id, profile.extra_configs);
    });

    if (filteredRaw.length > 0) {
      const filteredIds = filteredRaw.map((p) => p.id);
      
      const { data: images } = await supabase
        .from("generated_images")
        .select("source_id, image_url, is_primary, created_at")
        .eq("source_type", "writing_creaibox_posts")
        .in("source_id", filteredIds)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      const imageMap: Record<string, string> = {};
      (images || []).forEach((img) => {
        if (!img.source_id) return;
        if (!imageMap[img.source_id] || img.is_primary) {
          imageMap[img.source_id] = img.image_url;
        }
      });

      brandPosts = filteredRaw.map((p) => ({
        ...p,
        thumbnailUrl: imageMap[p.id] || null
      }));
    }
  }

  const currentIndex = brandPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex !== -1 && currentIndex < brandPosts.length - 1 ? brandPosts[currentIndex + 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex > 0 ? brandPosts[currentIndex - 1] : null;

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

  normalizedContent = await transformContentWithOgCards(normalizedContent, supabase);

  const rawCanonical = post.canonical_url || `https://${brand_id}.creaibox.com/${slug}`;
  const canonical = encodeURI(rawCanonical);

  // 🌟 Auto-inject Structured JSON-LD Data
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "CreaiBox Blog",
    description: post.meta_description || post.focus_keyword || "CreaiBox 블로그 포스팅",
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
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
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

      <PostViewTracker postId={post.id} />
      <PostClientWrapper
        brand_id={brand_id}
        profile={profile}
        post={post}
        category={category}
        categories={categories}
        publishedDate={publishedDate}
        normalizedContent={normalizedContent}
        prevPost={prevPost}
        nextPost={nextPost}
        bestPosts={brandPosts.slice(0, 5)}
        initialTheme={initialTheme}
        customSchemas={customSchemas}
      />
    </>
  );
  } catch (err) {
    console.error("Failed to render post detail page:", err);
    return notFound();
  }
}
