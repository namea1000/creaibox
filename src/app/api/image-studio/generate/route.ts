import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";
import { uploadToGoogleDrive, isGoogleDriveConfigured } from "@/lib/google-drive";

export const runtime = "nodejs";

type ImageProvider = "openai" | "gemini";

function getOpenAiSize(aspectRatio: string) {
  switch (aspectRatio) {
    case "1:1":
      return "1024x1024";
    case "16:9":
      return "1536x864";
    case "9:16":
      return "864x1536";
    case "3:2":
      return "1536x1024";
    case "4:5":
      return "1024x1280";
    default:
      return "1024x1024";
  }
}

function buildFinalPrompt({
  prompt,
  style,
  styleDetail,
  aspectRatio,
}: {
  prompt: string;
  style: string;
  styleDetail: string;
  aspectRatio: string;
}) {
  return `
${prompt}

Style: ${style || "blog thumbnail"}
Detail style: ${styleDetail || "clean visual"}
Aspect ratio: ${aspectRatio || "3:2"}
The final image must follow this exact aspect ratio: ${aspectRatio || "3:2"}.
Create a Korean editorial infographic blog thumbnail like a premium Naver blog cover image.
Fill the entire canvas edge-to-edge with the thumbnail design.
Use a bold readable Korean headline based only on the provided title and topic.
Use 3 to 4 compact Korean key-point boxes with simple icons, charts, arrows, or topic symbols.
Use a dark cinematic background, vivid blue/yellow/white contrast, clean hierarchy, and strong financial/news/analysis visual energy when relevant.
Do not create a browser mockup, framed card, polaroid, SNS post card, caption footer, white border, margin, padding, or rounded outer container.
Use sharp rectangular edges only. Do not round the image corners, inner panels, labels, data boxes, or visual frames.
Do not add aspect-ratio labels, "3:2" text, sample labels, unrelated English, random brand names, watermark, UI badges, or bottom metadata strips.
Every visible word must be intentional Korean text from the title/topic/keywords.
High quality, clean composition, professional Korean blog thumbnail.
`.trim();
}

function getAspectRatioSize(aspectRatio: string) {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1200, height: 675 };
    case "9:16":
      return { width: 675, height: 1200 };
    case "1:1":
      return { width: 1000, height: 1000 };
    case "4:5":
      return { width: 960, height: 1200 };
    case "3:2":
    default:
      return { width: 1200, height: 800 };
  }
}

async function generateWithOpenAI({
  prompt,
  aspectRatio,
  apiKey,
  model,
}: {
  prompt: string;
  aspectRatio: string;
  apiKey: string;
  model: string;
}) {
  const size = getOpenAiSize(aspectRatio);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "gpt-image-1",
      prompt,
      size,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "OpenAI 이미지 생성 실패");
  }

  const base64 = data.data?.[0]?.b64_json;

  if (!base64) {
    throw new Error("OpenAI 이미지 결과가 없습니다.");
  }

  return Buffer.from(base64, "base64");
}

async function generateWithGemini({
  prompt,
  apiKey,
  model,
}: {
  prompt: string;
  apiKey: string;
  model: string;
}) {
  const selectedModel = model || "gemini-2.5-flash-image";

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
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Gemini 이미지 생성 실패");
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((part: any) => part.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini 이미지 결과가 없습니다.");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

function getImagenAspectRatio(aspectRatio: string) {
  switch (aspectRatio) {
    case "16:9":
      return "16:9";
    case "9:16":
      return "9:16";
    case "1:1":
      return "1:1";
    case "4:3":
      return "4:3";
    case "3:4":
      return "3:4";
    case "3:2":
      return "4:3"; // Map 3:2 to nearest 4:3
    case "4:5":
      return "3:4"; // Map 4:5 to nearest 3:4
    default:
      return "1:1";
  }
}

async function generateWithImagen3({
  prompt,
  aspectRatio,
  apiKey,
  model,
}: {
  prompt: string;
  aspectRatio: string;
  apiKey: string;
  model: string;
}) {
  const selectedModel = model || "imagen-3.0-generate-002";
  const imagenAspectRatio = getImagenAspectRatio(aspectRatio);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:predict?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: imagenAspectRatio,
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Imagen 3 이미지 생성 실패");
  }

  const base64 = data.predictions?.[0]?.bytesBase64Encoded;

  if (!base64) {
    throw new Error("Imagen 3 이미지 결과가 없습니다.");
  }

  return Buffer.from(base64, "base64");
}

async function compressForStorage(imageBuffer: Buffer, aspectRatio: string) {
  const { width, height } = getAspectRatioSize(aspectRatio);

  return sharp(imageBuffer)
    .rotate()
    .resize({
      width,
      height,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .webp({
      quality: 72,
      effort: 5,
    })
    .toBuffer();
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      prompt,
      style,
      styleDetail,
      aspectRatio = "3:2",
      provider = "gemini",
      model,
      apiKey,
      count = 1,
      sourceType,
      sourceId,
      imageRole,
      markAsPrimary = false,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 없습니다." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "사용자 API Key가 없습니다. APIVault에서 API Key를 먼저 저장해 주세요.",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "로그인 세션을 확인할 수 없습니다." },
        { status: 401 }
      );
    }

    const safeProvider: ImageProvider =
      provider === "openai" ? "openai" : "gemini";

    const finalPrompt = buildFinalPrompt({
      prompt,
      style,
      styleDetail,
      aspectRatio,
    });

    const createdImages = [];
    const safeCount = Math.min(Math.max(Number(count) || 1, 1), 5);
    const safeSourceId = sourceId ? String(sourceId) : null;
    const safeImageRole = imageRole || "generated";

    if (markAsPrimary && sourceType && safeSourceId) {
      const { error: clearPrimaryError } = await supabase
        .from("generated_images")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .eq("source_type", sourceType)
        .eq("source_id", safeSourceId);

      if (clearPrimaryError) {
        throw new Error(`generated_images primary reset failed: ${clearPrimaryError.message}`);
      }
    }

    for (let i = 0; i < safeCount; i += 1) {
      const isImagenModel = model?.startsWith("imagen-");
      const imageBuffer =
        safeProvider === "gemini"
          ? isImagenModel
            ? await generateWithImagen3({
                prompt: finalPrompt,
                aspectRatio,
                apiKey,
                model: model || "imagen-3.0-generate-002",
              })
            : await generateWithGemini({
                prompt: finalPrompt,
                apiKey,
                model: model || "gemini-2.5-flash-image",
              })
          : await generateWithOpenAI({
              prompt: finalPrompt,
              aspectRatio,
              apiKey,
              model: model || "gpt-image-1",
            });

      const compressedImageBuffer = await compressForStorage(imageBuffer, aspectRatio);
      const fileName = `${Date.now()}-${i}.webp`;
      let imageUrl = "";

      if (isGoogleDriveConfigured()) {
        try {
          imageUrl = await uploadToGoogleDrive(compressedImageBuffer, fileName, "image/webp");
        } catch (gdriveError: any) {
          console.error("Google Drive upload failed, falling back to Supabase storage:", gdriveError);
        }
      }

      if (!imageUrl) {
        const filePath = `${user.id}/image-studio/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("generated-images")
          .upload(filePath, compressedImageBuffer, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("generated-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("generated_images")
        .insert({
          user_id: user.id,
          prompt,
          image_url: imageUrl,
          style,
          aspect_ratio: aspectRatio,
          provider: safeProvider,
          source_type: sourceType || null,
          source_id: safeSourceId,
          image_role: safeImageRole,
          is_primary: Boolean(markAsPrimary && i === 0),
        })
        .select(
          "id, image_url, prompt, style, aspect_ratio, provider, source_type, source_id, image_role, is_primary, created_at"
        )
        .single();

      if (insertError) {
        throw new Error(`generated_images insert failed: ${insertError.message}`);
      }

      createdImages.push(inserted);
    }

    return NextResponse.json({
      images: createdImages,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "이미지 생성 실패",
      },
      { status: 500 }
    );
  }
}
