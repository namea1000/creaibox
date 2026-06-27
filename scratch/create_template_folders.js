const fs = require("fs");
const path = require("path");
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

// 드라이브 폴더명과 로컬 TS 파일명 매핑 정의
const folderToTsMap = {
  travel: "./src/lib/templates/categories/travel-lifestyle.ts",
  store: "./src/lib/templates/categories/store.ts",
  restaurant: "./src/lib/templates/categories/restaurant.ts",
  realestate: "./src/lib/templates/categories/real-estate.ts",
  potfolio: "./src/lib/templates/categories/portfolio.ts",
  music: "./src/lib/templates/categories/music.ts",
  magazine: "./src/lib/templates/categories/magazine.ts",
  heanth: "./src/lib/templates/categories/health-wellness.ts",
  fashion: "./src/lib/templates/categories/fashion-beauty.ts",
  entertainment: "./src/lib/templates/categories/entertainment.ts",
  education: "./src/lib/templates/categories/education.ts",
  community: "./src/lib/templates/categories/community-nonprofit.ts",
  business: "./src/lib/templates/categories/business.ts",
  blog: "./src/lib/templates/categories/blog.ts",
  artndesign: "./src/lib/templates/categories/art-design.ts",
};

// 파일에서 templateId 리스트 파싱 헬퍼
function parseTemplateIds(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Warning: Template file not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = content.split("templateId:");
  const ids = [];

  for (let i = 1; i < blocks.length; i++) {
    const block = "templateId:" + blocks[i];
    const tidMatch = block.match(/templateId:\s*"([^"]+)"/);
    if (tidMatch && tidMatch[1]) {
      ids.push(tidMatch[1]);
    }
  }
  return ids;
}

async function getOrCreateFolder(drive, folderName, parentFolderId) {
  // Check if folder exists
  const listResponse = await drive.files.list({
    q: `name = '${folderName}' and '${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });

  const files = listResponse.data.files;
  if (files && files.length > 0) {
    return { id: files[0].id, created: false };
  }

  // Create new folder
  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentFolderId],
  };

  const createResponse = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id",
  });

  return { id: createResponse.data.id, created: true };
}

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const rootFolderId = "1U3tiVsT1lTLuDJblfFtWAMq7eMsw2idP"; // Root folder: creaibox-homepage-thema-images
  console.log(`Scanning subfolders under root ID: ${rootFolderId}...`);

  const listResponse = await drive.files.list({
    q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 100,
  });

  const subfolders = listResponse.data.files || [];
  if (subfolders.length === 0) {
    console.log("No subfolders found under root folder.");
    return;
  }

  console.log(`Found ${subfolders.length} category folders.`);

  for (const folder of subfolders) {
    const folderName = folder.name;
    const folderId = folder.id;

    const tsPath = folderToTsMap[folderName];
    if (!tsPath) {
      console.log(`No mapping defined for folder: "${folderName}". Skipping.`);
      continue;
    }

    const templateIds = parseTemplateIds(tsPath);
    console.log(`\nCategory: "${folderName}" (${templateIds.length} templates defined)`);

    for (const tid of templateIds) {
      try {
        const result = await getOrCreateFolder(drive, tid, folderId);
        if (result.created) {
          console.log(`  [CREATED] Folder: "${tid}" under ${folderName}`);
        } else {
          console.log(`  [EXISTS] Folder: "${tid}" under ${folderName}`);
        }
      } catch (err) {
        console.error(`  [ERROR] Failed to create folder "${tid}" in ${folderName}:`, err.message);
      }
    }
  }

  console.log("\nAll subfolders for Template IDs have been successfully created/verified!");
}

main().catch(err => console.error(err));
