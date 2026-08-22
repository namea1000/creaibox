import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import { checkStaticReservedBrand } from "@/lib/constants/reservedBrandsStatic";

export const maxDuration = 300;

/**
 * 🚀 AI SNS/블로그 기반 사이트 자동 창작 엔진
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
    const uniqueUrls = Array.from(new Set(urls)).filter(u => u.match(/\.(jpeg|jpg|gif|png|svg|webp)/i) || u.includes("images.unsplash.com") || u.includes("source.unsplash.com") || u.includes("loremflickr.com") || u.includes("drive.google.com"));

    const uploadPromises = uniqueUrls.map(async (url) => {
      try {
        let fetchUrl = url;
        
        // 1순위: Unsplash 정식 API 연동 (AI가 생성한 가짜 source.unsplash.com 주소 가로채기)
        if (url.includes("source.unsplash.com")) {
          const keywordMatch = url.match(/\?([^&"']+)/);
          const keyword = keywordMatch ? keywordMatch[1] : "business";
          const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
          
          if (unsplashAccessKey) {
            try {
              const apiRes = await fetch(`https://api.unsplash.com/photos/random?query=${keyword}`, {
                headers: { "Authorization": `Client-ID ${unsplashAccessKey}` }
              });
              if (apiRes.ok) {
                const data = await apiRes.json();
                if (data && data.urls && data.urls.regular) {
                  fetchUrl = data.urls.regular;
                }
              } else {
                fetchUrl = `https://loremflickr.com/800/600/${keyword}`;
              }
            } catch (e) {
              console.error("Unsplash API fetch failed, falling back to loremflickr", e);
              fetchUrl = `https://loremflickr.com/800/600/${keyword}`;
            }
          } else {
             fetchUrl = `https://loremflickr.com/800/600/${keyword}`;
          }
        }

        const res = await fetch(fetchUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) {
          const fallbackUrl = "https://placehold.co/800x600/f8fafc/94a3b8?text=Image";
          newHtml = newHtml.split(url).join(fallbackUrl);
          return;
        }
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
            const sharp = (await import("sharp")).default;
            finalBuffer = await sharp(buffer)
              .resize({ width: 1920, withoutEnlargement: true }) // 리사이징 추가: 최대 가로 1920px 제한
              .webp({ quality: 80 })
              .toBuffer();
            finalContentType = "image/webp";
            finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
          } catch (err) {
            console.warn(`Sharp WebP conversion failed for ${url}, falling back to original:`, err);
          }
        }
        
        const s3Key = `sites/migrated-sites/${siteId}/${Date.now()}_${finalFileName}`;

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
        const fallbackUrl = "https://placehold.co/800x600/f8fafc/94a3b8?text=Image";
        newHtml = newHtml.split(url).join(fallbackUrl);
      }
    });

    await Promise.all(uploadPromises);
    return newHtml;
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const formData = await request.formData();
    const vibe = formData.get("vibe") as string || "auto";
    const themeId = formData.get("themeId") as string || "ai-auto";
    const refType = formData.get("refType") as string || "none";
    const refText = formData.get("refText") as string || "";
    const refPdf = formData.get("refPdf") as File | null;
    const urls = formData.getAll("urls") as string[];

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const validUrls = urls.filter(u => u.trim() !== "");
    if (validUrls.length === 0 && refType === "none") {
      return NextResponse.json({ error: "올바른 홈페이지 URL을 1개 이상 입력하시거나 참조 자료를 첨부해 주세요." }, { status: 400 });
    }

    let urlObjs: URL[] = [];
    try {
      urlObjs = validUrls.map(u => new URL(u.startsWith("http") ? u : `https://${u}`));
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL 형식이 포함되어 있습니다." }, { status: 400 });
    }

    // 1. Fetch all Target Websites concurrently
    let combinedCleanHtml = "";
    let combinedExtraContent = "";
    const realImageUrls: string[] = [];
    let pageTitle = "";

    await Promise.all(urlObjs.map(async (urlObj, idx) => {
      try {
        const isNaverPlace = urlObj.hostname.includes("map.naver.com") || urlObj.hostname.includes("place.naver.com");
        // Naver Place requires Mobile UA to return full SSR HTML
        const ua = isNaverPlace 
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
          : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

        let htmlText = "";
        try {
          const res = await fetch(urlObj.href, { headers: { "User-Agent": ua } });
          if (res.ok) {
            htmlText = await res.text();
          }
        } catch {}

        // Check if SPA
        const { isSpaWebsite, fetchRenderedHtmlWithHeadless } = await import("@/lib/server/headlessScraper");
        if (!htmlText || isSpaWebsite(htmlText)) {
          console.log(`[AI Magic Builder] 🔍 SPA detected on ${urlObj.href}. Invoking Headless Chrome...`);
          const renderedDom = await fetchRenderedHtmlWithHeadless(urlObj.href);
          if (renderedDom && renderedDom.length > 500) {
            htmlText = renderedDom;
          }
        }

        if (!htmlText) return;
        
        // 2. Clean HTML for Gemini
        const cleanHtml = htmlText
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
          .replace(/<!--[\s\S]*?-->/g, "");
          
        combinedCleanHtml += `\n\n=== SOURCE ${idx + 1} (${urlObj.href}) ===\n${cleanHtml}`;

        if (!pageTitle) {
          const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
          const rawPageTitle = titleMatch ? titleMatch[1].trim() : urlObj.hostname;
          pageTitle = rawPageTitle
            .replace(/\s*:\s*네이버 블로그$/i, "")
            .replace(/\s*-\s*네이버 블로그$/i, "")
            .replace(/\s*\|\s*네이버 블로그$/i, "")
            .replace(/\s*:\s*네이버 플레이스$/i, "")
            .replace(/\s*-\s*네이버 지도$/i, "")
            .replace(/\s*:\s*Tistory$/i, "")
            .replace(/\s*-\s*Instagram$/i, "")
            .replace(/\s*\(@[^)]+\)\s*•\s*Instagram.*$/i, "")
            .replace(/\s*\|.*블로그.*$/i, "")
            .trim() || urlObj.hostname;
        }

        const paths = urlObj.pathname.split("/").filter(Boolean);

        // 메인 HTML에서 og:image 수집
        const ogImgMatches = [...htmlText.matchAll(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi)];
        for (const m of ogImgMatches) {
          if (m[1] && m[1].startsWith("http")) realImageUrls.push(m[1]);
        }
        // 메인 HTML에서 일반 img src 수집
        const imgSrcMatches = [...htmlText.matchAll(/src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)["']/gi)];
        for (const m of imgSrcMatches.slice(0, 15)) {
          if (m[1] && !m[1].includes("icon") && !m[1].includes("logo") && !m[1].includes("btn") && !m[1].includes("blank")) {
            realImageUrls.push(m[1]);
          }
        }

        // 네이버 블로그 전용 RSS 크롤링
        if (urlObj.hostname === "blog.naver.com" && paths.length > 0) {
          try {
            const blogId = paths[0];
            const rssRes = await fetch(`https://rss.blog.naver.com/${blogId}.xml`, {
              headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" }
            });
            if (rssRes.ok) {
              const rssText = await rssRes.text();
              const itemMatches = [...rssText.matchAll(/<item>[\s\S]*?<\/item>/gi)].slice(0, 5);
              const blogPosts: string[] = [];
              for (const item of itemMatches) {
                const titleM = item[0].match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/);
                const descM = item[0].match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
                const enclosureM = item[0].match(/<enclosure[^>]+url=["']([^"']+)["']/i);
                if (enclosureM && enclosureM[1]) realImageUrls.push(enclosureM[1]);
                if (descM) {
                  const descImgs = [...descM[1].matchAll(/src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)];
                  for (const di of descImgs.slice(0, 3)) {
                    if (di[1]) realImageUrls.push(di[1]);
                  }
                }
                if (titleM) blogPosts.push(`[포스트 제목] ${titleM[1].trim()}`);
                if (descM) blogPosts.push(`[포스트 내용 요약] ${descM[1].replace(/<[^>]+>/g, "").trim().substring(0, 600)}`);
              }
              if (blogPosts.length > 0) {
                combinedExtraContent += `\n\n=== 네이버 블로그 최근 포스트 내용 (추가 참조 자료) ===\n${blogPosts.join("\n")}`;
              }
            }
          } catch (rssErr) {
            console.warn("Naver Blog RSS crawl failed:", rssErr);
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch ${urlObj.href}:`, e);
      }
    }));

    if (refType === "text" && refText) {
      combinedExtraContent += `\n\n=== 추가 참조 텍스트 자료 ===\n${refText}`;
      if (!pageTitle) pageTitle = refText.substring(0, 15).trim() + " 홈페이지";
    }

    if (refType === "pdf" && refPdf) {
      try {
        const arrayBuffer = await refPdf.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfParse = (await import("pdf-parse")) as any;
        const pdfData = await (pdfParse.default || pdfParse)(buffer);
        combinedExtraContent += `\n\n=== 추가 참조 PDF 문서 자료 ===\n${pdfData.text}`;
        if (!pageTitle) {
          const pdfTitle = refPdf.name.replace(/\.pdf$/i, "");
          pageTitle = pdfTitle + " 홈페이지";
        }
      } catch (err) {
        console.error("PDF Parsing error:", err);
      }
    }

    if (!pageTitle) pageTitle = "My Business";
    // 중복 제거 및 최대 20개 이미지 URL 준비
    const uniqueRealImages = [...new Set(realImageUrls)].slice(0, 20);
    const realImagesPromptSection = uniqueRealImages.length > 0
      ? `\n\n=== 여러 출처에서 추출한 실제 대표 이미지/메뉴/매장 사진 URL 목록 (이 이미지들을 최우선으로 사용하라) ===\n${uniqueRealImages.map((u, i) => `이미지${i + 1}: ${u}`).join("\n")}\n위 이미지들을 src 또는 background-image에 직접 사용하라. source.unsplash.com 플레이스홀더보다 이 실제 이미지를 항상 우선시하라.`
      : "";

    // 3. Generate Subdomain Name
    let rawHostname = urlObjs[0] ? urlObjs[0].hostname.replace(/^www\./, "").split(".")[0] : "mysite";
    const firstUrlPaths = urlObjs[0] ? urlObjs[0].pathname.split("/").filter(Boolean) : [];
    
    // Fallbacks for DB
    const address = "";
    const phoneNumber = "";
    const metaDesc = `${pageTitle} 공식 홈페이지`;
    const heroImage = uniqueRealImages[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";

    // Extract actual user ID from popular SNS/Blog URLs
    if (urlObjs[0]) {
      if (["instagram", "facebook", "tiktok", "x", "twitter", "threads", "youtube", "tistory"].includes(rawHostname) && firstUrlPaths.length > 0) {
        rawHostname = firstUrlPaths[0].replace(/[@]/g, "");
      } else if (urlObjs[0].hostname === "blog.naver.com" && firstUrlPaths.length > 0) {
        rawHostname = firstUrlPaths[0];
      }
    }

    const cleanSubdomain = rawHostname.toLowerCase().replace(/[^a-z0-9-]/g, "") || "mysite";

    // 4. DB Insert - Real Data saving with DRAFT status & Random 4-character Preview Subdomain
    const adminSupabase = await createAdminClient();

    let finalSubdomain = "";
    let isUnique = false;
    
    while (!isUnique) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const checkDomain = `${cleanSubdomain}-${randomSuffix}`;
      let isReserved = checkStaticReservedBrand(checkDomain).blocked;
      
      if (!isReserved) {
        const { data: dbRes } = await adminSupabase
          .from("reserved_brand_ids")
          .select("id")
          .eq("brand_id", checkDomain)
          .maybeSingle();
        if (dbRes) isReserved = true;
      }

      if (isReserved) continue;

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
      template_id: themeId !== 'ai-auto' ? themeId : 'service_1',
      theme_vibe: vibe,
      creation_source: 'sns_builder',
      extra_configs: {
        target_slug: cleanSubdomain,
        is_draft: true,
        site_title: pageTitle,
        site_description: metaDesc,
        og_image: heroImage,
      }
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
        status: 'INACTIVE',
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

    // 5. Deep Generation with Gemini (Vertex AI Multi-Region Failover)
    let generatedSections: any[] = [];
    try {
      const { generateContentWithVertexAI } = await import("@/lib/server/vertex-ai-gemini");
      const availableTemplateIds = Object.keys(TEMPLATE_REGISTRY).join(", ");
        
        // 분위기(Vibe)에 따른 구체적인 디자인/레이아웃 지시사항 생성
        let vibeDesignInstructions = "";
        
        const VIBE_INSTRUCTIONS: Record<string, string> = {
          // 1. 미니멀/모던
          modern_auto: "[미니멀 & 모던 계열] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 무채색, 화이트톤, 또는 격자형 그리드 등 미니멀리즘과 관련된 세부 레이아웃을 AI가 스스로 판단하여 가장 아름답게 구성하라.",
          modern_clean: "모던하고 세련된 스타일: 인테리어나 뷰티샵처럼 세련된 무채색(블랙/화이트/그레이) 중심, 세련된 카드형 갤러리 그리드, 부드러운 그림자(shadow-lg), 시선을 사로잡는 강력한 헤드라인 텍스트를 사용하라.",
          modern_white: "클린 & 화이트 스타일: 배경을 완전한 화이트톤으로 유지하고 선과 폰트만으로 승부하는 미니멀리즘의 끝판왕을 보여주어라. 불필요한 장식을 배제하고 여백을 극대화하라.",
          modern_grid: "구조적/아키텍처 스타일: 스위스 디자인처럼 꽉 찬 격자형(Grid) 레이아웃을 사용하라. 텍스트와 이미지가 기하학적으로 완벽한 정렬을 이루도록 섹션을 구성하라.",

          // 2. 기업/전문성
          corp_auto: "[기업 & 전문성 계열] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 신뢰감 있는 블루/네이비톤, 세리프 폰트, 또는 대기업형 풀스크린 등 기업형에 맞는 세부 레이아웃을 AI가 스스로 판단하여 구성하라.",
          corp_trust: "전문적인 기업/비즈니스 스타일: 신뢰감을 주는 블루/네이비 톤, 2단 분할(좌 텍스트/우 이미지) 레이아웃, 체계적인 서비스 요약 표, 숫자로 보여주는 통계 카운터, 고객 후기(Testimonial) 섹션을 활용해 단정하게 디자인하라.",
          corp_heavy: "권위적이고 무게감 있는 스타일: 로펌이나 금융권처럼 묵직하고 진중한 느낌을 주어라. 세리프(명조) 폰트를 적절히 섞어 쓰고, 여백을 고급스럽게 주며 다크 계열의 중후한 컬러를 배치하라.",
          corp_global: "글로벌 엔터프라이즈 스타일: 삼성이나 애플의 B2B 페이지처럼 정석적이고 시원시원한 대기업 룩을 구성하라. 풀스크린 히어로 이미지와 3단 아이콘 텍스트 요약을 적극 활용하라.",

          // 3. IT/스타트업
          tech_auto: "[IT & 스타트업 계열] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 벤토 그리드, 퓨처리스틱 다크모드, 또는 글래스모피즘 등 테크 스타트업에 맞는 역동적인 세부 레이아웃을 AI가 스스로 판단하여 구성하라.",
          tech_startup: "트렌디한 스타트업/다이나믹 스타일: 비대칭 레이아웃, 화려한 그라디언트 배경 또는 어두운 다크모드 테마, 벤토(Bento) 그리드 박스 형태의 레이아웃, 크고 굵은 타이포그래피, 생동감 있는 디자인을 적용하라.",
          tech_future: "테크 & 퓨처리스틱 스타일: IT 솔루션에 어울리는 어두운 배경(다크모드)과 네온/형광색 포인트 컬러를 사용하라. SaaS 대시보드 화면이나 3D 느낌이 나는 UI 요소를 활용하라.",
          tech_web3: "웹 3.0 & 글래스모피즘 스타일: 반투명한 유리 질감(backdrop-blur)을 적극 활용하고 네온 텍스트와 역동적인 애니메이션 레이아웃을 배치하여 화려함의 극치를 보여주어라.",

          // 4. 감성/내추럴
          warm_auto: "[감성 & 내추럴 계열] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 카페 같은 웜톤 베이지, 오가닉 어스톤, 또는 매거진 감성 등 따뜻한 느낌의 세부 레이아웃을 AI가 스스로 판단하여 구성하라.",
          warm_cafe: "감성적이고 따뜻한 스타일: 카페나 공방처럼 따뜻한 웜톤(베이지/브라운/소프트파스텔) 컬러, 부드러운 라운딩 처리(rounded-3xl), 여백이 넉넉한 미니멀리즘, 감성적인 폰트와 이미지 배치를 활용하라.",
          warm_nature: "친환경/오가닉 스타일: 자연의 색(그린, 어스톤)을 사용하고 채도를 낮추어 눈이 편안한 디자인을 하라. 인물과 자연 풍경 위주의 갤러리 섹션을 많이 배치하라.",
          warm_magazine: "매거진/에세이 스타일: 시집이나 잡지처럼 텍스트와 타이포그래피 중심으로 레이아웃을 구성하라. 세리프 폰트를 포인트로 사용하고 넓고 감성적인 여백을 주어라.",

          // 5. 크리에이티브/포트폴리오
          creative_auto: "[크리에이티브 & 개인 브랜딩] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 모자이크 갤러리, 다크 럭셔리, 브루탈리즘 등 개성을 극대화할 수 있는 세부 레이아웃을 AI가 스스로 판단하여 구성하라.",
          creative_portfolio: "포트폴리오/개인 브랜딩 스타일: 작업물(사진)이 돋보이는 모자이크 갤러리 그리드, 큰 헤드라인과 자기소개 텍스트, 미니멀리즘 여백, 세련된 무채색 톤을 활용하라.",
          creative_luxury: "다크 & 럭셔리 스타일: 깊은 블랙 배경에 골드 또는 실버 포인트를 주어 명품 브랜드 쇼룸 같은 최고급 분위기를 연출하라. 폰트는 얇고 우아하게 배치하라.",
          creative_studio: "아트 스튜디오 스타일: 비대칭 레이아웃과 강렬한 색상 대비를 사용하여 틀에 얽매이지 않는 아티스트적인 느낌을 주어라. 크고 화려한 이미지를 배치하라.",
          creative_bold: "브루탈리즘 스타일: 파괴적이고 힙한 디자인을 위해 거대한 원색 블록과 초대형 타이포그래피를 사용하여 사용자에게 강렬한 인상을 남겨라.",

          // 6. 커머스/세일즈
          commerce_auto: "[커머스 & 세일즈 계열] 카테고리를 선택했습니다. 참조 사이트의 특성을 분석하여 상품 나열 위주의 깔끔한 커머스, 풀스크린 하이엔드 쇼룸, 또는 퍼포먼스 랜딩 등 판매 유도에 가장 적합한 세부 레이아웃을 AI가 스스로 판단하여 구성하라.",
          commerce_clean: "쇼핑몰/커머스 스타일: 제품/서비스를 강조하는 큰 이미지 갤러리 뷰, 카드 형태의 상품/서비스 나열, 깔끔한 흰색 배경과 포인트 컬러 활용, 가격표나 장바구니/구매 유도(CTA) 버튼을 적극적으로 배치하라.",
          commerce_high_end: "하이엔드 쇼룸 스타일: 이미지나 영상이 화면에 꽉 차는 풀스크린 섹션을 위주로 구성하고 UI 요소는 극도로 미니멀하게 숨겨서 상품 하나에만 온전히 집중하게 하라.",
          commerce_landing: "퍼포먼스 세일즈 스타일: 전환율(구매/신청)을 극대화하기 위해 행동유도(CTA) 버튼을 아주 크고 눈에 띄게 배치하라. 텍스트 가독성을 최우선으로 하고 장점을 직관적으로 나열하라."
        };

        vibeDesignInstructions = VIBE_INSTRUCTIONS[vibe] || "세련된 모던 비즈니스 스타일: 여백을 충분히 살린 미니멀리즘 레이아웃, 깔끔한 카드형 그리드, 시선을 끄는 2단 분할 레이아웃 등 다양한 UI 패턴을 섞어서 사용하라.";

        const prompt = `
당신은 세계 최고 수준의 AI 카피라이터 겸 한국어 웹 퍼블리셔입니다.
아래에 제공된 [여러 개의 참조 웹사이트 스크랩 데이터(텍스트 및 사진)]를 빠짐없이 종합 분석하여 완벽한 전문 비즈니스 홈페이지를 새롭게 창작해야 합니다. 특히 메뉴 정보, 가격표, 매장 사진, 소개글 등 각 사이트에 흩어진 정보를 모두 취합하십시오.

=== 브랜드 기본 정보 ===
- 추출된 브랜드명: ${pageTitle}
- 서브도메인 아이디: ${cleanSubdomain}
- 사용자가 선택한 사이트 테마/분위기(Vibe): ${vibe}
- 사용 가능한 템플릿 ID 목록: [${availableTemplateIds}]

${realImagesPromptSection}

=== 다중 출처 스크랩 원본 데이터 (HTML 및 텍스트) ===
${combinedCleanHtml}
${combinedExtraContent}

=== 🎨 테마 맞춤형 디자인 핵심 지시사항 ===
선택된 테마(${vibe})를 완벽하게 구현하기 위해 다음 디자인 패턴을 반드시 적용하라:
${vibeDesignInstructions}

=== 절대 금지 규칙 ===
1. 헤더 로고 및 사이트명을 절대로 "헬로우워크 천안불당점 : 네이버 블로그" 처럼 소스 그대로 쓰지 마라. 반드시 핵심 브랜드명만 짧게 사용하라 (예: "헬로우워크", "Hello Work").
2. 네비게이션 메뉴 레이블은 반드시 한국어로 짧게 (2~5자): 예) "공간 소개", "이용 요금", "오시는 길", "예약하기". 절대로 영문 긴 설명이나 블로그 제목을 메뉴에 넣지 마라.
3. 서브페이지 title도 절대로 블로그 포스트 제목 원문을 그대로 쓰지 말고, 비즈니스 카테고리명(2~5자)으로 작성하라.
4. 모든 내부 링크(href)는 반드시 상대경로(예: /about)로 작성하라.
5. 모든 이미지 src는 절대경로 URL이어야 한다.
6. 똑같은 구조의 단순 나열식 레이아웃(그냥 이미지+글+이미지+글)을 절대 반복하지 마라. 섹션마다 완전히 다른 UI 컴포넌트 구조를 써야 한다.

=== 🚀 창조적이고 다양한 레이아웃 생성 가이드 ===
단순하고 지루한 레이아웃을 탈피하라! 아래의 다양한 모던 UI 패턴들을 섞어서 섹션을 구성하라.
- **Hero 섹션**: 배경에 꽉 차는 이미지 위에 텍스트가 덮이는 스타일 또는 좌측 큰 텍스트/우측 이미지 반반 분할 레이아웃
- **서비스/기능 소개**: 2x2 또는 3x3 카드 그리드 레이아웃 (아이콘 활용), 최신 트렌드인 비대칭 벤토(Bento) 박스 UI 레이아웃
- **신뢰도 부여**: 숫자/통계를 강조하는 카운터 섹션, 깔끔하게 정렬된 파트너 로고 배치, 인용구 스타일의 아름다운 고객 후기(Testimonial)
- **정보 전달**: FAQ 아코디언 스타일, 순서를 보여주는 타임라인(연혁/과정) 레이아웃, 시선을 끄는 CTA(Call to Action) 풀너비 배너 레이아웃
- 메인 페이지는 4~6개의 완전히 형태가 다른 다채로운 섹션으로 구성하라.
- 서브페이지: 메뉴에 만든 항목마다 대응하는 완성된 HTML 페이지를 subpages 배열에 포함하되, 서브페이지 역시 위와 같은 다채로운 레이아웃 패턴을 사용하여 디자인하라. 네이버 플레이스나 블로그에서 찾은 가격표, 운영시간 정보 등은 서브페이지 내용으로 적극 활용하라.
- Tailwind CSS로 스타일링, 모바일 반응형(flex-col, md:flex-row, grid-cols-1, lg:grid-cols-3 등) 필수 적용
- 부드러운 호버 효과(hover:shadow-xl, hover:-translate-y-1, transition-all duration-300), 라운드 처리(rounded-2xl, rounded-3xl) 등 디테일한 CSS 유틸리티를 적극 활용하라.
- 아름답고 전문적인 디자인 - 실제 고객이 보는 프리미엄 서비스 웹사이트처럼 창작하라.
- 이미지: '블로그에서 추출한 실제 이미지 URL 목록'이 제공된다면 반드시 그 URL들을 우선적으로 사용하라. 실제 이미지가 부족할 경우에만 https://source.unsplash.com/800x600/?[비즈니스관련키워드] 형태의 플레이스홀더를 사용하라.
- 아름답고 전문적인 디자인 - 실제 고객이 보는 서비스 웹사이트처럼 제작

=== 반드시 출력할 JSON 스키마 ===
{
  "template_id": "가장 적합한 템플릿 ID 선택",
  "brand_name": "핵심 브랜드명 (짧게, 예: 헬로우워크)",
  "phone": "추출된 대표 연락처 (없으면 빈 문자열)",
  "address": "추출된 대표 주소 (없으면 빈 문자열)",
  "header_html": "<header class='sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 text-slate-800 px-6 py-4'><div class='max-w-7xl mx-auto flex justify-between items-center'><div class='text-xl font-black text-slate-900 tracking-tight'><a href='#hero'>[브랜드명]</a></div><nav class='hidden md:flex gap-8 text-sm font-bold text-slate-600'>[메뉴링크들]</nav><a href='#contact' class='px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all'>문의하기</a></div></header>",
  "footer_html": "<footer class='bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900'><div class='max-w-7xl mx-auto space-y-8'><div class='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800/80'><div class='text-2xl font-black text-white'>[브랜드명]</div><div class='text-sm'>[연락처/이메일]</div></div><div class='text-xs text-slate-500'>&copy; 2026 [브랜드명]. All rights reserved.</div></div></footer>",
  "menus": [
    { "label": "한국어 짧은 메뉴명", "path": "url-slug" }
  ],
  "main_sections": [
    {
      "section_type": "custom_html",
      "section_title": "섹션명 (2~5자)",
      "html": "<section class='...'> 완성된 Tailwind HTML </section>"
    }
  ],
  "subpages": [
    {
      "path": "url-slug",
      "title": "한국어 짧은 페이지명",
      "html": "<section class='...'> 완성된 Tailwind HTML </section>"
    }
  ]
}

출력은 반드시 순수 JSON만. 다른 텍스트, 마크다운 없음.

=== 분석할 SNS/블로그 데이터 ===
위에서 제공한 다중 출처 스크랩 데이터를 기반으로 합니다.
        `;

        const vertexRes = await generateContentWithVertexAI({
          prompt,
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        });

        let aiText = (typeof vertexRes === "string" ? vertexRes : (vertexRes as any).text || "").trim();
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiText = jsonMatch[0];
        } else if (aiText.startsWith("```json")) {
          aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        }
        
        let parsedAi: any = {};
        try {
          parsedAi = JSON.parse(aiText);
        } catch (pe) {
          console.error("AI Magic Builder JSON Parse Error:", pe, "Raw:", aiText);
          throw pe;
        }
        
        // 0. Update template_id based on AI's choice
        const aiTemplateId = parsedAi.template_id;
        if (aiTemplateId && TEMPLATE_REGISTRY[aiTemplateId]) {
          await adminSupabase.from("client_sites").update({ template_id: aiTemplateId }).eq("id", siteId);
        }
        
        // AI가 정제한 브랜드명, 전화번호, 주소 업데이트
        const aiBrandName = parsedAi.brand_name;
        const aiPhone = parsedAi.phone;
        const aiAddress = parsedAi.address;
        const updateFields: any = {};
        if (aiBrandName && aiBrandName.trim()) updateFields.company_name = aiBrandName.trim();
        if (aiPhone && aiPhone.trim()) updateFields.phone = aiPhone.trim();
        if (aiAddress && aiAddress.trim()) updateFields.address = aiAddress.trim();
        if (Object.keys(updateFields).length > 0) {
          await adminSupabase.from("client_sites").update(updateFields).eq("id", siteId);
        }
        
        const aiMenus = parsedAi.menus || [];
        const aiSections = parsedAi.main_sections || [];
        const aiSubpages = parsedAi.subpages || [];
        const aiHeaderHtml = parsedAi.header_html || "";
        const aiFooterHtml = parsedAi.footer_html || "";

        // 1. Prepare initial raw sections
        const rawSections: any[] = [];

        // Main sections
        aiSections.forEach((sec: any, index: number) => {
          rawSections.push({
            site_id: siteId,
            section_type: "custom_html",
            sort_order: index + 1,
            title: sec.section_title || `섹션 ${index + 1}`,
            subtitle: "",
            html: sec.html || "",
            content_data: { html: sec.html || "" }
          });
        });

        // Subpages
        aiSubpages.forEach((sub: any, index: number) => {
          if (sub.html && sub.path) {
            const cleanPath = sub.path.replace(/^\/+/, "").toLowerCase();
            const subTitle = sub.title || cleanPath;
            rawSections.push({
              site_id: siteId,
              section_type: `subpage_${cleanPath}`,
              sort_order: aiSections.length + index + 1,
              title: subTitle,
              subtitle: "",
              html: sub.html || "",
              content_data: { html: sub.html || "" }
            });
          }
        });

        // 2. Migrate all images to Cloudflare R2 with WebP optimization
        const { migrateAllImagesInHtmlAndData } = await import("@/lib/server/migration-image-uploader");
        const migratedResult = await migrateAllImagesInHtmlAndData(
          finalSubdomain,
          rawSections,
          aiHeaderHtml,
          aiFooterHtml
        );

        generatedSections = migratedResult.sections.map((s: any, idx: number) => ({
          site_id: siteId,
          section_type: s.section_type,
          sort_order: idx + 1,
          title: s.title || rawSections[idx]?.title || `섹션 ${idx + 1}`,
          subtitle: s.subtitle || rawSections[idx]?.subtitle || "",
          content_data: {
            html: s.content_data?.html || s.html || ""
          }
        }));

        // 3. Update site extra_configs with custom layout, header, footer and menus
        const { data: currentSite } = await adminSupabase
          .from("client_sites")
          .select("extra_configs")
          .eq("id", siteId)
          .single();
          
        const currentConfigs = currentSite?.extra_configs || {};
        await adminSupabase.from("client_sites").update({
          extra_configs: {
            ...currentConfigs,
            header_html: migratedResult.headerHtml || aiHeaderHtml,
            footer_html: migratedResult.footerHtml || aiFooterHtml,
            menus: aiMenus,
            is_custom_layout: true,
            migrated_images_count: migratedResult.migratedCount
          }
        }).eq("id", siteId);

    } catch (e) {
      console.error("AI Magic Builder Error:", e);
    }

    // Fallback only if Gemini fails completely
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

    // 5. Construct CreaiBox SNS Result Payload
    return NextResponse.json({ 
      success: true, 
      message: "AI SNS 사이트 창작 완료!",
      data: {
        siteId,
        sectionsCount: generatedSections.length,
        subdomain: finalSubdomain
      } 
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: err.message || "기존 홈페이지 이관 중 오류가 발생했습니다." }, { status: 500 });
  }
}
