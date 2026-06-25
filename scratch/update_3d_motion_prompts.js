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

// 3D Motion Art Studio Prompts
const prompts = [
  // N: 1. 메인 페이지 히어로 섹션 (Hero Section) - 16:9
  "A premium, high-fidelity landing page hero background banner for a 3D motion graphics studio. Futuristic abstract 3D shapes, floating metallic chromium ribbons, translucent glassmorphic spheres in deep dark space. Electric purple, neon green, and cyber cyan laser accent lighting. Hyper-detailed, 8k resolution, Unreal Engine 5 render, cinematic lighting, sharp focus, dark cybernetic aesthetic, no device frames. --ar 16:9",
  
  // O: 2. 포트폴리오 및 쇼케이스 섹션 (Portfolio/Showcase) - 4:3
  "A close-up visual showcase of a premium 3D digital artwork. A futuristic cyber-chrome city sculpture with intricate micro-details, reflective liquid metal textures, and glowing neon purple and cyber cyan grid wireframes. Ultra-detailed, octane render, modern digital art gallery display, dark background, no device frames. --ar 4:3",
  
  // P: 3. 소개 및 프로필 섹션 (About/Profile) - 1:1
  "A sleek, professional conceptual portrait of a futuristic 3D digital artist. Translucent glass helmet reflecting electric purple and neon green laser lights, cybernetic neural visor, clean high-tech dark indigo background. 3D render, sharp details, octane render, smooth lighting, no device frames. --ar 1:1",
  
  // Q: 4. 서브페이지 배너 및 공통 에셋 (Subpages Banner) - 16:9
  "A premium, abstract 3D digital crystal asset landscape. High-fidelity glass refraction, translucent spectrum crystal prisms scattering pink, purple, and neon green light beams in a dark space. Clean minimalist high-tech composition, cinematic, raytracing, 8k resolution, no device frames. --ar 16:9"
];

async function updatePrompts() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  // 1. Read Rows 2 and 3 to inspect them
  console.log("Reading Rows 2 and 3 to verify template IDs...");
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A2:M4"
  });

  const rows = readRes.data.values || [];
  console.log("Row 2 (A2:M2):", rows[0]);
  console.log("Row 3 (A3:M3):", rows[1]);
  console.log("Row 4 (A4:M4):", rows[2]);

  // 2. We will write the prompts to Row 2 (which is 3d_motion_art)
  console.log("Writing prompts to Row 2 (N2:Q2)...");
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "시트1!N2:Q2",
    valueInputOption: "RAW",
    requestBody: {
      values: [prompts]
    }
  });

  // 3. If Row 3 is also 3d_motion_art, or if the user wants it in Row 3 as well, let's write it to Row 3 (N3:Q3)
  // Let's check if Row 3 is 3d_motion_art. In our case, Row 2 is 3d_motion_art.
  // The user asked to write prompts for template id: 3d_motion_art in cells N2~Q3.
  // If they meant writing it to both Row 2 and Row 3 (perhaps because they have two rows or they want it copied),
  // we will write it to both Row 2 and Row 3 to be safe and fulfill the exact range request N2~Q3!
  console.log("Writing prompts to Row 3 (N3:Q3) to fulfill N2~Q3 range request...");
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "시트1!N3:Q3",
    valueInputOption: "RAW",
    requestBody: {
      values: [prompts]
    }
  });

  console.log("Update completed successfully!");
}

updatePrompts().catch(err => console.error(err));
