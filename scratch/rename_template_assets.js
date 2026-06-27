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

async function getOrCreateFolder(drive, folderName, parentFolderId) {
  const listResponse = await drive.files.list({
    q: `name = '${folderName}' and '${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });

  const files = listResponse.data.files;
  if (files && files.length > 0) {
    return files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentFolderId],
  };

  const createResponse = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id",
  });

  return createResponse.data.id;
}

// 지능형 파일명 기반 섹션 분류 엔진
function classifySection(fileName) {
  const name = fileName.toLowerCase();

  // 1. Thumbnail/Overall Theme check
  if (name.includes("landing_page") || name.includes("theme_that") || name.includes("website_named")) {
    return "thumbnail";
  }

  // 2. About/Profile Section check
  if (
    name.includes("workspace") ||
    name.includes("portrait") ||
    name.includes("profile") ||
    name.includes("about") ||
    name.includes("partner") ||
    name.includes("baker") ||
    name.includes("designer") ||
    name.includes("mixologist") ||
    name.includes("chef") ||
    name.includes("consultant") ||
    name.includes("teacher") ||
    name.includes("writer") ||
    name.includes("artist")
  ) {
    return "about";
  }

  // 3. Subpage Banner check
  if (
    name.includes("background") ||
    name.includes("banner") ||
    name.includes("sub") ||
    name.includes("abstract") ||
    name.includes("gradient") ||
    name.includes("texture")
  ) {
    return "sub";
  }

  // 4. Hero Section check
  if (
    name.includes("cityscape") ||
    name.includes("dawn") ||
    name.includes("dusk") ||
    name.includes("sunset") ||
    name.includes("scene") ||
    name.includes("facade") ||
    name.includes("exterior") ||
    name.includes("hero") ||
    name.includes("interior") ||
    name.includes("classroom") ||
    name.includes("boardroom") ||
    name.includes("treehouse") ||
    name.includes("desk")
  ) {
    return "hero";
  }

  // 5. Portfolio Section check (Fallback)
  if (
    name.includes("close-up") ||
    name.includes("closeup") ||
    name.includes("detail") ||
    name.includes("pattern") ||
    name.includes("card") ||
    name.includes("portfolio") ||
    name.includes("showcase") ||
    name.includes("cup") ||
    name.includes("glass") ||
    name.includes("book") ||
    name.includes("toy") ||
    name.includes("chart")
  ) {
    return "portfolio";
  }

  return "unknown";
}

async function renameFolderAssets(drive, folderId, templateId) {
  console.log(`\n========================================`);
  console.log(`Starting rename for Template ID: "${templateId}" (Folder: ${folderId})`);
  console.log(`========================================`);

  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
    pageSize: 100,
  });

  const files = response.data.files || [];
  if (files.length === 0) {
    console.log("No files found in folder.");
    return;
  }

  // Filter out any folders (like already created 'unused')
  const imageFiles = files.filter(f => f.mimeType !== "application/vnd.google-apps.folder");
  console.log(`Found ${imageFiles.length} image files to process.`);

  if (imageFiles.length === 0) return;

  const unusedFolderId = await getOrCreateFolder(drive, "unused", folderId);

  for (const file of imageFiles) {
    const section = classifySection(file.name);
    
    // Extract slice index from Midjourney filename (e.g. filename_0.png -> 0)
    const matchIndex = file.name.match(/_([0-3])\.png$/);
    const sliceIndex = matchIndex ? parseInt(matchIndex[1], 10) : 0;

    let targetName = "";
    let shouldKeep = false;

    console.log(`Processing: "${file.name}" -> Classified: ${section} (slice: ${sliceIndex})`);

    if (section === "portfolio") {
      // Keep slices 0, 1, 2 as portfolio_1, 2, 3
      if (sliceIndex >= 0 && sliceIndex <= 2) {
        targetName = `${templateId}_portfolio_${sliceIndex + 1}.png`;
        shouldKeep = true;
      }
    } else if (section !== "unknown") {
      // For hero, about, sub, thumbnail, keep the 0-th slice as primary
      if (sliceIndex === 0) {
        if (section === "thumbnail") targetName = `${templateId}.png`;
        else if (section === "hero") targetName = `${templateId}_hero.png`;
        else if (section === "about") targetName = `${templateId}_about.png`;
        else if (section === "sub") targetName = `${templateId}_sub.png`;
        shouldKeep = true;
      }
    }

    if (shouldKeep && targetName) {
      console.log(`  -> [RENAME] "${file.name}" to "${targetName}"`);
      await drive.files.update({
        fileId: file.id,
        requestBody: {
          name: targetName
        }
      });
    } else {
      console.log(`  -> [MOVE UNUSED] "${file.name}" to unused/`);
      await drive.files.update({
        fileId: file.id,
        addParents: unusedFolderId,
        removeParents: folderId,
        fields: "id, parents"
      });
    }
  }

  console.log(`Finished processing folder: ${templateId}`);
}

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  // Target: cozy_cafe_cream folder
  const cozyCafeFolderId = "1GBVbKRx9zjZIFlDVg5dn-qi_zCve5xT1";
  const cozyCafeTemplateId = "cozy_cafe_cream";

  await renameFolderAssets(drive, cozyCafeFolderId, cozyCafeTemplateId);
}

main().catch(err => console.error(err));
