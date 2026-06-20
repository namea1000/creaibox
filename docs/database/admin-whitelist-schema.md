# Admin Whitelist Database Schema

## 1. Purpose
`admin_whitelist` 테이블은 CreAibox의 2차 관리자 인증 시스템을 지원하기 위한 이중 잠금 화이트리스트 테이블이다.
데이터베이스 내 `profiles.role` 권한이 해킹이나 RLS 누락 등의 이슈로 강제 변조되더라도, 소스코드 수정 없이 관리자 UI를 통해 최종 승인된 이메일 목록만을 검증하여 불법적인 관리자 페이지 접근 및 백엔드 관리자 API 탈취를 원천 방어한다.

---

## 2. Core Columns

| Column     | Type        | Constraints | Description |
| ---------- | ----------- | ----------- | ----------- |
| id         | uuid        | Primary Key | 고유 식별자 (자동 생성) |
| email      | text        | Unique, Not Null | 승인된 관리자의 로그인 이메일 |
| created_at | timestamptz | Default now() | 관리자 화이트리스트 승인 등록 일시 |

---

## 3. RLS Policy
보안을 지키기 위해 RLS를 활성화하고 다음 정책을 적용한다.
* **SELECT**: 로그인한 일반 사용자 본인의 이메일이 화이트리스트에 존재하는지 여부를 조회할 수 있도록 허용 (`email = auth.jwt() ->> 'email'`).
* **ALL**: 서비스 롤(`service_role`) 및 백엔드 어드민 API에서만 가능.

---

## 4. Related Documents
* 실행 SQL: `docs/database/sql/admin-whitelist.sql`
* 연동 API: `/api/admin/*` 모든 엔드포인트
