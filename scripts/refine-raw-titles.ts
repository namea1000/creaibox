import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeWithGemini } from './test_r2_sync'; // We can adapt or re-implement Gemini vision analysis locally

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

// Custom Gemini Vision analyzer helper
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
                "1. 'title' (a highly descriptive, premium, and natural Korean title fitting a high-quality free stock media library, maximum 3-4 words. Do NOT include tech jargon like '원시', '날것', '로우', 'raw', '스타일', 'Midjourney', '미드저니', '생성형', 'AI' inside the title).\n" +
                "2. 'english_title' (a clean, concise English title, maximum 3 words, alphanumeric only, using spaces, reflecting the actual subject of the image).\n" +
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

async function main() {
  console.log("Initializing Google Drive Client...");
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  console.log("Fetching assets with raw/uncanny titles from Supabase...");
  const { data: assetsToFix, error: selectError } = await supabase
    .from("free_assets")
    .select("id, gdrive_file_id, file_name, title, tags, media_type, mime_type, aspect_ratio, generation_type")
    .eq("media_type", "image")
    .or("title.ilike.%원시%,title.ilike.%날것%,title.ilike.%로우%,title.ilike.%raw%,title.ilike.%무보정%,title.ilike.%스타일%,title.ilike.%원초적%");

  if (selectError) {
    console.error("Failed to fetch assets from Supabase:", selectError.message);
    process.exit(1);
  }

  if (!assetsToFix || assetsToFix.length === 0) {
    console.log("No assets with raw/uncanny titles found. Everything is clean!");
    return;
  }

  console.log(`Found ${assetsToFix.length} assets with uncanny raw-styled titles to refine.`);

  for (let i = 0; i < assetsToFix.length; i++) {
    const asset = assetsToFix[i];
    console.log(`\n[Refining ${i + 1}/${assetsToFix.length}] Current Title: "${asset.title}" (File: ${asset.file_name})...`);

    // Download image from Drive to analyze via Gemini Vision
    console.log(`Downloading image from Google Drive (ID: ${asset.gdrive_file_id})...`);
    let buffer: Buffer;
    try {
      const downloadRes = await drive.files.get(
        { fileId: asset.gdrive_file_id, alt: 'media' },
        { responseType: 'arraybuffer' }
      ) as any;
      buffer = Buffer.from(downloadRes.data as ArrayBuffer);
    } catch (err: any) {
      console.error(`Download failed for asset ${asset.file_name}: ${err.message}. Skipping.`);
      continue;
    }

    // Call Gemini Vision to analyze the actual image content
    console.log("Analyzing actual image content via Gemini Vision...");
    try {
      const refined = await analyzeImageWithGeminiVision(buffer, asset.mime_type || "image/png");
      console.log(`Refined Results:\n- Title: "${refined.title}"\n- English Title: "${refined.english_title}"\n- Tags: [${refined.tags.join(", ")}]`);

      // Determine new file name
      const extension = path.extname(asset.file_name);
      const ratioStr = (asset.aspect_ratio || "16:9").replace(':', '-');
      const cleanEnglishTitleForFile = refined.english_title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '');

      const newFileName = `${cleanEnglishTitleForFile}_${ratioStr}_${asset.generation_type || "ai"}${extension}`;
      console.log(`New Target Filename: "${newFileName}"`);

      // 1. Update Database
      const { error: updateError } = await supabase
        .from("free_assets")
        .update({
          title: refined.title,
          tags: Array.from(new Set([...asset.tags, ...refined.tags])),
          file_name: newFileName
        })
        .eq("id", asset.id);

      if (updateError) {
        console.error(`[DB Error] Failed to update metadata for ${asset.file_name}:`, updateError.message);
        continue;
      }
      console.log("[DB Success] Metadata updated successfully.");

      // 2. Rename Google Drive file name
      try {
        await drive.files.update({
          fileId: asset.gdrive_file_id,
          requestBody: {
            name: newFileName
          }
        });
        console.log("[GDrive Success] File renamed successfully.");
      } catch (gdriveErr: any) {
        console.error(`[GDrive Error] Failed to rename GDrive file:`, gdriveErr.message);
      }

      // Add a slight delay to prevent API rate limit issues
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (apiErr: any) {
      console.error(`[Gemini Vision Error] Analysis failed:`, apiErr.message);
    }
  }

  console.log("\nTitle refinement and file renaming completed successfully!");
}

main().catch(err => {
  console.error("Refinement script failed:", err);
});
