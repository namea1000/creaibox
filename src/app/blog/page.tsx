import React, { cache } from "react";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { createAdminClient } from "@/utils/supabase/admin";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatImageUrl } from "@/utils/image-url";
import SafeImage from "@/components/common/SafeImage";
import SmartIntentLink from "@/components/common/SmartIntentLink";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;
export const dynamicParams = true;

interface PublishedPost {
  id: string;
  title: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  seo_tags: string[] | null;
  canonical_url: string | null;
  created_at: string | null;
  thumbnailUrl?: string | null;
}

function isMainSitePost(canonicalUrl: string | null) {
  if (!canonicalUrl) return true;
  try {
    const url = new URL(canonicalUrl);
    const hostname = url.hostname.toLowerCase();
    
    if (hostname.endsWith("localhost")) {
      const parts = hostname.split(".");
      if (parts.length <= 1 || parts[0] === "www") return true;
      return false;
    }
    
    if (hostname.endsWith("creaibox.com")) {
      const parts = hostname.split(".");
      if (parts.length === 2) return true;
      if (parts.length === 3 && parts[0] === "www") return true;
      return false;
    }

    return false;
  } catch (e) {
    return true;
  }
}

function buildExcerpt(post: PublishedPost) {
  const source = (post.meta_description || post.focus_keyword || "CreaiBox 인사이트 포스팅").trim();
  return source.length > 150 ? `${source.slice(0, 150)}...` : source;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

// 🌟 고속 병렬 데이터 페처
const fetchBlogData = cache(async () => {
  const supabase = await createAdminClient();

  const [adminsRes, postsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, extra_configs, brand_id")
      .eq("role", "ADMIN"),
    supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at")
      .eq("status", "published")
      .not("slug", "is", null)
      .or("canonical_url.ilike.https://creaibox.com/blog/%,canonical_url.ilike.https://www.creaibox.com/blog/%,canonical_url.ilike.http://localhost%/blog/%")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const primaryAdmin = adminsRes.data?.[0];
  const adminConfigs = primaryAdmin?.extra_configs || {};

  const officialTemplate = (
    adminConfigs.blog_template_creaibox ||
    adminConfigs.blog_template ||
    "card"
  ) as "card" | "list" | "news";

  const officialBlogTitle = adminConfigs.blog_title_creaibox || adminConfigs.blog_title || "CreaiBox 인사이트 블로그";
  const officialBlogDesc = adminConfigs.blog_description_creaibox || adminConfigs.blog_description || "";
  const officialPostsPerPage = Math.max(3, Number(adminConfigs.blog_posts_per_page_creaibox || adminConfigs.blog_posts_per_page || 21));
  const cardBorderWidth = adminConfigs.blog_card_border_width_creaibox ?? adminConfigs.blog_card_border_width ?? 1;
  const cardBorderRadius = adminConfigs.blog_card_border_radius_creaibox ?? adminConfigs.blog_card_border_radius ?? 6;
  const cardBorderColor = adminConfigs.blog_card_border_color_creaibox || adminConfigs.blog_card_border_color || "";
  const cardThumbStyle = (adminConfigs.blog_card_thumb_style_creaibox || adminConfigs.blog_card_thumb_style || "inset") as "full" | "inset";

  const publishedPostsRaw = (postsRes.data || []).filter((post) => post.slug && isMainSitePost(post.canonical_url));
  let publishedPosts: PublishedPost[] = [];

  if (publishedPostsRaw.length > 0) {
    const postIds = publishedPostsRaw.map((p) => p.id);
    const { data: images } = await supabase
      .from("generated_images")
      .select("source_id, image_url, is_primary, created_at")
      .eq("source_type", "writing_creaibox_posts")
      .in("source_id", postIds)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    const imageMap: Record<string, { url: string; is_primary: boolean }[]> = {};
    (images || []).forEach((img) => {
      if (!img.source_id) return;
      if (!imageMap[img.source_id]) {
        imageMap[img.source_id] = [];
      }
      imageMap[img.source_id].push({
        url: img.image_url,
        is_primary: !!img.is_primary,
      });
    });

    publishedPosts = publishedPostsRaw.map((post) => {
      const postImages = imageMap[post.id] || [];
      const primaryImg = postImages.find((img) => img.is_primary) || postImages[0];
      return {
        ...post,
        thumbnailUrl: primaryImg ? formatImageUrl(primaryImg.url) : null,
      };
    });
  }

  return {
    officialTemplate,
    officialBlogTitle,
    officialBlogDesc,
    officialPostsPerPage,
    cardBorderWidth,
    cardBorderRadius,
    cardBorderColor,
    cardThumbStyle,
    publishedPosts,
  };
});

export default async function BlogPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = searchParams.page ? Math.max(1, parseInt(searchParams.page, 10)) : 1;

  const {
    officialTemplate,
    officialBlogTitle,
    officialBlogDesc,
    officialPostsPerPage,
    cardBorderWidth,
    cardBorderRadius,
    cardBorderColor,
    cardThumbStyle,
    publishedPosts,
  } = await fetchBlogData();

  const postsPerPage = officialPostsPerPage;
  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = publishedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const customCardStyle: React.CSSProperties = {
    borderWidth: `${cardBorderWidth}px`,
    borderStyle: Number(cardBorderWidth) > 0 ? "solid" : "none",
    borderRadius: `${cardBorderRadius}px`,
    ...(cardBorderColor ? { borderColor: cardBorderColor } : {}),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-950 dark:bg-[#06080d] dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="pt-6 flex-1">
        <section className="mx-auto max-w-[1536px] px-6 py-4">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-955 dark:text-white">
                {officialBlogTitle}
              </h1>
              {officialBlogDesc && (
                <p className="mt-1.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  {officialBlogDesc}
                </p>
              )}
            </div>
          </div>

          {publishedPosts.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-slate-900/10 p-12 text-center">
              <Sparkles className="text-zinc-400 mb-3" size={32} />
              <p className="text-base font-extrabold text-zinc-700 dark:text-slate-300">
                발행된 오리지널 인사이트 포스팅이 없습니다.
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                크리에이박스 스튜디오에서 AI 에이전트로 작성된 게시글이 이 곳에 공개 게시됩니다.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <section>
                {/* 1. Card Grid 템플릿 (이미지 중심 격자 배치) */}
                {officialTemplate === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPosts.map((post) => {
                      const excerpt = buildExcerpt(post);

                      return (
                        <SmartIntentLink
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          style={customCardStyle}
                          className={`group flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-slate-900/40 shadow-sm transition hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 ${
                            cardThumbStyle === "inset" ? "p-5 justify-between" : ""
                          }`}
                        >
                          {cardThumbStyle === "inset" ? (
                            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex items-center justify-center">
                              {post.thumbnailUrl ? (
                                <SafeImage
                                  src={post.thumbnailUrl}
                                  alt={post.title || "thumbnail"}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950" />
                              )}
                            </div>
                          ) : (
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                              {post.thumbnailUrl ? (
                                <SafeImage
                                  src={post.thumbnailUrl}
                                  alt={post.title || "thumbnail"}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950" />
                              )}
                            </div>
                          )}

                          <div className={cardThumbStyle === "inset" ? "mt-4 flex flex-1 flex-col justify-between" : "p-6 pb-4 flex flex-1 flex-col justify-between"}>
                            <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 mb-2">
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                              <h2 className="line-clamp-2 text-base font-black leading-snug tracking-[-0.01em] text-zinc-955 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {post.title}
                              </h2>
                              <p className="mt-2.5 line-clamp-2 text-xs md:text-[13px] leading-relaxed text-zinc-500 dark:text-slate-400 font-medium">
                                {excerpt}
                              </p>
                            </div>
                          </div>
                        </SmartIntentLink>
                      );
                    })}
                  </div>
                )}

                {/* 2. List Feed 템플릿 (가로 피드 연속 배치) */}
                {officialTemplate === "list" && (
                  <div className="space-y-4">
                    {currentPosts.map((post) => {
                      const excerpt = buildExcerpt(post);

                      return (
                        <SmartIntentLink
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          style={customCardStyle}
                          className="group flex flex-col md:flex-row gap-5 border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-slate-900/40 p-5 shadow-sm transition hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5"
                        >
                          <div className="relative aspect-[16/9] w-full md:w-72 shrink-0 overflow-hidden rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex items-center justify-center">
                            {post.thumbnailUrl ? (
                              <SafeImage
                                src={post.thumbnailUrl}
                                alt={post.title || "thumbnail"}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950" />
                            )}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 mb-1.5">
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            <h2 className="line-clamp-2 text-base md:text-[1.125rem] font-bold leading-snug tracking-[-0.01em] text-zinc-955 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {post.title}
                            </h2>

                            <p className="mt-2.5 line-clamp-2 text-[13px] md:text-sm leading-relaxed text-zinc-500 dark:text-slate-400 font-medium">
                              {excerpt}
                            </p>
                          </div>
                        </SmartIntentLink>
                      );
                    })}
                  </div>
                )}

                {/* 3. News Flow 템플릿 (텍스트 중심 속보형 배치) */}
                {officialTemplate === "news" && (
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900/40 overflow-hidden">
                    {currentPosts.map((post) => {
                      const excerpt = buildExcerpt(post);

                      return (
                        <SmartIntentLink
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 transition hover:bg-zinc-50 dark:hover:bg-slate-800/40"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500 mb-1">
                              <span>NEWS</span>
                              <span>•</span>
                              <span className="text-zinc-400">{formatDate(post.created_at)}</span>
                            </div>
                            <h2 className="line-clamp-2 text-base font-bold text-zinc-955 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {post.title}
                            </h2>
                            <p className="mt-1.5 line-clamp-1 text-xs text-zinc-500 dark:text-slate-400">
                              {excerpt}
                            </p>
                          </div>

                          {post.thumbnailUrl && (
                            <div className="relative aspect-[16/9] w-28 shrink-0 overflow-hidden rounded-[4px] border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                              <SafeImage
                                src={post.thumbnailUrl}
                                alt={post.title || "thumbnail"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </SmartIntentLink>
                      );
                    })}
                  </div>
                )}

                {/* 🌟 20개 기준 좌우 페이지 이동 버튼 */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-4">
                    {currentPage > 1 ? (
                      <Link
                        href={`/blog?page=${currentPage - 1}`}
                        className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-zinc-700 dark:text-slate-300 transition hover:border-blue-300 hover:text-blue-600 shadow-sm"
                      >
                        이전
                      </Link>
                    ) : (
                      <div className="flex h-10 items-center justify-center rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-slate-900/10 px-4 text-sm font-bold text-zinc-400 dark:text-slate-600 cursor-not-allowed">
                        이전
                      </div>
                    )}

                    <span className="text-sm font-black text-zinc-500 dark:text-slate-455">
                      {currentPage} / {totalPages}
                    </span>

                    {currentPage < totalPages ? (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 px-4 text-sm font-bold text-zinc-700 dark:text-slate-300 transition hover:border-blue-300 hover:text-blue-600 shadow-sm"
                      >
                        다음
                      </Link>
                    ) : (
                      <div className="flex h-10 items-center justify-center rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-slate-900/10 px-4 text-sm font-bold text-zinc-400 dark:text-slate-600 cursor-not-allowed">
                        다음
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}