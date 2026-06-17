# Writing CreAibox Posts Database Schema

## 1. Purpose

Writing CreAibox Posts 데이터베이스는 CreAibox의 자체 블로그 콘텐츠 저장소이다.

이 스키마는 다음 기능을 지원한다.

* AI 콘텐츠 생성
* SEO 최적화 글쓰기
* 자체 블로그 발행
* 사이트맵 자동 생성
* 검색엔진 색인
* 발행 상태 관리
* SEO 데이터 저장
* 향후 광고 수익형 콘텐츠 관리

---

## 2. Core Storage Policy

CreAibox 자체 블로그 원고를 저장한다.

채택한 저장 방식

```txt
원고 1개 = DB Row 1개
```

목적

* 원고 저장
* 발행 관리
* SEO 관리
* 블로그 서비스 운영

---

## 3. Tables Overview

| Table                  | Purpose            |
| ---------------------- | ------------------ |
| writing_creaibox_posts | CreAibox 블로그 원고 저장 |

---

## 4. Content Structure

### 기본 콘텐츠

| Column         | Description |
| -------------- | ----------- |
| title          | 제목          |
| content        | 본문          |
| target_keyword | 목표 키워드      |
| selected_tone  | 선택 말투       |
| post_type      | 콘텐츠 유형      |
| status         | 게시 상태       |

---

### post_type

예시

```txt
AI 인사이트 포스팅
뉴스형
전문 가이드형
애드센스 수익형
SEO 최적화형
```

---

### status

예시

```txt
saved
published
trash
```

---

## 5. SEO Structure

SEO 최적화를 위한 핵심 데이터 저장

| Column           | Description |
| ---------------- | ----------- |
| slug             | URL 주소      |
| meta_description | 메타 설명       |
| focus_keyword    | 핵심 키워드      |
| canonical_url    | 대표 URL      |
| seo_tags         | SEO 태그 배열   |
| category_id      | 카테고리 ID (UUID) |
| toc_enabled      | 자동 목차 활성화 여부 (BOOLEAN) |

---

### slug

예시

```txt
seo-guide-2026
best-ai-tools
gemini-vs-chatgpt
```

블로그 URL

```txt
https://creaibox.com/blog/[slug]
```

생성에 사용된다.

---

### seo_tags

예시

```json
[
  "SEO",
  "AI",
  "블로그"
]
```

---

## 6. Publishing System

발행 흐름

```txt
작성
↓
saved
↓
발행
↓
published
↓
사이트맵 반영
↓
구글 색인
```

---

### published 상태

발행된 글만 공개된다.

사이트맵 생성 시 사용

```sql
select slug, updated_at
from writing_creaibox_posts
where status = 'published'
```

---

## 7. Display ID System

컬럼

```txt
display_id
```

목적

사용자 친화 URL

예시

```txt
/list/1
/list/2
/list/3
```

UUID 노출 방지

예시

```txt
❌ /list/ef5d2e71-7f...
✅ /list/152
```

---

## 8. Search Settings

컬럼

```txt
word_count_goal
use_search
```

---

### word_count_goal

예시

```txt
3000
5000
8000
10000
```

---

### use_search

목적

AI 생성 시 외부 검색 사용 여부

예시

```txt
true
false
```

---

## 9. Source Mode

작성 방식 구분 컬럼

| Column      | Description |
| ----------- | ----------- |
| source_mode | 원고 작성 방식   |

---

### source_mode

AI 생성을 통해 만들어졌는지, 혹은 사용자가 직접 수기로 작성했는지 구분하는 모드 필드이다.

예시

```txt
url     (URL 재창조)
text    (텍스트 재창조)
direct  (수기 직접 글쓰기)
```

---

## 10. Relationships

| From    | To            | Rule           |
| ------- | ------------- | -------------- |
| user_id | auth.users.id | cascade delete |

회원 삭제 시 원고도 자동 삭제된다.

---

## 11. Indexes

| Index                                 | Purpose    |
| ------------------------------------- | ---------- |
| idx_writing_creaibox_posts_user_id    | 사용자 조회     |
| idx_writing_creaibox_posts_display_id | URL 조회     |
| idx_writing_creaibox_posts_status     | 발행 상태 조회   |
| idx_writing_creaibox_posts_slug       | SEO URL 조회 |
| idx_writing_creaibox_posts_updated_at | 최신 글 정렬    |

---

## 12. RLS Policy

기본 원칙

사용자는 자신의 원고만 접근 가능하다.

조회

```sql
auth.uid() = user_id
```

생성

```sql
auth.uid() = user_id
```

수정

```sql
auth.uid() = user_id
```

삭제

```sql
auth.uid() = user_id
```

---

## 13. updated_at Trigger

수정 시 자동 갱신

함수

```sql
set_updated_at()
```

목적

* 수정 이력 관리
* 최근 작업 정렬
* 사이트맵 갱신

---

## 14. Sitemap Integration

CreAibox Blog는 이 테이블을 기반으로 사이트맵을 생성한다.

현재 구조

```sql
select slug, updated_at
from writing_creaibox_posts
where status = 'published'
```

결과

```txt
https://creaibox.com/blog/[slug]
```

자동 등록

---

## 15. Future Expansion

향후 확장 예정

* 자동 인덱싱 API
* SEO 점수 저장
* 구조화 데이터 저장
* 스키마 마크업 저장
* 썸네일 메타데이터 저장
* 내부 링크 분석
* 콘텐츠 점수 시스템
* 광고 수익 분석

---

## 16. Related Documents

실행 SQL

```txt
docs/database/sql/writing-creaibox-posts.sql
```

관련 기능

```txt
Writing Studio
CreAibox Blog
SEO Analyzer
Blog Publisher
Sitemap Generator
Google Indexing
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
