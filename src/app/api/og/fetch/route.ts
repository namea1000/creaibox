import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url")?.trim();

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;

    // 1. Internal CreaiBox Blog Post check (creaibox.com/blog/slug or localhost:3000/blog/slug)
    const isInternalBlog =
      (host.endsWith("creaibox.com") || host === "localhost") &&
      pathname.startsWith("/blog/") &&
      pathname.length > 6;

    if (isInternalBlog) {
      const rawSlug = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
      const slug = decodeURIComponent(rawSlug);

      const supabase = await createAdminClient();
      const { data: postData } = await supabase
        .from("writing_creaibox_posts")
        .select("id, title, meta_description, focus_keyword, canonical_url, slug")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (postData) {
        // Fetch primary thumbnail image
        const { data: imgData } = await supabase
          .from("generated_images")
          .select("image_url, is_primary, created_at")
          .eq("source_type", "writing_creaibox_posts")
          .eq("source_id", postData.id)
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false });

        const primaryImg = (imgData || []).find((i) => i.is_primary) || (imgData || [])[0];

        return NextResponse.json({
          url: targetUrl,
          domain: "creaibox.com",
          title: postData.title || "CreaiBox 블로그 인사이트",
          description:
            postData.meta_description ||
            postData.focus_keyword ||
            "CreaiBox AI 콘텐츠 에이전트 포스팅 원문입니다.",
          image: primaryImg?.image_url || null,
        });
      }
    }

    // 2. External URL OG Metadata Fetcher
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({
        url: targetUrl,
        domain: host,
        title: targetUrl,
        description: "",
        image: null,
      });
    }

    const html = await res.text();

    const getMetaContent = (property: string): string => {
      const match1 = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i").exec(html);
      if (match1) return match1[1];
      const match2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i").exec(html);
      if (match2) return match2[1];
      const match3 = new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i").exec(html);
      if (match3) return match3[1];
      return "";
    };

    const ogTitle = getMetaContent("og:title") || getMetaContent("twitter:title");
    const ogDesc = getMetaContent("og:description") || getMetaContent("twitter:description") || getMetaContent("description");
    const ogImage = getMetaContent("og:image") || getMetaContent("twitter:image");

    let pageTitle = ogTitle;
    if (!pageTitle) {
      const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
      pageTitle = titleMatch ? titleMatch[1].trim() : targetUrl;
    }

    let absoluteImage: string | null = ogImage || null;
    if (absoluteImage && !absoluteImage.startsWith("http")) {
      try {
        absoluteImage = new URL(absoluteImage, parsedUrl.origin).toString();
      } catch {
        absoluteImage = null;
      }
    }

    return NextResponse.json({
      url: targetUrl,
      domain: host,
      title: pageTitle.trim(),
      description: ogDesc.trim(),
      image: absoluteImage || null,
    });
  } catch (err: any) {
    return NextResponse.json({
      url: targetUrl,
      domain: targetUrl.replace(/^https?:\/\//, "").split("/")[0],
      title: targetUrl,
      description: "",
      image: null,
    });
  }
}
