const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in .env.local.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  const listResponse = await drive.files.list({
    q: "name contains 'CreAibox_Template_Image_Prompts' and mimeType = 'application/vnd.google-apps.spreadsheet'",
    fields: "files(id, name)",
  });

  const files = listResponse.data.files;
  if (!files || files.length === 0) {
    console.log("No sheet found by that name.");
    return;
  }

  const spreadsheetId = files[0].id;
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetName = meta.data.sheets[0].properties.title;

  const readResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z200`, // Row 63 to 109 are well within 200
  });

  const rows = readResponse.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  console.log("=== EMPTY N~S ROWS [#1] to [#4] ===");
  let count = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    
    const nToS = row.slice(13, 19);
    const hasValues = nToS.some(val => val && val.trim() !== "");
    
    if (!hasValues || row.length <= 13) {
      count++;
      if (count <= 4) {
        console.log(`\n[#${count}] Sheet Row Number: ${i + 1}`);
        console.log(`- Category: ${row[0]}`);
        console.log(`- Template ID: ${row[1]}`);
        console.log(`- Name (Ko): ${row[2]}`);
        console.log(`- Name (En): ${row[3]}`);
        console.log(`- Theme Mode: ${row[4]}`);
        console.log(`- Font Family: ${row[5]}`);
        console.log(`- Colors (Primary/Secondary/Accent/Bg): ${row[6]} / ${row[7]} / ${row[8]} / ${row[9]}`);
        console.log(`- Prompt: ${row[10]}`);
        console.log(`- Image Filename: ${row[11]}`);
        console.log(`- Status: ${row[12]}`);
      }
    }
  }
}

main().catch(err => console.error(err));
