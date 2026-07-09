import { NextRequest } from "next/server";
import { getGoogleDriveBuffer } from "@/lib/google-drive";

export const runtime = "nodejs";

/**
 * Extracts Google Drive file ID from various Google Drive URL formats.
 */
function extractGDriveFileId(url: string): string | null {
  // Format 4: https://lh3.googleusercontent.com/d/FILE_ID or similar googleusercontent.com hosting url
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

  // Determine the target Google Drive File ID (either passed directly or parsed from a URL)
  let fileId: string | null = id || null;
  if (!fileId && url) {
    fileId = extractGDriveFileId(url);
  }

  // Parse Range header for streaming support (e.g. audio/video seeking)
  const rangeHeader = req.headers.get("range") || undefined;

  try {
    if (fileId) {
      // Fetch securely using Google Drive API and server-side credentials
      const res = await getGoogleDriveBuffer(fileId, rangeHeader);

      const getHeader = (h: any, key: string): string | undefined => {
        if (!h) return undefined;
        if (typeof h.get === "function") {
          return h.get(key) || undefined;
        }
        return h[key] || h[key.toLowerCase()] || h[key.toUpperCase()] || undefined;
      };

      const contentType = getHeader(res.headers, "Content-Type") || "application/octet-stream";
      const buffer = new Uint8Array(res.data);
      
      const download = searchParams.get("download");
      const filename = searchParams.get("filename") || "download";

      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes",
        // Force Vercel Edge Network CDN and browser to cache this permanently (1 year)
        // Since Google Drive assets do not change under the same file ID
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      };

      if (download === "true") {
        headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
      }

      const contentLength = getHeader(res.headers, "Content-Length");
      if (contentLength) {
        headers["Content-Length"] = String(contentLength);
      }
      
      const contentRange = getHeader(res.headers, "Content-Range");
      if (contentRange) {
        headers["Content-Range"] = String(contentRange);
      }

      return new Response(buffer, {
        status: res.status,
        headers,
      });
    } else if (url) {
      // Fallback: Proxy non-Google-Drive URLs (with Supabase Storage optimization and streaming support)
      const isSupabaseStorage = url.includes("supabase.co/storage/v1/object") || url.includes("/storage/v1/object/public");

      const fetchHeaders: HeadersInit = {};
      if (rangeHeader) {
        fetchHeaders["Range"] = rangeHeader;
      }

      const response = await fetch(url, { headers: fetchHeaders });
      if (!response.ok && response.status !== 206) {
        return new Response("Failed to fetch target asset", { status: response.status });
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const buffer = await response.arrayBuffer();

      const download = searchParams.get("download");
      const filename = searchParams.get("filename") || "download";

      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      };

      if (download === "true") {
        headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
      }

      const acceptRanges = response.headers.get("accept-ranges");
      if (acceptRanges) headers["Accept-Ranges"] = acceptRanges;

      const contentRange = response.headers.get("content-range");
      if (contentRange) headers["Content-Range"] = contentRange;

      const contentLength = response.headers.get("content-length");
      if (contentLength) headers["Content-Length"] = contentLength;

      if (isSupabaseStorage) {
        // Force Vercel Edge Network CDN and browser to cache Supabase assets permanently (1 year) to save bandwidth costs
        headers["Cache-Control"] = "public, max-age=31536000, s-maxage=31536000, immutable";
      } else {
        // Cache external general assets for 1 day
        headers["Cache-Control"] = "public, max-age=86400, s-maxage=86400";
      }

      return new Response(new Uint8Array(buffer), {
        status: response.status,
        headers,
      });
    } else {
      return new Response("Missing url or id parameter", { status: 400 });
    }
  } catch (error: any) {
    console.error("Google Drive proxy error:", error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}
