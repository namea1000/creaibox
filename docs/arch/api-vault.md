# API Vault

## Purpose

API Vault는 사용자가 자신의 AI 및 외부 서비스 API Key를 저장하고 기본 AI Provider 및 Model을 설정하는 개인 연결 허브이다.

CreAibox는 사용자 API Key를 우선적으로 사용하며, 사용자가 직접 발급받은 API Key를 브라우저에 저장하여 다양한 AI 및 외부 서비스를 연결할 수 있다.

---

## Route

```txt
/apivault
```

---

## Current Storage Method

현재 API Key는 서버 DB가 아닌 브라우저 LocalStorage에 저장된다.

예시:

```txt
gemini_postpay_api_key
gemini_free_api_key
openai_api_key
claude_api_key
groq_api_key

preferred_ai_provider
preferred_ai_model
```

---

## Security Policy

현재 버전:

```txt
Browser LocalStorage
```

향후 버전:

```txt
Encrypted User Vault
Supabase Storage
Server-side Encryption
```

확장 가능

---

## Main Features

### 기본 AI Provider 설정

사용자는 기본 AI 엔진을 선택할 수 있다.

예시:

* Gemini Free
* Gemini Postpay
* OpenAI
* Claude
* Groq

---

### 기본 Model 설정

Provider별 기본 모델 선택 가능

예시:

* gemini-3-flash-preview
* gemini-2.5-flash
* gpt-4.1
* gpt-4o-mini
* claude-sonnet
* llama-3.3-70b

---

### AI API Key 관리

지원 대상:

* Gemini
* OpenAI
* Claude
* Groq

---

### Search API 관리

지원 대상:

* Google Search API
* Naver Search API
* YouTube Data API

---

### Multimedia API 관리

지원 대상:

* Voice API
* Image API
* Video API

---

## Provider Registry

API Vault는 provider-registry.ts를 기준으로 동작한다.

주요 함수:

```txt
getAiProviderModels()
getDefaultModelForProvider()
isAiProviderId()
```

새 Provider 추가 시 provider-registry.ts만 수정하면 된다.

---

## Default AI Selection Flow

사용자가 AI 생성을 요청하면:

1. preferred_ai_provider 확인
2. preferred_ai_model 확인
3. 선택된 Provider API Key 확인
4. API 호출 수행

---

## Future Expansion

예정 기능:

* 암호화 서버 저장
* 사용자 계정 동기화
* API Key 상태 검사
* 잔액 확인
* 사용량 확인
* 관리자 AI Gateway 연동

---

## Related Files

```txt
src/app/apivault/page.tsx

src/lib/ai/provider-registry.ts
```

API Vault는 CreAibox 사용자의 개인 AI 연결 허브 역할을 수행한다.



3. 나중에 DB가 필요해지는 시점

지금은:

localStorage

하지만 나중에

사용자 계정 동기화

PC ↔ 노트북 ↔ 모바일

암호화 저장

팀 공유

가 들어가면

그때

user_api_vault_keys

테이블 만들게 될 가능성이 높다.

그때는

docs/database/api-vault-schema.md
docs/database/sql/api-vault.sql

이 실제 DB 문서가 된다.