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
  seo_tags: string[] | null;
  created_at: string | null;
  canonical_url: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function buildExcerpt(post: PublishedPost) {
  const source = (post.meta_description || post.focus_keyword || "소통과 채움 소식").trim();
  return source.length > 120 ? `${source.slice(0, 120)}...` : source;
}

export default async function SotongcheumBlogPage() {
  const supabase = await createAdminClient();

  // Fetch Profile for sotongcheum
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, brand_id, extra_configs")
    .eq("brand_id", "sotongcheum")
    .maybeSingle();

  let posts: PublishedPost[] = [];

  if (profile?.id) {
    const { data } = await supabase
      .from("writing_creaibox_posts")
      .select("id, title, slug, meta_description, focus_keyword, seo_tags, canonical_url, created_at")
      .eq("user_id", profile.id)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    posts = (data as PublishedPost[] | null) || [];
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-12">
      {/* Page Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden mb-12 border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-400/20">
            <Sparkles size={13} /> 소통과 채움 공식 블로그
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            소통과 채움의 최신 소식 & 인사이트
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            공공행사 대행, 공동체 축제, 감성 교육 서비스 및 최신 소통 스토리를 만나보세요.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <BookOpen size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            아직 발행된 포스팅이 없습니다.
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
            소통과 채움 스튜디오에서 새로운 블로그 글을 작성하고 첫 포스팅을 공유해 보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CalendarDays size={14} className="text-blue-500" />
                  <span>{formatDate(post.created_at)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3">
                  {buildExcerpt(post)}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 group-hover:text-blue-700 hover:underline"
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
