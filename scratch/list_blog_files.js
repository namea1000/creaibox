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

  const targetFolderId = "1GBVbKRx9zjZIFlDVg5dn-qi_zCve5xT1"; // cozy_cafe_cream
  console.log(`Scanning contents of cozy_cafe_cream (${targetFolderId})...`);

  const filesResponse = await drive.files.list({
    q: `'${targetFolderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
    pageSize: 100,
  });
  
  const files = filesResponse.data.files || [];
  console.log(`Found ${files.length} files:`);
  for (const f of files) {
    console.log(`- File: "${f.name}", ID: ${f.id}, Type: ${f.mimeType}`);
  }
}

main().catch(err => console.error(err));
