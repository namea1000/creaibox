# 코드베이스 문서화 작업 완료 보고서 (Walkthrough)

이 문서는 `CreAibox` 전체 코드베이스 분석을 통해 `docs/` 디렉토리에 구축된 문서들의 상세 지도와 검증 결과를 담고 있습니다. 본 문서는 Git 저장소에 포함되어 맥북 등의 다른 기기와 연동됩니다.

---

## 1. 정비 및 작성 완료된 문서 목록

### 1-1. 프로젝트 기획 및 작업 관리 (`docs/project/`)
* [overview.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/overview.md): 플랫폼의 전체 아키텍처 개요, 다이어그램(mermaid) 및 소스 트리 구성.
* [modules.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/modules.md): 스튜디오 모듈(제작용), 어드민 모듈, 퍼블릭 일반 페이지 모듈 설명.
* [TODO.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/TODO.md): 현재 비활성화(준비 중)로 연결된 스튜디오 서브 기능 일람. (향후 개발 가이드)
* [roadmap.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/roadmap.md): 비디오 에디터, 블로그 에디터, API 금고 등 실제 가동 중인 주요 마일스톤.
* [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md): (본 문서) 작업 일지 및 구성 내역 보고서.

### 1-2. 시스템 설계 및 인프라 (`docs/arch/`)
* [tech-stack.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/tech-stack.md): Next.js 16 / React 19 코어 정보와 상태 관리, 스타일링 라이브러리 명세.
* [ai-integration.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/ai-integration.md): 브라우저 내 개인 키 우선 통신 방식 및 백엔드 공용 풀 중계 가로채기 메커니즘 정리.
* [google-drive-integration.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/google-drive-integration.md): 구글 드라이브 20TB 개인 요금제를 연동하기 위한 OAuth 2.0 리프레시 토큰 및 고속 CDN(lh3) 주소 체계 구축 가이드.

### 1-3. 데이터베이스 및 저장소 (`docs/database/`)
* [schema.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/schema.md): `profiles`, `admin_api_vault`, `writing_naver_posts` 등 총 10개 이상 테이블 컬럼 상세 정의.
* [storage.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/storage.md): 블로그 이미지용 `generated-images` 및 커뮤니티용 `community` 스토리지 규격.
* [supabase.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/supabase.md): client/server 인스턴스 팩토리 구조와 OAuth 쿠키 인증 동기화 흐름.

### 1-4. 기능별 특화 컴포넌트 (`docs/components/`)
* [music.md](file:///Users/a1234/Local%20Sites/creaibox/docs/components/music.md): 가사 생성 입력부 및 Web Audio API 비주얼라이저 결합 원리.
* [video.md](file:///Users/a1234/Local%20Sites/creaibox/docs/components/video.md): 멀티 트랙 타임라인, 자막/오디오 믹서, FFmpeg WASM 렌더링 내보내기 모듈 정보.
* [writing.md](file:///Users/a1234/Local%20Sites/creaibox/docs/components/writing.md): UniversalBlogEditor(드래그 앤 드롭 업로드 및 자동 저장), 워드프레스 REST API 발행, 네이버 키워드 분석 모듈.
* [research.md](file:///Users/a1234/Local%20Sites/creaibox/docs/components/research.md): 수집 자료 분석, 키워드/PDF 파서, AI 채팅 챗봇의 그라운딩(Grounding) 기법.

### 1-5. 백엔드 API 및 자격 인증 (`docs/api/`)
* [endpoints.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/endpoints.md): AI 텍스트 생성(/api/ai/generate), PDF/URL 문서 내용 추출기 엔드포인트 세부 인풋/아웃풋.
* [database.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/database.md): API Vault 암호화(AES-256-GCM) 및 우선순위/성공률 기반 Failover 대체 루틴.

### 1-6. 개발 및 코드 협업 규칙 (`docs/rules/`)
* [coding.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/coding.md) / [database.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/database.md) / [naming.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/naming.md) / [ui.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ui.md) / [commits.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/commits.md): 네이밍 규칙, 다크 모드 스타일 규칙, 깃 커밋 가이드라인 수록.

### 1-7. 웹 라우팅 명세 (`docs/pages/`)
* [public.md](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/public.md) / [admin.md](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/admin.md) / [studio.md](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/studio.md): 일반 홈/인증 라우트, 관리자 대시보드 라우트, 창작 스튜디오 라우트 및 매핑 구조화.

---

## 2. 무결성 검증 결과
* **빈 파일 검사**: `find docs -type f -size 0` 명령을 통한 탐색 결과, 빈 문서가 존재하지 않는 것을 교차 검증하였습니다.
* **사실 기반 작성**: 데이터베이스 스키마 및 AI 라우트 파싱 공식 등 모든 정보는 추정 없이 코드를 하나하나 분석해 명시되었습니다.

---

## 3. 서브도메인 브랜드 ID 및 커스텀 도메인 관리 기능 고도화

다중 브랜드 운영 및 개별 커스텀 도메인 관리를 지원하기 위해 전반적인 데이터베이스, 백엔드 및 프론트엔드 기능을 고도화했습니다.

### 3-1. 변경 및 추가 내역
* **어드민 브랜드 콘솔 리팩토링 ([src/app/admin/brands/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/brands/page.tsx))**:
  * 기존에 사용자 프로필 기준으로만 보여주던 어드민 테이블을 **서브도메인(Brand ID) 기준으로 확장(1행 1서브도메인)**하여 출력하도록 리팩토링했습니다.
  * 승인, 반려, 도메인 관리 등 어드민 작동 핸들러가 사용자 전체가 아닌 특정 `brandId` 및 접미사 flat key(예: `custom_domain_status_[brandId]`)를 타겟하도록 고도화했습니다.
  * DNS 및 SSL 자가진단 도구도 다중 도메인에 맞춰 개별적으로 조회하도록 맞추었습니다.
* **블로그 대시보드 다중 브랜드 지원 ([src/app/studio/writing/creaibox/blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx))**:
  * 사용자 설정 상단에 **"관리할 블로그 선택"** 드롭다운을 탑재하여 사용자가 여러 블로그 설정을 전환하며 관리할 수 있게 했습니다.
  * 테마 컬러, 타이틀, 커스텀 도메인 설정들이 선택된 브랜드 ID별 접미사 키(예: `blog_title_[brandId]`)로 데이터베이스 `extra_configs`에 개별 저장 및 로드되도록 맞추었습니다.
* **마이페이지 브랜드 신청 취소 및 도메인 신청 타겟팅 ([src/app/mypage/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))**:
  * 승인된 서브도메인 목록 옆에 **"신청 취소"** 버튼을 추가하여 사용자가 원치 않는 도메인 신청을 취소할 수 있도록 구현하고 DB를 자동 갱신하게 처리했습니다.
  * 커스텀 도메인 연결 시 **어떤 서브도메인 브랜드에 연결할지** 타겟 브랜드를 드롭다운으로 직접 선택하여 신청할 수 있도록 UI를 확장했습니다.
  * 가비아, Vercel, Cafe24 등 국내외 도메인 구입처로 연결되는 퀵 링크 가이드를 추가하여 연결 접근성을 높였습니다.
* **공개 블로그 페이지 라우팅 및 Canonical URL 동기화**:
  * [src/app/brand/[brand_id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/page.tsx) 등에서 subdomains 배열과 profiles의 메인 `brand_id`를 모두 탐색하여 유연하게 호스트를 찾게 수정했습니다.
  * Tiptap 에디터의 Canonical URL 지정 패널 및 미리보기 버튼에서 커스텀 도메인이 적용된 실주소를 바로 canonical 대상으로 삼도록 연결했습니다.
* **Supabase RLS 조회 권한 수정**:
  * 비로그인 외부 방문자가 블로그 글에 접속했을 때도 썸네일 이미지를 불러올 수 있도록 `generated_images` 테이블 및 `generated-images` 스토리지 객체에 대해 비로그인 및 외부 사용자 공개 조회(SELECT) RLS 정책을 수립했습니다.
  * [generated-images.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/generated-images.sql) 및 [generated-images-schema.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/generated-images-schema.md)에 SQL 스크립트를 추가하여 형상 관리를 동기화했습니다.

---

## 4. 구글 드라이브 이미지 업로드 연동 (Google Drive Upload Integration)

블로그 썸네일(AI 생성) 및 본문 이미지(로컬 업로드) 파일 저장소를 사용자의 **구글 드라이브 20TB 개인 계정 공간**으로 연동하는 작업을 완료했습니다.

### 4-1. 주요 설계 및 특징
* **개인 계정용 OAuth 2.0 연동 (Bypass Quota Limit)**: 
  * 구글 드라이브 API 호출 시 권한이 없는 서비스 계정(JWT) 대신 사용자 개인 OAuth 2.0 자격 증명(클라이언트 ID, 보안 비밀번호, 리프레시 토큰)을 사용합니다.
  * 이를 통해 파일 소유권이 사용자 개인 계정으로 귀속되어 서비스 계정의 0MB 용량 제한을 우회하고 **20TB 개인 드라이브 저장 공간을 100% 정상 활용**합니다.
* **Fife CDN 주소 체계 적용 (Bypass CORP/CORS Blocks)**:
  * 기존 `drive.google.com/uc?id=` 링크는 브라우저 쿠키 확인으로 인한 303 리다이렉트와 `cross-origin-resource-policy` 제한으로 브라우저에서 엑박(Broken Image)이 뜨는 문제가 있었습니다.
  * 이를 해결하기 위해 구글의 고속 이미지 서빙 CDN 주소인 **`https://lh3.googleusercontent.com/d/[FILE_ID]`** 포맷으로 반환하도록 커스텀 처리했습니다. 이 주소는 리다이렉트 없이 `Access-Control-Allow-Origin: *` 헤더를 포함해 200 OK로 직결되어 에디터 및 블로그 페이지에서 막힘없이 렌더링됩니다.

### 4-2. 변경 및 추가 파일 목록
* **[NEW] [google-drive.ts](file:///Users/a1234/Local%20Sites/creaibox/src/lib/google-drive.ts)**: Google Drive API OAuth2 인증 및 지정 공유 폴더(`1e8CAUHmT1pH1VQBpHNOvVRy2Zl0JTDrK`) 업로드 유틸리티 구현. 업로드된 파일은 즉시 public(전체 공개)으로 설정되어 직관적인 embed 링크(`https://lh3.googleusercontent.com/d/[FILE_ID]`)가 반환됩니다.
* **[NEW] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-upload/route.ts)**: 에디터 본문 및 스튜디오 패널 등 수동 이미지 첨부를 담당할 서버측 API 엔드포인트 구현. Sharp를 이용하여 WebP 72% 품질로 이미지를 압축한 뒤 구글 드라이브에 직접 업로드하며, 환경 변수가 설정되지 않은 경우 Supabase 스토리지로 복원력 있게 Fallback 처리됩니다.
* **[MODIFY] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-studio/generate/route.ts)**: AI 이미지 엔진 생성부에서 구글 드라이브 API 인증 유무를 검사한 후, 구글 드라이브에 직접 업로드하고 해당 URL을 `generated_images` DB에 삽입하도록 처리했습니다.
* **[MODIFY] [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)**: Tiptap 에디터 내부의 드래그 앤 드롭 및 사진 첨부 처리 시 클라이언트 측에서 직접 Supabase Storage에 쓰던 것을 `/api/image-upload` 호출로 변경하여 보안 및 업로드 경로를 단일화했습니다.
* **[MODIFY] [BlogImageStudioPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/BlogImageStudioPanel.tsx)**: 이미지 스튜디오 내의 내 컴퓨터 사진 업로드 처리 시 마찬가지로 `/api/image-upload`를 호출하도록 수정했습니다.
* **[MODIFY] [.env.local](file:///Users/a1234/Local%20Sites/creaibox/.env.local)**: Google Cloud 서비스 계정 키 대신 OAuth2 자격 증명(클라이언트 ID, 보안 비밀번호, 리프레시 토큰) 및 연동 폴더 ID 설정값 추가.

### 4-3. 검증 상태
* `npx tsc --noEmit`를 통해 **오류가 없음(0 compilation errors)**을 교차 검증 완료하였습니다.
* 기존 DB에 저장되어 있던 24개 데이터 및 글 본문 HTML에 박혀있던 이미지 링크들을 전부 구글 드라이브 업로드 후 `lh3.googleusercontent.com/d/` 주소로 완벽하게 마이그레이션했습니다.



