# 📌 CreAibox 종합 할 일 & 로드맵 (TODO & Roadmap)

본 문서는 크리에이박스(CreAibox) 플랫폼의 시스템 구축, 검색엔진 노출 최적화(SEO), 백그라운드 자동화 및 주요 기능 개발 관련 할 일(TODO)과 완료 여부 체크리스트를 통합 관리하는 프로젝트 로드맵 대장입니다.

---

## 1. 🔍 검색엔진 실시간 자동 색인 (Auto Indexing & Ping)

사용자가 블로그 글이나 사이트 콘텐츠를 발행할 때 검색엔진(구글, 네이버 등)에 실시간으로 수집 요청 핑(Ping)을 전송하여 검색 노출 속도를 극대화하는 연동 체크리스트입니다.

### 1.1 구글 (Google Indexing API)
* 📖 매뉴얼: [`google-indexing-api-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/google-indexing-api-guide.md)

- [x] **GCP 콘솔에서 Web Search Indexing API 활성화 완료**
  - GCP 콘솔에서 Google Web Search Indexing API (`indexing.googleapis.com`) 사용 설정 활성화
- [x] **GCP 서비스 계정(Service Account) 생성 및 JSON 키 발급**
  - 서비스 계정 생성 완료 (`creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`) 및 JSON 키 발급 완료
- [x] **구글 서치콘솔 소유자 권한 연동**
  - Google Search Console (`creaibox.com` 도메인 속성) 소유자(Owner) 권한에 서비스 계정 추가 완료
- [x] **Google Indexing API 일일 쿼터 확장(Quota Increase Request) 신청 제출 완료**
  - 기본 제공 200건/일 쿼터를 2,000건/일 이상으로 증액하기 위한 구글 폼 신청서 제출 완료 (`google-indexing-api-guide.md` 4.2절 연동, 구글 심사 후 자동 승인 예정)
- [x] **백엔드 실시간 핑 전송 모듈 구축 완료**
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

- [x] **유튜브 급상승 트렌드 60개국 및 실시간 검색어 무인 자동 수집 구축**
  - Vercel Cron (`sync-trending`, `sync-keywords`) 및 5종 자동 수집 매뉴얼(`background-automation-execution-5-methods-guide.md`) 완성
- [x] **Vercel Cron 레지스트리 대장(`docs/project/vercel-cron-scheduler-registry.md`) 동기화**
  - 신규 매시간 키워드 크론 등록 및 보안 가드(`CRON_SECRET`) 준수 완료
- [ ] **Supabase `pg_cron` 데이터 만료 및 스냅샷 자동화**
  - 회원 혜택 만료 안내 및 데이터베이스 주간 스냅샷 백업 스케줄링 점검

---

## 4. 📝 AI 에이전트 개발일지 & 가이드라인 준수 (Devlog & Policy)

- [ ] **매일 개발일지 갱신 (`docs/project/2026JulyDevlog.md`)**
  - 개발 태스크 완료 시 `npx tsc --noEmit` 검증 후 개발일지 업데이트
- [ ] **매일 완료 워크스루 갱신 (`docs/project/2026JulyWalkthrough.md`)**
  - 기능 완성 시 워크스루 문서 갱신
- [ ] **B2B / 공개 페이지 다크 & 라이트 모드 하이브리드 지원 검증**
  - 신규 UI 추가 시 `dark:` 접두사 클래스 양방향 무결성 점검

---

## 5. 🎨 AI 커스텀 웹사이트 허브 & 관리자 자동 관제 (Custom Client Site)

- [x] **커스텀 웹사이트 5대 탭 통합 센터 구축 (`/studio/custom-client-site`)**
  - 템플릿 쇼핑(100+종), 내 커스텀 관리, 1:1 신규 제작 신청, 리셀링 파트너십, 관리자 신청 현황 관제탑 5대 탭 탑재 완료
- [x] **관리자 커스텀 신청 현황 (10건) 및 AI 에이전트 자동 제작 구동 연동**
  - 회원 10개 신청 내역 실시간 조회, 상태 변경, `[🤖 AI 에이전트 자동 제작 진행하기]` 안티그래비티 1:1 풀코드 생성 명령 파이프라인 구축 완료
- [x] **운영 및 자동 제작 프로세스 매뉴얼 문서화**
  - 📖 매뉴얼: [`custom-client-site-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-guide.md) 수록 완료
- [x] **💳 PG 결제 모듈 & 무통장 & 실시간 견적 결제 독립 카드 구축**
  - 포트원, 토스페이먼츠, 카카오페이 MID 입력, 무통장 입금 계좌, 실시간 견적 결제 스위치 및 PG사 가맹 링크 수록 완료
- [x] **📁 프로젝트 계획서 및 IR/기획 문서 `docs/project/plan/` 폴더 통합 정리 완료 (총 10종)**
  - B2B 파괴적 웹사이트 및 도메인 사업계획서: [`creaibox-website-disruptor-business-plan.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-website-disruptor-business-plan.md) (가비아 이관 4대 필승 전략, 4단계 이관 파이프라인, 손익 마진 분석 완전 개정 완료)
  - B2C 크리에이터 AI 스튜디오 사업계획서: [`creaibox-b2c-creator-ai-studio-business-plan.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-b2c-creator-ai-studio-business-plan.md)
  - IR 투자자 브리핑 기술 아키텍처: [`creaibox-investor-technical-architecture.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/creaibox-investor-technical-architecture.md)
  - 클라이언트 웹사이트 빌더 기획안: [`client_site_builder_proposal.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/client_site_builder_proposal.md)
  - 추천 프로그램 기획서: [`referral-program-proposal.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/referral-program-proposal.md)
- [x] **🌐 CreAibox Domain Reseller 및 Vercel Domains API 원클릭 도메인 자동화 사업계획서 수록 (#4)**
  - 📖 사업계획서 & 기술 구현안: [`vercel-domains-api-implementation-plan.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/plan/vercel-domains-api-implementation-plan.md) (.kr, .co.kr 국내 ccTLD, 한글 퓨니코드 IDN, Vercel 본사 대비 초격차 하이브리드 멀티 라우팅 아키텍처 및 법적 명시 조항 전면 추가 완료)
- [x] **📦 타 블로그 통째 이관 센터 구축 (네이버/티스토리/워드프레스 1초 가져오기 & 구글 드라이브 DB 및 블로그 원고 관리함 자동 동기화)**
  - 📖 운용 매뉴얼 수록: [`external-blog-migration-manual.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/external-blog-migration-manual.md) 수록 완료
- [x] **🚀 기존 홈페이지 1초 AI 자동 이관 매뉴얼 수록 (이중 저장소 파이프라인 & 1초 서브도메인 통째 개설)**
  - 📖 운용 매뉴얼 수록: [`website-ai-migration-manual.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/website-ai-migration-manual.md) 수록 완료
- [x] **🟢 네이버 아이디로 로그인 ("네아로") 연동 & 운용 매뉴얼 수록 (OAuth 2.0 & Supabase Auth 자동 회원가입)**
  - 📖 운용 매뉴얼 수록: [`naver-login-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/naver-login-guide.md) 수록 완료
- [x] **🟢 네이버 검색·쇼핑·트렌드 AI HUB 센터 구축 완료 (`/naver-trend`)**
  - NAVER API HUB 9대 API 연동, 검색어 트렌드 랩, 쇼핑 인사이트, 실시간 라이브 검색 탐색 및 AI 글쓰기 원클릭 파이프라인 탑재 완료
- [x] **🌐 구글 트렌드 (Google Trends) 실시간 분석 센터 구축 완료 (`/studio/keyword/google-trends`)**
  - Google Trends 공식 Daily RSS 연동, 대한민국/미국/일본/영국 실시간 급상승 키워드 TOP 20, 100,000+ 트래픽 지수 및 연관 뉴스 이슈 파이프라인 수록 완료
- [x] **🔍 통합 키워드 트렌드 파워 허브 구축 완료 (loword.co.kr 3대 센터 100% 탑재)**
  - `🔥 실시간 급상승 키워드` (네이버 20개 vs 구글 20개 2열 비교, 날짜/시간별 Supabase DB 저장)
  - `🔍 키워드 정밀 도구` (검색량 꺾은선 차트, SERP 노출 배치, 상위 블로그 지수, 연관어 CPC)
  - `📈 네이버 블로그 지수 진단` (블로그 아이디 진단, 최적 3+/준최 레벨 측정, 전체 블로거 리더보드 랭킹)
- [x] **🛒 쇼핑 키워드 & 아이템 소싱 파워 허브 구축 완료 (itemscout.io & datalab.naver.com 100% 탑재)**
  - `🛍️ 쇼핑 키워드 정밀 분석` (쇼핑 검색량, 총 등록 상품수, 0.72 꿀키워드 경쟁강도, 일간/주간 랭킹)
  - `📊 네이버 쇼핑 인사이트` (datalab.naver.com 분야별 1달/3달 인기검색어 TOP 500 & 성별/연령 도넛 차트)
- [x] **🏢 프리미엄 커스텀 기업 홈페이지 개발 지침서 & 카카오톡 링크 공유 OG 메타데이터 고도화 완료**
  - 📖 전용 운영 지침서: [`custom-client-site-development-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-development-guide.md)
  - 📖 전체 운영 매뉴얼: [`custom-client-site-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/custom-client-site-guide.md)
  - Studio 카테고리 인라인 직접 편집(`✏️`) 및 순서 이동 기능 구축 완료
  - 메인 랜딩페이지 PORTFOLIO 실적 섹션과 블로그 최신 발행글 6개 실시간 동기화 완료
  - 서브도메인/커스텀도메인 SNS 카카오톡 링크 공유 시 커스텀 대표 비주얼(`sotongcheum_hero_bg.png`) 및 전용 타이틀 OpenGraph 자동 노출 완성








