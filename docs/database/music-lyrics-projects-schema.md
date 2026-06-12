# Music Studio Database Schema

## 1. Purpose

Music Studio 데이터베이스는 CreAibox의 AI 음악 제작 시스템 저장소이다.

이 스키마는 다음 기능을 지원한다.

* AI 가사 생성
* Suno 프롬프트 생성
* 앨범 관리
* 플레이리스트 관리
* 유튜브 최적화
* 커버 이미지 생성
* 영상 프롬프트 생성
* 번역 가사 저장
* 멀티 곡 생성

---

## 2. Core Storage Policy

Music Studio는 2단계 구조를 사용한다.

```txt
생성 요청 1개
↓
music_generation_batches

곡 N개
↓
music_lyrics_projects
```

예시

```txt
사용자 요청
"EDM 스타일로 5곡 생성"

↓

batch 1개 생성

↓

song 5개 생성
```

---

## 3. Tables Overview

| Table                    | Purpose  |
| ------------------------ | -------- |
| music_generation_batches | 생성 요청 저장 |
| music_lyrics_projects    | 개별 곡 저장  |

---

## 4. music_generation_batches

AI 생성 요청 자체를 저장한다.

### 목적

* 생성 이력 관리
* 요청 복원
* 재생성
* 비용 분석

---

### 저장 정보

| Column              | Description |
| ------------------- | ----------- |
| theme               | 음악 주제       |
| genre               | 장르          |
| mood                | 분위기         |
| vocal               | 보컬 스타일      |
| tempo               | 템포          |
| instrument          | 악기          |
| language            | 언어          |
| structure           | 곡 구조        |
| concept_description | 컨셉 설명       |
| generation_count    | 생성 곡 수      |

---

## 5. music_lyrics_projects

실제 곡 데이터를 저장한다.

원칙

```txt
곡 1개 = DB Row 1개
```

---

### 기본 정보

| Column              | Description |
| ------------------- | ----------- |
| title               | 곡 제목        |
| lyrics              | 가사          |
| translated_lyrics   | 번역 가사       |
| theme               | 곡 주제        |
| concept_description | 곡 설명        |

---

### Suno

| Column      | Description  |
| ----------- | ------------ |
| suno_prompt | Suno 입력 프롬프트 |
| source_mode | 생성 방식        |

예시

```txt
lyrics_suno
manual
```

---

## 6. Music Metadata

| Column     | Description |
| ---------- | ----------- |
| genre      | 장르          |
| mood       | 분위기         |
| vocal      | 보컬          |
| tempo      | 템포          |
| instrument | 악기          |
| language   | 언어          |
| structure  | 곡 구조        |

---

## 7. YouTube Optimization

유튜브 업로드 최적화 저장

### youtube_titles

예시

```json
[
  "Best EDM Music 2026",
  "Epic EDM Workout Mix"
]
```

---

### youtube_description

유튜브 설명

---

### hashtags

예시

```json
[
  "#edm",
  "#music",
  "#workout"
]
```

---

## 8. Cover & Video Generation

### cover_prompt

커버 이미지 생성용

---

### video_prompt

뮤직비디오 생성용

---

## 9. Album System

### album_name

앨범명

예시

```txt
Summer EDM Collection
```

---

### playlist_group

플레이리스트 그룹

예시

```txt
Workout
Driving
Chill
Study
```

---

## 10. Favorite System

컬럼

```txt
is_favorite
```

목적

즐겨찾기

---

## 11. Relationships

```txt
music_generation_batches
       │
       ▼
music_lyrics_projects
```

관계

```txt
1 Batch
↓
N Songs
```

---

## 12. Display ID System

사용자 URL

예시

```txt
/music/list/1
/music/list/25
```

UUID 노출 방지

---

## 13. RLS Policy

기본 원칙

사용자는 자신의 곡만 접근 가능하다.

모든 정책

```sql
auth.uid() = user_id
```

기반

---

## 14. updated_at Trigger

자동 갱신

함수

```sql
set_updated_at()
```

목적

* 최근 작업 정렬
* 수정 이력 관리
* 라이브러리 관리

---

## 15. Future Expansion

향후 확장 예정

* Suno API 연동
* 앨범 관리
* 플레이리스트 시스템
* 음원 파일 저장
* 커버 이미지 저장
* 영상 생성 저장
* Spotify 연동
* Apple Music 연동
* 음원 판매 시스템
* 저작권 관리

---

## 16. Related Documents

실행 SQL

```txt
docs/database/sql/music-lyrics-projects.sql
```

관련 기능

```txt
Music Studio
Lyrics Generator
Suno Prompt Generator
Cover Generator
Video Generator
YouTube Optimizer
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
