import { NextRequest } from "next/server";
import { getGoogleDriveBuffer } from "@/lib/google-drive";

export const runtime = "nodejs";

/**
 * Extracts Google Drive file ID from various Google Drive URL formats.
 */
function extractGDriveFileId(url: string): string | null {
  if (url.includes("googleusercontent.com")) {
    const lhMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (lhMatch && lhMatch[1]) return lhMatch[1];
  }

  if (!url.includes("drive.google.com")) return null;
  
  // Format 1: https://drive.google.com/file/d/FILE_ID/view...
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  
  // Format 2: https://drive.google.com/uc?export=download&id=FILE_ID
  // Format 3: https://drive.google.com/open?id=FILE_ID
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  const id = searchParams.get("id");
  const download = searchParams.get("download");
  const filename = searchParams.get("filename") || "download";
  const type = searchParams.get("type") || "thumb"; // 'thumb' | 'detail'
  const customWidth = searchParams.get("w");

  // Determine the target Google Drive File ID
  let fileId: string | null = id || null;
  if (!fileId && url) {
    fileId = extractGDriveFileId(url);
  }

  const rangeHeader = req.headers.get("range") || undefined;

  try {
    if (fileId) {
      // 1. 다운로드 요청 시 원본 구글 드라이브 API 버퍼 바로 반환
      if (download === "true") {
        const res = await getGoogleDriveBuffer(fileId, rangeHeader);
        const contentType = res.headers["content-type"] || res.headers["Content-Type"] || "application/octet-stream";
        const buffer = new Uint8Array(res.data);

        return new Response(buffer, {
          status: res.status,
          headers: {
            "Content-Type": String(contentType),
            "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      // 2. 화면 표시용 (썸네일 vs 본문 고화질 스마트 분리 옵션)
      // width 설정: thumb => 800px (30~40KB), detail => 1400px (100~150KB 고화질)
      let targetWidth = 800;
      if (customWidth && !isNaN(Number(customWidth))) {
        targetWidth = Number(customWidth);
      } else if (type === "detail" || type === "content") {
        targetWidth = 1400;
      }

      // Google Hosting CDN URL (자동 WebP 변환 파라미터 적용)
      const googleCdnUrl = `https://lh3.googleusercontent.com/d/${fileId}=w${targetWidth}-rw`;

      const cdnResp = await fetch(googleCdnUrl, {
        headers: rangeHeader ? { Range: rangeHeader } : undefined,
      });

      if (cdnResp.ok) {
        const buffer = await cdnResp.arrayBuffer();
        const contentType = cdnResp.headers.get("content-type") || "image/webp";

        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        });
      }

      // CDN 실패 시 Fallback API 구동
      const res = await getGoogleDriveBuffer(fileId, rangeHeader);
      const contentType = res.headers["content-type"] || res.headers["Content-Type"] || "image/webp";
      const buffer = new Uint8Array(res.data);

      return new Response(buffer, {
        status: res.status,
        headers: {
          "Content-Type": String(contentType),
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        },
      });
    } else if (url) {
      // 일반 외부 URL 프록시
      const isSupabaseStorage = url.includes("supabase.co/storage/v1/object") || url.includes("/storage/v1/object/public");
      const fetchHeaders: HeadersInit = {};
      if (rangeHeader) fetchHeaders["Range"] = rangeHeader;

      const response = await fetch(url, { headers: fetchHeaders });
      if (!response.ok && response.status !== 206) {
        return new Response("Failed to fetch target asset", { status: response.status });
      }

      const contentType = response.headers.get("content-type") || "image/webp";
      const buffer = await response.arrayBuffer();

      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      };

      if (download === "true") {
        headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
      }

      headers["Cache-Control"] = isSupabaseStorage
        ? "public, max-age=31536000, s-maxage=31536000, immutable"
        : "public, max-age=86400, s-maxage=86400";

      return new Response(new Uint8Array(buffer), {
        status: response.status,
        headers,
      });
    } else {
      return new Response("Missing url or id parameter", { status: 400 });
    }
  } catch (error: any) {
    console.error("Google Drive proxy error:", error);
    return Response.redirect(
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      302
    );
  }
}
