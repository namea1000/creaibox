import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const dotenvPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase configuration in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

// Target Google Drive Music Folder ID
const TARGET_MUSIC_FOLDER_ID = "1cNLtK54Ood88sQPmUHAyVXBuRo23OAiq";

interface DriveAudioFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdTime: string;
}

// 24 Mood translation mapping
const moodMap: Record<string, string> = {
  "upbeat": "경쾌한", "horror": "공포", "cute": "귀여운", "groovy": "그루브",
  "suspenseful": "긴장감", "minimal": "단순한", "dramatic": "드라마틱", "romantic": "로맨틱",
  "dreamy": "몽환적인", "bright": "밝은", "solemn": "비장한", "sad": "슬픈",
  "exciting": "신나는", "mysterious": "신비로운", "nostalgic": "아련한", "epic": "웅장한",
  "calm": "잔잔한", "fun": "재밌는", "refreshing": "청량한", "comical": "코믹한",
  "peaceful": "평온한", "happy": "행복한", "hopeful": "희망찬", "scary": "무서운"
};

/**
 * Scan all audio files recursively inside Google Drive folders.
 */
async function scanFolderRecursive(drive: any, folderId: string, filesAccumulator: DriveAudioFile[]) {
  let pageToken: string | undefined = undefined;
  do {
    const res: any = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, size, createdTime)",
      pageSize: 100,
      pageToken
    });

    const files = res.data.files || [];
    for (const f of files) {
      if (!f.id || !f.name) continue;

      if (f.mimeType === 'application/vnd.google-apps.folder') {
        await scanFolderRecursive(drive, f.id, filesAccumulator);
      } else {
        const isAudio = f.mimeType?.startsWith('audio/') || /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(f.name);
        if (isAudio) {
          filesAccumulator.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType || 'audio/mpeg',
            size: parseInt(f.size || '0', 10),
            createdTime: f.createdTime || new Date().toISOString()
          });
        }
      }
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);
}

/**
 * Check if a file already exists on Cloudflare R2
 */
async function checkIfR2Exists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (err: any) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 Initializing Google Drive Client...");
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("❌ ERROR: Missing Google API Credentials in env.");
    return;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // 1. Fetch current database records to cache existing items and skip fast
  console.log("🗄️ Fetching existing music assets from Supabase...");
  const { data: dbAssets, error: dbError } = await supabase
    .from('free_assets')
    .select('gdrive_file_id, file_name')
    .eq('media_type', 'music');

  if (dbError) {
    console.error("⚠️ Warning: Failed to fetch database assets, sync might re-process files:", dbError.message);
  }
  const dbFileIds = new Set((dbAssets || []).map(a => a.gdrive_file_id));

  // 2. Load existing music metadata JSON mapping
  const metadataPath = path.resolve(process.cwd(), "src/lib/constants/music_metadata.json");
  let metadataList: any[] = [];
  if (fs.existsSync(metadataPath)) {
    metadataList = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  }
  console.log(`📑 Loaded ${metadataList.length} music entries from music_metadata.json.`);

  // 3. Scan Google Drive folder recursively
  console.log(`📂 Scanning Google Drive folder recursively (ID: ${TARGET_MUSIC_FOLDER_ID})...`);
  const driveFiles: DriveAudioFile[] = [];
  await scanFolderRecursive(drive, TARGET_MUSIC_FOLDER_ID, driveFiles);
  console.log(`🎵 Found ${driveFiles.length} audio files in Google Drive.`);

  let newUploadsCount = 0;
  let skippedCount = 0;

  for (const file of driveFiles) {
    // Strip extensions for song title comparison
    const baseName = file.name.replace(/\.[^/.]+$/, "");

    // Find metadata matching spreadsheet JSON (lookup by title)
    // Matching case insensitively or fallback to default values
    const sheetMatch = metadataList.find(item => item.title.toLowerCase().trim() === baseName.toLowerCase().trim());

    const finalSubGenre = sheetMatch?.subGenre || "General";
    const finalGenreGroup = sheetMatch?.genreGroup || "기능성 오디오";
    const finalGenreGroupEng = sheetMatch?.genreGroupEng || "General_Audio";
    const finalMood = sheetMatch?.mood || "Calm";
    const finalPrompt = sheetMatch?.prompt || `Atmospheric audio track titled ${baseName}`;

    // Normalize paths
    const cleanSubGenre = finalSubGenre.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanGenreGroup = finalGenreGroupEng.replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Nested directory R2 path!
    const r2Key = `music/${cleanGenreGroup}/${cleanSubGenre}/${cleanFileName}`;
    const r2Url = `${R2_PUBLIC_URL}/${r2Key}`;

    // Skip if already registered in Database and exists in local JSON mapping
    const inDB = dbFileIds.has(file.id);
    const inJSON = metadataList.some(item => item.title.toLowerCase() === baseName.toLowerCase() || item.id === `song_${file.id}`);

    if (inDB && inJSON) {
      console.log(`[SKIP] Already synced: "${file.name}"`);
      skippedCount++;
      continue;
    }

    console.log(`\n🔥 Syncing: "${file.name}" (Drive ID: ${file.id})`);

    // 4. Download file from Google Drive to memory buffer
    let fileBuffer: Buffer;
    try {
      const driveFileRes = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      fileBuffer = Buffer.from(driveFileRes.data as any);
    } catch (e: any) {
      console.error(`❌ Failed to download "${file.name}" from Drive:`, e.message);
      continue;
    }

    // 5. Upload file to Cloudflare R2 if it doesn't exist
    const existsInR2 = await checkIfR2Exists(r2Key);
    if (!existsInR2) {
      console.log(`☁️ Uploading to R2: "${r2Key}"...`);
      try {
        const uploadCommand = new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: r2Key,
          Body: fileBuffer,
          ContentType: file.mimeType,
        });
        await s3Client.send(uploadCommand);
        console.log("✅ Uploaded to R2 successfully!");
      } catch (uploadErr: any) {
        console.error(`❌ R2 upload failed for "${file.name}":`, uploadErr.message);
        continue;
      }
    } else {
      console.log(`[R2 Cached] File already exists on R2 storage.`);
    }

    // Split moods for tag mapping
    const moodTags = finalMood.split(',').map((m: string) => m.trim().toLowerCase());
    const koreanMoodTags = moodTags.map((m: string) => moodMap[m] || '').filter(Boolean);

    const finalTags = Array.from(new Set([
      finalSubGenre.toLowerCase(),
      finalGenreGroup.toLowerCase(),
      finalMood.toLowerCase(),
      "music", "bgm", "음악", "사운드",
      ...moodTags,
      ...koreanMoodTags
    ]));

    // Extract YYYYMM format from createdTime
    const createdDate = file.createdTime ? new Date(file.createdTime) : new Date();
    const year = createdDate.getFullYear();
    const month = String(createdDate.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}${month}`;

    // 7. Write/Update Supabase database free_assets record
    const assetPayload = {
      gdrive_file_id: file.id,
      file_name: cleanFileName,
      storage_url: r2Url,
      mime_type: file.mimeType,
      created_at: file.createdTime,
      title: baseName,
      tags: finalTags,
      media_type: 'music',
      uploader: '관리자',
      year_month: yearMonth,
      downloads_count: sheetMatch?.downloads || 0,
      views_count: sheetMatch?.views || 0,
      generation_type: 'ai',
      prompt: finalPrompt,
      is_official_theme_asset: false,
      theme_category: 'music',
      is_business_only: false
    };

    console.log(`🗄️ Upserting database record for "${baseName}"...`);
    const { error: upsertError } = await supabase
      .from('free_assets')
      .upsert(assetPayload, { onConflict: 'gdrive_file_id' });

    if (upsertError) {
      console.error(`❌ DB register failed for "${baseName}":`, upsertError.message);
    } else {
      console.log(`✅ DB record registered successfully!`);
    }

    // 8. Add to JSON file if not already present
    if (!inJSON) {
      metadataList.push({
        id: `song_${file.id}`,
        title: baseName,
        genreGroup: finalGenreGroup,
        genreGroupEng: finalGenreGroupEng,
        subGenre: finalSubGenre,
        mood: finalMood,
        prompt: finalPrompt,
        audioUrl: r2Url
      });
    }

    newUploadsCount++;
  }

  // 9. Write final updated JSON file back to src/lib/constants/
  if (newUploadsCount > 0) {
    fs.writeFileSync(metadataPath, JSON.stringify(metadataList, null, 2), 'utf-8');
    console.log(`\n🎉 Success: Sync completed. Mapped and saved ${newUploadsCount} new songs into music_metadata.json.`);
  } else {
    console.log(`\n✨ Sync completed. No new uploads needed. (${skippedCount} tracks skipped/cached)`);
  }
}

main().catch(err => {
  console.error("❌ ERROR running sync pipeline:", err);
});
