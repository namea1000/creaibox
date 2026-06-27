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

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const blogFolderId = "1lE5QsFcWrCh-JJjZNvocBoHFPDXU02ss";
  const templateId = "art_design_minimal";

  console.log("Fetching files in blog folder...");
  const response = await drive.files.list({
    q: `'${blogFolderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
    pageSize: 100,
  });

  const files = response.data.files || [];
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  // Create unused subfolder to clean up non-selected images
  console.log("Ensuring 'unused' folder exists...");
  const unusedFolderId = await getOrCreateFolder(drive, "unused", blogFolderId);
  console.log(`Unused folder ID: ${unusedFolderId}`);

  // Define target mappings based on file name patterns
  // Pattern mapping:
  // Key: keyword in file name, Value: { targetName: string, selectIndex: number } or function
  const mappings = [
    {
      keyword: "archives_modern_art",
      targetBase: `${templateId}`, // art_design_minimal.png (Thumbnail)
      type: "thumbnail"
    },
    {
      keyword: "cityscape_at_dusk",
      targetBase: `${templateId}_hero`, // art_design_minimal_hero.png
      type: "hero"
    },
    {
      keyword: "close-up_of_a_minimalist",
      targetBase: `${templateId}_portfolio`, // art_design_minimal_portfolio_1, 2, 3
      type: "portfolio"
    },
    {
      keyword: "conceptual_monochromatic",
      targetBase: `${templateId}_about`, // art_design_minimal_about.png
      type: "about"
    },
    {
      keyword: "clean_abstract_background",
      targetBase: `${templateId}_sub`, // art_design_minimal_sub.png
      type: "sub"
    }
  ];

  for (const file of files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      continue; // Skip folders
    }

    const matched = mappings.find(m => file.name.includes(m.keyword));
    if (!matched) {
      console.log(`File: "${file.name}" does not match any prompt pattern. Skipping.`);
      continue;
    }

    // Extract slice index from Midjourney filename (e.g. filename_0.png -> 0)
    const matchIndex = file.name.match(/_([0-3])\.png$/);
    const sliceIndex = matchIndex ? parseInt(matchIndex[1], 10) : 0;

    let targetName = "";
    let shouldKeep = false;

    if (matched.type === "portfolio") {
      // Keep slices 0, 1, 2 as portfolio_1, 2, 3
      if (sliceIndex >= 0 && sliceIndex <= 2) {
        targetName = `${matched.targetBase}_${sliceIndex + 1}.png`;
        shouldKeep = true;
      }
    } else {
      // For hero, about, sub, thumbnail, keep the 0-th slice as primary
      if (sliceIndex === 0) {
        targetName = `${matched.targetBase}.png`;
        shouldKeep = true;
      }
    }

    if (shouldKeep && targetName) {
      console.log(`[RENAME] "${file.name}" -> "${targetName}"`);
      await drive.files.update({
        fileId: file.id,
        requestBody: {
          name: targetName
        }
      });
    } else {
      console.log(`[MOVE UNUSED] "${file.name}" to unused/`);
      // Move to unused folder by updating parents
      await drive.files.update({
        fileId: file.id,
        addParents: unusedFolderId,
        removeParents: blogFolderId,
        fields: "id, parents"
      });
    }
  }

  console.log("Image reorganization and renaming completed successfully!");
}

main().catch(err => console.error(err));
