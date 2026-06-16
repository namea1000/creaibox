# CreAIbox 개발일지 (Development Log)

이 문서는 CreAIbox 프로젝트의 일자별 개발 내역, 핵심 아키텍처 결정 사항, 트러블슈팅 및 버그 픽스 내역을 기록하는 개발일지입니다.

---

## 2026년 6월

### 🗓️ 2026-06-16 (화) - 오늘
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

