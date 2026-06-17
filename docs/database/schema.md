# 데이터베이스 스키마 정의 (Database Schema)

`CreAibox`는 Supabase PostgreSQL 데이터베이스를 연동하여 동작합니다. 코드베이스의 쿼리 분석을 통해 도출해 낸 스키마 명세입니다.

---

## 1. 공통 및 계정 테이블

### `profiles` (사용자 프로필)
사용자 상세 상태 및 요금 등급을 관리하는 테이블입니다.
* **`id`**: `uuid` (Primary Key, auth.users.id 참조)
* **`email`**: `text`
* **`nickname`**: `text` (사용자 이름/별명)
* **`role`**: `text` (`"FREE" | "PAID" | "ADMIN" | "MANAGER"`)
* **`status`**: `text` (`"ACTIVE" | "INACTIVE"`)
* **`membership_level`**: `text` (`"free" | "pro" | "admin" | "manager"`)
* **`admin_memo`**: `text` (어드민 전용 개별 코멘트)
* **`created_at`**: `timestamp`
* **`last_login_at`**: `timestamp`
* **`updated_at`**: `timestamp`

---

## 2. API 자격 증명 및 이력 로그

### `admin_api_vault` (API 키 금고)
AI 및 서드파티 서비스 연동을 위한 토큰 암호화 저장소입니다.
* **`id`**: `bigint` (Primary Key)
* **`key`**: `text` (AES-256-GCM 암호화된 토큰 문자열)
* **`label`**: `text`
* **`display_name`**: `text`
* **`provider`**: `text` (`"gemini" | "openai" | "claude" | "groq" | "google_search" | "naver_search" | "youtube" | "assets" | "voice"`)
* **`model`**: `text` (기본 세팅 모델명)
* **`status`**: `text` (`"active" | "inactive"`)
* **`use_count`**: `int` (누적 성공 횟수)
* **`today_count`**: `int` (금일 요청 횟수)
* **`daily_limit`**: `int` (일일 사용량 제한)
* **`priority`**: `int` (우선순위, 정렬 기준)
* **`last_error`**: `text` (최근 발생한 API 오류 기록)
* **`failure_count`**: `int`
* **`updated_at`**: `timestamp`

### `ai_generation_usage_logs` (AI 사용량 추적 로그)
사용자별 일일 무료 AI 생성 횟수를 제한하고 통계를 집계하기 위한 로그입니다.
* **`id`**: `bigint` (Primary Key)
* **`user_id`**: `uuid` (Nullable)
* **`user_email`**: `text` (Nullable)
* **`ip_address`**: `text`
* **`feature_type`**: `text` (기능 라벨)
* **`provider`**: `text`
* **`model`**: `text` (Nullable)
* **`vault_id`**: `bigint` (Nullable)
* **`status`**: `text` (`"success" | "error"`)
* **`error_message`**: `text` (Nullable)
* **`created_at`**: `timestamp`

---

## 3. 리서치 스튜디오 테이블 (Research Studio)

### `research_projects`
* **`id`**: `uuid` / `bigint` (Primary Key)
* **`user_id`**: `uuid` (소유자)
* **`title`**: `text` (프로젝트 제목)
* **`description`**: `text`
* **`created_at`**: `timestamp`
* **`updated_at`**: `timestamp`

### `research_sources` (리서치 수집 자료)
* **`id`**: `uuid`
* **`project_id`**: `uuid` (research_projects.id 참조)
* **`user_id`**: `uuid`

### `research_chats` (AI 리서치 채팅 세션)
* **`id`**: `uuid`
* **`project_id`**: `uuid`
* **`user_id`**: `uuid`

### `research_generated_contents` (생성 완료된 문서)
* **`id`**: `uuid`
* **`project_id`**: `uuid`
* **`user_id`**: `uuid`

### `research_images` (리서치 발굴/생성 이미지)
* **`id`**: `uuid`
* **`project_id`**: `uuid`
* **`user_id`**: `uuid`

---

## 4. 포스팅/블로그 원고 테이블 (Writing Studio)

### `writing_creaibox_posts` (CreAibox 원고)
* **`id`**: `uuid` / `bigint` (Primary Key)
* **`display_id`**: `bigint` (사용자 노출용 순번)
* **`user_id`**: `uuid`
* **`title`**: `text`
* **`content`**: `text`
* **`post_type`**: `text` (`"create" | "recreate"`)
* **`status`**: `text` (`"draft" | "saved" | "published"`)
* **`target_keyword`**: `text`
* **`selected_tone`**: `text`
* **`slug`**: `text` (URL 슬러그)
* **`meta_description`**: `text` (검색 설명)
* **`focus_keyword`**: `text` (포커스 키워드)
* **`canonical_url`**: `text` (대표 주소)
* **`seo_tags`**: `text[]` (배열 형태의 검색 태그)
* **`word_count_goal`**: `int` (Nullable, 목표 단어 수)
* **`source_mode`**: `text` (Nullable)
* **`created_at`**: `timestamp`
* **`updated_at`**: `timestamp`

### `writing_naver_posts` (네이버 블로그 원고)
* **`id`**: `uuid`
* **`user_id`**: `uuid`
* **`title`**: `text`
* **`content`**: `text`
* **`post_type`**: `text` (`"create" | "recreate"`)
* **`source_mode`**: `text` (`"url" | "text"`)
* **`source_url`**: `text`
* **`source_text`**: `text`
* **`rewrite_strategy`**: `text` (스타일 가이드라인)
* **`word_count_goal`**: `int`
* **`status`**: `text`
* **`target_keyword`**: `text`
* **`selected_tone`**: `text`
* **`categories`**: `text[]`
* **`tags`**: `text[]`
* **`created_at`**: `timestamp`
* **`updated_at`**: `timestamp`

---

## 5. 뮤직 스튜디오 테이블 (Music Studio)
* **`music_lyrics_projects`**: 음악 프로젝트 기본 테이블.
* **`music_albums`**: 앨범 패키징 레코드.
* **`music_album_plans`**: 기획 단계의 문서.
* **`music_generation_batches`**: SUNO 프롬프트 및 가사 생성 결과물 관리.

---

## 6. 대시보드 위젯 테이블

### `studio_widgets` (스튜디오 위젯 보드)
* **`id`**: `bigint` (Primary Key)
* **`user_id`**: `uuid`
* **`widget_type`**: `text`
* **`x`**, **`y`**, **`w`**, **`h`**: `int` (드래그 가능한 레이아웃 포지션 값)
* **`content`**: `jsonb` (위젯 설정 내용)

### `cre_note_folders` & `cre_notes` (노트 기능)
* **`cre_note_folders`**: `id` (`uuid`), `user_id` (`uuid`), `name` (`text`)
* **`cre_notes`**: `id` (`uuid`), `folder_id` (`uuid`), `title` (`text`), `content` (`text`)

---

## 7. 시스템 설정 및 관리자 테이블

### `admin_whitelist` (어드민 이중 잠금 화이트리스트)
어드민 등급 지정 시 이메일 기반으로 실질적인 관리자 권한을 승인 및 통제하는 테이블입니다.
* **`id`**: `uuid` (Primary Key)
* **`email`**: `text` (Unique, 승인된 관리자 이메일)
* **`created_at`**: `timestamp` (승인 일시)
