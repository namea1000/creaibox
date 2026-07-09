import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

// R2 S3 Client Initialization
const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const r2AccessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const r2PublicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

// Gemini Vision Helper
async function analyzeImageWithGeminiVision(imageBuffer: Buffer, mimeType: string): Promise<{ title: string; english_title: string; tags: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      parts: [
        {
          text: "Look at this image. Output a JSON object containing:\n" +
                "1. 'title' (a highly descriptive, premium, and natural Korean title fitting a high-quality free stock media library, maximum 3-4 words. Tell a beautiful story rather than single word titles like '공부방', '산', '바다'. Do NOT include tech jargon like '원시', '날것', '로우', 'raw', '스타일', 'Midjourney', '미드저니', '생성형', 'AI' inside the title).\n" +
                "2. 'english_title' (a clean, highly descriptive English title, maximum 3-4 words, alphanumeric only, using spaces, reflecting the actual subject and mood of the image).\n" +
                "3. 'tags' (array of 6-9 descriptive Korean search tags relating to the subject, atmosphere, and usage)."
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
    throw new Error("Empty response from Gemini Vision");
  }

  const parsed = JSON.parse(textContent);
  return {
    title: parsed.title || '고화질 에셋',
    english_title: parsed.english_title || 'premium_asset',
    tags: parsed.tags || []
  };
}

async function renameR2Object(oldFileName: string, newFileName: string) {
  if (!r2BucketName) return;

  const oldKey = `video/${oldFileName}`;
  const newKey = `video/${newFileName}`;

  console.log(`[R2 Rename] Copying "${oldKey}" to "${newKey}"...`);
  try {
    await s3Client.send(new CopyObjectCommand({
      Bucket: r2BucketName,
      CopySource: `${r2BucketName}/${oldKey}`,
      Key: newKey
    }));

    console.log(`[R2 Rename] Deleting old object "${oldKey}"...`);
    await s3Client.send(new DeleteObjectCommand({
      Bucket: r2BucketName,
      Key: oldKey
    }));
    console.log(`[R2 Rename Success] Successfully renamed in R2!`);
  } catch (err: any) {
    console.error(`[R2 Rename Error] Failed to rename R2 file:`, err.message);
  }
}

async function main() {
  console.log("Initializing Google Drive Client...");
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  console.log("Fetching all assets from Database...");
  const { data: assetsToFix, error: selectError } = await supabase
    .from("free_assets")
    .select("id, gdrive_file_id, file_name, title, tags, media_type, mime_type, aspect_ratio, generation_type, storage_url");

  if (selectError) {
    console.error("Failed to fetch assets from Supabase:", selectError.message);
    process.exit(1);
  }

  // Filter out assets that already have '_creaibox' suffix in their filenames
  const filteredAssets = (assetsToFix || []).filter(asset => {
    return !asset.file_name?.includes("creaibox");
  });

  if (filteredAssets.length === 0) {
    console.log("All asset filenames already contain '_creaibox'! Outstanding!");
    return;
  }

  console.log(`Found ${filteredAssets.length} assets to inject '_creaibox' branding suffix.`);

  for (let i = 0; i < filteredAssets.length; i++) {
    const asset = filteredAssets[i];
    const extension = path.extname(asset.file_name || '');
    const ratioStr = (asset.aspect_ratio || "16:9").replace(':', '-');
    const isImage = asset.media_type === 'image';
    const isVideo = asset.media_type === 'video';
    const isMusic = asset.media_type === 'music';

    console.log(`\n[Progress: ${i + 1}/${filteredAssets.length}] Processing [${asset.media_type}] "${asset.title}" (File: ${asset.file_name})...`);

    // Check if the title is uncanny or needs Gemini Vision refinement (only for images)
    const isUncannyTitle = /원시|날것|로우|raw|무보정|스타일|원초적/i.test(asset.title || '');

    if (isImage && (isUncannyTitle || !(asset.tags || []).includes("AI_Refined"))) {
      // 1. Download image from GDrive
      console.log(`Downloading image from Google Drive (ID: ${asset.gdrive_file_id}) for Vision detailing...`);
      let buffer: Buffer;
      try {
        const downloadRes = await drive.files.get(
          { fileId: asset.gdrive_file_id, alt: 'media' },
          { responseType: 'arraybuffer' }
        ) as any;
        buffer = Buffer.from(downloadRes.data as ArrayBuffer);
      } catch (err: any) {
        console.error(`Download failed: ${err.message}. Marking refined and continuing.`);
        // Gracefully skip to avoid loops
        await supabase
          .from("free_assets")
          .update({ tags: Array.from(new Set([...(asset.tags || []), "AI_Refined"])) })
          .eq("id", asset.id);
        continue;
      }

      // 2. Gemini Vision Refinement
      console.log("Analyzing image via Gemini Vision...");
      try {
        const refined = await analyzeImageWithGeminiVision(buffer, asset.mime_type || "image/png");
        const cleanEnglishTitleForFile = refined.english_title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/__+/g, '_')
          .replace(/^_+|_+$/g, '');

        const newFileName = `${cleanEnglishTitleForFile}_${ratioStr}_${asset.generation_type || "ai"}_creaibox${extension}`;
        console.log(`New Branded Filename: "${newFileName}"`);

        // Update DB
        const mergedTags = Array.from(new Set([...(asset.tags || []), ...refined.tags, "AI_Refined"]));
        await supabase
          .from("free_assets")
          .update({
            title: refined.title,
            tags: mergedTags,
            file_name: newFileName
          })
          .eq("id", asset.id);

        // Rename GDrive
        await drive.files.update({
          fileId: asset.gdrive_file_id,
          requestBody: { name: newFileName }
        });
        console.log("[Success] Refined, branded and renamed successfully.");

      } catch (apiErr: any) {
        console.error(`[Error] Gemini refinement failed:`, apiErr.message);
      }

    } else {
      // Simple renaming logic (For already cleaned images, videos, and music)
      // Extract base name without existing extensions/suffixes
      const rawBaseName = (asset.file_name || '').replace(/\.[^/.]+$/, "");
      const cleanBaseName = rawBaseName
        .replace(/_creaibox/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '');

      const newFileName = `${cleanBaseName}_creaibox${extension}`;
      console.log(`Simple renaming to branded target: "${newFileName}"`);

      // 1. Update Database
      let updateFields: any = { file_name: newFileName };

      // If it's a video, update the CDN storage url path as well
      if (isVideo && asset.storage_url) {
        const oldCdnPath = `video/${asset.file_name}`;
        const newCdnPath = `video/${newFileName}`;
        updateFields.storage_url = asset.storage_url.replace(oldCdnPath, newCdnPath);
        console.log(`Updating video storage_url to: "${updateFields.storage_url}"`);
      }

      const { error: updateError } = await supabase
        .from("free_assets")
        .update(updateFields)
        .eq("id", asset.id);

      if (updateError) {
        console.error(`[DB Error] Failed to rename:`, updateError.message);
        continue;
      }

      // 2. Rename Google Drive file name
      try {
        await drive.files.update({
          fileId: asset.gdrive_file_id,
          requestBody: { name: newFileName }
        });
        console.log("[GDrive Success] Simple GDrive rename completed.");
      } catch (gdriveErr: any) {
        console.error(`[GDrive Error] Failed simple rename in GDrive:`, gdriveErr.message);
      }

      // 3. Rename Cloudflare R2 object (For videos)
      if (isVideo) {
        await renameR2Object(asset.file_name || '', newFileName);
      }
    }

    // Small delay to protect API limits
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log("\nAll target assets successfully branded with '_creaibox' suffix!");
}

main().catch(err => {
  console.error("Refinement script failed:", err);
});
