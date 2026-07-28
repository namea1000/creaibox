import { sendGoogleIndexingPing } from "@/lib/server/google-indexing";
import { sendIndexNowPing } from "@/lib/server/indexnow";

interface UnifiedIndexingParams {
  url?: string;
  urls?: string[];
}

interface UnifiedIndexingResult {
  success: boolean;
  google?: any;
  indexnow?: any;
  urls: string[];
}

/**
 * Triggers simultaneous SEO Indexing Pings across Google, Bing, Yandex, and Naver
 */
export async function triggerUnifiedSeoIndexingPing({
  url,
  urls,
}: UnifiedIndexingParams): Promise<UnifiedIndexingResult> {
  const targetUrls: string[] = [];
  if (url) targetUrls.push(url);
  if (urls && Array.isArray(urls)) targetUrls.push(...urls);

  const validUrls = targetUrls.filter(
    (u) => typeof u === "string" && u.startsWith("http")
  );

  if (validUrls.length === 0) {
    return {
      success: false,
      urls: [],
    };
  }

  console.log(
    `[Unified SEO Indexing] Starting simultaneous pings for ${validUrls.length} URLs across Google + Bing + Yandex + Naver.`
  );

  // 1. Google Indexing API Ping
  const googlePromise = Promise.all(
    validUrls.map((u) => sendGoogleIndexingPing({ url: u }))
  ).catch((err) => ({ success: false, error: err.message }));

  // 2. IndexNow Protocol Ping (Bing, Yandex, Naver, Seznam)
  const indexNowPromise = sendIndexNowPing({ urls: validUrls }).catch((err) => ({
    success: false,
    error: err.message,
  }));

  const [googleRes, indexNowRes] = await Promise.all([
    googlePromise,
    indexNowPromise,
  ]);

  console.log(
    `[Unified SEO Indexing Finished] Google: ${JSON.stringify(
      googleRes
    )}, IndexNow (Bing/Yandex/Naver): ${JSON.stringify(indexNowRes)}`
  );

  return {
    success: true,
    google: googleRes,
    indexnow: indexNowRes,
    urls: validUrls,
  };
}
