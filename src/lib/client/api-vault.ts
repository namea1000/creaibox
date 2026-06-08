import {
  AI_PROVIDER_DEFAULT_MODEL,
  getDefaultModelForProvider,
  getProviderStorage,
  isAiProviderId,
} from "@/lib/ai/provider-registry";

export type GeminiVaultConfig = {
  apiKey: string;
  model: string;
  provider: "gemini_postpay" | "gemini_free";
};

export type GroqVaultConfig = {
  apiKey: string;
  model: string;
  provider: "groq";
};

export type UserAiVaultConfig = GeminiVaultConfig | GroqVaultConfig;

const DEFAULT_GEMINI_MODEL = AI_PROVIDER_DEFAULT_MODEL.gemini_free;
const PUBLIC_GEMINI_NOTICE =
  "현재는 공용 API로 생성 중입니다.\n\nAI 생성이 잘 안되거나 생성 횟수 제한이 있을 수 있습니다.\n사용자 정보 -> API 키 관리 메뉴에서 사용자 본인의 AI모델 API 키를 입력하면 개인 키로 더 안정적으로 이용할 수 있습니다.";

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

type GroqGenerateResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const GROQ_SYSTEM_PROMPT =
  "You are Creaibox AI assistant. Generate high-quality Korean content and follow the requested output format exactly.";
const GROQ_SAFE_TPM_BUDGET = 5600;
const GROQ_MIN_OUTPUT_TOKENS = 768;
const GROQ_MAX_OUTPUT_TOKENS = 2600;

function getStoredValue(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key)?.trim() || "";
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function estimateGroqInputTokens(prompt: string) {
  return Math.ceil((prompt.length + GROQ_SYSTEM_PROMPT.length) / 2.2);
}

function getGroqMaxOutputTokens(prompt: string, responseMimeType?: "application/json") {
  const estimatedInputTokens = estimateGroqInputTokens(prompt);
  const formatBudget = responseMimeType === "application/json" ? 2200 : GROQ_MAX_OUTPUT_TOKENS;
  const tpmSafeBudget = GROQ_SAFE_TPM_BUDGET - estimatedInputTokens;

  return clampNumber(
    Math.min(formatBudget, tpmSafeBudget),
    GROQ_MIN_OUTPUT_TOKENS,
    GROQ_MAX_OUTPUT_TOKENS
  );
}

function getPreferredGeminiModel(providerModelKey: string) {
  const preferredProvider = getStoredValue("preferred_ai_provider");
  const preferredModel = getStoredValue("preferred_ai_model");

  if (
    isAiProviderId(preferredProvider) &&
    (preferredProvider === "gemini_postpay" || preferredProvider === "gemini_free") &&
    preferredModel.startsWith("gemini-")
  ) {
    return preferredModel;
  }

  return getStoredValue(providerModelKey) || DEFAULT_GEMINI_MODEL;
}

export function getUserGeminiVaultConfig(): GeminiVaultConfig | null {
  const preferredProvider = getStoredValue("preferred_ai_provider");
  const providerOrder =
    preferredProvider === "gemini_free"
      ? (["gemini_free", "gemini_postpay"] as const)
      : (["gemini_postpay", "gemini_free"] as const);

  for (const provider of providerOrder) {
    const storage = getProviderStorage(provider);
    const apiKey = getStoredValue(storage.apiKey);

    if (apiKey) {
      return {
        apiKey,
        model: getPreferredGeminiModel(storage.model),
        provider,
      };
    }
  }

  const legacyKey = getStoredValue("gemini_api_key");

  if (legacyKey) {
    return {
      apiKey: legacyKey,
      model: getPreferredGeminiModel("gemini_free_model"),
      provider: "gemini_free",
    };
  }

  return null;
}

export function getUserGroqVaultConfig(): GroqVaultConfig | null {
  const storage = getProviderStorage("groq");
  const apiKey = getStoredValue(storage.apiKey);

  if (!apiKey) return null;

  return {
    apiKey,
    model: getStoredValue(storage.model) || getDefaultModelForProvider("groq"),
    provider: "groq",
  };
}

export function getUserAiVaultConfig(): UserAiVaultConfig | null {
  const preferredProvider = getStoredValue("preferred_ai_provider");

  if (preferredProvider === "groq") {
    return getUserGroqVaultConfig() || getUserGeminiVaultConfig();
  }

  return getUserGeminiVaultConfig() || getUserGroqVaultConfig();
}

export function getRequiredUserGeminiVaultConfig() {
  const config = getUserGeminiVaultConfig();

  if (!config) {
    throw new Error("/apivault에서 Gemini API Key를 먼저 저장해 주세요.");
  }

  return config;
}

export function getPublicGeminiFallbackNotice() {
  return PUBLIC_GEMINI_NOTICE;
}

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

export async function generateGeminiContent({
  apiKey,
  modelName,
  prompt,
  useSearch = false,
  responseMimeType,
}: {
  apiKey: string;
  modelName: string;
  prompt: string;
  useSearch?: boolean;
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

  if (responseMimeType) {
    body.generationConfig = { responseMimeType };
  }

  if (useSearch) {
    body.tools = [{ googleSearch: {} }];
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

export async function generateGroqContent({
  apiKey,
  modelName,
  prompt,
  responseMimeType,
}: {
  apiKey: string;
  modelName: string;
  prompt: string;
  responseMimeType?: "application/json";
}) {
  const body: Record<string, unknown> = {
    model: modelName,
    messages: [
      {
        role: "system",
        content: GROQ_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: getGroqMaxOutputTokens(prompt, responseMimeType),
  };

  if (responseMimeType === "application/json") {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  let data: GroqGenerateResponse = {};

  try {
    data = rawText ? (JSON.parse(rawText) as GroqGenerateResponse) : {};
  } catch {
    if (!response.ok) {
      throw new Error(rawText || `Groq API 요청 실패 (${response.status})`);
    }

    return rawText.trim();
  }

  if (!response.ok) {
    const errorMessage = data.error?.message || rawText || `Groq API 요청 실패 (${response.status})`;

    if (
      response.status === 429 &&
      (errorMessage.toLowerCase().includes("tokens per minute") ||
        errorMessage.toLowerCase().includes("tpm") ||
        errorMessage.toLowerCase().includes("request too large"))
    ) {
      throw new Error(
        `Groq 토큰 제한에 걸렸습니다. 현재 키의 TPM 한도가 낮아 요청을 처리하지 못했습니다. 글 길이를 줄이거나 Groq Dev Tier로 업그레이드해 주세요. (${errorMessage})`
      );
    }

    throw new Error(errorMessage);
  }

  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error(data.error?.message || "Groq 응답 본문이 비어 있습니다.");
  }

  return text;
}

export async function generateGeminiContentWithFallback({
  prompt,
  modelName,
  useSearch = false,
  responseMimeType,
  type = "gemini_generation",
  userId,
  userEmail,
}: {
  prompt: string;
  modelName?: string;
  useSearch?: boolean;
  responseMimeType?: "application/json";
  type?: string;
  userId?: string | null;
  userEmail?: string | null;
}) {
  const userConfig = getUserAiVaultConfig();

  if (userConfig?.provider === "groq") {
    return {
      text: await generateGroqContent({
        apiKey: userConfig.apiKey,
        modelName: userConfig.model,
        prompt,
        responseMimeType,
      }),
      model: userConfig.model,
      provider: userConfig.provider,
      source: "user" as const,
      usedSearch: false,
    };
  }

  if (userConfig) {
    const effectiveUseSearch = userConfig.provider === "gemini_postpay" && useSearch;

    return {
      text: await generateGeminiContent({
        apiKey: userConfig.apiKey,
        modelName: modelName || userConfig.model,
        prompt,
        useSearch: effectiveUseSearch,
        responseMimeType,
      }),
      model: modelName || userConfig.model,
      provider: userConfig.provider,
      source: "user" as const,
      usedSearch: effectiveUseSearch,
    };
  }

  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      prompt,
      provider: "gemini",
      model: modelName || DEFAULT_GEMINI_MODEL,
      useSearch,
      responseMimeType,
      userId: userId || null,
      userEmail: userEmail || null,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.ok) {
    throw new Error(
      data?.error ||
      data?.rawError ||
      `공용 Gemini API 요청에 실패했습니다. (${response.status})`
    );
  }

  return {
    text: String(data.text || ""),
    model: String(data.model || modelName || DEFAULT_GEMINI_MODEL),
    provider: "gemini_public" as const,
    source: "public" as const,
    usedSearch: Boolean(data.usedSearch ?? useSearch),
    vaultId: data.vaultId,
  };
}
