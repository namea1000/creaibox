import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";

/**
 * Cloudflare R2 Client Factory
 */
function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured in environment variables.");
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

export type ImagePurpose = "hero" | "card" | "icon" | "general";

interface UploadOptions {
  brandId: string;
  purpose?: ImagePurpose;
}

/**
 * ⚡ 원본 이미지 다운로드 -> 목적별 해상도 리사이징 & WebP 최적화 -> Cloudflare R2 업로드
 */
export async function downloadAndUploadImageToR2(
  imageUrl: string,
  options: UploadOptions
): Promise<string | null> {
  let cleanUrl = imageUrl.replace(/&amp;/g, "&").trim();

  // 이미 우리 R2 CDN URL인 경우 스킵
  const cdnBase = (process.env.NEXT_PUBLIC_R2_CDN_URL || "https://assets.creaibox.com").replace(/\/$/, "");
  if (cleanUrl.startsWith(cdnBase) || cleanUrl.includes(".r2.cloudflarestorage.com")) {
    return cleanUrl;
  }

  // data URL이나 특수 URL 스킵
  if (cleanUrl.startsWith("data:") || cleanUrl.startsWith("blob:") || cleanUrl.includes("#")) {
    return cleanUrl;
  }

  try {
    let res = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,video/*,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(12000),
    });

    // 400 Bad Request 발생 시 쿼리스트링 제거 후 2차 재시도
    if (!res.ok && cleanUrl.includes("?")) {
      const strippedUrl = cleanUrl.split("?")[0];
      try {
        const retryRes = await fetch(strippedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(10000),
        });
        if (retryRes.ok) {
          res = retryRes;
          cleanUrl = strippedUrl;
        }
      } catch {}
    }

    if (!res.ok) {
      console.warn(`[R2 Image Migrator] Failed to fetch image: ${cleanUrl} (Status ${res.status})`);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 100) return null; // 빈 파일 방지

    // 고유 해시 기반 파일명 생성 (중복 업로드 방지)
    const hash = crypto.createHash("md5").update(cleanUrl).digest("hex").substring(0, 16);
    const bucketName = process.env.R2_BUCKET_NAME || "creaibox-assets";
    const r2 = getR2Client();

    // 🎥 동영상(MP4/WEBM) 파일인 경우 그대로 R2 업로드하여 비디오 보존
    if (contentType.includes("video") || cleanUrl.match(/\.(mp4|webm|ogg|mov)/i)) {
      const ext = cleanUrl.match(/\.(mp4|webm|ogg|mov)/i)?.[1]?.toLowerCase() || "mp4";
      const mime = ext === "webm" ? "video/webm" : "video/mp4";
      const r2Key = `migrated-sites/${options.brandId}/${hash}.${ext}`;
      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
          Body: buffer,
          ContentType: mime,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      return getR2PublicUrl(r2Key);
    }

    // 🎨 SVG 벡터 파일인 경우 WebP 변환 없이 SVG 그대로 업로드
    if (contentType.includes("svg") || cleanUrl.toLowerCase().endsWith(".svg")) {
      const r2Key = `migrated-sites/${options.brandId}/${hash}.svg`;
      await r2.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
          Body: buffer,
          ContentType: "image/svg+xml",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      return getR2PublicUrl(r2Key);
    }

    // 🖼️ 목적별 리사이징 및 WebP 최적화
    const purpose = options.purpose || "general";
    let transformer = sharp(buffer);
    const metadata = await transformer.metadata().catch(() => null);

    if (metadata) {
      if (purpose === "hero") {
        // 히어로 섹션 / 풀 배너: 최대 너비 1920px, 고화질 WebP (quality 85)
        transformer = transformer
          .resize({ width: 1920, withoutEnlargement: true, fit: "inside" })
          .webp({ quality: 85, effort: 4 });
      } else if (purpose === "icon") {
        // 로고 / 아이콘 / 아바타: 최대 너비 512px, 정밀 WebP (quality 90)
        transformer = transformer
          .resize({ width: 512, withoutEnlargement: true, fit: "inside" })
          .webp({ quality: 90, effort: 4 });
      } else {
        // 일반 카드 / 그리드 / 콘텐츠 박스: 최대 너비 1200px, 최적화 WebP (quality 80)
        transformer = transformer
          .resize({ width: 1200, withoutEnlargement: true, fit: "inside" })
          .webp({ quality: 80, effort: 4 });
      }
    } else {
      transformer = transformer.webp({ quality: 80 });
    }

    const webpBuffer = await transformer.toBuffer();
    const r2Key = `migrated-sites/${options.brandId}/${hash}.webp`;

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: webpBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const finalUrl = getR2PublicUrl(r2Key);
    console.log(`[R2 Image Migrator] 🚀 Migrated: ${imageUrl.substring(0, 60)}... -> ${finalUrl}`);
    return finalUrl;
  } catch (err: any) {
    console.warn(`[R2 Image Migrator] Error converting image (${imageUrl}):`, err?.message || err);
    return null;
  }
}

/**
 * 📦 HTML 및 콘텐츠 데이터 내의 모든 외부 이미지 URL을 R2로 병렬 복사 및 치환
 */
export async function migrateAllImagesInHtmlAndData(
  brandId: string,
  sections: Array<{
    section_type: string;
    html?: string;
    content_data?: any;
    media_urls?: string[];
    slides?: string[];
  }>,
  headerHtml?: string,
  footerHtml?: string
): Promise<{
  sections: typeof sections;
  headerHtml: string;
  footerHtml: string;
  migratedCount: number;
}> {
  // 1. 모든 고유 이미지 URL 추출
  const imageUrlMap = new Map<string, ImagePurpose>();

  function extractUrls(htmlStr: string, defaultPurpose: ImagePurpose) {
    if (!htmlStr) return;
    const srcMatches = htmlStr.matchAll(/src=["'](https?:\/\/[^"']+)["']/gi);
    for (const m of srcMatches) {
      if (m[1]) imageUrlMap.set(m[1], defaultPurpose);
    }
    const urlMatches = htmlStr.matchAll(/url\(["']?(https?:\/\/[^"')]+)["']?\)/gi);
    for (const m of urlMatches) {
      if (m[1]) imageUrlMap.set(m[1], defaultPurpose);
    }
  }

  // Header & Footer (주로 로고/아이콘)
  if (headerHtml) extractUrls(headerHtml, "icon");
  if (footerHtml) extractUrls(footerHtml, "icon");

  // Sections
  sections.forEach((sec, idx) => {
    const isHero = sec.section_type === "hero" || sec.section_type === "hero_image_slider" || idx === 0;
    const purpose: ImagePurpose = isHero ? "hero" : "card";

    if (sec.html) extractUrls(sec.html, purpose);
    if (sec.content_data?.html) extractUrls(sec.content_data.html, purpose);
    if (sec.content_data?.image) imageUrlMap.set(sec.content_data.image, isHero ? "hero" : "card");
    if (Array.isArray(sec.content_data?.media_urls)) {
      sec.content_data.media_urls.forEach((u: string) => {
        if (typeof u === "string" && u.startsWith("http")) imageUrlMap.set(u, purpose);
      });
    }
    if (Array.isArray(sec.slides)) {
      sec.slides.forEach((slideHtml: string) => extractUrls(slideHtml, purpose));
    }
  });

  const uniqueUrls = Array.from(imageUrlMap.entries());
  console.log(`[R2 Image Migrator] 📸 Found ${uniqueUrls.length} unique images to migrate to R2 for ${brandId}`);

  // 2. 최대 10개 동시 병렬 다운로드 & R2 업로드
  const replacementMap = new Map<string, string>();
  const BATCH_SIZE = 8;

  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async ([url, purpose]) => {
        const r2Url = await downloadAndUploadImageToR2(url, { brandId, purpose });
        return { original: url, r2: r2Url };
      })
    );

    results.forEach(({ original, r2 }) => {
      if (r2 && r2 !== original) {
        replacementMap.set(original, r2);
      }
    });
  }

  // 3. HTML 및 섹션 데이터 내의 URL 일괄 치환
  function replaceUrlsInString(str: string): string {
    if (!str) return str;
    let result = str;
    for (const [orig, r2] of replacementMap.entries()) {
      result = result.split(orig).join(r2);
    }
    return result;
  }

  let updatedHeader = headerHtml ? replaceUrlsInString(headerHtml) : "";
  let updatedFooter = footerHtml ? replaceUrlsInString(footerHtml) : "";

  const updatedSections = sections.map((sec) => {
    const nextSec = { ...sec };
    if (nextSec.html) nextSec.html = replaceUrlsInString(nextSec.html);
    if (nextSec.content_data) {
      const nextData = { ...nextSec.content_data };
      if (nextData.html) nextData.html = replaceUrlsInString(nextData.html);
      if (nextData.image && replacementMap.has(nextData.image)) {
        nextData.image = replacementMap.get(nextData.image)!;
      }
      if (Array.isArray(nextData.media_urls)) {
        nextData.media_urls = nextData.media_urls.map((u: string) => replacementMap.get(u) || u);
      }
      if (Array.isArray(nextData.slides)) {
        nextData.slides = nextData.slides.map((s: string) => replaceUrlsInString(s));
      }
      nextSec.content_data = nextData;
    }
    if (Array.isArray(nextSec.slides)) {
      nextSec.slides = nextSec.slides.map((s: string) => replaceUrlsInString(s));
    }
    if (Array.isArray(nextSec.media_urls)) {
      nextSec.media_urls = nextSec.media_urls.map((u: string) => replacementMap.get(u) || u);
    }
    return nextSec;
  });

  return {
    sections: updatedSections,
    headerHtml: updatedHeader,
    footerHtml: updatedFooter,
    migratedCount: replacementMap.size,
  };
}
