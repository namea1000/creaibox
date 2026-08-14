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

async function processHtmlImagesWithR2(html: string, siteId: string, origin: string): Promise<string> {
  if (!html) return html;
  
  let newHtml = html;
  
  // Convert relative image URLs and CSS urls to absolute using origin
  newHtml = newHtml.replace(/src=["'](\/[^"']+)["']/gi, `src="${origin}$1"`);
  newHtml = newHtml.replace(/url\(["']?(\/[^"')]*)["']?\)/gi, `url('${origin}$1')`);
  newHtml = newHtml.replace(/src=["'](?!(?:http|data:)|\/)([^"']+\.(?:png|jpe?g|gif|svg|webp))["']/gi, `src="${origin}/$1"`);

  const urlRegex = /https?:\/\/[^\s"'()]+/g;
  const urls = newHtml.match(urlRegex) || [];
  // Only target image-like URLs to avoid fetching unrelated links
  const uniqueUrls = Array.from(new Set(urls)).filter(u => u.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) || u.includes("images.unsplash.com") || u.includes("drive.google.com"));

  const uploadPromises = uniqueUrls.map(async (url) => {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileName = url.split('/').pop()?.split('?')[0] || `img_${Date.now()}.jpg`;
      const contentType = res.headers.get("content-type") || "image/jpeg";

      let finalBuffer: any = buffer;
      let finalContentType = contentType;
      let finalFileName = fileName;
      
      // Convert to WebP using sharp if it's an image (and not SVG)
      if (contentType.includes("image") && !contentType.includes("svg")) {
        try {
          finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
          finalContentType = "image/webp";
          finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
        } catch (err) {
          console.warn(`Sharp WebP conversion failed for ${url}, falling back to original:`, err);
        }
      }
      
      const s3Key = `migrated-sites/${siteId}/${Date.now()}_${finalFileName}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || 'creaibox-assets',
        Key: s3Key,
        Body: finalBuffer as any,
        ContentType: finalContentType,
      }));

      const newUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${s3Key}`;
      newHtml = newHtml.split(url).join(newUrl);
    } catch (e) {
      console.error(`Failed to upload ${url} to R2:`, e);
    }
  });

  await Promise.all(uploadPromises);
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
             const subHtml = await subRes.text();
             const subCleanHtml = subHtml
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
                .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
                .replace(/<!--[\s\S]*?-->/g, "");
             return `\n\n--- SUBPAGE: ${link} ---\n${subCleanHtml.substring(0, 10000)}`;
          }
       } catch(e) { console.error("Subpage fetch error", e); }
       return "";
    });
    
    const subHtmls = await Promise.all(subpagePromises);
    subpagesContext = subHtmls.join("");

    if (!subpagesContext) {
      return NextResponse.json({ success: true, message: "No HTML extracted" });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.7-flash" });
    
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

    const result = await model.generateContent(prompt);
    let aiText = result.response.text().trim();
    if (aiText.startsWith("```json")) {
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
    const parsedAi = JSON.parse(aiText);
    const aiSubpages = parsedAi.subpages || [];
    
    // Download and replace external images with R2 CDN URLs
    for (let i = 0; i < aiSubpages.length; i++) {
      if (aiSubpages[i].html) {
        aiSubpages[i].html = await processHtmlImagesWithR2(aiSubpages[i].html, siteId, targetOrigin);
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
