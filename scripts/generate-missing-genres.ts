import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import sharp from "sharp";

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: .env.local 파일에 GEMINI_API_KEY가 설정되어 있지 않습니다.");
  process.exit(1);
}

interface MissingGenre {
  id: string;
  prompt: string;
}

const MISSING_GENRES_PATH = path.resolve(process.cwd(), "missing_genres_real.json");
const TARGET_DIR = path.resolve(process.cwd(), "public/images/genres");

if (!fs.existsSync(MISSING_GENRES_PATH)) {
  console.error("❌ ERROR: missing_genres_real.json 파일이 없습니다.");
  process.exit(1);
}

const missingGenres: MissingGenre[] = JSON.parse(fs.readFileSync(MISSING_GENRES_PATH, "utf-8"));

// 저장 디렉토리 존재 확인 및 생성
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAndConvertImage(genre: MissingGenre) {
  const cleanId = genre.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const webpFileName = `${cleanId}.webp`;
  const webpFilePath = path.join(TARGET_DIR, webpFileName);

  // 이미 WebP 파일이 존재하면 스킵
  if (fs.existsSync(webpFilePath)) {
    console.log(`[SKIP] Already exists: ${webpFileName}`);
    return;
  }

  // 독창적인 디자인 묘사를 극대화하고 텍스트 노이즈 유입을 막기 위해 프롬프트 튜닝
  const finalPrompt = `${genre.prompt}, modern art aesthetic, no text, no words, no letters, clean background, 1:1 aspect ratio, high resolution`;

  console.log(`[GENERATE] Starting: "${genre.id}" ...`);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: finalPrompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputMimeType: "image/png",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || "Unknown API Error";
      throw new Error(`API Error: ${errMsg}`);
    }

    const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Bytes) {
      throw new Error("No predictions or image bytes returned from Gemini API.");
    }

    // 1. PNG 버퍼 획득
    const pngBuffer = Buffer.from(base64Bytes, "base64");

    // 2. sharp를 사용하여 고품질 WebP 파일로 인코딩
    const webpBuffer = await sharp(pngBuffer)
      .webp({ quality: 90, effort: 6 })
      .toBuffer();

    // 3. 파일 저장
    fs.writeFileSync(webpFilePath, webpBuffer);
    console.log(`✅ SUCCESS: Generated and saved WebP: ${webpFileName}`);

  } catch (err: any) {
    console.error(`❌ FAILED: "${genre.id}" -`, err.message);
    if (err.message.includes("quota") || err.message.includes("429")) {
      console.warn("⚠️ WARNING: API Quota Limit reached. Stopping batch execution to avoid blockages.");
      process.exit(2);
    }
  }
}

async function run() {
  console.log(`🚀 Starting AI Image Generation and WebP Conversion for ${missingGenres.length} missing genres...`);
  
  for (let i = 0; i < missingGenres.length; i++) {
    const genre = missingGenres[i];
    console.log(`\n[Progress: ${i + 1}/${missingGenres.length}]`);
    await generateAndConvertImage(genre);
    
    // API Quota/Rate Limit 우회를 위해 안전하게 5초의 인터벌 부여
    await sleep(5000);
  }
  
  console.log("\n🎉 ALL DONE! Check public/images/genres folder for WebP files.");
}

run().catch((err) => {
  console.error("💥 Critical script failure:", err);
  process.exit(1);
});
