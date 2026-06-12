# Music Albums Database Schema

## 1. Purpose

Music Albums 데이터베이스는 CreAibox Music Studio의 앨범 관리 시스템이다.

Music Studio는 단순히 곡 1개를 생성하는 구조가 아니라, 여러 곡을 하나의 앨범으로 묶어 관리하는 구조를 목표로 한다.

이 스키마는 다음 기능을 지원한다.

* 음악 앨범 생성
* 앨범별 곡 관리
* 플레이리스트 관리
* 커버 이미지 관리
* 장르별 분류
* 분위기별 분류
* 즐겨찾기 관리
* 향후 음원 발매 시스템

---

## 2. Core Storage Policy

Music Studio는 다음 구조를 사용한다.

```txt
Batch
 ↓
Songs
 ↓
Albums
```

실제 관계

```txt
music_generation_batches
        ↓
music_lyrics_projects
        ↓
music_albums
```

---

## 3. Tables Overview

| Table                 | Purpose    |
| --------------------- | ---------- |
| music_albums          | 음악 앨범 저장   |
| music_lyrics_projects | 앨범 소속 곡 저장 |

---

## 4. Album System

원칙

```txt
앨범 1개 = DB Row 1개
```

목적

* 곡 그룹화
* 플레이리스트 구성
* 커버 이미지 관리
* 앨범 단위 공개

---

### 저장 정보

| Column          | Description |
| --------------- | ----------- |
| title           | 앨범명         |
| description     | 앨범 설명       |
| genre           | 대표 장르       |
| mood            | 대표 분위기      |
| cover_image_url | 앨범 커버       |
| status          | 상태          |
| is_favorite     | 즐겨찾기        |

---

## 5. Album Cover System

컬럼

```txt
cover_image_url
```

목적

앨범 대표 이미지

활용 예정

* AI 커버 생성
* 이미지 업로드
* 썸네일 생성
* 앨범 목록 표시

---

## 6. Album Classification

### genre

예시

```txt
EDM
POP
ROCK
HIPHOP
BALLAD
JAZZ
```

---

### mood

예시

```txt
Happy
Sad
Epic
Romantic
Workout
Chill
```

---

## 7. Song Relationship

컬럼

```txt
album_id
album_name
```

목적

곡과 앨범 연결

관계

```txt
1 Album
   ↓
N Songs
```

---

### album_id

실제 연결 키

```txt
music_albums.id
```

---

### album_name

조회 성능 및 UI 편의용

---

## 8. Favorite System

컬럼

```txt
is_favorite
```

목적

사용자 즐겨찾기

활용

* 즐겨찾기 목록
* 빠른 접근
* 추천 앨범

---

## 9. Status System

컬럼

```txt
status
```

예시

```txt
saved
published
archived
```

---

### saved

작성 중

---

### published

공개 상태

---

### archived

보관 상태

---

## 10. Display ID System

컬럼

```txt
display_id
```

목적

사용자 친화 URL

예시

```txt
/music/albums/1
/music/albums/25
/music/albums/100
```

UUID 노출 방지

---

## 11. Relationships

```txt
music_albums
      ↓
music_lyrics_projects
```

관계

```txt
1 Album
↓
N Songs
```

삭제 정책

```txt
on delete set null
```

앨범 삭제 시

```txt
곡은 유지
album_id만 제거
```

---

## 12. Indexes

| Index                              | Purpose |
| ---------------------------------- | ------- |
| idx_music_albums_display_id        | URL 조회  |
| idx_music_albums_user_id           | 사용자 조회  |
| idx_music_albums_created_at        | 최신 정렬   |
| idx_music_albums_status            | 상태 조회   |
| idx_music_albums_favorite          | 즐겨찾기    |
| idx_music_lyrics_projects_album_id | 앨범 곡 조회 |

---

## 13. RLS Policy

기본 원칙

사용자는 자신의 앨범만 접근 가능하다.

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
set_music_albums_updated_at()
```

목적

* 최근 수정 정렬
* 관리자 통계
* 앨범 관리

---

## 15. Future Expansion

향후 확장 예정

### Album Publishing

* 앨범 공개
* 앨범 공유 링크
* 공개 플레이리스트

### Cover Studio

* AI 커버 생성
* 커버 버전 관리
* 커버 히스토리

### Music Distribution

* Spotify
* Apple Music
* YouTube Music

### Store

* 음원 판매
* 앨범 판매
* 다운로드 판매

### Rights

* 저작권 관리
* 라이선스 관리
* 공동 작업자 관리

---

## 16. Related Documents

실행 SQL

```txt
docs/database/sql/music-albums.sql
```

관련 기능

```txt
Music Studio
Album Manager
Playlist Manager
Cover Generator
Music Distribution
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
