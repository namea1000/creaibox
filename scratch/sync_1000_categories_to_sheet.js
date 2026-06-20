const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// 접미사 제거를 통해 기존 데이터 매칭을 원활하게 돕는 헬퍼 함수
function getCleanKey(text) {
  if (!text) return "";
  return text
    .replace(/\s*\(봄\/여름 시즌\)\s*$/, "")
    .replace(/\s*\(가을\/겨울 시즌\)\s*$/, "")
    .trim()
    .toLowerCase();
}

async function syncCategoriesToSheet() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I";

  console.log("Loading generated 1,400 categories from JSON...");
  const categoriesPath = path.join(__dirname, "categories_1000.json");
  if (!fs.existsSync(categoriesPath)) {
    throw new Error(`JSON file not found at: ${categoriesPath}`);
  }
  const newCategories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

  console.log("Fetching existing sheets data to preserve already filled prompts...");
  // 기존 시트의 전체 데이터 로드 (최대 100행 내에 기존 작성 데이터가 모여 있음)
  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:M100"
  });

  const existingRows = getRes.data.values || [];
  const existingHeaders = existingRows[0] || [];
  
  // 이미 작성된 프롬프트 캐싱 (Cleaned Key 기반으로 매핑)
  const promptCache = new Map();
  
  if (existingRows.length > 1) {
    for (let i = 1; i < existingRows.length; i++) {
      const row = existingRows[i];
      const primary = row[0] || "";
      const secondary = row[1] || "";
      const tertiary = row[2] || "";
      
      // D열부터 M열까지 10개 프롬프트 추출
      const prompts = [];
      for (let colIdx = 3; colIdx < 13; colIdx++) {
        prompts.push(row[colIdx] || "");
      }

      // 프롬프트가 최소 1개 이상 들어있는 경우에만 캐시
      if (prompts.some(p => p.trim() !== "")) {
        const cacheKey = `${getCleanKey(primary)}|${getCleanKey(secondary)}|${getCleanKey(tertiary)}`;
        promptCache.set(cacheKey, prompts);
      }
    }
  }

  console.log(`Preserved ${promptCache.size} existing prompt sets from Google Sheet.`);

  // 1. 헤더 정의 (10종 스타일 명세)
  const headers = [
    [
      "1차 대분류 카테고리 (Primary)", 
      "2차 중분류 카테고리 (Secondary)", 
      "3차 소분류 추천 키워드 (Tertiary Keywords)", 
      "이미지 프롬프트 (Image Prompts)_Photorealistic", 
      "이미지 프롬프트 (Image Prompts)_Illustration", 
      "이미지 프롬프트 (Image Prompts)_Vector",
      "이미지 프롬프트 (Image Prompts)_3D Render",
      "이미지 프롬프트 (Image Prompts)_Anime",
      "이미지 프롬프트 (Image Prompts)_Pixel Art",
      "이미지 프롬프트 (Image Prompts)_Watercolor",
      "이미지 프롬프트 (Image Prompts)_Line Art",
      "이미지 프롬프트 (Image Prompts)_Seamless Pattern",
      "이미지 프롬프트 (Image Prompts)_Retro Pop Art"
    ]
  ];

  // 2. 1,400개 로우 조립 및 기존 프롬프트 보존
  let matchedCount = 0;
  const rows = newCategories.map((item) => {
    // 캐시 키 조립
    const cacheKey = `${getCleanKey(item.primary)}|${getCleanKey(item.secondary)}|${getCleanKey(item.tertiary)}`;
    const cachedPrompts = promptCache.get(cacheKey);

    const promptValues = cachedPrompts || Array(10).fill(""); // 캐시가 없으면 빈 값으로 채움
    if (cachedPrompts) {
      matchedCount++;
    }

    return [
      item.primary,
      item.secondary,
      item.tertiary,
      ...promptValues
    ];
  });

  console.log(`Matched and preserved prompts for ${matchedCount} rows.`);

  const finalValues = [...headers, ...rows];
  const totalRowsCount = finalValues.length;

  console.log(`Clearing existing sheet content to prepare for ${totalRowsCount} rows...`);
  // 시트 전체 내용 초기화
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "시트1!A1:M2000"
  });

  console.log(`Uploading ${totalRowsCount} rows to Google Sheet...`);
  // 일괄 쓰기 수행 (1,400개 뼈대 + 기존 매칭 데이터)
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `시트1!A1:M${totalRowsCount}`,
    valueInputOption: "RAW",
    requestBody: {
      values: finalValues
    }
  });

  // 셀 너비 자동 재정렬 요청
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 13
            }
          }
        }
      ]
    }
  });

  console.log(`Successfully synchronized ${newCategories.length} categories (Total ${totalRowsCount} rows) to Google Sheet!`);
}

syncCategoriesToSheet().catch((err) => {
  console.error("Synchronization to sheet failed:", err);
});
