const { google } = require("googleapis");
require("dotenv").config({ path: ".env.local" });

function getDriveClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

async function test() {
  try {
    const drive = getDriveClient();
    const fileId = "1p4jlG6duYuALoTJY6OoNaQH2adt3g1_H"; // 1.Inner Light.wav

    console.log("Fetching file metadata...");
    const meta = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });
    console.log("Meta:", meta.data);

    console.log("Fetching file media stream...");
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    console.log("Stream status:", response.status);
    console.log("Stream headers:", response.headers);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
