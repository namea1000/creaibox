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
 * Uploads a buffer directly to Google Drive, shares it publicly, and returns the direct embed URL.
 * 
 * @param buffer - File content buffer (e.g. WebP image)
 * @param fileName - Target file name on Google Drive
 * @param mimeType - File MIME type (e.g. image/webp)
 * @returns Direct download URL of the uploaded image
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const drive = getDriveClient();
  const folderId = process.env.GDRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("GDRIVE_FOLDER_ID is not configured in environment variables.");
  }

  // Create readable stream from the buffer
  const mediaStream = new Readable();
  mediaStream.push(buffer);
  mediaStream.push(null);

  // 1. Upload file to designated folder
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
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

  // 2. Make the file publicly accessible by setting permissions
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // 3. Construct direct image display/download link
  // Using lh3.googleusercontent.com/d/ is much more stable than drive.google.com/uc?id=
  // because it serves a direct 200 OK image with Access-Control-Allow-Origin: *
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


