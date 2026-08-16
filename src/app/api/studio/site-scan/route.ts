import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { generateContentWithVertexAI } from "@/lib/server/vertex-ai-gemini";
import { isSpaWebsite, fetchRenderedHtmlWithHeadless } from "@/lib/server/headlessScraper";

export const maxDuration = 60; // 60 seconds should be enough for a quick scan

export async function POST(request: Request) {
  try {
    const { targetUrl } = await request.json();

    if (!targetUrl) {
      return NextResponse.json({ error: "타겟 URL이 필요합니다." }, { status: 400 });
    }

    let urlObj;
    try {
      urlObj = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch (e) {
      return NextResponse.json({ error: "유효하지 않은 URL입니다." }, { status: 400 });
    }

    // 1. Fetch Target URL
    let htmlText = "";
    try {
      const res = await fetch(urlObj.href, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (res.ok) {
        htmlText = await res.text();
      }
    } catch {}

    // Check SPA
    if (!htmlText || isSpaWebsite(htmlText)) {
      console.log(`[Site Scan] 🔍 SPA detected on ${urlObj.href}. Invoking Headless Chrome...`);
      const renderedDom = await fetchRenderedHtmlWithHeadless(urlObj.href);
      if (renderedDom) {
        htmlText = renderedDom;
      }
    }

    if (!htmlText) {
      return NextResponse.json({ error: "웹사이트 접근에 실패했습니다. (HTTP Error)" }, { status: 400 });
    }

    const $ = cheerio.load(htmlText);

    // 2. Extract Basic Stats
    // Total internal links (pages)
    const subLinks = new Set<string>();
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("/") && href.length > 1 && !href.startsWith("//")) {
        subLinks.add(href.split("#")[0].split("?")[0]);
      } else if (href && href.startsWith(urlObj.origin)) {
        subLinks.add(href.replace(urlObj.origin, "").split("#")[0].split("?")[0]);
      }
    });

    const totalPages = Math.min(subLinks.size + 1, 100); // Limit to 100 max
    const imageCount = $("img").length;
    const videoCount = $("video, iframe").length;
    
    // Clean HTML for length calculation
    $("script, style, svg, noscript").remove();
    const cleanText = $("body").text().replace(/\s+/g, " ").trim();
    const charCount = cleanText.length;

    // 3. Estimate Migration Time
    // Base: 25s for main page. Each subpage adds 15s. Images add some minor overhead.
    const estimatedSeconds = 25 + (totalPages - 1) * 15 + Math.floor(imageCount * 0.5);
    const estimatedMinutes = Math.floor(estimatedSeconds / 60);
    const estimatedRemainingSeconds = estimatedSeconds % 60;
    const estimatedTimeString = estimatedMinutes > 0 
      ? `약 ${estimatedMinutes}분 ${estimatedRemainingSeconds}초` 
      : `약 ${estimatedSeconds}초`;

    // 4. AI Deep Scan (Tone & Manner, Language)
    const prompt = `
      You are an expert Website Analyst. Analyze the following text extracted from a target website.
      Determine the main language used and the overall "Tone & Manner" (Vibe/Style) of the website.
      
      You MUST output a strict JSON object with the following schema:
      {
        "language": "e.g., 한국어, English, 日本語",
        "tone_and_manner": "e.g., 신뢰감 있는, 전문적인, 캐주얼한, 미니멀한, 감성적인"
      }
      
      Website Text Extract:
      ${cleanText.substring(0, 10000)}
    `;

    let aiData = { language: "분석 불가", tone_and_manner: "분석 불가" };
    try {
      const aiResponseText = await generateContentWithVertexAI({
        prompt,
        modelName: "gemini-flash-latest",
        responseMimeType: "application/json"
      });
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("AI Scan Analysis Error:", e);
    }

    // 5. Final Report Construction
    const scanReport = {
      target_url: urlObj.href,
      total_pages: totalPages,
      char_count: charCount,
      image_count: imageCount,
      video_count: videoCount,
      estimated_time_seconds: estimatedSeconds,
      estimated_time_string: estimatedTimeString,
      language: aiData.language,
      tone_and_manner: aiData.tone_and_manner,
      scanned_at: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: scanReport });
  } catch (error: any) {
    console.error("Site Scan Error:", error);
    return NextResponse.json({ error: error.message || "스캔 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
