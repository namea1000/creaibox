import { google } from "googleapis";

interface VertexGeminiOptions {
  prompt: string;
  modelName?: string;
  location?: string;
  systemInstruction?: string;
  temperature?: number;
  useSearch?: boolean;
  responseMimeType?: string;
}

function getServiceAccountCredentials() {
  const jsonString = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, "\n"),
          projectId: parsed.project_id || "project-51796415-94e5-4403-ad7",
        };
      }
    } catch {}
  }

  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  const projectId = process.env.GCP_PROJECT_ID || "project-51796415-94e5-4403-ad7";

  if (clientEmail && privateKey) {
    return { clientEmail, privateKey: privateKey.replace(/\\n/g, "\n"), projectId };
  }

  return null;
}

/**
 * Generate Vertex AI OAuth2 Access Token using GCP Service Account
 */
async function getVertexAccessToken(clientEmail: string, privateKey: string) {
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
  const jwtClient = new google.auth.JWT({
    email: clientEmail,
    key: formattedPrivateKey,
    scopes: [
      "https://www.googleapis.com/auth/generative-language",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  });

  const tokens = await jwtClient.authorize();
  if (!tokens.access_token) {
    throw new Error("GCP Vertex AI OAuth2 Access Token 발급 실패");
  }

  return tokens.access_token;
}

/**
 * Call Vertex AI / GCP Service Account OAuth Gemini API using GCP $300 Free Credit
 */
export async function generateContentWithVertexAI({
  prompt,
  modelName = "gemini-1.5-flash",
  location = "us-central1",
  systemInstruction,
  temperature = 0.7,
  useSearch,
  responseMimeType,
}: VertexGeminiOptions): Promise<string> {
  const creds = getServiceAccountCredentials();
  if (!creds) {
    throw new Error("GCP Service Account 인증 정보(GOOGLE_INDEXING_CREDENTIALS)가 설정되지 않았습니다.");
  }

  const accessToken = await getVertexAccessToken(creds.clientEmail, creds.privateKey);

  const requestedModel = modelName || "gemini-3.1-flash-lite";

  // Build model candidates: requested model first (e.g. gemini-3.1-flash-lite), then active Vertex AI fallbacks
  const modelCandidates = Array.from(
    new Set([
      requestedModel,
      "gemini-3.1-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ])
  );

  // Prepare prompt with real-time date injection if search is enabled
  let finalPrompt = prompt;
  if (useSearch) {
    const d = new Date();
    const kstDate = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const dateStr = `${kstDate.getFullYear()}년 ${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일`;
    
    finalPrompt = `[실시간 정보 반영 지침 - 현재 시점: ${dateStr} (KST)]\n구글 실시간 검색 로봇을 구동하여 반드시 오늘(${dateStr}) 최신 뉴스, 주가 시황 및 동향 정보를 직접 수집하고 이를 기반으로 사실만을 정확히 작성해 주세요.\n\n${prompt}`;
  }

  const contents: any[] = [
    {
      role: "user",
      parts: [{ text: finalPrompt }],
    },
  ];

  const payload: Record<string, any> = {
    contents,
    generationConfig: {
      temperature,
      ...(responseMimeType && !useSearch ? { responseMimeType } : {}),
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  let lastErr: Error | null = null;
  const systemApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  for (const targetModel of modelCandidates) {
    // Map targetModel to valid publisher model ID for Vertex AI if needed
    const vertexModel = targetModel.startsWith("gemini-3") ? "gemini-2.0-flash" : targetModel;

    const endpoints: Array<{ url: string; headers: Record<string, string>; isVertex: boolean }> = [
      // 1순위: GCP $300불 크레딧 전용 Vertex AI Service Account OAuth 엔드포인트
      {
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${creds.projectId}/locations/${location}/publishers/google/models/${vertexModel}:generateContent`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        isVertex: true,
      },
      // 2순위: Developer API 엔드포인트
      {
        url: systemApiKey
          ? `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${encodeURIComponent(systemApiKey)}`
          : `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent`,
        headers: {
          "Content-Type": "application/json",
          ...(systemApiKey
            ? { "x-goog-api-key": systemApiKey }
            : { Authorization: `Bearer ${accessToken}` }),
        },
        isVertex: false,
      },
    ];

    for (const ep of endpoints) {
      console.log(`[GCP OAuth $300 Credit Execution] Trying Model: ${targetModel}, Endpoint: ${ep.url}`);

      // Construct endpoint-specific payload (handling Vertex AI search grounding spec)
      const epPayload: Record<string, any> = {
        contents,
        generationConfig: {
          temperature,
          ...(responseMimeType && !useSearch ? { responseMimeType } : {}),
        },
      };

      if (systemInstruction) {
        epPayload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      if (useSearch) {
        epPayload.tools = ep.isVertex
          ? [{ googleSearchRetrieval: {} }]
          : [{ googleSearch: {} }];
      }

      try {
        const res = await fetch(ep.url, {
          method: "POST",
          headers: ep.headers,
          body: JSON.stringify(epPayload),
        });

        if (!res.ok) {
          const errorJson = await res.json().catch(() => ({}));
          const errorMessage = errorJson.error?.message || `GCP API 응답 오류 (${targetModel}: HTTP ${res.status})`;
          console.warn(`[GCP API Warning] ${targetModel} (${ep.url}) 호출 실패:`, errorMessage);
          lastErr = new Error(errorMessage);
          continue;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error(`GCP AI (${targetModel})로부터 올바른 텍스트 응답을 받지 못했습니다.`);
        }

        console.log(`[GCP OAuth $300 Credit Success] Model ${targetModel} successfully generated output!`);
        return text;
      } catch (err: any) {
        lastErr = err;
        console.warn(`[GCP OAuth Retry] ${targetModel} 에러 발생:`, err.message);
      }
    }
  }

  throw lastErr || new Error("GCP AI 모델 호출에 최종 실패했습니다.");
}
