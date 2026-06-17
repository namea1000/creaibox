const { google } = require("googleapis");
require("dotenv").config({ path: ".env.local" });

function getDriveClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

async function test() {
  try {
    const drive = getDriveClient();
    const folderId = process.env.GDRIVE_MUSIC_FOLDER_ID || "1p68BWWuQVIdJF9pT9XSBS2kQOhnjOwGP";
    console.log("Listing files in folder:", folderId);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, size, createdTime, webContentLink)",
      orderBy: "name",
    });

    const files = response.data.files || [];
    console.log(`Found ${files.length} files:`);
    for (const f of files) {
      console.log(`- Name: ${f.name}, ID: ${f.id}, MIME: ${f.mimeType}, Size: ${f.size}`);
      console.log(`  webContentLink: ${f.webContentLink}`);
      
      // Test lh3 link headers
      const lh3Url = `https://lh3.googleusercontent.com/d/${f.id}`;
      try {
        const fetch = (await import("node-fetch")).default;
        const res = await fetch(lh3Url, { method: "HEAD" });
        console.log(`  lh3 HEAD Status: ${res.status}, Content-Type: ${res.headers.get("content-type")}`);
      } catch (err) {
        console.log(`  lh3 error: ${err.message}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
