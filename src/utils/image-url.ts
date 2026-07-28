/**
 * Utility function to format and normalize image URLs across CreAibox.
 * Routes Google Drive & googleusercontent URLs through the server proxy endpoint (/api/free-assets/proxy)
 * to ensure 100% reliable image loading in Incognito mode, mobile, and guest contexts.
 */
export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If already proxied or data URI, return directly
  if (trimmed.startsWith("data:") || trimmed.includes("/api/free-assets/proxy")) {
    return trimmed;
  }

  // Route Google Drive / googleusercontent URLs through server proxy
  if (trimmed.includes("googleusercontent.com") || trimmed.includes("drive.google.com")) {
    return `/api/free-assets/proxy?url=${encodeURIComponent(trimmed)}`;
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
