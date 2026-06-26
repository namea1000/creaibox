import { NextRequest } from "next/server";
import { getGoogleDriveBuffer } from "@/lib/google-drive";
import sharp from "sharp";

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

  // Thumbnail dimensions
  const wStr = searchParams.get("w") || searchParams.get("width");
  const hStr = searchParams.get("h") || searchParams.get("height");
  const w = wStr ? parseInt(wStr, 10) : null;
  const h = hStr ? parseInt(hStr, 10) : null;

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

      let contentType = getHeader(res.headers, "Content-Type") || "application/octet-stream";
      let buffer = new Uint8Array(res.data);

      // Apply image resizing and WebP conversion for caching optimization
      if (contentType.startsWith("image/") && contentType !== "image/svg+xml" && (w || h)) {
        try {
          let sharpInstance = sharp(buffer);
          sharpInstance = sharpInstance.resize({
            width: w || undefined,
            height: h || undefined,
            fit: "inside",
            withoutEnlargement: true,
          });
          
          const resizedBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
          buffer = new Uint8Array(resizedBuffer);
          contentType = "image/webp";
        } catch (resizeError) {
          console.error("Failed to resize Google Drive image, serving original:", resizeError);
        }
      }
      
      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes",
        // Force Vercel Edge Network CDN and browser to cache this permanently (1 year)
        // Since Google Drive assets do not change under the same file ID/dimensions
        "Cache-Control": "public, max-age=31536000, immutable",
      };

      // Only set Content-Length for non-resized assets since resized buffer length has changed
      if (!(contentType === "image/webp" && (w || h))) {
        const contentLength = getHeader(res.headers, "Content-Length");
        if (contentLength) {
          headers["Content-Length"] = String(contentLength);
        }
      } else {
        headers["Content-Length"] = String(buffer.byteLength);
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
      // Fallback: Proxy non-Google-Drive URLs (existing logic)
      const response = await fetch(url);
      if (!response.ok) {
        return new Response("Failed to fetch target asset", { status: response.status });
      }

      let contentType = response.headers.get("content-type") || "application/octet-stream";
      const rawBuffer = await response.arrayBuffer();
      let buffer: ArrayBuffer | Buffer = rawBuffer;

      // Apply image resizing and WebP conversion for caching optimization
      if (contentType.startsWith("image/") && contentType !== "image/svg+xml" && (w || h)) {
        try {
          let sharpInstance = sharp(Buffer.from(rawBuffer));
          sharpInstance = sharpInstance.resize({
            width: w || undefined,
            height: h || undefined,
            fit: "inside",
            withoutEnlargement: true,
          });
          
          buffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
          contentType = "image/webp";
        } catch (resizeError) {
          console.error("Failed to resize external image, serving original:", resizeError);
        }
      }

      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          // Cache external assets permanently if resized, otherwise for 1 day
          "Cache-Control": w || h ? "public, max-age=31536000, immutable" : "public, max-age=86400",
        },
      });
    } else {
      return new Response("Missing url or id parameter", { status: 400 });
    }
  } catch (error: any) {
    console.error("Google Drive proxy error:", error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}
