import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import * as cheerio from "cheerio";

// Polyfill DOMMatrix for pdf-parse in Node.js environment
if (typeof globalThis !== "undefined" && typeof (globalThis as any).DOMMatrix === "undefined") {
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const targetUrl = formData.get("targetUrl") as string;
    const refType = formData.get("refType") as string;
    const refUrl = formData.get("refUrl") as string;
    const refText = formData.get("refText") as string;
    const refPdf = formData.get("refPdf") as File | null;
    const autoCreate = formData.get("autoCreate") === "true";
    const subpageTitle = formData.get("title") as string;

    if (!targetUrl) {
      return NextResponse.json({ error: "Target URL is required" }, { status: 400 });
    }

    // Parse target URL
    const urlObj = new URL(targetUrl);
    let brandId = "";
    if (urlObj.hostname.includes(".localhost")) {
      brandId = urlObj.hostname.split(".localhost")[0];
    } else if (urlObj.hostname.includes(".creaibox.com")) {
      brandId = urlObj.hostname.split(".creaibox.com")[0];
    } else {
      brandId = urlObj.hostname; // Custom domain fallback
    }

    let slug = urlObj.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
    if (!slug) slug = "home";

    // Get site context
    const { data: site } = await supabase.from("client_sites").select("*").eq("brand_id", brandId).single();
    if (!site) {
      return NextResponse.json({ error: "Site not found for the given URL" }, { status: 404 });
    }

    // Ensure the subpage section exists
    const subpageSectionType = `subpage_${slug}`;
    const { data: sections } = await supabase.from("site_sections").select("*").eq("site_id", site.id).order("sort_order");
    
    let targetSection = sections?.find((s: any) => s.section_type === subpageSectionType);
    
    if (!targetSection) {
      if (autoCreate) {
        // Find max sort_order
        const maxSortOrder = sections?.reduce((max: number, s: any) => Math.max(max, s.sort_order || 0), 0) || 0;
        
        // We will insert it later with the generated HTML.
        // For now, we just create a mock targetSection so the rest of the code works.
        targetSection = {
          id: crypto.randomUUID(),
          site_id: site.id,
          section_type: subpageSectionType,
          sort_order: maxSortOrder + 1,
          title: subpageTitle || `Subpage ${slug}`,
          content_data: {}
        };
      } else {
        return NextResponse.json({ error: `Subpage section (${subpageSectionType}) does not exist. Please add it first in the Section Editor.` }, { status: 400 });
      }
    }

    // Build context from main page
    const mainSections = sections?.filter((s: any) => !s.section_type.startsWith("subpage_")) || [];
    const contextHtml = mainSections.map((s: any) => `<!-- Section: ${s.section_type} -->\n${s.content_data?.html || ""}`).join("\n\n");

    // Extract reference content
    let extractedReference = "";
    
    if (refType === "url" && refUrl) {
      try {
        const fetchRes = await fetch(refUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const html = await fetchRes.text();
        const $ = cheerio.load(html);
        extractedReference = $("body").text().replace(/\s+/g, " ").substring(0, 30000); // Limit size
      } catch (e) {
        console.error("URL scrape failed:", e);
        extractedReference = "(URL 크롤링 실패 - 기존 톤앤매너만 참조합니다)";
      }
    } else if (refType === "pdf" && refPdf) {
      try {
        const pdfParse = require("pdf-parse");
        const buffer = await refPdf.arrayBuffer();
        const data = await pdfParse(Buffer.from(buffer));
        extractedReference = data.text.substring(0, 30000);
      } catch (e) {
        console.error("PDF parse failed:", e);
        extractedReference = "(PDF 파싱 실패 - 기존 톤앤매너만 참조합니다)";
      }
    } else if (refType === "text" && refText) {
      extractedReference = refText;
    } else {
      extractedReference = "명시적인 참조 자료 없음. 기존 메인 페이지와 제목을 바탕으로 해당 페이지 목적에 맞게 가장 이상적이고 전문적인 콘텐츠를 유추 창작할 것.";
    }

    // Call Gemini AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      당신은 세계 최고 수준의 프론트엔드 웹 퍼블리셔이자 UX 디자이너입니다.
      우리는 기존 웹사이트의 새로운 서브페이지를 생성하려고 합니다.
      
      [사이트 배경 정보]
      - 브랜드/사이트 이름: ${site.site_name || brandId}
      - 타겟 서브페이지 슬러그(경로): /${slug}
      - 서브페이지 설정된 제목: ${targetSection.title || ""}
      
      [기존 웹사이트 메인 디자인 컨텍스트 (Tailwind CSS 톤앤매너 참조용)]
      ${contextHtml.substring(0, 15000) /* limit context to prevent token overflow */}
      
      [서브페이지용 참조 자료]
      ${extractedReference}
      
      [요구사항]
      1. 위 참조 자료의 내용(또는 유추된 내용)을 바탕으로, 기존 웹사이트 메인 디자인(Tailwind 클래스, 색상, 레이아웃 패턴, 여백 등)과 **완벽하게 어울리는 서브페이지 본문 HTML**을 생성하세요.
      2. <html>, <body>, <head> 등의 문서 태그는 제외하고, 오직 컨테이너 내부(예: <div class="py-20 max-w-7xl mx-auto...">)부터 시작하는 순수 HTML 조각(Snippet)만 응답하세요.
      3. Markdown 코드블록(\`\`\`html 등)은 절대로 사용하지 마세요. 오직 날것의 순수 HTML 텍스트만 출력하세요.
      4. Tailwind CSS 유틸리티 클래스만 사용하여 스타일링하세요.
      5. 서브페이지 제목(${targetSection.title})에 걸맞는 매력적이고 전문적인 콘텐츠를 창작하세요. 텍스트가 부족하다면 상황에 맞게 풍성하게 유추 창작하세요.
      6. 서브페이지의 특성에 따라 표, 리스트, 카드 섹션 등을 자유롭고 창의적으로 배치하세요.
    `;

    const aiResult = await model.generateContent(prompt);
    let generatedHtml = aiResult.response.text();
    
    // Clean up if markdown exists by mistake
    generatedHtml = generatedHtml.replace(/^```html/m, "").replace(/^```/m, "").trim();

    // Update DB or Insert DB
    const isNewSection = !sections?.some((s: any) => s.section_type === subpageSectionType);
    
    const sectionData = {
      ...targetSection,
      content_data: {
        ...(targetSection.content_data || {}),
        html: generatedHtml,
        ai_generated: true,
        updated_at: new Date().toISOString()
      }
    };

    if (isNewSection) {
      const { error: insertError } = await supabase
        .from("site_sections")
        .insert([sectionData]);
      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from("site_sections")
        .update({
          content_data: sectionData.content_data
        })
        .eq("id", targetSection.id);
      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true, slug: slug });
  } catch (error: any) {
    console.error("Subpage Builder Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate subpage" }, { status: 500 });
  }
}
