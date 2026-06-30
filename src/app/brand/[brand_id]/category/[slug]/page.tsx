import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Sparkles, ArrowRight, Rss, ArrowLeft, Tag } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CategoryClientWrapper from "../../components/CategoryClientWrapper";

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
  category_ids?: string[] | null;
  thumbnailUrl?: string | null;
  canonical_url?: string | null;
  published_snapshot?: any;
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

  // 4. Fetch Published Posts
  const { data: postsData } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at, category_id, category_ids, published_snapshot")
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
        finalPost.category_ids = snapshot.category_ids ?? finalPost.category_ids;
      }

      return finalPost;
    });

    // Filter in-memory by category (supporting both single and multiple categories in drafts & snapshots)
    posts = posts.filter((post) => {
      const catIds = post.category_ids || (post.category_id ? [post.category_id] : []);
      return catIds.includes(category.id);
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

  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get(`blog_theme_${brand_id}`)?.value || "light") as "light" | "dark";

  return (
    <CategoryClientWrapper
      brand_id={brand_id}
      profile={profile}
      category={category}
      categories={categories}
      initialPosts={posts}
      initialTheme={initialTheme}
    />
  );
}
