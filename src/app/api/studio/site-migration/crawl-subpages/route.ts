import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 60; // 15s is usually enough for 5 pages, but we give 60s for safety

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

function normalizeHtmlImageUrls(html: string, origin: string): string {
  if (!html) return html;
  let newHtml = html;
  newHtml = newHtml.replace(/src=["'](\/[^"']+)["']/gi, `src="${origin}$1"`);
  newHtml = newHtml.replace(/url\(["']?(\/[^"')]*)["']?\)/gi, `url('${origin}$1')`);
  newHtml = newHtml.replace(/src=["'](?!(?:https?:|data:)|\/)([^"']+\.(?:png|jpe?g|gif|svg|webp))["']/gi, `src="${origin}/$1"`);
  return newHtml;
}

export async function POST(request: Request) {
  try {
    const adminSupabase = await createAdminClient();
    const { siteId, targetOrigin, links } = await request.json();

    if (!siteId || !targetOrigin || !links || !Array.isArray(links)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    let subpagesContext = "";
    const subpagePromises = links.map(async (link: string) => {
       try {
          const subRes = await fetch(`${targetOrigin}${link}`, {
             headers: { "User-Agent": "Mozilla/5.0" }
          });
          if (subRes.ok) {
             const text = await subRes.text();
             const clean = text
               .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
               .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
               .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");
             return `\n--- SUBPAGE: ${link} ---\n${clean.substring(0, 30000)}\n`;
          }
       } catch(e) { console.error("Subpage fetch error", e); }
       return "";
    });
    
    const subHtmls = await Promise.all(subpagePromises);
    subpagesContext = subHtmls.join("");

    if (!subpagesContext) {
      return NextResponse.json({ success: true, message: "No HTML extracted" });
    }

    const { generateContentWithVertexAI } = await import("@/lib/server/vertex-ai-gemini");
    
    const prompt = `
      You are an expert Frontend Developer and Designer. Your task is to extract content and HTML from the provided subpages and generate their UI clones.
      
      You MUST output a strict JSON object with a single "subpages" array mapping EACH provided subpage to its corresponding "page_slug" (e.g., if the link is "/dojos", the page_slug is "dojos").
      
      {
        "subpages": [
          {
            "page_slug": "exact string of the link (e.g. dojos from /dojos)",
            "html": "<main class='...'>...</main>"
          }
        ]
      }

      Guidelines:
      - Extract real text, links, and image URLs from the HTML.
      - CRITICAL RULE: All image URLs (\`src\` attributes or \`style="background-image: ..."\`) MUST be ABSOLUTE URLs. 
      - CRITICAL RULE 2: All internal links (\`<a href="...">\`) MUST be RELATIVE paths (e.g. \`href="/dojos"\`). Do not use absolute domains for internal navigation.
      - Use modern Tailwind CSS classes (e.g. flex, grid, px-8, py-16, text-gray-900, bg-white) for styling.
      - Make the HTML fully responsive (use md:, lg: prefixes).
      - Do NOT use Markdown formatting in the strings.
      - Output ONLY valid JSON. No other text.

      HTML content to analyze:
      ${subpagesContext}
    `;

    let aiText = "";
    try {
      aiText = await generateContentWithVertexAI({
        prompt,
        modelName: "gemini-flash-latest",
        responseMimeType: "application/json"
      });
      aiText = aiText.trim();
    } catch (vertexErr: any) {
      console.warn("[Crawl Subpages] Vertex AI fallback to SDK:", vertexErr);
      const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey) {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        aiText = result.response.text().trim();
      } else {
        throw vertexErr;
      }
    }

    if (aiText.startsWith("```json")) {
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
    const parsedAi = JSON.parse(aiText);
    const aiSubpages = parsedAi.subpages || [];
    
    // Fast normalize image URLs
    for (let i = 0; i < aiSubpages.length; i++) {
      if (aiSubpages[i].html) {
        aiSubpages[i].html = normalizeHtmlImageUrls(aiSubpages[i].html, targetOrigin);
      }
    }

    // Insert subpages into DB
    const subGen = aiSubpages.map((sec: any, index: number) => ({
      site_id: siteId,
      section_type: `subpage_${sec.page_slug || "page"}`,
      sort_order: 10 + index, // arbitrarily put subpages after main sections
      title: sec.page_slug || "Page",
      subtitle: "",
      content_data: { html: sec.html || "", page_slug: sec.page_slug || "page" }
    }));
    
    if (subGen.length > 0) {
      await adminSupabase.from("site_sections").insert(subGen);
    }

    return NextResponse.json({
      success: true,
      message: "Subpages chunk completed successfully"
    });
  } catch (err: any) {
    console.error("Subpage crawl error:", err);
    return NextResponse.json({ error: err.message || "서브페이지 크롤링 중 오류가 발생했습니다." }, { status: 500 });
  }
}
