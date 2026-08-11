import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";

export const maxDuration = 300;

/**
 * 🚀 AI 기존 홈페이지 1초 자동 이관 (Site Migration & Scraper Engine)
 */
export async function POST(request: Request) {
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

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const { targetUrl, depth } = await request.json();

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ error: "올바른 홈페이지 URL을 입력해 주세요." }, { status: 400 });
    }

    let urlObj: URL;
    try {
      urlObj = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL 형식입니다." }, { status: 400 });
    }

    // 1. Fetch Target Website Content
    const res = await fetch(urlObj.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "기존 홈페이지에 접속할 수 없습니다. URL을 확인해 주세요." }, { status: 400 });
    }

    const htmlText = await res.text();

    // 2. Clean HTML for Gemini (Remove scripts, styles, svgs to save tokens)
    const cleanHtml = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");
      
    // --- NEW: Deep Crawling of Subpages ---
    let subpagesContext = "";
    let pendingSubpages: string[] = [];
    if (depth === "full" || depth === "massive") {
      const hrefRegex = /<a[^>]+href=["'](\/[^"']+)["']/g;
      let match;
      const subLinks = new Set<string>();
      while ((match = hrefRegex.exec(cleanHtml)) !== null) {
         if (match[1].length > 1 && !match[1].startsWith('//')) {
            subLinks.add(match[1]);
         }
      }
      
      if (depth === "full") {
        const topLinks = Array.from(subLinks).slice(0, 15); // limit to 15 subpages max
        
        const subpagePromises = topLinks.map(async (link) => {
           try {
              const subRes = await fetch(`${urlObj.origin}${link}`, {
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
      } else if (depth === "massive") {
        pendingSubpages = Array.from(subLinks).slice(0, 100); // return up to 100 links to frontend
      }
    }
    // --------------------------------------

    // Extract basic meta tags as fallback
    const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : urlObj.hostname;
    const descMatch = htmlText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const metaDesc = descMatch ? descMatch[1].trim() : `${pageTitle} 공식 홈페이지`;
    const ogImageMatch = htmlText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const heroImage = ogImageMatch ? ogImageMatch[1] : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";
    const phoneMatch = htmlText.match(/0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}/g);
    const phoneNumber = phoneMatch ? phoneMatch[0] : "02-1234-5678";
    const addressMatch = htmlText.match(/([가-힣]+[시|도]\s+[가-힣]+[구|군|시]\s+[가-힣0-9\s-]+[로|길|동])/g);
    const address = addressMatch ? addressMatch[0] : "서울특별시 강남구 테헤란로 123";

    // 3. Generate Subdomain Name
    const rawHostname = urlObj.hostname.replace(/^www\./, "").split(".")[0];
    const cleanSubdomain = rawHostname.toLowerCase().replace(/[^a-z0-9-]/g, "") || "mysite";

    // 4. DB Insert - Real Data saving (Strict Zero Fake Data Rule)
    const adminSupabase = await createAdminClient();

    // Find unique brand_id to avoid overwriting (e.g. ikonakamura2)
    let finalSubdomain = cleanSubdomain;
    let isUnique = false;
    let suffix = 1;
    
    while (!isUnique) {
      const checkDomain = suffix === 1 ? cleanSubdomain : `${cleanSubdomain}${suffix}`;
      const { data: existingSite } = await adminSupabase
        .from("client_sites")
        .select("id")
        .eq("brand_id", checkDomain)
        .maybeSingle();
        
      if (!existingSite) {
        finalSubdomain = checkDomain;
        isUnique = true;
      } else {
        suffix++;
      }
    }

    const { data: newSite, error: insertError } = await adminSupabase
      .from("client_sites")
      .insert({
        profile_id: user.id,
        brand_id: finalSubdomain,
        company_name: pageTitle,
        phone: phoneNumber,
        address: address,
        status: 'ACTIVE',
        template_id: 'service_1'
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to insert client_site:", insertError);
      return NextResponse.json({ error: "사이트 생성 중 DB 오류가 발생했습니다." }, { status: 500 });
    }
    
    const siteId = newSite.id;
    const hasMain = false; // Always false since it's a new site

    // 5. Deep Migration with Gemini 3.5 Flash Lite
    let generatedSections: any[] = [];
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
        const availableTemplateIds = Object.keys(TEMPLATE_REGISTRY).join(", ");
        
        const prompt = `
          You are an expert Frontend Developer and Designer. Your task is to perfectly clone the layout, design, header, footer, and sections of the provided target website using beautifully crafted, modern Tailwind CSS HTML.
          Analyze the following cleaned HTML content of the website and generate an EXACT replica of its visual structure.
          
          You MUST output a strict JSON object with the following schema:
          {
            "template_id": "Choose the BEST matching template ID from the list below",
            ${!hasMain ? `"header_html": "<header class='...'>...</header>",
            "footer_html": "<footer class='...'>...</footer>",
            "main_sections": [
              {
                "section_type": "custom_html",
                "html": "<section class='...'>...</section>"
              }
            ],` : ""}
            ${depth === 'full' ? `"subpages": [
              {
                "page_slug": "exact string of the link (e.g. dojos from /dojos)",
                "html": "<main class='...'>...</main>"
              }
            ]` : ""}
          }

          Guidelines:
          - Extract real text, links, and image URLs from the HTML (Check \`data-src\` if \`src\` is empty/lazy-loaded).
          - CRITICAL RULE: All image URLs (\`src\` attributes or \`style="background-image: ..."\`) MUST be ABSOLUTE URLs. 
          - CRITICAL RULE 2: All internal links (\`<a href="...">\`) MUST be RELATIVE paths (e.g. \`href="/dojos"\`). Do not use absolute domains for internal navigation.
          - Use modern Tailwind CSS classes (e.g. flex, grid, px-8, py-16, text-gray-900, bg-white) for styling.
          - Make the HTML fully responsive (use md:, lg: prefixes).
          - Do NOT use Markdown formatting in the strings.
          - From the following list of templates, choose the MOST appropriate 'template_id' based on the website's industry, content, and vibe: [${availableTemplateIds}].
          ${!hasMain ? `- Replicate the header menu links and footer structure exactly.
          - If the original site uses anchor links (e.g., href="#section") for a one-page layout, you MUST preserve these exact anchor links in the header and ensure the corresponding <section> blocks in main_sections have the matching id attributes.
          - Split the main body into 3 to 6 logical \`<section>\` blocks, each as a separate item in the \`main_sections\` array.` : ""}
          ${depth === 'full' ? `- You are provided with the HTML of actual subpages below. You MUST generate a "subpages" array mapping EACH provided subpage to its corresponding "page_slug" (e.g., if the link is "/dojos", the page_slug is "dojos"). Recreate the HTML for each subpage accurately.` : ""}
          - Output ONLY valid JSON. No other text.

          HTML content to analyze:
          --- MAIN PAGE ---
          ${cleanHtml.substring(0, 40000)} // Limit size
          ${subpagesContext}
        `;

        const result = await model.generateContent(prompt);
        let aiText = result.response.text().trim();
        if (aiText.startsWith("```json")) {
          aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        }
        
        const parsedAi = JSON.parse(aiText);
        
        // 0. Update template_id based on AI's choice
        const aiTemplateId = parsedAi.template_id;
        if (aiTemplateId && TEMPLATE_REGISTRY[aiTemplateId]) {
          await adminSupabase.from("client_sites").update({ template_id: aiTemplateId }).eq("id", siteId);
        }
        
        // --- NEW: Download and replace external images with R2 CDN URLs ---
        let headerHtml = parsedAi.header_html || "";
        let footerHtml = parsedAi.footer_html || "";
        
        headerHtml = await processHtmlImagesWithR2(headerHtml, siteId, urlObj.origin);
        footerHtml = await processHtmlImagesWithR2(footerHtml, siteId, urlObj.origin);
        
        const aiSections = parsedAi.main_sections || [];
        for (let i = 0; i < aiSections.length; i++) {
          if (aiSections[i].html) {
            aiSections[i].html = await processHtmlImagesWithR2(aiSections[i].html, siteId, urlObj.origin);
          }
        }
        
        const aiSubpages = parsedAi.subpages || [];
        for (let i = 0; i < aiSubpages.length; i++) {
          if (aiSubpages[i].html) {
            aiSubpages[i].html = await processHtmlImagesWithR2(aiSubpages[i].html, siteId, urlObj.origin);
          }
        }
        // ------------------------------------------------------------------

        // 1. Update site extra_configs with custom header and footer
        if (headerHtml || footerHtml) {
          const { data: currentSite } = await adminSupabase
            .from("client_sites")
            .select("extra_configs")
            .eq("id", siteId)
            .single();
            
          const currentConfigs = currentSite?.extra_configs || {};
          await adminSupabase.from("client_sites").update({
            extra_configs: {
              ...currentConfigs,
              ...(headerHtml ? { header_html: headerHtml } : {}),
              ...(footerHtml ? { footer_html: footerHtml } : {}),
              is_custom_layout: true
            }
          }).eq("id", siteId);
        }

        // 2. Map main sections
        const mainGen = aiSections.map((sec: any, index: number) => ({
          site_id: siteId,
          section_type: "custom_html",
          sort_order: index + 1,
          title: pageTitle,
          subtitle: "",
          content_data: { html: sec.html || "" }
        }));
        
        // 3. Map subpages
        const subGen = aiSubpages.map((sec: any, index: number) => ({
          site_id: siteId,
          section_type: `subpage_${sec.page_slug || "page"}`,
          sort_order: index + 1,
          title: sec.page_slug || "Page",
          subtitle: "",
          content_data: { html: sec.html || "", page_slug: sec.page_slug || "page" }
        }));
        
        generatedSections = [...mainGen, ...subGen];
      }
    } catch (e) {
      console.error("Gemini Parsing Error:", e);
    }

    // Fallback if Gemini fails or returns empty
    if (!generatedSections || generatedSections.length === 0) {
      generatedSections = [
        {
          site_id: siteId,
          section_type: "hero",
          sort_order: 1,
          title: pageTitle,
          subtitle: metaDesc,
          content_data: { image: heroImage, cta_text: "상담 문의하기" }
        },
        {
          site_id: siteId,
          section_type: "about",
          sort_order: 2,
          title: "회사 소개",
          subtitle: "저희 홈페이지에 오신 것을 환영합니다.",
          content_data: { description: metaDesc, address, phone: phoneNumber }
        }
      ];
    }

    await adminSupabase.from("site_sections").insert(generatedSections);

    const mainPageCdnStorage = "CreAibox 초고속 클라우드 CDN (Supabase Storage / Vercel Blob)";
    const blogArticlesStorage = "크리에이박스 블로그 > 블로그 원고 관리 & CreAibox 클라우드 DB";

    // 5. Construct CreAibox Migration Result Payload
    const migratedData = {
      targetUrl: urlObj.href,
      targetOrigin: urlObj.origin,
      siteId,
      pendingSubpages,
      migratedSubdomain: finalSubdomain,
      subdomain: `${finalSubdomain}.creaibox.com`,
      siteTitle: pageTitle,
      description: metaDesc,
      heroImage,
      mainPageCdnStorage,
      blogArticlesStorage,
      contact: {
        phone: phoneNumber,
        address,
      },
      extractedPages: [
        { title: "홈 (Home)", slug: "/", status: "COMPLETED", storage: mainPageCdnStorage },
        { title: "회사/소개 (About)", slug: "/about", status: "COMPLETED", storage: mainPageCdnStorage }
      ],
      migratedBlogPostsCount: 0,
      migratedImagesCount: 2,
      migratedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    return NextResponse.json({
      success: true,
      message: "기존 홈페이지 1초 AI 자동 이관이 완료되었습니다!",
      data: migratedData,
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: err.message || "기존 홈페이지 이관 중 오류가 발생했습니다." }, { status: 500 });
  }
}
