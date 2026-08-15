/**
 * POST /api/studio/custom-client-site/capture-thumbnail
 *
 * 🤖 템플릿 자동 캡처 & R2 업로드 파이프라인
 * - 단건: { templateId: string, targetUrl: string }
 * - 전체 일괄: { batch: true, baseUrl?: string }
 *
 * 캡처 사양: 720×1280 (9:16 세로형), WebP 90% 품질
 * 저장 경로: creaibox-assets/templates/{id}/thumbnail.webp
 */

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import puppeteer from "puppeteer-core";
import fs from "fs";
import { CUSTOM_TEMPLATES } from "@/constants/custom-client-site";

// ──────────────────────────────────────────────
// 1. 캡처 설정 상수
// ──────────────────────────────────────────────
/** 9:16 세로 비율 (모바일 full-page screenshot) */
const CAPTURE_WIDTH = 720;
const CAPTURE_HEIGHT = 1280;

/** WebP 품질 (0–100) */
const WEBP_QUALITY = 90;

/** R2 버킷 & 경로 */
const R2_BUCKET = "creaibox-assets";
const R2_KEY_PREFIX = "templates";

// ──────────────────────────────────────────────
// 2. R2 클라이언트
// ──────────────────────────────────────────────
function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// ──────────────────────────────────────────────
// 3. Chrome 실행 경로 탐색
// ──────────────────────────────────────────────
const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

async function getChromePath(): Promise<string> {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  // Vercel / Lambda 환경 fallback
  try {
    const chromium = (await import("@sparticuz/chromium")).default;
    return await chromium.executablePath();
  } catch {}
  return "";
}

// ──────────────────────────────────────────────
// 4. 단건 캡처 + R2 업로드
// ──────────────────────────────────────────────
interface CaptureResult {
  templateId: string;
  r2Key: string;
  cdnUrl: string | null;
  success: boolean;
  error?: string;
}

async function captureAndUpload(
  templateId: string,
  targetUrl: string,
  r2Client: S3Client
): Promise<CaptureResult> {
  const r2Key = `${R2_KEY_PREFIX}/${templateId}/thumbnail.webp`;
  const cdnBase = process.env.NEXT_PUBLIC_R2_CDN_URL;
  const cdnUrl = cdnBase ? `${cdnBase}/${r2Key}` : null;

  let browser: any = null;

  try {
    const executablePath = await getChromePath();
    if (!executablePath) {
      throw new Error("Chrome 실행 파일을 찾을 수 없습니다.");
    }

    console.log(`[Capture 🚀] ${templateId} → ${targetUrl}`);

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        `--window-size=${CAPTURE_WIDTH},${CAPTURE_HEIGHT}`,
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: CAPTURE_WIDTH,
      height: CAPTURE_HEIGHT,
      deviceScaleFactor: 1.5,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 2500));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 500));

    const pngBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: CAPTURE_WIDTH, height: CAPTURE_HEIGHT },
    });

    console.log(`[Capture 📸] ${templateId} → PNG captured (${(pngBuffer as Buffer).length} bytes)`);

    const sharp = (await import("sharp")).default;
    const webpBuffer = await sharp(pngBuffer as Buffer)
      .resize(CAPTURE_WIDTH, CAPTURE_HEIGHT, { fit: "cover", position: "top" })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    console.log(`[Capture 🔄] ${templateId} → WebP (${webpBuffer.length} bytes)`);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: r2Key,
        Body: webpBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: {
          templateId,
          capturedAt: new Date().toISOString(),
          sourceUrl: targetUrl,
          width: String(CAPTURE_WIDTH),
          height: String(CAPTURE_HEIGHT),
        },
      })
    );

    console.log(`[Capture ✅] ${templateId} → R2 업로드 완료: ${r2Key}`);
    return { templateId, r2Key, cdnUrl, success: true };
  } catch (error: any) {
    console.error(`[Capture ❌] ${templateId}:`, error?.message ?? error);
    return { templateId, r2Key, cdnUrl, success: false, error: error?.message ?? String(error) };
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
  }
}

// ──────────────────────────────────────────────
// 5. POST 핸들러
// ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_API_SECRET;

  if (!expectedSecret || adminSecret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized: x-admin-secret 헤더가 유효하지 않습니다." },
      { status: 401 }
    );
  }

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { error: "R2 환경변수(R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body JSON 파싱 실패" }, { status: 400 });
  }

  const r2Client = getR2Client();

  // 모드 A: 전체 일괄 캡처
  if (body?.batch === true) {
    const baseUrl = body.baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://creaibox.com";
    const results: CaptureResult[] = [];

    for (const tpl of CUSTOM_TEMPLATES) {
      let targetUrl = tpl.previewUrl;
      if (targetUrl.includes("localhost")) {
        targetUrl = `${baseUrl}/clients/${tpl.id}`;
      }
      const result = await captureAndUpload(tpl.id, targetUrl, r2Client);
      results.push(result);
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `일괄 캡처 완료: 성공 ${successCount}건 / 실패 ${failCount}건`,
      total: results.length,
      successCount,
      failCount,
      results,
    });
  }

  // 모드 B: 단건 캡처
  const { templateId, targetUrl } = body ?? {};

  if (!templateId || !targetUrl) {
    return NextResponse.json(
      { error: "templateId와 targetUrl이 필요합니다. (또는 batch: true로 전체 캡처)" },
      { status: 400 }
    );
  }

  const result = await captureAndUpload(templateId, targetUrl, r2Client);

  if (!result.success) {
    return NextResponse.json({ error: result.error, templateId }, { status: 500 });
  }

  return NextResponse.json({
    message: "썸네일 캡처 & R2 업로드 완료",
    templateId,
    r2Key: result.r2Key,
    cdnUrl: result.cdnUrl,
    success: true,
  });
}

// ──────────────────────────────────────────────
// 6. GET 핸들러 (R2 존재 확인)
// ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const templateId = searchParams.get("templateId");

  if (!templateId) {
    return NextResponse.json({ error: "templateId 파라미터가 필요합니다." }, { status: 400 });
  }

  const r2Key = `${R2_KEY_PREFIX}/${templateId}/thumbnail.webp`;
  const cdnBase = process.env.NEXT_PUBLIC_R2_CDN_URL;
  const cdnUrl = cdnBase ? `${cdnBase}/${r2Key}` : null;

  try {
    const r2Client = getR2Client();
    await r2Client.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: r2Key }));
    return NextResponse.json({ exists: true, templateId, r2Key, cdnUrl });
  } catch (error: any) {
    if (error?.name === "NotFound" || error?.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ exists: false, templateId, r2Key, cdnUrl: null });
    }
    return NextResponse.json({ error: error?.message ?? String(error) }, { status: 500 });
  }
}
