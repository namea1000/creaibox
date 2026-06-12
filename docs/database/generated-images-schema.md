# Generated Images Database Schema

## 1. Purpose

Generated Images 데이터베이스는 CreAibox의 통합 이미지 라이브러리 시스템이다.

모든 Studio에서 생성된 이미지를 하나의 저장소에서 관리하기 위해 설계되었다.

이 스키마는 다음 기능을 지원한다.

* AI 이미지 생성
* 썸네일 저장
* 커버 이미지 저장
* 대표 이미지 지정
* 이미지 라이브러리
* 게시물 연결
* 프로젝트 연결
* 이미지 재사용

---

## 2. Core Storage Policy

CreAibox는 이미지를 개별 Studio마다 저장하지 않는다.

모든 이미지는 중앙 저장소를 사용한다.

구조

```txt
Storage Bucket
      ↓
generated-images

Database
      ↓
generated_images
```

---

## 3. Storage Structure

Supabase Storage

```txt
generated-images
```

버킷 사용

예시

```txt
generated-images/

├─ user-1/
│   ├─ image1.webp
│   ├─ image2.webp
│
├─ user-2/
│   ├─ image3.webp
│
└─ user-3/
```

---

## 4. Tables Overview

| Table            | Purpose   |
| ---------------- | --------- |
| generated_images | 생성 이미지 저장 |

---

## 5. Image Storage System

원칙

```txt
이미지 1개 = DB Row 1개
```

저장 정보

| Column       | Description |
| ------------ | ----------- |
| prompt       | 생성 프롬프트     |
| image_url    | 이미지 주소      |
| style        | 스타일         |
| aspect_ratio | 비율          |
| provider     | 생성 엔진       |

---

### provider

예시

```txt
gemini
openai
flux
pollinations
stability
```

---

### aspect_ratio

예시

```txt
1:1
3:2
16:9
9:16
4:5
```

---

## 6. Image Linking System

이미지는 특정 콘텐츠와 연결될 수 있다.

컬럼

```txt
source_type
source_id
```

---

### source_type

예시

```txt
writing_creaibox_posts
writing_naver_posts
music_albums
music_album_plans
research_projects
```

---

### source_id

연결된 콘텐츠 ID

예시

```txt
uuid
display_id
```

---

## 7. Image Role System

컬럼

```txt
image_role
```

목적

이미지 역할 구분

예시

```txt
thumbnail
cover
hero
gallery
generated
profile
```

---

### thumbnail

블로그 썸네일

---

### cover

앨범 커버

---

### hero

대표 배너

---

### gallery

본문 이미지

---

## 8. Primary Image System

컬럼

```txt
is_primary
```

목적

대표 이미지 지정

예시

```txt
게시물 이미지 20개
      ↓
대표 이미지 1개
```

---

### 제약 조건

동일 콘텐츠

```txt
user_id
source_type
source_id
image_role
```

조합에서는

```txt
대표 이미지 1개만 허용
```

---

## 9. Storage Security

Storage Bucket

```txt
generated-images
```

사용

정책

```txt
사용자 폴더만 접근
```

예시

```txt
user-a
  └ 접근 가능

user-b
  └ 접근 불가
```

---

## 10. RLS Policy

기본 원칙

사용자는 자신의 이미지만 접근 가능

모든 정책

```sql
auth.uid() = user_id
```

기반

---

## 11. Cross Studio Strategy

이 테이블은 CreAibox 전체 Studio가 공유한다.

사용 예정

### Writing Studio

* 블로그 썸네일
* 본문 이미지

### Music Studio

* 앨범 커버
* 플레이리스트 커버

### Research Studio

* 리포트 이미지
* 자료 이미지

### Future Studios

* Video Studio
* Poster Studio
* Design Studio

---

## 12. Performance Strategy

주요 조회 패턴

```txt
사용자 이미지 조회
콘텐츠 대표 이미지 조회
최신 이미지 조회
```

이를 위해

```txt
generated_images_source_idx
generated_images_one_primary_per_source_idx
```

사용

---

## 13. Future Expansion

향후 확장 예정

### Media Library

* 통합 미디어 라이브러리
* 이미지 검색
* 태그 검색

### AI Features

* 이미지 분석
* 이미지 재생성
* 이미지 업스케일

### CDN

* WebP 자동 변환
* 이미지 최적화
* CDN 캐싱

### Asset Management

* 버전 관리
* 폴더 관리
* 공유 기능

---

## 14. Related Documents

실행 SQL

```txt
docs/database/sql/generated-images.sql
```

관련 기능

```txt
Image Studio
Thumbnail Generator
Media Library
Album Cover Generator
Research Studio
Poster Studio
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
