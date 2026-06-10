# 관리자 웹 페이지 명세 (Admin Pages)

`CreAibox` 어드민 백오피스 대시보드 화면(라우팅 및 구성 컴포넌트) 정의서입니다. 모든 어드민 페이지는 `isAdminEmail` 검증 가드가 서버 단에서 적용됩니다.

---

## 1. 어드민 요약 및 사용자 통제

### 1-1. 어드민 대시보드 홈 (`/admin` -> `app/admin/page.tsx`)
* **설명**: 전반적인 서버 상태, API 호출 큐 상태, 최근 가입 동향 지표 등을 요약 노출하는 랜딩 패널.

### 1-2. 사용자 관리 (`/admin/usermanagement` -> `app/admin/usermanagement/page.tsx`)
* **설명**: 가입된 유저 리스트 조회, 계정 차단/활성화 상태 제어, 역할 변경 (FREE -> PAID -> ADMIN).
* **DB 연동**: `profiles` 테이블을 `supabaseAdmin` 권한으로 업데이트하며, `ai_generation_usage_logs`와 조인하여 유저별 일일/누적 API 호출 횟수를 계산하여 노출합니다.

---

## 2. 보안 API 금고 및 시스템 통계

### 2-1. API 금고 관리 (`/admin/apivault` -> `app/admin/apivault/page.tsx`)
* **설명**: 공용 API 토큰(Gemini, Groq, OpenAI, Claude, Search 등) 추가/수정/삭제.
* **보안 기능**: 입력된 API Key는 복제 방지용 AES-256-GCM 암호화를 수행하여 데이터베이스에 주입하고, 리스트 화면에서는 `••••••••` 마스킹 기호로 치환하여 유출을 물리적으로 방지합니다.

### 2-2. 상세 대시보드 통계 (`/admin/analytics` -> `app/admin/analytics/page.tsx`)
* **설명**: 방문객 카운트, 실시간 접속자, 가입 대비 전환율 추이 모니터링.
* **주요 그래프**: 유입 검색 채널 비율 파이차트, 브라우저/장치별 분포, 시간대별 방문 그래프 제공.

---

## 3. 외부 연동 및 SEO 관리

### 3-1. 구글 연동 관리 (`/admin/google` -> `app/admin/google/page.tsx`)
* **설명**: Google Search Console 및 Google Analytics 4 연결 상태 조회, API 서비스 연동 상태 확인.

### 3-2. 유튜브 및 검색 엔진 설정 (`/admin/youtube` & `/admin/seo`)
* **설명**:
  - `youtube/page.tsx`: YouTube Data API v3 쿼터 및 연동 테스트.
  - `seo/page.tsx`: 크롤러 수집 메타 정보 및 대표 키워드 조정 기능.
