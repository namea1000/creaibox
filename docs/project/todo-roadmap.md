# 📌 CreaiBox 종합 할 일 & 로드맵 (TODO & Roadmap)

본 문서는 크리에이박스(CreaiBox) 플랫폼의 시스템 구축, 검색엔진 노출 최적화(SEO), 백그라운드 자동화 및 주요 기능 개발 관련 할 일(TODO)과 완료 여부 체크리스트를 통합 관리하는 프로젝트 로드맵 대장입니다.

---

## 1. 🔍 검색엔진 실시간 자동 색인 (Auto Indexing & Ping)

사용자가 블로그 글이나 사이트 콘텐츠를 발행할 때 검색엔진(구글, 네이버 등)에 실시간으로 수집 요청 핑(Ping)을 전송하여 검색 노출 속도를 극대화하는 연동 체크리스트입니다.

### 1.1 구글 (Google Indexing API)

* 📖 매뉴얼: [`google-indexing-api-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/google-indexing-api-guide.md>)

- [X] **GCP 콘솔에서 Web Search Indexing API 활성화 완료**
  - GCP 콘솔에서 Google Web Search Indexing API (`indexing.googleapis.com`) 사용 설정 활성화
- [X] **GCP 서비스 계정(Service Account) 생성 및 JSON 키 발급**
  - 서비스 계정 생성 완료 (`creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`) 및 JSON 키 발급 완료
- [X] **구글 서치콘솔 소유자 권한 연동**
  - Google Search Console (`creaibox.com` 도메인 속성) 소유자(Owner) 권한에 서비스 계정 추가 완료
- [X] **Google Indexing API 일일 쿼터 확장(Quota Increase Request) 신청 제출 완료**
  - 기본 제공 200건/일 쿼터를 2,000건/일 이상으로 증액하기 위한 구글 폼 신청서 제출 완료 (`google-indexing-api-guide.md` 4.2절 연동, 구글 심사 후 자동 승인 예정)
- [X] **백엔드 실시간 핑 전송 모듈 구축 완료**
  - Google Indexing API 백엔드 모듈 (`src/lib/server/google-indexing.ts`) 및 API 엔드포인트 (`src/app/api/seo/google-indexing-ping/route.ts`) 구축
  - 1시간 쿨다운 스레틀링 & Trailing Edge Ping (최종 핑 보장) 알고리즘 탑재 및 에디터 발행 시 비동기 핑 트리거 연동 완료
- [ ] **독립 커스텀 도메인 유저 안내 연동**
  - 커스텀 도메인 사용 유저 대상 서치콘솔 소유권 및 Indexing 연동 가이드 정리

* **유저 개인 독립 커스텀 도메인 (mybrand.com 등)**
  유저가 자신만의 독립 도메인을 연결해서 사용하는 경우에는, 구글 서치콘솔 입장에서 ㄴ도메인의 소유권(Owner)이 인증되어야 Indexing API 핑을 받습니다.
  처리 방안:
  ① 독립 도메인은 유저가 직접 구글 서치콘솔에 1회 등록 후 sitemap.xml 및 /feed를 제출하게 안내하거나,
  ② 크리에이박스 GCP 서비스 계정 이메일을 유저 서치콘솔의 소유자로 추가하도록 안내하면 개인 도메인도 자동 핑이 가능해집니다.

### 1.2 네이버 (Naver Search Advisor Partnership API)

- [ ] **네이버 서치어드바이저 수집요청 제휴 API 신청**
  - 네이버 웹마스터 도구 제휴 심사 신청 및 독창적 콘텐츠 무결성 검토 제출
- [ ] **네이버 제휴 승인(ON) 획득 및 API 토큰 수령**
  - 승인 후 발급된 Syndication API 전용 엔드포인트 및 Bearer 토큰 연동
- [ ] **네이버 Syndication XML 핑 전송 모듈 구축**
  - 새 포스트 발행 시 네이버 수집 엔진으로 XML 규격 핑 자동 송신 파이프라인 개발
- [ ] **수집 리포트 및 오류 모니터링**
  - 네이버 서치어드바이저 수집 현황 주기적 모니터링

### 1.3 Bing & 기타 (IndexNow Protocol)

- [ ] **IndexNow API Key 생성 및 검증 파일 배포**
  - `creaibox.com` 루트 경로에 IndexNow API Key TXT 파일 배치
- [ ] **IndexNow 실시간 핑 모듈 탑재**
  - Bing / Yandex / Seznam 등 IndexNow 호환 검색엔진에 새 URL 즉시 파이프라인 수집 요청 연동

---

## 2. 📑 사이트맵 & RSS 피드 노출 최적화 (`sitemap.xml` / `/feed`)

- [X] **동적 사이트맵 컴파일러 (`src/app/sitemap.ts`) 구축**
  - 주요 서비스 페이지 및 멀티테넌트 블로그 글의 `sitemap.xml` 자동 뿜어내기 구현 완료
- [X] **멀티테넌트 RSS 피드 라우터 (`[brand_id]/feed/route.ts`) 구축**
  - 브랜드 도메인별 최신 포스트 피드 자동 생성 및 네이버 500 에러 예방 가상 환영 기사 주입 로직 연동 완료
- [ ] **신규 개설 메인 메뉴 / 공개 페이지 사이트맵 자동 등록 검증**
  - 신규 기능 및 공개 서브메뉴가 `src/app/sitemap.ts` 내 `staticUrls` 배열에 정확히 반영되는지 상시 점검

---

## 3. ⚙️ 백그라운드 무인 자동화 (Background Automation & Cron)

- [X] **유튜브 급상승 트렌드 60개국 및 실시간 검색어 무인 자동 수집 구축**
  - Vercel Cron (`sync-trending`, `sync-keywords`) 및 5종 자동 수집 매뉴얼(`background-automation-execution-5-methods-guide.md`) 완성
- [X] **유튜브 인기 영상 조회수 랭킹 (Most Viewed) 신규 메뉴 및 DB 구축 완료**
  - 전 세계 60개국 & 15개 카테고리별 기간별(7일/30일/역대전체) 조회수 최상위 랭킹 메뉴(`/youtube-trend/popular`), 백엔드 API(`/api/youtube/popular`), DB 보관함(`youtube_popular_archive`), 및 운영 매뉴얼(`youtube-popular-videos-ranking-guide.md`) 구축 완료
- [X] **Vercel Cron 레지스트리 대장(`docs/project/vercel-cron-scheduler-registry.md`) 동기화**
  - 신규 매시간 키워드 크론 등록 및 보안 가드(`CRON_SECRET`) 준수 완료
- [ ] **Supabase `pg_cron` 데이터 만료 및 스냅샷 자동화**
  - 회원 혜택 만료 안내 및 데이터베이스 주간 스냅샷 백업 스케줄링 점검
- [ ] **(필수 과제) Upstash QStash 이벤트 기반 서버리스 큐 전면 도입 (사이트 자동 이관 확장성 확보)**
  - 기존 Vercel Cron + DB Queue (Polling) 아키텍처 한계를 극복하기 위해, 사이트 전체 이관(서브페이지) 시 1만 명이 몰려도 병목(Timeout) 없이 즉시 병렬 렌더링이 가능한 QStash 이벤트 큐 메시지 기반으로 전면 개편 예정.
- [ ] **(필수 과제) 타겟 사이트 미디어(MP4/JPG) Cloudflare R2 무손실 스트리밍 자동 이관 파이프라인 구축**
  - 기존 핫링킹(Hotlinking) 방식의 문제(원본 서버 폐쇄 시 엑스박스, CORS 에러 방어)를 해결하기 위해, 이관 시 원본 미디어 URL 감지 시 Node.js Stream Piping 기법을 통해 Cloudflare R2 (또는 Vercel Blob)로 메모리 터짐(OOM) 없이 실시간 다이렉트 복제 업로드 및 URL DB 영구 치환 로직 전면 구축 예정.

## 4. 📝 AI 에이전트 개발일지 & 가이드라인 준수 (Devlog & Policy)

- [ ] **매일 개발일지 갱신 (`docs/project/2026JulyDevlog.md`)**
  - 개발 태스크 완료 시 `npx tsc --noEmit` 검증 후 개발일지 업데이트
- [ ] **매일 완료 워크스루 갱신 (`docs/project/2026JulyWalkthrough.md`)**
  - 기능 완성 시 워크스루 문서 갱신
- [ ] **B2B / 공개 페이지 다크 & 라이트 모드 하이브리드 지원 검증**
  - 신규 UI 추가 시 `dark:` 접두사 클래스 양방향 무결성 점검

---

## 5. 🎨 AI 커스텀 웹사이트 허브 & 관리자 자동 관제 (Custom Client Site)

- [X] **커스텀 웹사이트 5대 탭 통합 센터 구축 (`/studio/custom-client-site`)**
  - 템플릿 쇼핑(100+종), 내 커스텀 관리, 1:1 신규 제작 신청, 리셀링 파트너십, 관리자 신청 현황 관제탑 5대 탭 탑재 완료
- [X] **관리자 커스텀 신청 현황 (10건) 및 AI 에이전트 자동 제작 구동 연동**
  - 회원 10개 신청 내역 실시간 조회, 상태 변경, `[🤖 AI 에이전트 자동 제작 진행하기]` 안티그래비티 1:1 풀코드 생성 명령 파이프라인 구축 완료
- [X] **운영 및 자동 제작 프로세스 매뉴얼 문서화**
  - 📖 매뉴얼: [`custom-client-site-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-guide.md>) 수록 완료
- [X] **💳 PG 결제 모듈 & 무통장 & 실시간 견적 결제 통합 구축 완료**
  - 포트원(PortOne V2) PG 연동, 토스페이먼츠/카카오페이/신용카드 결제 지원, 실시간 결제 검증 및 도메인 1초 연결 백엔드 구축 완료
  - 📖 아키텍처 명세서: [`portone-pg-payment-architecture.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/portone-pg-payment-architecture.md>)
  - 📖 실무 운용 가이드: [`portone-pg-integration-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/portone-pg-integration-guide.md>)
- [X] **📁 프로젝트 계획서 및 IR/기획 문서 `docs/project/plan/` 폴더 통합 정리 완료 (총 10종)**
  - B2B 파괴적 웹사이트 및 도메인 사업계획서: [`creaibox-website-disruptor-business-plan.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-website-disruptor-business-plan.md>) (가비아 이관 4대 필승 전략, 4단계 이관 파이프라인, 손익 마진 분석 완전 개정 완료)
  - B2C 크리에이터 AI 스튜디오 사업계획서: [`creaibox-b2c-creator-ai-studio-business-plan.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-b2c-creator-ai-studio-business-plan.md>)
  - IR 투자자 브리핑 기술 아키텍처: [`creaibox-investor-technical-architecture.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-investor-technical-architecture.md>)
  - 클라이언트 웹사이트 빌더 기획안: [`client_site_builder_proposal.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/client_site_builder_proposal.md>)
  - 추천 프로그램 기획서: [`referral-program-proposal.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/referral-program-proposal.md>)
- [X] **🌐 CreaiBox Domain Reseller 및 Vercel Domains API 원클릭 도메인 자동화 사업계획서 수록 (#4)**
  - 📖 사업계획서 & 기술 구현안: [`vercel-domains-api-implementation-plan.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/vercel-domains-api-implementation-plan.md>) (.kr, .co.kr 국내 ccTLD, 한글 퓨니코드 IDN, Vercel 본사 대비 초격차 하이브리드 멀티 라우팅 아키텍처 및 법적 명시 조항 전면 추가 완료)
- [X] **📦 기존 블로그 통째 이관 센터 구축 (네이버/티스토리/워드프레스 1초 가져오기 & 구글 드라이브 DB 및 블로그 원고 관리함 자동 동기화)**
  - 📖 운용 매뉴얼 수록: [`external-blog-migration-manual.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/external-blog-migration-manual.md>) 수록 완료
- [X] **🚀 기존 홈페이지 1초 AI 자동 이관 매뉴얼 수록 (이중 저장소 파이프라인 & 1초 서브도메인 통째 개설)**
  - 📖 운용 매뉴얼 수록: [`website-ai-migration-manual.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/website-ai-migration-manual.md>) 수록 완료
- [X] **🟢 네이버 아이디로 로그인 ("네아로") 연동 & 운용 매뉴얼 수록 (OAuth 2.0 & Supabase Auth 자동 회원가입)**
  - 📖 운용 매뉴얼 수록: [`naver-login-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/naver-login-guide.md>) 수록 완료
- [X] **🟢 네이버 검색·쇼핑·트렌드 AI HUB 센터 구축 완료 (`/naver-trend`)**
  - NAVER API HUB 9대 API 연동, 검색어 트렌드 랩, 쇼핑 인사이트, 실시간 라이브 검색 탐색 및 AI 글쓰기 원클릭 파이프라인 탑재 완료
- [X] **🌐 구글 트렌드 (Google Trends) 실시간 분석 센터 구축 완료 (`/studio/keyword/google-trends`)**
  - Google Trends 공식 Daily RSS 연동, 대한민국/미국/일본/영국 실시간 급상승 키워드 TOP 20, 100,000+ 트래픽 지수 및 연관 뉴스 이슈 파이프라인 수록 완료
- [X] **🔍 통합 키워드 트렌드 파워 허브 구축 완료 (loword.co.kr 3대 센터 100% 탑재)**
  - `🔥 실시간 급상승 키워드` (네이버 20개 vs 구글 20개 2열 비교, 날짜/시간별 Supabase DB 저장)
- [X] **🔍 키워드 정밀 도구 듀얼 병렬 분석 & 옵션 C 시계열 히스토리 영구 저장소 구축 완료 (`/studio/keyword/tool`)**
  - 네이버 & 구글 동시 병렬 분석(`Promise.all`) 및 클릭 0.01초 instant 포털 스위칭 탑재
  - DB 1개 Row(`onConflict: keyword`) 내 날짜별 분석 스냅샷 배열(`history_json`) 100% 영구 자산 보존
  - 한 페이지 10개씩 페이징 및 상/하단 넘김 조작 탑재
  - 📖 운용 매뉴얼: [`keyword-precision-tool-architecture-manual.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/keyword-precision-tool-architecture-manual.md>)
  - `📈 네이버 블로그 지수 진단` (블로그 아이디 진단, 최적 3+/준최 레벨 측정, 전체 블로거 리더보드 랭킹)
- [X] **🛒 쇼핑 키워드 & 아이템 소싱 파워 허브 구축 완료 (itemscout.io & datalab.naver.com 100% 탑재)**
  - `🛍️ 쇼핑 키워드 정밀 분석` (쇼핑 검색량, 총 등록 상품수, 0.72 꿀키워드 경쟁강도, 일간/주간 랭킹)
  - `📊 네이버 쇼핑 인사이트` (datalab.naver.com 분야별 1달/3달 인기검색어 TOP 500 & 성별/연령 도넛 차트)
- [X] **🏢 프리미엄 커스텀 기업 홈페이지 개발 지침서 & 카카오톡 링크 공유 OG 메타데이터 고도화 완료**
  - 📖 전용 운영 지침서: [`custom-client-site-development-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-development-guide.md>)
  - 📖 전체 운영 매뉴얼: [`custom-client-site-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-guide.md>)
  - Studio 카테고리 인라인 직접 편집(`✏️`) 및 순서 이동 기능 구축 완료
  - 메인 랜딩페이지 PORTFOLIO 실적 섹션과 블로그 최신 발행글 6개 실시간 동기화 완료
  - 서브도메인/커스텀도메인 SNS 카카오톡 링크 공유 시 커스텀 대표 비주얼(`sotongcheum_hero_bg.png`) 및 전용 타이틀 OpenGraph 자동 노출 완성

---

## 6. 🌍 CreaiBox 글로벌 템플릿 커뮤니티 생태계 (Template Ecosystem)

사용자(또는 관리자)가 AI로 생성하거나 직접 꾸민 아름다운 커스텀 사이트를 시스템 템플릿으로 발행하여, 다른 유저들이 원클릭으로 복제하여 사용할 수 있도록 하는 궁극의 B2B/B2C 마켓플레이스 생태계 구축 과제입니다.

- [ ] **관리자 공식 템플릿 마스터 발행 기능 (`site_templates`)**
  - 대시보드의 특정 `client_sites` 데이터를 `site_templates` 테이블로 100% 무손실 복제 발행하는 `[🌟 템플릿 마스터로 발행]` 기능 구축.
  - 마켓플레이스(템플릿 쇼핑 탭)에 신규 템플릿이 전시되고, 일반 유저가 "이 테마로 시작하기" 클릭 시 해당 JSON 데이터를 유저의 DB로 즉시 복제(Clone)하는 원클릭 아키텍처.
- [ ] **유저 자발적 커뮤니티 공유 (UGC 생태계 모델)**
  - 유저 설정 창에 `[🌍 커뮤니티에 내 사이트 공유하기]` 스위치 추가 (DB `is_public = true` 플래그 연동).
  - Webflow/Figma처럼 다른 유저가 해당 템플릿을 구경하고 복제할 수 있는 "CreaiBox 쇼케이스 갤러리" 페이지 개설. (자발적 바이럴 마케팅 및 유입 파이프라인)
- [ ] **크리에이터 유료 판매 마켓플레이스 (향후 비전)**
  - 금손 유저가 자신이 만든 명작 사이트를 유료(예: 10,000원)로 마켓플레이스에 등록.
  - 결제 시 유저 70%, CreaiBox 30% 수수료 분배 구조를 통한 앱스토어형 크리에이터 이코노미(Creator Economy) 수익 모델 연동.

---

## 8. 📧 커스텀 도메인 이메일 시스템 (Custom Domain Email System)

자사 대표 메일(`ceo@creaibox.com`) 무료 구축, 가입 유저 커스텀 이메일(`user@downhubs.com`), 및 B2B 고객사 도메인 이메일(`contact@clientdomain.com`) 1초 연동 인프라 구축 대장입니다.

- 📖 아키텍처 기술 설계서: [`custom-domain-email-system-spec.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/custom-domain-email-system-spec.md>)
- 📖 운용 가이드 매뉴얼: [`custom-domain-email-system-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-domain-email-system-guide.md>)

- [X] **자사 이메일 무보수 무료 연동 기획 및 Vercel DNS 파이프라인 정리**
  - Vercel 네임서버 유지 상태에서 Resend 5대 DNS 레코드 Vercel Domains API 백그라운드 1초 자동 주입 완료
- [X] **Gmail 앱 연동 수발신 설정 가이드 작성**
  - 개인 Gmail(`@gmail.com`)에서 `ceo@creaibox.com` 이름으로 전세계에 발신/답장하는 Resend SMTP 가이드 정리 완료
- [X] **Resend Domains API & Vercel Domains API 원클릭 무인 1초 이메일 주입 엔진 구현**
  - B2B 고객사 도메인 등록 시 Vercel DNS API (`addDnsRecordToVercel`) 백그라운드 1초 자동 주입 파이프라인 구축 완료
- [X] **CreaiBox 대시보드 내 커스텀 이메일 포워딩 연동 UI 및 API 구축 (/studio/domain-search)**
  - `EmailForwardingManager.tsx` UI, `/api/email-forwarding` CRUD API 및 `docs/database/sql/email_forwarding_rules.sql` DDL 구축 완료
- [X] **Resend Inbound Webhook 실시간 무상태(Stateless Zero-DB) 포워딩 엔진 구축**
  - `/api/webhooks/resend-inbound` 무상태 실시간 포워딩 백엔드 모듈 개발 완료
- [X] **관리자 센터 Resend 이메일 & 도메인 통합 모니터링 대시보드 구축 완료 (/admin/resend)**
  - 등록 도메인 수, 생성된 이메일 별칭 계정 수, 실시간 Inbound/Outbound 이력 KPI 및 3대 탭(도메인계정/수신이력/발송이력) 구축 완료
  - Resend `emails.receiving.get` API 및 `Array.isArray` 2단계 언팩 방어 파이프라인 적용 완료
  - 📖 아키텍처 기술 명세서: [`resend-email-monitoring-architecture.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/resend-email-monitoring-architecture.md>)
  - 📖 운용 가이드 매뉴얼: [`resend-email-domain-monitoring-manual.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/resend-email-domain-monitoring-manual.md>)
- [X] **creaibox.com 서비스 필수 공식 이메일 계정 7대 마스터 가이드 구축 완료**
  - `noreply@`, `auth@`, `support@`, `ceo@`, `contact@`, `billing@`, `admin@` 등 7대 전용 계정 정의 및 Supabase/Resend 연동 가이드 수록 완료
  - 📖 전용 운용 매뉴얼: [`creaibox-official-email-accounts-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/creaibox-official-email-accounts-guide.md>)
- [X] **모든 회원가입 수단(Google, Naver, Kakao, Email) 신규 가입 축하 웰컴 이메일 파이프라인 구축 완료**
  - OAuth 및 이메일 인증 완료 콜백 라우트에서 `sendWelcomeEmail` 비동기 발송 및 `welcome_email_sent` 중복 방지 플래그 연동 완료
  - `noreply@creaibox.com` (Reply-To: `support@creaibox.com`) 프리미엄 다크 테마 HTML 웰컴 메일 및 실시간 발송 테스트 검증 완료
- [ ] **글로벌 영문 사이트 오픈 시 유저 Locale 기반 자동 언어 분기 인증 이메일 발송 파이프라인 연동**
  - 글로벌 사용자 접속 시 Supabase Auth Hook / Send Email API를 통해 브라우저 Locale(ko/en)에 따라 100% 영문 단독 메일 템플릿 자동 분기 발송 구축 예정
- [ ] **글로벌 영문 홈페이지(`creaibox.com/en`) 오픈 시 미니멀/심플 푸터(Footer) 디자인 탑재**
  - 해외 법률(미국/유럽 전자상거래법상 푸터 사업자 정보 강제 표시 의무 없음) 및 MoR(Paddle, Lemon Squeezy) 결제 구조 특성에 맞춰 해외 스타트업(Repaint, Aipress 등) 스타일의 극단적으로 깔끔하고 미니멀한 푸터 UI 적용 (Terms of Service, Privacy Policy, Copyright, Social Links만 깔끔하게 배치).
- [ ] **고객사 플랜별 일일/월간 발송 쿼터(Quota Throttling) 및 스팸 차단 안전 모듈 탑재**
  - 고객사별 일일 50~300건 쿼터 초과 시 자동 발송 차단 및 추가 쿼터 팩 결제 상품 연동 예정
- [ ] **헤비 고객사 전용 API 키 입력 (BYOK: Bring Your Own Key) 옵션 제공**
  - 일 수천~수만 건 대량 메일 발송 고객사 대상 자가 Resend API 키 등록 모듈 구축 예정

---

## 9. 🗺️ Google Maps Platform API 서비스 구축 (Google Maps Integration)

Google Maps Platform (Places, Maps JS, Routes, Distance Matrix API) 기반 위치 지능형 연동 및 AI 서비스 구축 로드맵 대장입니다.

> 💡 **비용 절감 및 가성비 최우선 방침에 따라 구글 맵 유료 구독은 추후 보류하며, 서비스 필요 시 100% 무료 카카오/네이버 지도 API(월 900만~1,000만 건 무료)로 대체 개발 예정입니다.**

- 📖 전용 운용 가이드 매뉴얼: [`google-maps-platform-api-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/google-maps-platform-api-guide.md>)
- 📖 전용 장소 API 매뉴얼: [`google-places-api-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/google-places-api-guide.md>)

- [X] **Google Maps Platform API 서비스 구축 매뉴얼 수립 완료**
  - Places API, Maps JS, Routes & Distance Matrix API 기획 및 5대 실전 서비스 구축 과제 정의 완료
- [X] **Google Places API (New/v1) 전용 구축 및 연동 가이드 작성 완료**
  - Text Search, Place Details, Autocomplete, Field Masking (`X-Goog-FieldMask`) 90% 비용 절감 기획 및 TypeScript 스니펫 수립 완료
- [ ] **[추후 보류] AI 커스텀 웹사이트 빌더 (`/client-site-builder`) 3D 커스텀 지도 및 주소 자동완성 연동**
  - 필요 시 100% 무료 카카오/네이버 주소 자동완성 및 지도 모듈 대체 연동 예정
- [ ] **[추후 보류] AI 맛집/여행 블로그 자동 글쓰기 (장소/별점/리뷰 실시간 수집 연동)**
  - Zero Fake Data 원칙 준수 100% 진짜 장소 데이터 무료 파이프라인 대체 연동 예정

---

## 10. 🛡️ Reserved Brand IDs & 브랜드 ID 2차 안전 검증 시스템 (Brand Security & Scalability)

CreaiBox 브랜드 ID(`{brand_id}.creaibox.com`) 예약어/블랙리스트 Egress 99% 절감 최적화, Groq LLaMA 3.3 70B AI 기반 트렌드 자동 탐지 및 2차 안전 심사 모듈 완료 대장입니다.

- 📖 전용 아키텍처 및 운용 가이드: [`reserved-brand-ids.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/database/reserved-brand-ids.md>)

- [X] **하이브리드 브랜드 검증 및 Supabase DB Egress 99% 절감 구조 전환**
  - 고정 정적 6개 카테고리(13,396개)를 `reservedBrandsStatic.ts` 메모리 Set으로 전환 및 DB rows 삭제 (~59,000개 축소).
  - 관리자 API `select("*")` 전체 로드 제거 및 페이지네이션(`range()`) 적용 완료.
- [X] **Groq LLaMA 3.3 70B AI 신규 트렌드 브랜드 100개 대량 탐지 모듈 연동**
  - `/api/admin/brands/scan` API 구축 및 `/admin/reserved-words` 상단 `[ AI Trend Scan ]` 팝업 연동.
  - 16개 동적 카테고리 전체 지원, 삼중 필터링 및 `upsert(ignoreDuplicates: true)` 중복 에러 완전 방어 완료.
- [X] **예약어 관리 목록 `Target Entity (대상 기관/브랜드)` 스마트 뱃지 컬럼 추가**
  - `/admin/reserved-words` 테이블에 에메랄드 뱃지 배치 및 `parseReasonEntity` 헬퍼를 통한 기관명/상표명 자동 추출 연동 완료.
- [X] **구글 드라이브 이미지 스마트 2원화 WebP 압축 및 중앙 프록시 API 구축**
  - `/api/free-assets/proxy` 중앙 프록시 라우트 고도화 및 `formatImageUrl` 유틸리티 연동.
  - 카드 썸네일 `type=thumb` (800px 30~40KB WebP) vs 블로그 본문 상세 `type=detail` (1400px 고화질 WebP) 스마트 2원화 서빙 반영 완료.
  - 블로그 목록 리소스 크기 2.7MB ➡️ 350KB (85% 이상 대폭 절감) 및 LCP 1.8초 이내 가속 달성.
  - 📖 아키텍처 & 운용 매뉴얼: [`media-proxy-architecture.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/media-proxy-architecture.md>) / [`google-drive-image-proxy-web-optimization-manual.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/google-drive-image-proxy-web-optimization-manual.md>) 수록 완료.
- [X] **네이버 뉴스급 0.01초 Instant 오픈 & Vercel 비용 0원 방어 파이프라인 구축**
  - `SmartIntentLink` 0.15초 체류 의도 감지 프리패치 엔진 및 본문 `revalidate = 300` CDN 무상 캐싱 연동.
  - 플랫폼 5대 핵심 영역(헤더 GNB 전체 메뉴, 사이드바 전체 메뉴, 메인 랜딩 퀵버튼/키워드 바, 공식/개별 블로그 카드, 푸터) 및 16대 커스텀 웹사이트 템플릿 전면 표준 전환 완료.
  - 📖 아키텍처 & 운용 매뉴얼: [`instant-navigation-prefetch-architecture.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/01_core-and-infra/instant-navigation-prefetch-architecture.md>) / [`instant-navigation-0.01s-prefetch-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/01_core-and-infra/instant-navigation-0.01s-prefetch-guide.md>) 최신화 완료.
- [X] **서브도메인 신청 심사 2차 AI & Web 안전 검증 모듈 구축**
  - `/admin/brands` 심사 행에 `[ ✨ AI 검증 ]` 버튼 추가 및 `/api/admin/brands/verify` 백엔드 연동.
  - 위험도 뱃지(`SAFE`/`WARNING`/`DANGER`), 위험점수(0~100), AI 종합 리포트 모달 구현.
  - Google / Naver 1초 실시간 검색 딥링크 연동 및 `[ 🟢 승인 ]` / `[ 🔴 거절 & 예약어 DB 등록 ]` 원클릭 일괄 처리 연동 완료.
- [X] **원고 본문 1번째 이미지 썸네일 무인 자동 추출 & `generated_images` 100% 동기화 엔진 구축**
  - [`auto-extract-thumbnail.ts`](<file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/auto-extract-thumbnail.ts>) 백엔드 헬퍼 모듈 구축 및 [`fill_missing_thumbnails.js`](<file:///Users/a1234/Local%20Sites/creaibox/scratch/fill_missing_thumbnails.js>) 배치 스크립트로 기존 124개 원고 썸네일 100% 동기화 완료.
  - 목록 쿼리 본문(`content`) 생략을 통한 Supabase DB Egress 비용 0원 방어, 0.01초 속도 및 썸네일 100% 노출 보장 완료.
- [X] **블로그 원고 관리 목록 400 Bad Request 쿼리 에러 긴급 복구 (`parent_id` 제거)**
  - `fetchCreaiboxManuscripts` select 목록에서 DB 미존재 컬럼 `parent_id` 제거하여 204개 전체 원고 조회 완벽 복구 완료.
- [X] **원고 편집 페이지 무한 재귀 호출 루프 방어 & 최고 관리자(`ADMIN`) 전역 상세 조회 구축**
  - `directFetchAttempted` 락으로 브라우저 프리징 100% 차단 및 관리자 권한 타 계정 원고 조회/수정 지원 완료.
- [X] **공식 블로그 메인 레이아웃 템플릿(Card Grid / List / News) 동적 엔진 구축**
  - `src/app/blog/page.tsx`에 `blog_template` 연동하여 `Card Grid` 2열 격자 카드, `List Feed`, `News Flow` 실시간 테마 변경 완벽 구현.

---

## 6. 📊 실시간 라이브 위젯 (Live Portal Widget: 날씨 / 미세먼지 / 환율 / 증시)

- 📖 전용 기획 & 아키텍처 명세서: [`live-portal-widget-spec.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/arch/live-portal-widget-spec.md>)

- [ ] **실시간 위치 기반 날씨 & 미세먼지 수집 모듈 개발**
  - Open-Meteo & 기상청 API 연동, 브라우저 IP/위치 기반 24시간 기온 및 미세먼지 뱃지 렌더링.
- [ ] **실시간 환율 전광판 & 미니 차트 연동**
  - `exchange-rate.ts` 백엔드 연동, USD, JPY, EUR 실시간 환율 및 3개월 변동 그래프 컴포넌트 탑재.
- [ ] **실시간 코스피 / 코스닥 / S&P 500 증시 지수 릴레이 구축**
  - Yahoo Finance API 연동, 주가지수 및 실시간 등락률 렌더링.
- [ ] **네이버 포털형 메인 & 스튜디오 대시보드 위젯 컴포넌트 배치**
  - 포털형 우측 사이드바 및 스튜디오 웰컴 영역 Glassmorphism 3대 탭 카드 렌더링.
- [x] 인기 영상 조회수 랭킹 YouTube Search API 쿼터 고갈 분석 완료 및 현행 유지 (100쿼터 제한 방치 정책 확정)

---

## 11. 🛡️ 전 메뉴 데이터 해자(Data Moat) 인프라 고도화

- [ ] **블로그 자동 포스팅 (Writing Studio) 데이터 해자 적용**
  - `writing_creaibox_posts`, `writing_naver_posts`, `writing_wordpress_posts` 테이블 업데이트
  - 생성 시 AI에게 전송한 '원본 텍스트 프롬프트' JSONB 로깅 보존 파이프라인 연동 (`ai_generation_logs` 활용)
  - 삭제 시 완전 삭제(Hard Delete)를 금지하고 `status = 'DELETED'` 속성을 통한 Soft Delete로 전환 (유저의 오답 노트/피드백 루프 데이터 확보)
