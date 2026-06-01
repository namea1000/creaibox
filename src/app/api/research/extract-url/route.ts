import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@/utils/supabase/server";

function absoluteUrl(src: string, baseUrl: string) {
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return src;
  }
}

function cleanText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { sourceId, url } = await req.json();

    if (!sourceId || !url) {
      return NextResponse.json(
        { error: "sourceId와 url이 필요합니다." },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CreaiboxResearchBot/1.0; +https://creaibox.com)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `URL 요청 실패: ${res.status}` },
        { status: 400 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, noscript, iframe, svg").remove();

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").first().text() ||
      $("h1").first().text() ||
      url;

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const siteName = $('meta[property="og:site_name"]').attr("content") || "";

    const ogImage = $('meta[property="og:image"]').attr("content");

    const imageList = $("img")
      .map((_, el) => {
        const src =
          $(el).attr("src") ||
          $(el).attr("data-src") ||
          $(el).attr("data-original");

        if (!src) return null;

        return {
          src: absoluteUrl(src, url),
          alt: $(el).attr("alt") || "",
          type: "content-image",
        };
      })
      .get()
      .filter(Boolean)
      .slice(0, 30);

    const images = [
      ...(ogImage
        ? [
          {
            src: absoluteUrl(ogImage, url),
            alt: title,
            type: "og-image",
          },
        ]
        : []),
      ...imageList,
    ];

    const articleText =
      $("article").text() ||
      $("main").text() ||
      $('[role="main"]').text() ||
      $("body").text();

    const extractedText = cleanText(articleText);
    const finalTitle = cleanText(title);
    const finalDescription = cleanText(description);

    const { error: extractionError } = await supabase
      .from("research_extractions")
      .insert({
        source_id: sourceId,
        user_id: user.id,
        extracted_title: finalTitle,
        extracted_text: extractedText,
        summary: finalDescription,
        meta: {
          url,
          site_name: siteName,
          description: finalDescription,
          extracted_by: "extract-url-api",
        },
        images,
        char_count: extractedText.length,
        word_count: extractedText ? extractedText.split(/\s+/).length : 0,
        language: "ko",
      });

    if (extractionError) throw extractionError;

    const { error: sourceUpdateError } = await supabase
      .from("research_sources")
      .update({
        title: finalTitle,
        status: "extracted",
      })
      .eq("id", sourceId)
      .eq("user_id", user.id);

    if (sourceUpdateError) throw sourceUpdateError;

    return NextResponse.json({
      ok: true,
      title: finalTitle,
      textLength: extractedText.length,
      imageCount: images.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "URL 추출 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}