import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
High quality, clean composition, professional blog thumbnail, no watermark, no text unless requested.
`.trim();
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

    for (let i = 0; i < safeCount; i += 1) {
      const imageBuffer =
        safeProvider === "gemini"
          ? await generateWithGemini({
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

      const fileName = `${Date.now()}-${i}.png`;
      const filePath = `image-studio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(filePath, imageBuffer, {
          contentType: "image/png",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("generated-images")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { data: inserted, error: insertError } = await supabase
        .from("generated_images")
        .insert({
          prompt,
          image_url: imageUrl,
          style,
          style_detail: styleDetail,
          aspect_ratio: aspectRatio,
          provider: safeProvider,
        })
        .select(
          "id, image_url, prompt, style, style_detail, aspect_ratio, provider, created_at"
        )
        .single();

      if (insertError) {
        throw new Error(insertError.message);
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