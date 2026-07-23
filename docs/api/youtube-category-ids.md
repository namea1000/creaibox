# YouTube Data API v3 비디오 카테고리 ID (Video Category IDs) 명세서

이 문서는 **유튜브 공식 Data API v3 (`videoCategories` 리소스)**의 전체 비디오 카테고리 ID(Category ID) 매핑과, **크리에이박스(CreAibox) 시스템 내부 12개 통합 표준 카테고리**와의 연동 매핑 명세를 정의합니다.

---

## 1. 개요 및 설계 원칙

* **API Endpoints**: `https://www.googleapis.com/youtube/v3/videoCategories`
* **요청 매개변수**: `part=snippet&regionCode=KR`
* **중복 할당 해소**: 유튜브 API 원본 카테고리 ID 중 일부(`24`, `26`, `25`, `28` 등)는 세부 서브 장르(예: 엔터테인먼트 vs 키즈 vs TV/방송)가 동일한 API ID를 고유값으로 사용합니다.
* **CreAibox 통폐합 규격**: UI/UX 상에서 카테고리 선택 시 2~3개 버튼이 다중 동시 활성화되는 버그를 방지하기 위해 **12개 고유 1:1 매핑 통합 카테고리 시스템**을 구축했습니다.

---

## 2. 크리에이박스(CreAibox) 12개 통합 카테고리 1:1 매핑표

| CreAibox 통합 카테고리 | YouTube API ID | 영문 명칭 (API Standard) | 포함 세부 분야 & 키워드 |
|---|---|---|---|
| **전체** | `all` | All Categories | 전체 카테고리 트렌드 수집 |
| **음악/댄스/가수** | `10` | Music | 공식 MV, K-POP, 댄스, 커버, 가요 |
| **게임** | `20` | Gaming | 게임 공략, 실황, e스포츠, 모바일 게임 |
| **엔터테인먼트/방송** | `24` | Entertainment | 예능, TV방송, BJ/연예인, 코미디, 키즈 |
| **영화/만화/애니** | `1` | Film & Animation | 영화 예고편, 리뷰, 애니메이션, 단편 |
| **음식/요리/뷰티** | `26` | Howto & Style | 요리, 레시피, 먹방, 뷰티, 패션, DIY |
| **뉴스/정치/경제** | `25` | News & Politics | 시사 뉴스, 정치, 주식, 재테크, 부동산 |
| **취미/여행/일상** | `22` | People & Blogs | 일상 브이로그, 여행, 취미, 라이프스타일 |
| **IT/기술/컴퓨터** | `28` | Science & Technology | IT 테크 리뷰, 컴퓨터, 전자기기, 오피셜 |
| **교육/강의** | `27` | Education | 강연, 지식, 튜토리얼, 자격증, 강의 |
| **애완/반려동물** | `15` | Pets & Animals | 강아지, 고양이, 펫 스타일링, 동물 |
| **스포츠/운동** | `17` | Sports | 축구, 야구, 골프, 피트니스, 스포츠 하이라이트 |
| **자동차** | `2` | Autos & Vehicles | 시승기, 신차 리뷰, 자동차, 오토바이 |

---

## 3. 유튜브 Data API v3 전체 Video Category ID 명세

| Category ID | Category Name (English) | 한국어 공식 명칭 | CreAibox 매핑 규격 | 비고 (Status / Usage) |
|---|---|---|---|---|
| `1` | Film & Animation | 영화 및 애니메이션 | **영화/만화/애니** | 활성 (Active) |
| `2` | Autos & Vehicles | 자동차 및 차량 | **자동차** | 활성 (Active) |
| `10` | Music | 음악 | **음악/댄스/가수** | 활성 (Active) |
| `15` | Pets & Animals | 애완동물 및 동물 | **애완/반려동물** | 활성 (Active) |
| `17` | Sports | 스포츠 | **스포츠/운동** | 활성 (Active) |
| `18` | Short Movies | 단편 영화 | *영화/만화/애니* | 비활성 (Legacy ID) |
| `19` | Travel & Events | 여행 및 이벤트 | *취미/여행/일상* | 활성 (Active) |
| `20` | Gaming | 게임 | **게임** | 활성 (Active) |
| `21` | Videoblogging | 비디오 블로그 | *취미/여행/일상* | 비활성 (Legacy ID) |
| `22` | People & Blogs | 인물 및 블로그 | **취미/여행/일상** | 활성 (Active) |
| `23` | Comedy | 코미디 | *엔터테인먼트/방송* | 활성 (Active) |
| `24` | Entertainment | 엔터테인먼트 | **엔터테인먼트/방송** | 활성 (Active) |
| `25` | News & Politics | 뉴스 및 정치 | **뉴스/정치/경제** | 활성 (Active) |
| `26` | Howto & Style | 노하우 및 스타일 | **음식/요리/뷰티** | 활성 (Active) |
| `27` | Education | 교육 | **교육/강의** | 활성 (Active) |
| `28` | Science & Technology | 과학기술 | **IT/기술/컴퓨터** | 활성 (Active) |
| `29` | Nonprofits & Activism | 비영리 및 사회운동 | *뉴스/정치/경제* | 활성 (Active) |
| `30` | Movies | 영화 | *영화/만화/애니* | YouTube Movies 전용 |
| `31` | Anime/Animation | 애니메이션 | *영화/만화/애니* | YouTube 전용 |
| `32` | Action/Adventure | 액션/아카데미 | *영화/만화/애니* | YouTube 전용 |
| `33` | Classics | 고전 | *영화/만화/애니* | YouTube 전용 |
| `34` | Comedy | 코미디 영화 | *엔터테인먼트/방송* | YouTube 전용 |
| `35` | Documentary | 다큐멘터리 | *뉴스/정치/경제* | YouTube 전용 |
| `36` | Drama | 드라마 | *엔터테인먼트/방송* | YouTube 전용 |
| `37` | Family | 패밀리 | *엔터테인먼트/방송* | YouTube 전용 |
| `38` | Foreign | 외국 영화 | *영화/만화/애니* | YouTube 전용 |
| `39` | Horror | 공포 영화 | *영화/만화/애니* | YouTube 전용 |
| `40` | Sci-Fi/Fantasy | SF/판타지 | *영화/만화/애니* | YouTube 전용 |
| `41` | Thriller | 스릴러 | *영화/만화/애니* | YouTube 전용 |
| `42` | Shorts | 단편 | *엔터테인먼트/방송* | YouTube 전용 |
| `43` | Shows | 쇼/방송 | *엔터테인먼트/방송* | YouTube 전용 |
| `44` | Trailers | 예고편 | *영화/만화/애니* | YouTube 전용 |

---

## 4. 소스코드 구현 및 참조 파일 위치

1. **급상승 트렌드 분석 리포트**:
   - [`RisingVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx) (`CATEGORIES` 12개 고유 ID 매핑 정의)
2. **유튜브 랭킹 TOP 300**:
   - [`YoutubeTop300.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/YoutubeTop300.tsx) (`categoryMapping` 및 `categories` 배열 통폐합)
3. **인기 채널 영상 분석**:
   - [`ChannelDetail.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ChannelDetail.tsx) (`CATEGORIES` 및 `categoryMapping` 릴레이션 정의)

---

## 5. 관리 및 업데이트 이력

* **작성일**: 2026년 7월 23일
* **작성 목적**: 유튜브 카테고리 ID 다중 동시 선택 버그 방지 및 CreAibox 시스템 표준화 규격 확립
* **검증 방법**: `npx tsc --noEmit` 컴파일 무결성 검증 완료
