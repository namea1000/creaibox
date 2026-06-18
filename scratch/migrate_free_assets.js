const { google } = require("googleapis");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "./.env.local" });

const rootFolderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rootFolderId || !supabaseUrl || !supabaseKey) {
  console.error("Missing configuration in .env.local");
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

// 2. Supabase Client 초기화
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. 폴더 생성/조회 헬퍼
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
    console.log("Fetching files from Google Drive under root free-assets folder...");

    // 1. 루트 폴더 바로 밑에 있는 모든 파일 조회 (폴더 제외)
    const listResponse = await drive.files.list({
      q: `'${rootFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, mimeType, size, createdTime, description, parents)",
      pageSize: 1000,
    });

    const files = listResponse.data.files || [];
    console.log(`Found ${files.length} files directly in root folder to migrate.`);

    let successCount = 0;

    for (const file of files) {
      console.log(`\nProcessing file: "${file.name}" (${file.id})`);

      // A. 메타데이터 파싱
      let metadata = {
        title: file.name,
        tags: [],
        mediaType: "photo",
        uploader: "익명",
        downloads: 0,
        views: 0,
        width: 0,
        height: 0,
        aspectRatio: "",
        generationType: "real",
        camera: "촬영 정보 없음",
      };

      if (file.description) {
        try {
          const parsed = JSON.parse(file.description);
          metadata = { ...metadata, ...parsed };
        } catch {
          metadata.title = file.description;
        }
      }

      // B. 미디어 타입 분류 식별
      let mediaType = "image";
      const mType = metadata.mediaType;
      if (mType) {
        if (["photo", "illustration", "vector", "gif"].includes(mType) || file.mimeType.startsWith("image/")) {
          mediaType = "image";
        } else if (mType === "music" || file.mimeType.startsWith("audio/")) {
          mediaType = "music";
        } else if (mType === "video" || file.mimeType.startsWith("video/")) {
          mediaType = "video";
        } else {
          mediaType = mType.replace(/[^a-z0-9_-]/gi, "-");
        }
      } else {
        if (file.mimeType.startsWith("audio/")) mediaType = "music";
        else if (file.mimeType.startsWith("video/")) mediaType = "video";
      }

      // C. 생성 연월(YYYYMM) 추출
      const createdDate = new Date(file.createdTime);
      const year = createdDate.getFullYear();
      const month = String(createdDate.getMonth() + 1).padStart(2, "0");
      const yearMonth = `${year}${month}`;

      // D. 신규 격리 폴더 조회/생성
      const mediaFolderId = await getOrCreateFolder(drive, mediaType, rootFolderId);
      const targetFolderId = await getOrCreateFolder(drive, yearMonth, mediaFolderId);

      // E. 구글 드라이브 내 파일 이동 처리
      if (file.parents && file.parents.includes(rootFolderId)) {
        const previousParents = file.parents.join(",");
        console.log(`Moving file from ${previousParents} to ${targetFolderId}...`);
        await drive.files.update({
          fileId: file.id,
          addParents: targetFolderId,
          removeParents: previousParents,
          fields: "id, parents",
        });
      }

      // F. Supabase DB 레코드 삽입/업데이트
      console.log(`Saving metadata of "${metadata.title}" to Supabase free_assets table...`);
      const { error: dbError } = await supabase
        .from("free_assets")
        .upsert({
          gdrive_file_id: file.id,
          storage_url: `https://lh3.googleusercontent.com/d/${file.id}`,
          file_name: file.name,
          mime_type: file.mimeType,
          media_type: mediaType,
          year_month: yearMonth,
          title: metadata.title || file.name,
          tags: metadata.tags || [],
          uploader: metadata.uploader || "익명",
          downloads_count: metadata.downloads || 0,
          views_count: metadata.views || 0,
          width: metadata.width || 0,
          height: metadata.height || 0,
          aspect_ratio: metadata.aspectRatio || "",
          generation_type: metadata.generationType || "real",
          camera: metadata.camera || "촬영 정보 없음",
          created_at: file.createdTime,
        }, {
          onConflict: "gdrive_file_id"
        });

      if (dbError) {
        console.error(`DB Upsert failed for file ${file.name}:`, dbError.message);
      } else {
        console.log(`Successfully migrated file: "${file.name}"`);
        successCount++;
      }
    }

    console.log(`\nMigration completed! Successfully migrated ${successCount}/${files.length} files.`);
  } catch (error) {
    console.error("Migration script failed with error:", error);
  }
}

run();
