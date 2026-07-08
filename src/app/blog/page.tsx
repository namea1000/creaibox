import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { createClient, createAdminClient } from "@/utils/supabase/server";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
        thumbnailUrl: primaryImg ? primaryImg.url : null,
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

      <main className="pt-24 flex-1">
        <section className="mx-auto max-w-7xl px-6 py-4">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-955 dark:text-white">
                CreAibox 인사이트 블로그
              </h1>
            </div>
          </div>

          {publishedPosts.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-slate-900/10 px-8 py-20 text-center">
              <p className="text-lg font-black text-zinc-950 dark:text-white">아직 발행된 글이 없습니다.</p>
              <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-slate-455">
                CreAibox 에디터에서 글을 발행하면 이 공간에 카드 형태로 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_380px]">
              {/* 왼쪽 2/3 글 목록 */}
              <section className="space-y-6">
                {currentPosts.map((post) => {
                  const keyword = post.focus_keyword || "CreAibox";
                  const excerpt = buildExcerpt(post);

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col md:flex-row gap-7 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-slate-900/20 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-xl"
                    >
                      <div className="relative h-[170px] w-full md:w-[270px] shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-slate-950">
                        {post.thumbnailUrl ? (
                          <>
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title || "thumbnail"}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-black text-white">
                              {keyword}
                            </div>
                            <div className="absolute inset-x-5 bottom-5">
                              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white shadow-sm">
                                <Sparkles size={12} />
                                Insight
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900 px-3 py-1 text-[11px] font-black text-zinc-700 dark:text-slate-300">
                              {keyword}
                            </div>
                            <div className="absolute inset-x-5 bottom-5">
                              <div className="inline-flex items-center gap-2 rounded-full bg-blue-650 text-white px-3 py-1 text-[11px] font-black shadow-sm">
                                <Sparkles size={12} />
                                Insight
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <h2 className="line-clamp-2 text-xl md:text-[1.35rem] font-black leading-[1.3] tracking-[-0.02em] text-zinc-950 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {post.title}
                        </h2>

                        <p className="mt-4 line-clamp-3 text-[1.05rem] leading-[1.8] text-zinc-655 dark:text-slate-400 font-semibold">
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
              <aside className="lg:sticky lg:top-28 h-fit rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-slate-900/20 p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                      Best Posts
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-zinc-950 dark:text-white">
                      베스트 글
                    </h2>
                  </div>
                  <Star className="text-blue-500" size={22} />
                </div>

                <div className="space-y-1">
                  {bestPosts.map((post) => {
                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex items-center gap-4 rounded-none px-2 py-3 transition hover:bg-white dark:hover:bg-slate-900 border-b border-zinc-200/60 dark:border-zinc-800 last:border-b-0"
                      >
                        <div className="relative w-16 aspect-[16/9] shrink-0 overflow-hidden rounded-none border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-slate-900/20 flex items-center justify-center">
                          {post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title || "thumbnail"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-zinc-800 dark:text-slate-205 group-hover:text-blue-600 dark:group-hover:text-blue-400">
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