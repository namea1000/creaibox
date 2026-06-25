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

## UI/UX 로딩 설계 규칙 (Loading-Free & Instant Rendering UX)

앞으로 추가로 만드는 모든 페이지 및 기능 개발 시, 사용자의 흐름을 가로막는 전체 화면 로딩 스피너/화면(Loading blocking UI) 설계를 절대 금지합니다. 다음 원칙에 따라 화면을 즉시 렌더링하도록 설계하십시오.

### 1. 전체 화면 로딩 가림막 금지 (No Full-Screen Spinner)
* `isLoading` 상태가 `true`일 때 페이지 전체(또는 레이아웃 껍데기까지 포함하여)를 가리고 로딩 스피너만 빙글빙글 도는 페이지 구조를 만들지 마십시오.
* 사이드바, 탑바 등 부모가 제공하는 껍데기 레이아웃(Layout Shell)은 페이지 진입 즉시 100% 노출되고 인터랙션할 수 있어야 합니다.

### 2. 초기 상태 우회 및 즉시 대시보드 렌더링 (Pre-Approved Placeholder State)
* 권한 상태(예: `brandStatus`, `membershipLevel` 등)의 조회 지연으로 인해 특정 가이드 뷰가 떴다가 본문으로 전환되는 깜빡임(Flicker)을 방지하기 위해, 최초 렌더링 시 기본 상태값을 통과값(예: `APPROVED`, `ACTIVE`)으로 설정하여 대시보드 구조를 즉시 노출하십시오.
* 데이터가 비동기로 로드(Resolve)된 후 실제 조회된 상태 및 데이터로 값들을 덮어쓰고(Overwritten) 필요한 가이드나 비활성 안내 카드로 자연스럽게 전환하십시오.

### 3. 스켈레톤 및 인라인 로딩 적용 (Skeleton & Inline Loading)
* 로딩 처리가 필요하다면 화면 전체를 막지 말고, 데이터가 로드 중인 개별 카드, 텍스트 인풋, 리스트 영역 등에만 국한하여 스켈레톤(Skeleton UI) 또는 컴팩트한 인라인 스피너를 적용하십시오.

---

## API 및 로컬 크리덴셜 사용 금지 규칙 (No User Credentials for Agent Tasks)

안티그레비티 AI 에이전트가 백그라운드 코딩, 번역, 텍스트 가공, 프롬프트 생성 등의 개발 작업을 수행할 때, 프로젝트 로컬에 저장된 사용자의 API 키(`.env.local`의 `GROQ_API_KEY`, `OPENAI_API_KEY` 등)를 호출하는 외부 AI 서비스 API 요청 행위를 원천 금지합니다.

### 1. 에이전트 자체 AI 엔진 사용 원칙
* 대량 번역, 프롬프트 일괄 작성, 설명 데이터 가공 등 지능형 데이터 처리가 필요한 모든 개발 프로세스는 사용자의 계정(크레딧/한도)을 소모하지 마십시오.
* 에이전트 자신(Gemini 모델 및 내장 플랫폼 도구)의 컨텍스트 연산 능력과 스크립트 기반의 지능형 규칙 엔진을 100% 활용하여 로컬에서 즉각 연산 및 적재를 완료해야 합니다.

### 2. 예외 사항
* 데이터베이스 마이그레이션(Supabase DB API), 구글 시트 쓰기(Google Drive OAuth2) 등 사용자의 인프라에 데이터를 **물리적으로 저장/적재하는 쓰기 동작**은 로컬 크리덴셜을 정상적으로 사용하되, 가공 단계에서의 AI 추론(LLM API 호출) 과정은 철저히 배제합니다.