import { NextRequest, NextResponse } from "next/server";
import {
  decryptVaultKey,
  getActiveVaultKeys,
  recordVaultFailure,
  recordVaultSuccess,
  supabaseAdmin,
  checkAndResetDailyCounts,
} from "@/lib/server/get-free-gemini-key";
import { createClient } from "@/utils/supabase/server";

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
        "x-goog-api-key": apiKey,
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
}: {
  userId?: string | null;
  ipAddress: string;
}) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);

  let query = supabaseAdmin
    .from("ai_generation_usage_logs")
    .select("id", { count: "exact", head: true })
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
  // 0. Verify user session to block unregistered/anonymous access
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Run daily count reset checks asynchronously or synchronously before processing
  await checkAndResetDailyCounts();

  if (userError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

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

    // Fetch user's membership level to match keys
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("membership_level")
      .eq("id", user.id)
      .single();

    const userPlan = (profile?.membership_level || "free").toLowerCase();

    // Query today's usage for the user across all features
    const todayUsage = await countTodayUsage({
      userId,
      ipAddress,
    });

    // Fetch global plan limits from admin_api_vault
    const { data: limitsData } = await supabaseAdmin
      .from("admin_api_vault")
      .select("note")
      .eq("provider", "system")
      .eq("model", "plan_limits")
      .maybeSingle();

    let planLimits: Record<string, number> = {
      free: 20,
      creator: 50,
      pro: 100,
      business: 200,
      admin: 1000,
    };

    if (limitsData?.note) {
      try {
        planLimits = JSON.parse(limitsData.note);
      } catch (e) {
        console.error("Failed to parse plan limits from vault note:", e);
      }
    }

    // Get the limit for the current user's plan
    const userDailyLimit = Number(planLimits[userPlan] ?? planLimits["free"] ?? 20);

    if (todayUsage >= userDailyLimit) {
      return NextResponse.json(
        {
          error: `공용 API 일일 사용량 ${userDailyLimit}회를 초과했습니다. 마이페이지(APIVault)에서 개인 API Key를 등록하시면 CreAibox 의 서비스를 무제한으로 이용하실 수 있습니다.`,
          code: "USER_DAILY_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    const keysToUse = await getActiveVaultKeys("gemini");
    let lastError: unknown = null;

    if (keysToUse.length > 0) {
      for (const vault of keysToUse) {
        try {
          // Check daily limit of the key itself
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
    }

    // Fall back to .env.local GEMINI_API_KEY if vault keys are exhausted, fail, or empty
    const systemApiKey = process.env.GEMINI_API_KEY;

    if (systemApiKey) {
      try {
        const modelName = body.model || DEFAULT_GEMINI_MODEL;
        const text = await generateGeminiContent({
          apiKey: systemApiKey,
          modelName,
          prompt: body.prompt,
          useSearch: Boolean(body.useSearch),
          responseMimeType: body.responseMimeType,
        });

        await logUsage({
          userId,
          userEmail,
          ipAddress,
          featureType,
          provider: "gemini",
          model: modelName,
          status: "success",
        });

        return NextResponse.json({
          ok: true,
          text,
          provider: "gemini",
          model: modelName,
          usedSearch: Boolean(body.useSearch),
        });
      } catch (error: unknown) {
        lastError = error;
        console.error("System Gemini API Key execution failed:", error);
      }
    }

    await logUsage({
      userId,
      userEmail,
      ipAddress,
      featureType,
      provider: "gemini",
      status: "error",
      errorMessage: getErrorMessage(lastError) || "No available Gemini API Keys",
    });

    return NextResponse.json(
      {
        error: getFriendlyAiErrorMessage(lastError || "No available keys"),
        rawError: getErrorMessage(lastError || "No available keys"),
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
