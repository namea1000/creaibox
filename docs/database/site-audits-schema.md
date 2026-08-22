# CreaiBox AI 웹사이트 정밀 진단 (Site Audits) DB 스키마 명세서

연관 아키텍처 및 실무 매뉴얼:
- 🔴 [아키텍처 기술 명세서](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/site-audit-architecture.md)
- 🔵 [서비스 실무 매뉴얼](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/site-audit-manual.md)
- 🟢 [순수 실행 SQL DDL](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/site-audits.sql)

---

## 1. 테이블 개요
`public.site_audits` 테이블은 사용자가 입력한 웹사이트의 기술 스택, 프레임셋 포워딩 여부, SEO 점수, 보안/SSL 상태, 1:1 비교 분석표 및 AI 종합 개선 솔루션을 영구 저장하여, 사용자가 언제든지 진단 히스토리를 재열람하고 원클릭 현대화 이관을 진행할 수 있도록 관리합니다.

---

## 2. 컬럼 상세 스펙

| 컬럼명 | 데이터 타입 | Nullable | 기본값 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `gen_random_uuid()` | 진단 레코드 고유 ID (PK) |
| `user_id` | `UUID` | YES | `NULL` | 진단을 요청한 유저 ID (`auth.users.id` FK, 회원탈퇴 시 CASCADE) |
| `target_url` | `TEXT` | NO | - | 진단 대상 원본 URL (예: `http://futuremind.kr`) |
| `normalized_domain` | `TEXT` | NO | - | 정규화된 도메인명 (예: `futuremind.kr`) |
| `title` | `TEXT` | YES | `NULL` | 대상 사이트 HTML 타이틀 |
| `description` | `TEXT` | YES | `NULL` | 대상 사이트 메타 디스크립션 |
| `detected_engine` | `TEXT` | YES | `'Custom / Unknown'` | 감지된 개발 툴/엔진 (예: Figma Site, WordPress, Wix, Imweb, Next.js 등) |
| `is_frameset` | `BOOLEAN` | NO | `FALSE` | 고정 프레임셋(아이프레임 포워딩) 사용 여부 |
| `frame_src` | `TEXT` | YES | `NULL` | 프레임셋 내부 실제 사이트 주소 |
| `has_ssl` | `BOOLEAN` | NO | `TRUE` | HTTPS/SSL 보안 적용 여부 |
| `seo_score` | `INTEGER` | NO | `50` | SEO 검색엔진 수집 점수 (0~100) |
| `performance_score` | `INTEGER` | NO | `50` | 성능 및 반응형 렌더링 점수 (0~100) |
| `security_score` | `INTEGER` | NO | `50` | 보안 및 도메인 신뢰도 점수 (0~100) |
| `overall_grade` | `TEXT` | NO | `'B'` | 종합 등급 (`S`, `A`, `B`, `C`, `D`, `F`) |
| `issues` | `JSONB` | NO | `'[]'` | 식별된 치명적 취약점 목록 |
| `improvements` | `JSONB` | NO | `'[]'` | 권장 개선 가이드라인 목록 |
| `comparison_table` | `JSONB` | NO | `'[]'` | 현재 사이트 vs CreaiBox 1:1 비교 분석표 |
| `scan_report_snapshot` | `JSONB` | NO | `'{}'` | 원본 헤더, 메타태그 및 스캔 원본 데이터 스냅샷 |
| `created_at` | `TIMESTAMPTZ` | NO | `now()` | 진단 생성 일시 |
| `updated_at` | `TIMESTAMPTZ` | NO | `now()` | 진단 업데이트 일시 |

---

## 3. 인덱스 (Indexes)
- `idx_site_audits_user_id`: 사용자별 진단 목록 고속 조회 (`user_id`)
- `idx_site_audits_normalized_domain`: 도메인별 진단 검색 (`normalized_domain`)
- `idx_site_audits_created_at`: 최신순 정렬 조회 (`created_at DESC`)
