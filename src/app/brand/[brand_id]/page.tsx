import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Sparkles, Star, ArrowRight, Rss, ArrowLeft, Tag } from "lucide-react";
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

interface BrandPageProps {
  params: Promise<{ brand_id: string }>;
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
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("brand_id", brandId)
    .eq("brand_id_status", "APPROVED")
    .maybeSingle();

  if (!profile) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .not("extra_configs", "is", null);

    if (profiles) {
      profile = profiles.find((p: any) => {
        const brandIds = p.extra_configs?.brand_ids || [];
        return brandIds.includes(brandId);
      }) || null;
    }
  }
  return profile;
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

// 🌟 Dynamically generate page metadata with Naver Site Verification support
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand_id } = await params;
  const supabase = await createAdminClient();

  const profile = await getProfileByBrandId(supabase, brand_id);

  if (!profile) {
    return {
      title: "블로그를 찾을 수 없습니다 | CreAibox",
    };
  }

  const blogTitle = profile.extra_configs?.blog_title || `${profile.nickname || brand_id} 블로그`;
  const blogDesc = profile.extra_configs?.blog_description || "CreAibox에서 생성한 고품질 콘텐츠 블로그입니다.";

  const meta: Metadata = {
    title: blogTitle,
    description: blogDesc,
  };

  if (profile.extra_configs?.naver_advisor_key) {
    meta.other = {
      "naver-site-verification": profile.extra_configs.naver_advisor_key,
    };
  }

  return meta;
}

export default async function BrandBlogHome({ params }: BrandPageProps) {
  const { brand_id } = await params;
  const supabase = await createAdminClient();

  // 1. Fetch Profile
  const profile = await getProfileByBrandId(supabase, brand_id);

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white px-6">
        <div className="relative max-w-md w-full text-center space-y-6 rounded-[32px] border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <Rss size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic text-white">
            Blog Under Construction
          </h1>
          <p className="text-sm font-bold text-zinc-400 leading-relaxed">
            요청하신 브랜드 ID &apos;{brand_id}&apos; 블로그를 찾을 수 없거나 아직 승인 전입니다.
          </p>
          <div className="pt-2">
            <Link
              href="https://creaibox.com"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4 text-sm font-black text-zinc-300 transition hover:bg-zinc-900"
            >
              <ArrowLeft size={16} /> CreAibox 홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch Categories (filtering by active brand_id or null for legacy)
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

  // 3. Fetch Published Posts
  const { data: postsData } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at, category_id")
    .eq("user_id", profile.id)
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
  const blogDesc = profile.extra_configs?.blog_description || "CreAibox에서 생성한 고품질 콘텐츠 블로그입니다.";
  const template = profile.extra_configs?.blog_template || "card";
  const accentColor = profile.extra_configs?.blog_accent_color || "#3b82f6";
  const gaId = profile.extra_configs?.ga_id;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Google Analytics Integrations */}
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

      {/* 🌟 Premium Header */}
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

          {/* Navigation Categories */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-zinc-100 hover:text-white transition-colors">
              전체글
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 🌟 Premium Gradient Banner Section */}
      <section className="relative overflow-hidden border-b border-zinc-900 bg-zinc-900/10 py-24">
        {/* Colorful backgrounds */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />
        <div 
          className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(circle_at_bottom_left,var(--accent),transparent_40%)]" 
          style={{ "--accent": accentColor } as React.CSSProperties}
        />
        
        <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
            <Sparkles size={12} className="text-yellow-400" /> Professional AI Publisher
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
            {blogTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-bold text-zinc-400 leading-relaxed">
            {blogDesc}
          </p>
        </div>
      </section>

      {/* 🌟 Main content body */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        {posts.length === 0 ? (
          <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/20 px-8 py-24 text-center space-y-4">
            <p className="text-lg font-black text-white">아직 발행된 글이 없습니다.</p>
            <p className="text-sm font-bold text-zinc-500">
              CreAibox 글쓰기 에디터에서 글을 작성하고 승인된 브랜드 블로그에 발행해 보세요.
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
                  const postCategory = categories.find(c => c.id === post.category_id);
                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className="group block border-b border-zinc-900 pb-6 transition-all hover:opacity-80"
                    >
                      <div className="flex items-center gap-2 text-xs font-black tracking-wider text-zinc-500 mb-2">
                        {postCategory && (
                          <span className="flex items-center gap-1 text-zinc-400 border border-zinc-800 rounded bg-zinc-900/60 px-2 py-0.5">
                            <Tag size={10} /> {postCategory.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
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
                  const postCategory = categories.find(c => c.id === post.category_id);
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
                          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                            {postCategory && (
                              <span className="text-xs font-black text-zinc-300">{postCategory.name}</span>
                            )}
                            {postCategory && <span>•</span>}
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
                  const postCategory = categories.find(c => c.id === post.category_id);
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
                        {postCategory && (
                          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white">
                            {postCategory.name}
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

      {/* 🌟 Footer */}
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
