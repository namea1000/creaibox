import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const docs = google.docs({ version: "v1", auth: oauth2Client });
const documentId = "1CevHSgtJn0F45KkF6puddN0aQpunjege5OYB5BDBmGU";

async function main() {
  const res = await docs.documents.get({ documentId });
  const content = res.data.body?.content || [];
  for (const c of content) {
    if (c.paragraph) {
      const text = c.paragraph.elements?.map(e => e.textRun?.content || "").join("");
      console.log(`[${c.startIndex}-${c.endIndex}] ${JSON.stringify(text)}`);
    } else if (c.table) {
      console.log(`[${c.startIndex}-${c.endIndex}] Table with ${c.table.rows} rows`);
    } else if (c.sectionBreak) {
      console.log(`[${c.startIndex}-${c.endIndex}] SectionBreak`);
    }
  }
}

main();
