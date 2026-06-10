# AI 연동 및 모델 가로채기 메커니즘 (AI Integration & Client Gateways)

`CreAibox`는 클라이언트 비용 절감 및 무한 가동성을 위해 **로컬 스토리지 개인 키 직접 통신**과 **백엔드 공용 키 폴(Pool) 자동 복구 통신**의 이중 게이트웨이 연동 구조를 채택하고 있습니다.

---

## 1. AI 제공자 레지스트리 (`src/lib/ai/provider-registry.ts`)

플랫폼이 공식 지원하는 AI 엔진과 각 제공자별 기본 추천 모델을 매핑하는 데이터 사전입니다.
* **지원 플랫폼**: Google Gemini, Groq, OpenAI, Anthropic Claude.
* **Zustand 및 LocalStorage 연동**: 각 제공자 유형(`AiProviderId`)에 맞는 로컬 스토리지 저장 키 명세를 묶어서 노출합니다.
  - *예시*: `gemini_postpay_api_key`, `openai_model` 등.

---

## 2. API 자격 증명 해결 순서 (Credentials Resolution Hierarchy)

클라이언트가 콘텐츠 작성을 요청할 때, AI API 키를 찾아 연결하는 로직의 우선순위 흐름입니다. (`src/lib/client/api-vault.ts`)

```
[콘텐츠 AI 생성 요청]
   │
   ▼
[사용자 개인 설정 우선순위 확인]
   │
   ├─► localStorage에서 'preferred_ai_provider' (선호하는 제공자) 확인
   ├─► localStorage에서 'preferred_ai_model' (선호하는 모델) 확인
   │
   ▼
[1순위: 로컬 스토리지에 유저가 등록한 개인 키가 존재할 때]
   │
   ├─► 브라우저에서 외부 AI 엔드포인트로 직접 HTTPS 호출 (Gemini / Groq)
   ├─► 장점: 서버 트래픽을 거치지 않아 지연이 적고, 공용 일일 한도 차단 우회
   │
   ▼
[2순위: 로컬 스토리지에 등록된 키가 없을 때 (공용 API Fallback)]
   │
   ├─► 백엔드 엔드포인트 `/api/ai/generate` 로 프록시 요청 전송
   ├─► 데이터베이스(`admin_api_vault`)의 공용 유료/무료 키 풀 가동
   └─► 일일 사용 제한(`FREE_DAILY_LIMIT = 3`) 적용 대상
```

---

## 3. 다중 모델 게이트웨이 연동 상세

### 3-1. 클라이언트 직접 연동 (Gemini Direct)
* 사용자가 본인의 API 키를 입력한 경우, 브라우저가 직접 Google AI Studio REST API(`https://generativelanguage.googleapis.com/...`)에 POST 요청을 날려 콘텐츠를 획득합니다.

### 3-2. 클라이언트 직접 연동 (Groq Direct)
* Groq의 경우 TPM(분당 토큰 제한) 예산 한계가 매우 빡빡하므로, 입력 프롬프트의 길이를 계량하여 생성 가능한 최대 토큰(`max_tokens`)을 수학적으로 보정하여 요청합니다.
  ```typescript
  // Groq TPM 버스트 방지를 위한 가용 토큰 계산 공식
  const estimatedInputTokens = Math.ceil((prompt.length + systemPrompt.length) / 2.2);
  const maxOutputTokens = clamp(5600 - estimatedInputTokens, 768, 2600);
  ```

### 3-3. 공용 백엔드 중계 연동
* 개인 키가 등록되지 않은 사용자에게는 하루 3번의 무료 크레딧을 부여하여 백엔드 DB의 분산 공용 키를 통해 대리 생성 처리를 제공합니다.
