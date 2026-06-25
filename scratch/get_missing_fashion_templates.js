const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const CATEGORIES_DIR = "./src/lib/templates/categories";
const PREVIEWS_DIR = "./public/templates";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
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

    const catMatch = block.match(/category:\s*"([^"]+)"/);
    const cat = catMatch ? catMatch[1] : "";

    templates.push({ templateId: tid, name, category: cat });
  }
  return templates;
}

async function main() {
  // 1. Get all templates
  const templates = [];
  const files = fs.readdirSync(CATEGORIES_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const categoryTemplates = parseCategoryFile(path.join(CATEGORIES_DIR, file));
      templates.push(...categoryTemplates);
    }
  }

  // 2. Get existing previews
  const existingPreviews = new Set(
    fs.readdirSync(PREVIEWS_DIR)
      .filter(f => f.endsWith(".png"))
      .map(f => f.replace(".png", ""))
  );

  // 3. Find missing Fashion & Beauty templates
  const missingFashion = templates.filter(t => 
    (t.category === "Fashion & Beauty" || t.category.includes("Fashion") || t.category.includes("Beauty")) && 
    !existingPreviews.has(t.templateId)
  );
  console.log(`Missing Fashion & Beauty templates: ${missingFashion.length}`);
  console.log("Missing IDs:", missingFashion.map(t => t.templateId));

  if (missingFashion.length === 0) {
    console.log("No missing Fashion templates!");
    return;
  }

  // 4. Fetch details from Google Sheet
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:V350"
  });

  const rows = res.data.values || [];
  const targetIds = missingFashion.map(t => t.templateId);

  console.log("\n--- Details for Missing Fashion Templates ---");
  for (const row of rows) {
    const templateId = row[1];
    if (targetIds.includes(templateId)) {
      console.log(`\nTemplate ID: ${templateId}`);
      console.log(`Name (KO): ${row[2]}`);
      console.log(`Prompt (K): ${row[10]}`);
    }
  }
}

main().catch(err => console.error(err));
