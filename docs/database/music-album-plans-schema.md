# Music Album Plans Database Schema

## 1. Purpose

Music Album Plans 데이터베이스는 CreAibox Music Studio의 앨범 기획 시스템이다.

Music Studio는 단순히 곡을 생성하는 도구가 아니라, 실제 음반 제작 프로세스처럼 **앨범 기획 → 곡 제작 → 앨범 제작 → 배포** 흐름을 지원하도록 설계되었다.

이 스키마는 다음 기능을 지원한다.

* 앨범 컨셉 기획
* 트랙 리스트 설계
* 타겟 청중 분석
* 보컬 방향 설정
* 사운드 방향 설정
* 커버 컨셉 기획
* 유튜브 브랜딩 기획
* 앨범 제작 로드맵 저장

---

## 2. Core Storage Policy

Music Studio의 제작 흐름

```txt
Album Plan
     ↓
Album
     ↓
Songs
     ↓
Cover
     ↓
Video
```

실제 DB 구조

```txt
music_album_plans
       ↓
music_albums
       ↓
music_lyrics_projects
```

---

## 3. Tables Overview

| Table                 | Purpose  |
| --------------------- | -------- |
| music_album_plans     | 앨범 기획 저장 |
| music_albums          | 실제 앨범 저장 |
| music_lyrics_projects | 개별 곡 저장  |

---

## 4. Album Planning System

원칙

```txt
앨범 기획 1개 = DB Row 1개
```

목적

* 앨범 방향성 결정
* 곡 제작 기준 제공
* 브랜딩 전략 저장
* 프로젝트 관리

---

## 5. Basic Information

| Column      | Description |
| ----------- | ----------- |
| title       | 앨범 기획명      |
| description | 기획 설명       |
| status      | 상태          |
| is_favorite | 즐겨찾기        |

---

### status

예시

```txt
saved
completed
archived
```

---

## 6. Music Direction

### genre

예시

```txt
EDM
POP
ROCK
HIPHOP
BALLAD
```

---

### mood

예시

```txt
Happy
Epic
Dark
Romantic
Workout
```

---

### concept

앨범 전체 컨셉

예시

```txt
미래도시를 배경으로 한 사이버 EDM 프로젝트
```

---

### target_audience

타겟 청중

예시

```txt
20~30대 EDM 팬
운동 플레이리스트 사용자
유튜브 음악 채널 구독자
```

---

## 7. Production Planning

### target_song_count

목표 곡 수

예시

```txt
5
10
15
20
```

---

### language

예시

```txt
Korean
English
Japanese
Mixed
```

---

### vocal_direction

보컬 방향

예시

```txt
여성 보컬
남성 보컬
듀엣
AI 보컬
```

---

### sound_direction

사운드 방향

예시

```txt
강한 베이스
감성 피아노
신스웨이브
오케스트라
```

---

## 8. Branding System

### cover_concept

앨범 커버 컨셉

예시

```txt
네온 사이버 시티
우주 테마
감성 일러스트
```

---

### youtube_concept

유튜브 채널 방향

예시

```txt
Lo-fi Channel
Workout Music
Epic Music
Study Music
```

---

## 9. Track Planning

### track_list

앨범 예정 곡 목록

예시

```json
[
  {
    "track": 1,
    "title": "Neon City"
  },
  {
    "track": 2,
    "title": "Cyber Dreams"
  }
]
```

---

### reference_keywords

참고 키워드

예시

```txt
Cyberpunk
Synthwave
Future Bass
Epic EDM
```

목적

* AI 생성 참고
* 브랜딩 방향성 유지
* 곡 일관성 유지

---

## 10. Album Relationship

컬럼

```txt
related_album_id
```

목적

기획과 실제 앨범 연결

관계

```txt
music_album_plans
        ↓
music_albums
```

---

### 삭제 정책

```txt
on delete set null
```

실제 앨범 삭제 시

```txt
기획은 유지
연결만 해제
```

---

## 11. Raw AI Results

컬럼

```txt
raw_result
```

목적

AI가 생성한 원본 기획안 저장

활용

* 재생성
* 버전 관리
* 비교 분석

---

## 12. Display ID System

컬럼

```txt
display_id
```

목적

사용자 친화 URL

예시

```txt
/music/plans/1
/music/plans/25
/music/plans/100
```

UUID 노출 방지

---

## 13. Indexes

| Index                                  | Purpose |
| -------------------------------------- | ------- |
| idx_music_album_plans_display_id       | URL 조회  |
| idx_music_album_plans_user_id          | 사용자 조회  |
| idx_music_album_plans_created_at       | 최신 정렬   |
| idx_music_album_plans_status           | 상태 조회   |
| idx_music_album_plans_favorite         | 즐겨찾기    |
| idx_music_album_plans_related_album_id | 앨범 연결   |

---

## 14. RLS Policy

기본 원칙

사용자는 자신의 앨범 기획만 접근 가능하다.

모든 정책

```sql
auth.uid() = user_id
```

기반

---

## 15. Future Expansion

향후 확장 예정

### AI Producer

* AI 앨범 프로듀서
* 자동 트랙 구성
* 자동 컨셉 설계

### Music Label

* 레이블 관리
* 프로젝트 관리
* 공동 작업

### Distribution

* Spotify 배포
* Apple Music 배포
* YouTube Music 배포

### Branding

* 아티스트 브랜드 관리
* 앨범 브랜드 전략
* 채널 브랜딩

### Analytics

* 앨범 성과 분석
* 트랙 성과 분석
* 유튜브 성과 분석

---

## 16. Related Documents

실행 SQL

```txt
docs/database/sql/music-album-plans.sql
```

관련 기능

```txt
Music Studio
Album Planner
Album Manager
Lyrics Generator
Cover Generator
Video Generator
AI Producer
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
