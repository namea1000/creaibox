import Link from "next/link";
import { CalendarDays, Sparkles, Star, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

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

export default async function BlogPage() {
  const supabase = await createClient();

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

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <main className="pt-15">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-zinc-200 pb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                CreAibox Blog
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
                AI 인사이트 블로그
              </h1>
              <p className="mt-3 text-sm font-bold text-zinc-500">
                최신 발행 원고와 인기 콘텐츠를 한눈에 확인하세요.
              </p>
            </div>
          </div>

          {publishedPosts.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 px-8 py-20 text-center">
              <p className="text-lg font-black text-zinc-950">아직 발행된 글이 없습니다.</p>
              <p className="mt-3 text-sm font-medium text-zinc-500">
                CreAibox 에디터에서 글을 발행하면 이 공간에 카드 형태로 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_380px]">
              {/* 왼쪽 2/3 글 목록 */}
              <section className="space-y-6">
                {publishedPosts.map((post) => {
                  const keyword = post.focus_keyword || "CreAibox";
                  const excerpt = buildExcerpt(post);
                  const tags = (post.seo_tags || []).slice(0, 3);

                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-7 rounded-none border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-xl"
                    >
                      <div className="relative h-[170px] w-[270px] shrink-0 overflow-hidden rounded-none bg-zinc-100">
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
                              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white">
                                <Sparkles size={12} />
                                Insight
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_55%)]" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-black text-zinc-700">
                              {keyword}
                            </div>
                            <div className="absolute inset-x-5 bottom-5">
                              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-black text-blue-700">
                                <Sparkles size={12} />
                                Insight
                              </div>
                              <p className="mt-3 line-clamp-3 text-xl font-black leading-tight text-zinc-950">
                                {post.title}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <h2 className="line-clamp-2 text-[1.85rem] font-black leading-[1.25] tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-blue-600">
                          {post.title}
                        </h2>

                        <p className="mt-4 line-clamp-3 text-[1.08rem] leading-[1.85] text-zinc-600">
                          {excerpt}
                        </p>

                        <div className="mt-auto border-t border-zinc-200 pt-4">
                          <div className="mb-3 flex flex-wrap gap-3 text-sm font-semibold text-zinc-600">
                            {(tags.length > 0 ? tags : [keyword]).map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm font-semibold text-zinc-500">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays size={15} />
                              {formatDate(post.created_at)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-blue-600 group-hover:text-blue-500">
                              상세 보기 <ArrowRight size={15} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </section>

              {/* 오른쪽 1/3 베스트 글 위젯 */}
              <aside className="lg:sticky lg:top-28 h-fit rounded-none border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                      Best Posts
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-zinc-950">
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
                        className="group flex items-center gap-4 rounded-none px-2 py-3 transition hover:bg-white border-b border-zinc-200/60 last:border-b-0"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-none border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                          {post.thumbnailUrl ? (
                            <img
                              src={post.thumbnailUrl}
                              alt={post.title || "thumbnail"}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-blue-50 to-cyan-100" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-zinc-800 group-hover:text-blue-600">
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