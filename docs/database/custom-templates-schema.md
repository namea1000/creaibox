# CreaiBox 커스텀 템플릿 보관함 (Custom Templates) DB 스키마 명세서

연관 아키텍처 및 실무 매뉴얼:
- 🔴 [아키텍처 기술 명세서](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/custom-templates-architecture.md)
- 🔵 [서비스 실무 매뉴얼](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-templates-manual.md)
- 🟢 [순수 실행 SQL DDL](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/custom-templates.sql)

---

## 1. 테이블 개요
`public.custom_templates` 테이블은 사용자가 이관한 웹사이트나 직접 제작한 사이트의 완성도 높은 디자인 레이아웃(헤더, 푸터, 본문 섹션 스냅샷, 테마 컬러)을 영구 보관하여, 템플릿 마켓플레이스 및 신규 웹사이트 빌더에서 즉시 1초 만에 재사용할 수 있도록 관리합니다.

---

## 2. 컬럼 상세 스펙

| 컬럼명 | 데이터 타입 | Nullable | 기본값 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | 템플릿 고유 ID (PK) |
| `user_id` | `UUID` | YES | `NULL` | 템플릿을 등록한 유저 ID (`auth.users.id` FK) |
| `template_key` | `TEXT` | NO | - | 고유 템플릿 식별 키 (예: `tpl_futuremind_2026`, `tpl_upstage_m29y`) |
| `name` | `TEXT` | NO | - | 템플릿 표시 이름 (예: `퓨처마인드 AI 테크 템플릿`) |
| `category` | `TEXT` | YES | `'나만의 템플릿'` | 템플릿 카테고리 (비즈니스, 스타트업, 에이전시 등) |
| `description` | `TEXT` | YES | `NULL` | 템플릿 디자인 설명 및 특징 |
| `thumbnail_url` | `TEXT` | YES | `NULL` | 템플릿 대표 미리보기 썸네일 이미지 URL |
| `source_brand_id` | `TEXT` | YES | `NULL` | 템플릿의 기반이 된 출처 브랜드 ID |
| `source_url` | `TEXT` | YES | `NULL` | 템플릿의 기반이 된 원본 사이트 URL |
| `header_html` | `TEXT` | YES | `NULL` | 헤더 네비게이션 HTML 스냅샷 |
| `footer_html` | `TEXT` | YES | `NULL` | 푸터 HTML 스냅샷 |
| `sections_snapshot` | `JSONB` | NO | `'[]'` | 본문 섹션 구조, 스타일, 미디어 URL 스냅샷 |
| `is_public` | `BOOLEAN` | NO | `FALSE` | 마켓플레이스 전체 공개 여부 |
| `created_at` | `TIMESTAMPTZ` | NO | `now()` | 생성 일시 |
| `updated_at` | `TIMESTAMPTZ` | NO | `now()` | 수정 일시 |
