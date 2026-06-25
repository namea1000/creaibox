const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const CATEGORIES_DIR = "./src/lib/templates/categories";
const SPREADSHEET_ID = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// Convert column index (0-based) to A1 notation column letter (e.g., 0 -> A, 27 -> AB)
function colIndexToLabel(index) {
  let label = "";
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

function parseCategoryFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = content.split("templateId:");
  const templates = [];

  for (let i = 1; i < blocks.length; i++) {
    let block = "templateId:" + blocks[i];

    const tidMatch = block.match(/templateId:\s*"([^"]+)"/);
    if (!tidMatch) continue;
    const tid = tidMatch[1];

    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : "";

    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const desc = descMatch ? descMatch[1] : "";

    templates.push({
      templateId: tid,
      name,
      description: desc,
    });
  }
  return templates;
}

async function main() {
  // 1. Parse all descriptions from categories directory
  console.log("Parsing templates from codebase...");
  const descriptionMap = new Map();
  const files = fs.readdirSync(CATEGORIES_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const categoryTemplates = parseCategoryFile(path.join(CATEGORIES_DIR, file));
      categoryTemplates.forEach((t) => {
        if (t.templateId && t.description) {
          descriptionMap.set(t.templateId, t.description);
        }
      });
    }
  }
  console.log(`Parsed ${descriptionMap.size} template descriptions from codebase.`);

  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  // 2. Fetch the current sheet data (up to column Z to find the new column)
  console.log("Fetching spreadsheet columns and rows...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "시트1!A1:Z350",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.error("No data found in the spreadsheet.");
    return;
  }

  const headers = rows[0];
  console.log("Current Sheet Headers:", headers);

  // 3. Find the column index for "테마 설명" (or similar description header)
  let targetColIndex = -1;
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].trim();
    if (h.includes("테마 설명") || h.includes("테마설명") || h.includes("설명") || h.includes("Description")) {
      targetColIndex = i;
      break;
    }
  }

  if (targetColIndex === -1) {
    // If not found, let's append a new column at the end
    targetColIndex = headers.length;
    console.log(`'테마 설명' column not found in headers. Creating a new column at index ${targetColIndex} (Column ${colIndexToLabel(targetColIndex)})`);
    // Write header "테마 설명"
    const colLetter = colIndexToLabel(targetColIndex);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `시트1!${colLetter}1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["테마 설명"]],
      },
    });
  } else {
    console.log(`Found '테마 설명' column at index ${targetColIndex} (Column ${colIndexToLabel(targetColIndex)})`);
  }

  const targetColLetter = colIndexToLabel(targetColIndex);
  console.log(`Target Column for descriptions is: ${targetColLetter}`);

  // 4. Prepare the description values for all rows
  const descriptionValues = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const templateId = row[1]; // Column B is Template ID
    const desc = descriptionMap.get(templateId) || "";
    descriptionValues.push([desc]);
  }

  // 5. Write the description values to the sheet in one batch update
  const writeRange = `시트1!${targetColLetter}2:${targetColLetter}${rows.length}`;
  console.log(`Writing ${descriptionValues.length} descriptions to range ${writeRange}...`);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: writeRange,
    valueInputOption: "RAW",
    requestBody: {
      values: descriptionValues,
    },
  });

  console.log("==========================================");
  console.log("Theme descriptions successfully synced to Google Sheet!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to sync descriptions:", err);
});
