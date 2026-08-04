const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("googleapis");

// 1. 환경변수 읽기
function getEnvValue(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(new RegExp(`${key}=["']?([^"'\\n]+)["']?`));
    if (match) return match[1];
  }
  return null;
}

const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase URL 또는 Service Role Key가 존재하지 않습니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// .env.local 에서 Gemini 무료 키들 추출
function getGeminiKeys() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return [];
  const content = fs.readFileSync(envPath, "utf8");
  const keys = [];
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
  const matches = content.match(/AIzaSy[a-zA-Z0-9_-]{33}/g);
  if (matches) {
    matches.forEach(k => { if (!keys.includes(k)) keys.push(k); });
  }
  return keys;
}

const geminiKeys = getGeminiKeys();

// GCP Vertex AI Access Token 발급 도우미
async function getVertexAccessToken() {
  const credsJson = getEnvValue("GOOGLE_INDEXING_CREDENTIALS");
  let clientEmail = getEnvValue("GOOGLE_INDEXING_CLIENT_EMAIL");
  let privateKey = getEnvValue("GOOGLE_INDEXING_PRIVATE_KEY");
  let projectId = getEnvValue("GCP_PROJECT_ID") || "project-51796415-94e5-4403-ad7";

  if (credsJson) {
    try {
      const parsed = JSON.parse(credsJson);
      if (parsed.client_email && parsed.private_key) {
        clientEmail = parsed.client_email;
        privateKey = parsed.private_key.replace(/\\n/g, "\n");
        projectId = parsed.project_id || projectId;
      }
    } catch {}
  }

  if (!clientEmail || !privateKey) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const tokens = await auth.authorize();
  return { token: tokens.access_token, projectId };
}

// GCP Vertex AI gemini-3.1-flash-lite (또는 gemini-2.5-flash) 호출
async function callVertexAi(prompt) {
  const vertexAuth = await getVertexAccessToken();
  if (!vertexAuth) throw new Error("Vertex AI credentials null");

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${vertexAuth.projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${vertexAuth.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    }),
  });

  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(json.error?.message || "Vertex AI response error");
  }

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "";
}

// ⚡ 1순위 gemini-3.1-flash-lite 전용 AI 호출 엔진
async function generateAiReasonBatch(items) {
  const promptList = items.map(t => ({
    id: t.id,
    brand_id: t.brand_id,
    category: t.category || "TRADEMARK",
    current_reason: t.reason || "",
  }));

  const prompt = `Analyze these ${promptList.length} Korean subdomain reserved brand IDs and identify their exact target organization, company, trademark, celebrity, or entity name in Korean.
Input JSON list:
${JSON.stringify(promptList)}

Output ONLY a valid JSON array of objects:
[
  {
    "id": 123,
    "brand_id": "bluehouse",
    "reason": "[대한민국 청와대] 국가/대통령실 사칭 방지"
  }
]
Rules:
1. 'reason' MUST start with '[Entity Name in Korean]' like '[삼성그룹] 브랜드 사칭 방지' or '[경찰청] 공공기관 사칭 방지' or '[서울대학교] 대학 사칭 방지'.
2. If brand_id is a general term (e.g. 'store', 'app'), use '[공용 서비스] 상업 키워드 선점 방지'.
3. Output ONLY valid JSON array with no extra markdown text.`;

  // 1. gemini-3.1-flash-lite 최우선 실행
  for (const apiKey of geminiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite", // ⚡ 1순위 최신 초고속 모델 지정
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim()) {
        return parseArrayJson(text.trim());
      }
    } catch (e) {
      // gemini-2.5-flash fallback 시도
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim()) {
          return parseArrayJson(text.trim());
        }
      } catch {}
    }
  }

  // 2. Vertex AI Fallback
  try {
    const vertexText = await callVertexAi(prompt);
    if (vertexText && vertexText.trim()) {
      return parseArrayJson(vertexText.trim());
    }
  } catch (vErr) {
    console.warn("Vertex AI fallback warn:", vErr.message);
  }

  return [];
}

function parseArrayJson(text) {
  try {
    const json = JSON.parse(text);
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.items)) return json.items;
    const firstArr = Object.values(json).find(v => Array.isArray(v));
    if (firstArr) return firstArr;
  } catch {}
  return [];
}

// 메인 실행 루프
async function runEnrichmentBatch() {
  console.log("⚡ [Reserved Brand IDs] gemini-3.1-flash-lite 초고속 대용량 Target Entity 자동 보강 시작...");

  // 미비 건수 확인
  const { count: totalUnformatted } = await supabase
    .from("reserved_brand_ids")
    .select("id", { count: "exact", head: true })
    .not("reason", "ilike", "[%]");

  console.log(`📊 현재 DB 내 Target Entity 미비 남은 항목 수: ${totalUnformatted ?? 0}개`);

  if (!totalUnformatted || totalUnformatted === 0) {
    console.log("🎉 모든 예약어 데이터에 [Target Entity 기관명] 서식이 100% 완벽하게 구성되어 있습니다!");
    process.exit(0);
  }

  const BATCH_SIZE = 50;
  let successCount = 0;
  let loops = 0;

  while (true) {
    // 50개씩 미비 항목 가져오기
    const { data: batch, error: batchErr } = await supabase
      .from("reserved_brand_ids")
      .select("id, brand_id, category, reason")
      .not("reason", "ilike", "[%]")
      .limit(BATCH_SIZE);

    if (batchErr || !batch || batch.length === 0) {
      console.log("✅ 모든 미비 항목의 사유 보강이 100% 완벽하게 완료되었습니다!");
      break;
    }

    loops++;
    console.log(`\n⚡ [Batch ${loops}] ${batch.length}개 항목 gemini-3.1-flash-lite 초고속 분석 중... (샘플: '${batch[0].brand_id}')`);

    try {
      const aiResults = await generateAiReasonBatch(batch);

      if (aiResults && aiResults.length > 0) {
        let updatedInBatch = 0;
        for (const item of aiResults) {
          if (item.id && item.reason && item.reason.startsWith("[")) {
            const { error: updateErr } = await supabase
              .from("reserved_brand_ids")
              .update({ reason: item.reason })
              .eq("id", item.id);

            if (!updateErr) updatedInBatch++;
          }
        }
        successCount += updatedInBatch;
        console.log(`  └ 🟢 ${updatedInBatch}개 DB 갱신 성공! (누적 완료: ${successCount}개)`);
      } else {
        console.warn("  └ ⚠️ AI 응답 파싱 실패. 다음 항목 시도...");
        break;
      }
    } catch (err) {
      console.error(`  └ ❌ 실패: ${err.message}`);
      break;
    }

    await new Promise(r => setTimeout(r, 100)); // 초고속 처리
  }

  console.log(`\n🎉 [최종 완료] 총 ${successCount}개의 예약어 사유가 gemini-3.1-flash-lite로 DB에 성공적으로 영구 기록 완료되었습니다!`);
}

runEnrichmentBatch().catch(console.error);
