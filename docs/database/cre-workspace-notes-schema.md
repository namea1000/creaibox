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

| Table              | Purpose |
| ------------------ | ------- |
| studio_widgets     | 위젯 상태   |
| cre_note_folders   | 폴더      |
| cre_notes          | 메모      |
| cre_note_tags      | 태그      |
| cre_note_tag_links | 태그 연결   |

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

## 9. Tag System

테이블

```txt
cre_note_tags
cre_note_tag_links
```

관계

```txt
1 Note
 ↓
N Tags
```

예시

```txt
SEO
블로그
아이디어
업무
```

---

## 10. Search Strategy

검색 대상

```txt
title
excerpt
content
tags
```

향후 Full Text Search 확장 예정

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
