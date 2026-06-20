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

async function readSampleSheet() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I";

  console.log("Reading data from 'Sample' sheet without range limit...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sample"
  });
  console.log("Sample sheet rows count:", res.data.values ? res.data.values.length : 0);
  if (res.data.values) {
    console.log("First 5 rows of Sample sheet:", res.data.values.slice(0, 5));
  }
}

readSampleSheet().catch(err => console.error(err));
