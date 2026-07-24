import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createAdminClient } from "@/utils/supabase/server";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-zinc-800 pb-4 text-2xl font-extrabold tracking-tight text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-xl font-bold tracking-tight text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-lg font-bold text-zinc-200">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-base leading-relaxed text-zinc-300">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 list-disc pl-6 text-base text-zinc-300 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal pl-6 text-base text-zinc-300 space-y-2">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-emerald-500 bg-emerald-950/40 p-4 text-zinc-200 rounded-r-2xl italic">
      {children}
    </blockquote>
  ),
};

function formatDate(value: string | null) {
  if (!value) return "날짜 미상";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미상";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export default async function CommufillPostDetailPage(props: PostDetailPageProps) {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("brand_id", "commufill")
    .maybeSingle();

  if (!profile?.id) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("writing_creaibox_posts")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", decodedSlug)
    .eq("status", "published")
    .limit(1);

  const post = posts?.[0];
  if (!post) {
    notFound();
  }

  // Real-time DB view count increment (+1)
  const currentViews = Number(post.views || 0);
  void supabase
    .from("writing_creaibox_posts")
    .update({ views: currentViews + 1 })
    .eq("id", post.id);

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-12 text-zinc-100">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} /> 블로그 목록으로 돌아가기
        </Link>
      </div>

      <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-12 shadow-sm space-y-8">
        <header className="space-y-4 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
            <CalendarDays size={14} className="text-emerald-400" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogMarkdownComponents}>
            {post.content || ""}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
