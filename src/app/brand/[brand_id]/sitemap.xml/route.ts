import { createAdminClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface PublishedPost {
  id: string;
  slug: string | null;
  canonical_url?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  published_snapshot?: any;
}

interface BrandPageProps {
  params: Promise<{ brand_id: string }>;
}

async function getProfileByBrandId(supabase: any, brandId: string) {
  try {
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
  } catch (err) {
    console.error("getProfileByBrandId exception in sitemap route:", err);
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

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: BrandPageProps
) {
  const { brand_id } = await params;
  const decodedBrandId = decodeURIComponent(brand_id).toLowerCase();
  const supabase = await createAdminClient();

  // 1. Fetch Profile & Client Site
  const profile = await getProfileByBrandId(supabase, decodedBrandId);
  const { data: site } = await supabase
    .from("client_sites")
    .select("id, brand_id, status, extra_configs")
    .eq("brand_id", decodedBrandId)
    .maybeSingle();

  // Resolve Base URL
  const configs = profile?.extra_configs || {};
  const customDomain = configs[`custom_domain_${decodedBrandId}`] || 
    (decodedBrandId === profile?.brand_id ? configs.custom_domain : "");
  const customDomainStatus = configs[`custom_domain_status_${decodedBrandId}`] || 
    (decodedBrandId === profile?.brand_id ? configs.custom_domain_status : "NONE");

  const baseUrl = (customDomain && customDomainStatus === "APPROVED")
    ? `https://${customDomain}`
    : `https://${decodedBrandId}.creaibox.com`;

  // 2. Fetch Published Posts
  let posts: PublishedPost[] = [];
  if (profile?.id) {
    const { data: postsRawResult } = await supabase
      .from("writing_creaibox_posts")
      .select("id, slug, canonical_url, updated_at, created_at, published_snapshot")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    const postsRaw = (postsRawResult as PublishedPost[] | null) || [];
    posts = postsRaw.map((post) => {
      const finalPost = { ...post };
      if (post.published_snapshot) {
        const snapshot = post.published_snapshot as any;
        finalPost.slug = snapshot.slug ?? finalPost.slug;
        finalPost.canonical_url = snapshot.canonical_url ?? finalPost.canonical_url;
      }
      return finalPost;
    });

    const isPrimary = decodedBrandId === profile.brand_id;
    posts = posts.filter((post) => {
      if (!post.canonical_url) {
        return isPrimary;
      }
      return isPostForBrand(post.canonical_url, decodedBrandId, profile.extra_configs);
    });
  }

  // 3. Fetch Subpages if dynamic client site
  let subpages: string[] = [];
  if (site?.id) {
    const { data: sections } = await supabase
      .from("site_sections")
      .select("section_type")
      .eq("site_id", site.id)
      .like("section_type", "subpage_%");

    if (sections) {
      subpages = sections.map((s: any) => s.section_type.replace("subpage_", ""));
    }
  }

  const now = new Date().toISOString();

  // 4. Build Sitemap XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main Page
  xml += `  <url>\n`;
  xml += `    <loc>${escapeXml(baseUrl)}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Subpages
  for (const sub of subpages) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(`${baseUrl}/${sub}`)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog list page (if posts exist)
  if (posts.length > 0) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(`${baseUrl}/blog`)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // Blog Posts
  for (const post of posts) {
    if (!post.slug) continue;
    const postUrl = `${baseUrl}/blog/${encodeURIComponent(post.slug)}`;
    const postDate = post.updated_at || post.created_at || now;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(postUrl)}</loc>\n`;
    xml += `    <lastmod>${new Date(postDate).toISOString()}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
