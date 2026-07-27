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

function looksLikeHtml(content: string) {
  return /<\/?(p|h[1-6]|div|table|blockquote|ul|ol|li|img|iframe|hr|br|strong|em|a)\b/i.test(content);
}

function sanitizePublishedHtml(content: string) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)=["']\s*javascript:[^"']*["']/gi, "")
    .replace(/\s+srcdoc=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/<img /gi, '<img referrerpolicy="no-referrer" ');
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-slate-200 pb-4 text-2xl font-extrabold tracking-tight text-slate-900">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-xl font-bold tracking-tight text-slate-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-lg font-bold text-slate-800">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-base leading-relaxed text-slate-700">
      {children}
    </p>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || "블로그 이미지"}
      referrerPolicy="no-referrer"
      className="my-6 max-w-full rounded-2xl shadow-md"
    />
  ),
  ul: ({ children }) => (
    <ul className="mb-6 list-disc pl-6 text-base text-slate-700 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal pl-6 text-base text-slate-700 space-y-2">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-blue-500 bg-blue-50/50 p-4 text-slate-700 rounded-r-2xl italic">
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

export default async function SotongcheumPostDetailPage(props: PostDetailPageProps) {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("brand_id", "sotongcheum")
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

  // Increment real-time DB view count (+1)
  const currentViews = Number(post.views || 0);
  void supabase
    .from("writing_creaibox_posts")
    .update({ views: currentViews + 1 })
    .eq("id", post.id);

  const rawContent = post.content || "";
  const isHtml = looksLikeHtml(rawContent);

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-12">
      {/* Meta tag to prevent Naver image referer blocking */}
      <meta name="referrer" content="no-referrer" />

      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> 블로그 목록으로 돌아가기
        </Link>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8">
        <header className="space-y-4 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <CalendarDays size={14} className="text-blue-500" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-md [&_img]:max-w-full [&_a]:text-blue-600 [&_a]:underline font-medium">
          {isHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizePublishedHtml(rawContent),
              }}
            />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogMarkdownComponents}>
              {rawContent}
            </ReactMarkdown>
          )}
        </div>
      </article>
    </div>
  );
}
