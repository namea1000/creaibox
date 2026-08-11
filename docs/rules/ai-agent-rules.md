# ==================================================

# MANDATORY DAILY DEVLOG & MONTHLY FILE CREATION RULE (매일 개발일지 기록 & 월별 자동 문서 생성 필수 규칙)

# ==================================================

CRITICAL DIRECTIVE FOR ALL AI AGENTS WORKING ON CREAIBOX:
Every AI Agent MUST maintain project history logs without exception.
A coding task IS NOT COMPLETE until the project devlog and walkthrough documents are updated.

### 1. Mandatory Daily Log & Architecture Update Rule (매일 개발 일지 및 관련 문서 3종 동시 업데이트 의무화)
Whenever any feature, refactoring, bug fix, or UI edit is performed:
- **Devlog**: Update `docs/project/<YYYY><MonthName>Devlog.md` (e.g. `docs/project/2026AugustDevlog.md`) with date, feature summary, detailed changes, modified file links, and `npx tsc --noEmit` build verification status.
- **Walkthrough**: Update `docs/project/<YYYY><MonthName>Walkthrough.md` (e.g. `docs/project/2026AugustWalkthrough.md`) with section-by-section completion walkthroughs.
- **Feature Specific Document (Architecture/Manual)**: Find the specific architecture document (`docs/arch/*.md`) or manual document (`docs/project/manual/*.md`) related to the modified feature, and update it immediately to reflect the new code changes or feature additions.

### 2. Automatic Monthly File Creation (월별 문서 자동 생성 의무화)
When operating in a new calendar month (e.g., August 2026, September 2026...):
- Check if `docs/project/<YYYY><MonthName>Devlog.md` and `docs/project/<YYYY><MonthName>Walkthrough.md` exist for the current month.
- If they do NOT exist, the AI Agent MUST automatically create both new files with standard headers BEFORE completing the task.

### 3. No Exit Without Documentation Update (기록 누락 상태 완료 금지)
AI Agents MUST NOT declare success or finish a user request turn without verifying that:
1. `npx tsc --noEmit` build check passes with 0 errors.
2. `docs/project/<YYYY><MonthName>Devlog.md` has been updated for today's work.
3. `docs/project/<YYYY><MonthName>Walkthrough.md` has been updated for today's work.

### 4. Mandatory Infrastructure Branding Rule (인프라 브랜딩 명칭 의무 규칙)
- NEVER use third-party internal infrastructure names like "Google Drive" or "구글 드라이브" in any user-facing UI, documentation, marketing materials, or API response messages.
- ALWAYS use **"CreAibox 클라우드 DB"** (or **"creaibox.com 클라우드 DB / 원고 보관함"**).
- All future documentation, user manuals, marketing materials, and code prompts MUST adhere strictly to "CreAibox 클라우드 DB".

### 5. Strict Zero Fake Data Rule (가짜 데이터 생성 전면 금지 및 사유 명시 의무)
- **진짜 데이터가 아니면서 진짜인 척 사용자에게 조작/표현하는 행위를 100% 절대 금지한다.** (CreAibox 신뢰성 최우선 1대 규칙)
- 모든 개발, API 구축, 대시보드 및 서비스 기능 개발 시 **가짜(Mock/Dummy/Fake/Seed) 데이터를 임의로 합성하거나 진짜 데이터처럼 꾸며 사용자에게 노출하지 않는다.**
- 데이터가 존재하지 않거나 외부 API/DB 수집 가능 범위를 벗어난 경우:
  1. 가짜 데이터를 임의로 생성하거나 진짜처럼 포장하지 말고, **데이터가 없음**을 명확하고 솔직하게 UI에 표시한다.
  2. 왜 데이터가 없는지 **명확한 사유(예: "CreAibox DB 구축 이전 기간이거나 포털 API 제공 범위 외 데이터입니다")**를 사용자에게 투명하게 설명한다.

### 6. Mandatory Git Push Rule (개발자 직접 명령 전 깃 푸시 절대 금지)
- **개발자(사용자)가 명시적으로 "깃 푸시해", "git push 수행해"라고 직접 명령하기 전에는 AI 에이전트가 자율적으로 `git push`를 절대 수행하지 않는다.**
- 에이전트는 코드 수정, 로컬 테스트 및 빌드 검증(`npx tsc --noEmit`)까지만 진행하고, `git push` 작업은 개발자의 명시적 지시가 있을 때만 실행한다.

### 7. Mandatory Database Table Creation Prompt Rule (DB 테이블 생성 채팅 알림 의무 규칙)
- **신규 DB 테이블이 필요하거나 기존 테이블 생성 DDL이 미실행된 상태를 발견한 경우, AI 에이전트는 즉시 복사해서 Supabase SQL Editor에서 실행할 수 있는 완벽한 SQL 구문과 함께 개발자(사용자)에게 채팅창으로 테이블 생성을 명시적으로 요청해야 한다.**
- 에이전트는 테이블 DDL 파일(`docs/database/<table_name>.sql`)을 항상 프로젝트에 저장 관리하며, 사용자가 SQL을 실행하여 DB 테이블을 생성하도록 명확하게 안내한다.

### 8. Mandatory Background Automation Manual Sync Rule (백그라운드 무인 기능 매뉴얼 최신화 규칙)
- **향후 신규 무인 자동 수집(Cron), 백그라운드 배치 작업, 또는 자동화 기능이 개발/구동되면, AI 에이전트는 백그라운드 무인 자동화 매뉴얼(`docs/project/manual/background-automation-execution-5-methods-guide.md`)의 "4. 🟢 현재 즉시 구동 중 / 서비스 가능한 무인 기능 (Current Services)" 섹션에 신규 기능을 즉시 등록하고 최신화해야 한다.**

### 9. Mandatory Client Site Egress & Aspect Ratio Standard Rule (클라이언트 사이트 트래픽 감축 및 16:9 비율 영구 표준 규칙)
- **규칙 1 (카드 썸네일 16:9 비율 고정)**: 향후 신규 제작하는 모든 커스텀 클라이언트 사이트, 비즈니스 홈페이지, 브랜드 블로그의 카드 썸네일 프레임은 반드시 `aspect-[16/9]` (16:9 비율)만 사용하여 썸네일 텍스트 좌우 잘림을 100% 방지한다.
- **규칙 2 (Egress 트래픽 방어 - 목록 조회 시 본문 컬럼 제외)**: 블로그 목록, 카테고리 목록, 포트폴리오 목록 쿼리 작성 시 무거운 원고 본문 전체 HTML(`content`)이나 JSON 덤프(`published_snapshot`) 컬럼을 절대 `select()`에 포함하지 않고 경량 메타 필드만 수집한다.
### 10. Mandatory Vertex AI & Gemini Primary Engine Standard Rule (gemini-3.5-flash-lite 1순위 의무화 규칙)
- **모든 GCP Vertex AI 및 Gemini AI 연동 백엔드 모듈, API 라우트, AI 스캐너 및 배치 스크립트에서 최우선 1순위 기본 구동 엔진은 무조건 `gemini-3.5-flash-lite` 모델로 1순위 배치해야 한다.**
- `gemini-3.5-flash-lite`는 극상의 초고속 응답 속도와 최저 토큰 비용(Ultra-low cost)을 자랑하므로 대용량 배치 처리, 트렌드 스캔, 키워드 사유 생성, 자동 검증 엔진의 1순위 표준 모델로 사용한다. (fallback 시에만 `gemini-2.5-flash` 활용)

### 11. Mandatory SmartIntentLink 0.01s Instant Navigation Rule (스마트 링커 0.01초 가속 개발 의무 규칙)
- **향후 신규로 제작되는 모든 사용자 블로그, 비즈니스 홈페이지, 커스텀 웹사이트 템플릿, 카드 목록 및 아티클 링커에는 맹목적 `Link` 또는 `<a href>` 대신 무조건 `SmartIntentLink` (`@/components/common/SmartIntentLink`) 컴포넌트를 사용해야 한다.**
- 0.15초 체류 의도 감지를 통해 Vercel 비용 0원을 철통 방어함과 동시에 클릭 즉시 0.01초 만에 본문이 열리는 네이버 뉴스급 수소폭탄 가속 서빙을 표준으로 100% 영구 적용한다.

### 12. Mandatory Document Role Separation Rule (아키텍처 문서 및 실무 매뉴얼 역할 엄격 분리 규칙)
- **아키텍처 기술 명세서 (`docs/arch/`)와 서비스 실무 매뉴얼 (`docs/project/manual/`)을 절대 동일한 내용으로 중복 작성하지 않고 역할과 목적을 100% 명확히 분리하여 작성해야 한다.**
- **아키텍처 문서 (`docs/arch/`)**: 시스템 설계자/개발자 관점의 Mermaid 다이어그램, 시퀀스/데이터 파이프라인, 내부 알고리즘, 응답 헤더 스펙 등 **심도 깊은 기술 명세서**로 작성한다.
- **실무 매뉴얼 (`docs/project/manual/`)**: 기획자/실무 개발자 관점의 HOW-TO 실전 가이드, 바로 복사 가능한 추천 코드 예시, 금지 패턴(Anti-Patterns), FAQ 등 **실전 운용 가이드**로 차별화 작성한다.

### 13. Mandatory Strict Separation of Question vs Command Rule (질문 문의와 개발 지시 엄격 분리 및 자의적 선조치 절대 금지 규칙)
- **개발자(사용자)의 대화 중 단순 질문/의문/문의("~해도 되나?", "~인가요?", "~는 어떻게 하나?", "~이 맞나?")와 명시적 개발 지시("~해라", "~수정해줘", "~추가해", "~적용해")를 100% 엄격하게 구분한다.**
- **개발자가 단순 질의나 문의를 할 때 AI 에이전트는 오직 분석, 설명 및 명쾌한 답변만 제공하며, 사용자의 명시적 실행 지시 없이 소스 코드를 임의로 수정/삭제/추가하는 자의적 선조치 행동을 100% 절대 금지한다.**
- **모든 소스 코드 수정, 파일 생성/삭제 등 실제 코드 변경 작업은 오직 개발자의 명시적 실행 지시("적용해", "수정해", "코드 반영해")가 확정되었을 때만 수행한다.**

### 14. Mandatory Secret Key Masking Rule in Documentation (문서 내 실제 보안키 및 시크릿 노출 100% 절대 금지 규칙)
- **공용 문서(`.md`), 아키텍처 명세서, 가이드 및 매뉴얼 파일 작성 시 실제 운영/테스트용 보안키(API Secret, Service Account Private Key, OAuth Secret 등)를 절대로 원문 그대로 노출해 작성하지 않는다.**
- **모든 문서 내 환경변수 예시 코드에는 반드시 마스킹 문자열(예: `your_api_secret_here`, `sec_xxxx`, `your_private_key_here`)만 사용해야 한다.**
- 실제 시크릿 키는 Git에 포함되지 않는 `.env.local` 파일 및 Vercel/서버 환경변수 설정(Environment Variables)에서만 관리하여 Git 유출 및 Vercel 보안 스캐너 감지를 철저히 방지한다.

# ==================================================

# Documentation Rules

# ==================================================

Documentation is mandatory for all major features.

The following documentation structure must be maintained.

For every major module:

Required files:

docs/arch/<module>.md
docs/arch/<module>-design-spec.md

Example:

docs/arch/writing-studio.md
docs/arch/writing-studio-design-spec.md

docs/arch/research-studio.md
docs/arch/research-studio-design-spec.md

docs/arch/music-studio.md
docs/arch/music-studio-design-spec.md

docs/arch/ai-assistant.md
docs/arch/ai-assistant-design-spec.md

# --------------------------------------------------

# Custom Client Website Template Rules

# --------------------------------------------------

Custom Client Site Template Rules:
- @docs/rules/custom-client-site-template-rules.md (Must follow 5-7 mandatory GNB menus & 5-7 embedded features)

# --------------------------------------------------

# Operational Manual Rules (서비스 구축 및 매뉴얼 작성 규칙)

# --------------------------------------------------

모든 서비스 구축, 외부 연동, 도메인/OAuth/API 설정 등 "~ 하는 방법" 관련 가이드 및 매뉴얼 문서는:
- `@docs/project/manual/` 디렉토리에 매뉴얼 파일명(`.md`)으로 작성하고 보관해야 합니다.
- 향후 신규 서비스 및 인프라 구축 작업 진행 시, 설정/연동 프로세스를 Step-by-Step 매뉴얼 규격으로 해당 폴더에 반드시 기록해야 합니다.

# --------------------------------------------------

# Operational Documentation

# --------------------------------------------------

Purpose:

* Quick understanding
* Developer onboarding
* Fast AI Agent context loading

Recommended length:

50 ~ 200 lines

Contents:

1. Purpose
2. Main Features
3. UI Structure
4. Database Structure
5. API Structure
6. Component Structure
7. Future Expansion

This document should describe the CURRENT STATE only.

# --------------------------------------------------

# Design Specification Documentation

# --------------------------------------------------

Purpose:

* Preserve architecture decisions
* Preserve design intent
* Preserve future roadmap
* Preserve implementation rationale

No length limit.

Contents:

1. Architecture decisions
2. Database design rationale
3. API design rationale
4. UI/UX decisions
5. Business rules
6. Scaling strategy
7. Future roadmap
8. Technical considerations

This document may be large and detailed.

Long design documents are acceptable if they improve
future maintenance and AI Agent understanding.

# --------------------------------------------------

# Documentation Update Rules

# --------------------------------------------------

Feature implementation is NOT complete until
documentation is updated.

When a feature is added:

1. Update operational documentation
2. Update design specification documentation
3. Update database documentation if required
4. Update API documentation if required

When architecture changes:

1. Update all affected documentation
2. Do not leave outdated architecture documents
3. Re-write documents to reflect the current implementation

# --------------------------------------------------

# AI Agent Documentation Responsibilities

# --------------------------------------------------

When completing a major task:

Before considering the task complete:

* Verify documentation exists
* Verify documentation matches implementation
* Update documentation if needed
* Report documentation updates performed

AI Agents must not finish implementation work
without reviewing documentation impact.

# --------------------------------------------------

# Documentation Source of Truth

# --------------------------------------------------

Code and documentation must remain synchronized.

If implementation differs from documentation:

1. Report the difference.
2. Determine which is authoritative.
3. Update documentation when implementation was intentionally changed.

Never silently ignore documentation drift.

# --------------------------------------------------

# CreAibox Project Rule

# --------------------------------------------------

All major Studio modules must maintain:

1. Operational Documentation
2. Design Specification Documentation

Examples:

* Writing Studio
* Research Studio
* Music Studio
* Image Studio
* AI Assistant
* Reporter
* Tools
* Future Studios

This rule applies to all future CreAibox development.

# ==================================================

# Module Documentation Standard

# ==================================================

Every major module must maintain:

1. Architecture Document
2. Design Specification Document
3. Database Schema Document
4. Executable SQL Document
5. Page Specification Document
6. API Documentation

Examples:

docs/arch/ai-assistant.md
docs/arch/ai-assistant-design-spec.md

docs/database/ai-assistant-schema.md
docs/database/sql/ai-assistant.sql

docs/pages/studio/ai-assistant.md

docs/api/ai-assistant.md

# --------------------------------------------------

# Database Documentation Rules

# --------------------------------------------------

All database work must maintain BOTH:

1. Database Description Document
2. Executable SQL Document

Database implementation is not complete until both exist.

---

## Database Description Document

Location:

docs/database/

Examples:

docs/database/ai-assistant-schema.md
docs/database/research-schema.md
docs/database/writing-schema.md

Purpose:

* Human readable documentation
* Architecture understanding
* AI Agent context
* Maintenance reference

Recommended contents:

1. Purpose
2. Tables
3. Relationships
4. Main Fields
5. Business Rules
6. Indexes
7. Future Expansion

---

## Database SQL Document

Location:

docs/database/sql/

Examples:

docs/database/sql/ai-assistant.sql
docs/database/sql/research.sql
docs/database/sql/writing.sql

Purpose:

* Supabase SQL Editor execution
* Database recreation
* Migration reference
* Disaster recovery

Must contain:

* CREATE TABLE
* INDEX
* RLS
* POLICIES
* FUNCTIONS
* TRIGGERS

when applicable.

Executable SQL documents must be directly executable
inside Supabase SQL Editor without modification.

Do not mix documentation text with executable SQL.

SQL files should be copy-paste ready for immediate execution.

---

## Database Change Rules

When creating a new table:

Required updates:

1. Update schema documentation
2. Update executable SQL
3. Update related API documentation
4. Update architecture documentation if needed

---

When modifying a table:

Required updates:

1. Update schema documentation
2. Update executable SQL
3. Update related API documentation
4. Verify documentation matches implementation

---

## AI Agent Database Rules

AI Agents must NOT create or modify database structures without:

1. Reading existing database documentation
2. Checking existing SQL definitions
3. Updating schema documentation
4. Updating executable SQL documentation

Database changes are not complete until documentation and SQL files are updated.

---

## CreAibox Standard

Every major module must maintain:

1. Architecture Document
2. Design Specification Document
3. Database Schema Document
4. Executable SQL Document
5. Page Specification Document
6. API Documentation

Example:

AI Assistant

docs/arch/ai-assistant.md
docs/arch/ai-assistant-design-spec.md

docs/database/ai-assistant-schema.md
docs/database/sql/ai-assistant.sql

docs/pages/studio/ai-assistant.md

docs/api/ai-assistant.md

Research Studio

docs/arch/research-studio.md
docs/arch/research-studio-design-spec.md

docs/database/research-schema.md
docs/database/sql/research.sql

docs/pages/studio/research.md

docs/api/research.md



# Feature File Structure Rule

Before creating a new major menu, studio, tool, service, or feature, design the file structure first.

Do NOT start implementation immediately.

---

## Required Structure

For large features:

feature/
│
├─ page.tsx
├─ components/
└─ lib/

page.tsx

→ Layout composition only

components/

→ UI components only

lib/

→ Business logic, types, data, utilities

---

## Recommended Library Structure

types.ts

→ All TypeScript types

options.ts

→ Select options and constants

supabase.ts

→ Database queries

scoring.ts

→ Calculations and scoring logic

utils.ts

→ Helper functions

index.ts

→ Exports

Add feature-specific files when needed.

Examples:

topic-categories.ts
topic-series.ts
content-formats.ts
prompt-templates.ts
seo-templates.ts

Use descriptive business names.

Avoid generic names such as:

* mock-data.ts
* sample-data.ts
* temp-data.ts
* dummy-data.ts

---

## Real Data First

For production features:

Use actual content whenever possible.

Do not create placeholder data if the real categories, templates, prompts, topics, or business content are already known.

Bad:

mock-data.ts

Good:

topic-categories.ts

Good:

content-formats.ts

Good:

prompt-templates.ts

---

## Page Responsibility

page.tsx should remain lightweight.

Allowed:

* Layout composition
* Component assembly
* Data orchestration
* Route handling

Avoid:

* Massive JSX blocks
* Business logic
* Large datasets
* Complex calculations

Move those into:

components/
lib/

---

## File Size Guideline

Avoid files larger than 500 lines whenever practical.

If a file grows too large:

Split by responsibility.

Example:

components/

IdeaHubHero.tsx
TopicGrid.tsx
TopicPanel.tsx
SeriesPanel.tsx

Instead of:

ContentIdeaHub.tsx (2000+ lines)

---

## Design Before Build

Before implementation:

1. Route structure
2. File structure
3. Component structure
4. Database structure (if needed)
5. Data structure
6. User flow

must be defined first.

Only then begin implementation.


---

## Before creating icons: 
Before creating icons:

Brand icons (Google, YouTube, Instagram, TikTok, Naver, OpenAI, Claude, Gemini, GitHub, Supabase, Vercel) must use react-icons/si.

General UI icons must use lucide-react.

---

## UI/UX 로딩 설계 및 레이아웃 안정화 규칙 (Layout Stabilization & Caching UX)

* **필독 규격**: 레이아웃 쉬프트 및 인증 세션 깜빡임(Flicker)을 방지하기 위해 다음 개별 가이드를 반드시 사전에 준수해야 합니다.
  → `@docs/rules/ui-layout-stabilization.md`

### 1. 전체 화면 로딩 가림막 금지 (No Full-Screen Spinner)
* `isLoading` 상태가 `true`일 때 페이지 전체(또는 레이아웃 껍데기까지 포함하여)를 가리고 로딩 스피너만 빙글빙글 도는 페이지 구조를 만들지 마십시오.
* 사이드바, 탑바 등 부모가 제공하는 껍데기 레이아웃(Layout Shell)은 페이지 진입 즉시 100% 노출되고 인터랙션할 수 있어야 합니다.

### 2. 초기 상태 우회 및 즉시 대시보드 렌더링 (Pre-Approved Placeholder State)
* 권한 상태(예: `brandStatus`, `membershipLevel` 등)의 조회 지연으로 인해 특정 가이드 뷰가 떴다가 본문으로 전환되는 깜빡임(Flicker)을 방지하기 위해, 최초 렌더링 시 기본 상태값을 통과값(예: `APPROVED`, `ACTIVE`)으로 설정하여 대시보드 구조를 즉시 노출하십시오.
* 데이터가 비동기로 로드(Resolve)된 후 실제 조회된 상태 및 데이터로 값들을 덮어쓰고(Overwritten) 필요한 가이드나 비활성 안내 카드로 자연스럽게 전환하십시오.

### 3. 스켈레톤 및 인라인 로딩 적용 (Skeleton & Inline Loading)
* 로딩 처리가 필요하다면 화면 전체를 막지 말고, 데이터가 로드 중인 개별 카드, 텍스트 인풋, 리스트 영역 등에만 국한하여 스켈레톤(Skeleton UI) 또는 컴팩트한 인라인 스피너를 적용하십시오.

### 4. 신규 목록 조회 시 React Query 캐싱 의무화 (TanStack Query Caching Rule)
* 앞으로 플랫폼 내에 신설되거나 수정되는 모든 백엔드 데이터 목록(예: 리포트 내역, 프로젝트 리스트, 이력 보관함 등) 조회 화면은 클라이언트 사이드 전환 지연을 없애기 위해 **React Query (`useQuery`) 캐싱 기법을 무조건 적용**해야 합니다.
* **Stale-While-Revalidate 방식**: 탭/메뉴 전환 시 로딩 스피너로 화면을 멈추는 대신 캐시된 기존 데이터를 즉시 0초 만에 화면에 보여주고, 백그라운드에서 신규 데이터를 호출하여 조용히 동기화하도록 만드십시오.
* 수정/삭제 등 기존 로컬 뮤테이션(Mutation) 로직들과의 충돌을 예방하기 위해, 쿼리 응답 데이터를 로컬 `useState`와 동기화(Sync Effect)하는 패턴을 적극적으로 적용하십시오.

---

## API 및 로컬 크리덴셜 사용 금지 규칙 (No User Credentials for Agent Tasks)

안티그레비티 AI 에이전트가 백그라운드 코딩, 번역, 텍스트 가공, 프롬프트 생성 등의 개발 작업을 수행할 때, 프로젝트 로컬에 저장된 사용자의 API 키(`.env.local`의 `GROQ_API_KEY`, `OPENAI_API_KEY` 등)를 호출하는 외부 AI 서비스 API 요청 행위를 원천 금지합니다.

### 1. 에이전트 자체 AI 엔진 사용 원칙
* 대량 번역, 프롬프트 일괄 작성, 설명 데이터 가공 등 지능형 데이터 처리가 필요한 모든 개발 프로세스는 사용자의 계정(크레딧/한도)을 소모하지 마십시오.
* 에이전트 자신(Gemini 모델 및 내장 플랫폼 도구)의 컨텍스트 연산 능력과 스크립트 기반의 지능형 규칙 엔진을 100% 활용하여 로컬에서 즉각 연산 및 적재를 완료해야 합니다.

### 2. 예외 사항
* **데이터베이스 마이그레이션(Supabase DB API), 구글 시트 쓰기(Google Drive OAuth2)** 등 사용자의 인프라에 데이터를 **물리적으로 저장/적재하는 쓰기 동작**은 로컬 크리덴셜을 정상적으로 사용하되, 가공 단계에서의 AI 추론(LLM API 호출) 과정은 철저히 배제합니다.

---

## UI/UX 키보드 인터랙션 규칙 (Keyboard Interaction Rules for Overlays)

앞으로 추가하거나 수정하는 모든 페이지 내 팝업, 모달, 다이얼로그 등의 오버레이 UI 요소는 사용성 및 웹 접근성(a11y) 극대화를 위해 반드시 키보드 ESC 버튼 입력을 감지하여 닫힐 수 있도록 구현해야 합니다.

### 1. ESC 키 바인딩 원칙 (ESC Key Dismissal Rule)
* **상태 감지**: 팝업/모달이 화면에 열려 있는 상태(`isOpen === true` 등)일 때, 전역 키보드 이벤트 리스너(`keydown`)를 등록하여 `Escape` 키 입력 시 팝업이 즉시 닫히도록 제어해야 합니다.
* **이벤트 정리**: 컴포넌트가 언마운트되거나 팝업이 닫힐 때, 불필요한 이벤트 리스너가 누적되거나 메모리 누수가 발생하지 않도록 등록한 이벤트 리스너를 반드시 정리(`removeEventListener`)해야 합니다.
* **기본 동작 차단**: 필요할 경우 `event.preventDefault()`를 호출하여 다른 의도치 않은 브라우저 기본 단축키 동작과의 간섭을 예방합니다.

---

## Vercel Cron 스케줄러 관리 및 갱신 규칙 (Vercel Cron Registry Maintenance Rule)

* **필독 규격**: 플랫폼 내에 무인 자동화 배치(Vercel Cron) 작업이 신설되거나 스케줄링 주기가 변동되는 모든 개발 태스크는 반드시 공식 대장 문서에 이력을 기록해야 합니다.
  → `@docs/project/vercel-cron-scheduler-registry.md`

### 1. 신규 크론 추가 시 대장 작성 의무
* `vercel.json` 설정에 신규 스케줄러를 추가하거나, 크론 트리거 API 라우터(`src/app/api/cron/...`)를 신설하는 작업은 **대장 문서 등록이 완료될 때까지 구현 완료(Done)로 판정할 수 없습니다.**
* 크론 스케줄러 이름, 주기(UTC/KST), 실행 경로, 보안 가드 사양을 대장 테이블과 세부 명세에 누적 기입해야 합니다.

### 2. 크론 API 보안 수립 원칙
* 신설되는 모든 크론 엔드포인트는 악의적인 쿼터 고갈 및 디도스 유입을 방지하기 위해 헤더의 `Authorization: Bearer ${process.env.CRON_SECRET}` 토큰을 대조 검증하는 가드 로직을 무조건 장착해야 합니다.

---

## 구글 스프레드시트 실시간 동기화 규칙 (Real-time Google Sheets Sync Rule)

* **필독 규격**: 에이전트가 구글 시트(Google Sheets)에 다량의 데이터(예: 카테고리, 프롬프트, 도메인 등)를 생성하여 입력할 때는 메모리에 모아서 마지막에 쓰는 방식 대신, **구조(Outline)를 즉시 선 업로드한 뒤 각 셀(Row) 단위로 실시간 동기화(Incremental Update)**하여 사용자 화면에 라이브로 기록 과정을 보여주어야 합니다.

### 1. 실시간 기록 의무
* 사용자가 스프레드시트 화면을 보며 작업 상황을 실시간으로 확인하고 안심할 수 있도록, 배치 단위의 일괄 업데이트를 지양하고 1개 행(Row) 생성 시 마다 즉각 구글 API를 호출하여 동기화하십시오.

---

## 테크니컬 SEO 브랜드 키워드 동적 삽입 규칙 (Technical SEO Brand Keyword Rules)

* **필독 규격**: 앞으로 신설되거나 리팩토링하는 모든 대외 공개용 페이지 및 서브메뉴는 검색엔진(구글, 네이버 등)에 효과적으로 색인 및 노출될 수 있도록 **브랜드 키워드가 포함된 메타데이터를 의무적으로 탑재**해야 합니다.

### 1. 브랜드 타이틀 포맷 준수
* 브라우저 타이틀(`title`) 속성에 반드시 **`[도구/게시판/섹션명] | 크리에이박스 CreAibox`** 형식의 브랜딩 키워드가 들어가도록 정의해야 합니다. (예: `AI 스마트 글쓰기 | 크리에이박스 CreAibox`)
* 설명글(`description`) 및 관련 핵심 검색어(`keywords`)에도 "크리에이박스", "creaibox" 가 자연스럽게 녹아들도록 기재하십시오.

### 2. 클라이언트 컴포넌트 이중화 분리 설계 원칙
* Next.js App Router 스펙상 `"use client"` 지시어가 선언된 파일에서는 `metadata` 또는 `generateMetadata()` 서버 함수를 직접 export할 수 없습니다.
* 이를 해결하기 위해, 페이지 진입 디렉토리의 `page.tsx` 는 서버 컴포넌트로 유지하여 메타데이터만 내보내게 하고, 실질적인 클라이언트 UI 및 렌더링 로직은 같은 폴더 내에 `client.tsx` (클라이언트 컴포넌트)를 신설해 수입(import)하여 렌더링하는 **이중 레이어 구조를 철저히 이식**해야 합니다.

### 3. 동적 사이트맵(sitemap.ts) 반영 의무
* 앞으로 크리에이박스 플랫폼 내에 신설되는 모든 메인 메뉴, 공개 페이지, 서브메뉴 목적지 주소는 검색엔진 수집 효율 극대화를 위해 **`src/app/sitemap.ts` 파일의 `staticUrls` 배열 목록에 수동 또는 동적으로 무조건 등록**해야 합니다.
* 사이트맵 등록 처리가 누락된 기능 개발 태스크는 최종 구현 완료(Done) 판정을 내릴 수 없습니다. 반드시 등록 이력을 대조 확인하십시오.

---

## 🎨 B2B/대외 공개용 페이지 다크/라이트 모드 하이브리드 토글 지원 규칙 (B2B & Public Page Hybrid Theme Toggle Rule)

앞으로 크리에이박스 플랫폼 내에 신설되는 모든 공개용 페이지, 메인 메뉴, 소개 페이지 및 게이트웨이 서비스 화면은 테마 토글 스위치(다크 모드 ↔ 라이트 모드 전환) 작동 시 디자인이 실시간으로 반응하도록 구현해야 합니다.

### 1. 하드코딩 배경/글자 금지 및 Tailwind dark: 지원
* 특정 한쪽 테마(예: bg-[#06080d]로 다크 테마 고정 또는 bg-slate-50으로 라이트 테마 고정)만을 하드코딩해서 고정하지 마십시오.
* 다크/라이트 전환에 반응할 수 있도록 Tailwind CSS의 `dark:` 접두사 클래스를 기본 텍스트, 카드배경, 테두리, 입력창, 푸터, 버튼 등의 전반에 걸쳐 이중 매핑하여 선언하십시오.
  * 예: `className="bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 transition-colors duration-300"`

### 2. 양방향 비주얼 무결성 검증
* 라이트 모드일 때는 깔끔하고 가독성 높은 백색 톤 배경에 정갈한 다크 그레이 타이포가 출력되고, 다크 모드로 전환 시에는 수려하고 신뢰감 높은 딥 슬레이트 블랙 배경에 오로라 그라데이션 광원이 정상 렌더링되는지 양방향 디자인 무결성을 철저하게 확인해야 합니다.

---

## 🔐 비로그인 자유 둘러보기 & 로그인 필수 서비스 팝업 통일 규칙 (Unauthenticated Access & Unified Login Prompt Rule)

앞으로 크리에이박스(CreAibox) 플랫폼 내에 신규 개발하거나 수정하는 모든 서비스, 스튜디오, 대시보드, 도구 화면에 대하여 다음 3대 접근성 및 UX 규칙을 철저히 적용해야 합니다.

### 1. 비로그인 사용자 전면 뷰포트 노출 원칙 (No Full Page Blocking for Guests)
- 로그인하지 않은 비회원/방문자 사용자라도 플랫폼의 모든 스튜디오 탭, 템플릿 쇼핑, CMS 관리 폼, 도메인 검색, 카테고리 설정, AI 제작 신청서 화면을 자유롭게 구경하고 구조를 탐색할 수 있어야 합니다. ("아, 사이트를 이렇게 관리하고 만드는 거구나"를 직관적으로 파악)
- 페이지 전체를 가리는 가림막 카드나 거부 처리 화면을 절대 선제적으로 덮지 마십시오.
- 폼 입력란은 타인의 데이터를 노출하지 않고, 비워진 상태에서 깔끔한 예시 가이드 텍스트(Placeholder, 예: `예: (주)크리에이박스 또는 내 상호명`)를 제공하십시오.

### 2. 액션 버튼 클릭 시 로그인 안내 팝업 모달 연결 (Action Button Login Prompt Trigger)
- DB 데이터 저장, AI 실시간 구동, 원고 작성/발행, 템플릿 구축, 도메인 구매/이관 등 로그인 세션이 필요한 기능을 실행하는 액션 버튼을 클릭하면, 이전 형태의 구식 브라우저 alert(`"로그인을 하셔야 사용할 수 있는 메뉴입니다."`)나 백엔드 네트워크 에러를 띄우지 마십시오.
- 무조건 **"로그인이 필요한 서비스입니다" 전용 팝업 모달(Login Prompt Modal)**을 띄우고, **`[ 🔑 로그인 하러 가기 ]`** 버튼을 제공하여 로그인 페이지로 자연스럽게 연결하십시오.

### 3. 기존 및 신규 서비스 100% 규격 일원화
- 플랫폼 내의 모든 사이드바 메뉴 및 서브 스튜디오 화면에서 위 UX 규칙을 100% 동일하게 유지해야 하며, 어떠한 메뉴에서도 예외를 두지 않습니다.

---

## Mandatory Vercel Environment Variables Sync Rule (Vercel 환경변수 동기화 및 재배포 안내 규칙)

* **필독 규격**: 로컬(`.env.local`)에 새로운 필수 환경변수(API Key, DB Key, Encryption Key 등)를 추가하거나 변경하는 작업을 수행했을 경우, 에이전트는 반드시 사용자에게 Vercel 프로덕션 대시보드에도 동일한 환경변수를 추가하고 **재배포(Redeploy)**해야 함을 강력하게 안내해야 합니다.

### 1. 로컬 환경변수 자동 적용 불가 원칙
- Vercel 프로덕션 실서버는 보안상 로컬의 `.env.local` 파일을 절대 읽지 않으므로, 에이전트는 환경변수 추가 작업이 로컬에서 성공했다고 해서 실서버에서도 작동할 것이라고 가정하거나 침묵해서는 안 됩니다.

### 2. 명시적 재배포 알림 의무
- 환경변수가 추가/변경된 기능(예: 크론, 신규 외부 API 연동 등)을 개발/테스트 완료한 직후, 에이전트는 채팅창을 통해 사용자에게 **"해당 기능이 실서버(Vercel)에서도 정상 작동하려면 반드시 Vercel 대시보드 [Settings > Environment Variables] 메뉴에 방금 추가한 키를 똑같이 등록하고 [Redeploy] 해야 한다"**는 사실을 명확하게 브리핑해야 합니다.