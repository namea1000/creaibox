const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const auth = new google.auth.OAuth2(
  process.env.GCP_OAUTH_CLIENT_ID,
  process.env.GCP_OAUTH_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth });

async function checkAccount() {
  try {
    const res = await drive.about.get({
      fields: "user"
    });
    console.log("==========================================");
    console.log("현재 구글 드라이브 연동 계정 이메일:", res.data.user.emailAddress);
    console.log("사용자 이름:", res.data.user.displayName);
    console.log("==========================================");
  } catch (err) {
    console.error("Google 드라이브 계정 정보를 가져오는데 실패했습니다:", err.message);
  }
}

checkAccount();
