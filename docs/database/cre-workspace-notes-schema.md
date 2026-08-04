# Cre Workspace Notes System Database Schema

## 1. Purpose

Cre Workspace Notes System은 CreAibox 전체 Studio에서 사용하는 통합 작업 공간(Workspace) 시스템이다.

처음에는 Cre Note 위젯으로 시작하지만, 장기적으로는 다음 기능을 모두 수용하도록 설계되었다.

* Cre Note
* Todo
* Quick Links
* AI Clipboard
* Prompt Library
* Workspace Bookmarks
* Studio Status
* Future Workspace Widgets

---

## 2. Core Architecture

CreAibox는 위젯 자체와 실제 데이터를 분리한다.

구조

```txt
Studio Widget
      ↓
Widget State

Actual Data
      ↓
Notes
Folders
Tags
```

즉

```txt
studio_widgets
      ↓
UI 상태

cre_notes
      ↓
실제 데이터
```

---

## 3. Tables Overview

| Table              | Purpose                      |
| ------------------ | ---------------------------- |
| studio_widgets     | 위젯 상태                        |
| cre_note_folders   | 폴더                           |
| cre_notes          | 메모                           |
| ~~cre_note_tags~~      | ~~태그~~ ← **2026-08-04 삭제** (미구현 상태 확인, 코드 참조 없음) |
| ~~cre_note_tag_links~~ | ~~태그 연결~~ ← **2026-08-04 삭제** |

---

## 4. studio_widgets

Workspace 위젯 설정 저장소

현재 사용

```txt
Cre Note
```

향후 확장

```txt
Todo
Quick Links
AI Clipboard
Prompt Library
```

---

### widget_type

예시

```txt
cre_note
todo
quick_links
ai_clipboard
studio_status
```

---

### position

예시

```json
{
  "side": "right",
  "width": 420
}
```

목적

* 위치 저장
* 폭 저장
* UI 상태 복원

---

## 5. Folder System

테이블

```txt
cre_note_folders
```

원칙

```txt
폴더 1개 = DB Row 1개
```

예시

```txt
기본
업무
아이디어
블로그
음악
```

---

## 6. Note System

테이블

```txt
cre_notes
```

원칙

```txt
노트 1개 = DB Row 1개
```

---

### note_type

예시

```txt
text
todo
prompt
clipboard
link
```

---

### source_app

예시

```txt
studio
writing
music
research
image
```

목적

어느 Studio에서 생성되었는지 기록

---

## 7. Favorite & Pin System

컬럼

```txt
is_favorite
is_pinned
```

목적

중요 노트 관리

---

## 8. Archive & Trash System

컬럼

```txt
is_archived
is_deleted
```

정책

```txt
삭제 = 실제 삭제 아님
```

Soft Delete 사용

---

## 9. ~~Tag System~~ (2026-08-04 삭제)

> ⚠️ `cre_note_tags` 및 `cre_note_tag_links` 테이블은 설계는 되어 있었으나
> 코드에서 단 한 줄도 참조되지 않는 미구현 상태임을 확인하고 **Supabase에서 DROP** 하였다.
>
> 태그 기능이 필요해질 경우 별도 재설계 후 추가한다.
> 현재는 **폴더로 분류 관리**하는 것으로 충분하다.

---

## 10. Search Strategy

검색 대상

```txt
title
excerpt
content
```

> 태그 테이블 삭제로 태그 검색은 현재 지원하지 않는다.

향후 Full Text Search 확장 예정

---

## 10-1. Known Bugs & Fixes

### 기본 폴더 무한 생성 버그 (2026-08-04 수정)

**원인**

`ensureDefaultFolder()`에서 `.maybeSingle()` 사용 시,
DB에 "기본" 폴더가 2개 이상 존재하면 `null`을 반환하고
다시 INSERT → 무한 증식 발생.

**수정**

```typescript
// 이전 (버그)
.eq("name", "기본").maybeSingle()

// 이후 (수정)
.eq("name", "기본")
.eq("is_archived", false)
.order("created_at", { ascending: true })
.limit(1)   // 중복이 있어도 가장 오래된 1개 반환
```

**DB 정리**

각 유저별 가장 오래된 "기본" 폴더 1개만 남기고
나머지는 `is_archived = true` 처리 후 DELETE 완료.

---

## 10-2. Performance Optimization

### content 지연 로드 (2026-08-04 적용)

**문제**

기존 `loadNotes()`가 `select("*")`로 전체 노트의 content(대용량 텍스트)를
한꺼번에 불러와 Supabase Egress 비용이 불필요하게 증가.

**해결책**

```typescript
// loadNotes(): content 제외한 메타데이터만 로드
select("id, user_id, folder_id, title, excerpt, is_favorite, is_pinned, is_archived, is_deleted, created_at, updated_at")

// selectNote(): 노트 선택 시에만 content 별도 fetch
// 한 번 로드된 content는 메모리에 캐시 → 재선택 시 재fetch 없음
supabase.from("cre_notes").select("content").eq("id", note.id).single()
```

**효과**

| 상황 | 이전 | 이후 |
| --- | --- | --- |
| 앱 로드 시 | 전체 content 로드 | 메타데이터만 (Egress ~90% 절감) |
| 노트 클릭 시 | 이미 로드됨 (낭비) | content 1개만 fetch ✅ |
| 재클릭 시 | - | 메모리 캐시 사용 (DB 요청 없음) ✅ |

---

## 11. Global Workspace Strategy

이 시스템은 CreAibox 전체 Studio가 공유한다.

### Writing Studio

* 아이디어 저장
* 원고 메모

### Music Studio

* 가사 메모
* 앨범 아이디어

### Research Studio

* 조사 메모
* 참고 자료

### AI Assistant

* 대화 메모
* 작업 기록

---

## 12. Future Widget Expansion

향후 추가 예정

### Todo

```txt
☑ Todo
```

업무 관리

---

### Quick Links

```txt
📌 Quick Links
```

자주 사용하는 링크

---

### AI Clipboard

```txt
📋 AI Clipboard
```

AI 결과 임시 저장

---

### Prompt Library

```txt
🧠 Prompt Library
```

프롬프트 저장

---

## 13. RLS Policy

기본 원칙

사용자는 자신의 Workspace 데이터만 접근 가능

모든 정책

```sql
auth.uid() = user_id
```

기반

---

## 14. Future Expansion

향후 확장 예정

### Workspace

* 멀티 위젯
* 드래그 앤 드롭
* 레이아웃 저장

### Collaboration

* 공유 노트
* 팀 노트
* 댓글

### AI Integration

* AI 요약
* AI 분류
* AI 태그 추천

### Knowledge Base

* 개인 위키
* 지식 그래프
* NotebookLM 스타일 연결

---

## 15. Related Documents

실행 SQL

```txt
docs/database/sql/cre-workspace-notes.sql
```

관련 기능

```txt
Cre Note
Todo
Quick Links
AI Clipboard
Prompt Library
Workspace System
AI Assistant
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.

---

## 16. Architecture Decision Records (ADR)

> 설계 과정에서 검토했으나 채택하지 않은 방식과 그 이유를 기록한다.
> 나중에 "왜 이렇게 설계했지?"라는 질문에 답하기 위한 참조 문서.

---

### ADR-01: 노트 저장 방식 - Row-per-note vs JSONB 블롭 (2026-08-04)

**질문**

> "사용자당 1개의 row만 만들고, 그 안에 모든 노트를 JSON으로 저장하면 안 되나?
> 노트당 텍스트 양이 많지 않을 것 같은데..."

**검토한 방식 (채택 안 함): JSONB 블롭 방식**

```json
// cre_notes 테이블: 사용자당 row 1개
{
  "user_id": "abc123",
  "data": [
    { "id": "1", "title": "노트1", "content": "..." },
    { "id": "2", "title": "노트2", "content": "..." }
  ]
}
```

**채택하지 않은 이유**

| 문제 | 상세 |
| --- | --- |
| ❌ 저장 시 전체 읽기→쓰기 | 노트 1글자 수정해도 전체 JSON 블롭 읽기+쓰기 → Egress 폭탄 |
| ❌ Race Condition | 탭 2개 동시 열면 나중에 저장한 쪽이 먼저 저장한 내용을 덮어씌움 |
| ❌ SQL 검색·정렬 불가 | `WHERE is_favorite = true ORDER BY updated_at` 불가 → JS에서 전체 파싱 필요 |
| ❌ 블롭 무한 성장 | 노트 100개×2KB=200KB, 노트 500개×2KB=1MB → 매 접속마다 전체 전송 |
| ❌ 개별 삭제 불가 | 1개 노트 삭제도 전체 읽기+수정+쓰기 필요 |

**저장 비용 비교**

```
노트 제목 1글자 수정 시

JSONB 블롭 방식:
  1. 전체 JSON 블롭 읽기 (예: 200KB)
  2. 메모리에서 해당 노트 찾아 수정
  3. 전체 JSON 블롭 다시 쓰기 (200KB)
  → 매 저장마다 400KB 이상 Egress

Row-per-note 방식 (현재):
  → UPDATE cre_notes SET title=? WHERE id=?
  → 수십 바이트만 이동
```

**Race Condition 시나리오**

```
탭A: 전체 JSON 읽음 (노트 50개)
탭B: 전체 JSON 읽음 (노트 50개)
탭A: 노트1 수정 → 전체 JSON 저장
탭B: 노트2 수정 → 전체 JSON 저장
→ 탭A가 저장한 노트1 수정 내용 사라짐 (데이터 손실)
```

**최종 결론: Row-per-note 방식 유지**

"Row 수를 줄이자"는 생각은 자연스럽지만,
**Row 수는 PostgreSQL 성능과 무관하다.**

`user_id` 인덱스가 있으면 100만 row 중에서도
내 데이터 50개를 즉시 찾는다. 나머지 999,950개는 읽지조차 않는다.

**올바른 최적화 방향은 Row 수 줄이기가 아니라:**

1. ✅ **불필요한 컬럼 제외** → `content` 지연 로드 (§10-2 참조, 이미 적용)
2. ✅ **인덱스 최적화** → `user_id` 인덱스
3. ✅ **Soft Delete** → 물리적 즉시 삭제 대신 `is_deleted` 플래그
4. ✅ **정기 정리** → 30일 이상 된 휴지통 노트 자동 삭제 (향후 Cron 예정)

---

### ADR-02: 폴더·노트 테이블 통합 가능 여부 (2026-08-04)

**질문**

> "폴더 테이블과 노트 테이블을 1개로 합칠 수 있지 않나?"

**채택하지 않은 이유**

두 테이블의 컬럼 구조가 완전히 다르다.
통합 시 폴더 row는 content/is_favorite/is_pinned가 항상 NULL,
노트 row는 color/icon/sort_order가 항상 NULL → NULL 폭발.

또한 `folder_id` FK로 데이터 무결성을 보장하는데
같은 테이블 내 self-reference는 복잡하고 불안정하다.

**결론: 2개 테이블 분리 유지 (표준 정규화 설계)**

---
