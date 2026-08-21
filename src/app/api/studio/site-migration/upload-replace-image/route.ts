import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 120;

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
 * 🚀 [POST] 내 PC 이미지 파일 업로드 -> WebP 최적화 & R2 저장 -> 사이트 내 특정 이미지 즉시 교체
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const siteId = formData.get("siteId") as string;
    const oldImageUrl = formData.get("oldImageUrl") as string;
    const purpose = (formData.get("purpose") as string) || "general"; // hero | card | icon | general
    const file = formData.get("file") as File;

    if (!siteId || !file) {
      return NextResponse.json({ error: "필수 파라미터(siteId, file)가 누락되었습니다." }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // 1. Fetch site
    const { data: site, error: siteError } = await adminSupabase
      .from("client_sites")
      .select("id, brand_id, company_name, extra_configs")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: "해당 사이트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. Read File Buffer & WebP Optimize
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let transformer = sharp(buffer);
    const metadata = await transformer.metadata().catch(() => null);

    if (metadata) {
      if (purpose === "icon" || file.name.toLowerCase().includes("logo")) {
        // 로고 / 아이콘: 최대 512px, 정밀 WebP 90%
        transformer = transformer.resize({ width: 512, fit: "inside", withoutEnlargement: true }).webp({ quality: 90, effort: 4 });
      } else if (purpose === "hero") {
        // 히어로 배너: 최대 1920px, 고화질 WebP 85%
        transformer = transformer.resize({ width: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 85, effort: 4 });
      } else {
        // 일반 카드/콘텐츠: 최대 1200px, 최적화 WebP 80%
        transformer = transformer.resize({ width: 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 80, effort: 4 });
      }
    } else {
      transformer = transformer.webp({ quality: 80 });
    }

    const webpBuffer = await transformer.toBuffer();
    const hash = crypto.createHash("md5").update(buffer).digest("hex").substring(0, 16);
    const bucketName = process.env.R2_BUCKET_NAME || "creaibox-assets";
    const r2Key = `migrated-sites/${site.brand_id}/user-${hash}.webp`;

    const r2 = getR2Client();
    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: webpBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const newImageUrl = getR2PublicUrl(r2Key);
    console.log(`[User Image Replace] 🚀 Uploaded new image: ${newImageUrl} (Replacing: ${oldImageUrl || "direct insertion"})`);

    // 3. Replace in site_sections
    const { data: sections } = await adminSupabase
      .from("site_sections")
      .select("id, content_data")
      .eq("site_id", siteId);

    if (sections && sections.length > 0 && oldImageUrl) {
      for (const sec of sections) {
        const nextContent = { ...(sec.content_data || {}) };
        let modified = false;

        if (nextContent.html && nextContent.html.includes(oldImageUrl)) {
          nextContent.html = nextContent.html.split(oldImageUrl).join(newImageUrl);
          modified = true;
        }

        if (nextContent.image === oldImageUrl) {
          nextContent.image = newImageUrl;
          modified = true;
        }

        if (Array.isArray(nextContent.media_urls) && nextContent.media_urls.includes(oldImageUrl)) {
          nextContent.media_urls = nextContent.media_urls.map((u: string) => (u === oldImageUrl ? newImageUrl : u));
          modified = true;
        }

        if (Array.isArray(nextContent.slides)) {
          nextContent.slides = nextContent.slides.map((s: string) => s.split(oldImageUrl).join(newImageUrl));
          modified = true;
        }

        if (modified) {
          await adminSupabase
            .from("site_sections")
            .update({ content_data: nextContent })
            .eq("id", sec.id);
        }
      }
    }

    // 4. Replace in client_sites extra_configs
    if (oldImageUrl) {
      const headerHtml = site.extra_configs?.header_html || "";
      const footerHtml = site.extra_configs?.footer_html || "";

      let nextHeader = headerHtml;
      let nextFooter = footerHtml;
      let configModified = false;

      if (headerHtml.includes(oldImageUrl)) {
        nextHeader = headerHtml.split(oldImageUrl).join(newImageUrl);
        configModified = true;
      }

      if (footerHtml.includes(oldImageUrl)) {
        nextFooter = footerHtml.split(oldImageUrl).join(newImageUrl);
        configModified = true;
      }

      if (configModified) {
        await adminSupabase
          .from("client_sites")
          .update({
            extra_configs: {
              ...(site.extra_configs || {}),
              header_html: nextHeader,
              footer_html: nextFooter,
              user_replaced_images_at: new Date().toISOString(),
            },
          })
          .eq("id", siteId);
      }
    }

    return NextResponse.json({
      success: true,
      message: "내 사진으로 이미지가 성공적으로 교체되었습니다!",
      newImageUrl,
      oldImageUrl,
      brandId: site.brand_id,
    });
  } catch (err: any) {
    console.error("[User Image Replace] Error:", err);
    return NextResponse.json({ error: err.message || "이미지 교체 중 오류가 발생했습니다." }, { status: 500 });
  }
}
