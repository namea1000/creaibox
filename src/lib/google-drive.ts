import { google } from "googleapis";
import { Readable } from "stream";

// Initialize the Google Drive Client
function getDriveClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

/**
 * 지정된 부모 폴더 내에서 하위 폴더의 존재를 확인하고, 없으면 생성하여 그 폴더 ID를 리턴합니다.
 */
async function getOrCreateFolder(
  drive: any,
  folderName: string,
  parentFolderId: string
): Promise<string> {
  try {
    // 1. 이미 존재하는 폴더인지 검색
    const listResponse = await drive.files.list({
      q: `name = '${folderName}' and '${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id)",
      pageSize: 1,
    });

    const files = listResponse.data.files;
    if (files && files.length > 0) {
      return files[0].id;
    }

    // 2. 존재하지 않으면 생성
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
  } catch (err: any) {
    console.error(`Error in getOrCreateFolder for ${folderName}:`, err);
    // 폴더 생성/조회 오류 발생 시 부모 폴더 ID를 폴백으로 반환하여 안전 업로드 보장
    return parentFolderId;
  }
}

/**
 * Uploads a buffer directly to Google Drive under a user and sourceType isolated folder, shares it publicly, and returns the direct embed URL.
 * 
 * @param buffer - File content buffer (e.g. WebP image)
 * @param fileName - Target file name on Google Drive
 * @param mimeType - File MIME type (e.g. image/webp)
 * @param userId - Owner user ID
 * @param sourceType - Upload category source type (e.g. 'writing_creaibox_posts', 'image-studio')
 * @returns Direct download URL of the uploaded image
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  userId?: string,
  sourceType?: string
): Promise<string> {
  const drive = getDriveClient();
  const rootFolderId = process.env.GDRIVE_FOLDER_ID;

  if (!rootFolderId) {
    throw new Error("GDRIVE_FOLDER_ID is not configured in environment variables.");
  }

  let targetFolderId = rootFolderId;

  // 1. 동적 계층화 폴더 획득 (userId와 sourceType이 제공된 경우에만 적용)
  if (userId) {
    const cleanUserId = userId.replace(/[^a-z0-9_-]/gi, "-"); // 안전한 디렉토리명 정제
    const userFolderId = await getOrCreateFolder(drive, cleanUserId, rootFolderId);
    
    if (sourceType) {
      const cleanSourceType = sourceType.replace(/[^a-z0-9_-]/gi, "-");
      const sourceTypeFolderId = await getOrCreateFolder(drive, cleanSourceType, userFolderId);

      // 3차 연월 격리 폴더명 결정 (YYYYMM)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const currentYYYYMM = `${year}${month}`;

      targetFolderId = await getOrCreateFolder(drive, currentYYYYMM, sourceTypeFolderId);
    } else {
      targetFolderId = userFolderId;
    }
  }

  // Create readable stream from the buffer
  const mediaStream = new Readable();
  mediaStream.push(buffer);
  mediaStream.push(null);

  // Upload file to designated folder
  const fileMetadata = {
    name: fileName,
    parents: [targetFolderId],
  };

  const media = {
    mimeType,
    body: mediaStream,
  };

  const uploadResponse = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = uploadResponse.data.id;
  if (!fileId) {
    throw new Error("Failed to upload file to Google Drive (no file ID returned).");
  }

  // Make the file publicly accessible by setting permissions
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Helper to check if Google Drive configuration is present
 */
export function isGoogleDriveConfigured(): boolean {
  return Boolean(
    process.env.GCP_OAUTH_CLIENT_ID &&
    process.env.GCP_OAUTH_CLIENT_SECRET &&
    process.env.GCP_OAUTH_REFRESH_TOKEN &&
    process.env.GDRIVE_FOLDER_ID
  );
}

/**
 * Lists all audio files in a designated Google Drive folder.
 * 
 * @param folderId - The Google Drive folder ID to search within
 * @returns Array of file metadata objects (id, name, mimeType, size, createdTime)
 */
export async function listGoogleDriveMusic(folderId: string) {
  const drive = getDriveClient();
  const response = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType contains 'audio/' or name contains '.mp3' or name contains '.wav') and trashed = false`,
    fields: "files(id, name, mimeType, size, createdTime)",
    orderBy: "name",
  });
  return response.data.files || [];
}

/**
 * Fetches the media stream of a Google Drive file, optionally with a Range header.
 */
export async function getGoogleDriveStream(fileId: string, rangeHeader?: string) {
  const drive = getDriveClient();
  const requestHeaders: Record<string, string> = {};
  if (rangeHeader) {
    requestHeaders["Range"] = rangeHeader;
  }

  const response = await drive.files.get(
    { fileId, alt: "media" },
    {
      headers: requestHeaders,
      responseType: "stream",
    }
  );

  return {
    status: response.status,
    headers: response.headers as Record<string, any>,
    stream: response.data,
  };
}

/**
 * Fetches the media buffer of a Google Drive file, optionally with a Range header.
 */
export async function getGoogleDriveBuffer(fileId: string, rangeHeader?: string) {
  const drive = getDriveClient();
  const requestHeaders: Record<string, string> = {};
  if (rangeHeader) {
    requestHeaders["Range"] = rangeHeader;
  }

  const response = await drive.files.get(
    { fileId, alt: "media" },
    {
      headers: requestHeaders,
      responseType: "arraybuffer",
    }
  );

  return {
    status: response.status,
    headers: response.headers as Record<string, any>,
    data: Buffer.from(response.data as ArrayBuffer),
  };
}

/**
 * Lists files in the free assets Google Drive folder.
 */
export async function listFreeAssets(folderId: string) {
  const drive = getDriveClient();
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, size, createdTime, description)",
    orderBy: "createdTime desc",
    pageSize: 1000,
  });
  return response.data.files || [];
}

/**
 * Uploads a free asset file to Google Drive and makes it public, routing it to a subfolder based on media type and YYYYMM date.
 */
export async function uploadFreeAsset(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  description: string
): Promise<{ url: string; parentFolderId: string }> {
  const drive = getDriveClient();
  const rootFolderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID;

  if (!rootFolderId) {
    throw new Error("GDRIVE_FREE_ASSETS_FOLDER_ID is not configured in environment variables.");
  }

  // 1. Determine mediaType folder name
  let mediaType = "image"; // default fallback
  if (description) {
    try {
      const meta = JSON.parse(description);
      const mType = meta.mediaType;
      if (mType) {
        if (["photo", "illustration", "vector", "gif"].includes(mType) || mimeType.startsWith("image/")) {
          mediaType = "image";
        } else if (mType === "music" || mimeType.startsWith("audio/")) {
          mediaType = "music";
        } else if (mType === "video" || mimeType.startsWith("video/")) {
          mediaType = "video";
        } else {
          mediaType = mType.replace(/[^a-z0-9_-]/gi, "-");
        }
      }
    } catch {
      if (mimeType.startsWith("audio/")) mediaType = "music";
      else if (mimeType.startsWith("video/")) mediaType = "video";
    }
  } else {
    if (mimeType.startsWith("audio/")) mediaType = "music";
    else if (mimeType.startsWith("video/")) mediaType = "video";
  }

  // 2. Determine YYYYMM subfolder name (Korean Local Time equivalent or UTC)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const currentYYYYMM = `${year}${month}`;

  // 3. Resolve target nested folders
  // Root -> mediaType -> YYYYMM
  const mediaFolderId = await getOrCreateFolder(drive, mediaType, rootFolderId);
  const targetFolderId = await getOrCreateFolder(drive, currentYYYYMM, mediaFolderId);

  const mediaStream = new Readable();
  mediaStream.push(buffer);
  mediaStream.push(null);

  const fileMetadata = {
    name: fileName,
    parents: [targetFolderId],
    description: description, // Stores JSON metadata string
  };

  const media = {
    mimeType,
    body: mediaStream,
  };

  const uploadResponse = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = uploadResponse.data.id;
  if (!fileId) {
    throw new Error("Failed to upload free asset to Google Drive.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    url: `https://lh3.googleusercontent.com/d/${fileId}`,
    parentFolderId: targetFolderId,
  };
}

/**
 * Uploads a WebP thumbnail file directly inside the 'thumbnails' subfolder of the original asset's parent folder.
 */
export async function uploadFreeAssetThumbnail(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  parentFolderId: string
): Promise<string> {
  const drive = getDriveClient();

  // Resolve: parentFolderId -> thumbnails
  const targetFolderId = await getOrCreateFolder(drive, "thumbnails", parentFolderId);

  const mediaStream = new Readable();
  mediaStream.push(buffer);
  mediaStream.push(null);

  const fileMetadata = {
    name: fileName,
    parents: [targetFolderId],
  };

  const media = {
    mimeType,
    body: mediaStream,
  };

  const uploadResponse = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = uploadResponse.data.id;
  if (!fileId) {
    throw new Error("Failed to upload free asset thumbnail to Google Drive.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

function cleanTitle(filename: string): string {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  let name = nameWithoutExt.replace(/^Namu_/i, '');
  const uuidRegex = /_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(_(\d))?$/i;
  name = name.replace(uuidRegex, '');
  return name
    .replace(/[_\-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Increments the views or downloads counter stored in the description of a Google Drive file.
 */
export async function incrementAssetCounter(fileId: string, field: "downloads" | "views") {
  const drive = getDriveClient();

  // 1. Get current description and name
  const fileInfo = await drive.files.get({
    fileId,
    fields: "description, name",
  });

  const rawName = fileInfo.data.name || "";
  let metadata: any = { 
    downloads: 0, 
    views: 0, 
    tags: [], 
    uploader: "익명", 
    title: cleanTitle(rawName || "무명 에셋") 
  };
  const rawDesc = fileInfo.data.description;

  if (rawDesc) {
    try {
      metadata = JSON.parse(rawDesc);
    } catch {
      metadata.title = rawDesc;
    }
  }

  // 2. Increment target counter
  if (field === "downloads") {
    metadata.downloads = (metadata.downloads || 0) + 1;
  } else if (field === "views") {
    metadata.views = (metadata.views || 0) + 1;
  }

  // 3. Update description
  await drive.files.update({
    fileId,
    requestBody: {
      description: JSON.stringify(metadata),
    },
  });

  return metadata;
}

/**
 * Deletes a free asset file from Google Drive.
 */
export async function deleteFreeAsset(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

/**
 * Fetches description and name of a Google Drive file.
 */
export async function getAssetMetadata(fileId: string): Promise<{ name: string; metadata: any }> {
  const drive = getDriveClient();
  const fileInfo = await drive.files.get({
    fileId,
    fields: "description, name",
  });
  
  const rawDesc = fileInfo.data.description;
  let metadata: any = { uploader: "", title: fileInfo.data.name || "" };
  if (rawDesc) {
    try {
      metadata = JSON.parse(rawDesc);
    } catch {
      metadata.title = rawDesc;
    }
  }
  return { name: fileInfo.data.name || "", metadata };
}

/**
 * Updates asset title, tags, mediaType, generationType, and aspectRatio.
 */
export async function updateAssetMetadata(
  fileId: string,
  newMetadata: {
    title: string;
    tags: string[];
    mediaType: string;
    generationType: string;
    aspectRatio?: string;
    width?: number;
    height?: number;
    camera?: string;
    prompt?: string;
    aiTool?: string;
  }
): Promise<void> {
  const drive = getDriveClient();
  
  // 1. Get current metadata to preserve existing fields like uploader, views, downloads
  const fileInfo = await drive.files.get({
    fileId,
    fields: "description, name",
  });
  
  let metadata: any = {};
  if (fileInfo.data.description) {
    try {
      metadata = JSON.parse(fileInfo.data.description);
    } catch {
      metadata.title = fileInfo.data.description;
    }
  }
  
  // 2. Merge new values
  metadata = {
    ...metadata,
    title: newMetadata.title,
    tags: newMetadata.tags,
    mediaType: newMetadata.mediaType,
    generationType: newMetadata.generationType,
    aspectRatio: newMetadata.aspectRatio || metadata.aspectRatio || "",
    width: newMetadata.width !== undefined ? newMetadata.width : metadata.width || 0,
    height: newMetadata.height !== undefined ? newMetadata.height : metadata.height || 0,
    camera: newMetadata.camera !== undefined ? newMetadata.camera : metadata.camera || "촬영 정보 없음",
    prompt: newMetadata.prompt !== undefined ? newMetadata.prompt : metadata.prompt || "",
    aiTool: newMetadata.aiTool !== undefined ? newMetadata.aiTool : metadata.aiTool || "",
  };
  
  // 3. Update on Google Drive
  await drive.files.update({
    fileId,
    requestBody: {
      name: newMetadata.title,
      description: JSON.stringify(metadata),
    },
  });
}



