import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  console.error("Missing GCP credentials");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const docs = google.docs({ version: "v1", auth: oauth2Client });
const documentId = "1CevHSgtJn0F45KkF6puddN0aQpunjege5OYB5BDBmGU";

async function main() {
  try {
    const doc = await docs.documents.get({ documentId });
    console.log("Document Title:", doc.data.title);
    console.log("Body length:", doc.data.body?.content?.length);
  } catch (err: any) {
    console.error("Error reading doc:", err.message);
  }
}

main();
