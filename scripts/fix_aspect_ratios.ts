import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;
const freeAssetsFolderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function fix() {
  console.log("Starting Aspect Ratio correction script...");
  
  // 1. Fetch all assets from Supabase
  const { data: dbAssets, error: dbError } = await supabase
    .from("free_assets")
    .select("id, gdrive_file_id, file_name, aspect_ratio, media_type");
    
  if (dbError || !dbAssets) {
    console.error("Failed to query DB assets:", dbError?.message);
    return;
  }
  
  console.log(`Found ${dbAssets.length} assets in DB.`);
  
  // 2. Fetch creassets-library folder structure from Google Drive
  const listRes = await drive.files.list({
    q: `'${freeAssetsFolderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
  });
  
  const folders = listRes.data.files || [];
  const imageFolder = folders.find(f => f.name === 'image' && f.mimeType === 'application/vnd.google-apps.folder');
  const videoFolder = folders.find(f => f.name === 'video' && f.mimeType === 'application/vnd.google-apps.folder');
  
  const filesMap = new Map<string, any>();
  
  // Scan Images
  if (imageFolder) {
    console.log(`Scanning 'image' folder (ID: ${imageFolder.id})...`);
    const listRes = await drive.files.list({
      q: `'${imageFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = 'creassets-library' and trashed = false`,
      fields: "files(id, name)",
    });
    const creassetsFolderId = listRes.data.files?.[0]?.id;
    
    if (creassetsFolderId) {
      const subFoldersRes = await drive.files.list({
        q: `'${creassetsFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: "files(id, name)",
      });
      const categoryFolders = subFoldersRes.data.files || [];
      console.log(`Found ${categoryFolders.length} category folders.`);
      
      for (const catFolder of categoryFolders) {
        let pageToken: string | undefined = undefined;
        do {
          const res: any = await drive.files.list({
            q: `'${catFolder.id}' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name, mimeType, imageMediaMetadata)",
            pageSize: 100,
            pageToken: pageToken
          });
          const catFiles = res.data.files || [];
          catFiles.forEach((f: any) => {
            filesMap.set(f.id, f);
          });
          pageToken = res.data.nextPageToken;
        } while (pageToken);
      }
    }
  }

  // Scan Videos
  if (videoFolder) {
    console.log(`Scanning 'video' folder (ID: ${videoFolder.id})...`);
    let pageToken: string | undefined = undefined;
    do {
      const res: any = await drive.files.list({
        q: `'${videoFolder.id}' in parents and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, videoMediaMetadata)",
        pageSize: 100,
        pageToken: pageToken
      });
      const files = res.data.files || [];
      files.forEach((f: any) => {
        filesMap.set(f.id, f);
      });
      pageToken = res.data.nextPageToken;
    } while (pageToken);
  }
  
  console.log(`Scanned ${filesMap.size} files in Google Drive.`);
  
  // 3. Compare and fix
  for (const asset of dbAssets) {
    const driveFile = filesMap.get(asset.gdrive_file_id);
    if (!driveFile) {
      console.log(`[Skip] Asset ${asset.file_name} is in DB but not found in GDrive scanning.`);
      continue;
    }
    
    let w = 0;
    let h = 0;
    
    if (asset.media_type === 'image' && driveFile.imageMediaMetadata) {
      w = driveFile.imageMediaMetadata.width || 0;
      h = driveFile.imageMediaMetadata.height || 0;
    } else if (asset.media_type === 'video' && driveFile.videoMediaMetadata) {
      w = driveFile.videoMediaMetadata.width || 0;
      h = driveFile.videoMediaMetadata.height || 0;
    }
    
    if (w === 0 || h === 0) continue;
    
    // Calculate actual aspect ratio
    let correctRatio = '16:9';
    const ratio = w / h;
    
    if (Math.abs(ratio - 9/16) < 0.1) {
      correctRatio = '9:16';
    } else if (Math.abs(ratio - 16/9) < 0.1) {
      correctRatio = '16:9';
    } else if (Math.abs(ratio - 1/1) < 0.1) {
      correctRatio = '1:1';
    } else if (Math.abs(ratio - 3/4) < 0.1) {
      correctRatio = '3:4';
    } else if (Math.abs(ratio - 4/3) < 0.1) {
      correctRatio = '4:3';
    } else {
      correctRatio = w > h ? '16:9' : (h > w ? '9:16' : '1:1');
    }
    
    // Check mismatch
    if (asset.aspect_ratio !== correctRatio) {
      console.log(`\n[Mismatch Found] ${asset.file_name} in DB is ${asset.aspect_ratio}, but actual dimensions ${w}x${h} indicate ${correctRatio}.`);
      
      // Calculate new filenames
      const currentFileName = asset.file_name;
      const wrongRatioStr = asset.aspect_ratio.replace(':', '-');
      const correctRatioStr = correctRatio.replace(':', '-');
      const newFileName = currentFileName.replace(`_${wrongRatioStr}_`, `_${correctRatioStr}_`);
      
      console.log(`- Action: Update DB aspect_ratio to "${correctRatio}", width to ${w}, height to ${h}`);
      if (newFileName !== currentFileName) {
        console.log(`- Action: Rename DB file_name to "${newFileName}"`);
        console.log(`- Action: Rename Google Drive file name to "${newFileName}"`);
      }
      
      // Update Database
      const { error: updateError } = await supabase
        .from("free_assets")
        .update({
          aspect_ratio: correctRatio,
          width: w,
          height: h,
          file_name: newFileName,
        })
        .eq("id", asset.id);
        
      if (updateError) {
        console.error(`  - [DB Update Error]:`, updateError.message);
      } else {
        console.log(`  - [DB Update Success] Updated successfully.`);
      }
      
      // Rename in Google Drive
      if (newFileName !== currentFileName) {
        try {
          await drive.files.update({
            fileId: asset.gdrive_file_id,
            requestBody: { name: newFileName }
          });
          console.log(`  - [GDrive Rename Success] Renamed successfully.`);
        } catch (renameErr: any) {
          console.error(`  - [GDrive Rename Error] Failed to rename:`, renameErr.message);
        }
      }
    }
  }
  
  console.log("\nAspect Ratio correction process finished!");
}

fix().catch(console.error);
