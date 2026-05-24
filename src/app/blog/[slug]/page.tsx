import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface PublishedPostDetail {
  title: string | null;
  content: string | null;
  slug: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  seo_tags: string[] | null;
  created_at: string | null;
}

const blogMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-zinc-200 pb-4 text-[2.15rem] font-black leading-[1.25] tracking-[-0.03em] text-[#101214]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-6 text-[1.7rem] font-black leading-[1.35] tracking-[-0.02em] text-[#15181c]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-[1.3rem] font-black leading-[1.4] text-[#181c21]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-[1.08rem] leading-[2.02] text-[#2a2f36]">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-black text-[#111418]">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-8 ml-6 list-disc space-y-3 text-[1.05rem] leading-[1.95] text-[#2a2f36]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 ml-6 list-decimal space-y-3 text-[1.05rem] leading-[1.95] text-[#2a2f36]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 marker:text-[#3b82f6]">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-[22px] border border-[#d9e1ea] bg-[#f8fafc] px-6 py-5 text-[1.02rem] font-medium leading-[1.9] text-[#4b5563]">
      {children}
    </blockquote>
  ),
  hr: () => <div className="my-10 h-px w-full bg-zinc-200" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-bold text-[#2563eb] underline decoration-[#93c5fd] decoration-2 underline-offset-4"
    >
      {children}
    </a>
  ),
};

function normalizePublishedContent(content: string) {
  return content
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*\*\*\*+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchPublishedPost(slug: string) {
  const supabase = await createClient();
  const decodedSlug = decodeURIComponent(slug);
  const { data, error } = await supabase
    .from("writing_creaibox_posts")
    .select("title, content, slug, meta_description, focus_keyword, canonical_url, seo_tags, created_at")
    .eq("slug", decodedSlug)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0] as PublishedPostDetail;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | Creaibox Blog",
    };
  }

  const canonical = post.canonical_url || `https://creaibox.com/blog/${slug}`;

  return {
    title: `${post.title} | Creaibox Blog`,
    description: post.meta_description || post.focus_keyword || "Creaibox 공개 블로그 상세 페이지",
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title || "Creaibox Blog",
      description: post.meta_description || post.focus_keyword || "Creaibox 공개 블로그 상세 페이지",
      type: "article",
      url: canonical,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const tags = post.seo_tags || [];
  const publishedDate = post.created_at ? new Date(post.created_at).toLocaleDateString("ko-KR") : "날짜 미상";

  return (
    <div className="min-h-screen bg-[#14181e] pt-20 text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-zinc-300 transition hover:border-cyan-400/30 hover:text-white"
        >
          <ArrowLeft size={16} />
          블로그 목록으로 돌아가기
        </Link>

        <article className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[#20242b]">
          <header className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_42%),linear-gradient(180deg,#262b33_0%,#20242b_100%)] px-8 py-10 md:px-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles size={12} />
              Creaibox Insight
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.18] tracking-[-0.03em] text-white md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={15} />
                {publishedDate}
              </span>
              {post.focus_keyword && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-cyan-200">
                  {post.focus_keyword}
                </span>
              )}
            </div>
          </header>

          <div className="bg-white px-8 py-10 md:px-12">
            {post.meta_description && (
              <div className="mb-8 rounded-[24px] border border-zinc-200 bg-white px-6 py-5 text-[1.02rem] font-medium leading-[1.8] text-zinc-700">
                {post.meta_description}
              </div>
            )}

            <div className="mx-auto max-w-[880px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={blogMarkdownComponents}>
                {normalizePublishedContent(post.content || "")}
              </ReactMarkdown>
            </div>

            {tags.length > 0 && (
              <div className="mx-auto mt-12 max-w-[880px] border-t border-zinc-200 pt-8">
                <h2 className="text-sm font-black uppercase tracking-[0.24em] text-zinc-500">SEO Tags</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
