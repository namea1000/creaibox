
# Reserved Brand IDs 운영 인계 문서

이 문서는 CreAibox 브랜드 ID(`{brand_id}.creaibox.com`) 예약어/블랙리스트 시스템의
현재 아키텍처, 성능 최적화 내역, AI 스캔 및 자동 검증 모듈, 운영 지침을 종합 정리한다.

---

## ✅ 현재 상태 (2026-08-04 최신 업데이트)

| 항목              | 내용                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| 원천 JSON 파일    | `src/lib/constants/reservedBrandsData.json` (77,985개, 22개 카테고리)   |
| DB 실제 rows      | **~59,000개** (정적 6개 카테고리 13,396개 삭제 반영)                |
| 서버 코드 상수    | `src/lib/constants/reservedBrandsStatic.ts` (13,396개, Set 6개)         |
| 브랜드 체크 API   | `src/app/api/brands/check/route.ts` (하이브리드 빠른 체크)              |
| 관리자 API        | `src/app/api/admin/brands/route.ts` (페이지네이션 지원)                 |
| 관리자 정적 API   | `src/app/api/admin/brands/static/route.ts` (코드상수 반환)              |
| AI 자동 탐지 API  | `src/app/api/admin/brands/scan/route.ts` (LLaMA 3.3 70B 기반 대량 탐지) |
| AI 정밀 검증 API  | `src/app/api/admin/brands/verify/route.ts` (서브도메인 신청 2차 심사)   |
| `brand_id` 규격 | `^[a-z0-9]{2,15}$`                                                      |

---

## 🏗️ 전체 시스템 아키텍처

```
[사용자/시스템 brand_id 신청 & 검증 흐름]

                  ┌───────────────────────────────────────────────┐
                  │ GET /api/brands/check?brand_id=xxx           │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────▼───────────────────────┐
                  │ 1단계: 정적 상수 (reservedBrandsStatic.ts)     │
                  │ (SYSTEM, ABUSE, ADULT 등 13,396개 메모리 Set) │
                  └───────────────────────┬───────────────────────┘
                                          │ (Hit 시 즉시 차단, DB 0회)
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │ 2단계: Supabase DB (reserved_brand_ids)        │
                  │ (~59,000개 동적 카테고리 단건 인덱스 조회)     │
                  └───────────────────────┬───────────────────────┘
                                          │ (Hit 시 차단)
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │ 3단계: profiles 테이블 brand_id 중복 검사     │
                  └───────────────────────────────────────────────┘
```

---

## ⚡ 주요 개편 및 최적화 내역 (2026-08-04)

### 1. DB Egress 99% 절감 & 하이브리드 검증

- **문제점**: 기존 관리자 페이지 및 검증 시 `select("*")`로 72,400개 rows 전체를 로드하여 Supabase Egress 소모 발생.
- **해결**:
  - 변경 가능성이 거의 없는 6개 정적 카테고리(13,396개)를 서버 코드 상수(`reservedBrandsStatic.ts`)로 분리 후 DB에서 삭제.
  - 관리자 API에 `range()` 페이지네이션(`?page=0&limit=50`) 적용.

### 2. AI 기반 트렌드 & 신규 브랜드 자동 스캔 모듈 (LLaMA 3.3 70B)

- **위치**: 관리자 예약어 페이지 (`/admin/reserved-words`) 상단 `[ 🤖 AI Trend Scan ]` 버튼
- **기능**:
  - 16개 모든 동적 카테고리(AI 서비스, 핀테크, 상표, 크리에이터, 스타트업, 가상자산 등) 대상.
  - **1회 스캔 시 100개 대량 탐지** (max_tokens: 8000).
  - 삼중 자동 필터링: (1) 정규식 규격, (2) 코드상수 자동제외, (3) DB 기존키워드 자동제외.
  - 결과 중복 방지 (`seenLocal` Set 적용) 및 DB 저장 시 `upsert(..., { ignoreDuplicates: true })`로 유니크 충돌 완전 방어.

### 3. 관리자 테이블 UI 강화: Target Entity (대상 기관/브랜드) 뱃지

- **위치**: 관리자 예약어 페이지 (`/admin/reserved-words`) 테이블
- **기능**:
  - `BRAND ID` 바로 오른쪽에 `Target Entity (대상 기관/브랜드)` 컬럼 추가.
  - `parseReasonEntity` 헬퍼를 통해 `[한국전력공사]`, `[아프가니스탄]` 등 대괄호 서식 및 문맥 파싱, 영문 힌트 매핑으로 한글 기관/상표명을 에메랄드 뱃지(`🏢 한국전력공사`)로 직관적 표시.

### 4. 브랜드 ID 심사 2차 안전 검증 시스템 (AI & Web Audit)

- **위치**: 브랜드 ID 및 도메인 관리 (`/admin/brands`) 심사 목록
- **기능**:
  - 심사 행의 브랜드 ID 옆에 `[ ✨ AI 검증 ]` 버튼 연동.
  - LLaMA 3.3 70B 모델이 해당 `brand_id`의 상표권 침해, 공공기관 사칭, 피싱/유해성을 정밀 분석.
  - **결과 모달**:
    - 위험도 뱃지 (`🟢 SAFE`, `🟡 WARNING`, `🔴 DANGER`) 및 위험점수(0~100) 표시.
    - 매칭 상표/기관명 & AI 종합 심사의견 리포트 제공.
    - **1초 딥링크**: `[ 🌐 Google 검색확인 ]`, `[ 🟢 Naver 검색확인 ]` 버튼으로 실시간 포털 검색 2차 직접 확인.
    - **액션**: `[ 🟢 승인 (APPROVED) ]` 또는 `[ 🔴 거절 & 예약어 DB 등록 ]` 원클릭 일괄 연동.

---

## 📁 카테고리 체계

### 🟢 정적 카테고리 (서버 메모리 Set - DB 삭제 완료)

| Category              |             건수 | 설명                              |
| --------------------- | ---------------: | --------------------------------- |
| `SYSTEM`            |              946 | 시스템 라우팅 및 운영 필수 예약어 |
| `ABUSE`             |            1,875 | 욕설/혐오/악성 행위 키워드        |
| `ADULT_GAMBLING`    |            2,606 | 성인/도박/사행성 서비스           |
| `RELIGION_POLITICS` |            1,262 | 종교/정당/선거/정치인 사칭 방지   |
| `MILITARY_SECURITY` |            1,394 | 군사/안보/정보기관 사칭 방지      |
| `GEOGRAPHY`         |            5,313 | 도시/국가/관광지/지역명 선점 방지 |
| **소계**        | **13,396** |                                   |

### 🔴 동적 카테고리 (Supabase DB `reserved_brand_ids` - ~59,000개)

| Category               | 설명                                             |
| ---------------------- | ------------------------------------------------ |
| `GOVERNMENT`         | 국가/공공기관/지자체 사칭 방지                   |
| `MEDIA`              | 언론사/방송사 사칭 방지                          |
| `FINANCE`            | 금융기관/증권/결제 피싱 방지                     |
| `COMPANY`            | 주요 기업/브랜드 사칭 방지                       |
| `IT_SERVICE`         | 글로벌 IT 서비스/플랫폼 사칭 방지                |
| `INFLUENCER`         | 크리에이터/셀럽/버튜버/K-pop 사칭 방지           |
| `EDUCATION`          | 대학/교육기관/에듀테크 사칭 방지                 |
| `COMMON_SERVICE`     | 공용 상업 키워드 및 프리미엄 일반어              |
| `TRADEMARK`          | 제품명/상표명 보호                               |
| `PAYMENT_SECURITY`   | 결제/환불/인증/보안 피싱 방지                    |
| `CRYPTO`             | 가상자산/거래소/지갑/토큰 사칭 방지              |
| `HEALTHCARE`         | 의료/병원/약국/의약품 사칭 방지                  |
| `INFRASTRUCTURE`     | DNS, CDN, SSL, API 등 인프라 예약어              |
| `DOMAIN_BRAND`       | 도메인/호스팅/인증서 사업자 사칭 방지            |
| `PUBLIC_SERVICE`     | 복지/여권/비자/민원 등 공공서비스 사칭 방지      |
| `HIGH_RISK_COMMERCE` | 상품권/리셀/명품/투자 등 고위험 상거래 사기 방지 |

---

## 🛠️ 개발 관련 주요 파일

- `src/lib/constants/reservedBrandsStatic.ts`: 정적 6개 카테고리 Set (211KB, 서버 전용)
- `src/app/api/brands/check/route.ts`: 사용자/시스템 공용 브랜드 체크 API
- `src/app/api/admin/brands/route.ts`: 관리자 목록/추가/삭제/배정 API (페이지네이션)
- `src/app/api/admin/brands/static/route.ts`: 정적 카테고리 조회 전용 API
- `src/app/api/admin/brands/scan/route.ts`: LLaMA 3.3 70B AI 신규 트렌드 100개 대량 스캔 API
- `src/app/api/admin/brands/verify/route.ts`: LLaMA 3.3 70B 서브도메인 신청 2차 안전 검증 API
- `src/app/admin/reserved-words/page.tsx`: 예약어 블랙리스트 관리 페이지 (AI 스캔 모달, Target Entity 뱃지)
- `src/app/admin/brands/page.tsx`: 브랜드 ID 및 도메인 심사 페이지 (AI 검증 버튼, 구글/네이버 서치 모달)
