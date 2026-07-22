import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { uploadToGoogleDrive, isGoogleDriveConfigured } from "./src/lib/google-drive";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config({ path: path.join(projectRoot, ".env") });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const apiKey = process.env.GEMINI_API_KEY!;

async function generateGeminiNative16by9(prompt: string): Promise<Buffer> {
  const selectedModel = "gemini-2.5-flash-image";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((part: any) => part.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data returned from Gemini API");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function run() {
  console.log("Calling Gemini 2.5 Flash Native 16:9 Image Generation...");
  const prompt = `Create a widescreen 16:9 aspect ratio horizontal landscape tech blog thumbnail for '클릭을 부르는 검색 엔진 최적화(SEO) 제목 작성 전략: 2026년 최신 가이드'. Features neon tech color theme with cyan, purple, and gold lights. Central 3D glass card with Korean text 'SEO 제목 작성 전략' and 'CTR 30% 상승', 3D magnifying glass, trending upward charts, 2026 AI badges. Clean modern 16:9 Korean tech blog cover illustration.`;

  try {
    const buffer = await generateGeminiNative16by9(prompt);
    console.log("SUCCESSFULLY_GENERATED_NATIVE_16_9_IMAGE_VIA_GEMINI!");

    const userId = "6604537f-3680-4a50-b995-ae3ddb44604d";
    const uuidVal = "27e2628a-a41a-46c2-a51b-8e0cdcefdef3";
    const displayIdVal = "174";

    if (isGoogleDriveConfigured()) {
      const fileName = `native_gemini_16_9_${Date.now()}.png`;
      const imageUrl = await uploadToGoogleDrive(buffer, fileName, "image/png", userId, "writing_creaibox_posts");
      console.log("Uploaded Native 16:9 image to Google Drive:", imageUrl);

      await supabase
        .from("generated_images")
        .update({
          image_url: imageUrl,
          aspect_ratio: "16:9",
          provider: "gemini-2.5-flash-image",
          is_primary: true,
        })
        .eq("user_id", userId)
        .eq("source_type", "writing_creaibox_posts")
        .in("source_id", [uuidVal, displayIdVal])
        .eq("image_role", "thumbnail");

      console.log("UPDATED_DB_RECORD_WITH_NATIVE_16_9_URL:", imageUrl);
    }
  } catch (err: any) {
    console.error("Gemini 16:9 error:", err.message);
  }
}

run().catch(console.error);
