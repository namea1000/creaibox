# 🗄️ CreaiBox Database Documentation & SQL Hub

이 디렉토리는 **CreaiBox**의 Supabase PostgreSQL 데이터베이스 스키마 명세서(`.md`)와 실제 실행 가능한 DDL/마이그레이션 쿼리(`.sql`)들을 체계적으로 관리하는 중앙 저장소입니다.

---

## 📁 디렉토리 구조 및 역할 분리

```
docs/database/
├── README.md                           # 데이터베이스 문서 및 SQL 색인 허브 (본 문서)
├── schema.md                           # 전체 핵심 스키마 요약
├── supabase.md                         # Supabase 설정 및 연결 가이드
├── storage.md                          # Supabase Storage 버킷 정책 가이드
├── reserved-brand-ids.md               # 77,000+ 브랜드 ID 분류 및 시드 가이드
│
├── *-schema.md                         # [스키마 명세서] 테이블별 상세 컬럼, RLS, 관계도 명세
│   ├── profiles-schema.md
│   ├── writing-creaibox-posts-schema.md
│   ├── client-site-builder-schema.md
│   └── ...
│
└── sql/                                # [실행 DDL & 마이그레이션] Supabase SQL Editor용 파일
    ├── README.md                       # SQL 파일 실행 순서 및 카테고리별 색인
    ├── *.sql                           # 기능/테이블별 생성 DDL
    └── migrations/                     # 점진적 스키마 변경/패치 마이그레이션
```

---

## 📑 테이블별 스키마 명세서 & 실행 SQL 매핑 색인

| 분류 | 스키마 명세 문서 (`.md`) | 실행 SQL DDL (`docs/database/sql/*.sql`) | 주요 대상 테이블 |
| :--- | :--- | :--- | :--- |
| **회원 & 계정** | [`profiles-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/profiles-schema.md) | [`profiles.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql) | `profiles` |
| **관리자 보안** | [`admin-whitelist-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/admin-whitelist-schema.md) | [`admin-whitelist.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/admin-whitelist.sql) | `admin_whitelist` |
| **AI 사용량 로그** | [`ai-generation-usage-logs-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/ai-generation-usage-logs-schema.md) | [`ai-generation-usage-logs.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-generation-usage-logs.sql) | `ai_generation_usage_logs` |
| **브랜드 & 서브도메인** | [`blog-subdomains-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/blog-subdomains-schema.md) | [`blog-subdomains.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/blog-subdomains.sql) | `blog_subdomains`, `reserved_brand_ids` |
| **클라이언트 사이트** | [`client-site-builder-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/client-site-builder-schema.md) | [`client-site-builder.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/client-site-builder.sql) | `client_sites`, `client_site_pages` |
| **콘텐츠 플래너** | [`content-planner-schema-v1.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/content-planner-schema-v1.md) | [`content-planner-schema-v1.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/content-planner-schema-v1.sql) | `content_planner_campaigns`, `planner_tasks` |
| **워크스페이스 노트** | [`cre-workspace-notes-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/cre-workspace-notes-schema.md) | [`cre-workspace-notes.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/cre-workspace-notes.sql) | `cre_note_folders`, `cre_notes` |
| **무료/프리미엄 에셋** | [`free-assets-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/free-assets-schema.md) | [`free-assets.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/free-assets.sql) | `free_assets`, `asset_downloads` |
| **에셋 신청/요청** | [`free-assets-requests-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/free-assets-requests-schema.md) | [`free-assets-requests.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/free-assets-requests.sql) | `free_asset_requests` |
| **AI 생성 이미지** | [`generated-images-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/generated-images-schema.md) | [`generated-images.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/generated-images.sql) | `generated_images` |
| **뮤직 앨범 기획** | [`music-album-plans-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/music-album-plans-schema.md) | [`music-album-plans.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-album-plans.sql) | `music_album_plans` |
| **뮤직 앨범** | [`music-albums-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/music-albums-schema.md) | [`music-albums.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-albums.sql) | `music_albums` |
| **뮤직 가사 프로젝트** | [`music-lyrics-projects-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/music-lyrics-projects-schema.md) | [`music-lyrics-projects.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/music-lyrics-projects.sql) | `music_lyrics_projects` |
| **리서치 스튜디오** | [`research-studio-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/research-studio-schema.md) | [`research-studio-schema.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/research-studio-schema.sql) | `research_projects`, `research_sources` |
| **비디오 스튜디오** | [`video-studio-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/video-studio-schema.md) | [`video-studio-schema.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/video-studio-schema.sql) | `video_projects`, `video_scenes` |
| **원고 (CreaiBox)** | [`writing-creaibox-posts-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/writing-creaibox-posts-schema.md) | [`writing-creaibox-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-creaibox-posts.sql) | `writing_creaibox_posts` |
| **블로그 온디맨드 웹훅** | [`writing-creaibox-posts-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/writing-creaibox-posts-schema.md) | [`webhook-revalidate-blog.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/webhook-revalidate-blog.sql) | `writing_creaibox_posts` (Webhook Trigger) |
| **원고 (네이버)** | [`writing-naver-posts-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/writing-naver-posts-schema.md) | [`writing-naver-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-naver-posts.sql) | `writing_naver_posts` |
| **원고 (워드프레스)** | [`writing-wordpress-posts-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/writing-wordpress-posts-schema.md) | [`writing-wordpress-posts.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/writing-wordpress-posts.sql) | `writing_wordpress_posts` |
| **유튜브 트렌딩 아카이브** | [`youtube-trending-archive-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/youtube-trending-archive-schema.md) | [`youtube-trending-archive.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/youtube-trending-archive.sql) | `youtube_trending_archive` |
| **유튜브 인기 영상** | - | [`youtube_popular_archive.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/youtube_popular_archive.sql) | `youtube_popular_archive` |
| **이메일 포워딩 룰** | - | [`email_forwarding_rules.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/email_forwarding_rules.sql) | `email_forwarding_rules` |
| **키워드 도구 리포트** | - | [`keyword_tool_reports.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/keyword_tool_reports.sql) | `keyword_tool_reports` |
| **키워드 트렌딩 히스토리** | [`keyword-trending-history-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/keyword-trending-history-schema.md) | [`keyword_trending_history.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/keyword_trending_history.sql) | `keyword_trending_history` |
| **AI 비서 / 어시스턴트** | [`ai-assistant-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/ai-assistant-schema.md) | [`ai-assistant.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-assistant.sql) | `ai_conversations`, `ai_messages` |
| **AI 숏츠 생성기** | - | [`ai-shorts-generator.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-shorts-generator.sql) | `ai_shorts_projects` |
| **시스템 설정** | - | [`system-settings.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/system-settings.sql) | `system_settings` |
| **프리미엄 테마 갤러리** | - | [`premium-theme-gallery.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/premium-theme-gallery.sql) | `premium_theme_gallery` |

---

## 🛠️ 개발 및 유지보수 규칙

1. **스키마 추가 시 원칙**:
   - 신규 테이블을 설계할 때는 스키마 명세서(`docs/database/<feature>-schema.md`)와 실행 SQL(`docs/database/sql/<feature>.sql`)을 함께 작성합니다.
   - 기존 테이블에 컬럼을 추가할 때는 `docs/database/sql/migrations/`에 마이그레이션 스크립트를 추가합니다.
2. **SQL 실행 방법**:
   - Supabase 관리자 콘솔의 **SQL Editor**에 해당 `.sql` 파일의 내용을 복사하여 실행합니다.
