/**
 * Utility function to format and normalize image URLs across CreAibox.
 * Routes Google Drive & googleusercontent URLs through the server proxy endpoint (/api/free-assets/proxy)
 * with smart WebP compression (thumb: 800px 30~40KB, detail: 1400px high quality).
 */
export function formatImageUrl(
  url: string | null | undefined,
  options?: { type?: "thumb" | "detail" | "content"; w?: number }
): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If already data URI, return directly
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  const typeParam = options?.type || "thumb";
  const widthParam = options?.w ? `&w=${options.w}` : "";

  // If already proxied, append optimization params if missing
  if (trimmed.includes("/api/free-assets/proxy")) {
    if (!trimmed.includes("type=") && !trimmed.includes("w=")) {
      const sep = trimmed.includes("?") ? "&" : "?";
      return `${trimmed}${sep}type=${typeParam}${widthParam}`;
    }
    return trimmed;
  }

  // Route Google Drive / googleusercontent URLs through server proxy
  if (trimmed.includes("googleusercontent.com") || trimmed.includes("drive.google.com")) {
    return `/api/free-assets/proxy?url=${encodeURIComponent(trimmed)}&type=${typeParam}${widthParam}`;
  }

  return trimmed;
}

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl = DEFAULT_FALLBACK_IMAGE) {
  const target = e.currentTarget;
  target.onerror = null; // prevent infinite loop
  target.src = fallbackUrl;
}
