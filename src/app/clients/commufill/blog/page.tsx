import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/server";
import { CalendarDays, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PublishedPost {
  id: string;
  title: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  created_at: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function buildExcerpt(post: PublishedPost) {
  const source = (post.meta_description || post.focus_keyword || "커뮤필 소식").trim();
  return source.length > 120 ? `${source.slice(0, 120)}...` : source;
}

export default async function CommufillBlogPage() {
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("brand_id", "commufill")
    .maybeSingle();

  let posts: PublishedPost[] = [];

  if (profile?.id) {
    const { data } = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, meta_description, focus_keyword, created_at")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    posts = (data as PublishedPost[] | null) || [];
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-12 text-zinc-100">
      {/* Page Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-zinc-900 to-teal-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-12 border border-emerald-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/20">
            <Sparkles size={13} /> Commufill Official Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            커뮤필 최신 소식 & 커뮤니티 인사이트
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
            AI 기반 커뮤니티 오토메이션 및 최신 테크 스토리를 만나보세요.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-12 text-center space-y-4 my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            아직 발행된 포스팅이 없습니다.
          </h2>
          <p className="text-sm font-semibold text-zinc-400 max-w-md mx-auto leading-relaxed">
            커뮤필 스튜디오에서 새로운 블로그 글을 작성하고 첫 포스팅을 공유해 보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm hover:shadow-lg hover:border-emerald-500/60 transition-all duration-300"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                  <CalendarDays size={14} className="text-emerald-400" />
                  <span>{formatDate(post.created_at)}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs font-medium text-zinc-400 leading-relaxed line-clamp-3">
                  {buildExcerpt(post)}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300 hover:underline"
                >
                  포스팅 읽기 <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
