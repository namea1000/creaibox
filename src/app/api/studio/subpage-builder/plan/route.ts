import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUrl, pageCount, refText } = await request.json();

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

    // Get site context
    const { data: site } = await supabase.from("client_sites").select("*").eq("brand_id", brandId).single();
    if (!site) {
      return NextResponse.json({ error: "Site not found for the given URL" }, { status: 404 });
    }

    // Get existing sections
    const { data: sections } = await supabase.from("site_sections").select("*").eq("site_id", site.id).order("sort_order");
    
    // Build context
    const existingSubpages = sections
      ?.filter((s: any) => s.section_type.startsWith("subpage_"))
      .map((s: any) => ({ slug: s.section_type.replace("subpage_", ""), title: s.title || "" })) || [];

    const mainSections = sections?.filter((s: any) => !s.section_type.startsWith("subpage_")) || [];
    const contextHtml = mainSections.map((s: any) => `<!-- Section: ${s.section_type} -->\n${s.content_data?.html || ""}`).join("\n\n");

    // Call Gemini AI to plan
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      당신은 웹사이트 기획자입니다.
      현재 웹사이트의 메인 페이지 내용과 기존 서브페이지 목록을 분석하여, 추가로 만들면 좋을 필수 서브페이지 ${pageCount}개를 기획해 주세요.
      
      [사이트 배경 정보]
      - 브랜드/사이트 이름: ${site.site_name || brandId}
      - 사용자가 전달한 추가 요구사항/참조: ${refText || "없음"}
      
      [기존에 이미 존재하는 서브페이지 목록]
      ${JSON.stringify(existingSubpages, null, 2)}
      (위 목록에 이미 있는 서브페이지(slug 기준)는 절대 중복해서 제안하지 마세요.)

      [기존 메인 디자인 컨텍스트 (비즈니스 성격 파악용)]
      ${contextHtml.substring(0, 10000)}
      
      [요구사항]
      1. 현재 비즈니스 성격상 가장 필요하지만 아직 존재하지 않는 서브페이지 ${pageCount}개를 제안하세요. (예: FAQ, 오시는길, 회사소개, 가격안내 등)
      2. 반드시 아래 JSON 배열 형식으로만 응답하세요. (마크다운 백틱 등 기타 텍스트 절대 금지)
      [
        { "title": "서브페이지 제목 (한글)", "slug": "서브페이지 영문 경로 (예: about, faq, contact)" }
      ]
    `;

    const aiResult = await model.generateContent(prompt);
    let jsonText = aiResult.response.text();
    
    // Clean JSON
    jsonText = jsonText.replace(/^```json/m, "").replace(/^```/m, "").trim();
    
    let plan = [];
    try {
      plan = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse plan JSON:", jsonText);
      throw new Error("AI 기획 데이터를 파싱하지 못했습니다.");
    }

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("Subpage Plan Error:", error);
    return NextResponse.json({ error: error.message || "Failed to plan subpages" }, { status: 500 });
  }
}
