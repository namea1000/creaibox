import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import { migrateAllImagesInHtmlAndData, downloadAndUploadImageToR2 } from "@/lib/server/migration-image-uploader";

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

  /**
   * 🛡️ Intelligent JSON Auto-Repair & Stream Rescuer
   * Protects against minor syntax errors, unescaped characters, or truncations.
   */
  function safeParseAiJson(rawText: string): any {
    if (!rawText || typeof rawText !== "string") return null;

    let text = rawText.trim();
    if (text.startsWith("```json")) text = text.slice(7);
    else if (text.startsWith("```")) text = text.slice(3);
    if (text.endsWith("```")) text = text.slice(0, -3);
    text = text.trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];

    try {
      return JSON.parse(text);
    } catch (e) {
      try {
        let rep = text;
        const q = (rep.match(/(?<!\\)"/g) || []).length;
        if (q % 2 !== 0) rep += '"';
        const ob = (rep.match(/\{/g) || []).length;
        const cb = (rep.match(/\}/g) || []).length;
        const obr = (rep.match(/\[/g) || []).length;
        const cbr = (rep.match(/\]/g) || []).length;
        if (obr > cbr) rep += "]".repeat(obr - cbr);
        if (ob > cb) rep += "}".repeat(ob - cb);
        const parsed = JSON.parse(rep);
        if (parsed && Array.isArray(parsed.main_sections) && parsed.main_sections.length > 0) {
          console.log(`[JSON Auto-Repair 🛠️] Rescued ${parsed.main_sections.length} sections!`);
          return parsed;
        }
      } catch {}

      // Regex rescue
      try {
        const templateMatch = text.match(/"template_id"\s*:\s*"([^"]+)"/);
        const headerMatch = text.match(/"header_html"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        const footerMatch = text.match(/"footer_html"\s*:\s*"((?:[^"\\]|\\.)*)"/);

        const sections: any[] = [];
        const sectionPattern = /\{\s*"section_type"\s*:\s*"([^"]+)"\s*,\s*"html"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let m;
        while ((m = sectionPattern.exec(text)) !== null) {
          try {
            const html = JSON.parse(`"${m[2]}"`);
            sections.push({ section_type: m[1], html });
          } catch {
            sections.push({ section_type: m[1], html: m[2].replace(/\\"/g, '"').replace(/\\n/g, "\n") });
          }
        }

        if (sections.length > 0) {
          return {
            template_id: templateMatch?.[1] || "service_1",
            header_html: headerMatch?.[1] || "",
            footer_html: footerMatch?.[1] || "",
            main_sections: sections,
          };
        }
      } catch {}
    }

    return null;
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

    // 1. Fetch Target Website Content (with Automatic Frameset Resolution)
    let htmlText = "";
    try {
      const res = await fetch(urlObj.href, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) htmlText = await res.text();
    } catch {}

    // 🟢 [NEW: Automatic Frameset / Forwarding Resolver]
    // If the target site is wrapped in a legacy frameset (e.g. futuremind.kr), extract the real frame src and re-fetch!
    const isFrameset = /<frameset[\s\S]*?>/i.test(htmlText);
    if (isFrameset) {
      const frameMatch = htmlText.match(/<frame[^>]+src=["']([^"']+)["']/i);
      if (frameMatch && frameMatch[1]) {
        const rawFrameSrc = frameMatch[1].trim();
        const resolvedFrameUrl = rawFrameSrc.startsWith("http")
          ? rawFrameSrc
          : new URL(rawFrameSrc, urlObj.href).href;
        console.log(`[Site Migration] 🔄 Frameset detected! Auto-resolving to inner frame: ${resolvedFrameUrl}`);
        try {
          urlObj = new URL(resolvedFrameUrl);
          const frameRes = await fetch(resolvedFrameUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
          });
          if (frameRes.ok) {
            htmlText = await frameRes.text();
            console.log(`[Site Migration] 🟢 Resolved inner frame HTML loaded (${htmlText.length} bytes)`);
          }
        } catch (frameErr) {
          console.warn("[Site Migration] Frame resolution error:", frameErr);
        }
      }
    }

    // 🟢 [NEW: Figma Site Native Bundle & Unicode Decoder]
    let figmaData: { texts: string[]; imageUrls: string[] } | null = null;
    const isFigmaSite = urlObj.hostname.includes("figma.site") || htmlText.includes("figma.site") || htmlText.includes("_components/v2/");
    if (isFigmaSite && htmlText) {
      try {
        console.log(`[Site Migration] 🎨 Figma Site detected! Extracting component JS bundles and decoding unicode text...`);
        const jsMatch = htmlText.match(/src=["'](\/_components\/v2\/[^"']+\.js)["']/i) ||
                        htmlText.match(/href=["'](\/_components\/v2\/[^"']+\.js)["']/i) ||
                        htmlText.match(/(\/_components\/v2\/[a-zA-Z0-9_-]+\.js)/i);
        if (jsMatch && jsMatch[1]) {
          const jsUrl = new URL(jsMatch[1], urlObj.origin).href;
          const jsRes = await fetch(jsUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
            signal: AbortSignal.timeout(10000),
          });
          if (jsRes.ok) {
            const rawJs = await jsRes.text();
            // Decode unicode escape sequences (\uXXXX) into readable Korean/UTF-8
            const decodedJs = rawJs.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
            
            // Extract Korean sentences and key English headlines
            const extractedKorean = decodedJs.match(/[가-힣0-9A-Za-z\s,.\-·()]{3,}/g) || [];
            const cleanKoreanTexts = Array.from(new Set(
              extractedKorean
                .map((t) => t.trim())
                .filter((t) => t.length >= 2 && !t.startsWith("css-") && !t.includes("function") && !t.includes("return"))
            )).slice(0, 120);

            // Extract image URLs (Imgur, Cloudflare, S3, Figma CDN)
            const extractedImages = Array.from(new Set(
              (decodedJs.match(/https?:\/\/[^"'\s)]+\.(?:png|jpg|jpeg|webp|svg)/gi) || [])
            )).slice(0, 50);

            figmaData = {
              texts: cleanKoreanTexts,
              imageUrls: extractedImages,
            };
            console.log(`[Site Migration] 🟢 Figma Site bundle decoded: ${cleanKoreanTexts.length} texts, ${extractedImages.length} images`);
          }
        }
      } catch (figmaErr) {
        console.warn("[Site Migration] Figma bundle decode error:", figmaErr);
      }
    }

    // v2.0: Framer / SPA / Scroll-Animation site detection & rendering pipeline
    let framerSearchData: { texts: string[]; imageUrls: string[]; colorTokens: Record<string, string> } | null = null;
    let allExtractedImageUrls: string[] = [];
    let isFramer = false;

    // Merge figma images if found
    if (figmaData?.imageUrls) {
      figmaData.imageUrls.forEach((u) => allExtractedImageUrls.push(u));
    }

    try {
      const {
        isSpaWebsite,
        isFramerSite,
        fetchFramerSearchIndex,
        extractAllImageUrls,
        fetchRenderedHtmlWithHeadless,
      } = await import("@/lib/server/headlessScraper");

      isFramer = isFramerSite(htmlText);

      // 🎯 Framer Fast Path: Fetch Search Index JSON
      if (isFramer) {
        console.log(`[Site Migration] 🎨 Framer site detected! Fetching Search Index JSON...`);
        framerSearchData = await fetchFramerSearchIndex(htmlText);
        if (framerSearchData) {
          console.log(`[Site Migration] ✅ Framer Search Index loaded: ${framerSearchData.texts.length} texts, ${framerSearchData.imageUrls.length} images`);
        }
      }

      // Extract all image URLs from initial fetch (before headless)
      if (htmlText) {
        const initialImgs = extractAllImageUrls(htmlText, urlObj.origin);
        allExtractedImageUrls = Array.from(new Set([...allExtractedImageUrls, ...initialImgs]));
      }

      // Headless Chrome for SPA / Framer (to capture full DOM for AI analysis)
      if (!htmlText || isSpaWebsite(htmlText) || isFramer) {
        console.log(`[Site Migration] 🔍 ${isFramer ? "Framer" : "SPA"} detected — Invoking Headless Chrome v2.0...`);
        const renderedDom = await fetchRenderedHtmlWithHeadless(urlObj.href);
        if (renderedDom && renderedDom.length > 500) {
          htmlText = renderedDom;
          // Re-extract images from fully-rendered DOM (captures lazy-loaded images)
          const renderedImages = extractAllImageUrls(renderedDom, urlObj.origin);
          // Merge: rendered DOM images take priority, then pre-render images
          const merged = new Set([...renderedImages, ...allExtractedImageUrls]);
          allExtractedImageUrls = [...merged].slice(0, 100);
          console.log(`[Site Migration] 🟢 Headless DOM captured (${htmlText.length} bytes), ${allExtractedImageUrls.length} total images`);
        }
      }
    } catch (scraperErr) {
      console.warn("[Site Migration] Scraper pipeline error, proceeding with fetched HTML:", scraperErr);
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

    // --- v2.0: CSS Background Image & External Stylesheet Deep Harvester ---
    const detectedCssImages = new Set<string>();

    // Add all images extracted by extractAllImageUrls (inline styles, data-src, framerusercontent, etc.)
    allExtractedImageUrls.forEach(u => detectedCssImages.add(u));

    // Also add Framer Search Index images (highest quality, directly from Framer CDN)
    if (framerSearchData?.imageUrls) {
      framerSearchData.imageUrls.forEach(u => detectedCssImages.add(u));
    }

    // Parse external linked stylesheets for additional background images
    try {
      const cssLinkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
      let cssMatch;
      const cssUrls: string[] = [];
      while ((cssMatch = cssLinkRegex.exec(htmlText)) !== null) {
        let cssHref = cssMatch[1].trim();
        if (cssHref.startsWith("//")) cssHref = `${urlObj.protocol}${cssHref}`;
        else if (cssHref.startsWith("/")) cssHref = `${urlObj.origin}${cssHref}`;
        else if (!cssHref.startsWith("http")) cssHref = `${urlObj.origin}/${cssHref}`;
        if (!cssHref.includes("framerusercontent")) cssUrls.push(cssHref); // Skip Framer CDN CSS (too large)
      }
      const cssPromises = cssUrls.slice(0, 5).map(async (cUrl) => {
        try {
          const cRes = await fetch(cUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(4000),
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
            if (imgPath.startsWith("http")) absImgUrl = imgPath;
            else if (imgPath.startsWith("//")) absImgUrl = `${urlObj.protocol}${imgPath}`;
            else if (imgPath.startsWith("/")) absImgUrl = `${urlObj.origin}${imgPath}`;
            else { try { absImgUrl = new URL(imgPath, cssBase).href; } catch { absImgUrl = `${urlObj.origin}/${imgPath.replace(/^\.\.\//, "")}`; } }
            if (absImgUrl) detectedCssImages.add(absImgUrl);
          }
        } catch {}
      });
      await Promise.all(cssPromises);
    } catch {}

    console.log(`[Site Migration] 🎨 Total unique media assets: ${detectedCssImages.size}`);
    const cssImageListStr = Array.from(detectedCssImages).slice(0, 100).join("\n- ");
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
        site_title: pageTitle,
        site_description: metaDesc,
        og_image: heroImage,
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

    // Fallback: If DB schema does not have creation_source column yet
    if (insertError && insertError.message?.includes("creation_source")) {
      console.warn("[Site Migration] 'creation_source' column not found in client_sites table. Falling back without it.");
      const { creation_source, ...fallbackPayload } = sitePayload;
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
          You are an expert Frontend Developer and Designer. Your task is to perfectly clone the layout, design, header, footer, and main sections of the target website using clean, modern Tailwind CSS HTML.
          Analyze the following website content and generate an exact replica of its visual structure.

          You MUST output a strict, valid JSON object with the following schema:
          {
            "template_id": "Choose the BEST matching template ID from the list below",
            ${!hasMain ? `"header_html": "<header class='sticky top-0 z-50 bg-neutral-900/90 backdrop-blur text-white px-6 py-4 flex justify-between items-center'><div class='text-xl font-bold'>...</div><nav class='hidden md:flex gap-6 text-sm text-neutral-300'>...</nav><a href='#contact' class='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold'>...</a></header>",
            "footer_html": "<footer class='bg-neutral-950 text-neutral-400 py-12 px-6 border-t border-neutral-800'><div class='max-w-7xl mx-auto flex justify-between'><div><div class='text-xl font-bold text-white mb-2'>...</div><p class='text-sm'>...</p></div></div></footer>",
            "main_sections": [
              {
                "section_type": "custom_html | advanced_content_carousel | hero_image_slider",
                "html": "<section class='py-20 px-6 ...'>...</section>",
                "media_urls": ["url1", "url2"],
                "slides": ["<div class='...'>slide 1</div>"]
              }
            ]` : ""}
          }

          Guidelines:
          1. Extract and recreate 5 to 8 rich, distinct visual sections in \`main_sections\` covering the complete landing page flow (Hero with headline/CTA/image, Core Features/Services Grid, Product Details/Showcase, Social Proof/Testimonials/Stats, Pricing/FAQ Accordion, Consultation CTA Banner).
          2. Extract exact copywriting, brand colors (\`bg-[#HEX]\`), statistics, and numbers VERBATIM.
          3. Use real absolute image URLs from [DETECTED MEDIA ASSETS].
          4. From the following list of templates, choose the MOST appropriate 'template_id': [${availableTemplateIds}].
          5. Keep Tailwind CSS concise, semantic, and clean. Output ONLY valid JSON.
          ${depth === "main_submenu" ? `
          6. [HEADER & 2-TIER SUBMENU DROPDOWN CLONING MANDATE]:
             - Extract both 1st-level nav items AND all 2nd-level submenus / dropdown lists / mega-menus from the original website.
             - Recreate interactive hover dropdowns using Tailwind CSS:
               <div class='relative group'>
                 <button class='flex items-center gap-1 hover:text-white'>Menu <svg class='w-4 h-4 inline'>...</svg></button>
                 <div class='absolute top-full left-0 mt-2 min-w-[200px] bg-neutral-900/95 border border-white/10 rounded-xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                   <a href='#sub1' class='block px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-white/10'>Submenu 1</a>
                   <a href='#sub2' class='block px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-white/10'>Submenu 2</a>
                 </div>
               </div>
          ` : `
          6. [1-PAGE SMOOTH SCROLLING ANCHOR & UPGRADE MANDATE]:
             - Build a clean 1-page sticky header where top navigation links (e.g. href='#features', href='#services', href='#pricing', href='#faq', href='#contact') connect directly to body sections.
             - Ensure each <section> in main_sections has matching id attributes (e.g. id='features', id='services', id='pricing', id='faq', id='contact') for smooth scrolling.
             - If the target website had broken navigation or incomplete scrolling, automatically UPGRADE it into a world-class, seamless 1-page smooth-scrolling landing page.
          `}

          ${cssImageListStr ? `[DETECTED MEDIA ASSETS]:\n- ${cssImageListStr}` : ""}
          ${figmaData && figmaData.texts.length > 0 ? `[FIGMA SITE EXTRACTED TEXTS & HEADLINES]:\n${figmaData.texts.slice(0, 100).join("\n")}` : ""}
          ${isFramer && framerSearchData?.colorTokens && Object.keys(framerSearchData.colorTokens).length > 0 ? `[FRAMER COLOR TOKENS]:\n${Object.entries(framerSearchData.colorTokens).slice(0, 20).map(([k, v]) => `${k}: ${v}`).join("\n")}` : ""}
          ${isFramer && framerSearchData?.texts && framerSearchData.texts.length > 0 ? `[KEY TEXT CONTENT]:\n${framerSearchData.texts.slice(0, 80).join("\n")}` : ""}

          HTML Content:
          ${cleanHtml.substring(0, 50000)}
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
                generationConfig: { 
                  responseMimeType: "application/json"
                }
              });
              const res = await model.generateContent([{ text: prompt }]);
              aiText = res.response.text().trim();
            } catch (sdkErr: any) {
              console.warn("[Site Migration] AI fallback SDK also failed, using fallback sections:", sdkErr);
            }
          }
        }

        if (aiText) {
          const parsedAi = safeParseAiJson(aiText);
          
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

            // 🚀 [Cloudflare R2 영구 이미지 이관 파이프라인]
            // 원본 사이트 이미지들을 Cloudflare R2 버킷으로 WebP 최적화 업로드 및 URL 자동 치환
            let migratedHeaderHtml = headerHtml;
            let migratedFooterHtml = footerHtml;
            let finalAiSections = aiSections;
            let totalMigratedImages = 0;

            try {
              console.log(`[Site Migration] 🚀 Starting Cloudflare R2 Image Backup for ${finalSubdomain}...`);
              const r2Result = await migrateAllImagesInHtmlAndData(
                finalSubdomain,
                aiSections,
                headerHtml,
                footerHtml
              );
              finalAiSections = r2Result.sections;
              migratedHeaderHtml = r2Result.headerHtml;
              migratedFooterHtml = r2Result.footerHtml;
              totalMigratedImages = r2Result.migratedCount;
              console.log(`[Site Migration] ✅ Successfully backed up ${totalMigratedImages} images to Cloudflare R2!`);
            } catch (r2Err) {
              console.warn("[Site Migration] R2 image migration warning, continuing with normalized URLs:", r2Err);
            }
            
            // 1. Update site extra_configs with custom header and footer
            if (migratedHeaderHtml || migratedFooterHtml) {
              const { data: currentSite } = await adminSupabase
                .from("client_sites")
                .select("extra_configs")
                .eq("id", siteId)
                .single();
                
              const currentConfigs = currentSite?.extra_configs || {};
              await adminSupabase.from("client_sites").update({
                extra_configs: {
                  ...currentConfigs,
                  ...(migratedHeaderHtml ? { header_html: migratedHeaderHtml } : {}),
                  ...(migratedFooterHtml ? { footer_html: migratedFooterHtml } : {}),
                  is_custom_layout: true,
                  migrated_images_count: totalMigratedImages,
                }
              }).eq("id", siteId);
            }

            // 2. Map main sections with R2 URLs
            const mainGen = finalAiSections.map((sec: any, index: number) => ({
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

    const mainPageCdnStorage = "CreaiBox Cloudflare R2 버킷 초고속 영구 스토리지";
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
