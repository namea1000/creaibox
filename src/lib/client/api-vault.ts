export type GeminiVaultConfig = {
  apiKey: string;
  model: string;
  provider: "gemini_postpay" | "gemini_free";
};

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

function getStoredValue(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key)?.trim() || "";
}

function getPreferredGeminiModel(providerModelKey: string) {
  const preferredProvider = getStoredValue("preferred_ai_provider");
  const preferredModel = getStoredValue("preferred_ai_model");

  if (
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
    const keyStorageKey =
      provider === "gemini_postpay" ? "gemini_postpay_api_key" : "gemini_free_api_key";
    const modelStorageKey =
      provider === "gemini_postpay" ? "gemini_postpay_model" : "gemini_free_model";
    const apiKey = getStoredValue(keyStorageKey);

    if (apiKey) {
      return {
        apiKey,
        model: getPreferredGeminiModel(modelStorageKey),
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

export function getRequiredUserGeminiVaultConfig() {
  const config = getUserGeminiVaultConfig();

  if (!config) {
    throw new Error("/apivault에서 Gemini API Key를 먼저 저장해 주세요.");
  }

  return config;
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
