# API Vault Admin

## 1. Purpose

API Vault Admin은 CreAibox의 모든 외부 API 공급자(Provider)를 통합 관리하는 관리자 전용 운영센터이다.

기존의 단순 API Key 저장소 역할을 넘어,

* AI Provider Pool
* Image Provider Pool
* Video Provider Pool
* Voice Provider Pool
* Search Provider Pool
* Usage Analytics
* Cost Analytics
* Provider Health Monitoring

을 수행하는 중앙 운영 허브 역할을 한다.

---

## 2. Route

```txt
/admin/apivault
```

접근 권한

```txt
Super Admin Only
```

허용 이메일

```txt
creaiboxofficial@gmail.com
jenam7720@gmail.com
namjjang7720@gmail.com
```

---

## 3. Main Features

### API Key Management

관리자는 플랫폼에서 사용하는 모든 API Key를 등록 및 관리할 수 있다.

지원 유형

```txt
AI
Image
Video
Voice
Search
```

---

### Provider Pool Management

각 Provider는 Pool 방식으로 운영된다.

예시

```txt
Gemini API Key 1
Gemini API Key 2
Gemini API Key 3
```

장애 발생 시

```txt
Priority
↓
Fallback
```

순으로 자동 전환된다.

---

### Usage Monitoring

시스템 전체 사용량을 모니터링한다.

표시 항목

```txt
Total API Keys
Active Keys
AI Calls
Monthly Calls
Estimated Cost
```

---

### Provider Analytics

Provider별 호출 수 분석

예시

```txt
Gemini
OpenAI
Claude
Groq
Suno
ElevenLabs
```

---

### Studio Analytics

Studio별 AI 사용량 분석

예시

```txt
Writing Studio
Research Studio
Image Studio
Music Studio
Video Studio
AI Assistant
Reporter
Tools
```

---

## 4. Supported Provider Types

### AI Provider Pool

지원 예정

```txt
Gemini
OpenAI
Claude
Groq
Together AI
Fireworks
```

---

### Image Provider Pool

지원 예정

```txt
Stability AI
Replicate
Leonardo AI
Runware
Clipdrop
OpenAI Images
```

---

### Video Provider Pool

지원 예정

```txt
Runway
Pika
Luma AI
Fal AI
```

---

### Voice Provider Pool

지원 예정

```txt
ElevenLabs
PlayHT
Cartesia
```

---

### Search Provider Pool

지원 예정

```txt
Google Search API
Naver Search API
YouTube Data API
NewsAPI
SerpAPI
```

---

## 5. Database Dependencies

### admin_api_vault

공용 API Pool 저장

주요 컬럼

```txt
provider_type
provider
model
status
priority
daily_limit
monthly_limit
allowed_plan
```

---

### ai_generation_usage_logs

사용량 분석

주요 컬럼

```txt
studio_type
provider
model
estimated_cost
status
prompt_tokens
completion_tokens
total_tokens
```

---

## 6. Provider Status System

상태값

```txt
active
error
limit
disabled
```

설명

### active

정상 사용 가능

---

### error

API 오류 발생

---

### limit

일일 또는 월간 제한 도달

---

### disabled

관리자가 비활성화

---

## 7. Priority System

Provider Pool은 우선순위 기반으로 선택된다.

예시

```txt
Gemini Key A
Priority 100

Gemini Key B
Priority 90

Gemini Key C
Priority 80
```

가장 높은 우선순위부터 사용

---

## 8. Fallback System

우선순위 Key가 실패하면

```txt
Primary
↓
Secondary
↓
Fallback
```

순으로 자동 전환된다.

---

## 9. Cost Management

Cost Weight 기반 비용 관리

컬럼

```txt
cost_weight
```

예시

```txt
1.0
2.0
0.5
```

Provider 선택 시 참고 지표로 활용

---

## 10. Analytics Dashboard

### KPI Cards

상단 카드

```txt
API Keys
AI Calls
Monthly Calls
Estimated Cost
```

---

### Provider Analytics

호출 수 집계

```txt
Gemini
OpenAI
Claude
Groq
```

---

### Studio Analytics

Studio별 호출 수 집계

```txt
Writing
Research
Music
Image
Video
Assistant
```

---

## 11. Future Expansion

### Provider Health Monitoring

예시

```txt
Success Rate
Failure Rate
Average Latency
```

---

### Recharts Dashboard

추가 예정

```txt
일별 호출량
주간 호출량
월간 호출량
비용 추이
```

---

### Cost Forecast

예상 비용 계산

```txt
오늘 비용
이번달 비용
예상 월 비용
```

---

### Token Analytics

토큰 분석

```txt
Prompt Tokens
Completion Tokens
Total Tokens
```

---

## 12. Related Documents

```txt
docs/database/ai-generation-usage-logs-schema.md

docs/database/sql/ai-generation-usage-logs.sql
```

관련 페이지

```txt
/admin/apivault

/apivault

/studio/assistant

/studio/writing

/studio/research

/studio/music

/studio/image
```

API Vault Admin은 CreAibox 전체 AI 인프라 운영의 중앙 통제 센터 역할을 수행한다.


다음 2차 업그레이드에서는

1차
- Usage Analytics
- Provider Analytics
- Studio Analytics

2차
- Recharts 그래프
- Provider Health
- Success Rate
- Cost Dashboard

3차
- AI 운영센터
- 사용자별 사용량
- 플랜별 사용량
- 실시간 비용 추적