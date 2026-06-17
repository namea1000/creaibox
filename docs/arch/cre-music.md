# Cre Music (스포티파이 스타일 뮤직 플레이어) - Operational Documentation

## 1. Purpose
**Cre Music**은 CreAIbox 플랫폼의 뮤직 스튜디오 서브 기능으로, 사용자의 구글 드라이브 지정 폴더(`vocal_trance` 앨범용)에서 음원 파일 목록을 실시간 동기화하여 스포티파이(Spotify) 스타일의 미려한 UI 상에서 직접 들어볼 수 있는 프리미엄 오디오 스트리밍 플레이어 서비스입니다.

---

## 2. Main Features
1. **Google Drive 실시간 연동**:
   * 지정된 구글 드라이브 음원 폴더 ID(`GDRIVE_MUSIC_FOLDER_ID`) 내의 오디오 파일을 실시간 리스팅합니다.
2. **보안 프록시 스트리밍 및 Range 요청 지원**:
   * 브라우저 제3자 쿠키 제한 및 CORS/CORP(Cross-Origin Resource Policy) 제약을 극복하고, iOS/Safari 등의 기기에서도 버퍼링 없이 즉시 재생/탐색(Seeking)이 가능하도록 `Range` 헤더를 구글 드라이브 API로 포워딩하는 `/api/music-studio/stream` 스트리밍 프록시를 구비했습니다.
3. **글로벌 뮤직 플레이어 컨트롤러**:
   * 재생/일시정지, 이전/다음 곡 이동, 실시간 Seek 바 이동, 볼륨 조정, 음소거, 루프 반복, 셔플 재생 제어를 지원합니다.
4. **데모 폴백(Fallback)**:
   * 연동된 구글 드라이브 폴더에 음원이 없을 때도 플레이어 인터랙션을 테스트할 수 있도록 데모 보컬 트랜스 곡 목록을 내장하고 있습니다.
5. **테스터 화이트리스트 차단**:
   * 허용된 베타 테스터 계정(`ALLOWED_TESTER_EMAILS`) 외 외부 유입 사용자에 대해 불필요한 API 노출 및 구글 클라우드 드라이브 쿼리 요청을 제한합니다.

---

## 3. UI Structure
```
+---------------------------------------------------------------------------------+
| [Left Library Sidebar]          | [Main Detail Content Area]                    |
| - 뮤직 스튜디오 홈 이동         |                                               |
| - Cre Music 로고                | [Top Header]                                  |
| - 보컬 트랜스 라이브러리        | - 구글 드라이브 연동 타이틀 및 동기화 버튼    |
| - Awakening 앨범 바로가기       |                                               |
|                                 | [Album Banner]                                |
|                                 | - Awakening 타이틀 / 앨범 커버 및 메타정보    |
|                                 |                                               |
|                                 | [Track Table]                                 |
|                                 | - 트랙번호 / 곡 제목(확장자 제거) / 파일 크기 /|
|                                 |   생성일자 / 재생 아이콘 단추                 |
+---------------------------------------------------------------------------------+
| [Global Player Footer Bar]                                                      |
| - 현재 재생 중인 곡 커버 및 타이틀 정보                                         |
| - 플레이어 컨트롤러 (셔플, 이전곡, 재생/일시정지, 다음곡, 루프)                 |
| - 진행 상태 Seek 바 (현재 재생 시간 / 총 재생 시간)                             |
| - 볼륨 제어 슬라이더 및 음소거 단추                                             |
+---------------------------------------------------------------------------------+
```

---

## 4. Database Structure
* 별도의 RDBMS 테이블을 설계하지 않고, 구글 드라이브 API v3를 매개로 지정된 드라이브 폴더 정보를 Direct Query 방식으로 가져옵니다. 
* 환경 변수 구성:
  * `GDRIVE_MUSIC_FOLDER_ID`: 보컬 트랜스 음원이 업로드된 구글 드라이브 폴더 ID (`1p68BWWuQVIdJF9pT9XSBS2kQOhnjOwGP`).
  * `ALLOWED_TESTER_EMAILS`: 접근이 허용된 베타 테스터 이메일 화이트리스트 목록.

---

## 5. API Structure
* **오디오 목록 조회 API**: `/api/music-studio/list` (GET)
  * Supabase 세션 및 베타 테스터 화이트리스트 이메일을 확인하고, 구글 드라이브 내 오디오 파일(.mp3, .wav 등) 메타데이터 목록 및 프록시 스트리밍 API 주소를 매핑하여 JSON 형태로 응답합니다.
* **오디오 스트리밍 API**: `/api/music-studio/stream?id=[FILE_ID]` (GET)
  * 권한 검증 완료 후, 구글 드라이브 API v3의 `alt=media` 엔드포인트를 호출하여 클라이언트의 `Range` 요청을 포워딩하고, `206 Partial Content` 스트림을 투명하게 포록시 전송합니다.

---

## 6. Component Structure
* **페이지 경로**: `src/app/studio/music/cre-music/page.tsx`
  * 레이아웃 구성, 동적 오디오 인스턴스 핸들링, Seek 제어, 재생 상태 동기화 처리.
* **백엔드 경로**:
  * `src/app/api/music-studio/list/route.ts`: 세션 검증, 화이트리스트 필터링, Google API 클라이언트 파일 목록 쿼리.
  * `src/app/api/music-studio/stream/route.ts`: 오디오 바이너리 Range 스트리밍 및 프록시.
* **라이브러리 모듈**: `src/lib/google-drive.ts`
  * `listGoogleDriveMusic(folderId)`, `getGoogleDriveStream(fileId, rangeHeader)` 및 Google Drive OAuth2 인스턴스 초기화 수행.

---

## 7. Future Expansion
* **다중 플레이리스트 및 앨범 생성**: 구글 드라이브의 서브폴더 목록을 조회하거나 Supabase와 연동하여 개별 앨범과 플레이리스트를 유연하게 생성할 수 있도록 확장 예정.
* **가사 싱크 뷰어**: 곡 재생과 동시에 AI 가사 생성에서 도출된 가사 텍스트를 시간에 맞춰 렌더링하는 LRC 가사 싱크 뷰어 추가 예정.
