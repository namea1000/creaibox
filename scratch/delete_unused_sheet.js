const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const auth = new google.auth.OAuth2(
  process.env.GCP_OAUTH_CLIENT_ID,
  process.env.GCP_OAUTH_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth });

async function deleteFile() {
  const unusedFileId = "1QkmwNn-dJ9Dz6UQntI2r9-6b9c1raMnBzNccY0wfSZg";
  try {
    await drive.files.delete({ fileId: unusedFileId });
    console.log(`성공적으로 안 쓰는 빈 시트 파일(${unusedFileId})을 구글 드라이브에서 삭제했습니다.`);
  } catch (err) {
    console.error("파일 삭제 실패:", err.message);
  }
}

deleteFile();
