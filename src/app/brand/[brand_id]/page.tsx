import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Sparkles, Star, ArrowRight, Rss, ArrowLeft, Tag } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import BlogClientWrapper from "./components/BlogClientWrapper";

export const dynamic = "force-dynamic";

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
  published_snapshot?: any;
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
  try {
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("brand_id", brandId)
      .eq("brand_id_status", "APPROVED")
      .maybeSingle();

    if (error) {
      console.error("Error fetching primary profile in home page:", error);
    }

    if (!profile) {
      const { data: profiles, error: err2 } = await supabase
        .from("profiles")
        .select("*")
        .not("extra_configs", "is", null);

      if (err2) {
        console.error("Error fetching fallback profiles in home page:", err2);
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
    console.error("getProfileByBrandId exception in home page:", err);
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

  const configs = profile.extra_configs || {};
  const customDomain = configs[`custom_domain_${brand_id}`] || 
    (brand_id === profile.brand_id ? configs.custom_domain : "");
  const customDomainStatus = configs[`custom_domain_status_${brand_id}`] || 
    (brand_id === profile.brand_id ? configs.custom_domain_status : "NONE");

  const canonicalUrl = (customDomain && customDomainStatus === "APPROVED")
    ? `https://${customDomain}`
    : `https://${brand_id.toLowerCase()}.creaibox.com`;

  const meta: Metadata = {
    title: blogTitle,
    description: blogDesc,
    alternates: {
      canonical: canonicalUrl,
    },
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
        <div className="relative max-w-md w-full text-center space-y-6 rounded-none border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur-xl shadow-2xl">
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
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at, category_id, published_snapshot")
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
      
      const finalPost = {
        ...post,
        thumbnailUrl: primaryImg ? primaryImg.url : null,
      };

      if (post.published_snapshot) {
        const snapshot = post.published_snapshot as any;
        finalPost.title = snapshot.title ?? finalPost.title;
        finalPost.slug = snapshot.slug ?? finalPost.slug;
        finalPost.meta_description = snapshot.meta_description ?? finalPost.meta_description;
        finalPost.focus_keyword = snapshot.focus_keyword ?? finalPost.focus_keyword;
        finalPost.seo_tags = snapshot.seo_tags ?? finalPost.seo_tags;
        finalPost.canonical_url = snapshot.canonical_url ?? finalPost.canonical_url;
        finalPost.category_id = snapshot.category_id ?? finalPost.category_id;
      }

      return finalPost;
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

  return (
    <BlogClientWrapper
      brand_id={brand_id}
      profile={profile}
      categories={categories}
      initialPosts={posts}
    />
  );
}
