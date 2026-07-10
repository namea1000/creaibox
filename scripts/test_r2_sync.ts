import * as fs from 'fs';
import { google } from 'googleapis';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import sharp from 'sharp';
import { uploadFreeAssetThumbnail } from '../src/lib/google-drive';

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
  console.error("Missing Supabase configuration in .env.local");
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

function cleanMidjourneyPrompt(fileName: string): { cleanPrompt: string; ratio: string; genType: string } {
  let baseName = fileName.replace(/\.[^/.]+$/, ""); // remove extension
  
  // Strip "Namu" prefix and adjacent spaces/underscores
  baseName = baseName.replace(/^namu[_\s]*/i, '');

  let ratio = '16:9'; // Default for general sync
  
  // Extract ratio matching --ar_169, --ar 16:9, ar_916, etc.
  const ratioMatch = baseName.match(/--ar[_\s]?(16[:\-_]?9|9[:\-_]?16|1[:\-_]?1)/i) || 
                      baseName.match(/ar[_\-\s]?(16[:\-_]?9|9[:\-_]?16|1[:\-_]?1)/i);
  if (ratioMatch) {
    const matchedStr = ratioMatch[1].replace(/[\-_]/g, ':');
    if (matchedStr === '169') {
      ratio = '16:9';
    } else if (matchedStr === '916') {
      ratio = '9:16';
    } else if (matchedStr === '11') {
      ratio = '1:1';
    } else {
      ratio = matchedStr;
    }
  }

  // Default to ai since it's from Midjourney/Luma, but check if user specified real
  let genType = 'ai';
  if (baseName.toLowerCase().includes('real') && !baseName.toLowerCase().includes('realistic')) {
    genType = 'real';
  }

  // Clean prompt
  let cleanPrompt = baseName
    .replace(/--ar[_\s]?\d+([:\-_]?\d+)?/gi, '')
    .replace(/ar[_\-\s]?\d+([:\-_]?\d+)?/gi, '')
    .replace(/--v\s+\d+(\.\d+)?/gi, '')
    .replace(/--style\s+\w+/gi, '')
    .replace(/--s\s+\d+/gi, '')
    .replace(/--personalize/gi, '')
    .replace(/--chaos\s+\d+/gi, '')
    .replace(/--c\s+\d+/gi, '')
    .replace(/--weird\s+\d+/gi, '')
    .replace(/--w\s+\d+/gi, '')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '') // remove uuid
    // Remove raw/style/photo/stylize keywords to avoid uncanny translations like "날것", "원시 스타일"
    .replace(/\b(raw|style|stylize|photo)\b/gi, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If prompt is just numbers/dots/underscores or empty, clear it
  if (/^[\d\s._]+$/.test(cleanPrompt)) {
    cleanPrompt = '';
  }

  return { cleanPrompt, ratio, genType };
}

async function analyzeWithGemini(promptText: string, imageBuffer?: Buffer, mimeType?: string): Promise<{ title: string; tags: string[]; english_title: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let contents: any[] = [];
  if (imageBuffer && mimeType) {
    contents = [
      {
        parts: [
          {
            text: "Look at this image. Output a JSON object containing: 1. 'title' (a highly descriptive, premium, and natural Korean title fitting a high-quality free stock media library, maximum 3-4 words. Do NOT use single word titles like '공부방', '산', '바다'. Tell a beautiful story. Also do NOT use tech terms like '원시', '날것', '로우', 'raw', '스타일'), 2. 'english_title' (a clean, concise English title, max 3-4 words, alphanumeric only, using spaces), 3. 'tags' (array of 6-9 Korean keywords for search classification)."
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBuffer.toString('base64')
            }
          }
        ]
      }
    ];
  } else {
    contents = [
      {
        parts: [
          {
            text: `Translate this image/video generation prompt into a highly descriptive, premium, and natural Korean title fitting a free stock media library (3-4 words. Tell a beautiful story rather than single word titles like '공부방', '산', '바다'. Do NOT use raw/style/photo/stylize literal translations like '날것', '원시', '스타일') and generate 6-9 relevant tags in Korean. Also output a clean, concise English title (max 3-4 words, alphanumeric only, using spaces) for the filename. Return a JSON object with 'title' (string), 'english_title' (string), and 'tags' (array of strings). Prompt: "${promptText}"`
          }
        ]
      }
    ];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  const textContent = resData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = JSON.parse(textContent);
  return {
    title: parsed.title || '무제 에셋',
    english_title: parsed.english_title || 'untitled_asset',
    tags: parsed.tags || []
  };
}

async function findFolder(drive: any, parentId: string, folderName: string): Promise<string | null> {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)"
  });
  const files = res.data.files || [];
  return files.length > 0 ? files[0].id : null;
}

async function scanFolderRecursive(
  drive: any,
  folderId: string,
  categoryName: string,
  filesToSync: any[]
) {
  let pageToken: string | undefined = undefined;
  do {
    const res: any = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, size, createdTime, description, imageMediaMetadata, videoMediaMetadata)",
      pageSize: 100,
      pageToken
    });
    const files = res.data.files || [];
    for (const f of files) {
      if (!f.id || !f.name) continue;
      
      if (f.mimeType === 'application/vnd.google-apps.folder') {
        // Skip thumbnails subfolders to avoid processing thumbnails as raw assets
        if (f.name === 'thumbnails') continue;
        await scanFolderRecursive(drive, f.id, categoryName, filesToSync);
      } else {
        const isImage = f.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(f.name);
        const isVideo = f.mimeType?.startsWith('video/') || /\.(mp4|mkv|mov|avi|webm)$/i.test(f.name);
        const isAudio = f.mimeType?.startsWith('audio/') || /\.(mp3|wav|ogg|aac|flac)$/i.test(f.name);

        if (isImage) {
          filesToSync.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType || 'image/png',
            size: f.size || '0',
            createdTime: f.createdTime || new Date().toISOString(),
            description: f.description || '',
            mediaType: 'image',
            imageMediaMetadata: f.imageMediaMetadata,
            category: categoryName
          });
        } else if (isVideo) {
          filesToSync.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType || 'video/mp4',
            size: f.size || '0',
            createdTime: f.createdTime || new Date().toISOString(),
            description: f.description || '',
            mediaType: 'video',
            videoMediaMetadata: f.videoMediaMetadata,
            category: categoryName
          });
        } else if (isAudio) {
          filesToSync.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType || 'audio/mpeg',
            size: f.size || '0',
            createdTime: f.createdTime || new Date().toISOString(),
            description: f.description || '',
            mediaType: 'music',
            category: categoryName
          });
        }
      }
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);
}

async function main() {
  console.log("Initializing Google Drive Client...");
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;
  const freeAssetsFolderId = process.env.GDRIVE_FREE_ASSETS_FOLDER_ID; // "1g4vJ38vNjo8hYz0mm5ExL0CWn18UNWOu"

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  console.log(`Listing files in Google Drive folder: ${freeAssetsFolderId}...`);
  
  const listRes = await drive.files.list({
    q: `'${freeAssetsFolderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, size)",
  });

  const files = listRes.data.files || [];
  console.log(`Found ${files.length} items in root folder.`);

  const videoFolder = files.find(f => f.name === 'video' && f.mimeType === 'application/vnd.google-apps.folder');
  const imageFolder = files.find(f => f.name === 'image' && f.mimeType === 'application/vnd.google-apps.folder');
  const musicFolder = files.find(f => f.name === 'music' && f.mimeType === 'application/vnd.google-apps.folder');

  const filesToSync: { id: string; name: string; mimeType: string; size: string; createdTime: string; description: string; mediaType: 'video' | 'image' | 'music'; imageMediaMetadata?: any; videoMediaMetadata?: any; category?: string }[] = [];

  if (videoFolder) {
    console.log(`\nDetected 'video' folder. Scanning for subfolders and direct files inside (ID: ${videoFolder.id})...`);
    
    // 1. Fetch direct files under 'video' folder
    let pageToken: string | undefined = undefined;
    do {
      const res: any = await drive.files.list({
        q: `'${videoFolder.id}' in parents and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, size, createdTime, description, videoMediaMetadata)",
        pageSize: 100,
        pageToken
      });
      const files = res.data.files || [];
      files.forEach((f: any) => {
        if (f.id && f.name) {
          if (f.mimeType?.startsWith('video/')) {
            filesToSync.push({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              size: f.size || '0',
              createdTime: f.createdTime || new Date().toISOString(),
              description: f.description || '',
              mediaType: 'video',
              videoMediaMetadata: f.videoMediaMetadata,
              category: 'video_root'
            });
          }
        }
      });
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // 2. Scan subfolders inside 'video' folder for nested files
    const subFoldersRes = await drive.files.list({
      q: `'${videoFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });
    const subFolders = subFoldersRes.data.files || [];
    console.log(`Found ${subFolders.length} category subfolders inside 'video' folder.`);

    for (const folder of subFolders) {
      console.log(`Scanning video category subfolder: ${folder.name} (ID: ${folder.id})...`);
      let subPageToken: string | undefined = undefined;
      do {
        const res: any = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false`,
          fields: "nextPageToken, files(id, name, mimeType, size, createdTime, description, videoMediaMetadata)",
          pageSize: 100,
          pageToken: subPageToken
        });
        const files = res.data.files || [];
        files.forEach((f: any) => {
          if (f.id && f.name && f.mimeType?.startsWith('video/')) {
            filesToSync.push({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              size: f.size || '0',
              createdTime: f.createdTime || new Date().toISOString(),
              description: f.description || '',
              mediaType: 'video',
              videoMediaMetadata: f.videoMediaMetadata,
              category: folder.name || undefined
            });
          }
        });
        subPageToken = res.data.nextPageToken;
      } while (subPageToken);
    }
  }

  if (musicFolder) {
    console.log(`\nDetected 'music' folder. Fetching files inside (ID: ${musicFolder.id})...`);
    const subListRes = await drive.files.list({
      q: `'${musicFolder.id}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, size, createdTime, description)",
    });
    const subFiles = subListRes.data.files || [];
    subFiles.forEach((f: any) => {
      if (f.id && f.name && f.mimeType?.startsWith('audio/')) {
        filesToSync.push({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          size: f.size || '0',
          createdTime: f.createdTime || new Date().toISOString(),
          description: f.description || '',
          mediaType: 'music',
          category: 'music_root'
        });
      }
    });
  }

  if (imageFolder && imageFolder.id) {
    console.log(`\nDetected 'image' folder (ID: ${imageFolder.id}). Starting scan...`);

    // 1. Fetch direct files under 'image' folder
    let imgPageToken: string | undefined = undefined;
    do {
      const res: any = await drive.files.list({
        q: `'${imageFolder.id}' in parents and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, size, createdTime, description, imageMediaMetadata)",
        pageSize: 100,
        pageToken: imgPageToken
      });
      const files = res.data.files || [];
      files.forEach((f: any) => {
        if (f.id && f.name && f.mimeType?.startsWith('image/')) {
          filesToSync.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            size: f.size || '0',
            createdTime: f.createdTime || new Date().toISOString(),
            description: f.description || '',
            mediaType: 'image',
            imageMediaMetadata: f.imageMediaMetadata,
            category: 'image_root'
          });
        }
      });
      imgPageToken = res.data.nextPageToken;
    } while (imgPageToken);

    // 2. Fetch all subfolders directly inside 'image' folder (excluding 'creassets-library')
    const subFoldersRes = await drive.files.list({
      q: `'${imageFolder.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and name != 'creassets-library' and trashed = false`,
      fields: "files(id, name)",
    });
    const customImageFolders = subFoldersRes.data.files || [];
    
    // Scan all custom folders
    for (const folder of customImageFolders) {
      console.log(`Scanning custom image subfolder: ${folder.name} (ID: ${folder.id})...`);
      let pageToken: string | undefined = undefined;
      do {
        const res: any = await drive.files.list({
          q: `'${folder.id}' in parents and trashed = false`,
          fields: "nextPageToken, files(id, name, mimeType, size, createdTime, description, imageMediaMetadata)",
          pageSize: 100,
          pageToken
        });
        const files = res.data.files || [];
        files.forEach((f: any) => {
          if (f.id && f.name && f.mimeType?.startsWith('image/')) {
            filesToSync.push({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              size: f.size || '0',
              createdTime: f.createdTime || new Date().toISOString(),
              description: f.description || '',
              mediaType: 'image',
              imageMediaMetadata: f.imageMediaMetadata,
              category: folder.name || undefined
            });
          }
        });
        pageToken = res.data.nextPageToken;
      } while (pageToken);
    }

    // 3. Scan 'creassets-library' category folders
    const creassetsFolderId = await findFolder(drive, imageFolder.id, "creassets-library");
    if (creassetsFolderId) {
      console.log(`Found 'creassets-library' folder (ID: ${creassetsFolderId}). Scanning category folders...`);
      const subFoldersRes = await drive.files.list({
        q: `'${creassetsFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: "files(id, name)",
      });
      const categoryFolders = subFoldersRes.data.files || [];
      console.log(`Found ${categoryFolders.length} category folders inside creassets-library.`);
      
      for (const catFolder of categoryFolders) {
        if (catFolder.id && catFolder.name) {
          console.log(`Scanning category folder recursively: ${catFolder.name} (ID: ${catFolder.id})...`);
          await scanFolderRecursive(drive, catFolder.id, catFolder.name, filesToSync);
        }
      }
    }
  }

  if (filesToSync.length === 0) {
    console.log("No video or image files found to sync.");
    return;
  }

  console.log("Fetching existing synced file IDs from Supabase...");
  const { data: existingAssets, error: selectError } = await supabase
    .from("free_assets")
    .select("gdrive_file_id");

  if (selectError) {
    console.error("Failed to fetch existing assets from Supabase:", selectError.message);
  }

  const syncedIds = new Set(existingAssets?.map(a => a.gdrive_file_id) || []);
  console.log(`Found ${syncedIds.size} already synced files in Database.`);

  console.log(`\nStarting sync of ${filesToSync.length} files to Cloudflare R2 (Videos) / Google Drive (Images) and Supabase Database...`);
  const bucketName = process.env.R2_BUCKET_NAME || 'creaibox-assets';
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  for (const file of filesToSync) {
    if (!file.id || !file.name) continue;

    if (syncedIds.has(file.id)) {
      console.log(`[Skip] File "${file.name}" (ID: ${file.id}) is already synced. Skipping.`);
      continue;
    }

    console.log(`\n[Syncing] Processing: ${file.name} (${(Number(file.size || 0) / 1024 / 1024).toFixed(2)} MB) [Type: ${file.mediaType}]...`);
    
    // Clean prompt & aspect ratio
    const parsedMidjourney = cleanMidjourneyPrompt(file.name);
    let title = file.name.replace(/\.[^/.]+$/, "");
    let englishTitle = file.name.replace(/\.[^/.]+$/, "");
    let aspectRatio = parsedMidjourney.ratio;
    
    // Override aspect ratio using actual Google Drive image/video metadata if available
    if (file.mediaType === 'image' && file.imageMediaMetadata?.width && file.imageMediaMetadata?.height) {
      const w = file.imageMediaMetadata.width;
      const h = file.imageMediaMetadata.height;
      const ratio = w / h;
      
      if (Math.abs(ratio - 9/16) < 0.1) {
        aspectRatio = '9:16';
      } else if (Math.abs(ratio - 16/9) < 0.1) {
        aspectRatio = '16:9';
      } else if (Math.abs(ratio - 1/1) < 0.1) {
        aspectRatio = '1:1';
      } else if (Math.abs(ratio - 3/4) < 0.1) {
        aspectRatio = '3:4';
      } else if (Math.abs(ratio - 4/3) < 0.1) {
        aspectRatio = '4:3';
      } else {
        if (w > h) {
          aspectRatio = '16:9';
        } else if (h > w) {
          aspectRatio = '9:16';
        } else {
          aspectRatio = '1:1';
        }
      }
      console.log(`[Drive Metadata] Detected aspect ratio from image dimensions: ${w}x${h} (${aspectRatio})`);
    } else if (file.mediaType === 'video' && file.videoMediaMetadata?.width && file.videoMediaMetadata?.height) {
      const w = file.videoMediaMetadata.width;
      const h = file.videoMediaMetadata.height;
      if (w > h) {
        aspectRatio = '16:9';
      } else if (h > w) {
        aspectRatio = '9:16';
      } else {
        aspectRatio = '1:1';
      }
      console.log(`[Drive Metadata] Detected aspect ratio from video dimensions: ${w}x${h} (${aspectRatio})`);
    }

    let generationType = parsedMidjourney.genType;
    let tags: string[] = [file.mediaType === 'video' ? 'Video' : (file.mediaType === 'music' ? 'Music' : 'Image')];

    // Auto-map category folder names to "Post Type" (용도) tags
    const category = (file.category || "").toLowerCase();
    if (category.includes("wealth_money") || category.includes("finance")) {
      tags.push("금융 및 재테크", "뉴스 리포트");
    } else if (category.includes("motivation") || category.includes("inspire")) {
      tags.push("일반 정보성", "동기부여");
    } else if (category.includes("knowledge_sci_fi") || category.includes("scifi") || category.includes("science")) {
      tags.push("지식 정보", "뉴스 리포트");
    } else if (category.includes("study_loop") || category.includes("study") || category.includes("asmr") || category.includes("rain")) {
      tags.push("ASMR/백색소음", "플레이리스트");
    } else if (category.includes("health") || category.includes("fitness")) {
      tags.push("건강 정보", "영양제 분석", "일반 정보성");
    } else if (category.includes("education")) {
      tags.push("지식 정보", "일반 정보성");
    } else if (category.includes("textures") || category.includes("background") || category.includes("design")) {
      tags.push("디자인/배경", "SNS 카드뉴스");
    } else if (category.includes("nature") || category.includes("flora") || category.includes("landscape")) {
      tags.push("힐링/다큐", "플레이리스트");
    }

    // If it's a video or we need Gemini Vision for unnamed images, download the buffer
    let buffer: Buffer | undefined = undefined;
    const needsDownload = file.mediaType === 'video' || file.mediaType === 'image';

    if (needsDownload) {
      console.log(`Downloading file from Google Drive...`);
      try {
        const downloadRes = await drive.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'arraybuffer' }
        ) as any;
        buffer = Buffer.from(downloadRes.data as ArrayBuffer);
        console.log(`Downloaded ${buffer.length} bytes successfully.`);
      } catch (err: any) {
        console.error(`Download failed: ${err.message}. Skipping file.`);
        continue;
      }
    }

    try {
      if (parsedMidjourney.cleanPrompt) {
        console.log(`[AI Translation] Translating prompt: "${parsedMidjourney.cleanPrompt}"...`);
        const geminiRes = await analyzeWithGemini(parsedMidjourney.cleanPrompt);
        title = geminiRes.title;
        englishTitle = geminiRes.english_title;
        tags = [...tags, ...geminiRes.tags];
        // Delay to prevent Gemini API RPM rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else if (file.mediaType === 'image' && buffer) {
        console.log(`[Gemini Vision] Analyzing unnamed image buffer...`);
        const geminiRes = await analyzeWithGemini('', buffer, file.mimeType);
        title = geminiRes.title;
        englishTitle = geminiRes.english_title;
        tags = [...tags, ...geminiRes.tags];
        // Delay to prevent Gemini API RPM rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        title = file.mediaType === 'video' ? 'AI 비디오 템플릿' : (file.mediaType === 'music' ? 'AI 오디오 트랙' : 'AI 이미지');
        englishTitle = file.mediaType === 'video' ? 'ai_video_template' : (file.mediaType === 'music' ? 'ai_audio_track' : 'ai_image');
        tags.push('AI');
      }
    } catch (e: any) {
      console.warn(`[AI Parsing Error] Failed to parse with Gemini: ${e.message}. Falling back to filename.`);
      title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ').replace(/-/g, ' ');
      englishTitle = file.name.replace(/\.[^/.]+$/, "");
      tags.push('AI');
    }

    tags = Array.from(new Set(tags));
    if (aspectRatio === '9:16') {
      tags.push('Shorts');
    }

    const extension = path.extname(file.name);
    const ratioStr = aspectRatio.replace(':', '-');
    const cleanEnglishTitleForFile = englishTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    const isAlreadyClean = /^[a-z0-9_]+$/.test(file.name.replace(/\.[^/.]+$/, "")) && (file.name.includes('_ai') || file.name.includes('_real')) && file.name.includes('_creaibox');
    const isMusic = file.mediaType === 'music';
    const newFileName = isAlreadyClean 
      ? file.name 
      : (isMusic 
          ? `${cleanEnglishTitleForFile}_${generationType}_creaibox${extension}` 
          : `${cleanEnglishTitleForFile}_${ratioStr}_${generationType}_creaibox${extension}`);
    console.log(`Target Clean Filename: "${newFileName}"`);

    // --- File Storage URL Assignment ---
    let storageUrl = '';
    let thumbnailUrl: string | null = null;

    if (file.mediaType === 'video') {
      if (!buffer) {
        console.error(`Fatal: Video buffer is missing for upload!`);
        continue;
      }
      // Upload video to Cloudflare R2
      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: `video/${newFileName}`,
        Body: buffer,
        ContentType: file.mimeType,
      });
      await s3Client.send(uploadCommand);
      console.log(`[R2 Success] Uploaded video/${newFileName} to R2!`);
      storageUrl = `${r2PublicUrl}/video/${encodeURIComponent(newFileName)}`;
    } else {
      // Images and Audios are served directly from Google Drive stream URL
      storageUrl = `https://lh3.googleusercontent.com/d/${file.id}`;
      console.log(`[GDrive Sync] ${file.mediaType} mapped to direct GDrive stream URL: ${storageUrl}`);

      // If it is an image, generate a WebP thumbnail and upload to its parent folder's thumbnails subdirectory
      if (file.mediaType === 'image' && buffer) {
        try {
          // Fetch parent folder ID from Google Drive
          const fileInfo = await drive.files.get({
            fileId: file.id,
            fields: "parents",
          });
          const parents = fileInfo.data.parents;
          if (parents && parents.length > 0) {
            const parentFolderId = parents[0];
            console.log(`[Thumbnail] Generating 400px WebP thumbnail...`);
            const thumbBuffer = await sharp(buffer)
              .resize(400)
              .webp({ quality: 85 })
              .toBuffer();
            const thumbFileName = `thumb_${newFileName.replace(/\.[^/.]+$/, "")}.webp`;
            thumbnailUrl = await uploadFreeAssetThumbnail(
              thumbBuffer,
              thumbFileName,
              "image/webp",
              parentFolderId
            );
            console.log(`[Thumbnail Success] Created and uploaded thumbnail: ${thumbnailUrl}`);
          }
        } catch (thumbErr: any) {
          console.error(`[Thumbnail Error] Failed to generate/upload thumbnail:`, thumbErr.message);
        }
      }
    }

    // Extract YYYYMM format from createdTime
    const createdDate = file.createdTime ? new Date(file.createdTime) : new Date();
    const year = createdDate.getFullYear();
    const month = String(createdDate.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}${month}`;

    // Save/Update metadata in Supabase free_assets table
    const { error: dbError } = await supabase
      .from("free_assets")
      .upsert({
        gdrive_file_id: file.id,
        storage_url: storageUrl,
        thumbnail_url: thumbnailUrl,
        file_name: newFileName,
        mime_type: file.mimeType,
        media_type: file.mediaType,
        year_month: yearMonth,
        title: title,
        tags: tags,
        uploader: '관리자',
        downloads_count: 0,
        views_count: 0,
        width: file.mediaType === 'video' ? 1920 : (file.mediaType === 'music' ? 0 : 1080),
        height: file.mediaType === 'video' ? 1080 : (file.mediaType === 'music' ? 0 : 1080),
        aspect_ratio: file.mediaType === 'music' ? '' : aspectRatio,
        generation_type: generationType,
        camera: file.mediaType === 'music' ? 'AI Audio' : (generationType === 'ai' ? 'AI Generator' : 'Professional Camera'),
        prompt: '', // save original prompt (disabled for now, to be fetched directly later)
        created_at: file.createdTime || new Date().toISOString(),
      }, {
        onConflict: "gdrive_file_id"
      });

    if (dbError) {
      console.error(`[DB Error] Upsert failed for file ${newFileName}:`, dbError.message);
    } else {
      console.log(`[DB Success] Successfully synced file metadata to Database!`);
    }

    // Rename the file in Google Drive
    if (!isAlreadyClean) {
      console.log(`[GDrive Update] Renaming file in Google Drive from "${file.name}" to "${newFileName}"...`);
      try {
        await drive.files.update({
          fileId: file.id,
          requestBody: {
            name: newFileName
          }
        });
        console.log(`[GDrive Success] Renamed successfully!`);
      } catch (gdriveErr: any) {
        console.error(`[GDrive Error] Failed to rename file:`, gdriveErr.message);
      }
    }

    // Sleep slightly between each processed asset to prevent rate limits on APIs
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\nSync process completed successfully!");
}

main().catch(err => {
  console.error("Sync process failed with error:", err);
});
