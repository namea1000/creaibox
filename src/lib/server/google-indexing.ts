import { google } from "googleapis";

interface IndexingPingParams {
  url: string;
  type?: "URL_UPDATED" | "URL_DELETED";
}

interface IndexingPingResult {
  success: boolean;
  url: string;
  type: "URL_UPDATED" | "URL_DELETED";
  status?: number;
  message?: string;
  data?: any;
}

// Memory cache for in-flight throttling (1 hour cooldown = 3,600,000 ms)
const PING_COOLDOWN_MS = 60 * 60 * 1000;
const lastPingMap = new Map<string, { timestamp: number; pendingTimer?: NodeJS.Timeout }>();

/**
 * Send real-time Google Indexing API Ping
 * Scope: https://www.googleapis.com/auth/indexing
 */
export async function sendGoogleIndexingPing({
  url,
  type = "URL_UPDATED",
}: IndexingPingParams): Promise<IndexingPingResult> {
  try {
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return {
        success: false,
        url,
        type,
        message: "유효하지 않은 URL 규격입니다.",
      };
    }

    const clientEmail =
      process.env.GOOGLE_INDEXING_CLIENT_EMAIL ||
      parseCredentials()?.client_email;
    const privateKey =
      process.env.GOOGLE_INDEXING_PRIVATE_KEY ||
      parseCredentials()?.private_key;

    if (!clientEmail || !privateKey) {
      console.warn(
        "[Google Indexing] Service Account 이메일 또는 Private Key가 .env.local에 설정되어 있지 않습니다."
      );
      return {
        success: false,
        url,
        type,
        message: "GOOGLE_INDEXING_CREDENTIALS 누락",
      };
    }

    // Format private key correctly if escaped \n
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: formattedPrivateKey,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const tokens = await jwtClient.authorize();
    const accessToken = tokens.access_token;

    if (!accessToken) {
      throw new Error("Google Indexing API OAuth2 Access Token 발급 실패");
    }

    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          url,
          type,
        }),
      }
    );

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "[Google Indexing API Error]",
        response.status,
        resData
      );
      return {
        success: false,
        url,
        type,
        status: response.status,
        message: resData.error?.message || "Google Indexing API 호출 오류",
        data: resData,
      };
    }

    console.log(`[Google Indexing API Success] Ping sent for ${url} (${type})`);

    // Record last ping timestamp
    const existing = lastPingMap.get(url);
    if (existing?.pendingTimer) {
      clearTimeout(existing.pendingTimer);
    }
    lastPingMap.set(url, { timestamp: Date.now() });

    return {
      success: true,
      url,
      type,
      status: response.status,
      message: "구글 실시간 색인 핑 전송 성공",
      data: resData,
    };
  } catch (err: any) {
    console.error("[Google Indexing Ping Exception]", err);
    return {
      success: false,
      url,
      type,
      message: err.message || "Unknown error",
    };
  }
}

/**
 * Smart Throttled Google Indexing Ping with Trailing Edge Guarantee (1 Hour Cooldown)
 */
export async function sendThrottledGoogleIndexingPing({
  url,
  type = "URL_UPDATED",
}: IndexingPingParams): Promise<{ status: "SENT" | "SCHEDULED_TRAILING" | "SKIPPED"; result?: IndexingPingResult }> {
  const now = Date.now();
  const existing = lastPingMap.get(url);

  // If never pinged or last ping was > 1 hour ago: send immediately!
  if (!existing || now - existing.timestamp >= PING_COOLDOWN_MS) {
    const result = await sendGoogleIndexingPing({ url, type });
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
      `[Google Indexing Trailing Ping] Executing scheduled trailing ping for ${url}`
    );
    await sendGoogleIndexingPing({ url, type });
  }, remainingTimeMs);

  lastPingMap.set(url, {
    timestamp: existing.timestamp,
    pendingTimer: newTimer,
  });

  console.log(
    `[Google Indexing Cooldown] Ping throttled for ${url}. Trailing ping scheduled in ${Math.round(
      remainingTimeMs / 1000 / 60
    )} minutes.`
  );

  return { status: "SCHEDULED_TRAILING" };
}

function parseCredentials() {
  try {
    if (process.env.GOOGLE_INDEXING_CREDENTIALS) {
      return JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);
    }
  } catch (e) {
    // Ignore JSON parse error
  }
  return null;
}
