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

let sheetsClient: any = null;
try {
  const serviceAccountStr = process.env.GOOGLE_INDEXING_CREDENTIALS || '{}';
  const serviceAccount = JSON.parse(serviceAccountStr);
  if (serviceAccount.client_email) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    sheetsClient = google.sheets({ version: 'v4', auth });
  }
} catch (e: any) {
  console.log("Could not init Google Sheets API:", e.message);
}

let spreadsheetRows: any[] = [];
async function loadSpreadsheet() {
  if (!sheetsClient) return;
  try {
    const spreadsheetIds = [
      '1-01HEzdUN-w305uJKA4f5zkm-5_7nYuk7z-ugQYXIek',
      '1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I',
      '18Krz6hFRA2vf44qcwqhNL8ydHN-25LHg0CFWmhcKcoM'
    ];
    
    spreadsheetRows = [];
    
    for (const spreadsheetId of spreadsheetIds) {
      console.log(`Fetching metadata for spreadsheet: ${spreadsheetId}...`);
      // 1. Get all sheet names
      const metaData = await sheetsClient.spreadsheets.get({ spreadsheetId });
      const sheets = metaData.data.sheets || [];
      
      // 2. Fetch data from each sheet
      for (const sheet of sheets) {
        const sheetTitle = sheet.properties?.title;
        if (!sheetTitle) continue;
        
        const response = await sheetsClient.spreadsheets.values.get({
          spreadsheetId,
          range: `'${sheetTitle}'!A2:E500`,
        });
        
        const rows = response.data.values || [];
        // Optionally attach sheet title to each row for better context
        const rowsWithSheetContext = rows.map((r: any) => [...r, `[Sheet: ${sheetTitle}]`]);
        spreadsheetRows.push(...rowsWithSheetContext);
      }
    }
    
    console.log(`Loaded a total of ${spreadsheetRows.length} rows from all Google Sheets.`);
  } catch(e: any) {
    console.error("Failed to load Google Sheets:", e.message);
  }
}

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

let currentApiKeyIndex = 0;

async function analyzeWithGemini(fileName: string, mediaType: string, imageBuffer?: Buffer, mimeType?: string): Promise<{ title: string; tags: string[]; english_title: string; original_prompt: string; topic: string }> {
  const apiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].filter(Boolean) as string[];

  if (apiKeys.length === 0) {
    throw new Error("Missing GEMINI_API_KEY_1, 2, or 3 in environment");
  }

  const apiKey = apiKeys[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
  console.log(`[Gemini API] Using API Key #${currentApiKeyIndex === 0 ? apiKeys.length : currentApiKeyIndex} of ${apiKeys.length}`);

  // Use gemini-2.5-flash for images, gemini-3.1-flash-lite for text only
  const modelName = (imageBuffer && mimeType) ? 'gemini-2.5-flash' : 'gemini-3.1-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const promptContext = spreadsheetRows.map((row, index) => {
    return `Row ${index + 2}: Topic: [${row[0] || ''}], Desc: [${row[2] || ''}], Image Prompt: [${row[3] || ''}], Motion Prompt: [${row[4] || ''}]`;
  }).join("\n");

  const systemInstruction = `
You are an expert AI asset curator. We have a Google Spreadsheet of prompts used to generate AI assets.
Spreadsheet Rows:
${promptContext}

The user uploaded an asset.
Filename: "${fileName}"
Media Type: "${mediaType}"

Your task:
1. Identify which Row from the spreadsheet was most likely used to generate this asset. The filename might contain truncated words from the prompt, description, or topic.
2. If it's a completely random name (like a UUID 'abocado_ai_1774...') and you have NO visual image, try to guess or return Row 2 as fallback. If an image is provided, use the visual content to match it perfectly with the Image Prompt or Desc.
3. Extract the 'Topic' and 'Image Prompt' (or 'Motion Prompt' if video) from the matched row.
4. Generate a highly descriptive, premium Korean title (max 3-4 words, tell a story, don't use single words like '공부방', '산').
5. Generate a clean English title for the filename (max 3-4 words, alphanumeric only, using underscores).
6. Generate 6-9 Korean tags for search filtering based on the 'Topic' and 'Desc'. Include tags that match UI filters like 카테고리 (e.g., '건강 정보', '동기부여', '지식 정보', 'ASMR/백색소음', '플레이리스트', '디자인/배경', 'SNS 카드뉴스', '뉴스 리포트', '힐링/다큐', '자연', '풍경', '바다', '하늘', '감성').

Return ONLY a JSON object (no markdown, no backticks) with the following exact keys:
{
  "title": string,
  "english_title": string,
  "tags": string[],
  "original_prompt": string,
  "topic": string
}`;

  let contents: any[] = [];
  if (imageBuffer && mimeType) {
    contents = [
      {
        parts: [
          { text: systemInstruction },
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
          { text: systemInstruction }
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

  let parsed: any = {};
  try {
    parsed = JSON.parse(textContent);
  } catch(e) {
    console.warn("Failed to parse Gemini output as JSON, attempting to extract JSON from text...");
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  }

  return {
    title: parsed.title || '무제 에셋',
    english_title: parsed.english_title || 'untitled_asset',
    tags: parsed.tags || [],
    original_prompt: parsed.original_prompt || '',
    topic: parsed.topic || ''
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

  // Music folder processing is handled separately by sync-music-r2.ts

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
    .select("gdrive_file_id, prompt");

  if (selectError) {
    console.error("Failed to fetch existing assets from Supabase:", selectError.message);
  }

  const syncedIds = new Set(existingAssets?.map(a => a.gdrive_file_id) || []);
  const syncedWithPrompts = new Set(
    existingAssets?.filter(a => a.prompt && a.prompt.trim() !== '').map(a => a.gdrive_file_id) || []
  );
  
  console.log(`Found ${syncedIds.size} files in DB. (${syncedWithPrompts.size} files have prompts from Gemini)`);

  console.log(`\nStarting sync of ${filesToSync.length} files to Cloudflare R2 (Videos) / Google Drive (Images) and Supabase Database...`);
  
  await loadSpreadsheet();

  const bucketName = process.env.R2_BUCKET_NAME || 'creaibox-assets';
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  for (const file of filesToSync) {
    if (!file.id || !file.name) continue;

    if (syncedWithPrompts.has(file.id)) {
      console.log(`[Skip] File "${file.name}" is already synced and contains a Gemini prompt. Skipping.`);
      continue;
    } else if (syncedIds.has(file.id)) {
      console.log(`[Re-sync] File "${file.name}" is in DB but missing prompt. Re-processing to clean up!`);
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

    let originalPrompt = '';
    let topicCategory = '';

    try {
      if (file.mediaType === 'image' && buffer) {
        console.log(`[Gemini Vision] Analyzing image buffer & matching with Google Sheets...`);
        const geminiRes = await analyzeWithGemini(file.name, file.mediaType, buffer, file.mimeType);
        title = geminiRes.title;
        englishTitle = geminiRes.english_title;
        tags = [...tags, ...geminiRes.tags];
        originalPrompt = geminiRes.original_prompt;
        topicCategory = geminiRes.topic;
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`[AI Matcher] Translating & matching prompt from filename: "${file.name}"...`);
        const geminiRes = await analyzeWithGemini(file.name, file.mediaType);
        title = geminiRes.title;
        englishTitle = geminiRes.english_title;
        tags = [...tags, ...geminiRes.tags];
        originalPrompt = geminiRes.original_prompt;
        topicCategory = geminiRes.topic;
        await new Promise(resolve => setTimeout(resolve, 1000));
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
    
    const isAlreadyClean = false; // Force rename to ensure standard AI clean names are always applied based on the sheet data

    // Append a unique 4-character hash from the Google Drive file ID to prevent collisions in R2/DB
    // when multiple files share the exact same prompt and english title.
    const shortHash = file.id.substring(0, 4).toLowerCase();

    const isMusic = file.mediaType === 'music';
    const newFileName = isAlreadyClean 
      ? file.name 
      : `${cleanEnglishTitleForFile}_${aspectRatio.replace(':', '-')}_${generationType}_${shortHash}_creaibox${extension}`
          .replace(/__+/g, '_')
          .replace(/^_+|_+$/g, '');

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
        prompt: originalPrompt || '', // saved original prompt from Google Sheets
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
