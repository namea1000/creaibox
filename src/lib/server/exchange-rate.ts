/**
 * Realtime USD to KRW Exchange Rate Fetcher with Server-Side Caching (1 Hour Memory Cache)
 */

let cachedRate: number | null = null;
let cacheTime = 0;

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 Hour
const DEFAULT_FALLBACK_RATE = 1418.5; // Naver / Hana Bank current benchmark rate

export async function getUsdToKrwRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if valid (less than 1 hour old)
  if (cachedRate && now - cacheTime < CACHE_DURATION_MS) {
    return cachedRate;
  }

  try {
    // Fetch live USD to KRW exchange rate from reliable open exchange API
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // 1 Hour CDN Cache
    });

    if (res.ok) {
      const data = await res.json();
      const liveRate = data?.rates?.KRW;

      if (liveRate && typeof liveRate === "number" && liveRate > 1000 && liveRate < 2000) {
        cachedRate = liveRate;
        cacheTime = now;
        return liveRate;
      }
    }
  } catch (err) {
    console.warn("Realtime exchange rate fetch warn, using fallback rate:", err);
  }

  // Fallback if API fails
  return cachedRate || DEFAULT_FALLBACK_RATE;
}
