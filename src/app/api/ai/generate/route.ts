import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  userId?: string | null;
  userEmail?: string | null;
};

const FREE_DAILY_LIMIT = 3;

function isHighDemandError(error: any) {
  const message = String(error?.message || error || "").toLowerCase();

  return (
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("try again later")
  );
}

function getFriendlyAiErrorMessage(error: any) {
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
          error: `무료 체험 일일 사용량 ${FREE_DAILY_LIMIT}회를 초과했습니다.`,
          code: "FREE_DAILY_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    const vaultKeys = await getActiveVaultKeys("gemini");

    if (vaultKeys.length === 0) {
      return NextResponse.json(
        { error: "사용 가능한 무료체험 Gemini API Key가 없습니다." },
        { status: 503 }
      );
    }

    let lastError: any = null;

    for (const vault of vaultKeys) {
      try {
        if ((vault.today_count || 0) >= (vault.daily_limit || 1000)) {
          continue;
        }

        const apiKey = decryptVaultKey(vault);
        const genAI = new GoogleGenerativeAI(apiKey);

        const modelName = body.model || vault.model || "gemini-2.0-flash";

        const modelOptions: any = {
          model: modelName,
        };

        if (body.useSearch) {
          modelOptions.tools = [{ googleSearch: {} }];
        }

        const model = genAI.getGenerativeModel(modelOptions);
        const result = await model.generateContent(body.prompt);
        const response = await result.response;
        const text = response.text();

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
        });
      } catch (error: any) {
        lastError = error;
        await recordVaultFailure(vault.id, String(error?.message || error));

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
      errorMessage: String(lastError?.message || lastError || "unknown error"),
    });

    return NextResponse.json(
      {
        error: getFriendlyAiErrorMessage(lastError),
        rawError: String(lastError?.message || lastError || ""),
      },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: getFriendlyAiErrorMessage(error),
        rawError: String(error?.message || error || ""),
      },
      { status: 500 }
    );
  }
}