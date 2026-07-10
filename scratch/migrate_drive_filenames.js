const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

// 2. Decrypt API Key helper using AES-256-GCM (API_VAULT_ENCRYPTION_KEY)
function decryptApiKey(encryptedText) {
  if (!encryptedText) return "";
  const encryptionKeyEnv = process.env.API_VAULT_ENCRYPTION_KEY;
  if (!encryptionKeyEnv) {
    return encryptedText;
  }
  try {
    const ENCRYPTION_KEY = Buffer.from(encryptionKeyEnv, "base64");
    const parts = encryptedText.split(".");
    
    if (parts.length !== 3) {
      try {
        return Buffer.from(encryptedText, "base64").toString("utf8");
      } catch {
        return encryptedText;
      }
    }

    const [ivBase64, authTagBase64, encryptedBase64] = parts;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      ENCRYPTION_KEY,
      Buffer.from(ivBase64, "base64")
    );
    decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedBase64, "base64")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("Failed to decrypt API Key, using raw:", err.message);
    return encryptedText;
  }
}

// 3. Supabase Client setup to get the absolute active database key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getLiveGeminiKey() {
  try {
    const { data, error } = await supabase
      .from("admin_api_vault")
      .select("key")
      .eq("status", "active")
      .eq("provider", "gemini")
      .order("priority", { ascending: true })
      .limit(1);

    if (error || !data || data.length === 0) {
      console.warn("[DB-KEY] No active keys returned from DB. Falling back to env key.");
      return decryptApiKey(process.env.GEMINI_API_KEY);
    }
    return decryptApiKey(data[0].key);
  } catch (err) {
    console.error("[DB-KEY-ERROR] Failed to query active api keys:", err.message);
    return decryptApiKey(process.env.GEMINI_API_KEY);
  }
}

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  console.error("GCP OAuth2 credentials are not fully configured in env.");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

// 단순 Fallback 파일명 정화 및 _creaibox 접미사 부착 헬퍼
function fallbackCleanName(fileName) {
  const lastDotIndex = fileName.lastIndexOf(".");
  let baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";

  let cleanBaseName = baseName
    .replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_.-]/g, "_")
    .replace(/__+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!cleanBaseName) {
    cleanBaseName = "media";
  }

  if (!cleanBaseName.toLowerCase().endsWith("_creaibox")) {
    cleanBaseName = `${cleanBaseName}_creaibox`;
  }

  return `${cleanBaseName}${ext}`;
}

// Gemini Vision API를 이용해 이미지 내용에 어울리는 영어 파일명 작명
async function generateAiFilename(fileId, originalName, mimeType, size, activeKey) {
  if (!activeKey) {
    console.log(`[AI-BYPASS] No Gemini API key found. Using fallback cleaner for ${originalName}`);
    return fallbackCleanName(originalName);
  }

  if (!mimeType || !mimeType.startsWith('image/')) {
    return fallbackCleanName(originalName);
  }

  const maxSizeBytes = 4 * 1024 * 1024;
  if (size && parseInt(size) > maxSizeBytes) {
    console.log(`[AI-SKIP] File ${originalName} is too large (${(size / 1024 / 1024).toFixed(1)}MB). Skipping vision naming.`);
    return fallbackCleanName(originalName);
  }

  try {
    console.log(`[AI-DESCRIBE] Downloading buffer for file ID: ${fileId} (${originalName})...`);
    const mediaRes = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const base64Data = Buffer.from(mediaRes.data).toString('base64');
    
    // MimeType 방어 (간혹 .webp 등에서 이상한 mime이 올라오는 경우 image/png로 매핑)
    let finalMime = mimeType;
    if (mimeType.includes("webp")) finalMime = "image/webp";
    else if (mimeType.includes("png")) finalMime = "image/png";
    else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) finalMime = "image/jpeg";
    else finalMime = "image/jpeg";

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Analyze this image and generate an extremely concise, descriptive, and clean filename in English representing the image. It must consist of 2 to 4 keywords, strictly lowercase, and separated by underscores. Do not include any extension (like .png or .jpg), numbers, or special symbols. Output ONLY the raw filename. Example: futuristic_cyberpunk_cafe_interior"
            },
            {
              inlineData: {
                mimeType: finalMime,
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    // 2. Gemini API 호출 (1.5-flash-latest, 2.5-flash 순으로 순회하며 성공할 때까지 시도!)
    const models = ["gemini-1.5-flash-latest", "gemini-2.5-flash", "gemini-1.5-flash"];
    let aiText = "";
    
    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
        const apiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (apiRes.ok) {
          const resData = await apiRes.json();
          aiText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (aiText) {
            console.log(`[AI-SUCCESS] Successfully named "${originalName}" using model: ${model}`);
            break;
          }
        } else {
          const errText = await apiRes.text();
          console.warn(`[AI-TRY] Model ${model} failed: HTTP ${apiRes.status} | Details: ${errText}`);
        }
      } catch (e) {
        console.warn(`[AI-TRY] Model ${model} request error:`, e.message);
      }
    }

    if (!aiText) {
      throw new Error("All Gemini models failed to describe this image.");
    }

    let aiTextClean = aiText.trim().toLowerCase().replace(/[`'"\s]/g, "");

    // 정합성 검사
    let cleanAiName = aiTextClean
      .replace(/[^a-z0-9_.-]/g, "_")
      .replace(/__+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (!cleanAiName || cleanAiName.length < 3) {
      console.warn(`[AI-WARNING] Invalid name suggested by Gemini ("${aiText}"). Falling back.`);
      return fallbackCleanName(originalName);
    }

    if (!cleanAiName.endsWith("_creaibox")) {
      cleanAiName = `${cleanAiName}_creaibox`;
    }

    const lastDotIndex = originalName.lastIndexOf(".");
    const ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : "";

    return `${cleanAiName}${ext}`;

  } catch (err) {
    console.error(`[AI-ERROR] Failed to run Vision AI for ${originalName}:`, err.message);
    return fallbackCleanName(originalName);
  }
}

async function runMigration() {
  console.log("=== Google Drive Vision AI File Renaming Migration Started ===");
  
  // DB에서 진짜 활성 API 키를 실시간 수집!
  console.log("[DB-KEY] Fetching active Gemini API Key from Supabase...");
  const activeKey = await getLiveGeminiKey();
  if (activeKey) {
    console.log("[DB-KEY] Successfully loaded active Gemini API Key.");
  } else {
    console.warn("[DB-KEY] Warning: Running without active Gemini Key (will fallback to regex cleaning).");
  }

  let pageToken = null;
  let totalProcessed = 0;
  let totalRenamed = 0;

  do {
    try {
      // 1. 드라이브 내의 파일 목록 페이징 검색 (폴더 제외, 휴지통 제외)
      const res = await drive.files.list({
        q: "trashed = false and mimeType != 'application/vnd.google-apps.folder'",
        fields: "nextPageToken, files(id, name, mimeType, size)",
        pageSize: 30,
        pageToken: pageToken
      });

      const files = res.data.files || [];
      pageToken = res.data.nextPageToken;

      console.log(`\nFetched ${files.length} files. Processing Vision AI renaming...`);

      // 2. 구글 드라이브 API 및 Gemini 쿼터 제한을 고려하여 순차/세미병렬 처리 (2개 동시)
      const concurrency = 2;
      for (let i = 0; i < files.length; i += concurrency) {
        const chunk = files.slice(i, i + concurrency);
        await Promise.all(chunk.map(async (file) => {
          totalProcessed++;
          const originalName = file.name;
          
          const newName = await generateAiFilename(file.id, originalName, file.mimeType, file.size, activeKey);

          if (originalName !== newName) {
            try {
              console.log(`[RENAMING] ID: ${file.id} | "${originalName}" -> "${newName}"`);
              await drive.files.update({
                fileId: file.id,
                requestBody: { name: newName }
              });
              totalRenamed++;
            } catch (err) {
              console.error(`[-] Failed to rename file ${file.id} (${originalName}):`, err.message);
            }
          } else {
            console.log(`[SKIP] File ID: ${file.id} | "${originalName}" is already formatted.`);
          }
        }));
      }

    } catch (listErr) {
      console.error("[-] Error listing files from Google Drive:", listErr.message);
      break;
    }
  } while (pageToken);

  console.log("\n=== Migration Finished ===");
  console.log(`Total files inspected: ${totalProcessed}`);
  console.log(`Total files renamed: ${totalRenamed}`);
}

runMigration().catch(err => {
  console.error("Fatal migration error:", err);
});
