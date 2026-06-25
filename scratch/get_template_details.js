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

async function getTemplateDetails() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:V350"
  });

  const rows = res.data.values || [];
  const targetIds = ["calligrapher_ink_studio", "eco_green_earth", "indie_band_rebel"];
  
  console.log("--- Details of Target Templates ---");
  for (const row of rows) {
    const templateId = row[1];
    if (targetIds.includes(templateId)) {
      console.log(`\nTemplate ID: ${templateId}`);
      console.log(`Name (KO): ${row[2]}`);
      console.log(`Primary Color: ${row[6]}`);
      console.log(`Secondary Color: ${row[7]}`);
      console.log(`Prompt (K): ${row[10]}`);
      console.log(`Hero Prompt (P): ${row[15]}`);
    }
  }
}

getTemplateDetails().catch(err => console.error(err));
