import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      publishedResult,
      canonicalMissingResult,
      metaMissingResult,
      slugMissingResult,
      draftResult,
    ] = await Promise.all([
      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .or("canonical_url.is.null,canonical_url.eq."),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .or("meta_description.is.null,meta_description.eq."),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .or("slug.is.null,slug.eq."),

      supabase
        .from("writing_creaibox_posts")
        .select("id", { count: "exact", head: true })
        .neq("status", "published"),
    ]);

    const publishedPosts = publishedResult.count ?? 0;
    const canonicalMissing = canonicalMissingResult.count ?? 0;
    const metaDescriptionMissing = metaMissingResult.count ?? 0;
    const slugMissing = slugMissingResult.count ?? 0;
    const draftPosts = draftResult.count ?? 0;

    const sitemapUrls = publishedPosts + 2; // home + blog + published posts
    const seoReadyPosts = Math.max(
      publishedPosts - canonicalMissing - metaDescriptionMissing - slugMissing,
      0
    );

    return NextResponse.json({
      searchConsoleReady: true,
      sitemapActive: true,
      robotsActive: true,
      canonicalOk: canonicalMissing === 0,
      publishedPosts,
      sitemapUrls,
      seoReadyPosts,
      draftPosts,
      canonicalMissing,
      metaDescriptionMissing,
      slugMissing,
      indexingCandidates: publishedPosts,
      notReadyPosts:
        canonicalMissing + metaDescriptionMissing + slugMissing,
      organicClicks: null,
      impressions: null,
      ctr: null,
      averagePosition: null,
    });
  } catch (error) {
    console.error("SEO admin status error:", error);

    return NextResponse.json(
      {
        error: "SEO 상태 조회 실패",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}