import Link from "next/link";
import { CalendarDays, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

interface PublishedPost {
  id: string;
  title: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  seo_tags: string[] | null;
  canonical_url: string | null;
  created_at: string | null;
}

function buildExcerpt(post: PublishedPost) {
  const source = (post.meta_description || post.focus_keyword || "Creaibox 인사이트 포스팅").trim();
  return source.length > 150 ? `${source.slice(0, 150)}...` : source;
}

function buildAccent(keyword: string) {
  const seed = keyword.charCodeAt(0) || 75;
  const palettes = [
    "from-sky-500/30 via-cyan-500/20 to-blue-500/30",
    "from-indigo-500/30 via-violet-500/20 to-fuchsia-500/30",
    "from-emerald-500/25 via-teal-500/20 to-cyan-500/25",
    "from-amber-500/25 via-orange-500/20 to-rose-500/20",
  ];
  return palettes[seed % palettes.length];
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at")
    .eq("status", "published")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("공개 블로그 목록 조회 실패:", error.message);
  }

  const publishedPosts = ((posts as PublishedPost[] | null) || []).filter((post) => post.slug);

  return (
    <div className="min-h-screen bg-[#1f232a] pt-20 text-zinc-100">
      <header className="border-b border-white/10 bg-[#20242b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Creaibox Blog</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">AI 인사이트 블로그</h1>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 md:block">
            최신 발행 원고 아카이브
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {publishedPosts.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[#252a31] px-8 py-20 text-center">
            <p className="text-lg font-black text-white">아직 발행된 글이 없습니다.</p>
            <p className="mt-3 text-sm font-medium text-zinc-400">Creaibox 에디터에서 글을 발행하면 이 공간에 카드 형태로 표시됩니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {publishedPosts.map((post) => {
              const keyword = post.focus_keyword || "Creaibox";
              const excerpt = buildExcerpt(post);
              const tags = (post.seo_tags || []).slice(0, 4);
              const accent = buildAccent(keyword);

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-[28px] border border-white/10 bg-[#252a31] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-[#2a3038]"
                >
                  <div className="flex gap-6">
                    <div className={`relative h-[176px] w-[290px] shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br ${accent}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-black text-white/90">
                        {keyword}
                      </div>
                      <div className="absolute inset-x-5 bottom-5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[11px] font-black text-white/90">
                          <Sparkles size={12} />
                          Creaibox Insight
                        </div>
                        <p className="mt-3 line-clamp-3 text-2xl font-black leading-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
                          {post.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <h2 className="line-clamp-2 text-[2rem] font-black leading-[1.22] tracking-[-0.02em] text-white transition-colors group-hover:text-cyan-200">
                        {post.title}
                      </h2>
                      <p className="mt-5 line-clamp-4 text-[1.08rem] leading-[1.9] text-zinc-300">{excerpt}</p>

                      <div className="mt-auto border-t border-white/10 pt-5">
                        <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold text-zinc-300">
                          {tags.length > 0 ? (
                            tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-400" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-400" />
                              {keyword}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm font-semibold text-zinc-400">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("ko-KR") : "날짜 미상"}
                          </span>
                          <span className="text-cyan-300 transition-colors group-hover:text-cyan-200">상세 보기</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
