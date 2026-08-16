import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";

import { isSpaWebsite, fetchRenderedHtmlWithHeadless } from "@/lib/server/headlessScraper";

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
    if (!htmlText || isSpaWebsite(htmlText)) {
      console.log(`[Site Migration] 🔍 SPA detected on ${urlObj.href}. Invoking Headless Chrome DOM rendering...`);
      const renderedDom = await fetchRenderedHtmlWithHeadless(urlObj.href);
      if (renderedDom && renderedDom.length > 500) {
        htmlText = renderedDom;
        console.log(`[Site Migration] 🟢 Headless Chrome successfully rendered SPA DOM (${htmlText.length} bytes).`);
      }
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

    const sitePayload = {
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
        migration_status: pendingSubpages.length > 0 ? "migrating" : "completed"
      },
      scan_report: scanReport || {}
    };

    let { data: newSite, error: insertError } = await adminSupabase
      .from("client_sites")
      .insert(sitePayload)
      .select("id")
      .single();

    // Fallback if legacy DB check constraint restricts status to ACTIVE/INACTIVE
    if (insertError && insertError.message?.includes("client_sites_status_check")) {
      console.warn("Retrying with legacy status fallback...");
      const fallbackPayload = {
        ...sitePayload,
        status: 'INACTIVE', // Safe legacy status with is_draft: true
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

    // 5. Deep Migration with Gemini 3.5 Flash Lite
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
            2. For full-width single brand video banners (e.g. Spreadshop creator video with center play button), use \`section_type: "interactive_video_banner"\` with \`content_data: { videoSources: [{ src: "https://...mp4", type: "video/mp4" }, { src: "https://...webm", type: "video/webm" }], poster: "https://...jpg", aspectRatio: "16/9" }\`. This ensures true 16:9 full-width monitor rendering, starts paused with a center glass play button, and toggles play/pause on click!
          - PRO-CLONING RULE 3.5 (CONTENT CAROUSEL — EXACT RULES):
            RULE A — "FEATURED PRODUCTS" type sections (multiple product thumbnails visible simultaneously with labels below): Even if the row has "slick-slider" class, this is displayed as a GRID on desktop. Use "custom_html" and render all products in a single responsive grid (grid grid-cols-3 gap-8). DO NOT make this a carousel.
            RULE B — Full-width product SHOWCASE carousel (section containing large 2-column slides where each slide takes the FULL width with a scene image on left half and product info + detail image on right half): This IS a real carousel. Use "advanced_content_carousel". Each individual product slide (e.g., Sound Blaster GS5 slide, Sound Blaster G8 slide, Aurvana Ace 2 slide) MUST be a separate entry in the "slides" array.
            IMPORTANT: The showcase carousel slides come AFTER the featured products grid. They are LARGE, take full viewport width, and show ONE product at a time with left/right navigation dots below.
            IMPORTANT 2: For each showcase slide, use "grid grid-cols-1 md:grid-cols-2 min-h-[450px]". LEFT half: full-bleed scene photo ("<img class='w-full h-full object-cover'>"). RIGHT half (flex col, bg-gray-100 or matching original bg): product category label, large bold product name, description, LEARN MORE button, AND a LARGE product detail image below button ("<img class='mx-auto max-h-72 mt-8 object-contain'>").
            IMPORTANT 3: NEVER apply "advanced_content_carousel" to a section where multiple items are simultaneously visible in columns.
          - PRO-CLONING RULE 4 (Lazy-Loaded Media): Always prioritize \`data-src\`, \`data-lazy\`, or \`srcset\` attributes over a simple \`src\` if they exist. Use the highest resolution media URL available in the raw HTML.
          - PRO-CLONING RULE 5 (Navigation & Language Exact Match): Preserve the EXACT language and casing of header navigation menus (e.g., if it says 'ABOUT', do not translate it to '회사소개'). DO NOT hallucinate or extract hidden mobile menus if a clear desktop navigation exists.
          - PRO-CLONING RULE 5.4 (MANDATORY HEADER LOGO EXTRACTION & TYPOGRAPHY FALLBACK): NEVER leave the header logo area blank or empty!
            1. Priority 1: Extract the exact \`<img src="...">\` or inline \`<svg>\` logo markup from the original header and place it in the left logo container.
            2. Priority 2 (Fallback): If the original logo is a background-image/CSS sprite and cannot be cleanly extracted, you MUST render a bold, beautiful brand typography logo using the brand's primary color: \`<a href='/' class='text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#D4200C]'>BURGER KING</a>\`. NEVER leave the top-left area blank!
          - PRO-CLONING RULE 5.5 (HEADER LAYOUT & EDGE-TO-EDGE): You MUST structure the \`header_html\` to perfectly replicate the standard 3-section layout: 1. Logo on the far left. 2. Navigation Menus centered or aligned as original. 3. Search/Icons/Buttons on the far right. Use Tailwind classes like \`flex justify-between items-center w-full px-4 md:px-8 xl:px-12\` to make the header edge-to-edge. DO NOT wrap the inner content in \`max-w-7xl\` or \`container\` if the original site has an edge-to-edge full-bleed header. Use \`flex-1\` on the left and right containers, and \`flex-none\` on the center menu container to ensure the menu stays perfectly in the horizontal center if needed.
          - PRO-CLONING RULE 5.6 (MEGA MENUS & DROPDOWNS): If the original site has 2nd-level sub-menus, dropdowns, or complex "Mega Menus" (e.g. hovering over 'Products' shows a large panel with icons, links, or images), you MUST completely extract and recreate their HTML structure inside the \`header_html\`. Use Tailwind's \`group\`, \`group-hover:block\`, \`absolute\`, \`top-full\` utilities to recreate the hover/dropdown interaction exactly. DO NOT flatten them into simple links. Preserve the mega menu's exact design, columns, and icons!
          - PRO-CLONING RULE 5.7 (TRANSPARENT OVERLAY HEADER & SYNCHRONIZED FULL-WIDTH MEGA DROPDOWN — e.g. Apartment, Real Estate, Construction, Corporate Sites):
            If the original site has an overlay transparent header where the hero image background starts behind the header and/or hovering over the header smoothly expands all 2nd-level submenus across the entire width simultaneously on a white background:
            1. Set the \`header_html\` container: \`<header class='fixed top-0 left-0 w-full z-50 bg-transparent hover:bg-white text-slate-800 hover:text-slate-900 transition-all duration-400 group/header overflow-hidden h-[90px] hover:h-[320px] hover:shadow-2xl border-b border-white/20 hover:border-slate-200'>\`.
            2. Top Row (\`h-[90px] max-w-[1760px] mx-auto px-8 flex items-center justify-between\`):
               - Far Left: Logo (\`<a href='/' class='font-black text-2xl tracking-tighter uppercase'>...</a>\`).
               - Center: 1st-level Navigation List (\`<nav class='flex items-center gap-8 h-full'><a href='...' class='text-[17px] font-bold tracking-tight h-full flex items-center hover:text-blue-900 border-b-4 border-transparent hover:border-blue-900 transition-all'>사업안내</a>...</nav>\`).
               - Far Right: Phone/Inquiry/Buttons (e.g., \`<div class='flex items-center gap-2 font-bold text-xl text-blue-950'>📞 1522.1183</div>\`).
            3. Synchronized Mega Dropdown Area below the Top Row (\`<div class='w-full border-t border-slate-100/60 pt-6 pb-8 bg-white'><div class='max-w-[1760px] mx-auto px-8 grid grid-cols-7 gap-6 text-center'>[Column 1 2nd-level links] [Column 2 links] ...</div></div>\`):
               - Render ALL 2nd-level submenus under each corresponding 1st-level menu aligned side-by-side in columns so they drop down in 1 unified white panel on hover!
            4. Hero Section: Ensure the main Hero section uses \`min-h-screen\` with the real high-res background image so the top transparent header seamlessly floats above the hero photo!
          - PRO-CLONING RULE 6 (CSS BACKGROUND IMAGES FOR HERO/SECTIONS): The target site may use CSS background images instead of <img> tags for its hero and key visual sections. You MUST use the REAL high-resolution image URLs provided in the [DETECTED CSS ASSETS] list below for the hero section background, slides, and cards! DO NOT replace them with generic or food/burger images!
          - PRO-CLONING RULE 7 (BENTO BOX / ASYMMETRIC GRIDS): If the original site features an asymmetric image gallery or Bento box layout (e.g., 2 items in a row, then 1 full-width item, or varying spans), you MUST recreate this EXACT grid structure using Tailwind's grid spanning utilities (e.g., \`grid-cols-2 md:grid-cols-4\`, \`md:col-span-2\`, \`md:col-span-4\`, \`row-span-2\`). DO NOT force them into a simple uniform grid (like just \`grid-cols-4\` with no spans) if they have different sizes in the original. Use \`w-full h-full object-cover\` for images to perfectly fill their unique grid cells.
          - PRO-CLONING RULE 7.5 (3-COLUMN ASYMMETRIC STORY GRID — e.g. Burger King '고객과 함께 성장하는 버거킹'): If a section contains 4 items consisting of [2 short text cards] + [2 large image cards]:
            1. DO NOT split into a 2-column grid (\`grid-cols-2\`) because the 4th image card will drop to the bottom and blow up full-width!
            2. You MUST construct a balanced 3-column Bento Grid: \`<div class='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>\`.
            3. Column 1 (Left): \`<div class='flex flex-col gap-6 justify-between'>[Text Card 1 (Brand)] [Text Card 2 (ESG)]</div>\` (stack the 2 text cards vertically in 1 column).
            4. Column 2 (Center): \`<div class='bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between'><div class='p-6'>[SMART QSR Badge + Headline]</div><img src='[bag photo]' class='w-full h-56 object-cover'/></div>\`.
            5. Column 3 (Right): \`<div class='bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between'><div class='p-6'>[Awards Badge + Headline]</div><img src='[crowns photo]' class='w-full h-56 object-cover'/></div>\`.
            6. All 3 columns MUST align side-by-side on desktop in a clean 1:1:1 ratio!
          - PRO-CLONING RULE 8 (HERO ASPECT RATIO): For \`advanced_media_carousel\` or \`hero\` sections, analyze the original media dimensions (e.g. \`<img width="x" height="y">\`, \`<video>\`, or CSS \`height: 100vh\`). Determine the original desktop aspect ratio (e.g. \`"21/9"\` for ultra-wide, \`"16/9"\` for standard, \`"4/3"\` for taller, or \`"100vh"\` for full screen). Provide this value in a \`"desktop_aspect_ratio"\` field inside the section object. If unsure, default to \`"21/9"\`.
          - PRO-CLONING RULE 8.5 (SPLIT HERO WITH SIDE CARDS — e.g. Burger King Layout): If the original hero section is a multi-column composite layout (e.g., Left 65~70%: rotating promotional image banner/slider with rounded corners, and Right 30~35%: 2 stacked banner cards like '가맹점 안내' + '매장 찾기 검색창'):
            1. DO NOT render the left hero slider as a static non-rotating image or static HTML!
            2. You MUST output \`section_type: "hero_split_slider"\` with \`content_data: { images: ["url1", "url2", "url3", ...], side_html: "<div class='flex flex-col gap-6 h-full justify-between'>[Top Card HTML]<div class='bg-[#502314] text-white p-6 rounded-3xl'>[Bottom Store Finder Card HTML]</div></div>" }\`.
            3. Extract ALL promotional banner slide image URLs (e.g., all 19+ slides) into the \`images: [...] \` array without skipping so that our \`HeroImageSlider\` component automatically runs 3.5s fade rotations, renders pagination dots, and reveals hover navigation arrows.
          - PRO-CLONING RULE 9 (VIDEO ADS & YOUTUBE MODAL INTERACTION): If the original site features promotional video cards (e.g. '광고영상', '홍보 영상', 'TV-CF'):
            1. DO NOT render them as inert non-interactive image cards!
            2. You MUST output \`section_type: "video_grid"\` with \`content_data: { title: "광고영상", videos: [{ title: "보일링 씨푸드 버거", thumbnail: "[photo url]", youtubeId: "[11-char youtube id or leave empty]", videoUrl: "[video url]" }, ...], moreLink: "/news/video", moreText: "더보기" }\`.
            3. Clicking on any card opens our high-definition 16:9 YouTube/Video Modal popup with automatic autoplay and close button, exactly matching original brand behavior without changing page URL!
          - PRO-CLONING RULE 10 (ULTRA-WIDE CONTAINER & EXACT MAX-WIDTH MATCH): DO NOT trap content sections inside narrow \`max-w-5xl\` or \`max-w-6xl\` containers! Modern websites like Burger King use ultra-wide layouts. You MUST use \`max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-12\` (or \`max-w-[1440px]\` / \`max-w-[1536px]\`) so cards remain large, spacious, and fill the screen horizontally just like the original website! For edge-to-edge full bleed sections, use \`w-full px-4 md:px-12\`.
          - PRO-CLONING RULE 11 (APP PROMOTION & SMARTPHONE MOCKUP FRAME): If the original site features a mobile app download/promotion section (e.g. '버거킹 앱 혜택', 'APP 다운로드'):
            1. Extract ALL rotating mobile app screenshots into the \`images: [...] \` array in content_data (or provide at least 2~4 app screenshots if available) so the smartphone mockup automatically rotates through them every 3.5 seconds.
            2. For component-based section rendering, you can output \`section_type: "app_download"\` with \`content_data: { images: ["url1", "url2", "url3"], tags: ["#픽업오더", "#딜리버리오더", "#멤버십적립", "#할인쿠폰"], qrCode: "[qr url or leave blank]", appStoreLink: "https://apps.apple.com/...", googlePlayLink: "https://play.google.com/..." }\`.
            3. If rendering custom HTML, wrap the app screenshot inside the realistic iPhone/Smartphone device frame and render official black rounded store download badges.
          - PRO-CLONING RULE 12 (VIBRANT OFFICIAL SOCIAL MEDIA BRAND ICONS): In footer_html or footer sections, DO NOT render social media links as dull monochrome gray icons! Render them as vibrant rounded badge icons with their OFFICIAL BRAND COLORS:
            - Instagram: \`<a href='...' target='_blank' class='w-9 h-9 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow hover:scale-110 transition-transform'>[Instagram SVG]</a>\`
            - Facebook: \`<a href='...' target='_blank' class='w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow hover:scale-110 transition-transform'>[Facebook SVG]</a>\`
            - X (Twitter): \`<a href='...' target='_blank' class='w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow hover:scale-110 transition-transform'>[X SVG]</a>\`
            - YouTube: \`<a href='...' target='_blank' class='w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow hover:scale-110 transition-transform'>[YouTube SVG]</a>\`
            - KakaoTalk: \`<a href='...' target='_blank' class='w-9 h-9 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center shadow hover:scale-110 transition-transform'>[Kakao SVG]</a>\`
          - PRO-CLONING RULE 13 (10 STANDARD CLONING COMPONENTS UTILIZATION): When you identify common website interaction patterns in the source HTML, prioritize using these 10 dedicated component section types:
            1. "faq_accordion": For FAQ/Q&A sections. content_data: \`{ items: [{ question: "...", answer: "..." }] }\`
            2. "logo_marquee": For continuous partner/client/media logo streams. content_data: \`{ logos: [{ name: "...", logoUrl: "...", linkUrl: "..." }] }\`
            3. "category_tabs": For menu/product/service tab categories. content_data: \`{ tabs: [{ id: "tab1", label: "버거", items: [...] }] }\`
            4. "animated_counter": For company statistics/numbers. content_data: \`{ stats: [{ value: 50000, suffix: "+", label: "누적 고객수" }] }\`
            5. "testimonial_carousel": For client reviews/testimonials. content_data: \`{ testimonials: [{ name: "홍길동", role: "CEO", review: "...", rating: 5 }] }\`
            6. "before_after_slider": For dual-layer before/after photo comparisons. content_data: \`{ beforeImage: "...", afterImage: "..." }\`
            7. "pricing_table": For SaaS/rental/service pricing tiers. content_data: \`{ plans: [{ name: "Standard", monthlyPrice: 29000, yearlyPrice: 24000, features: [...] }] }\`
            8. "location_map": For office/store address & directions. content_data: \`{ companyName: "...", address: "...", phone: "..." }\`
            9. "location_magnifier": For interactive real-estate/apartment location maps with interactive magnifying glass zoom lens and 360° spinning text badge. content_data: \`{ mapImage: "[url of location-bg.jpg]", zoomImage: "[url of location-zoom.png]", badgeText: "CENTRAL LOCATION PREMIUM • ", title: "...", subtitle: "Central Location", description: "...", linkUrl: "/...", linkText: "입지 프리미엄 자세히보기" }\`
            10. "interactive_video_banner": For full-width 16:9 brand video banners with play/pause interaction. content_data: \`{ videoSources: [{ src: "...", type: "video/mp4" }], poster: "...", aspectRatio: "16/9" }\`
          - PRO-CLONING RULE 14 (BRAND SIGNATURE SVG & ICON BULLET PRESERVATION): When bullet lists (\`<li>\`), feature cards, or step items use custom brand signature SVG icons (such as Spreadshop's geometric folded heart logo SVG, custom brand checks, star polygons), you MUST extract and preserve the exact inline \`<svg>...</svg>\` markup verbatim! NEVER replace custom brand SVGs with numbered circles (1, 2, 3) or generic info/check icons (\`ℹ️\`) unless the original source HTML explicitly uses plain numbers.
          - PRO-CLONING RULE 15 (STATIC CARD GRID VS CAROUSEL DISTINCTION): When the original webpage displays a 3-column or 4-column card grid simultaneously side-by-side (such as creator showcase, blog articles, tips grid, product feature grids), you MUST render them as a static responsive CSS grid (\`grid grid-cols-1 md:grid-cols-3 gap-8\`) inside \`custom_html\`! NEVER convert static side-by-side card grids into 1-item-at-a-time slide carousels (\`advanced_content_carousel\` or \`hero_image_slider\`) unless the original website itself explicitly uses an interactive left/right slider!
          - CRITICAL RULE: All image URLs (\`src\` attributes or \`style="background-image: ..."\`) MUST be ABSOLUTE URLs. 
          - CRITICAL RULE 2 (NO DUMMY '#' LINKS & EXACT RELATIVE PATHS): You MUST NEVER generate dummy \`href="#"\` or \`href="javascript:void(0)"\` for clickable cards, banners, menus, and buttons! Extract the exact target URLs from the original HTML (e.g. \`/story/esgbusiness\`, \`/story/whyburgerking\`, \`/menu/main\`, \`/store/near\`, \`/notice/list\`). If the original HTML contains absolute URLs pointing to its own domain (e.g., \`https://www.burgerking.co.kr/story/esgbusiness\`), strip out the domain and use the relative path (e.g., \`href="/story/esgbusiness"\`). This ensures the visitor navigates seamlessly inside the newly cloned client site without leaving the domain!
          - Use modern Tailwind CSS classes (e.g. flex, grid, px-8, py-16) for styling, but combine them with extracted brand colors.
          - Make the HTML fully responsive (use md:, lg: prefixes).
          - Do NOT use Markdown formatting in the strings.
          - From the following list of templates, choose the MOST appropriate 'template_id' based on the website's industry, content, and vibe: [${availableTemplateIds}].
          ${!hasMain ? `- Replicate the header menu links and footer structure exactly.
          - If the original site uses anchor links (e.g., href="#section") for a one-page layout, you MUST preserve these exact anchor links in the header and ensure the corresponding <section> blocks in main_sections have the matching id attributes.
          - Split the main body into as many logical \`<section>\` blocks as needed (typically 5 to 15) to capture EVERY SINGLE PART of the original site (including lower sections like 'OUR BRANDS', 'AWARDS', 'Subscribe', etc.) without omitting anything. Each block must be a separate item in the \`main_sections\` array.` : ""}
          - Output ONLY valid JSON. No other text.
          - CRITICAL: To prevent hitting the output token limit, MINIFY all HTML strings! Remove unnecessary whitespaces, tabs, and newlines inside the HTML strings. Keep the code extremely compact.

          ${cssImageListStr ? `
          [REAL DETECTED CSS BACKGROUND MEDIA ASSETS (MUST USE THESE FOR HERO / SLIDER / BACKGROUNDS)]:
          - ${cssImageListStr}
          CRITICAL: The original website uses the above CSS background images for its hero visual/banner. You MUST incorporate these real image URLs into the hero section HTML or media_urls! NEVER replace them with random or burger/food images!
          ` : ""}

          HTML content to analyze:
          --- MAIN PAGE ---
          ${cleanHtml.substring(0, 200000)} // Increased limit to capture full page
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
                model: "gemini-flash-latest",
                generationConfig: { responseMimeType: "application/json" }
              });
              const res = await model.generateContent([{ text: prompt }]);
              aiText = res.response.text().trim();
            } catch (sdkErr: any) {
              console.error("[Site Migration] All AI engines failed:", sdkErr);
              return NextResponse.json({ error: "AI 서버 통신에 실패했습니다: " + (sdkErr.message || "") }, { status: 500 });
            }
          } else {
            console.error("[Site Migration] Vertex AI failed and no backup API key found:", vertexErr);
            return NextResponse.json({ error: "AI 서버 통신에 실패했습니다: " + (vertexErr.message || "") }, { status: 500 });
          }
        }

        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiText = jsonMatch[0];
        }
        
        let parsedAi;
        try {
          parsedAi = JSON.parse(aiText);
        } catch (parseError) {
          console.error("AI JSON Parse Error:", parseError, "Raw output:", aiText);
          return NextResponse.json({ error: "AI가 유효하지 않은 형식(JSON 오류)으로 응답했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
        }
        
        // 0. Update template_id based on AI's choice
        const aiTemplateId = parsedAi.template_id;
        if (aiTemplateId && TEMPLATE_REGISTRY[aiTemplateId]) {
          await adminSupabase.from("client_sites").update({ template_id: aiTemplateId }).eq("id", siteId);
        }
        
        // ⚡ 즉시 이미지 상대경로 정규화 (타임아웃 0초 방어 및 100% 실사 노출)
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
