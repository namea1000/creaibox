import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Supabase Storage CDN Caching Proxy Route Handler.
 * Intercepts Supabase Storage public asset URLs and wraps them with a permanent 1-year cache header
 * to completely eliminate Supabase Storage Egress (bandwidth) costs via Vercel Edge Cache.
 * Also supports Partial Content (Range requests) for audio/video streaming timeline seeking.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Parse Range header for streaming support
  const rangeHeader = req.headers.get("range") || undefined;

  try {
    const fetchHeaders: HeadersInit = {};
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const response = await fetch(url, { headers: fetchHeaders });
    if (!response.ok && response.status !== 206) {
      return new Response("Failed to fetch target Supabase asset", { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      // Force Vercel Edge Network CDN and browser to cache Supabase assets permanently (1 year)
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    };

    const acceptRanges = response.headers.get("accept-ranges");
    if (acceptRanges) headers["Accept-Ranges"] = acceptRanges;

    const contentRange = response.headers.get("content-range");
    if (contentRange) headers["Content-Range"] = contentRange;

    const contentLength = response.headers.get("content-length");
    if (contentLength) headers["Content-Length"] = contentLength;

    return new Response(new Uint8Array(buffer), {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error("Supabase Storage proxy error:", error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}
