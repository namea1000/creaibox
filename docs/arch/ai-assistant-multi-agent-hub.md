# AI Assistant Multi-Agent Hub Architecture

## 문서 정보

| 항목      | 내용                           |
| ------- | ---------------------------- |
| 문서명     | AI Assistant Multi-Agent Hub |
| 시스템     | CreAibox                     |
| 상태      | 구현 진행 중                      |
| 버전      | v1.0                         |
| 최종 업데이트 | 2026-06-11                   |

---

# 1. 개요

AI Assistant는 CreAibox 전체 스튜디오를 연결하는 중앙 멀티 에이전트 허브이다.

단순한 챗봇이 아니라 사용자가 현재 작업 중인 페이지, 콘텐츠, 프로젝트 상태를 이해하고 각 스튜디오 전용 AI Agent를 자동 호출하여 작업을 지원한다.

최종 목표는 Writing Studio, Research Studio, Music Studio, Image Studio, SEO Studio를 하나의 지능형 작업 환경으로 통합하는 것이다.

---

# 2. 핵심 목표

## 사용자의 현재 작업 이해

예시

Writing Studio

* 현재 제목
* 현재 본문
* 현재 키워드
* SEO 상태

Research Studio

* 현재 프로젝트
* 업로드 자료
* 추출 결과

Music Studio

* 현재 가사
* Suno Prompt
* 장르
* 분위기

Image Studio

* 현재 이미지
* 프롬프트
* 스타일

---

## 멀티 에이전트 자동 호출

사용자는 단순히 질문한다.

예시

```txt
이 글 SEO 점검해줘
```

AI Assistant 내부

```txt
Router Agent
↓
Writing Agent
SEO Agent
```

자동 호출

---

# 3. UI 구조

## 위치

별도 페이지 사용 안함

기존 설계

```txt
/studio/assistant
```

폐기

최종 구조

```txt
StudioTopbar
 ├─ Cre Note
 └─ AI Assistant
```

---

## 동작

```txt
AI Assistant 버튼 클릭
↓
우측 패널 오픈
↓
채팅 시작
```

---

# 4. 컴포넌트 구조

```txt
src/components/studio/widgets/

AiAssistantWidget.tsx

src/components/studio/widgets/ai-assistant/

AiAssistantPanel.tsx
AiAssistantSidebar.tsx
AiAssistantChatPanel.tsx
AiAssistantUsageMeter.tsx
AiAssistantMessageList.tsx
AiAssistantMessageBubble.tsx
AiAssistantInput.tsx
```

---

# 5. 레이아웃 구조

```txt
┌──────────────────────────────┐
│ StudioTopbar                 │
└──────────────────────────────┘

┌────────────┬─────────────────┐
│ Folder     │ Chat            │
│            │                 │
│ Chat List  │ Messages        │
│            │                 │
│            │ Input           │
└────────────┴─────────────────┘
```

---

# 6. 채팅 시스템

## 폴더

예시

```txt
기본
글쓰기
SEO
Research
Music
Thumbnail
```

사용자 생성 가능

---

## 채팅창

예시

```txt
글쓰기 채팅
SEO 채팅
Suno 채팅
Research 채팅
```

사용자 생성 가능

---

## 채팅창 정책

채팅창 = 프로젝트

사용자는 여러 채팅창을 만들 수 있다.

예시

```txt
글쓰기 채팅
SEO 전략 채팅
Research 채팅
Music 채팅
```

독립적으로 저장된다.

---

# 7. 저장 정책

## 중요 원칙

금지

```txt
메시지 1개
=
DB 1 Row
```

사용 안함

---

## 채택 구조

```txt
채팅창 1개
=
DB Row 1개
```

대화 내용은

```sql
messages jsonb
```

배열에 누적 저장

---

## 이유

장점

* Row 폭증 방지
* 관리 단순
* 비용 절감
* 검색 속도 향상

---

# 8. 채팅창 제한

기본 정책

```txt
Free
300,000자
```

도달 시

```txt
채팅창 종료
```

---

사용자 화면

```txt
이 채팅창은 최대 저장 글자수에 도달했습니다.

새 채팅창을 생성해 주세요.
```

---

# 9. 플랜별 정책

## Free

```txt
채팅창당
300,000자
```

---

## Pro

```txt
채팅창당
500,000자
```

---

## Enterprise

```txt
채팅창당
1,000,000자
```

---

# 10. DB 구조

## ai_assistant_folders

사용자 폴더

---

## ai_assistant_conversations

채팅창

주요 필드

```txt
id
user_id
folder_id
title
description
studio_type
plan_key

messages

total_chars
max_chars_limit

message_count
conversation_count

is_closed
is_archived
is_deleted
```

---

## ai_assistant_agent_runs

Agent 실행 로그

```txt
어떤 Agent
어떤 모델
무슨 작업
```

저장

---

## ai_assistant_actions

적용 액션

예시

```txt
제목 적용
본문 적용
SEO 적용
```

---

## ai_assistant_user_settings

사용자 설정

```txt
플랜
마지막 채팅
기본 설정
```

---

## ai_assistant_plan_limits

플랜 정책

```txt
Free
Pro
Enterprise
```

관리

---

# 11. API 구조

## Folder API

```txt
/api/ai-assistant/folders
```

기능

* 조회
* 생성
* 수정

---

## Conversation API

```txt
/api/ai-assistant/conversations
```

기능

* 목록
* 생성

---

## Conversation Detail

```txt
/api/ai-assistant/conversations/[id]
```

기능

* 조회
* 수정
* 삭제

---

## AI API

```txt
/api/ai-assistant
```

기능

```txt
질문
↓
AI 호출
↓
응답 저장
```

---

## Action API

```txt
/api/ai-assistant/actions
```

기능

```txt
AI 결과
↓
실제 적용
```

---

# 12. Agent 구조

## Router Agent

역할

```txt
질문 분석
```

---

## Writing Agent

역할

```txt
글쓰기
원고
제목
문장 개선
```

---

## SEO Agent

역할

```txt
SEO 점검
메타 설명
키워드
FAQ
```

---

## Music Agent

역할

```txt
가사
Suno Prompt
유튜브 최적화
```

---

## Research Agent

역할

```txt
자료 분석
요약
인사이트
```

---

## Thumbnail Agent

역할

```txt
썸네일 문구
이미지 프롬프트
```

---

# 13. 현재 구현 상태

완료

```txt
UI
DB 설계
API 설계
Gemini 연결
Agent 감지
Action 구조
채팅 저장 구조
```

---

진행 예정

```txt
실제 Context Builder
실제 Multi Agent
Agent 협업
자동 작업 실행
```

---

# 14. 향후 확장

## Context Builder

현재 페이지 자동 분석

예시

```txt
현재 제목
현재 본문
현재 프로젝트
현재 가사
```

자동 전달

---

## Workflow Agent

예시

```txt
블로그 작성해줘
```

자동 실행

```txt
Writing Agent
↓
SEO Agent
↓
Thumbnail Agent
↓
발행 준비
```

---

## Autonomous Mode

장기 목표

사용자가 요청하면

```txt
기획
작성
SEO
썸네일
발행 준비
```

까지 자동 수행하는 지능형 작업 환경 구축

---

# 15. 개발 원칙

AI Assistant는 단순 챗봇이 아니다.

CreAibox 전체 기능을 연결하는 중앙 지능형 운영 시스템이다.

모든 신규 Studio는 향후 AI Assistant와 연결 가능하도록 설계한다.

새로운 기능을 개발할 경우 반드시 다음 항목을 함께 검토한다.

* Context 제공 가능 여부
* Agent 연동 가능 여부
* Action 자동 적용 가능 여부
* AI Assistant 통합 가능 여부

```
```
