import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import { getGoogleDriveBuffer, uploadFreeAssetThumbnail } from "../src/lib/google-drive";
import sharp from "sharp";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getDriveClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: "v3", auth: oauth2Client });
}

async function run() {
  console.log("🚀 Starting existing images thumbnail optimization batch migration...");

  // 1. Fetch assets where media_type is image and thumbnail_url is empty/null
  const { data: assets, error } = await supabase
    .from("free_assets")
    .select("gdrive_file_id, storage_url, file_name, media_type")
    .eq("media_type", "image")
    .is("thumbnail_url", null);

  if (error) {
    console.error("❌ Failed to query free_assets from Supabase:", error.message);
    process.exit(1);
  }

  if (!assets || assets.length === 0) {
    console.log("✅ No pending image assets found for thumbnail optimization.");
    process.exit(0);
  }

  console.log(`📦 Found ${assets.length} image assets waiting for thumbnail generation.`);

  const drive = getDriveClient();

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const fileId = asset.gdrive_file_id;
    console.log(`[${i + 1}/${assets.length}] Optimizing: ${asset.file_name} (GDrive ID: ${fileId})...`);

    try {
      // 2. Fetch parent folder ID from Google Drive
      const fileInfo = await drive.files.get({
        fileId: fileId,
        fields: "parents",
      });
      const parents = fileInfo.data.parents;
      if (!parents || parents.length === 0) {
        console.warn(`⚠️ Warning: No parent folder found for GDrive file ${fileId}. Skipping.`);
        continue;
      }
      const parentFolderId = parents[0];

      // 3. Fetch original image binary buffer
      const driveBufferResult = await getGoogleDriveBuffer(fileId);
      const originalBuffer = driveBufferResult.data;

      // 4. Generate WebP thumbnail with sharp
      const thumbBuffer = await sharp(originalBuffer)
        .resize(400) // max width 400px, aspect ratio preserved
        .webp({ quality: 85 })
        .toBuffer();

      // 5. Upload WebP thumbnail under parents[0]/thumbnails/
      const thumbFileName = `thumb_${asset.file_name.replace(/\.[^/.]+$/, "")}.webp`;
      const thumbnailUrl = await uploadFreeAssetThumbnail(
        thumbBuffer,
        thumbFileName,
        "image/webp",
        parentFolderId
      );

      // 6. Update database record
      const { error: updateError } = await supabase
        .from("free_assets")
        .update({ thumbnail_url: thumbnailUrl })
        .eq("gdrive_file_id", fileId);

      if (updateError) {
        console.error(`❌ Failed to update Supabase record for ${fileId}:`, updateError.message);
      } else {
        console.log(`✅ Success! Thumbnail created and linked: ${thumbnailUrl}`);
      }
    } catch (err: any) {
      console.error(`❌ Error processing asset ${fileId}:`, err.message);
    }
  }

  console.log("🏁 Batch migration completed successfully.");
}

run().catch((err) => {
  console.error("💥 Critical execution failure:", err);
  process.exit(1);
});
