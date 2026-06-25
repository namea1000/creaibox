# Free Assets Database Schema

## 1. Purpose

Free Assets 데이터베이스는 CreAibox에서 제공하는 무료 공유 에셋(이미지, 음악, 비디오 등)의 메타데이터와 파일 저장 위치를 관리하기 위한 시스템이다.

이 스키마는 다음 기능을 지원한다.

* 구글 드라이브 미디어 저장소 경로 및 파일 식별자(gdrive_file_id) 관리
* 미디어 타입(image, music, video 등) 및 생성 연월(YYYYMM) 기준 조회 최적화
* 태그 배열(tags) 기반 초고속 Gin 인덱스 검색
* 다운로드수 및 조회수 등 실시간 통계 카운트 기록
* 에셋 메타데이터(카메라 정보, 이미지 비율, 생성 방식 등) 저장

---

## 2. Table Overview

| Table | Purpose |
| --- | --- |
| free_assets | 무료 공유 에셋 메타데이터 저장 및 검색 테이블 |

---

## 3. Free Assets Table

무료 공유 에셋 메타데이터 저장소이다.

### Column Definitions

| Column | Type | Default | Description |
| --- | --- | --- | --- |
| id | UUID | gen_random_uuid() | 고유 식별자 PK |
| gdrive_file_id | VARCHAR(255) | UNIQUE | 구글 드라이브 파일 고유 ID |
| storage_url | TEXT | - | 구글 드라이브 다이렉트 다운로드/뷰 URL |
| file_name | VARCHAR(255) | - | 가독성용 파일명 (예: 바다1.png) |
| mime_type | VARCHAR(100) | - | 파일 MIME 타입 (예: image/png) |
| media_type | VARCHAR(50) | - | 미디어 대분류 (image, music, video, document 등) |
| year_month | VARCHAR(6) | - | 업로드 연월 (YYYYMM, 예: 202606) |
| title | VARCHAR(255) | - | 에셋 한글/영문 제목 |
| tags | TEXT[] | '{}' | 검색용 태그 배열 (Gin 인덱스 적용) |
| uploader | VARCHAR(255) | '익명' | 업로더 (닉네임 또는 이메일) |
| downloads_count | INTEGER | 0 | 누적 다운로드 수 |
| views_count | INTEGER | 0 | 누적 조회수 |
| width | INTEGER | 0 | 이미지 가로 해상도 (픽셀) |
| height | INTEGER | 0 | 이미지 세로 해상도 (픽셀) |
| aspect_ratio | VARCHAR(50) | '' | 가로세로 비율 (예: 16:9, 1:1) |
| generation_type | VARCHAR(50) | 'real' | 생성 방식 (real: 촬영 실사, ai: AI 생성 등) |
| camera | VARCHAR(255) | '촬영 정보 없음' | 촬영 장비 및 카메라 스펙 정보 |
| prompt | TEXT | '' | AI 생성 이미지용 텍스트 프롬프트 |
| ai_tool | VARCHAR(100) | '' | AI 생성 시 사용된 도구명 (예: 미드져니, 나노바나나 등) |
| is_official_theme_asset | BOOLEAN | false | 공식 15대 테마 전용 이미지 여부 |
| theme_category | VARCHAR(50) | NULL | 공식 테마 카테고리 (예: Business, Store, Blog 등) |
| is_business_only | BOOLEAN | false | 비즈니스 멤버십(Business/Enterprise) 전용 다운로드 통제 여부 |
| created_at | TIMESTAMPTZ | now() | 업로드 시간 |

---

## 4. Database Optimization & Indexes

대용량 적재 시(수십만~수백만 개)에도 빠른 페이지네이션과 태그 검색을 지원하기 위해 다음 인덱스를 적용한다.

* **Gin Index (`idx_free_assets_tags`)**: 태그 배열 내 특정 태그 포함 여부 검색 가속화 (`tags @> ARRAY['바다']`)
* **B-Tree Index (`idx_free_assets_media_type`)**: 미디어 분류(이미지/음악/비디오)별 조회 필터링 최적화
* **B-Tree Index (`idx_free_assets_created_at`)**: 최신순 정렬 및 페이징 성능 극대화
* **Composite Index (`idx_free_assets_theme_filter`)**: 프리미엄 테마 전용 필터링 및 다운로드 권한 검색 극대화 (`is_official_theme_asset, theme_category, is_business_only`)

---

## 5. RLS Policy

`free_assets` 테이블은 RLS를 적용한다.

* **SELECT (모든 사용자)**: 로그인 여부와 관계없이 누구나 무료 공유 에셋을 조회할 수 있도록 허용 (`true`)
* **ALL (어드민 / 스태프 / 업로더 본인)**: 어드민 또는 스태프 권한을 가진 사용자, 또는 해당 에셋을 업로드한 본인(`uploader = auth.jwt() ->> 'email'`)만 에셋을 등록, 수정, 삭제할 수 있도록 허용

---

## 6. Related Documents

실행 SQL

```txt
docs/database/sql/free-assets.sql
docs/database/sql/premium-theme-gallery.sql
```

관련 API

```txt
src/app/api/free-assets/list/route.ts
src/app/api/free-assets/upload/route.ts
src/app/api/free-assets/delete/route.ts
src/app/api/free-assets/update/route.ts
```
