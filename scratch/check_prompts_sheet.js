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

async function checkPromptsSheet() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  console.log("Reading data from '시트1!A1:Q50'...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:Q50"
  });

  const rows = res.data.values || [];
  console.log("Total rows fetched:", rows.length);

  if (rows.length > 0) {
    const headers = rows[0];
    console.log("Headers (A1:Q1):", headers);
    console.log("N1:", headers[13] || "(empty)");
    console.log("O1:", headers[14] || "(empty)");
    console.log("P1:", headers[15] || "(empty)");
    console.log("Q1:", headers[16] || "(empty)");

    // Search for 3d_motion_art
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === "3d_motion_art") {
        console.log(`Found '3d_motion_art' at Row ${i + 1}:`, row);
      }
    }
  }
}

checkPromptsSheet().catch(err => console.error(err));
