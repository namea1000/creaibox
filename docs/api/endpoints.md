# API 엔드포인트 명세 (API Endpoints)

`CreAibox` 백엔드 서버리스 라우터(`src/app/api/`)의 엔드포인트 세부 명세입니다.

---

## 1. AI 텍스트 생성 API (`/api/ai/generate`)
* **메서드**: `POST`
* **요청 바디 (`GenerateBody`)**:
  ```json
  {
    "type": "naver_generation",
    "prompt": "블로그 포스팅 생성해줘...",
    "model": "gemini-3.1-flash-lite",
    "useSearch": true,
    "responseMimeType": "application/json",
    "userId": "uuid-here",
    "userEmail": "user@domain.com"
  }
  ```
* **동작 프로세스**:
  1. **사용량 카운팅**: 요청 IP 또는 `userId` 기준으로 오늘 사용 횟수를 `ai_generation_usage_logs` 테이블에서 카운트합니다.
  2. **한도 초과 차단**: 금일 요청 수가 `FREE_DAILY_LIMIT = 3`을 넘으면 `429 Too Many Requests` 상태와 함께 키 등록 안내 메시지를 반환합니다.
  3. **공용 API 키 로드**: `admin_api_vault`에서 활성화된 Gemini API 키 목록을 `priority` 및 `today_count` 기준으로 로드합니다.
  4. **Failover 자동 재시도**: 가용한 키를 순회하며 Google Gemini API를 호출합니다. 특정 키가 혼잡(503) 또는 일일 한도를 넘으면 실패 처리(`recordVaultFailure`)를 기록하고 자동으로 다음 키를 가동해 복구를 꾀합니다.
  5. **검색 연동 (Grounding)**: `useSearch`가 true이고 `gemini_postpay` (Tier 1 키)인 경우 구글 실시간 검색 결과를 바탕으로 텍스트를 그라운딩하여 생성합니다.
* **응답**:
  ```json
  {
    "ok": true,
    "text": "생성된 텍스트 결과...",
    "provider": "gemini",
    "model": "gemini-3.1-flash-lite",
    "vaultId": 12,
    "usedSearch": true
  }
  ```

---

## 2. Groq AI 생성 API (`/api/ai/groq`)
* **메서드**: `POST`
* **용도**: 가사, Suno 프롬프트, 썸네일 제목 등 실시간 응답이 요구되는 작업용 초고속 추론 서비스 제공.
* **특징**: `llama-3.1-8b-instant`, `llama-3.3-70b-versatile` 등 오픈 모델 지원.

---

## 3. 웹 및 문서 파서 API

### 3-1. URL 자료 추출 (`/api/research/extract-url`)
* **메서드**: `POST`
* **동작**: 파라미터로 넘어온 외부 URL 웹 사이트에 요청을 전송하고, `cheerio`를 활용하여 원본 HTML에서 불필요한 스크립트, 스타일 태그를 걷어낸 뒤 가독성 있는 본문 텍스트만 스크래핑해 반환합니다.

### 3-2. PDF 내용 추출 (`/api/research/extract-pdf`)
* **메서드**: `POST`
* **동작**: 첨부된 바이너리 PDF 문서를 디스크 세션에 로드하고 `pdf-parse` 엔진을 사용하여 원고 재작성 리서치 재료용으로 변환해 리턴합니다.

---

## 4. 이미지 생성 API (`/api/image-studio/generate`)
* **메서드**: `POST`
* **동작**: AI 모델을 호출하여 프롬프트 가이드를 따르는 고화질 이미지를 렌더링하고, 생성된 바이너리를 Supabase Storage(`generated-images`)에 업로드한 뒤 Public CDN URL을 발행해 에디터에 바인딩합니다.

---

## 5. 뮤직 스튜디오 오디오 목록 조회 API (`/api/music-studio/list`)
* **메서드**: `GET`
* **동작**: 구글 드라이브 내 지정된 음악 폴더(`GDRIVE_MUSIC_FOLDER_ID`) 내의 오디오 파일(.mp3, .wav 등) 목록을 조회하여 스트리밍 가능한 내부 API 프록시 주소와 파일 메타데이터를 반환합니다.
* **기능 및 보안**:
  1. **사용자 세션 확인**: Supabase 서버 클라이언트를 활용하여 로그인 세션을 검증합니다.
  2. **화이트리스트 이메일 검증**: `ALLOWED_TESTER_EMAILS` 환경 변수에 지정된 이메일 계정인지 확인하여 클로즈드 베타 권한이 있는 이메일만 허용합니다. (미등록시 403 반환)
  3. **Google Drive API v3 연동**: `googleapis` 패키지를 통해 OAuth 2.0 자격증명으로 구글 드라이브 클라이언트를 연결하고, `'[FOLDER_ID]' in parents and (mimeType contains 'audio/' or name contains '.mp3' or name contains '.wav')` 쿼리로 음원 파일들을 로드합니다.
  4. **스트리밍 주소 매핑**: 개별 오디오 파일의 ID를 기반으로 제3자 쿠키나 CORS/CORP(Cross-Origin Resource Policy) 제약을 우회하기 위해 내부 프록시 스트리밍 주소(`/api/music-studio/stream?id=[FILE_ID]`)를 가공하여 트랙 배열로 반환합니다.
* **응답 예시**:
  ```json
  {
    "success": true,
    "album": "Awakening",
    "genre": "Vocal Trance",
    "tracks": [
      {
        "id": "1A2B3C4D...",
        "title": "Awakening (Vocal Mix)",
        "fileName": "Awakening_Vocal_Mix.mp3",
        "mimeType": "audio/mpeg",
        "size": 6120400,
        "createdAt": "2026-06-16T12:00:00Z",
        "streamUrl": "/api/music-studio/stream?id=1A2B3C4D..."
      }
    ]
  }
  ```

---

## 6. 뮤직 스튜디오 오디오 바이너리 스트리밍 API (`/api/music-studio/stream`)
* **메서드**: `GET`
* **쿼리 스트링**: `?id=[구글드라이브_파일_ID]`
* **동작**: 구글 드라이브 API v3의 `alt=media` 엔드포인트를 호출하여 오디오 바이너리를 Next.js 백엔드 서버를 통해 브라우저로 실시간 스트리밍 프록시합니다.
* **보안 및 최적화**:
  1. **세션 및 권한 검증**: Supabase 로그인 상태 및 `ALLOWED_TESTER_EMAILS` 화이트리스트 접근 권한을 확인하여 불법 오디오 다운로드 및 트래픽을 차단합니다.
  2. **Range 바이트 요청 지원**: 브라우저 오디오 플레이어가 탐색(Seeking)하거나 iOS/Safari 디바이스 등에서 요구하는 partial content를 완벽 지원하기 위해, 클라이언트 request의 `Range` 헤더를 Google Drive API 요청 시 그대로 포워딩합니다.
  3. **206 Partial Content 대응**: 구글 드라이브가 반환하는 `206 Partial Content` 및 `Content-Range` 헤더와 오디오 버퍼를 브라우저에 투명하게 스트리밍하여, 다운로드 대기 없이 탐색 재생이 고속으로 동작하도록 구현하였습니다.


