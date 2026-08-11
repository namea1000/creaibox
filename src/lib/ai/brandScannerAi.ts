import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { generateContentWithVertexAI } from "@/lib/server/vertex-ai-gemini";
import { getActiveVaultKeys, decryptVaultKey } from "@/lib/server/get-free-gemini-key";

// .env.local 파일에서 직접 Gemini 무료 키 2개 파싱 추출
function getGeminiEnvKeys(): string[] {
  const keys: string[] = [];
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      // # Google Gemini Free Tier API Key 주석 아래 라인들 파싱
      const lines = content.split("\n");
      let inGeminiSection = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes("Google Gemini Free Tier API Key")) {
          inGeminiSection = true;
          continue;
        }
        if (inGeminiSection) {
          if (trimmed.startsWith("#") || (trimmed.includes("=") && !trimmed.startsWith("AIzaSy"))) {
            inGeminiSection = false;
          } else if (trimmed.length > 20) {
            keys.push(trimmed);
          }
        }
      }
      // AIzaSy 패턴 추가 수집
      const matches = content.match(/AIzaSy[a-zA-Z0-9_-]{33}/g);
      if (matches) {
        matches.forEach((k) => {
          if (!keys.includes(k)) keys.push(k);
        });
      }
    }
  } catch (e) {
    console.warn("[brandScannerAi] .env.local file read notice:", e);
  }

  // process.env 에 직접 등록된 키가 있다면 추가
  if (process.env.GEMINI_API_KEY && !keys.includes(process.env.GEMINI_API_KEY)) {
    keys.unshift(process.env.GEMINI_API_KEY);
  }
  if (process.env.GOOGLE_AI_API_KEY && !keys.includes(process.env.GOOGLE_AI_API_KEY)) {
    keys.unshift(process.env.GOOGLE_AI_API_KEY);
  }

  return keys;
}

// 1순위 지정 모델: gemini-3.5-flash-lite (실패 시 백업 모델)
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
];

export async function generateBrandAiJson(prompt: string): Promise<string> {
  // ─── 1순위: .env.local Google Gemini Free Tier API Keys (2개 로테이션) ───
  const envKeys = getGeminiEnvKeys();

  // Vault DB 키 보충
  if (envKeys.length === 0) {
    try {
      const vaultKeys = await getActiveVaultKeys("gemini");
      (vaultKeys || []).forEach((vk) => {
        const decrypted = decryptVaultKey(vk);
        if (decrypted && !envKeys.includes(decrypted)) envKeys.push(decrypted);
      });
    } catch {}
  }

  for (const apiKey of envKeys) {
    for (const modelName of GEMINI_MODELS) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (geminiError: any) {
        console.warn(`[brandScannerAi] Gemini (${modelName}) key warning:`, geminiError.message || geminiError);
        // 다음 모델 또는 다음 키로 진행
      }
    }
  }

  // ─── 2순위: Groq (LLaMA 3.3 70B) ───
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a precise JSON generator. Output ONLY valid JSON with no markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 6000,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (content && content.trim()) {
        return content.trim();
      }
    } catch (groqError: any) {
      console.warn("[brandScannerAi] Groq 2순위 실패, 3순위 Vertex AI로 전환:", groqError.message || groqError);
    }
  }

  // ─── 3순위: GCP Vertex AI ($300 크레딧 구동) ───
  try {
    const vertexResult = await generateContentWithVertexAI({
      prompt,
      modelName: "gemini-2.5-flash",
      temperature: 0.2,
      responseMimeType: "application/json",
    });

    if (vertexResult && vertexResult.trim()) {
      return vertexResult.trim();
    }
  } catch (vertexError: any) {
    console.error("[brandScannerAi] 3순위 Vertex AI 예외:", vertexError.message || vertexError);
  }

  throw new Error("1순위 Gemini, 2순위 Groq, 3순위 Vertex AI 서비스가 모두 응답하지 않았거나 쿼터가 소진되었습니다.");
}
