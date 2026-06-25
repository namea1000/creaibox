const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const SPREADSHEET_ID = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// Convert column index (0-based) to A1 notation column letter
function colIndexToLabel(index) {
  let label = "";
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

function appendNoText(text) {
  if (!text || typeof text !== "string") return "";
  const trimmed = text.trim();
  if (trimmed === "") return "";

  // If "no text" already exists (case-insensitive), don't duplicate it
  if (/no\s+text/i.test(trimmed)) {
    return trimmed;
  }

  // Remove any trailing punctuation or spaces, then append ", no text"
  const cleanText = trimmed.replace(/[.,\s]+$/, "");
  return `${cleanText}, no text`;
}

async function main() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  console.log("Fetching spreadsheet data...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "시트1!A1:O350", // Fetch columns up to O (Column N and O are index 13 and 14)
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.error("No data found in the spreadsheet.");
    return;
  }

  const headers = rows[0];
  console.log("Spreadsheet headers:", headers);

  const colNIndex = 13; // Column N: 테마 설명(한글)
  const colOIndex = 14; // Column O: 테마 설명(영문)

  console.log(`Column N: ${headers[colNIndex]} (Column ${colIndexToLabel(colNIndex)})`);
  console.log(`Column O: ${headers[colOIndex]} (Column ${colIndexToLabel(colOIndex)})`);

  const updatedRows = [];
  let updatesCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const origN = row[colNIndex] || "";
    const origO = row[colOIndex] || "";

    const updatedN = appendNoText(origN);
    const updatedO = appendNoText(origO);

    if (origN !== updatedN || origO !== updatedO) {
      updatesCount++;
    }

    updatedRows.push([updatedN, updatedO]);
  }

  console.log(`Prepared updates for ${updatesCount} rows in Columns N and O.`);

  if (updatesCount > 0) {
    const writeRange = `시트1!${colIndexToLabel(colNIndex)}2:${colIndexToLabel(colOIndex)}${rows.length}`;
    console.log(`Writing updates to range ${writeRange}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: writeRange,
      valueInputOption: "RAW",
      requestBody: {
        values: updatedRows,
      },
    });
  }

  console.log("==========================================");
  console.log("Columns N and O successfully updated with ', no text'!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to update Columns N and O:", err);
});
