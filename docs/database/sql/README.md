# ⚡ CreaiBox Database SQL Script Directory (`docs/database/sql/`)

이 디렉토리는 Supabase PostgreSQL 데이터베이스에 직접 실행할 수 있는 DDL(Data Definition Language), RLS(Row Level Security) 정책, 마이그레이션 및 패치 쿼리 파일들을 모아둔 곳입니다.

---

## 📂 파일 목록 및 기능별 분류

### 1. 👥 계정 & 관리자 & 접근 제어
* [`profiles.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql): `profiles` 테이블 생성, RLS 정책, 신규 가입 트리거 (`handle_new_user`)
* [`admin-whitelist.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/admin-whitelist.sql): `admin_whitelist` 테이블 및 관리자 이중 잠금 제어
* [`system-settings.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/system-settings.sql): 시스템 전역 환경설정 테이블
* [`email_forwarding_rules.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/email_forwarding_rules.sql): 이메일 포워딩 및 수신자 규칙 테이블

### 2. 🤖 AI & 사용량 & 로그
* [`ai-assistant.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-assistant.sql): AI 비서 대화방(`ai_conversations`), 메시지(`ai_messages`), 첨부파일
* [`ai-generation-usage-logs.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-generation-usage-logs.sql): AI 생성 일일 사용량 추적 및 통계 로그
* [`ai-shorts-generator.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-shorts-generator.sql): AI 숏츠 비디오 제작 프로젝트
* [`generated-images.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/generated-images.sql): DALL-E/Imagen 등 AI 생성 이미지 아카이브

### 3. ✍️ 원고 & 콘텐츠 제작 스튜디오
* [`writing-creaibox-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-creaibox-posts.sql): CreaiBox 자체 블로그 포스팅 원고
* [`writing-naver-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-naver-posts.sql): 네이버 블로그 전용 원고 및 재가공 포스트
* [`writing-wordpress-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-wordpress-posts.sql): 워드프레스 원고 및 자동 발행 설정
* [`content-planner-schema-v1.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/content-planner-schema-v1.sql): 콘텐츠 플래너 캠페인 & 자동 스케줄링 태스크
* [`cre-workspace-notes.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/cre-workspace-notes.sql): 사용자 워크스페이스 폴더 및 메모/노트

### 4. 🌐 사이트 빌더 & 서브도메인 & 브랜드
* [`client-site-builder.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/client-site-builder.sql): 원클릭 클라이언트 커스텀 웹사이트 & 블로그 빌더
* [`blog-subdomains.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/blog-subdomains.sql): 서브도메인 라우팅 및 브랜드 ID 화이트/블랙리스트
* [`brand-id-blacklist-patch.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/brand-id-blacklist-patch.sql): 시스템 예약어 브랜드 ID 차단 패치
* [`client_site_requests.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/client_site_requests.sql): 맞춤형 웹사이트 제작 신청 내역
* [`alter_client_sites_onepage.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/alter_client_sites_onepage.sql): 원페이지 템플릿용 컬럼 패치

### 5. 🔬 리서치 & 트렌드 & 유튜브 분석
* [`research-studio-schema.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/research-studio-schema.sql): 딥리서치 프로젝트, 자료 소스, AI 채팅, 산출물
* [`keyword_tool_reports.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/keyword_tool_reports.sql): 키워드 분석 도구 실행 결과 리포트
* [`keyword_trending_history.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/keyword_trending_history.sql): 실시간/일간 키워드 검색량 트렌드 히스토리
* [`youtube-trending-archive.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/youtube-trending-archive.sql): 유튜브 인기 급상승 동영상 일간 아카이브
* [`youtube_popular_archive.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/youtube_popular_archive.sql): 유튜브 숏츠/인기 영상 랭킹 아카이브
* [`youtube-video-analysis.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/youtube-video-analysis.sql): 개별 유튜브 영상 심층 AI 분석 데이터

### 6. 🎵 뮤직 & 🎬 비디오 & 🎁 에셋
* [`music-lyrics-projects.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-lyrics-projects.sql): AI 작사 및 음악 프로젝트
* [`music-albums.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-albums.sql): 앨범 커버 및 트랙 패키징
* [`music-album-plans.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-album-plans.sql): 앨범 기획 문서
* [`video-studio-schema.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/video-studio-schema.sql): AI 비디오 스튜디오 프로젝트 및 씬(Scene) 데이터
* [`free-assets.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/free-assets.sql): 무료/유료 디지털 에셋 저장소
* [`free-assets-requests.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/free-assets-requests.sql): 에셋 다운로드 및 요청 내역
* [`premium-theme-gallery.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/premium-theme-gallery.sql): 프리미엄 웹사이트 테마 갤러리

### 7. 🚀 migrations/ (점진적 변경 스크립트)
* [`migrations/add_theme_vibe_to_client_sites.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/migrations/add_theme_vibe_to_client_sites.sql): 클라이언트 사이트 테마 바이브 컬럼 추가
* [`migrations/add_ai_logs_and_soft_delete.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/migrations/add_ai_logs_and_soft_delete.sql): AI 로그 및 소프트 딜리트 필드 추가
* [`migrations/2026-07-06-add-cookie-consent.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/migrations/2026-07-06-add-cookie-consent.sql): 쿠키 동의 기록 컬럼 추가
