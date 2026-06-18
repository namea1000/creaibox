const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const rootFolderId = process.env.GDRIVE_FOLDER_ID;

if (!rootFolderId) {
  console.error("Missing GDRIVE_FOLDER_ID in .env.local");
  process.exit(1);
}

// 1. Google Drive Client 초기화
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

// 2. 폴더 생성/조회 헬퍼
async function getOrCreateFolder(drive, folderName, parentFolderId) {
  try {
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

    console.log(`Created folder: ${folderName} under ${parentFolderId}`);
    return createResponse.data.id;
  } catch (err) {
    console.error(`Error getOrCreateFolder for ${folderName}:`, err);
    return parentFolderId;
  }
}

async function run() {
  try {
    const drive = getDriveClient();
    console.log(`Scanning users folders under root: ${rootFolderId}`);

    // 1. Root 하위의 모든 사용자 고유 ID 폴더 목록 획득
    const userFoldersResponse = await drive.files.list({
      q: `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
      pageSize: 1000,
    });

    const userFolders = userFoldersResponse.data.files || [];
    console.log(`Found ${userFolders.length} user folders.`);

    let totalMigratedFiles = 0;

    for (const userFolder of userFolders) {
      console.log(`\nScanning user folder: "${userFolder.name}" (${userFolder.id})`);

      // 2. 사용자 폴더 하위의 스튜디오/용도 폴더 목록 획득 (예: writing-creaibox-posts, image-studio 등)
      const studioFoldersResponse = await drive.files.list({
        q: `'${userFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: "files(id, name)",
        pageSize: 1000,
      });

      const studioFolders = studioFoldersResponse.data.files || [];
      console.log(`  Found ${studioFolders.length} studio/sourceType folders for user ${userFolder.name}.`);

      for (const studioFolder of studioFolders) {
        console.log(`  Scanning studio folder: "${studioFolder.name}" (${studioFolder.id})`);

        // 3. 스튜디오 폴더 바로 하위에 직접 존재하는 파일 목록 획득 (서브폴더 제외)
        const filesResponse = await drive.files.list({
          q: `'${studioFolder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
          fields: "files(id, name, createdTime, parents)",
          pageSize: 1000,
        });

        const files = filesResponse.data.files || [];
        console.log(`    Found ${files.length} files directly under "${studioFolder.name}" to migrate.`);

        for (const file of files) {
          // A. 파일 생성일 기준 YYYYMM 추출
          const createdDate = new Date(file.createdTime);
          const year = createdDate.getFullYear();
          const month = String(createdDate.getMonth() + 1).padStart(2, "0");
          const yearMonth = `${year}${month}`;

          // B. YYYYMM 하위 격리 폴더 ID 획득/생성 (부모: studioFolder.id)
          const targetYmFolderId = await getOrCreateFolder(drive, yearMonth, studioFolder.id);

          // C. 파일 이동 실행 (studioFolder -> YYYYMM)
          if (file.parents && file.parents.includes(studioFolder.id)) {
            const previousParents = file.parents.join(",");
            console.log(`    Moving file "${file.name}" to "${yearMonth}" folder...`);
            await drive.files.update({
              fileId: file.id,
              addParents: targetYmFolderId,
              removeParents: previousParents,
              fields: "id, parents",
            });
            totalMigratedFiles++;
          }
        }
      }
    }

    console.log(`\nBlog images migration completed! Successfully moved ${totalMigratedFiles} files to YYYYMM subfolders.`);
  } catch (error) {
    console.error("Migration failed with error:", error);
  }
}

run();
