# Writing Naver Posts Database Schema

## 1. Purpose

Writing Naver Posts 데이터베이스는 CreAibox의 네이버 블로그 전용 원고 저장소이다.

이 스키마는 다음 기능을 지원한다.

* AI 스마트 글쓰기
* AI 글 재창조
* 네이버 블로그 원고 저장
* 카테고리 관리
* 태그 관리
* 키워드 관리
* 재작성 정보 저장
* 발행 상태 관리

---

## 2. Core Storage Policy

네이버 블로그용 원고를 저장한다.

채택한 저장 방식

원고 1개 = DB Row 1개

목적

* 작성 중 원고 저장
* 발행 전 관리
* 재창조 원고 저장
* 발행 이력 관리

---

## 3. Tables Overview

| Table               | Purpose       |
| ------------------- | ------------- |
| writing_naver_posts | 네이버 블로그 원고 저장 |

---

## 4. Smart Writing & Recreate Policy

CreAibox는 네이버 글쓰기를 하나의 테이블로 통합 관리한다.

구분 컬럼

```txt
post_type
```

값

```txt
smart
recreate
```

---

### smart

AI 스마트 글쓰기

예시

```txt
키워드 입력
↓
AI 생성
↓
원고 저장
```

---

### recreate

AI 글 재창조

예시

```txt
URL 입력
또는

원문 입력
↓
AI 재작성
↓
원고 저장
```

---

## 5. User Information

| Column        | Description |
| ------------- | ----------- |
| user_id       | 작성자 ID      |
| user_email    | 작성자 이메일     |
| user_nicename | 작성자 닉네임     |

RLS 기준 컬럼

```txt
user_id
```

---

## 6. Content Information

| Column         | Description |
| -------------- | ----------- |
| title          | 제목          |
| content        | 본문          |
| target_keyword | 목표 키워드      |

목적

* SEO 최적화
* 키워드 관리
* 검색 기능

---

## 7. Categories & Tags

### categories

글 유형 분류

예시

```txt
IT
SEO
마케팅
AI
```

---

### tags

세부 속성

예시

```txt
친근한말투
전문가톤
8000자
애드센스형
```

---

## 8. Recreate Information

재창조 기능 전용 컬럼

| Column           | Description |
| ---------------- | ----------- |
| source_url       | 원문 URL      |
| source_text      | 원문 텍스트      |
| rewrite_strategy | 재작성 전략      |
| source_mode      | URL 또는 TEXT |
| selected_tone    | 선택 말투       |
| word_count_goal  | 목표 글자수      |

---

### source_mode

예시

```txt
url
text
```

---

### rewrite_strategy

예시

```txt
paraphrase
seo
expert
summary
expand
```

---

## 9. Status Management

컬럼

```txt
status
```

값

```txt
draft
saved
published
```

---

### draft

작성 중

---

### saved

저장 완료

---

### published

발행 완료

---

## 10. Relationships

| From    | To            | Rule           |
| ------- | ------------- | -------------- |
| user_id | auth.users.id | cascade delete |

회원 삭제 시 원고도 삭제된다.

---

## 11. Indexes

| Index                                      | Purpose |
| ------------------------------------------ | ------- |
| idx_naver_posts_user_id                    | 사용자 조회  |
| idx_naver_posts_user_email                 | 이메일 조회  |
| idx_naver_posts_post_type                  | 글 유형 조회 |
| idx_writing_naver_posts_user_id_updated_at | 최신 글 조회 |
| idx_writing_naver_posts_target_keyword     | 키워드 검색  |

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
update_writing_naver_posts_updated_at()
```

목적

* 수정 이력 관리
* 최근 작업 정렬
* 관리자 통계

---

## 14. Future Expansion

향후 확장 예정

* 네이버 자동 발행
* 네이버 API 연동
* SEO 점수 저장
* 썸네일 생성 결과 저장
* 스키마 데이터 저장
* 자동 목차 저장
* AI 분석 결과 저장
* 네이버 검색 순위 추적

---

## 15. Related Documents

실행 SQL

```txt
docs/database/sql/writing-naver-posts.sql
```

관련 기능

```txt
Writing Studio
Naver Writing
AI Smart Writing
AI Recreate Writing
SEO Analyzer
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
