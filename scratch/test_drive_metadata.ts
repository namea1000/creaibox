import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function inspect() {
  const res = await drive.files.list({
    q: "mimeType stripe 'image/' and name contains 'climber' and trashed = false", // Wait, mimeType starts with image/
    q: "mimeType = 'image/png' or mimeType = 'image/jpeg' and trashed = false",
    fields: "files(id, name, mimeType, imageMediaMetadata)",
    pageSize: 10,
  });
  
  console.log(`Found ${res.data.files?.length || 0} images:`);
  res.data.files?.forEach((f) => {
    console.log(`- Name: ${f.name}`);
    console.log(`  imageMediaMetadata:`, f.imageMediaMetadata);
  });
}

inspect().catch(console.error);
