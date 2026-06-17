import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Sparkles, ArrowRight, Rss, ArrowLeft, Tag } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";

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

interface CategoryPageProps {
  params: Promise<{ brand_id: string; slug: string }>;
}

function buildExcerpt(post: PublishedPost) {
  const source = (post.meta_description || post.focus_keyword || "인사이트 포스팅").trim();
  return source.length > 130 ? `${source.slice(0, 130)}...` : source;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

async function getProfileByBrandId(supabase: any, brandId: string) {
  try {
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("brand_id", brandId)
      .eq("brand_id_status", "APPROVED")
      .maybeSingle();

    if (error) {
      console.error("Error fetching primary profile in category page:", error);
    }

    if (!profile) {
      const { data: profiles, error: err2 } = await supabase
        .from("profiles")
        .select("*")
        .not("extra_configs", "is", null);

      if (err2) {
        console.error("Error fetching fallback profiles in category page:", err2);
      }

      if (profiles) {
        profile = profiles.find((p: any) => {
          const brandIds = p.extra_configs?.brand_ids || [];
          return brandIds.includes(brandId);
        }) || null;
      }
    }
    return profile;
  } catch (err) {
    console.error("getProfileByBrandId exception in category page:", err);
    return null;
  }
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

// 🌟 Generate metadata for category listing page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { brand_id, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createAdminClient();

  const profile = await getProfileByBrandId(supabase, brand_id);

  if (!profile) {
    return {
      title: "블로그를 찾을 수 없습니다 | CreAibox",
    };
  }

  const { data: category } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", decodedSlug)
    .or(`brand_id.eq.${brand_id},brand_id.is.null`)
    .maybeSingle();

  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  const catName = category ? category.name : decodedSlug;

  return {
    title: `${catName} - ${blogTitle}`,
    description: `${blogTitle}의 ${catName} 카테고리 글 목록입니다.`,
  };
}

export default async function BrandCategoryPage({ params }: CategoryPageProps) {
  const { brand_id, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createAdminClient();

  // 1. Fetch Profile
  const profile = await getProfileByBrandId(supabase, brand_id);

  if (!profile) {
    notFound();
  }

  // 2. Fetch Category detail (filtering by active brand_id or null for legacy)
  const { data: category } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", decodedSlug)
    .or(`brand_id.eq.${brand_id},brand_id.is.null`)
    .maybeSingle();

  if (!category) {
    notFound();
  }

  // 3. Fetch Categories for Header Nav (filtering by active brand_id or null for legacy)
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

  // 4. Fetch Published Posts in Category
  const { data: postsData } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at, category_id")
    .eq("user_id", profile.id)
    .eq("category_id", category.id)
    .eq("status", "published")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  const postsRaw = (postsData as PublishedPost[] | null) || [];
  let posts: PublishedPost[] = [];

  if (postsRaw.length > 0) {
    const postIds = postsRaw.map((p) => p.id);
    const { data: images } = await supabase
      .from("generated_images")
      .select("source_id, image_url, is_primary")
      .eq("source_type", "writing_creaibox_posts")
      .eq("image_role", "thumbnail")
      .in("source_id", postIds);

    const imageMap: Record<string, { url: string; is_primary: boolean }[]> = {};
    (images || []).forEach((img) => {
      if (!img.source_id) return;
      if (!imageMap[img.source_id]) imageMap[img.source_id] = [];
      imageMap[img.source_id].push({
        url: img.image_url,
        is_primary: !!img.is_primary,
      });
    });

    posts = postsRaw.map((post) => {
      const postImages = imageMap[post.id] || [];
      const primaryImg = postImages.find((img) => img.is_primary) || postImages[0];
      return {
        ...post,
        thumbnailUrl: primaryImg ? primaryImg.url : null,
      };
    });
  }

  // Filter posts by target subdomain brand_id
  const isPrimary = brand_id === profile.brand_id;
  posts = posts.filter((post) => {
    if (!post.canonical_url) {
      return isPrimary;
    }
    return isPostForBrand(post.canonical_url, brand_id, profile.extra_configs);
  });

  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  const accentColor = profile.extra_configs?.blog_accent_color || "#3b82f6";
  const template = profile.extra_configs?.blog_template || "card";

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
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
                  cat.id === category.id ? "text-white underline decoration-blue-500 decoration-2 underline-offset-4" : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Category Intro Section */}
      <section className="relative border-b border-zinc-900 bg-zinc-900/10 py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_40%)]" />
        
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft size={12} /> 블로그 홈
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Tag className="text-blue-500 shrink-0" size={32} />
              {category.name}
            </h1>
            <p className="text-sm font-bold text-zinc-400">
              {category.name} 카테고리에 등록된 {posts.length}개의 글
            </p>
          </div>
        </div>
      </section>

      {/* Main content body */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        {posts.length === 0 ? (
          <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/20 px-8 py-24 text-center space-y-4">
            <p className="text-lg font-black text-white">이 카테고리에 발행된 글이 없습니다.</p>
            <p className="text-sm font-bold text-zinc-500">
              블로그 관리 페이지에서 원고 카테고리를 지정하여 새 글을 발행해 보세요.
            </p>
          </div>
        ) : (
          <div>
            {/* Visual Templates Rendering */}
            
            {/* 1. NEWS Template */}
            {template === "news" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {posts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group block border-b border-zinc-900 pb-6 transition-all hover:opacity-80"
                    >
                      <div className="text-xs font-black tracking-wider text-zinc-500 mb-2">
                        {formatDate(post.created_at)}
                      </div>
                      <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm font-bold text-zinc-400 leading-relaxed line-clamp-2">
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
                {posts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group flex flex-col md:flex-row gap-6 rounded-[28px] border border-zinc-900 bg-zinc-900/10 p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-800 hover:bg-zinc-900/30"
                    >
                      <div className="relative aspect-[16/10] md:w-[260px] shrink-0 overflow-hidden rounded-2xl bg-zinc-950">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-zinc-700">
                            <Sparkles size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-zinc-500">
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-sm font-bold text-zinc-400 leading-relaxed line-clamp-2">
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
                {posts.map((post) => {
                  const excerpt = buildExcerpt(post);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-[32px] border border-zinc-900 bg-zinc-900/10 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-800 hover:bg-zinc-900/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title || "thumbnail"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-zinc-700">
                            <Sparkles size={24} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-1 flex-col p-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                          <CalendarDays size={13} />
                          {formatDate(post.created_at)}
                        </div>
                        <h2 className="line-clamp-2 text-xl font-black leading-tight text-white group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h2>
                        <p className="line-clamp-3 text-sm font-bold text-zinc-400 leading-relaxed">
                          {excerpt}
                        </p>
                        <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-black text-zinc-500">
                          <span className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300">
                            자세히 보기 <ArrowRight size={12} />
                          </span>
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
