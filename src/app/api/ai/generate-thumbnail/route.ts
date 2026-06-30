import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
} from "@/lib/server/get-free-gemini-key";

type GenerateThumbnailBody = {
  prompt?: string;
  count?: number;
  aspectRatio?: string;
  apiKey?: string;
};

type GeminiInlinePart = {
  text?: string;
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
  inline_data?: {
    mime_type?: string;
    data?: string;
  };
};

type GeminiImageResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiInlinePart[];
    };
  }>;
  error?: {
    message?: string;
  };
};

const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const MAX_IMAGE_COUNT = 3;

function extractImageData(response: GeminiImageResponse) {
  const parts = (response.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || []);

  return parts
    .map((part) => {
      const inlineData = part.inlineData || part.inline_data;
      const mimeType = part.inlineData?.mimeType || part.inline_data?.mime_type || "image/png";
      const data = inlineData?.data;

      return data ? `data:${mimeType};base64,${data}` : null;
    })
    .filter(Boolean) as string[];
}

function extractTextData(response: GeminiImageResponse) {
  return (response.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();
}

function buildGeminiBody(prompt: string, aspectRatio: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: [
              prompt,
              "Create a polished 3:2 Naver blog thumbnail design.",
              "Generate the image directly. Do not search the web. Do not use stock image URLs.",
              "No text overlay unless the design brief explicitly asks for readable Korean title text.",
            ].join("\n"),
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
      },
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateThumbnailBody;
    const prompt = body.prompt?.trim();
    const requestedCount = Number(body.count || 1);
    const count = Math.min(Math.max(requestedCount, 1), MAX_IMAGE_COUNT);
    const aspectRatio = body.aspectRatio || "3:2";
    const apiKey = body.apiKey?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "프롬프트가 필요합니다." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "사용자 API Key가 없습니다. APIVault에서 API Key를 먼저 저장해 주세요." },
        { status: 400 }
      );
    }

    const images: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(
            buildGeminiBody(`${prompt}\nVariation ${index + 1}`, aspectRatio)
          ),
        }
      );

      const data = (await response.json()) as GeminiImageResponse;

      if (!response.ok) {
        throw new Error(
          `${GEMINI_IMAGE_MODEL}: ${data.error?.message || "Gemini 이미지 생성에 실패했습니다."}`
        );
      }

      const generatedImages = extractImageData(data);

      if (generatedImages.length === 0) {
        const textResponse = extractTextData(data);
        throw new Error(
          `${GEMINI_IMAGE_MODEL}: 이미지 데이터가 없습니다.${
            textResponse ? ` Gemini 응답: ${textResponse.slice(0, 300)}` : ""
          }`
        );
      }

      images.push(...generatedImages);
    }

    return NextResponse.json({
      ok: true,
      images: images.slice(0, count),
      model: GEMINI_IMAGE_MODEL,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "썸네일 생성 요청 처리 중 문제가 발생했습니다.",
        rawError: String(error),
      },
      { status: 500 }
    );
  }
}
