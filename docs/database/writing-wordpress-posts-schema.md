# Writing WordPress Posts Database Schema

## 1. Purpose

Writing WordPress Posts 데이터베이스는 CreAibox의 WordPress 발행 기능을 위한 저장소이다.

이 스키마는 다음 기능을 지원한다.

* WordPress 원고 저장
* 발행 대기 글 관리
* WordPress 게시글 동기화
* 카테고리 관리
* 태그 관리
* 대표 이미지 관리
* 사용자별 글 분리
* 발행 이력 추적

---

## 2. Core Storage Policy

Writing Studio에서 작성된 WordPress용 원고를 저장한다.

채택한 저장 방식

```txt
원고 1개 = DB Row 1개
```

목적

* 발행 전 임시 저장
* 발행 후 이력 보관
* WordPress ID 동기화
* 재발행 지원

---

## 3. Tables Overview

| Table                   | Purpose            |
| ----------------------- | ------------------ |
| writing_wordpress_posts | WordPress 발행 원고 저장 |

---

## 4. writing_wordpress_posts

WordPress 발행용 원고를 저장한다.

---

### 사용자 정보

| Column     | Description |
| ---------- | ----------- |
| user_email | 글 작성자 이메일   |

비즈니스 규칙

* 로그인 사용자 이메일과 연결된다.
* RLS 정책의 기준 컬럼이다.

---

### 게시글 정보

| Column  | Description |
| ------- | ----------- |
| title   | 게시글 제목      |
| content | 게시글 본문      |
| status  | 게시글 상태      |

상태 예시

```txt
draft
published
scheduled
trash
```

---

### WordPress 연동

| Column      | Description      |
| ----------- | ---------------- |
| wp_post_id  | WordPress 게시글 ID |
| wp_site_url | 연결된 WordPress 주소 |

목적

* 발행된 게시글 추적
* 수정 동기화
* 재발행 지원

---

### 분류 정보

| Column     | Description |
| ---------- | ----------- |
| categories | 카테고리 배열     |
| tags       | 태그 배열       |

예시

```json
[
  "AI",
  "SEO",
  "WordPress"
]
```

---

### 대표 이미지

| Column             | Description |
| ------------------ | ----------- |
| featured_image_url | 대표 이미지 URL  |

목적

* 썸네일 연동
* WordPress 대표 이미지 등록

---

## 5. Relationships

현재는 독립 구조를 사용한다.

사용자 연결은

```txt
user_email
```

기반으로 처리한다.

향후

```txt
profiles.id
auth.users.id
```

기반 연결 구조로 확장 가능하다.

---

## 6. RLS Policy

기본 원칙

사용자는 자신의 글만 접근 가능하다.

조회

```sql
auth.jwt() ->> 'email' = user_email
```

삽입

```sql
auth.role() = 'authenticated'
and (auth.jwt() ->> 'email') = user_email
```

수정

```sql
auth.jwt() ->> 'email' = user_email
```

삭제

```sql
auth.jwt() ->> 'email' = user_email
```

---

## 7. updated_at Trigger

수정 시 자동 갱신

함수

```sql
update_writing_wordpress_posts_updated_at()
```

목적

* 수정 이력 관리
* 최근 작업 정렬
* 관리자 통계

---

## 8. Indexes

현재 SQL은 다음 조회 최적화를 수행한다.

| Index                   | Purpose |
| ----------------------- | ------- |
| idx_wp_posts_user_email | 사용자별 조회 |
| idx_wp_posts_status     | 상태별 조회  |
| idx_wp_posts_created_at | 최신 글 정렬 |

---

## 9. Future Expansion

향후 확장 예정

* 다중 WordPress 사이트
* 예약 발행
* 자동 카테고리 추천
* 자동 태그 추천
* SEO 점수 저장
* Rank Math 연동
* Yoast 연동
* WordPress 수정 동기화
* WordPress 삭제 동기화

---

## 10. Related Documents

실행 SQL

```txt
docs/database/sql/writing-wordpress-posts.sql
```

관련 기능

```txt
Writing Studio
WordPress Publisher
SEO Generator
Thumbnail Generator
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
