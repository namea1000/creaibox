import { google } from "googleapis";

// Mapping category IDs to friendly Korean labels
const CATEGORIES_MAP: Record<string, string> = {
  all: "전체",
  "10": "뮤직",
  "20": "게임",
  "24": "엔터테인먼트",
  "1": "영화/애니",
  "28": "테크/IT",
  "17": "스포츠",
  "25": "뉴스/시사",
};

/**
 * Initializes the Google Sheets Client with OAuth2 config.
 */
function getSheetsClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.sheets({ version: "v4", auth: oauth2Client });
}

/**
 * Appends 12 YouTube trending video records to the continuous archive Google Sheet.
 * Rows are appended to Sheet1 in columns A to L.
 */
export async function appendTrendingToSheet(
  targetDate: string,
  categoryId: string,
  videos: any[]
): Promise<void> {
  const spreadsheetId = process.env.GCP_TRENDING_SHEET_ID;
  if (!spreadsheetId) {
    console.warn("GCP_TRENDING_SHEET_ID is not configured in environment variables. Skipping Google Sheet sync.");
    return;
  }

  const categoryLabel = CATEGORIES_MAP[categoryId] || "미분류";
  const sheets = getSheetsClient();

  // Map each video into a flat row array matching columns A-L
  const rows = videos.map((video, index) => {
    const videoId = video.id;
    const title = video.snippet?.title || "";
    const channel = video.snippet?.channelTitle || "";
    const views = video.statistics?.viewCount || "0";
    const likes = video.statistics?.likeCount || "0";
    const duration = video.contentDetails?.duration || "";
    const isShorts = video.isRealShorts ? "Yes" : "No";
    const link = `https://youtube.com/watch?v=${videoId}`;

    return [
      targetDate,
      categoryId,
      categoryLabel,
      index + 1, // Rank
      videoId,
      title,
      channel,
      views,
      likes,
      duration,
      isShorts,
      link,
    ];
  });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L",
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });
    console.log(`Successfully appended ${rows.length} rows for date ${targetDate} category ${categoryLabel} to Google Sheet.`);
  } catch (err: any) {
    console.error(`Error appending data to Google Sheet (${spreadsheetId}):`, err.message || err);
  }
}
