# Free Asset Requests Database Schema

## 1. Purpose

Free Asset Requests 데이터베이스는 사용자가 무료 에셋 라이브러리에서 관리자에게 필요한 에셋(이미지, 일러스트 등)의 제작을 요청하고, 관리자가 이에 피드백(제작 완료 코멘트 및 상태 변경)을 작성할 수 있도록 관리하는 시스템이다.

이 스키마는 다음 기능을 지원한다.
* 회원들이 원하는 범용 무료 에셋 요청의 세부 명세 저장
* 요청된 건들에 대한 대기/완료 상태(`pending` / `completed`) 관리
* 요청 건에 대한 관리자의 완료 답변 코멘트 누적
* RLS(Row Level Security)를 통한 악의적 업데이트 방지 및 투명한 전체 공개 조회 지원

---

## 2. Table Overview

| Table | Purpose |
| --- | --- |
| free_asset_requests | 사용자의 이미지/에셋 제작 요청 및 관리자 피드백 관리 테이블 |

---

## 3. Free Asset Requests Table

### Column Definitions

| Column | Type | Default | Description |
| --- | --- | --- | --- |
| id | UUID | gen_random_uuid() | 고유 식별자 PK |
| user_id | UUID | - | 요청자의 프로필 고유 ID (profiles.id FK, Cascade) |
| user_email | VARCHAR(255) | - | 요청 당시의 사용자 이메일 (계정 식별용) |
| user_nickname | VARCHAR(100) | - | 요청 당시의 사용자 닉네임 (화면 노출용) |
| media_type | VARCHAR(50) | - | 미디어 대분류 (이미지, 일러스트, 벡터, 비디오, GIF 등) |
| description | TEXT | - | 구체적인 이미지 요청 사항 설명 |
| status | VARCHAR(50) | 'pending' | 처리 상태 (`pending`: 대기중, `completed`: 제작완료) |
| comment | TEXT | NULL | 관리자의 제작 완료/답변 코멘트 |
| commenter_email | VARCHAR(255) | NULL | 답변을 단 관리자 이메일 |
| commented_at | TIMESTAMPTZ | NULL | 답변 작성 시각 |
| created_at | TIMESTAMPTZ | now() | 요청 등록 시각 |
| updated_at | TIMESTAMPTZ | now() | 최근 정보 갱신 시각 |

---

## 4. Database Optimization & Indexes

* **B-Tree Index (`idx_free_asset_requests_status`)**: 특정 상태(예: pending 대기 건만 필터링 또는 completed 완료 건 필터링) 조회 최적화
* **B-Tree Index (`idx_free_asset_requests_created_at`)**: 최신 요청 순 정렬(`created_at desc`) 최적화

---

## 5. RLS Policy

`free_asset_requests` 테이블은 보안을 보장하기 위해 RLS를 활성화한다.

* **SELECT (모든 사용자)**: 로그인 여부와 관계없이 누구나 이미지 제작 요청 내역과 관리자 피드백을 조회할 수 있도록 허용 (`true`)
* **INSERT (인증 회원)**: 로그인한 회원만 자신의 `user_id`를 작성하여 요청 건을 등록할 수 있도록 허용 (`auth.uid() = user_id`)
* **UPDATE / DELETE (관리자 / 스태프)**: `admin_whitelist` 테이블에 이메일이 등록되어 있거나 `profiles` 테이블의 role이 `ADMIN` 혹은 `STAFF` 권한을 가진 계정만 코멘트를 작성하고 상태를 변경 및 삭제할 수 있도록 엄격하게 제어

---

## 6. Related Documents

실행 SQL
```txt
docs/database/sql/free-assets-requests.sql
```

관련 API
```txt
src/app/api/free-assets/requests/route.ts
src/app/api/free-assets/requests/comment/route.ts
```
