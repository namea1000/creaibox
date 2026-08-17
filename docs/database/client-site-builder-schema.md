# AI 홈페이지 빌더 & CMS 데이터베이스 설계서

> **문서 분류**: 데이터베이스 스키마 명세서 (Database Schema Spec)
> **연관 아키텍처 명세서**: `docs/arch/03_client-site-builder/client-site-builder.md`
> **연관 실무 매뉴얼**: `docs/project/manual/03_client-site-builder/custom-client-site-guide.md`
> **연관 실행 SQL**: `docs/database/sql/client-site-builder.sql`

---

본 문서는 CreaiBox AI 홈페이지 빌더 및 기업 전용 CMS 서비스를 위한 데이터베이스 테이블 구조와 RLS(Row Level Security) 정책을 상세히 설명합니다.

---

## 1. 개요
*   **목적**: 사용자가 AI를 통해 생성하거나 CMS 관리자 대시보드에서 수정한 홈페이지 데이터(기본 메타, 섹션 콘텐츠, 게시판 및 문의글)를 안정적으로 저장하고 대중에게 안전하게 노출하는 데 필요한 스키마를 구성합니다.
*   **위치**:
    *   설명 문서: `docs/database/client-site-builder-schema.md`
    *   실행 SQL: `docs/database/sql/client-site-builder.sql`

---

## 2. 테이블 정의

### 2-1. `client_sites` (기업 홈페이지 마스터)
각 브랜드의 홈페이지 기본 정보와 도메인, 템플릿 메타데이터를 저장합니다.

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PRIMARY KEY, Default gen_random_uuid() | 사이트 고유 키 |
| `profile_id` | uuid | REFERENCES profiles(id) ON DELETE CASCADE | 소유자 프로필 ID (회원 계정) |
| `brand_id` | text | UNIQUE, NOT NULL | 서브도메인 브랜드명 (예: `sotongcheum`) |
| `custom_domain` | text | UNIQUE | 외부 연동 개인 독립 도메인 (예: `sotongcheum.com`) |
| `template_id` | text | NOT NULL, Default 'service_1' | 적용한 템플릿 코드 (`service_1`, `food_1` 등) |
| `company_name` | text | NOT NULL | 회사/기관 공식 한글명 |
| `phone` | text | | 대표 연락처 |
| `address` | text | | 주소 |
| `status` | text | Default 'DRAFT' | 사이트 운영 상태 (`DRAFT` 초안/비공개, `PUBLISHED` 정식라이브, `ACTIVE`, `INACTIVE`) |
| `creation_source` | text | CHECK (creation_source IN ('migration', 'sns_builder', 'template')) | 사이트 생성 출처 (이관, SNS, 템플릿) |
| `theme_vibe` | text | | **[신규]** 사용자가 선택한 디자인 무드/분위기 (예: `modern_clean`, `warm_auto`) |
| `is_onepage_scroll` | boolean | Default false | 메인 랜딩페이지에 서브페이지 전체 전개 여부 (One-page scroll 모드) |
| `extra_configs` | jsonb | Default '{}' | SNS 링크, 사업자번호, GA4 측정 ID 등 유연한 설정값. **(백그라운드 무인 이관 큐 용도 추가: `migration_queue`: 서브페이지 URL 배열, `migration_status`: "pending" \| "migrating" \| "completed")** |
| `scan_report` | jsonb | Default '{}' | **[신규]** 타겟 사이트 정밀 스캔 결과 (페이지 수, 글자 수, 이미지 수, 예상 시간, 톤앤매너 등 보존) |
| `created_at` | timestamp | Default now() | 생성 일시 |

### 2-2. `site_sections` (메인 페이지 동적 섹션 콘텐츠)
메인 화면을 구성하는 모듈형 섹션들의 텍스트와 카드 정보(JSON)를 담습니다.

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PRIMARY KEY, Default gen_random_uuid() | 섹션 고유 키 |
| `site_id` | uuid | REFERENCES client_sites(id) ON DELETE CASCADE | 소속 홈페이지 ID |
| `section_type` | text | NOT NULL | 섹션 종류 (`hero`, `services`, `rental`, `portfolio`, `contact`) |
| `sort_order` | integer | Default 0 | 렌더링 정렬 순서 |
| `title` | text | | 섹션 큰 제목 |
| `subtitle` | text | | 섹션 작은 제목/설명 |
| `content_data` | jsonb | Default '{}' | 섹션 하위 요소(카드 썸네일 URL, 불릿 리스트, 뱃지 등) 정보 |
| `status` | text | Default 'ACTIVE' | **[신규]** 섹션 상태 (`ACTIVE`, `DELETED` 등 Soft Delete 용도) |

### 2-3. `site_posts` (홈페이지 게시판 및 문의 내역)
공지사항, 자료실 게시글, 그리고 고객들이 작성한 온라인 상담/견적문의 내역을 통합 저장합니다.

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PRIMARY KEY, Default gen_random_uuid() | 게시글 고유 키 |
| `site_id` | uuid | REFERENCES client_sites(id) ON DELETE CASCADE | 소속 홈페이지 ID |
| `post_type` | text | NOT NULL | 게시글 구분 (`notice` 공지, `board` 일반게시글, `inquiry` 문의글) |
| `title` | text | NOT NULL | 제목 |
| `content` | text | NOT NULL | 본문 또는 상세 문의 내용 |
| `author_name` | text | | 작성자 이름/닉네임 |
| `is_pinned` | boolean | Default false | 상단 고정 여부 (공지용) |
| `views` | integer | Default 0 | 조회수 |
| `extra_data` | jsonb | Default '{}' | 문의유형, 자녀학년, 예산, 희망일 등 유연한 포맷 데이터 |
| `created_at` | timestamp | Default now() | 작성 일시 |
| `updated_at` | timestamp | Default now() | 수정 일시 |

### 2-4. `ai_generation_logs` (데이터 해자 구축용 AI 생성 원본 로그)
사용자가 AI에게 요청한 프롬프트 원본과 AI가 생성한 결과물을 영구 보존하여 추후 AI 재학습(Fine-tuning) 및 사용자 패턴 분석에 사용합니다.

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | uuid | PRIMARY KEY, Default gen_random_uuid() | 로그 고유 키 |
| `site_id` | uuid | REFERENCES client_sites(id) ON DELETE CASCADE | 어떤 사이트에 대한 생성 기록인지 |
| `profile_id` | uuid | REFERENCES profiles(id) ON DELETE SET NULL | 생성을 요청한 유저 |
| `user_prompt` | text | NOT NULL | 사용자가 입력한 검색어/기획안/키워드 원본 |
| `ai_response` | jsonb | NOT NULL | AI가 응답한 JSON 결과물 전체 데이터 |
| `created_at` | timestamp | Default now() | 생성 일시 |

---

## 3. RLS (Row Level Security) 정책 정의

보안 위협과 무단 수정을 원천 차단하기 위해 모든 테이블에 RLS를 활성화하고 다음 규칙을 정의합니다.

### 3-1. `client_sites` RLS 정책
*   **공개 조회(SELECT)**: `status = 'ACTIVE'` 인 사이트는 비인증 대중(anon)도 자유롭게 조회할 수 있습니다. (`DELETED` 또는 `INACTIVE`는 불가)
*   **소유자 제어(ALL)**: `profile_id`가 현재 로그인한 유저의 UUID와 일치하는 경우에만 INSERT, UPDATE, DELETE가 허용됩니다. (실제 운영 시에는 프론트엔드에서 DELETE 대신 `UPDATE status = 'DELETED'` 처리)

### 3-2. `site_sections` RLS 정책
*   **공개 조회(SELECT)**: 비인증 대중(anon)도 조회가 가능하지만, `status = 'ACTIVE'`인 데이터만 불러와야 합니다.
*   **소유자 제어(ALL)**: 상위 `client_sites` 테이블의 소유자(`profile_id`)가 현재 로그인한 유저인 경우에만 추가/수정/삭제가 허용됩니다. (실제 운영 시에는 Soft Delete 권장)

### 3-3. `site_posts` RLS 정책
*   **공개 조회(SELECT)**: `post_type`이 `notice`(공지) 또는 `board`(일반)인 글은 대중 조회가 가능하지만, `inquiry`(상담 문의) 글은 대중 조회가 차단됩니다.
*   **문의 작성(INSERT)**: 비인증 대중(anon)도 홈페이지 문의 폼을 통해 `post_type = 'inquiry'` 글을 등록(INSERT)할 수 있어야 합니다.
*   **소유자 제어(ALL)**: 상위 `client_sites` 소유자(`profile_id`)는 모든 포스트(공지, 일반, 문의글 전체)를 읽고, 쓰고, 지울 수 있습니다.
