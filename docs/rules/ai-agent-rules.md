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