import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 300;

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getR2PublicUrl(key: string): string {
  const cdnBase = (
    process.env.NEXT_PUBLIC_R2_CDN_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    "https://assets.creaibox.com"
  ).replace(/\/$/, "");

  return `${cdnBase}/${key.replace(/^\//, "")}`;
}

/**
 * 🎨 Google Imagen 3 (Vertex AI / Generative Language API) 호출
 */
async function generateImageWithImagen3(prompt: string, aspectRatio: "16:9" | "1:1" | "4:3" | "3:4" | "9:16" = "16:9"): Promise<Buffer | null> {
  const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio === "16:9" ? "16:9" : aspectRatio === "1:1" ? "1:1" : aspectRatio === "4:3" ? "4:3" : "16:9",
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const base64 = data.predictions?.[0]?.bytesBase64Encoded;
      if (base64) {
        return Buffer.from(base64, "base64");
      }
    }
  } catch (err) {
    console.warn("[Imagen 3] Primary API attempt failed:", err);
  }

  // 🛡️ 2차 Fallback: Pollinations AI (FLUX)
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const width = aspectRatio === "16:9" ? 1280 : aspectRatio === "1:1" ? 1024 : 1024;
    const height = aspectRatio === "16:9" ? 720 : aspectRatio === "1:1" ? 1024 : 768;
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux`;
    
    const fallbackRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(20000) });
    if (fallbackRes.ok) {
      const arrayBuf = await fallbackRes.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
  } catch (fallbackErr) {
    console.warn("[Imagen 3] Fallback AI image generator failed:", fallbackErr);
  }

  return null;
}

/**
 * 🚀 [POST] 사이트 로고 및 섹션 이미지 AI 생성 & 일괄 교체
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const { siteId } = await request.json();
    if (!siteId) {
      return NextResponse.json({ error: "유효한 사이트 ID가 필요합니다." }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // 1. Fetch site & sections
    const { data: site, error: siteError } = await adminSupabase
      .from("client_sites")
      .select("id, brand_id, company_name, extra_configs, template_id")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: "해당 사이트를 찾을 수 없습니다." }, { status: 404 });
    }

    const { data: sections, error: sectionsError } = await adminSupabase
      .from("site_sections")
      .select("id, site_id, section_type, sort_order, title, subtitle, content_data")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true });

    if (sectionsError || !sections || sections.length === 0) {
      return NextResponse.json({ error: "사이트의 섹션 데이터가 존재하지 않습니다." }, { status: 400 });
    }

    // 2. Collect all existing image URLs
    const brandId = site.brand_id;
    const companyName = site.company_name || "Modern Brand";
    const headerHtml = site.extra_configs?.header_html || "";
    const footerHtml = site.extra_configs?.footer_html || "";

    const originalImages: Array<{
      url: string;
      context: string;
      isLogo: boolean;
      aspectRatio: "16:9" | "1:1" | "4:3";
    }> = [];

    const seenUrls = new Set<string>();

    function extractImagesFromHtml(html: string, sectionTitle: string, isHeaderOrFooter: boolean) {
      if (!html) return;
      const matches = html.matchAll(/src=["'](https?:\/\/[^"']+)["']/gi);
      for (const m of matches) {
        const url = m[1];
        if (!seenUrls.has(url) && !url.includes("data:") && !url.includes("svg")) {
          seenUrls.add(url);
          const isLogo = isHeaderOrFooter || url.toLowerCase().includes("logo") || sectionTitle.toLowerCase().includes("logo");
          originalImages.push({
            url,
            context: `${companyName} - ${sectionTitle} (${isLogo ? "Brand Logo or Icon" : "Section Visual Media"})`,
            isLogo,
            aspectRatio: isLogo ? "1:1" : "16:9",
          });
        }
      }
    }

    if (headerHtml) extractImagesFromHtml(headerHtml, "Header Navigation", true);
    if (footerHtml) extractImagesFromHtml(footerHtml, "Footer Section", true);

    sections.forEach((sec, idx) => {
      const isHero = sec.section_type === "hero" || sec.section_type === "hero_image_slider" || idx === 0;
      const title = sec.title || `Section ${idx + 1}`;
      if (sec.content_data?.html) {
        extractImagesFromHtml(sec.content_data.html, title, false);
      }
      if (sec.content_data?.image && !seenUrls.has(sec.content_data.image)) {
        seenUrls.add(sec.content_data.image);
        originalImages.push({
          url: sec.content_data.image,
          context: `${companyName} - ${title} (Main Hero/Featured Image)`,
          isLogo: false,
          aspectRatio: isHero ? "16:9" : "4:3",
        });
      }
    });

    if (originalImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "교체할 이미지가 없거나 이미 최신 이미지로 적용되어 있습니다.",
        replacedCount: 0,
      });
    }

    console.log(`[AI Image Regenerator] 🎯 Analyzing ${originalImages.length} images for ${brandId} (${companyName})...`);

    // 3. Use Gemini to generate ultra-realistic, copyright-free English prompts
    let imagePromptMap: Array<{ prompt: string; aspectRatio: "16:9" | "1:1" | "4:3"; isLogo: boolean }> = [];

    try {
      const { generateContentWithVertexAI } = await import("@/lib/server/vertex-ai-gemini");
      const analysisPrompt = `
        You are a World-Class Creative Director and Commercial Photographer.
        Analyze this company: "${companyName}"
        We need to generate ${originalImages.length} brand-new, ultra-photorealistic, high-end, 100% copyright-safe commercial images and vector logos to replace existing placeholder images.

        Image List:
        ${originalImages.map((img, i) => `${i + 1}. [${img.isLogo ? "LOGO" : "MEDIA"}] Context: ${img.context} | Ratio: ${img.aspectRatio}`).join("\n")}

        Generate a strict JSON array of objects with the exact schema:
        [
          {
            "index": 1,
            "prompt": "Extremely detailed English prompt for Imagen 3. For logos: 'Modern minimalistic vector brand logo for [company], clean geometric icon on solid background, 8k'. For photos: 'High-end commercial 8k photography of [scene], cinematic soft lighting, award-winning studio photo, ultra-detailed 35mm lens, photorealistic'",
            "aspectRatio": "16:9" or "1:1" or "4:3"
          }
        ]
      `;

      const aiRes = await generateContentWithVertexAI({
        prompt: analysisPrompt,
        modelName: "gemini-flash-latest",
        responseMimeType: "application/json",
      });

      const parsed = JSON.parse(aiRes.replace(/```json/g, "").replace(/```/g, "").trim());
      if (Array.isArray(parsed)) {
        imagePromptMap = parsed;
      }
    } catch (e) {
      console.warn("[AI Image Regenerator] Gemini prompt generation fallback:", e);
    }

    // 4. Generate AI Images in parallel batches and upload to R2
    const urlReplacementMap = new Map<string, string>();
    const bucketName = process.env.R2_BUCKET_NAME || "creaibox-assets";
    const r2 = getR2Client();

    for (let i = 0; i < originalImages.length; i++) {
      const orig = originalImages[i];
      const aiPromptData = imagePromptMap[i];
      const defaultPrompt = orig.isLogo
        ? `Clean modern luxury vector logo for ${companyName}, minimalistic, high resolution icon on solid dark background, 8k, professional branding`
        : `Stunning 8k commercial photography representing ${companyName}, modern corporate office, cinematic lighting, ultra-detailed professional visual, shot on Hasselblad`;

      const finalPrompt = aiPromptData?.prompt || defaultPrompt;
      const ratio = (aiPromptData?.aspectRatio || orig.aspectRatio || "16:9") as any;

      console.log(`[AI Image Regenerator] 🎨 Generating AI Image (${i + 1}/${originalImages.length}) with Imagen 3...`);

      const imgBuffer = await generateImageWithImagen3(finalPrompt, ratio);
      if (imgBuffer) {
        try {
          // Sharp WebP 최적화 변환
          const webpBuffer = await sharp(imgBuffer)
            .resize(orig.isLogo ? { width: 512, fit: "inside" } : { width: 1920, fit: "inside", withoutEnlargement: true })
            .webp({ quality: orig.isLogo ? 90 : 85, effort: 4 })
            .toBuffer();

          const hash = crypto.createHash("md5").update(finalPrompt + Date.now().toString()).digest("hex").substring(0, 16);
          const r2Key = `migrated-sites/${brandId}/ai-${hash}.webp`;

          await r2.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: r2Key,
              Body: webpBuffer,
              ContentType: "image/webp",
              CacheControl: "public, max-age=31536000, immutable",
            })
          );

          const r2Url = getR2PublicUrl(r2Key);
          urlReplacementMap.set(orig.url, r2Url);
          console.log(`[AI Image Regenerator] 🚀 Replaced: ${orig.url.substring(0, 50)}... -> ${r2Url}`);
        } catch (uploadErr) {
          console.error("[AI Image Regenerator] Upload error:", uploadErr);
        }
      }
    }

    if (urlReplacementMap.size === 0) {
      return NextResponse.json({
        success: false,
        error: "AI 이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      }, { status: 500 });
    }

    // 5. Replace URLs in sections and site configs
    function replaceUrls(str: string): string {
      if (!str) return str;
      let res = str;
      for (const [oldUrl, newUrl] of urlReplacementMap.entries()) {
        res = res.split(oldUrl).join(newUrl);
      }
      return res;
    }

    // Update site sections
    for (const sec of sections) {
      const nextContent = { ...(sec.content_data || {}) };
      if (nextContent.html) nextContent.html = replaceUrls(nextContent.html);
      if (nextContent.image && urlReplacementMap.has(nextContent.image)) {
        nextContent.image = urlReplacementMap.get(nextContent.image)!;
      }
      if (Array.isArray(nextContent.media_urls)) {
        nextContent.media_urls = nextContent.media_urls.map((u: string) => urlReplacementMap.get(u) || u);
      }
      if (Array.isArray(nextContent.slides)) {
        nextContent.slides = nextContent.slides.map((s: string) => replaceUrls(s));
      }

      await adminSupabase
        .from("site_sections")
        .update({ content_data: nextContent })
        .eq("id", sec.id);
    }

    // Update extra_configs
    const nextConfigs = {
      ...(site.extra_configs || {}),
      header_html: replaceUrls(headerHtml),
      footer_html: replaceUrls(footerHtml),
      is_ai_regenerated_media: true,
      ai_regenerated_media_at: new Date().toISOString(),
      ai_replaced_images_count: urlReplacementMap.size,
    };

    await adminSupabase
      .from("client_sites")
      .update({ extra_configs: nextConfigs })
      .eq("id", site.id);

    return NextResponse.json({
      success: true,
      message: `총 ${urlReplacementMap.size}개의 로고 및 이미지가 Vertex AI (Imagen 3)로 새로 생성되어 저작권 안전 WebP 이미지로 교체되었습니다!`,
      replacedCount: urlReplacementMap.size,
      brandId: site.brand_id,
    });
  } catch (err: any) {
    console.error("[AI Image Regenerator] Fatal error:", err);
    return NextResponse.json({ error: err.message || "로고 및 이미지 생성 교체 중 오류가 발생했습니다." }, { status: 500 });
  }
}
