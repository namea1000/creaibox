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

const targetSpreadsheetId = "1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I";
const targetSheetTitles = [
  "자연 & 풍경",
  "동식물 & 자연생태",
  "인물 & 라이프스타일",
  "비즈니스 & 테크",
  "판타지 & SF",
  "예술 & 추상화",
  "푸드 & 베버리지",
  "시즌 & 기념일",
  "건축 & 인테리어",
  "스포츠 & 헬스",
  "질감 & 목업 배경",
  "교육 & 의료/과학"
];

// 헤더 정의 (13열: A ~ M)
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

async function splitCategories() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  console.log("Loading 2,400 categories from JSON...");
  const categoriesPath = path.join(__dirname, "categories_1000.json");
  const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

  // 1. 스프레드시트 메타데이터 조회하여 현재 시트 탭 목록 획득
  console.log("Reading spreadsheet metadata...");
  const meta = await sheets.spreadsheets.get({ spreadsheetId: targetSpreadsheetId });
  const existingSheets = meta.data.sheets || [];
  const existingTitles = existingSheets.map(s => s.properties.title);

  // 2. 12대 대분류 시트 탭이 없으면 추가 요청 생성
  const addSheetRequests = [];
  targetSheetTitles.forEach((title) => {
    if (!existingTitles.includes(title)) {
      addSheetRequests.push({
        addSheet: {
          properties: { title: title }
        }
      });
    }
  });

  if (addSheetRequests.length > 0) {
    console.log(`Adding ${addSheetRequests.length} new sheet tabs...`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: targetSpreadsheetId,
      requestBody: { requests: addSheetRequests }
    });
  }

  // 3. 12대 대분류별로 데이터 분류하여 기입
  console.log("Writing split category datasets to respective sheets...");
  const updatePromises = targetSheetTitles.map(async (title) => {
    // 해당 대분류에 속하는 데이터만 필터링
    const filtered = categories.filter(item => item.primary === title);
    
    const rows = filtered.map(item => [
      item.primary,
      item.secondary,
      item.tertiary,
      ...Array(10).fill("") // 빈 프롬프트 영역 10개 열
    ]);

    const values = [...headers, ...rows];

    // 기존 데이터 지우기
    await sheets.spreadsheets.values.clear({
      spreadsheetId: targetSpreadsheetId,
      range: `${title}!A1:M3000`
    });

    // 새 데이터 업로드
    await sheets.spreadsheets.values.update({
      spreadsheetId: targetSpreadsheetId,
      range: `${title}!A1:M${values.length}`,
      valueInputOption: "RAW",
      requestBody: { values }
    });

    console.log(`Uploaded ${rows.length} rows to sheet: [${title}]`);
  });

  await Promise.all(updatePromises);

  // 4. 모든 대분류 시트의 서식 및 자동 열 너비 정렬 적용
  console.log("Formatting and auto-resizing sheet columns...");
  const updatedMeta = await sheets.spreadsheets.get({ spreadsheetId: targetSpreadsheetId });
  const finalSheets = updatedMeta.data.sheets || [];
  
  const formatRequests = [];

  finalSheets.forEach((sheet) => {
    const title = sheet.properties.title;
    const sheetId = sheet.properties.sheetId;

    if (targetSheetTitles.includes(title)) {
      // 헤더 포맷팅 (남색 배경 + 하얀 글씨)
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 13
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.08, green: 0.18, blue: 0.36 },
              textFormat: {
                bold: true,
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                fontSize: 10
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE"
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
      });

      // 열 너비 자동 최적화
      formatRequests.push({
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: 13
          }
        }
      });
    }
  });

  if (formatRequests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: targetSpreadsheetId,
      requestBody: { requests: formatRequests }
    });
  }

  console.log("All 12 primary categories have been successfully split and formatted on Google Sheets!");
}

splitCategories().catch(err => {
  console.error("Splitting failed:", err);
});
