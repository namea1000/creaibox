import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatImageUrl, handleImageError } from "@/utils/image-url";

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
  const source = (post.meta_description || post.focus_keyword || "CreAibox 인사이트 포스팅").trim();
  return source.length > 150 ? `${source.slice(0, 150)}...` : source;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export default async function BlogPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = searchParams.page ? Math.max(1, parseInt(searchParams.page, 10)) : 1;
  const postsPerPage = 20;

  const supabase = await createAdminClient();

  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "ADMIN");

  const adminIds = (admins || []).map((a) => a.id);

  let posts: any[] = [];
  let error: any = null;

  if (adminIds.length > 0) {
    const query = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at")
      .eq("status", "published")
      .in("user_id", adminIds)
      .not("slug", "is", null)
      .order("created_at", { ascending: false });
    posts = query.data || [];
    error = query.error;
  }

  if (error) {
    console.error("공개 블로그 목록 조회 실패:", error.message);
  }

  const publishedPostsRaw = (((posts as any) as PublishedPost[] | null) || []).filter((post) => post.slug && isMainSitePost(post.canonical_url));
  let publishedPosts: PublishedPost[] = [];

  if (publishedPostsRaw.length > 0) {
    const postIds = publishedPostsRaw.map((p) => p.id);
    const { data: images, error: imagesError } = await supabase
      .from("generated_images")
      .select("source_id, image_url, is_primary")
      .eq("source_type", "writing_creaibox_posts")
      .eq("image_role", "thumbnail")
      .in("source_id", postIds);

    if (imagesError) {
      console.error("썸네일 이미지 조회 실패:", imagesError.message);
    }

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
  const bestPosts = publishedPosts.slice(0, 5);

  const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = publishedPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-950 dark:bg-[#06080d] dark:text-slate-100 transition-colors duration-300">
      <Header />

      <main className="pt-6 flex-1">
        <section className="mx-auto max-w-[1536px] px-6 py-4">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-955 dark:text-white">
                CreAibox 인사이트 블로그
              </h1>
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
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_460px]">
              {/* 왼쪽 2/3 포스팅 카드 리스트 */}
              <section className="space-y-4">
                {currentPosts.map((post) => {
                  const excerpt = buildExcerpt(post);

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col md:flex-row gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-slate-900/40 p-5 shadow-sm transition hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                    >
                      <div className="relative h-44 w-full md:w-64 shrink-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex items-center justify-center">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title || "thumbnail"}
                            onError={handleImageError}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950" />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <h2 className="line-clamp-2 text-base md:text-[1.125rem] font-bold leading-snug tracking-[-0.01em] text-zinc-955 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {post.title}
                        </h2>

                        <p className="mt-3 line-clamp-3 text-[13px] md:text-sm leading-relaxed text-zinc-500 dark:text-slate-400 font-medium">
                          {excerpt}
                        </p>
                      </div>
                    </Link>
                  );
                })}

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

              {/* 오른쪽 1/3 베스트 글 위젯 */}
              <aside className="lg:sticky lg:top-28 h-fit overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
                {/* 상단 탭 헤더 (음영 적용) */}
                <div className="bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                      Best Posts
                    </p>
                    <h2 className="mt-0.5 text-xl font-black text-zinc-955 dark:text-white">
                      베스트 글
                    </h2>
                  </div>
                  <Star className="text-blue-500 fill-blue-500/10" size={20} />
                </div>

                {/* 하단 리스트 (화이트 바탕 + 콤팩트 세로 균형) */}
                <div className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                  {bestPosts.map((post) => {
                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex items-center gap-3.5 px-6 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                      >
                        <div className="relative w-24 sm:w-28 aspect-[16/9] shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                          {post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title || "thumbnail"}
                              onError={handleImageError}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <h3 className="line-clamp-2 text-[0.98rem] font-normal leading-[1.5] text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}