/**
 * IndexNow Protocol Client for Bing, Yandex, Naver SearchAdvisor, and Seznam
 * Official Spec: https://www.indexnow.org/
 */

export const DEFAULT_INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "c8f9d072b21e4f20a7b539829e1f3a2b";

interface IndexNowPingParams {
  url?: string;
  urls?: string[];
  key?: string;
}

interface IndexNowPingResult {
  success: boolean;
  urls: string[];
  status?: number;
  message?: string;
  endpoints?: Record<string, { status: number; ok: boolean }>;
}

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

// Memory cache for in-flight throttling (1 hour cooldown = 3,600,000 ms)
const PING_COOLDOWN_MS = 60 * 60 * 1000;
const lastPingMap = new Map<string, { timestamp: number; pendingTimer?: NodeJS.Timeout }>();

export async function sendIndexNowPing({
  url,
  urls,
  key = DEFAULT_INDEXNOW_KEY,
}: IndexNowPingParams): Promise<IndexNowPingResult> {
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
      message: "유효한 URL이 제공되지 않았습니다.",
    };
  }

  try {
    const firstUrl = new URL(validUrls[0]);
    const host = firstUrl.host;

    const payload = {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: validUrls,
    };

    const endpointResults: Record<string, { status: number; ok: boolean }> = {};

    const pingPromises = INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        endpointResults[endpoint] = {
          status: res.status,
          ok: res.ok || res.status === 200 || res.status === 202,
        };
      } catch (err: any) {
        endpointResults[endpoint] = {
          status: 500,
          ok: false,
        };
      }
    });

    await Promise.all(pingPromises);

    const isAnySuccess = Object.values(endpointResults).some((r) => r.ok);

    // Update in-memory timestamp for each URL
    const now = Date.now();
    for (const u of validUrls) {
      const existing = lastPingMap.get(u);
      if (existing?.pendingTimer) {
        clearTimeout(existing.pendingTimer);
      }
      lastPingMap.set(u, { timestamp: now });
    }

    console.log(
      `[IndexNow] Sent ping for ${validUrls.length} URLs on host: ${host}. Success: ${isAnySuccess}`
    );

    return {
      success: isAnySuccess,
      urls: validUrls,
      endpoints: endpointResults,
      message: isAnySuccess
        ? "Bing/Yandex IndexNow 핑 전송 성공"
        : "IndexNow 핑 전송 실패",
    };
  } catch (err: any) {
    console.error("[IndexNow Error]:", err);
    return {
      success: false,
      urls: validUrls,
      message: err.message || "IndexNow 핑 전송 중 오류 발생",
    };
  }
}

/**
 * Smart Throttled IndexNow Ping with Trailing Edge Guarantee (1 Hour Cooldown)
 */
export async function sendThrottledIndexNowPing({
  url,
  urls,
}: IndexNowPingParams): Promise<{ status: "SENT" | "SCHEDULED_TRAILING" | "SKIPPED"; result?: IndexNowPingResult }> {
  const targetUrls: string[] = [];
  if (url) targetUrls.push(url);
  if (urls && Array.isArray(urls)) targetUrls.push(...urls);

  const firstUrlStr = targetUrls[0];
  if (!firstUrlStr) return { status: "SKIPPED" };

  const now = Date.now();
  const existing = lastPingMap.get(firstUrlStr);

  // If never pinged or last ping was > 1 hour ago: send immediately!
  if (!existing || now - existing.timestamp >= PING_COOLDOWN_MS) {
    const result = await sendIndexNowPing({ urls: targetUrls });
    return { status: "SENT", result };
  }

  // If within 1 hour cooldown: Schedule Trailing Edge Ping when cooldown expires!
  const remainingTimeMs = PING_COOLDOWN_MS - (now - existing.timestamp);

  // Clear existing pending timer if user keeps editing
  if (existing.pendingTimer) {
    clearTimeout(existing.pendingTimer);
  }

  const newTimer = setTimeout(async () => {
    console.log(
      `[IndexNow Trailing Ping] Executing scheduled trailing ping for ${firstUrlStr}`
    );
    await sendIndexNowPing({ urls: targetUrls });
  }, remainingTimeMs);

  lastPingMap.set(firstUrlStr, {
    timestamp: existing.timestamp,
    pendingTimer: newTimer,
  });

  console.log(
    `[IndexNow Cooldown] Ping throttled for ${firstUrlStr}. Trailing ping scheduled in ${Math.round(
      remainingTimeMs / 1000 / 60
    )} minutes.`
  );

  return { status: "SCHEDULED_TRAILING" };
}
