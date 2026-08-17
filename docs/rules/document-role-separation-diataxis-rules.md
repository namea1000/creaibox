# [Rule] Document Role Separation & Diátaxis Framework (문서 역할 엄격 분리 규칙)

> **문서 분류**: 개발/운영 컨벤션 가이드 (Rules)
> **적용 대상**: 향후 CreaiBox 프로젝트 내에서 작성되는 모든 문서 (`docs/arch/`, `docs/project/manual/` 등)

---

## 1. 개요 및 목적 (Philosophy)
CreaiBox 프로젝트는 문서의 혼재로 인한 비효율(기술 부채)을 원천 차단하기 위해, 글로벌 빅테크 및 오픈소스 업계의 테크니컬 라이팅 표준인 **'디아탁시스(Diátaxis) 프레임워크'**를 근간으로 삼습니다.

모든 문서는 **"누가 읽는가(독자)"**와 **"왜 읽는가(목적)"**에 따라 100% 엄격하게 분리되어야 하며, 하나의 문서에 '설계 원리'와 '단순 따라하기(HOW-TO)'를 절대 중복해서 섞어 쓰지 않습니다.

## 2. 4대 핵심 마스터 문서 분리 및 유지보수 기준 (4-Pillar Master Architecture)

CreaiBox 프로젝트의 **모든 신규 기능 개발뿐만 아니라 기존 메뉴의 수정/보완/업데이트 시** 문서는 다음 **4가지 독립적인 역할(4-Pillar 체계)**로 완벽히 분리 및 동시 최신화하여 영구 관리합니다.

### 🔴 1. 아키텍처 기술 명세서 (Architecture Spec)
* **저장 위치**: `docs/arch/`
* **주요 독자**: 시니어 개발자, 시스템 아키텍트, 보안 담당자
* **작성 목적**: 시스템이 **"왜(WHY)"** 이렇게 설계되었고, 내부에서 **"무엇(WHAT)"**이 일어나는지 뼈대와 원리를 설명하기 위함.
* **필수 포함 내용**:
  - 기술 스택 및 선택의 이유 (Trade-offs)
  - Mermaid를 활용한 Sequence Diagram, 데이터 흐름도, 파이프라인
  - 서버 응답 헤더 스펙, 캐시 정책, 보안 아키텍처 등 심도 깊은 설계 스펙
* **유지보수 주기**: 핵심 시스템 구조가 바뀌지 않는 한 **수정이 거의 발생하지 않음.**

### 🔵 2. 서비스 실무 매뉴얼 (How-To Manual)
* **저장 위치**: `docs/project/manual/`
* **주요 독자**: 기획자, 주니어/실무 개발자, 서비스 운영팀, CS 담당자
* **작성 목적**: 당면한 문제를 해결하기 위해 **"어떻게(HOW)"** 조작해야 하는지 실전 스텝바이스텝 가이드를 제공하기 위함.
* **필수 포함 내용**:
  - 1분 만에 따라 할 수 있는 실전 셋업 가이드 (HOW-TO)
  - 화면 UI 조작 순서, 꿀팁, FAQ
  - **실무 개발자 및 운영자 절대 금지 패턴 (Anti-Patterns)**
* **유지보수 주기**: 관리자 화면 UI가 바뀌거나 새로운 운영 이슈가 생길 때마다 **매우 빈번하게 수정/추가됨.**

### 🟡 3. 데이터베이스 스키마 명세서 (Database Schema Spec)
* **저장 위치**: `docs/database/<feature>-schema.md`
* **주요 독자**: 백엔드 개발자, DB 설계자, 데이터 분석가
* **작성 목적**: 해당 기능의 **테이블 구조, 컬럼 타입, 제약조건, 관계(ERD), RLS 정책의 의미**를 사람이 읽기 쉽게 문서화하기 위함.
* **필수 포함 내용**:
  - 테이블 명세서 표 (컬럼명, 데이터 타입, Nullable, Default, 역할 설명)
  - 테이블 간 관계도 (1:N, N:M 외래키 관계)
  - Row Level Security (RLS) 보안 정책 및 인덱스 전략 설명
* **유지보수 주기**: 테이블 스키마에 컬럼이 추가되거나 타입이 바뀔 때마다 갱신됨.

### 🟢 4. 데이터베이스 SQL 실행 스크립트 (Pure SQL DDL)
* **저장 위치**: `docs/database/sql/<feature>.sql`
* **주요 독자**: DB 관리자, Supabase 작업자
* **작성 목적**: 실제 Supabase SQL Editor에서 **마크다운 서식 없이 즉시 복사하여 RUN(실행) 가능한 순수 SQL**을 영구 형상 관리하기 위함.
* **필수 포함 내용**:
  - `CREATE TABLE`, `ALTER TABLE`, `CREATE TRIGGER`, `CREATE FUNCTION` 등 100% 실행 가능한 SQL 쿼리
  - 상단에 연관 문서 링크 주석 (`--`) 및 주의사항
* **유지보수 주기**: DB 마이그레이션이 발생할 때마다 누적/갱신됨.

---

## 3. 4대 마스터 문서 간 상호 교차 참조 (Cross-Linking) 의무
작업자가 4개 중 어느 문서를 열더라도 나머지 3개 문서를 즉시 찾을 수 있도록 **문서 최상단에 상호 링크를 반드시 명시**합니다.

* **아키텍처 명세서 (`docs/arch/`) 상단 헤더**:
  > `> 연관 실무 매뉴얼: docs/project/manual/xxx-manual.md`  
  > `> 연관 DB 스키마: docs/database/xxx-schema.md`  
  > `> 연관 실행 SQL: docs/database/sql/xxx.sql`

* **실무 매뉴얼 (`docs/project/manual/`) 상단 헤더**:
  > `> 연관 아키텍처 명세서: docs/arch/xxx-architecture.md`  
  > `> 연관 DB 스키마: docs/database/xxx-schema.md`  
  > `> 연관 실행 SQL: docs/database/sql/xxx.sql`

* **DB 스키마 명세서 (`docs/database/`) 상단 헤더**:
  > `> 연관 아키텍처 명세서: docs/arch/xxx-architecture.md`  
  > `> 연관 실무 매뉴얼: docs/project/manual/xxx-manual.md`  
  > `> 연관 실행 SQL: docs/database/sql/xxx.sql`

* **DB 실행 SQL (`docs/database/sql/`) 상단 주석**:
  > `-- 연관 아키텍처: docs/arch/xxx-architecture.md`  
  > `-- 연관 실무 매뉴얼: docs/project/manual/xxx-manual.md`  
  > `-- 연관 DB 스키마: docs/database/xxx-schema.md`

---

## 4. 이 원칙을 고수해야 하는 3가지 이유
1. **독자의 시간 절약**: 신입 사원이 당장 버튼 누르는 법을 찾기 위해 복잡한 시퀀스 다이어그램 10페이지를 읽어야 하는 낭비를 막고, DB 관리자는 설명글 없이 깔끔한 SQL만 복사할 수 있습니다.
2. **문서 훼손 방지**: 운영팀이 매뉴얼(HOW-TO)을 수시로 업데이트하고 지우더라도, 핵심 시스템 설계도(아키텍처)나 원본 SQL DDL이 함께 지워지거나 꼬이는 위험을 0%로 만들어 줍니다.
3. **완벽한 형상 관리 (삼위일체)**: 기능 하나를 개발할 때 **[원리 설계(A) + 실무 운용(B) + 데이터베이스 코드(C)]**가 톱니바퀴처럼 맞물려 영구 보존됩니다.
