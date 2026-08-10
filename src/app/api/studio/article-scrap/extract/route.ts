import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // URL 유효성 검증
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // HTML 가져오기 (User-Agent를 일반 브라우저처럼 위장하여 차단 방지)
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 제목 추출 (보통 <title> 태그나 h1 태그)
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text();
    title = title ? title.trim() : '제목 없음';

    // 본문 추출 (보통 <article>, <main> 또는 텍스트가 가장 많은 div)
    // 좀 더 정교한 추출을 위해 주요 태그를 찾음
    let contentHtml = '';
    if ($('article').length > 0) {
      contentHtml = $('article').html() || '';
    } else if ($('main').length > 0) {
      contentHtml = $('main').html() || '';
    } else {
      // 본문을 담고 있을 법한 흔한 클래스나 id (임시 방편)
      const possibleSelectors = ['.post-content', '.entry-content', '#content', '.content', 'body'];
      for (const selector of possibleSelectors) {
        if ($(selector).length > 0) {
          contentHtml = $(selector).html() || '';
          break;
        }
      }
    }

    // 불필요한 태그 제거 (스크립트, 스타일, 네비게이션 등)
    if (contentHtml) {
      const $content = cheerio.load(contentHtml);
      $content('script, style, nav, header, footer, aside, .ad, .advertisement').remove();
      // 이미지 경로를 절대경로로 변환
      $content('img').each((_, el) => {
        const src = $content(el).attr('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
           try {
              $content(el).attr('src', new URL(src, targetUrl.origin).toString());
           } catch (e) {
              // ignore invalid url
           }
        }
      });
      contentHtml = $content.html() || '';
    } else {
       // fallback
       contentHtml = "본문을 추출할 수 없습니다.";
    }

    // DB에 저장 (writing_creaibox_posts 테이블)
    const { data: insertedData, error: dbError } = await supabase
      .from('writing_creaibox_posts')
      .insert({
        user_id: user.id,
        title: title,
        content: contentHtml,
        original_title: title,
        original_content: contentHtml,
        post_type: '아티클 스크랩',
        status: 'scraped',
        canonical_url: targetUrl.toString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to save to database", details: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertedData });

  } catch (error: any) {
    console.error("Scrap Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
