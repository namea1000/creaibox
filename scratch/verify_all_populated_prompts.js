const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

async function verifyAllPopulatedPrompts() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  console.log("Fetching all rows from '시트1!A1:V350'...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:V350"
  });

  const rows = res.data.values || [];
  console.log(`Total rows fetched: ${rows.length}`);

  if (rows.length === 0) {
    console.error("No data found in the sheet.");
    return;
  }

  const headers = rows[0];
  console.log("Headers:", headers.slice(0, 20));

  // Column indices
  // H: category (7)
  // K: prompt (10)
  // N: 테마 설명(한글) (13)
  // O: 테마 설명(영문) (14)
  // P: 1. 메인 페이지 히어로 섹션 (15)
  // Q: 2. 메인 페이지 포트폴리오/작품 리스트 (16)
  // R: 3. 메인 페이지 소개/프로필/연혁 (17)
  // S: 4. 서브페이지 배너 (18)

  let emptyCount = 0;
  let invalidFormatCount = 0;
  const emptyRows = [];
  const invalidRows = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const templateId = row[1];
    if (!templateId) continue;

    const hero = row[15];
    const portfolio = row[16];
    const about = row[17];
    const subpage = row[18];

    // Check if empty
    if (!hero || !portfolio || !about || !subpage || 
        hero.trim() === "" || portfolio.trim() === "" || 
        about.trim() === "" || subpage.trim() === "") {
      emptyCount++;
      emptyRows.push({ row: i + 1, id: templateId, hero, portfolio, about, subpage });
      continue;
    }

    // Check if they end with no text parameters correctly
    const heroOk = hero.includes(", no text --ar 16:9");
    const portfolioOk = portfolio.includes(", no text --ar 4:3");
    const aboutOk = about.includes(", no text --ar 1:1");
    const subpageOk = subpage.includes(", no text --ar 16:9");

    if (!heroOk || !portfolioOk || !aboutOk || !subpageOk) {
      invalidFormatCount++;
      invalidRows.push({
        row: i + 1,
        id: templateId,
        heroOk,
        portfolioOk,
        aboutOk,
        subpageOk,
        hero,
        portfolio,
        about,
        subpage
      });
    }
  }

  console.log("\n--- Verification Summary ---");
  console.log(`Total templates checked: ${rows.length - 1}`);
  console.log(`Fully populated templates: ${rows.length - 1 - emptyCount}`);
  console.log(`Templates with empty section prompts: ${emptyCount}`);
  console.log(`Templates with invalid format/missing parameters: ${invalidFormatCount}`);

  if (emptyCount > 0) {
    console.log("\n--- Empty Rows (First 5) ---");
    console.log(emptyRows.slice(0, 5));
  }

  if (invalidFormatCount > 0) {
    console.log("\n--- Invalid Format Rows (First 5) ---");
    console.log(invalidRows.slice(0, 5));
  }
}

verifyAllPopulatedPrompts().catch(err => console.error(err));
