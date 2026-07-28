# GCP Agent Platform API (Vertex AI) 서비스 구축 및 트러블슈팅 완전 매뉴얼

---

## 1. 개요 및 구축 목적

- **목적**: Google Cloud Platform(GCP) 신규 가입 시 지급되는 **$300 (₩448,756원) 무료 체험 크레딧**을 활용하여, CreAibox 서비스를 이용하는 일반 사용자들에게 개인 API 키 없이도 최신 **`gemini-2.5-flash`** 최고 성능 AI 모델과 **구글 실시간 검색 그라운딩(Google Search Grounding)** 기능을 100% 무상으로 안정 제공하기 위함입니다.
- **구글 AI 스튜디오 vs GCP Vertex AI 차이점**:
  - **Google AI Studio (`generativelanguage.googleapis.com`)**: 독립 선불/후불 결제 체계로, GCP 신규 $300 무료 크레딧이 연동되지 않음.
  - **GCP Vertex AI / Agent Platform API (`aiplatform.googleapis.com`)**: GCP 통합 빌링 계정을 사용하므로 $300 무료 크레딧에서 차감되어 무상 사용 가능.

---

## 2. 🟢 구글 클라우드 콘솔(GCP Console) 작업 절차 (개발자 직접 수행)

### 1단계: GCP 프로젝트 생성 및 빌링 계정 연동
1. [Google Cloud Console](https://console.cloud.google.com/) 접속 및 로그인.
2. 상단 프로젝트 선택 드롭다운 ➔ **[새 프로젝트]** 클릭 (프로젝트명: `CreAiBox`, ID: `project-51796415-94e5-4403-ad7`).
3. **[결제(Billing)]** 메뉴에서 신규 가입 시 제공받은 **$300 무료 체험 크레딧 계정**이 해당 프로젝트에 연결되어 있는지 확인.

### 2단계: 필수 API 서비스 활성화
1. GCP 콘솔 상단 검색창에 **`Vertex AI API`** 검색 후 **[사용]** 클릭.
2. **`Agent Platform API`** 검색 후 **[사용]** 클릭.

### 3단계: 서비스 계정(Service Account) 생성 및 키 발급
1. 좌측 메뉴 ➔ **[IAM 및 행정]** ➔ **[서비스 계정]** 이동.
2. 상단 **[+ 서비스 계정 생성]** 클릭.
   - 서비스 계정 이름: `creaibox-indexing-bot`
   - 생성된 서비스 계정 이메일: `creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`
3. 생성된 서비스 계정 클릭 ➔ **[키]** 탭 ➔ **[키 추가]** ➔ **[새 키 생성]** ➔ **`JSON`** 선택 후 다운로드.

### 4단계: ⚠️ [핵심] 서비스 계정에 IAM 역할(`편집자` / Editor) 부여
> **🚨 시행착오 및 트러블슈팅 핵심**: 서비스 계정만 생성하고 IAM 권한을 지정하지 않으면, Vertex AI 호출 시 `Permission 'aiplatform.endpoints.predict' denied (HTTP 403)` 오류가 발생하며 GCP 콘솔 오류율이 100%로 잡히고 생성이 불가능해집니다.

1. 좌측 메뉴 ➔ **[IAM 및 행정]** ➔ **[IAM]** 이동.
2. 상단 **`[+ 액세스 권한 부여]`** 클릭.
3. 오른쪽 팝업 메뉴 설정:
   - **`새 주구성원`**: 서비스 계정 이메일 입력  
     `creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`
   - **`역할 선택`**: **`편집자` (Editor)** 선택 (또는 `Vertex AI 사용자` / `roles/aiplatform.user`)
4. 하단 파란색 **[저장]** 버튼 클릭.

---

## 3. ⚙️ CreAibox 백엔드 및 프론트엔드 연동 개발 (AI 에이전트 수행)

### 1단계: 환경변수(`.env.local`) 설정
`.env.local` 파일에 다운받은 GCP 서비스 계정 JSON 정보를 설정합니다.
```env
GOOGLE_INDEXING_CLIENT_EMAIL="creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com"
GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_INDEXING_CREDENTIALS='{"type":"service_account","project_id":"project-51796415-94e5-4403-ad7",...}'
```

### 2단계: GCP OAuth2 JWT 인증 및 Vertex AI 모듈 구축 ([`src/lib/server/vertex-ai-gemini.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/vertex-ai-gemini.ts))
- `googleapis` 패키지의 `google.auth.JWT`를 통해 GCP Access Token을 발급받아 REST API로 통신합니다.
- **인증 Scope**:
  - `https://www.googleapis.com/auth/generative-language`
  - `https://www.googleapis.com/auth/cloud-platform`
- **1순위 모델**: `gemini-2.5-flash` 지정 (실패 시 `gemini-2.5-pro`, `gemini-1.5-flash` 순차 체인 우회).
- **실시간 KST 날짜 주입 & 구글 검색 그라운딩**:
  ```ts
  if (useSearch) {
    payload.tools = [{ googleSearch: {} }];
  }
  ```

> **🚨 2차 시행착오 및 트러블슈팅 핵심 (구글 API 규격 충돌 해결)**:  
> 구글 제미나이 REST API 규격상, `tools: [{ googleSearch: {} }]` (실시간 검색 그라운딩)을 켤 때는 `generationConfig` 내에 `responseMimeType: "application/json"`을 함께 보내면 구글 API가 `Tool use with a response mime type: 'application/json' is unsupported` (HTTP 400/503) 에러를 반환합니다.  
> ➔ `useSearch: true`일 때는 `responseMimeType` 지정을 자동 제외되도록 `vertex-ai-gemini.ts`를 수선하여 호환성 문제를 100% 해결했습니다.
> ```ts
> generationConfig: {
>   temperature,
>   ...(responseMimeType && !useSearch ? { responseMimeType } : {}),
> }
> ```

### 3단계: 백엔드 API 라우트 이중 우회 구축 ([`src/app/api/ai/generate/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/generate/route.ts))
1. **1차 (Primary)**: GCP Vertex AI (`gemini-2.5-flash`) $300 크레딧 엔진 1순위 호출.
2. **2차 (Secondary)**: Vertex AI 장애 시 DB Vault 키 풀 3개 순차 자동 우회 로테이션.
3. **3차 (Tertiary)**: `.env.local` 시스템 키 우회.
4. **비로그인/개발 환경 수선**: 비로그인 게스트 유저도 IP 기반 일일 한도(개발 환경 1,000회) 내에서 막힘없이 실시간 원고 생성을 경험하도록 인증 구조 개선.

### 4단계: 프론트엔드 하이드레이션 에러 방지 ([`src/components/layout/Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))
- Next.js SSR vs Hydration 시점의 `window.location.search` 불일치로 발생하던 React Hydration Warning을 `isMounted` 가드로 보완.

---

## 4. 🧪 검증 및 테스트 결과

1. **터미널 실시간 검증 (`npx tsx`)**:
   - `gemini-2.5-flash` 및 `useSearch: true` (오늘 기준 SK하이닉스 주가 및 뉴스 그라운딩) 호출 시 **HTTP 200 OK** 정상 응답 확인.
2. **전체 타입 검사 (`npx tsc --noEmit`)**:
   - **0 ERRORS** 무결점 통과.
3. **웹사이트 실시간 원고 생성 테스트 (`/studio/writing/creaibox/list/[id]?newPost=true`)**:
   - [AI 콘텐츠 생성 시작] 클릭 시 $300 크레딧으로 3초 만에 제목/본문/SEO태그/메타설명이 100% 자동 완성됨을 최종 확인.

---

## 5. 요약 Checklist

- [x] GCP 프로젝트 생성 및 $300 무료 크레딧 빌링 연동
- [x] Vertex AI API 및 Agent Platform API 활성화
- [x] 서비스 계정 생성 및 서비스 계정 이메일 복사
- [x] IAM 권한 페이지에서 서비스 계정에 `편집자 (Editor)` 역할 부여
- [x] 백엔드 `vertex-ai-gemini.ts` 모듈 구축 (`gemini-2.5-flash` 최우선)
- [x] `useSearch`와 `responseMimeType` 충돌 방지 처리
- [x] DB Vault 2차 우회 라우팅 안전망 원복
- [x] 타입 검사 0 ERRORS 및 웹에디터 200 OK 가동 확인
