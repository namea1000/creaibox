import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

// Simple web scraper utility for context gathering
async function scrapeUrlText(url: string): Promise<string> {
  try {
    if (!url) return "";
    
    let targetUrl = url;
    // Naver Blog redirect handling (e.g. blog.naver.com/id to iframe PostView)
    if (url.includes("blog.naver.com") && !url.includes("PostView.naver") && !url.includes("PostList.naver")) {
      const parts = url.split("/");
      const blogId = parts[parts.length - 1] || parts[parts.length - 2];
      if (blogId) {
        // Fetch iframe content instead
        targetUrl = `https://blog.naver.com/PostList.naver?blogId=${blogId}`;
      }
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) return "";
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract main text content
    const textBlocks: string[] = [];
    
    // Scrape title
    const title = $("title").text().trim();
    if (title) textBlocks.push(`[사이트 타이틀] ${title}`);

    // Scrape paragraphs, headers, and blog editor blocks
    $("p, h1, h2, h3, div.se-main-container, div.post_area, article").each((_, el) => {
      const txt = $(el).text().replace(/\s+/g, " ").trim();
      if (txt && txt.length > 25 && textBlocks.length < 60) {
        textBlocks.push(txt);
      }
    });

    return textBlocks.join("\n\n").slice(0, 10000);
  } catch (err) {
    console.error("Scraper failed:", err);
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 2. Validate Business Membership Level
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_level, role")
      .eq("id", user.id)
      .maybeSingle();

    const mLevel = (profile?.membership_level || "").toLowerCase();
    const role = (profile?.role || "").toUpperCase();
    const isBusiness =
      mLevel === "business" ||
      mLevel === "enterprise" ||
      mLevel === "admin" ||
      role === "ADMIN" ||
      role === "SUPER_ADMIN";

    if (!isBusiness) {
      return NextResponse.json(
        { error: "AI 홈페이지 제작 기능은 Business 요금제 전용 기능입니다. 마이페이지에서 비즈니스 플랜으로 업그레이드해 주세요." },
        { status: 403 }
      );
    }

    // 3. Parse input params
    const { sourceUrl, additionalInfo = "", vaultConfig } = await req.json();

    if (!sourceUrl && !additionalInfo) {
      return NextResponse.json(
        { error: "블로그 주소나 참고 자료 중 최소 하나를 제공해야 합니다." },
        { status: 400 }
      );
    }

    // 4. Crawl content
    let scrapedContext = "";
    if (sourceUrl) {
      scrapedContext = await scrapeUrlText(sourceUrl);
    }

    // 5. Determine active AI provider, API key, and model (Vault first, then Env fallback)
    let activeProvider: "gemini" | "groq" = "gemini";
    let activeApiKey = "";
    let activeModel = "";

    if (vaultConfig && vaultConfig.apiKey) {
      const { provider, apiKey, model } = vaultConfig;
      if (provider === "groq") {
        activeProvider = "groq";
        activeApiKey = apiKey;
        activeModel = model || "llama-3.3-70b-versatile";
      } else {
        activeProvider = "gemini";
        activeApiKey = apiKey;
        activeModel = model || "gemini-2.5-flash";
      }
    } else {
      // Fallback to server env variables
      const serverGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
      const serverGroqKey = process.env.GROQ_API_KEY || "";
      
      if (serverGeminiKey) {
        activeProvider = "gemini";
        activeApiKey = serverGeminiKey;
        activeModel = "gemini-2.5-flash";
      } else if (serverGroqKey) {
        activeProvider = "groq";
        activeApiKey = serverGroqKey;
        activeModel = "llama-3.3-70b-versatile";
      }
    }

    if (!activeApiKey) {
      return NextResponse.json(
        { error: "AI API 키가 설정되어 있지 않습니다. 마이페이지(API Vault)에서 API 키를 등록하거나 서버 환경 변수를 확인해 주세요." },
        { status: 400 }
      );
    }

    const systemPrompt = `
너는 입력받은 자료(블로그 본문, 홈페이지 소개글, 메모 등)를 분석하여 해당 비즈니스에 맞는 최적의 홈페이지 기획안(JSON)을 도출하는 AI 홈페이지 기획 에이전트이다.

[작동 규칙]
1. 분석 결과를 바탕으로 회사/학원 공식 명칭(companyName), 대표 연락처(phone), 주소(address)를 추출하거나 유추해라.
2. 비즈니스 카테고리에 맞춰 가장 적절한 템플릿(templateId)을 선택해라. 선택 가능 품목:
   - 'business_standard' (일반 기업, 컨설팅, 대행사, 일반 서비스)
   - 'academy_navy' (학원, 교육 기관, 공부방, 학교)
   - 'restaurant_warm' (식음료 F&B, 식당, 카페, 공간 대여)
   - 'portfolio_minimal' (개인 작가, 디자인 스튜디오, 크리에이터)
3. 홈페이지를 채울 동적 섹션(sections) 배열을 설계해라. 섹션은 위에서 아래로 정렬될 순서로 작성하며 다음 종류들을 포함해야 한다:
   - 'hero': 메인 비주얼 배너. content_data 필수 규격: { "backgroundImage": "", "ctaText": "버튼글자", "ctaLink": "#contact", "features": [{ "text": "핵심특징1" }, { "text": "핵심특징2" }] }
   - 'services': 핵심 상품/교육과정/대표 메뉴 소개 카드. content_data 필수 규격: { "items": [{ "title": "서비스명", "description": "설명", "icon": "Lucide아이콘명(예: Layout, BookOpen, Flame, Award, Cpu, Code2, Compass 등)" }] } (최소 3개 카드 이상)
   - 'about': 회사/원장/대표 소개글 및 지표(Stats). content_data 필수 규격: { "description": "소개글 본문(줄바꿈포함)", "stats": [{ "label": "라벨", "value": "수치" }] }
   - (선택) 'portfolio': 실적/합격현황/포트폴리오 카드 그리드. content_data 필수 규격: { "items": [{ "title": "실적명", "description": "세부설명", "image": "" }] }
   - (선택) 'rental': 대관/이용규정/장비소개. content_data 필수 규격: { "description": "설명", "stats": [{ "label": "라벨", "value": "수치" }] }
   - 'contact': 상담 접수 폼. content_data 필수 규격: { "fields": ["name", "phone", "message", "grade", "subject" 등 선택 가능 필드들], "buttonText": "접수버튼명" }
4. 반드시 한국어로 상세하고 매끄러운 마케팅용 카피문구를 작성해라. '내용 없음', '임시' 등 플레이스홀더를 절대 넣지 말고 실제 분석된 정보를 기반으로 구체적으로 채워라.
5. 출력은 반드시 다음 JSON 스키마를 완벽히 준수해야 한다:

{
  "companyName": "회사/학원 공식 명칭",
  "phone": "대표 전화번호 (유추 불가시 비움)",
  "address": "대표 주소 (유추 불가시 비움)",
  "templateId": "business_standard | academy_navy | restaurant_warm | portfolio_minimal",
  "sections": [
    {
      "section_type": "hero | services | about | portfolio | rental | contact",
      "title": "섹션 큰 제목",
      "subtitle": "섹션 소제목/설명",
      "content_data": {
        // 각 섹션타입별 필수 규격 준수
      }
    }
  ]
}
`.trim();

    const userPrompt = `
[분석할 소스 자료]
- 주소: ${sourceUrl || "미제공"}
- 스크랩 본문:
${scrapedContext || "스크랩 텍스트 없음"}

- 추가 참고사항/지침:
${additionalInfo}
`.trim();

    let jsonText = "";

    if (activeProvider === "gemini") {
      const cleanModelName = activeModel.replace(/^models\//, "");
      const genAI = new GoogleGenerativeAI(activeApiKey);
      const model = genAI.getGenerativeModel({
        model: cleanModelName,
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(systemPrompt + "\n\n" + userPrompt);
      jsonText = result.response.text();
    } else {
      // Fallback to Groq Llama 3
      const Groq = require("groq-sdk");
      const groqClient = new Groq({ apiKey: activeApiKey });
      const completion = await groqClient.chat.completions.create({
        model: activeModel,
        messages: [
          {
            role: "system",
            content: systemPrompt + "\n\nResponse must be a valid JSON object matching the requested schema."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });
      jsonText = completion.choices[0]?.message?.content ?? "";
    }

    const proposal = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      proposal
    });
  } catch (error: any) {
    console.error("AI Planner API error:", error);
    return NextResponse.json(
      { error: error.message || "AI 기획안 수립 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
