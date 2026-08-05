import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/server";
import { Sparkles } from "lucide-react";
import BlogListPaginatedView, { BlogItem } from "@/components/blog/BlogListPaginatedView";

export const revalidate = 60;

interface PublishedPost {
  id: string;
  title: string | null;
  slug: string | null;
  content: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  seo_tags: string[] | null;
  created_at: string | null;
  canonical_url: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x3D;/gi, "=")
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(post: PublishedPost) {
  const raw = (post.meta_description || post.focus_keyword || "소통과 채움 소식").trim();
  const source = decodeHtmlEntities(raw);
  return source.length > 120 ? `${source.slice(0, 120)}...` : source;
}

function getPostThumbnail(post: PublishedPost, primaryMap: Record<string, string>): string | null {
  if (primaryMap[post.id]) return primaryMap[post.id];
  if (post.slug && primaryMap[post.slug]) return primaryMap[post.slug];
  if (post.content) {
    const imgMatches = Array.from(post.content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
    for (const match of imgMatches) {
      const src = match[1];
      if (src && !src.includes("stat.naver.com") && !src.includes("post-phinf.pstatic.net/20") && !src.includes("blank.gif")) {
        return src;
      }
      if (src && !src.includes("stat.naver.com")) {
        return src;
      }
    }
  }
  return null;
}

function inferCategory(post: PublishedPost): string {
  const text = ((post.title || "") + " " + (post.meta_description || "") + " " + (post.focus_keyword || "") + " " + (post.seo_tags?.join(" ") || "")).toLowerCase();
  
  if (text.includes("행사") || text.includes("축제") || text.includes("개소식") || text.includes("준공식") || text.includes("대행")) {
    return "행사대행";
  }
  if (text.includes("교육") || text.includes("테라피") || text.includes("역량") || text.includes("체험") || text.includes("원예")) {
    return "교육서비스";
  }
  if (text.includes("캠프") || text.includes("가족") || text.includes("힐링")) {
    return "가족캠프";
  }
  return "소통소식";
}

export default async function SotongcheumBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }> | { page?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const rawPage = parseInt(resolvedParams.page || "1", 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const supabase = await createAdminClient();

  // Fetch Profile for sotongcheum
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, brand_id, extra_configs")
    .eq("brand_id", "sotongcheum")
    .maybeSingle();

  const customCategories: string[] = (profile as any)?.extra_configs?.blog_categories || [
    "전체",
    "행사대행",
    "교육서비스",
    "가족캠프",
    "소통소식",
  ];

  let posts: PublishedPost[] = [];
  let primaryImageMap: Record<string, string> = {};

  if (profile?.id) {
    const { data } = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    posts = (data as PublishedPost[] | null) || [];

    // 🌟 게시글 스마트 정렬 (최신 발행년도/날짜 2026년 -> 2018년 순으로 최상단 노출)
    posts.sort((a, b) => {
      const getPostTime = (p: PublishedPost) => {
        const title = p.title || "";
        const meta = p.meta_description || "";
        const text = title + " " + meta;
        const yearMatch = text.match(/(20\d{2})/);
        const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

        const dateObj = p.created_at ? new Date(p.created_at) : null;
        const dbTime = dateObj && !isNaN(dateObj.getTime()) ? dateObj.getTime() : 0;

        if (year) {
          return new Date(Date.UTC(year, 5, 15)).getTime();
        }
        return dbTime;
      };

      return getPostTime(b) - getPostTime(a);
    });

    if (posts.length > 0) {
      const postIds = posts.map((p) => p.id);
      const postSlugs = posts.map((p) => p.slug).filter(Boolean) as string[];
      const { data: images } = await supabase
        .from("generated_images")
        .select("source_id, image_url, is_primary")
        .eq("source_type", "writing_creaibox_posts")
        .in("source_id", [...postIds, ...postSlugs]);

      (images || []).forEach((img: any) => {
        if (img.source_id && img.image_url) {
          if (img.is_primary || !primaryImageMap[img.source_id]) {
            primaryImageMap[img.source_id] = img.image_url;
          }
        }
      });
    }
  }

  const formattedPosts: BlogItem[] = posts.map((post) => ({
    id: post.id,
    title: post.title || "제목 없음",
    desc: buildExcerpt(post),
    slug: post.slug || post.id,
    dateStr: formatDate(post.created_at),
    thumb: getPostThumbnail(post, primaryImageMap),
    category: inferCategory(post),
  }));

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-12">
      {/* Page Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-12 border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-400/20">
            <Sparkles size={13} /> 소통과 채움 공식 블로그
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            소통과 채움의 최신 소식 & 인사이트
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            공공행사 대행, 공동체 축제, 감성 교육 서비스 및 최신 소통 스토리를 만나보세요.
          </p>
        </div>
      </div>

      {/* Posts Grid Component with Category Filter Tabs & Instant Zero-Latency Switch */}
      <BlogListPaginatedView
        posts={formattedPosts}
        companyName="소통과 채움"
        initialPage={currentPage}
        categories={customCategories}
      />
    </div>
  );
}
