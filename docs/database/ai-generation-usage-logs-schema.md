# AI Generation Usage Logs Database Schema

## 1. Purpose

AI Generation Usage Logs는 CreAibox 전체 AI 사용량 추적 시스템이다.

이 데이터베이스는 플랫폼에서 발생하는 모든 AI 호출을 기록하며, 향후 사용량 제한, 통계, 과금, 비용 분석의 핵심 데이터 소스로 사용된다.

---

## 2. Supported Studios

지원 Studio

* Writing Studio
* Research Studio
* Image Studio
* Thumbnail Studio
* Music Studio
* Video Studio
* Reporter
* AI Assistant
* Tools

---

## 3. Core Tracking Policy

원칙

```txt
AI 요청 1회
↓
로그 1개 생성
```

---

## 4. Provider Tracking

| Column        | Purpose                   |
| ------------- | ------------------------- |
| provider_type | ai/image/music/video      |
| provider      | gemini/openai/claude/suno |
| model         | 실제 모델명                    |

예시

```txt
gemini-3-flash-preview
gpt-5
claude-sonnet
flux-pro
```

---

## 5. Studio Tracking

### studio_type

예시

```txt
writing
research
image
music
video
assistant
reporter
tools
```

---

### feature_type

예시

```txt
blog_generate
thumbnail_generate
seo_analysis

lyrics_generate
music_generate

video_prompt_generate

research_chat

assistant_chat
```

---

### output_type

예시

```txt
text
image
music
video
voice
report
```

---

## 6. Usage Counts

### image_count

이미지 생성 수

---

### song_count

음악 생성 수

---

### video_count

영상 생성 수

---

## 7. Token Tracking

| Column            | Purpose |
| ----------------- | ------- |
| prompt_tokens     | 입력 토큰   |
| completion_tokens | 출력 토큰   |
| total_tokens      | 전체 토큰   |

---

## 8. Cost Tracking

### estimated_cost

예상 비용

예시

```txt
0.0012
0.0231
0.1005
```

USD 기준

---

## 9. Plan Tracking

### plan_key

예시

```txt
free
pro
business
admin
```

---

### key_source

예시

```txt
system
user
```

설명

```txt
system
= CreAibox 공용 API

user
= 사용자가 API Vault에 등록한 API
```

---

## 10. Source Tracking

### source_type

예시

```txt
writing_creaibox_posts
writing_naver_posts

music_lyrics_projects

generated_images

research_projects

ai_assistant_conversations
```

---

### source_id

연결된 원본 데이터 ID

---

## 11. Analytics Dashboard

향후 구현

* 오늘 사용량
* 주간 사용량
* 월간 사용량
* Studio별 사용량
* Provider별 사용량
* 비용 분석
* 실패율 분석

---

## 12. Billing System

향후 사용

### Free

일 사용량 제한

### Pro

월 사용량 제한

### Business

토큰 기반 과금

### Enterprise

사용량 기반 계약

---

## 13. Future Expansion

추가 예정

* Credits
* Monthly Quotas
* Team Billing
* Workspace Billing
* Token Forecast
* Cost Forecast

---

## 14. Related Documents

실행 SQL

docs/database/sql/ai-generation-usage-logs.sql

관련 기능

* AI Assistant
* Writing Studio
* Research Studio
* Music Studio
* Image Studio
* Video Studio
* API Vault
* Billing System
* Analytics Dashboard

이 테이블은 CreAibox 전체 운영 데이터의 핵심 통합 로그 저장소이다.
