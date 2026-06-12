# AI Assistant Database Schema

## 1. Purpose

AI Assistant 데이터베이스는 CreAibox의 전역 AI 작업 비서와 Multi Agent Hub 기능을 저장하기 위한 구조이다.

이 스키마는 다음 기능을 지원한다.

* 사용자별 AI Assistant 설정
* 회원 등급별 사용 한도
* 폴더 기반 채팅 관리
* 채팅창 단위 대화 저장
* 메시지 JSONB 누적 저장
* 글자수 기반 채팅창 제한
* 멀티 에이전트 실행 로그
* AI 액션 적용 기록
* RLS 기반 사용자 데이터 보호

---

## 2. Core Storage Policy

AI Assistant는 메시지 1개마다 DB row를 만들지 않는다.

채택한 저장 방식:

```txt
채팅창 1개 = DB row 1개
```

대화 내용은 `ai_assistant_conversations.messages`의 `jsonb` 배열에 누적 저장한다.

이 방식의 목적은 다음과 같다.

* DB row 폭증 방지
* 채팅창 단위 관리
* 사용자의 프로젝트형 대화 관리
* 폴더 기반 정리
* 글자수 기반 한도 제어

---

## 3. Tables Overview

| Table                        | Purpose                   |
| ---------------------------- | ------------------------- |
| `ai_assistant_plan_limits`   | 회원 등급별 AI Assistant 사용 정책 |
| `ai_assistant_user_settings` | 사용자별 AI Assistant 설정      |
| `ai_assistant_folders`       | 사용자 폴더                    |
| `ai_assistant_conversations` | 채팅창 및 대화 내용               |
| `ai_assistant_actions`       | AI가 제안한 적용 액션 기록          |
| `ai_assistant_agent_runs`    | 멀티 에이전트 실행 로그             |

---

## 4. ai_assistant_plan_limits

회원 등급별 사용 제한을 관리한다.

기본 등급:

| plan_key | max_chars_per_conversation | max_conversations | max_folders | multi_agent |
| -------- | -------------------------: | ----------------: | ----------: | ----------- |
| free     |                    300,000 |                20 |          10 | false       |
| pro      |                    500,000 |               100 |          30 | true        |
| business |                    800,000 |               300 |         100 | true        |
| admin    |                  1,000,000 |             9,999 |       9,999 | true        |

주요 컬럼:

| Column                       | Description                |
| ---------------------------- | -------------------------- |
| `plan_key`                   | free, pro, business, admin |
| `plan_name`                  | 표시용 등급명                    |
| `max_chars_per_conversation` | 채팅창 1개당 최대 글자수             |
| `max_conversations`          | 사용자별 최대 채팅창 수              |
| `max_folders`                | 사용자별 최대 폴더 수               |
| `can_use_multi_agent`        | 멀티 에이전트 사용 가능 여부           |
| `can_use_context_actions`    | AI 액션 적용 사용 가능 여부          |
| `can_use_file_context`       | 파일 기반 컨텍스트 사용 가능 여부        |

---

## 5. ai_assistant_user_settings

사용자별 AI Assistant 기본 설정을 저장한다.

주요 컬럼:

| Column                     | Description              |
| -------------------------- | ------------------------ |
| `user_id`                  | auth.users와 연결된 사용자 ID   |
| `plan_key`                 | 현재 사용자 AI Assistant 등급   |
| `default_folder_id`        | 기본 폴더 ID                 |
| `last_conversation_id`     | 마지막으로 열었던 채팅창 ID         |
| `preferred_model_provider` | gemini, openai, claude 등 |
| `preferred_model`          | 사용자가 선호하는 모델             |
| `is_enabled`               | AI Assistant 사용 가능 여부    |

비즈니스 규칙:

* 사용자 1명당 설정 row는 1개만 가진다.
* `unique(user_id)` 제약을 사용한다.
* 기본 모델은 `gemini-3-flash-preview`이다.

---

## 6. ai_assistant_folders

AI Assistant 왼쪽 패널의 폴더를 저장한다.

주요 컬럼:

| Column        | Description |
| ------------- | ----------- |
| `user_id`     | 폴더 소유자      |
| `name`        | 폴더명         |
| `description` | 폴더 설명       |
| `color`       | UI 표시 색상    |
| `icon`        | UI 아이콘 키    |
| `sort_order`  | 정렬 순서       |
| `is_pinned`   | 고정 여부       |
| `is_deleted`  | 소프트 삭제 여부   |

비즈니스 규칙:

* 사용자별 폴더명은 중복될 수 없다.
* `unique(user_id, name)` 제약을 사용한다.
* 삭제는 기본적으로 `is_deleted = true` 방식의 소프트 삭제를 사용한다.

---

## 7. ai_assistant_conversations

AI Assistant 채팅창과 대화 내용을 저장하는 핵심 테이블이다.

주요 컬럼:

| Column               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `user_id`            | 채팅창 소유자                                           |
| `folder_id`          | 연결된 폴더 ID                                         |
| `title`              | 채팅창 이름                                            |
| `description`        | 채팅창 설명                                            |
| `studio_type`        | general, writing, seo, music, research, thumbnail |
| `page_path`          | 생성 또는 마지막 사용 페이지                                  |
| `plan_key`           | 생성 당시 적용된 플랜                                      |
| `max_chars_limit`    | 해당 채팅창의 최대 글자수                                    |
| `total_chars`        | 누적 저장 글자수                                         |
| `conversation_count` | 질문·답변 세트 수                                        |
| `message_count`      | 실제 메시지 수                                          |
| `messages`           | 대화 내용 JSONB 배열                                    |
| `agents_used`        | 사용된 Agent 목록                                      |
| `context_summary`    | 장기 대화 요약                                          |
| `search_text`        | 검색용 텍스트                                           |
| `is_closed`          | 글자수 한도 도달 등으로 종료 여부                               |
| `is_pinned`          | 고정 여부                                             |
| `is_archived`        | 보관 여부                                             |
| `is_deleted`         | 소프트 삭제 여부                                         |
| `closed_reason`      | 종료 사유                                             |
| `closed_at`          | 종료 시각                                             |

메시지 저장 예시:

```json
[
  {
    "id": "message-id",
    "role": "user",
    "content": "이 글 SEO 점검해줘",
    "created_at": "2026-06-11T00:00:00.000Z"
  },
  {
    "id": "message-id",
    "role": "assistant",
    "content": "SEO 점검 결과입니다.",
    "created_at": "2026-06-11T00:00:05.000Z",
    "agents": ["router", "seo"]
  }
]
```

비즈니스 규칙:

* 채팅창 1개는 최대 `max_chars_limit`까지 대화를 저장한다.
* Free 기본 한도는 300,000자이다.
* 한도 도달 시 `is_closed = true`로 전환한다.
* 종료된 채팅창은 열람 가능하지만 새 메시지 입력은 제한한다.
* 삭제는 `is_deleted = true` 방식의 소프트 삭제를 사용한다.

---

## 8. ai_assistant_actions

AI가 제안한 적용 가능한 액션 기록을 저장한다.

예시 액션:

* 제목 적용
* 본문 적용
* 메타설명 적용
* SEO 태그 적용
* 가사 교체
* Suno 프롬프트 적용
* 썸네일 프롬프트 적용

주요 컬럼:

| Column            | Description                         |
| ----------------- | ----------------------------------- |
| `user_id`         | 액션 소유자                              |
| `conversation_id` | 연결된 채팅창                             |
| `action_type`     | apply_title, apply_content 등        |
| `action_label`    | 사용자에게 보이는 액션명                       |
| `target_table`    | 적용 대상 테이블                           |
| `target_id`       | 적용 대상 row ID                        |
| `payload`         | 적용 데이터 JSON                         |
| `status`          | pending, applied, failed, cancelled |
| `error_message`   | 실패 사유                               |
| `applied_at`      | 적용 완료 시각                            |

비즈니스 규칙:

* 액션은 먼저 `pending`으로 생성된다.
* 실제 적용 성공 시 `applied`로 변경한다.
* 실패 시 `failed`와 `error_message`를 저장한다.

---

## 9. ai_assistant_agent_runs

멀티 에이전트 실행 로그를 저장한다.

주요 컬럼:

| Column              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `user_id`           | 실행 사용자                                           |
| `conversation_id`   | 연결된 채팅창                                          |
| `agent_key`         | router, writing, seo, music, research, thumbnail |
| `agent_name`        | 표시용 Agent 이름                                     |
| `input_summary`     | 입력 요약                                            |
| `output_summary`    | 출력 요약                                            |
| `model_provider`    | gemini, openai, claude 등                         |
| `model_name`        | 사용 모델명                                           |
| `prompt_tokens`     | 입력 토큰                                            |
| `completion_tokens` | 출력 토큰                                            |
| `total_tokens`      | 총 토큰                                             |
| `status`            | success, failed                                  |
| `error_message`     | 실패 사유                                            |

비즈니스 규칙:

* AI Assistant 응답 생성 시 사용된 Agent를 기록한다.
* 향후 비용 분석, 사용량 분석, Agent 성능 개선에 활용한다.

---

## 10. Relationships

| From                                      | To                              | Rule           |
| ----------------------------------------- | ------------------------------- | -------------- |
| `ai_assistant_user_settings.user_id`      | `auth.users.id`                 | cascade delete |
| `ai_assistant_folders.user_id`            | `auth.users.id`                 | cascade delete |
| `ai_assistant_conversations.user_id`      | `auth.users.id`                 | cascade delete |
| `ai_assistant_conversations.folder_id`    | `ai_assistant_folders.id`       | set null       |
| `ai_assistant_actions.conversation_id`    | `ai_assistant_conversations.id` | cascade delete |
| `ai_assistant_agent_runs.conversation_id` | `ai_assistant_conversations.id` | cascade delete |

---

## 11. Indexes

현재 SQL은 다음 조회 최적화를 위한 인덱스를 생성한다.

| Index                                         | Purpose          |
| --------------------------------------------- | ---------------- |
| `idx_ai_assistant_folders_user_id`            | 사용자별 폴더 조회       |
| `idx_ai_assistant_conversations_user_id`      | 사용자별 채팅창 조회      |
| `idx_ai_assistant_conversations_folder_id`    | 폴더별 채팅창 조회       |
| `idx_ai_assistant_conversations_updated_at`   | 최근 채팅 정렬         |
| `idx_ai_assistant_conversations_is_deleted`   | 삭제 제외 조회         |
| `idx_ai_assistant_actions_conversation_id`    | 채팅창별 액션 조회       |
| `idx_ai_assistant_agent_runs_conversation_id` | 채팅창별 Agent 로그 조회 |

---

## 12. RLS Policy

모든 주요 테이블은 RLS를 활성화한다.

기본 원칙:

* 사용자는 본인 데이터만 조회 가능하다.
* 사용자는 본인 데이터만 생성 가능하다.
* 사용자는 본인 데이터만 수정 가능하다.
* 사용자는 본인 데이터만 삭제 가능하다.
* `ai_assistant_plan_limits`는 로그인 사용자가 읽기만 가능하다.

RLS 적용 테이블:

* `ai_assistant_plan_limits`
* `ai_assistant_user_settings`
* `ai_assistant_folders`
* `ai_assistant_conversations`
* `ai_assistant_actions`
* `ai_assistant_agent_runs`

---

## 13. updated_at Trigger

다음 테이블은 업데이트 시 `updated_at`이 자동 갱신된다.

* `ai_assistant_plan_limits`
* `ai_assistant_user_settings`
* `ai_assistant_folders`
* `ai_assistant_conversations`

공통 함수:

```sql
update_ai_assistant_updated_at()
```

---

## 14. Future Expansion

향후 확장 예정:

* `context_summary` 자동 요약
* `search_text` 고도화
* 전문 검색 인덱스 추가
* 메시지 개별 검색 테이블 추가 가능
* 플랜별 Agent 기능 제한
* 파일 컨텍스트 연결
* Writing Studio 직접 적용
* Music Studio 직접 적용
* Research Studio 직접 적용
* Thumbnail Studio 직접 적용

대규모 검색이 필요해질 경우 다음과 같은 별도 테이블을 추가할 수 있다.

```txt
ai_assistant_conversation_search_index
ai_assistant_message_chunks
```

현재 단계에서는 `messages jsonb` 기반 저장 방식을 유지한다.

---

## 15. Executable SQL

실행 SQL은 별도 파일에 저장한다.

```txt
docs/database/sql/ai-assistant.sql
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
