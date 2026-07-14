import { createAdminClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

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
  canonical_url?: string | null;
  published_snapshot?: any;
}

interface BrandPageProps {
  params: Promise<{ brand_id: string }>;
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
      console.error("Error fetching primary profile in feed route:", error);
    }

    if (!profile) {
      const { data: profiles, error: err2 } = await supabase
        .from("profiles")
        .select("*")
        .not("extra_configs", "is", null);

      if (err2) {
        console.error("Error fetching fallback profiles in feed route:", err2);
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
    console.error("getProfileByBrandId exception in feed route:", err);
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

export async function GET(
  request: NextRequest,
  { params }: BrandPageProps
) {
  const { brand_id } = await params;
  const supabase = await createAdminClient();

  // 1. Fetch Profile
  const profile = await getProfileByBrandId(supabase, brand_id);
  if (!profile) {
    return new Response("Blog not found", { status: 404 });
  }

  // 2. Fetch Published Posts
  const { data: postsRawResult, error: postsError } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at, category_id, published_snapshot")
    .eq("user_id", profile.id)
    .eq("status", "published")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching posts for feed:", postsError);
  }

  const postsRaw = (postsRawResult as PublishedPost[] | null) || [];
  let posts: PublishedPost[] = postsRaw.map((post) => {
    const finalPost = { ...post };
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

  // 3. Filter posts by active brand_id mapping
  const isPrimary = brand_id === profile.brand_id;
  posts = posts.filter((post) => {
    if (!post.canonical_url) {
      return isPrimary;
    }
    return isPostForBrand(post.canonical_url, brand_id, profile.extra_configs);
  });

  // 4. Resolve base domain
  const configs = profile.extra_configs || {};
  const customDomain = configs[`custom_domain_${brand_id}`] || 
    (brand_id === profile.brand_id ? configs.custom_domain : "");
  const customDomainStatus = configs[`custom_domain_status_${brand_id}`] || 
    (brand_id === profile.brand_id ? configs.custom_domain_status : "NONE");

  const blogBaseUrl = (customDomain && customDomainStatus === "APPROVED")
    ? `https://${customDomain}`
    : `https://${brand_id.toLowerCase()}.creaibox.com`;

  // 5. Bypass Naver's errorCode=500 by injecting a welcome article if post count is zero
  if (posts.length === 0) {
    posts.push({
      id: "welcome-dummy",
      title: `${profile.nickname || brand_id} 블로그 개설을 축하합니다!`,
      slug: "welcome-to-creaibox",
      meta_description: "크리에이박스(CreAibox) 올인원 AI 스튜디오를 이용한 첫 블로그 도메인 개설을 축하드립니다. 이 포스팅은 검색 엔진의 RSS 연동을 돕기 위해 임시로 노출되는 안내 메시지입니다. 글이 발행되면 자동으로 대체됩니다.",
      focus_keyword: "크리에이박스",
      seo_tags: ["크리에이박스", "AI블로그", "첫발행"],
      created_at: new Date().toISOString(),
      category_id: null,
    });
  }

  // 6. Generate RSS items XML
  const itemsXml = posts
    .map((post) => {
      const postUrl = `${blogBaseUrl}/${post.slug}`;
      const pubDate = post.created_at
        ? new Date(post.created_at).toUTCString()
        : new Date().toUTCString();
      const description = post.meta_description || post.focus_keyword || "인사이트 포스팅";

      return `
    <item>
      <title><![CDATA[${post.title || ""}]]></title>
      <link>${postUrl}</link>
      <dc:creator><![CDATA[${profile.nickname || "CreAibox Editor"}]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("");

  // 7. Compose full RSS channel XML envelope
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/" 
     xmlns:wfw="http://wellformedweb.org/CommentAPI/" 
     xmlns:dc="http://purl.org/dc/elements/1.1/" 
     xmlns:atom="http://www.w3.org/2005/Atom" 
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" 
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title><![CDATA[${profile.nickname || brand_id} 블로그]]></title>
    <atom:link href="${blogBaseUrl}/feed" rel="self" type="application/rss+xml" />
    <link>${blogBaseUrl}</link>
    <description><![CDATA[${profile.nickname || brand_id}의 AI 생성 고품질 콘텐츠 블로그입니다.]]></description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>ko-KR</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
