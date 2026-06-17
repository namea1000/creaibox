# CreAIbox 개발일지 (Development Log)

이 문서는 CreAIbox 프로젝트의 일자별 개발 내역, 핵심 아키텍처 결정 사항을 기록합니다.

### 🗓️ 2026-06-18 (목) - 오늘
#### 1. 브랜드 서브도메인 블로그 접속 불능 및 JWT 예외 처리 트러블슈팅
* **구현 요약**: 브랜드 ID 승인 후 실서버(`blog.creaibox.com`, `golfgosu.creaibox.com` 등)에서 발생하는 "Blog Under Construction" 에러 및 RLS 우회용 Supabase Client 초기화 오류를 완벽히 해결했습니다.
* **작업 상세**:
  * **원인 규명**: 데이터베이스에는 브랜드 승인이 정상 저장되었으나, Vercel 환경 변수 `SUPABASE_SERVICE_ROLE_KEY` 등록 시 개행 문자(`\n`)와 함께 다른 환경 변수(`API_VAULT_ENCRYPTION_KEY`)가 합쳐져 오염 등록되어 있던 것을 추적하여 밝혀냈습니다.
  * **방어 코드 적용**: `src/utils/supabase/server.ts`의 `createAdminClient` 함수에 복사-붙여넣기 실수로 인한 줄바꿈 및 환경 변수 유입을 정제해주는 방어 로직(`split("\n")[0].trim()`)을 적용하여, 대시보드 수정 없이도 `git push`만으로 즉시 오류를 복구하도록 조치했습니다.
  * **문서화 완료**: [blog-subdomains-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/blog-subdomains-design-spec.md)에 트러블슈팅 세부 이력 및 Vercel 환경 변수 주의점을 정식으로 문서화해 두었습니다.

#### 2. 로컬 개발 환경에서의 미들웨어 경로 조정 및 리라이트 루프 해결
* **구현 요약**: 로컬 개발 시 `golfgosu.localhost:3000` 접속 시 메인 랜딩 페이지로 이동하거나 무한 루프가 돌던 문제를 `middleware.ts` 위치 재배치 및 무한 리라이트 예외 방지 필터링으로 완벽히 해결했습니다.
* **작업 상세**:
  * **미들웨어 파일 경로 교정**: 프로젝트에 `src` 디렉토리가 있을 때 Next.js 로컬 개발 서버가 루트의 `middleware.ts`를 무시하는 동작 사양을 고려하여, 파일 위치를 `src/middleware.ts`로 정식 이동시켰습니다.
  * **무한 리라이트 예외 처리**: 이미 내부 리라이팅이 이루어진 주소(`/brand/[brand_id]`)가 미들웨어를 타서 중복으로 또 리라이트되는 루프를 방지하기 위해, `isStaticOrApi` 필터링에 `path.startsWith("/brand")` 예외 구문을 추가하였습니다.

#### 3. 프리미엄 테마 스위처(라이트/다크) 및 실시간 검색 기능 탑재
* **구현 요약**: 블로그 방문자용 헤더에 `downhubs.com` 스타일의 라이트/다크 모드 토글과 실시간 포스팅 검색 기능을 추가하였으며, 다크 모드의 배경 컬러를 부드러운 그레이 톤으로 교정했습니다.
* **작업 상세**:
  * **클라이언트 컴포넌트 이관**: 서버 사이드 렌더링(SEO) 성능을 보존하면서 테마 전환 및 라이브 검색과 같은 동적 인터랙션을 구현하기 위해, 브라우저 마운트 이벤트를 처리하는 `BlogClientWrapper.tsx` 클라이언트 컴포넌트를 분리 개발해 매핑했습니다.
  * **다운허브스 스타일 다크 톤 및 스위치**: 기존의 완전한 올 블랙(`bg-zinc-950`)에서 눈이 피로하지 않은 부드러운 다크 그레이(`bg-[#181a20]` 배경, `bg-[#1e222b]` 카드/헤더)로 다크 테마 컬러를 리뉴얼하고, 헤더 우측에 세련된 캡슐형 테마 슬라이드 토글을 배치했습니다.
  * **통합 실시간 검색바**: 돋보기 아이콘 클릭 시 노출되는 애니메이션 인풋 필드를 신설하고, 카테고리/제목/요약문을 기준으로 포스팅을 즉시 필터링해주는 검색 엔진을 구축했습니다.
  * **헤더 제어 도구 레이아웃 조정**: 사용자의 시각적 피드백을 반영하여 테마 스위처와 돋보기 검색 버튼의 좌우 배치를 스왑([토글스위치] [돋보기] 순)하고, 배경 대비를 높이기 위해 테마 토글 캡슐에 굵은 점선 테두리(`border-2 border-dashed`) 스타일을 적용해 가시성을 대폭 개선했습니다.
  * **히어로 배너 영역 높이 최적화**: 블로그 상단 타이틀과 설명글이 있는 히어로 영역의 세로 패딩 크기를 대폭 축소(기존 `py-24` ➡️ `py-8`, 총 약 66% 이상 축소)하여, 방문 시 첫 화면에서 포스팅 글 목록이 훨씬 컴팩트하고 넓게 보이도록 레이아웃 비율을 완성했습니다.

### 🗓️ 2026-06-17 (수)
#### 1. Cre Music (스포티파이 스타일 뮤직 플레이어) 및 구글 드라이브 음원 스트리밍 연동
* **구현 요약**: 구글 드라이브 20TB 공간의 지정 폴더(`vocal_trance` 앨범)에 올려둔 음원을 실시간으로 감상하고 제어할 수 있는 스포티파이 스타일의 고속 오디오 스트리밍 플레이어 페이지 및 API를 개발했습니다.
* **작업 상세**:
  * **백엔드 음원 목록 API (`/api/music-studio/list`)**: Supabase 로그인 세션 검증 및 `ALLOWED_TESTER_EMAILS` 화이트리스트 테스터 권한 검사를 적용했습니다. 구글 API v3를 호출하여 지정된 폴더 ID(`1p68BWWuQVIdJF9pT9XSBS2kQOhnjOwGP`) 내의 오디오 파일(.mp3, .wav 등) 메타데이터를 로드하고, 내부 스트리밍 API 주소(`/api/music-studio/stream?id=[FILE_ID]`)를 매핑하여 반환하는 엔드포인트를 구축했습니다.
  * **보안 스트리밍 프록시 API (`/api/music-studio/stream`)**: `lh3.googleusercontent.com/d/[FILE_ID]` 다이렉트 CDN 링크 사용 시 대용량 비-이미지(오디오) 파일 재생 시 브라우저 쿠키 체크, CORP/CORS 차단 및 구글의 HTML 응답 반환으로 인해 `NotSupportedError (no supported sources)` 오디오 엑박 에러가 발생하던 현상을 해결했습니다. 백엔드에서 `alt=media` 구글 드라이브 API를 직접 프록시하여 음원 바이너리를 스트리밍하고, 브라우저가 부분 전송을 요청할 수 있도록 `Range` 헤더 위임 및 `206 Partial Content`를 완전 지원하게 함으로써 지연 없는 오디오 탐색(Seeking)과 재생 오류를 완벽하게 수정했습니다.
  * **스포티파이 스타일 뮤직 플레이어 UI (`/studio/music/cre-music`)**: 다크 프리미엄 비주얼 테마(블루-퍼플 그라데이션)로 사이드바, 앨범 히어로 배너, 곡 목록 테이블, 하단 글로벌 재생 컨트롤 바를 반응형으로 개발했습니다. HTML5 `<audio>` 태그와 양방향 동기화하여 셔플, 루프, 이전/다음 곡 이동, Seek 진행도 바, 볼륨 슬라이더 및 음소거 제어를 실시간으로 구현했습니다.
  * **데모 폴백 및 동기화**: 연동된 드라이브에 곡이 없거나 연동 장애 시 정상적인 탐색을 위해 3개의 고화질 데모 트랙(`SoundHelix` 소스)으로 대체 렌더링되도록 Fallback을 설계했습니다. 또한 최신 드라이브 업로드 상태를 반영할 수 있는 실시간 "동기화(Refresh)" 및 "드라이브 열기" 단축 버튼을 탑재했습니다.
  * **홈 스튜디오 연동 및 빌드 최적화**: 뮤직 스튜디오 메인 화면(`/studio/music/page.tsx`)에 "Cre Music 플레이어" 카드 및 퀵 메뉴 링크를 탑재했습니다. `lucide-react` 라이브러리의 버전 차이로 인한 `FolderMusic` 아이콘 미탑재 에러를 `Music` 아이콘으로 대체하여 TypeScript 컴파일 검증을 성공적으로 마쳤습니다.
* **관련 문서**:
  * [cre-music.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music.md) (Cre Music 플레이어 - 운영 가이드)
  * [cre-music-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music-design-spec.md) (Cre Music 플레이어 - 설계 사양서)
  * [cre-music.md (페이지 명세)](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/studio/cre-music.md) (Cre Music 플레이어 - 페이지 명세서)
  * [endpoints.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/endpoints.md) (API 엔드포인트 세부 명세)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)되도록 Fallback을 설계했습니다. 또한 최신 드라이브 업로드 상태를 반영할 수 있는 실시간 "동기화(Refresh)" 및 "드라이브 열기" 단축 버튼을 탑재했습니다.
  * **홈 스튜디오 연동 및 빌드 최적화**: 뮤직 스튜디오 메인 화면(`/studio/music/page.tsx`)에 "Cre Music 플레이어" 카드 및 퀵 메뉴 링크를 탑재했습니다. `lucide-react` 라이브러리의 버전 차이로 인한 `FolderMusic` 아이콘 미탑재 에러를 `Music` 아이콘으로 대체하여 TypeScript 컴파일 검증을 성공적으로 마쳤습니다.
* **관련 문서**:
  * [cre-music.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music.md) (Cre Music 플레이어 - 운영 가이드)
  * [cre-music-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music-design-spec.md) (Cre Music 플레이어 - 설계 사양서)
  * [cre-music.md (페이지 명세)](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/studio/cre-music.md) (Cre Music 플레이어 - 페이지 명세서)
  * [endpoints.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/endpoints.md) (API 엔드포인트 세부 명세)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)

  
### 🗓️ 2026-06-16 (화)
#### 1. Supabase Storage ➡️ Google Drive (20TB) 이미지 스토리지 전환 및 마이그레이션
* **구현 요약**: Supabase 무료 티어 스토리지의 한계(용량 및 요금)를 극복하기 위해, 본인의 20TB 개인 구글 드라이브 공간을 백엔드에서 위임 권한(OAuth 2.0 Refresh Token)으로 다이렉트 연동하는 아키텍처를 도입했습니다.
* **작업 상세**:
  * **API 라우트 구축**: WebP 압축 최적화(Sharp) 후 구글 드라이브 API로 업로드하고, 오류 시 Supabase Storage로 자동 백업(Fallback)되는 수동 이미지 업로드 API(`/api/image-upload`) 및 AI 생성 이미지 저장 API(`/api/image-studio/generate`)를 신설 및 통합하였습니다.
  * **전체 마이그레이션**: Supabase Storage 버킷 내에 업로드되어 있던 기존 블로그 이미지/썸네일 24개를 구글 드라이브 폴더(`creaibox-blog-images`)로 모두 무손실 이전하였습니다.
  * **DB URL 패치**: 데이터베이스 내 `generated_images.image_url` 필드 및 블로그 포스트 본문 내 Supabase 이미지 주소를 구글 Fife 고속 CDN 주소 체계(`https://lh3.googleusercontent.com/d/[FILE_ID]`)로 일괄 치환했습니다.
  * **GCP 권한 상시 유지 설정**: 구글 클라우드 콘솔의 OAuth 앱 게시 단계를 `프로덕션 단계`로 전환하여 7일 후 리프레시 토큰이 자동 만료되는 이슈를 완벽하게 방지했습니다. (안심하고 상시 무인 업로드가 가능합니다.)
  * **Supabase RLS 조회 권한 수정**: 비로그인 외부 방문자가 블로그 글에 접속했을 때도 썸네일 이미지를 정상적으로 불러올 수 있도록 `generated_images` 테이블 및 `generated-images` 스토리지 객체에 대해 비로그인 및 외부 사용자 공개 조회(SELECT) RLS 정책을 수립했습니다.
* **관련 문서**:
  * [google-drive-integration.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/google-drive-integration.md) (구글 드라이브 연동 아키텍처 및 설정 가이드)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 및 소스 변경점 상세)

#### 2. Google Imagen 3 및 Veo 비디오 생성 API 연동
* **구현 요약**: 이미지 스튜디오에 구글의 최신 이미지 모델 Imagen 3 API를, 비디오 스튜디오에 동영상 생성 모델 Veo API를 연동하여 백엔드 및 UI 연동을 완벽히 마쳤습니다.
* **작업 상세**:
  * **Imagen 3 연동**: `/api/image-studio/generate` 라우트에서 `imagen-3.0-generate-002` 모델 감지 시 구글 AI Studio의 `:predict` REST 엔드포인트를 직접 호출하는 구조를 개발했습니다. 에셋 비율 매퍼(`getImagenAspectRatio`)를 적용하고, 생성된 바이너리를 Sharp로 압축하여 Supabase Storage에 저장하도록 맞췄습니다. 이미지 스튜디오 상수(`blogImageConstants.ts`)에 Google Imagen 3를 정식 옵션으로 등록했습니다.
  * **Veo 비디오 연동**: 비디오 에디터용 비동기 동영상 생성 라우트(`/api/video-studio/generate`) 및 폴링 작업 조회 라우트(`/api/video-studio/operations/[operationId]`)를 새로 개설했습니다. 생성 작업이 완료(`done: true`)되면 비디오 임시 파일 메타데이터에서 `downloadUri`를 획득해 버퍼를 받고, 이를 Supabase Storage `community` 버킷에 MP4 비디오 형식으로 업로드하여 public 주소를 반환합니다.
  * **비디오 에디터 AI Assets UI 갱신**: `VideoEditorAiAssetsPanel.tsx` 상단에 "Google Veo AI 비디오 메이커" 입력 양식 및 화면 비율 선택 필드를 추가했습니다. 생성 시작 시 상태 바 노출과 5초 주기의 비동기 폴링을 연계하고, 완료 시 생성된 AI 비디오 클립을 타임라인 및 에셋 라이브러리에 자동으로 밀어 넣는 통합 흐름을 구현했습니다.
  * **화이트리스트 보안 결합**: `/api/video-studio/*` 하위의 모든 생성 및 조회 진입점에 화이트리스트 이메일(`ALLOWED_TESTER_EMAILS`) 검증 필터를 적용하여 클로즈 테스팅 기간 중의 오남용을 원천 차단했습니다.
* **관련 문서**:
  * [devlog.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/devlog.md) (본 개발일지)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 및 소스 변경점 상세)

---

### 🗓️ 2026-06-15 (월) - 어제
#### 1. 다중 서브도메인 브랜드 ID 및 커스텀 도메인 관리 기능 고도화
* **구현 요약**: 다중 브랜드 운영 및 개별 커스텀 도메인 관리를 지원하기 위해 데이터베이스, 백엔드 및 프론트엔드 기능을 대대적으로 확장 및 리팩토링했습니다.
* **작업 상세**:
  * **어드민 브랜드 콘솔 리팩토링**: 어드민 테이블을 기존 사용자 기준에서 **서브도메인(Brand ID) 기준으로 확장(1행 1서브도메인)**하여 출력하도록 재구축했습니다. 승인, 반려, 도메인 관리 핸들러가 특정 `brandId` 및 접미사 flat key를 타겟하도록 세분화했습니다.
  * **블로그 대시보드 다중 브랜드 선택기**: 상단에 **"관리할 블로그 선택"** 드롭다운을 탑재하여 사용자가 여러 블로그 설정을 간편하게 스위칭하며 관리할 수 있게 하였습니다. (블로그 타이틀, 테마 컬러 등이 선택된 브랜드 ID별 접미사 키로 `extra_configs`에 격리 저장됨)
  * **마이페이지 브랜드 신청 취소 및 타겟팅**: 승인 완료 대기 중인 서브도메인 목록에 **"신청 취소"** 버튼을 추가하고, 커스텀 도메인 연결 시 어떤 서브도메인 브랜드에 매핑할지 직접 선택할 수 있도록 드롭다운을 지원했습니다. 가비아, Vercel 등 외부 도메인 등록처 퀵 링크 가이드도 탑재했습니다.
  * **공개 블로그 라우팅 및 Canonical URL 동기화**: `brand/[brand_id]` 등에서 subdomains 배열과 profiles의 메인 `brand_id`를 모두 탐색하여 유연하게 호스트를 연계하도록 수정했으며, Tiptap 에디터의 Canonical URL 지정 패널 및 미리보기 버튼에서 커스텀 도메인이 적용된 실주소를 바로 canonical 대상으로 잡도록 동기화했습니다.
* **관련 문서**:
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)
  * [blog-subdomains-schema.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/blog-subdomains-schema.md) 및 [blog-subdomains.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/blog-subdomains.sql) (서브도메인 스키마 및 마이그레이션 SQL)

