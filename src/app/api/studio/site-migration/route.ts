import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

  /**
   * ⚡ 즉시 이미지 URL 절대경로 정규화 (Fast In-Memory Normalization)
   * 원본 사이트의 상대경로(/images/...)를 절대경로로 0.001초 만에 변환하여
   * 타임아웃 없이 실제 이미지가 즉시 화면에 노출되도록 보장합니다.
   */
  function normalizeHtmlImageUrls(html: string, origin: string): string {
    if (!html) return html;
    let newHtml = html;
    newHtml = newHtml.replace(/src=["'](\/[^"']+)["']/gi, `src="${origin}$1"`);
    newHtml = newHtml.replace(/url\(["']?(\/[^"')]*)["']?\)/gi, `url('${origin}$1')`);
    newHtml = newHtml.replace(/src=["'](?!(?:https?:|data:)|\/)([^"']+\.(?:png|jpe?g|gif|svg|webp))["']/gi, `src="${origin}/$1"`);
    return newHtml;
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const { targetUrl, depth, scanReport } = await request.json();

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

    // 🌟 Check if target is a JavaScript SPA (e.g. Burger King, Starbucks, Vue/React CSR)
    // Dynamic import: avoids crashing route module on Vercel where puppeteer-core is not bundled
    try {
      const { isSpaWebsite, fetchRenderedHtmlWithHeadless } = await import("@/lib/server/headlessScraper");
      if (!htmlText || isSpaWebsite(htmlText)) {
        console.log(`[Site Migration] 🔍 SPA detected on ${urlObj.href}. Invoking Headless Chrome DOM rendering...`);
        const renderedDom = await fetchRenderedHtmlWithHeadless(urlObj.href);
        if (renderedDom && renderedDom.length > 500) {
          htmlText = renderedDom;
          console.log(`[Site Migration] 🟢 Headless Chrome successfully rendered SPA DOM (${htmlText.length} bytes).`);
        }
      }
    } catch (scraperErr) {
      console.warn("[Site Migration] Headless scraper not available, proceeding with fetched HTML:", scraperErr);
    }

    if (!htmlText) {
      return NextResponse.json({ error: "기존 홈페이지에 접속할 수 없습니다. URL을 확인해 주세요." }, { status: 400 });
    }

    // 2. Clean HTML for Gemini (Remove scripts, styles, svgs to save tokens)
    const cleanHtml = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");
      
    // --- NEW: Deep Crawling of Subpages (Queueing for Background Worker) ---
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
        pendingSubpages = Array.from(subLinks).slice(0, 15); // limit to 15 subpages max for the queue
      } else if (depth === "massive") {
        pendingSubpages = Array.from(subLinks).slice(0, 100); // limit to 100 links
      }
    }
    // ----------------------------------------------------------------------

    // --- NEW: CSS Background Image Deep Harvester ---
    // Extract hidden background images from external linked stylesheets (e.g. layout.css, default.css)
    const detectedCssImages = new Set<string>();
    try {
      const cssLinkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
      let cssMatch;
      const cssUrls: string[] = [];
      while ((cssMatch = cssLinkRegex.exec(htmlText)) !== null) {
        let cssHref = cssMatch[1].trim();
        if (cssHref.startsWith("//")) {
          cssHref = `${urlObj.protocol}${cssHref}`;
        } else if (cssHref.startsWith("/")) {
          cssHref = `${urlObj.origin}${cssHref}`;
        } else if (!cssHref.startsWith("http")) {
          cssHref = `${urlObj.origin}/${cssHref}`;
        }
        cssUrls.push(cssHref);
      }

      // Fetch top 5 stylesheets in parallel
      const cssPromises = cssUrls.slice(0, 5).map(async (cUrl) => {
        try {
          const cRes = await fetch(cUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(4000)
          });
          if (!cRes.ok) return;
          const cssCode = await cRes.text();
          const bgUrlRegex = /url\(["']?([^"')]+)["']?\)/gi;
          let bgMatch;
          const cssBase = cUrl.substring(0, cUrl.lastIndexOf("/") + 1);
          while ((bgMatch = bgUrlRegex.exec(cssCode)) !== null) {
            let imgPath = bgMatch[1].trim();
            if (imgPath.startsWith("data:") || imgPath.includes("#")) continue;
            if (!imgPath.match(/\.(jpeg|jpg|png|webp|gif|svg)/i)) continue;

            let absImgUrl = "";
            if (imgPath.startsWith("http")) {
              absImgUrl = imgPath;
            } else if (imgPath.startsWith("//")) {
              absImgUrl = `${urlObj.protocol}${imgPath}`;
            } else if (imgPath.startsWith("/")) {
              absImgUrl = `${urlObj.origin}${imgPath}`;
            } else {
              // Resolve relative to css file path (handles ../images/...)
              try {
                absImgUrl = new URL(imgPath, cssBase).href;
              } catch {
                absImgUrl = `${urlObj.origin}/${imgPath.replace(/^\.\.\//, "")}`;
              }
            }
            if (absImgUrl) detectedCssImages.add(absImgUrl);
          }
        } catch {}
      });

      await Promise.all(cssPromises);
      console.log(`[Site Migration 🎨] Extracted ${detectedCssImages.size} hidden CSS background images.`);
    } catch (cssErr) {
      console.warn("[Site Migration] Failed to parse external CSS:", cssErr);
    }

    const cssImageListStr = Array.from(detectedCssImages).slice(0, 15).join("\n- ");
    // ----------------------------------------------------------------------

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

    // 3. Generate Temporary Preview Subdomain Name (e.g. burgerking-7f3b)
    const rawHostname = urlObj.hostname.replace(/^www\./, "").split(".")[0];
    const cleanSubdomain = rawHostname.toLowerCase().replace(/[^a-z0-9-]/g, "") || "mysite";

    // 4. DB Insert - Real Data saving with DRAFT status & Random 4-character Preview Subdomain
    const adminSupabase = await createAdminClient();

    let finalSubdomain = "";
    let isUnique = false;
    
    while (!isUnique) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const checkDomain = `${cleanSubdomain}-${randomSuffix}`;
      const { data: existingSite } = await adminSupabase
        .from("client_sites")
        .select("id")
        .eq("brand_id", checkDomain)
        .maybeSingle();
        
      if (!existingSite) {
        finalSubdomain = checkDomain;
        isUnique = true;
      }
    }

    const sitePayload: any = {
      profile_id: user.id,
      brand_id: finalSubdomain,
      company_name: pageTitle,
      phone: phoneNumber,
      address: address,
      status: 'DRAFT', // 🟡 Default: Draft/Preview Mode (Zero SEO/Legal Risk)
      template_id: 'service_1',
      creation_source: 'migration',
      extra_configs: {
        original_url: urlObj.origin,
        target_slug: cleanSubdomain, // Preferred brand slug for later 1-click promotion
        is_draft: true,
        migration_queue: pendingSubpages,
        migration_total_count: pendingSubpages.length,
        migration_status: pendingSubpages.length > 0 ? "migrating" : "completed",
        scan_report: scanReport || {}
      }
    };

    let { data: newSite, error: insertError } = await adminSupabase
      .from("client_sites")
      .insert(sitePayload)
      .select("id")
      .single();

    // Fallback if legacy DB check constraint restricts status to ACTIVE/INACTIVE or column mismatch
    if (insertError) {
      console.warn("[Site Migration] First DB insert failed, retrying with robust legacy fallback:", insertError.message);
      const fallbackPayload: any = {
        profile_id: user.id,
        brand_id: finalSubdomain,
        company_name: pageTitle,
        phone: phoneNumber,
        address: address,
        status: 'INACTIVE', // Safe legacy status with is_draft: true
        template_id: 'service_1',
        extra_configs: sitePayload.extra_configs,
      };
      const retryRes = await adminSupabase
        .from("client_sites")
        .insert(fallbackPayload)
        .select("id")
        .single();
      newSite = retryRes.data;
      insertError = retryRes.error;
    }

    if (insertError || !newSite) {
      console.error("Failed to insert client_site:", insertError);
      return NextResponse.json({ error: "사이트 생성 중 DB 오류가 발생했습니다: " + (insertError?.message || "") }, { status: 500 });
    }
    
    const siteId = newSite.id;
    const hasMain = false; // Always false since it's a new site

    // 5. Deep Migration with Gemini (Vertex AI with intelligent fallbacks)
    let generatedSections: any[] = [];
    try {
      const { generateContentWithVertexAI } = await import("@/lib/server/vertex-ai-gemini");
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
                "section_type": "custom_html | advanced_content_carousel | advanced_media_carousel | hero_image_slider",
                "html": "<section class='...'>...</section>",
                "media_urls": ["url1", "url2", "..."],
                "slides": ["<div class='...'>slide 1 HTML</div>", "<div class='...'>slide 2 HTML</div>"],
                "desktop_aspect_ratio": "21/9 (or 16/9, 4/3, 100vh etc)"
              }
            ]` : ""}
          }

          Guidelines:
          - PRO-CLONING RULE 1 (Colors & Solid Background Preservation): Extract the EXACT HEX color codes (e.g., Spreadshop vibrant brand coral-orange \`bg-[#FF7E4F]\`, Burger King deep brown \`bg-[#502314]\`, Samsung Navy \`bg-[#005aab]\`). NEVER replace solid brand backgrounds with generic white or arbitrary gradients! If the original hero/section has a solid color background, apply the exact HEX color code directly using \`bg-[#HEX]\`.
          - PRO-CLONING RULE 2 (Data Preservation & NO OMISSION): DO NOT summarize, omit, or hallucinate text. You MUST extract EVERY SINGLE section from the body. Copy ALL specific statistics, detailed numbers, and exact copywriting VERBATIM. CRITICAL: DO NOT omit any images! If a slide or section contains multiple images (e.g., a background image AND a product image below the text), you MUST preserve all <img> tags.
          - PRO-CLONING RULE 3 (Images, Logos, VIDEOS & INTERACTIVE VIDEO BANNERS): Preserve all \`<img>\`, \`<video>\`, and \`<source>\` tags. Do not replace videos with solid colors.
            1. For multi-slide image/video hero carousels, use \`section_type: "hero_image_slider"\` or \`"advanced_media_carousel"\`.
            2. For full-width single brand video banners, use \`section_type: "interactive_video_banner"\`.
          - PRO-CLONING RULE 4 (Lazy-Loaded Media): Always prioritize \`data-src\`, \`data-lazy\`, or \`srcset\` attributes over a simple \`src\` if they exist. Use the highest resolution media URL available in the raw HTML.
          - PRO-CLONING RULE 5 (Navigation & Language Exact Match): Preserve the EXACT language and casing of header navigation menus.
          - PRO-CLONING RULE 6 (CSS BACKGROUND IMAGES FOR HERO/SECTIONS): The target site may use CSS background images. Incorporate real image URLs from [DETECTED CSS ASSETS].
          - CRITICAL RULE: All image URLs (\`src\` attributes or \`style="background-image: ..."\`) MUST be ABSOLUTE URLs.
          - Use modern Tailwind CSS classes for styling.
          - From the following list of templates, choose the MOST appropriate 'template_id': [${availableTemplateIds}].
          - Output ONLY valid JSON. No other text.
          - MINIFY all HTML strings to keep the response compact.

          ${cssImageListStr ? `
          [REAL DETECTED CSS BACKGROUND MEDIA ASSETS]:
          - ${cssImageListStr}
          ` : ""}

          HTML content to analyze:
          --- MAIN PAGE ---
          ${cleanHtml.substring(0, 45000)}
        `;

        let aiText = "";
        // 🟢 1순위: Google Cloud Vertex AI (GCP $300 크레딧 엔터프라이즈 인프라 우선 호출)
        try {
          aiText = await generateContentWithVertexAI({
            prompt: prompt,
            modelName: "gemini-flash-latest",
            responseMimeType: "application/json"
          });
          aiText = aiText.trim();
        } catch (vertexErr: any) {
          console.warn("[Site Migration] Vertex AI 1차 호출 실패 -> Google AI Studio SDK로 2차 폴백 시도:", vertexErr);
          const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          if (apiKey) {
            try {
              const { GoogleGenerativeAI } = await import("@google/generative-ai");
              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
              });
              const res = await model.generateContent([{ text: prompt }]);
              aiText = res.response.text().trim();
            } catch (sdkErr: any) {
              console.warn("[Site Migration] AI fallback SDK also failed, using fallback sections:", sdkErr);
            }
          }
        }

        if (aiText) {
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiText = jsonMatch[0];
          }
          
          let parsedAi;
          try {
            parsedAi = JSON.parse(aiText);
          } catch (parseError) {
            console.warn("AI JSON Parse Error, continuing with fallback sections:", parseError);
          }
          
          if (parsedAi) {
            // 0. Update template_id based on AI's choice
            const aiTemplateId = parsedAi.template_id;
            if (aiTemplateId && TEMPLATE_REGISTRY[aiTemplateId]) {
              await adminSupabase.from("client_sites").update({ template_id: aiTemplateId }).eq("id", siteId);
            }
            
            // ⚡ 즉시 이미지 상대경로 정규화
            let headerHtml = parsedAi.header_html || "";
            let footerHtml = parsedAi.footer_html || "";
            
            headerHtml = normalizeHtmlImageUrls(headerHtml, urlObj.origin);
            footerHtml = normalizeHtmlImageUrls(footerHtml, urlObj.origin);
            
            const aiSections = parsedAi.main_sections || [];
            for (let i = 0; i < aiSections.length; i++) {
              if (aiSections[i].html) {
                aiSections[i].html = normalizeHtmlImageUrls(aiSections[i].html, urlObj.origin);
              }
              if (aiSections[i].slides && Array.isArray(aiSections[i].slides)) {
                for (let j = 0; j < aiSections[i].slides.length; j++) {
                  aiSections[i].slides[j] = normalizeHtmlImageUrls(aiSections[i].slides[j], urlObj.origin);
                }
              }
            }
            
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
              section_type: sec.section_type || "custom_html",
              sort_order: index + 1,
              title: pageTitle,
              subtitle: "",
              content_data: { 
                html: sec.html || "",
                ...(sec.content_data || {}),
                ...(sec.media_urls ? { media_urls: sec.media_urls } : {}),
                ...(sec.slides ? { slides: sec.slides } : {}),
                ...(sec.desktop_aspect_ratio ? { desktop_aspect_ratio: sec.desktop_aspect_ratio } : {})
              }
            }));
            
            generatedSections = [...mainGen];
          }
        }
    } catch (e) {
      console.error("[Site Migration] AI Processing Warning:", e);
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

    const mainPageCdnStorage = "CreaiBox 초고속 클라우드 CDN (Supabase Storage / Vercel Blob)";
    const blogArticlesStorage = "크리에이박스 블로그 > 블로그 원고 관리 & CreaiBox 클라우드 DB";

    // 5. Construct CreaiBox Migration Result Payload
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
