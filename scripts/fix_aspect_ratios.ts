import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Google Drive Auth Setup using correct env variable names
const oauth2Client = new google.auth.OAuth2(
  process.env.GCP_OAUTH_CLIENT_ID,
  process.env.GCP_OAUTH_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

function getClosestRatio(width: number, height: number): string {
  if (!width || !height) return "1:1";
  const ratio = width / height;
  
  if (Math.abs(ratio - 16/9) < 0.1) return "16:9";
  if (Math.abs(ratio - 9/16) < 0.1) return "9:16";
  if (Math.abs(ratio - 1) < 0.1) return "1:1";
  if (Math.abs(ratio - 4/3) < 0.1) return "4:3";
  if (Math.abs(ratio - 3/4) < 0.1) return "3:4";
  
  return "1:1";
}

async function main() {
  console.log("Fetching all assets from Supabase free_assets...");
  const { data: dbAssets, error: dbError } = await supabase
    .from("free_assets")
    .select("id, gdrive_file_id, title, aspect_ratio, file_name, media_type");

  if (dbError) {
    console.error("Error fetching db assets:", dbError);
    return;
  }

  console.log(`Found ${dbAssets.length} assets in DB. Inspecting Google Drive metadata...`);

  let updatedCount = 0;

  for (const asset of dbAssets) {
    if (!asset.gdrive_file_id) continue;
    if (asset.media_type === 'music') continue; // skip music

    try {
      // Fetch file metadata from Google Drive
      const res = await drive.files.get({
        fileId: asset.gdrive_file_id,
        fields: "id, name, imageMediaMetadata, videoMediaMetadata",
      });

      const file = res.data;
      let width = 0;
      let height = 0;

      if (file.imageMediaMetadata) {
        width = file.imageMediaMetadata.width || 0;
        height = file.imageMediaMetadata.height || 0;
      } else if (file.videoMediaMetadata) {
        width = file.videoMediaMetadata.width || 0;
        height = file.videoMediaMetadata.height || 0;
      }

      if (!width || !height) {
        continue;
      }

      const actualRatio = getClosestRatio(width, height);
      const dbRatio = asset.aspect_ratio;

      if (actualRatio !== dbRatio) {
        console.log(`\n[Ratio Mismatch] Asset: "${asset.title}"`);
        console.log(`  - Dimensions: ${width}x${height} (${(width/height).toFixed(3)})`);
        console.log(`  - DB Ratio: "${dbRatio}" vs Actual Ratio: "${actualRatio}"`);

        // Compute new filename reflecting the correct ratio
        let currentFileName = asset.file_name || file.name || "";
        const ratioStrFrom = dbRatio.replace(":", "-");
        const ratioStrTo = actualRatio.replace(":", "-");
        
        let newFileName = currentFileName;
        if (currentFileName.includes(`_${ratioStrFrom}_`)) {
          newFileName = currentFileName.replace(`_${ratioStrFrom}_`, `_${ratioStrTo}_`);
        } else {
          // If ratio isn't in name, append it before _ai.png or extension
          const ext = path.extname(currentFileName);
          const base = path.basename(currentFileName, ext);
          newFileName = `${base}_${ratioStrTo}${ext}`;
        }

        console.log(`  - Renaming File: "${currentFileName}" -> "${newFileName}"`);

        // 1. Rename file on Google Drive
        try {
          await drive.files.update({
            fileId: asset.gdrive_file_id,
            requestBody: {
              name: newFileName,
            },
          });
          console.log(`  [GDrive] Renamed successfully.`);
        } catch (gdriveErr: any) {
          console.error(`  [GDrive Warning] Failed to rename on Google Drive: ${gdriveErr.message}`);
        }

        // 2. Update Supabase record
        const { error: updateError } = await supabase
          .from("free_assets")
          .update({
            aspect_ratio: actualRatio,
            width: width,
            height: height,
            file_name: newFileName,
          })
          .eq("id", asset.id);

        if (updateError) {
          console.error(`  [DB Error] Failed to update row: ${updateError.message}`);
        } else {
          console.log(`  [DB Success] Updated to ${actualRatio} (${width}x${height}) & renamed to ${newFileName}`);
          updatedCount++;
        }
      }
    } catch (err: any) {
      console.error(`Error processing file ID ${asset.gdrive_file_id} (${asset.title}): ${err.message}`);
    }
  }

  console.log(`\nFinished! Successfully corrected ratio and renamed ${updatedCount} assets.`);
}

main().catch(console.error);
