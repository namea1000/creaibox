import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
  supabaseAdmin,
} from "@/lib/server/get-free-gemini-key";

type GenerateBody = {
  type: string;
  prompt: string;
  provider?: "gemini";
  model?: string;
  useSearch?: boolean;
  responseMimeType?: "application/json";
  userId?: string | null;
  userEmail?: string | null;
};

const FREE_DAILY_LIMIT = 3;
const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

function extractGeminiText(data: GeminiGenerateResponse) {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(data.error?.message || "Gemini 응답 본문이 비어 있습니다.");
  }

  return text;
}

async function generateGeminiContent({
  apiKey,
  modelName,
  prompt,
  useSearch,
  responseMimeType,
}: {
  apiKey: string;
  modelName: string;
  prompt: string;
  useSearch: boolean;
  responseMimeType?: "application/json";
}) {
  const modelPath = modelName.startsWith("models/") ? modelName : `models/${modelName}`;
  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  if (useSearch) {
    body.tools = [{ googleSearch: {} }];
  }

  if (responseMimeType) {
    body.generationConfig = { responseMimeType };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const rawText = await response.text();
  let data: GeminiGenerateResponse = {};

  try {
    data = rawText ? (JSON.parse(rawText) as GeminiGenerateResponse) : {};
  } catch {
    if (!response.ok) {
      throw new Error(rawText || `Gemini API 요청 실패 (${response.status})`);
    }

    return rawText.trim();
  }

  if (!response.ok) {
    throw new Error(data.error?.message || rawText || `Gemini API 요청 실패 (${response.status})`);
  }

  return extractGeminiText(data);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "");
}

function isHighDemandError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("try again later")
  );
}

function getFriendlyAiErrorMessage(error: unknown) {
  if (isHighDemandError(error)) {
    return "AI 서버가 현재 혼잡합니다. 자동 재시도 후에도 실패했습니다. 잠시 후 다시 시도해주세요.";
  }

  return "AI 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function countTodayUsage({
  userId,
  ipAddress,
  featureType,
}: {
  userId?: string | null;
  ipAddress: string;
  featureType: string;
}) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);

  let query = supabaseAdmin
    .from("ai_generation_usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("feature_type", featureType)
    .gte("created_at", since.toISOString());

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("ip_address", ipAddress);
  }

  const { count, error } = await query;

  if (error) {
    console.warn("usage count failed:", error.message);
    return 0;
  }

  return count || 0;
}

async function logUsage({
  userId,
  userEmail,
  ipAddress,
  featureType,
  provider,
  model,
  vaultId,
  status,
  errorMessage,
}: {
  userId?: string | null;
  userEmail?: string | null;
  ipAddress: string;
  featureType: string;
  provider: string;
  model?: string;
  vaultId?: number;
  status: "success" | "error";
  errorMessage?: string;
}) {
  await supabaseAdmin.from("ai_generation_usage_logs").insert([
    {
      user_id: userId || null,
      user_email: userEmail || null,
      ip_address: ipAddress,
      feature_type: featureType,
      provider,
      model,
      vault_id: vaultId || null,
      status,
      error_message: errorMessage || null,
    },
  ]);
}

export async function POST(req: NextRequest) {
  const ipAddress = getClientIp(req);

  try {
    const body = (await req.json()) as GenerateBody;

    if (!body.type || !body.prompt) {
      return NextResponse.json(
        { error: "type과 prompt가 필요합니다." },
        { status: 400 }
      );
    }

    const featureType = body.type;
    const userId = body.userId || null;
    const userEmail = body.userEmail || null;

    const todayUsage = await countTodayUsage({
      userId,
      ipAddress,
      featureType,
    });

    if (todayUsage >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `공용 API 일일 사용량 ${FREE_DAILY_LIMIT}회를 초과했습니다. 사용자 정보 > API 키 관리 메뉴에서 본인의 API 키를 입력하면 개인 키로 계속 생성할 수 있습니다.`,
          code: "FREE_DAILY_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    const vaultKeys = await getActiveVaultKeys("gemini");

    if (vaultKeys.length === 0) {
      return NextResponse.json(
        { error: "사용 가능한 공용 Gemini API Key가 없습니다." },
        { status: 503 }
      );
    }

    let lastError: unknown = null;

    for (const vault of vaultKeys) {
      try {
        if ((vault.today_count || 0) >= (vault.daily_limit || 1000)) {
          continue;
        }

        const apiKey = decryptVaultKey(vault);
        const modelName = body.model || vault.model || DEFAULT_GEMINI_MODEL;
        const text = await generateGeminiContent({
          apiKey,
          modelName,
          prompt: body.prompt,
          useSearch: Boolean(body.useSearch),
          responseMimeType: body.responseMimeType,
        });

        await recordVaultSuccess(vault.id);

        await logUsage({
          userId,
          userEmail,
          ipAddress,
          featureType,
          provider: "gemini",
          model: modelName,
          vaultId: vault.id,
          status: "success",
        });

        return NextResponse.json({
          ok: true,
          text,
          provider: "gemini",
          model: modelName,
          vaultId: vault.id,
          usedSearch: Boolean(body.useSearch),
        });
      } catch (error: unknown) {
        lastError = error;
        await recordVaultFailure(vault.id, getErrorMessage(error));

        if (!isHighDemandError(error)) {
          continue;
        }

        continue;
      }
    }

    await logUsage({
      userId,
      userEmail,
      ipAddress,
      featureType,
      provider: "gemini",
      status: "error",
      errorMessage: getErrorMessage(lastError) || "unknown error",
    });

    return NextResponse.json(
      {
        error: getFriendlyAiErrorMessage(lastError),
        rawError: getErrorMessage(lastError),
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: getFriendlyAiErrorMessage(error),
        rawError: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
