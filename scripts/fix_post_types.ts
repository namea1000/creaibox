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
  console.log("Starting Post Types / Purposes Auto-tagging script...");
  
  // 1. Fetch all assets from Supabase
  const { data: dbAssets, error: dbError } = await supabase
    .from("free_assets")
    .select("id, gdrive_file_id, file_name, tags, media_type");
    
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
  
  const filesCategoryMap = new Map<string, string>();
  
  // Scan Images
  if (imageFolder && imageFolder.id) {
    console.log(`Scanning 'image' folder (ID: ${imageFolder.id})...`);
    
    // Scan custom subfolders first
    const subFoldersRes = await drive.files.list({
      q: `'${imageFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and name != 'creassets-library' and trashed = false`,
      fields: "files(id, name)",
    });
    const customImageFolders = subFoldersRes.data.files || [];
    for (const folder of customImageFolders) {
      if (!folder.id || !folder.name) continue;
      let pageToken: string | undefined = undefined;
      do {
        const res: any = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false`,
          fields: "nextPageToken, files(id, name)",
          pageSize: 100,
          pageToken
        });
        const files = res.data.files || [];
        files.forEach((f: any) => {
          if (f.id && folder.name) {
            filesCategoryMap.set(f.id, folder.name);
          }
        });
        pageToken = res.data.nextPageToken;
      } while (pageToken);
    }

    // Scan creassets-library
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
      
      for (const catFolder of categoryFolders) {
        if (!catFolder.id || !catFolder.name) continue;
        let pageToken: string | undefined = undefined;
        do {
          const res: any = await drive.files.list({
            q: `'${catFolder.id}' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name)",
            pageSize: 100,
            pageToken: pageToken
          });
          const catFiles = res.data.files || [];
          catFiles.forEach((f: any) => {
            if (f.id && catFolder.name) {
              filesCategoryMap.set(f.id, catFolder.name);
            }
          });
          pageToken = res.data.nextPageToken;
        } while (pageToken);
      }
    }
  }

  // Scan Videos
  if (videoFolder && videoFolder.id) {
    console.log(`Scanning 'video' folder (ID: ${videoFolder.id})...`);
    
    const subFoldersRes = await drive.files.list({
      q: `'${videoFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });
    const subFolders = subFoldersRes.data.files || [];
    
    for (const folder of subFolders) {
      if (!folder.id || !folder.name) continue;
      let pageToken: string | undefined = undefined;
      do {
        const res: any = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false`,
          fields: "nextPageToken, files(id, name)",
          pageSize: 100,
          pageToken
        });
        const files = res.data.files || [];
        files.forEach((f: any) => {
          if (f.id && folder.name) {
            filesCategoryMap.set(f.id, folder.name);
          }
        });
        pageToken = res.data.nextPageToken;
      } while (pageToken);
    }
  }
  
  console.log(`Mapped ${filesCategoryMap.size} files to their respective categories in Drive.`);
  
  // 3. Process tags update
  let updatedCount = 0;
  for (const asset of dbAssets) {
    const categoryName = filesCategoryMap.get(asset.gdrive_file_id);
    const fileName = (asset.file_name || "").toLowerCase();
    
    const newTags: string[] = [];
    
    // A. Auto-map based on category folder name
    if (categoryName) {
      const category = categoryName.toLowerCase();
      if (category.includes("wealth_money") || category.includes("finance")) {
        newTags.push("금융 및 재테크", "뉴스 리포트");
      } else if (category.includes("motivation") || category.includes("inspire")) {
        newTags.push("일반 정보성", "동기부여");
      } else if (category.includes("knowledge_sci_fi") || category.includes("scifi") || category.includes("science")) {
        newTags.push("지식 정보", "뉴스 리포트");
      } else if (category.includes("study_loop") || category.includes("study") || category.includes("asmr") || category.includes("rain")) {
        newTags.push("ASMR/백색소음", "플레이리스트");
      } else if (category.includes("health") || category.includes("fitness")) {
        newTags.push("건강 정보", "영양제 분석", "일반 정보성");
      } else if (category.includes("education")) {
        newTags.push("지식 정보", "일반 정보성");
      } else if (category.includes("textures") || category.includes("background") || category.includes("design")) {
        newTags.push("디자인/배경", "SNS 카드뉴스");
      } else if (category.includes("nature") || category.includes("flora") || category.includes("landscape")) {
        newTags.push("힐링/다큐", "플레이리스트");
      }
    }
    
    // B. Keyword-based secondary analysis (Fallback or Enrichment)
    if (fileName.includes("cafe") || fileName.includes("rain") || fileName.includes("asmr") || fileName.includes("study") || fileName.includes("ambient")) {
      newTags.push("ASMR/백색소음", "플레이리스트");
    }
    if (fileName.includes("money") || fileName.includes("rich") || fileName.includes("finance") || fileName.includes("coin") || fileName.includes("invest")) {
      newTags.push("금융 및 재테크");
    }
    if (fileName.includes("health") || fileName.includes("gym") || fileName.includes("workout") || fileName.includes("supplement") || fileName.includes("vitamin")) {
      newTags.push("건강 정보", "영양제 분석");
    }
    if (fileName.includes("news") || fileName.includes("report") || fileName.includes("trend")) {
      newTags.push("뉴스 리포트");
    }
    
    if (newTags.length === 0) continue;
    
    // Merge tags
    const currentTags = asset.tags || [];
    const mergedTags = Array.from(new Set([...currentTags, ...newTags]));
    
    // Check if tags changed
    if (mergedTags.length > currentTags.length) {
      console.log(`Updating tags for [${asset.media_type}] ${asset.file_name}:`);
      console.log(`  - Old: ${JSON.stringify(currentTags)}`);
      console.log(`  - New: ${JSON.stringify(mergedTags)}`);
      
      const { error: updateError } = await supabase
        .from("free_assets")
        .update({ tags: mergedTags })
        .eq("id", asset.id);
        
      if (updateError) {
        console.error(`  - Failed to update tags in DB:`, updateError.message);
      } else {
        updatedCount++;
      }
    }
  }
  
  console.log(`\nUpdated tags for ${updatedCount} assets successfully!`);
}

fix().catch(console.error);
