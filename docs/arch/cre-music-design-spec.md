# Cre Music - Design Specification Documentation

## 1. Architecture Decisions

### 1-1. Google Drive Bypass Storage
* **배경**: Supabase Storage는 대용량 오디오 및 동영상 콘텐츠를 지속적으로 저장하고 전송하기에 용량 및 네트워크 트래픽 사용 비용이 발생합니다. 반면, CreAibox 플랫폼 관리자는 구글 드라이브 20TB 요금제 공간을 소유하고 있어, 이를 활용하여 트래픽 및 오디오 미디어 스토리지 인프라 비용을 전적으로 절감하는 아키텍처를 결정했습니다.
* **해결책**: OAuth 2.0 클라이언트 인증 정보 및 관리자 Refresh Token을 서버 환경 변수로 구성하고, 백엔드 API에서 사용자 요청을 대리하여 구글 드라이브에 접근 및 음원을 서빙하도록 구성합니다.

### 1-2. Secure Backend Stream Proxy & Range Requests (Alternative to Fife CDN)
* **이슈**:
  * 구글 드라이브의 기본 공유 주소 및 `lh3.googleusercontent.com/d/[FILE_ID]` 주소는 이미지 파일 이외의 대용량 오디오 파일(.wav, .mp3) 로딩 시 브라우저 보안 제약(제3자 쿠키 제한, CORP/CORS) 및 구글 User Content의 HTML 페이지 반환 응답에 의해 HTML5 `<audio>` 태그에서 `NotSupportedError: The element has no supported sources` 에러를 발생시킵니다.
* **해결책**:
  * 백엔드에 전용 프록시 스트리밍 엔드포인트 `/api/music-studio/stream?id=[FILE_ID]`를 구축합니다.
  * 백엔드 API에서 Google Drive API v3의 `alt=media` 엔드포인트를 호출하여 직접 오디오 바이너리 스트림을 가져와 서빙함으로써 브라우저 CORS 및 쿠키 차단을 우회합니다.
  * **Range 헤더 포워딩**: 브라우저 오디오 객체가 부분 스트림을 요구하거나 임의 위치로 이동(Seeking)할 때, 그리고 iOS/Safari 환경에서도 완벽한 음원 재생을 보장하기 위해 클라이언트의 `Range` 요청 헤더를 구글 드라이브 API 요청 헤더로 그대로 위임합니다.
  * 구글 드라이브가 반환하는 `206 Partial Content` 응답 코드 및 `Content-Range`, `Content-Length` 등의 응답 헤더를 브라우저에 투명하게 바이패스 전송하여 최상의 재생 유연성을 확보했습니다.

---

## 2. API Design Rationale

### 2-1. `/api/music-studio/list` GET Endpoint
* **인증 및 인가**: Supabase auth를 통한 로그인 세션이 필수적이며, 플랫폼의 불필요한 연동 비용 낭비를 막고 안전한 클로즈 베타 테스트를 진행하기 위해 환경변수로 지정된 테스터 이메일 화이트리스트(`ALLOWED_TESTER_EMAILS`) 목록에 사용자의 이메일이 포함되어 있는지를 철저히 검사합니다.
* **Google API v3 최적화**: Google Drive API에서 폴더 내 수백 개의 잡다한 파일 중 오디오 파일만 필터링하기 위해 `q` 쿼리 파라미터로 `'[FOLDER_ID]' in parents and (mimeType contains 'audio/' or name contains '.mp3' or name contains '.wav') and trashed = false` 조건을 명시합니다. 이를 통해 폴더 내 오디오 음원 이외의 문서 파일이나 이미지 파일, 그리고 휴지통의 파일은 제외하고 정렬 리스팅합니다.

### 2-2. `/api/music-studio/stream` GET Endpoint (Streaming Proxy)
* **보안 및 자원 보호**: 음원 파일을 누구나 다운로드하거나 구글 API 쿼리 사용량을 고갈시키는 것을 방지하기 위해, 오디오 스트리밍 요청에 대해서도 Supabase 사용자 로그인 및 베타 테스터 이메일 화이트리스트 검증을 적용하여 유효한 세션만 오디오 스트림에 접근할 수 있게 보호합니다.
* **Node.js-to-Web Readable Stream**: 구글 API의 Node.js Readable 스트림을 Next.js Response 규격에 맞는 Web ReadableStream으로 변환(`Readable.toWeb(nodeStream)`)하여, 메모리 누수나 버퍼 지연 없이 브라우저로 대용량 오디오 데이터(최대 100MB+)를 실시간 스트리밍합니다.

---

## 3. UI/UX Decisions

### 3-1. Spotify Style Theme & Layout (Dark Premium)
* **어두운 테마**: 어두운 계열의 `#070709` 배경과 함께 보라색 계열(`#1c1328` ~ `#070709`)의 그라데이션 배너를 사용하여 모던하고 몰입도 높은 스포티파이 스타일 오디오 플레이어 비주얼을 구축했습니다.
* **반응형 제어바 및 리스트**: 모바일 및 태블릿 사용자도 음원을 들을 수 있도록 반응형 레이아웃을 구현했습니다. 모바일에서는 사이드바를 숨기고 우측 콘텐츠를 중심에 배치하며, 글로벌 플레이 제어바는 하단에 고정 렌더링됩니다.
* **Instant Rendering (Loading-Free) UX**: 사용자의 로딩 깜빡임을 억제하기 위해 최초 렌더링 시 데모 트랙(`fallbackTracks`) 구조나 뼈대를 즉시 노출하고, 백엔드로부터 구글 드라이브 음원을 수신한 후 목록을 리렌더링하여 자연스러운 UX를 보장합니다.

---

## 4. Business Rules
* **음원 소유권**: 연동된 구글 드라이브 폴더(`GDRIVE_MUSIC_FOLDER_ID`)는 플랫폼 관리자의 소유이며, 베타 기간 동안 이 폴더 내에 업로드된 `Awakening` 앨범 트랙들을 화이트리스트 회원들에게 스트리밍하여 피드백을 수집합니다.
* **베타 테스터 한정**: 비등록 이메일 계정이 플레이어 리스트 API에 요청할 경우 `403 Forbidden` 처리와 함께 적절한 차단 안내가 UI에 표시되며, 이때 음원은 `fallbackTracks` 데모 음원으로 안전하게 대체 재생되어 페이지 자체의 기능 탐색은 계속 가능하도록 조치합니다.

---

## 5. Scaling Strategy
* **구글 API 할당량 관리**: 구글 API의 분당 요청 할당량 제한을 피하기 위해 리스팅 결과를 Redis 또는 메모리 캐시에 잠시 보존하여 백엔드에서 쿼리 횟수를 최소화하는 캐시 레이어를 향후 연동하도록 고려합니다.
* **Supabase Fallback**: 향후 구글 드라이브 API 할당량 소진 또는 연동 불능 사태에 대비하기 위해, 스토리지 접근이 불가능할 경우 Supabase Storage 버킷에서 음원을 리스팅하는 다중화 파이프라인을 유지보수 스케줄에 편입시킵니다.

---

## 6. Future Roadmap
* **Suno AI 연동 직접 플레이**: Suno API를 사용하여 생성한 커스텀 곡을 구글 드라이브에 직접 업로드하는 기능과 연계하여, AI가 작곡한 곡이 드라이브에 업로드되는 즉시 Cre Music 플레이어에 곡이 리스트업되는 파이프라인 구축.
* **곡별 오디오 파형(Waveform) 로드**: 트랙별 파형 비주얼라이저를 Seek바에 탑재하여 가시적인 탐색 경험 제공.
