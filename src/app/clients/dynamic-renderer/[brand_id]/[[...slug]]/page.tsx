import React, { cache } from "react";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/server";
import DynamicSection from "../../components/DynamicSection";
import BlogListPaginatedView, { BlogItem } from "@/components/blog/BlogListPaginatedView";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;
export const dynamicParams = true;


interface PageProps {
  params: Promise<{
    brand_id: string;
    slug?: string[];
  }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
}

const fetchSiteData = cache(async (brandId: string) => {
  const supabase = await createAdminClient();
  const bKey = brandId.toLowerCase();
  const { data: site, error } = await supabase
    .from("client_sites")
    .select("id, company_name, is_onepage_scroll, status, extra_configs, profile_id")
    .eq("brand_id", bKey)
    .maybeSingle();

  if (error) {
    console.error("fetchSiteData client_sites query error:", error);
  }

  // If profile has verification keys, blend them
  let profileConfigs: any = {};
  if (site?.profile_id) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("extra_configs")
      .eq("id", site.profile_id)
      .maybeSingle();
    profileConfigs = prof?.extra_configs || {};
  } else {
    const { data: prof } = await supabase
      .from("profiles")
      .select("extra_configs")
      .eq("brand_id", bKey)
      .maybeSingle();
    profileConfigs = prof?.extra_configs || {};
  }

  const naverKey = 
    site?.extra_configs?.naver_advisor_key || 
    profileConfigs[`naver_advisor_key_${bKey}`] || 
    profileConfigs.naver_advisor_key || "";

  const googleKey = 
    site?.extra_configs?.google_search_console_key || 
    profileConfigs[`google_search_console_key_${bKey}`] || 
    profileConfigs.google_search_console_key || "";

  if (!site) return null;

  return {
    ...site,
    resolvedNaverKey: naverKey,
    resolvedGoogleKey: googleKey,
  };
});

function extractFirstImageFromHtml(html: string): string | null {
  if (!html) return null;
  const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];
  const bgMatch = html.match(/background-image:\s*url\(["']?(https?:\/\/[^"')]+)["']?\)/i);
  if (bgMatch && bgMatch[1]) return bgMatch[1];
  return null;
}

function cleanVerificationKey(rawKey: string): string {
  if (!rawKey) return "";
  const clean = rawKey.trim();
  const metaMatch = /content=["']([^"']+)["']/i.exec(clean);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }
  if (clean.startsWith("naver-site-verification=")) {
    return clean.replace("naver-site-verification=", "").replace(/["']/g, "").trim();
  }
  if (clean.startsWith("google-site-verification=")) {
    return clean.replace("google-site-verification=", "").replace(/["']/g, "").trim();
  }
  return clean;
}

function extractFirstDescriptionFromHtml(html: string): string | null {
  if (!html) return null;
  const pMatches = html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const m of pMatches) {
    const clean = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (clean.length >= 15 && !clean.toLowerCase().includes("trusted by") && !clean.toLowerCase().includes("copyright")) {
      return clean.length > 160 ? clean.substring(0, 157) + "..." : clean;
    }
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand_id, slug = [] } = await params;
  const site = await fetchSiteData(brand_id);

  if (!site) {
    return {
      title: "홈페이지 준비 중 | CreaiBox",
      description: "요청하신 웹사이트는 준비 중입니다.",
      robots: { index: false, follow: false, nocache: true },
    };
  }

  const supabase = await createAdminClient();
  const isPublished = site.status === "PUBLISHED";
  const rawSiteTitle = site.extra_configs?.site_title || site.company_name || `${brand_id} 공식 홈페이지`;
  
  // Query first section for OG image and description fallback
  const { data: firstSection } = await supabase
    .from("site_sections")
    .select("title, subtitle, content_data")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  // If subpage (e.g. /about, /services, /blog)
  let pageTitle = rawSiteTitle;
  let pageDesc = "";
  let subpageSection: any = null;

  if (slug.length > 0) {
    const subRoute = slug[0].toLowerCase();
    const { data: subSection } = await supabase
      .from("site_sections")
      .select("title, subtitle, content_data")
      .eq("site_id", site.id)
      .eq("section_type", `subpage_${subRoute}`)
      .maybeSingle();
      
    if (subSection) {
      subpageSection = subSection;
      pageTitle = `${subSection.title || subRoute.toUpperCase()} | ${rawSiteTitle}`;
      pageDesc = subSection.subtitle || extractFirstDescriptionFromHtml(subSection.content_data?.html || "") || "";
    } else if (subRoute === "blog") {
      pageTitle = `블로그 / 소식 | ${rawSiteTitle}`;
      pageDesc = `${rawSiteTitle} 공식 블로그 및 최신 소식 목록입니다.`;
    } else {
      pageTitle = `${subRoute.toUpperCase()} | ${rawSiteTitle}`;
    }
  }

  if (!pageDesc) {
    pageDesc = 
      site.extra_configs?.site_description || 
      site.extra_configs?.scan_report?.description ||
      (firstSection?.subtitle && firstSection.subtitle.length >= 15 ? firstSection.subtitle : null) ||
      extractFirstDescriptionFromHtml(firstSection?.content_data?.html || "") ||
      `${rawSiteTitle} 공식 홈페이지에 오신 것을 환영합니다. 비즈니스 소개, 서비스 및 주요 소식을 확인해 보세요.`;
  }

  const ogImageUrl = 
    (subpageSection?.content_data?.image && subpageSection.content_data.image.startsWith("http") ? subpageSection.content_data.image : null) ||
    extractFirstImageFromHtml(subpageSection?.content_data?.html || "") ||
    (site.extra_configs?.og_image && site.extra_configs.og_image.startsWith("http") ? site.extra_configs.og_image : null) ||
    (site.extra_configs?.hero_image && site.extra_configs.hero_image.startsWith("http") ? site.extra_configs.hero_image : null) ||
    (firstSection?.content_data?.image && firstSection.content_data.image.startsWith("http") ? firstSection.content_data.image : null) ||
    (firstSection?.content_data?.media_urls?.[0] && firstSection.content_data.media_urls[0].startsWith("http") ? firstSection.content_data.media_urls[0] : null) ||
    extractFirstImageFromHtml(firstSection?.content_data?.html || "") ||
    (site.extra_configs?.scan_report?.ogImage && site.extra_configs.scan_report.ogImage.startsWith("http") ? site.extra_configs.scan_report.ogImage : null) ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";

  const canonicalUrl = `https://${brand_id}.creaibox.com${slug.length > 0 ? `/${slug.join("/")}` : ""}`;

  const safeDesc = pageDesc.length > 80 ? pageDesc.slice(0, 77) + "..." : pageDesc;

  return {
    title: {
      absolute: pageTitle,
    },
    description: safeDesc,
    openGraph: {
      title: pageTitle,
      description: safeDesc,
      url: canonicalUrl,
      siteName: rawSiteTitle,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pageTitle} 대표 이미지`,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [ogImageUrl],
    },
    robots: isPublished
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      ...(site.resolvedNaverKey ? { "naver-site-verification": cleanVerificationKey(site.resolvedNaverKey) } : {}),
      ...(site.resolvedGoogleKey ? { "google-site-verification": cleanVerificationKey(site.resolvedGoogleKey) } : {}),
    },
  };
}

export default async function DynamicRendererPage({ params, searchParams }: PageProps) {
  const { brand_id, slug = [] } = await params;
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const rawPage = parseInt(resolvedSearchParams.page || "1", 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const supabase = await createAdminClient();

  // 1. Fetch site settings (React cache() 로 0ms 공유)
  const site = await fetchSiteData(brand_id);

  if (!site) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">홈페이지가 준비 중입니다.</h2>
      </div>
    );
  }

  const isDraft = site.status !== "PUBLISHED";

  // 2. Fetch site sections ordered by sort_order
  const { data: sections = [] } = await supabase
    .from("site_sections")
    .select("*")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true });

  if (!sections || sections.length === 0) {
    return (
      <div className="py-40 text-center max-w-xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">새로운 홈페이지가 준비되었습니다</h2>
        <p className="text-sm text-slate-500 font-semibold leading-relaxed">
          아직 설정된 섹션이 없습니다. 관리자 대시보드에서 AI 기획안을 승인하여 홈페이지를 채워보세요.
        </p>
      </div>
    );
  }

  const subPagePath = slug[0]?.toLowerCase();

  // 3. Render Focused Subpage or Blog Subsystem
  if (subPagePath) {
    // 🌟 A. Handle Blog List & Single Post Routes (/blog or /blog/[slug])
    if (subPagePath === "blog") {
      const postSlug = slug[1];

      // 🌟 Single Post Article View (/blog/[slug])
      if (postSlug) {
        const decodedPostSlug = decodeURIComponent(postSlug);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postSlug);

        let query = supabase
          .from("writing_creaibox_posts")
          .select("*")
          .eq("status", "published");

        if (isUuid) {
          query = query.or(`slug.eq."${decodedPostSlug}",id.eq.${postSlug}`);
        } else {
          query = query.in("slug", [decodedPostSlug, postSlug]);
        }

        const { data: rawPost } = await query.maybeSingle();

        if (!rawPost) {
          return (
            <div className="py-40 text-center max-w-xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">포스트를 찾을 수 없습니다</h2>
              <p className="text-sm text-slate-500 font-semibold leading-relaxed mb-6">
                요청하신 포스트 아티클이 존재하지 않거나 아직 발행 전입니다.
              </p>
              <a
                href="/blog"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white bg-[var(--primary)] rounded-xl shadow-md"
              >
                ← 블로그 목록으로 돌아가기
              </a>
            </div>
          );
        }

        const snapshot = rawPost.published_snapshot as any || {};
        const title = snapshot.title || rawPost.title || "제목 없음";
        const content = snapshot.content || rawPost.content || "";
        const createdAt = rawPost.created_at ? new Date(rawPost.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "";
        const tags = (snapshot.seo_tags || rawPost.seo_tags || []) as string[];

        return (
          <div className="pt-16 sm:pt-20 pb-24 bg-white min-h-screen">
            {/* Header Banner */}
            <div className="bg-[var(--surface)] border-b border-slate-200/50 py-10 sm:py-16 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <a href="/blog" className="inline-flex items-center gap-1 text-xs font-extrabold text-[var(--primary)] hover:underline mb-2">
                  ← {site.company_name} 공식 블로그
                </a>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-2">
                  <span>{site.company_name}</span>
                  <span>•</span>
                  <span>{createdAt}</span>
                </div>
              </div>
            </div>

            {/* Main Article Content */}
            <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
              <div
                className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed font-normal prose-headings:font-extrabold prose-headings:text-slate-900 prose-a:text-[var(--primary)] prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Back Button */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-95"
                >
                  ← 블로그 글 전체 목록으로
                </a>
              </div>
            </article>
          </div>
        );
      }

      // 🌟 Blog List View (/blog)
      const { data: postsRaw = [] } = await supabase
        .from("writing_creaibox_posts")
        .select("id, title, slug, content, meta_description, focus_keyword, seo_tags, canonical_url, created_at, published_snapshot")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      // Filter posts that belong to this brand_id
      const brandPosts = (postsRaw || []).filter((post: any) => {
        if (!post.canonical_url) return false;
        const urlLower = post.canonical_url.toLowerCase();
        return urlLower.includes(`://${brand_id.toLowerCase()}.`) || urlLower.includes(`://${brand_id.toLowerCase()}:`);
      });

      // 🌟 게시글 스마트 정렬 (최신 발행년도/날짜 2026년 -> 2018년 순으로 최상단 노출)
      brandPosts.sort((a: any, b: any) => {
        const getPostTime = (p: any) => {
          const snap = p.published_snapshot || {};
          const title = snap.title || p.title || "";
          const meta = snap.meta_description || p.meta_description || "";
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

      // Fetch thumbnails
      const postIds = brandPosts.map((p: any) => p.id);
      const postSlugs = brandPosts.map((p: any) => p.slug).filter(Boolean);
      let imageMap: Record<string, string> = {};
      if (postIds.length > 0) {
        const { data: images } = await supabase
          .from("generated_images")
          .select("source_id, image_url, is_primary")
          .eq("source_type", "writing_creaibox_posts")
          .in("source_id", [...postIds, ...postSlugs]);

        (images || []).forEach((img: any) => {
          if (img.source_id && (!imageMap[img.source_id] || img.is_primary)) {
            imageMap[img.source_id] = img.image_url;
          }
        });
      }

      function getPostThumb(post: any): string | null {
        if (imageMap[post.id]) return imageMap[post.id];
        if (post.slug && imageMap[post.slug]) return imageMap[post.slug];
        const content = post.published_snapshot?.content || post.content || "";
        if (content) {
          const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match && match[1] && !match[1].includes("stat.naver.com")) {
            return match[1];
          }
        }
        return null;
      }

      const formattedPosts: BlogItem[] = brandPosts.map((post: any) => {
        const snap = post.published_snapshot || {};
        const title = snap.title || post.title || "제목 없음";
        const desc = snap.meta_description || post.meta_description || "소개 내용 없음";
        const postSlugVal = snap.slug || post.slug || post.id;
        const thumb = getPostThumb(post);
        const dateStr = post.created_at
          ? new Date(post.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })
          : "";

        return {
          id: post.id,
          title,
          desc,
          slug: postSlugVal,
          dateStr,
          thumb,
        };
      });

      return (
        <div className="pt-20 pb-24 bg-white min-h-screen">
          {/* Subpage Banner */}
          <div className="bg-[var(--surface)] border-b border-slate-200/50 py-16 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--primary)] mb-2 block">
              {site.company_name}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              소통과 채움의 최신 소식 & 인사이트
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-500 max-w-lg mx-auto">
              공공행사 대행, 공동체 축제, 감성 교육 서비스 및 최신 소통 스토리를 만나보세요.
            </p>
          </div>

          {/* Posts Grid Container */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <BlogListPaginatedView
              posts={formattedPosts}
              companyName={site.company_name}
              initialPage={currentPage}
            />
          </div>
        </div>
      );
    }

    // Map URL slug paths to database section types
    const slugToSectionType: Record<string, string> = {
      about: "about",
      services: "services",
      portfolio: "portfolio",
      rental: "rental",
      contact: "contact"
    };

    const targetType = slugToSectionType[subPagePath] || subPagePath;
    let targetSection = sections.find(s => s.section_type === `subpage_${subPagePath}`);
    if (!targetSection) {
      targetSection = sections.find(s => s.section_type === targetType);
    }

    if (!targetSection) {
      return (
        <div className="py-40 text-center max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            요청하신 경로(/{subPagePath})에 해당하는 섹션이 정의되어 있지 않습니다.
          </p>
        </div>
      );
    }

    return (
      <div className="pt-20">
        {/* Premium Subpage Banner */}
        <div className="bg-[var(--surface)] border-b border-slate-200/50 py-16 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--primary)] mb-2 block">
            {site.company_name}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {targetSection.title || targetSection.section_type.toUpperCase()}
          </h1>
        </div>

        {/* Dynamic focused section */}
        <DynamicSection
          siteId={site.id}
          sectionType={targetSection.section_type}
          title={targetSection.title || ""}
          subtitle={targetSection.subtitle || ""}
          contentData={targetSection.content_data}
        />
      </div>
    );
  }

  // 4. Render All Sections (Landing Page)
  return (
    <div className="flex flex-col" suppressHydrationWarning={true}>
      {sections
        .filter((sect) => site.is_onepage_scroll || !sect.section_type.startsWith("subpage_"))
        .map((sect) => (
          <DynamicSection
            key={sect.id}
            siteId={site.id}
            sectionType={sect.section_type}
            title={sect.title || ""}
            subtitle={sect.subtitle || ""}
            contentData={sect.content_data}
          />
        ))}
    </div>
  );
}
