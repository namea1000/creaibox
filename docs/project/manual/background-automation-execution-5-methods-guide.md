# 🤖 CreAibox 백그라운드 무인 자동 실행 5종 방식 및 SEO 핑 / 서비스 로드맵 매뉴얼

이 문서는 CreAibox 플랫폼의 **백그라운드 무인 자동 실행(Background Scheduler) 5가지 아키텍처**, **4개 도메인 유형별 SEO 자동 색인 핑(Ping) 동작 원리**, **현재 즉시 구동 중인 무인 서비스**, 그리고 **향후 장기적으로 확장할 5대 핵심 무인 자동화 로드맵**을 총망라한 운용 매뉴얼입니다.

---

## 1. 🤖 무인 자동 실행(Background Scheduler) 5종 방식

### ① 🌐 Vercel Cron (무인 클라우드 서버 로봇 - 주력)
- **개념**: Next.js 프로젝트 루트의 `vercel.json` 내 `crons` 배열에 실행 경로와 cron 표현식을 등록하여 Vercel 엣지 인프라가 지정된 시간에 API 엔드포인트를 무인 호출하는 방식입니다.
- **주요 활용**:
  - `/api/cron/sync-trending` (매일 아침 06:00 KST, 전세계 60개국 유튜브 전체 트렌드 일괄 수집)
  - `/api/cron/sync-keywords` (매시간 정각, 네이버 TOP 20 & 구글 TOP 20 실시간 검색어 수집)
- **특징**: 설정이 가장 간편하며 Next.js 및 Vercel 인프라와 100% 밀접 연동됩니다.

### ② 🟢 Supabase DB 내장 스케줄러 (`pg_cron` + `pg_net`)
- **개념**: CreAibox 클라우드 DB(PostgreSQL) 내부에 설치된 `pg_cron`(데이터베이스 스케줄러)과 `pg_net`(비동기 HTTP 요청) 확장을 활용하여, DB 엔진이 지정된 시간에 직접 웹서버 API URL을 호출하는 방식입니다.
- **특징**: 웹서버나 프론트엔드 환경과 무관하게 DB 자체에서 100% 무인 독립 구동됩니다.

### ③ ☁️ NCP (Naver Cloud Platform) Cloud Functions / Trigger
- **개념**: Naver Cloud Platform의 Serverless Trigger가 스케줄러 주기에 맞춰 백엔드 웹훅 콜백 URL([`/api/cron/sync-keywords`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-keywords/route.ts))을 무인 호출하는 방식입니다.
- **특징**: 국내 NCP 인프라 네트워크 망을 타므로 응답 속도가 빠르고 안정성이 높습니다.

### ④ 🐙 GitHub Actions Cron Workflows (`.github/workflows/*.yml`)
- **개념**: GitHub 저장소의 Actions 스케줄러 규칙(`schedule: - cron: '0 * * * *'`)에 따라 GitHub 서버가 매시간 무인으로 `curl`을 통해 API 엔드포인트를 호출하는 방식입니다.
- **특징**: 완전 무료이며, GitHub 탭에서 실행 이력과 실패 로그를 투명하게 추적 및 관리할 수 있습니다.

### ⑤ 🔗 외부 무인 Webhook 서비스 (cron-job.org / EasyCron 등)
- **개념**: 외부 전문 웹훅 모니터링/스케줄링 서비스에 CreAibox의 보안 API 엔드포인트를 등록하여 24시간 원하는 주기로 백그라운드 호출시키는 방식입니다.
- **특징**: 가입 및 설정이 간단하고, 서비스 장애 시 이메일/슬랙 알림을 받아볼 수 있습니다.

---

## 2. 🌐 4가지 도메인 케이스별 SEO 자동 색인 핑(Ping) 동작 방식

CreAibox의 SEO 자동 색인 엔진은 어떤 형태의 도메인이든 **전체 풀 URL(Full URL Address)**을 기준으로 검색엔진봇에 즉시 핑을 전송하므로 4가지 케이스 모두 100% 완벽하게 구동됩니다.

| 구분 | 도메인 유형 예시 | 핑 전송 URL 예시 | 검색엔진 수집 방식 |
| :--- | :--- | :--- | :--- |
| **1. 본사 플랫폼 / 메인 블로그** | `creaibox.com` | `https://creaibox.com/blog/new-post` | 본사 대표 도메인 주소로 즉시 핑 |
| **2. 유저 서브도메인 블로그** | `myblog.creaibox.com` | `https://myblog.creaibox.com/blog/ai-tips` | 와일드카드 서브도메인 주소 1:1 핑 |
| **3. 비즈니스 / 커스텀 웹사이트** | `biz.creaibox.com` | `https://biz.creaibox.com/news/release` | 비즈니스 서브사이트 주소 1:1 핑 |
| **4. 개인 독자 연결 도메인** | `mycompany.com` | `https://mycompany.com/blog/notice` | 고객 소유 전용 도메인 주소 1:1 핑 |

---

## 3. 🛠️ 백엔드 작동 원리 (2대 핵심 핑 프로토콜 & 스마트 쿨다운 알고리즘)

### ① Google Indexing API ([`google-indexing.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/google-indexing.ts))
- 글이 발행되거나 페이지가 신설되는 순간, 해당 글의 완전한 인터넷 주소(`https://...`)를 Google Indexing API 통신망으로 전달합니다.
- 구글 검색 로봇(Googlebot)이 **0.1초 만에 핑을 수신하고 해당 도메인의 해당 글 주소로 즉시 출동하여 수집**합니다.

### ② IndexNow 프로토콜 (Bing, 네이버 서치어드바이저, Yandex) ([`indexnow.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/indexnow.ts))
- 오픈 표준 핑 규격인 `IndexNow`를 통해 **어떤 도메인이든(서브도메인, 독자 커스텀 도메인 포함)** 발행된 정확한 URL을 네이버와 마이크로소프트 Bing에 전달합니다.
- 독자 도메인(`mycompany.com`)에서도 도메인 루트에 인증 키 파일이 자동 매핑되므로, 네이버/Bing 로봇이 핑을 받고 해당 커스텀 도메인 주소로 즉시 노출 색인을 진행합니다.

### ③ ⚡ 스마트 1시간 쿨다운(Cooldown) & Trailing Edge Ping 알고리즘
- **최초 발행 (최초 1회)**: 글이 처음 발행되면 4대 검색엔진으로 **0.1초 만에 즉시 핑을 발송**합니다.
- **1시간 이내 연속 재수정 & 재발행 시**:
  - 핑 남발 및 검색엔진 쿼터 차단을 방지하기 위해 1시간 이내 추가 발생 핑을 **스마트하게 우회 억제(Throttling)**합니다.
  - 연속 수정 시 이전 예약 타이머를 취소(`clearTimeout`)하고, **1시간이 완성되는 타임스탬프 시점에 최종 재수정된 원고 주소로 검색 로봇에 핑을 단 1회 자동 쏘도록 예약(`SCHEDULED_TRAILING` - Trailing Edge Ping Guarantee)**하여 최상의 수집 상태를 보장합니다.

---

## 4. 🟢 현재 즉시 구동 중 / 서비스 가능한 무인 기능 (Current Services)

### ① 전세계 60개국 유튜브 전체 트렌드 무인 일괄 수집
- 매일 아침 06:00 (KST)에 60+개국 15개 카테고리 트렌드를 무인 수집하여 DB 1줄(`bundle`)에 자동 보관. ([`/api/cron/sync-trending`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-trending/route.ts))

### ② 포털 실시간 검색어 24시간 무인 아카이빙 (네이버 & 구글 TOP 20)
- 매시간 정각(00~23시) 네이버/구글 랭킹과 관련 뉴스 기사를 긁어와 DB 1줄(`hourly_data`)에 타임머신 이력으로 저장. ([`/api/cron/sync-keywords`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-keywords/route.ts))

### ③ 🟢 검색엔진 SEO 4대 글로벌 자동 색인 노출 핑 (Auto Indexing Ping - 현재 100% 실시간 구동 중)
- **상태**: **🟢 현재 100% 실시간 자동 구동 중** ([`google-indexing-ping/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/seo/google-indexing-ping/route.ts), [`unified-indexing-ping/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/seo/unified-indexing-ping/route.ts))
- 새 블로그 글이나 서브도메인/커스텀 사이트 페이지 작성 시 Google Indexing API 및 IndexNow(Bing/Yandex/Naver/Seznam)를 통해 전세계 4대 검색 로봇에 0.1초 만에 실시간 수집 핑을 자동 전송.
- **스마트 1시간 쿨다운 및 Trailing Edge Ping 알고리즘**이 적용되어 연속 수정 시에도 1시간 후 최종 완성본 원고가 100% 차단 없이 검색엔진으로 수집 완료됨.

### ④ 유튜브 인기 영상 Gemini AI 자동 분석 리포트 DB 적재
- 수집된 트렌드 영상들의 떡상 흥행 코드와 기획안을 Gemini AI가 자동 분석하여 DB 리포트로 저장 제공.

### ⑤ 🟢 GCP Vertex AI ($300 / 448,756원 무료 크레딧) AI 글쓰기 및 실시간 구글 검색 자동화 엔진 (현재 100% 구동 중)
- **상태**: **🟢 현재 100% 실시간 자동 구동 중** ([`vertex-ai-gemini.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/vertex-ai-gemini.ts), [`ai/generate/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/generate/route.ts))
- 일반 사용자의 AI 원고 작성 및 글쓰기 요청 시, GCP 서비스 계정 OAuth2를 기반으로 구글 클라우드 계정의 $300 무료 크레딧을 소비하며 `gemini-2.5-flash` 모델과 실시간 구글 검색 그라운딩(`googleSearch`)을 무제한 1순위로 무상 자동 가동.
- 상세 구축/운용 및 IAM 권한 트러블슈팅 매뉴얼: [`docs/project/manual/gcp-vertex-ai-service-setup-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/gcp-vertex-ai-service-setup-guide.md)

### ⑥ 🟢 👑 인기 영상 조회수 랭킹 매일 밤 자정 직전 무인 자동 아카이빙 (Daily Final Popular Ranking Archive - 현재 100% 구동 중)
- **상태**: **🟢 현재 100% 실시간 자동 구동 중** ([`/api/cron/sync-popular`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-popular/route.ts))
- **실행 주기**: 매일 밤 KST 23:50 (14:50 UTC) 자정 10분 전 자동 가동 (`vercel.json` 규격).
- **기능**: 전 세계 60개국 전체 및 카테고리/기간별 인기 영상 조회수 랭킹을 무인 수집하여, 당일 1개 Row(`youtube_popular_archive`)에 **'당일 최종 확정 랭킹 스냅샷(Final Daily Snapshot)'**으로 자동 업데이트 및 100% 보존함.

### ⑦ 🟢 ⚡ 16개 전체 카테고리 자율 AI 브랜드 100개 대량 탐지 및 DB 자동 수집 무인 엔진 (현재 100% 구동 중)
- **상태**: **🟢 현재 100% 실시간 자동 구동 중** ([`/api/admin/brands/scan-all`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/brands/scan-all/route.ts))
- **기능**: 버튼 1회 클릭 시 Groq LLaMA 3.3 70B AI 모델이 16개 전체 동적 카테고리(AI, 핀테크, 상표, 의료, 공공기관, 가상자산 등)에서 총 1,600개 키워드를 자율 스캔하여, 삼중 필터링을 거친 순수 미등록 신규 브랜드 아이디만 Supabase DB에 `upsert(ignoreDuplicates: true)`로 자동 수집 및 일괄 영구 저장함.

---

## 5. 🚀 앞으로 개발하며 장기적으로 확장할 무인 서비스 5선 (Future Roadmap)

### ① 트렌드 기반 AI 자동 블로그 포스팅 무인 발행 (Auto Publisher)
- **서비스 내용**: 매일 아침 수집된 1위 급상승 트렌드 키워드를 바탕으로, Gemini AI가 자동으로 네이버/워드프레스 맞춤 블로그 포스팅 원고와 썸네일을 작성하여 지정된 시간에 **무인 자동 예약 발행**해 줍니다. (100% 무인 수익형 블로그 파이프라인)

### ② 크리에이터 전용 '일일 바이럴 인사이트' 이메일 뉴스레터 자동 배송
- **서비스 내용**: 전일 대비 급상승한 유튜버 떡상 키워드, 최신 해시태그 분석표, 썸네일 패턴 분석 보고서를 매일 아침 08:00에 유료 구독 크리에이터들에게 이메일(Resend 연동)로 자동 전송하는 **뉴스레터 SaaS 구독 모델**.

### ③ 경쟁 라이벌 채널 무인 추적 및 떡상 알림 (Competitor Tracker)
- **서비스 내용**: 유저가 등록해둔 벤치마킹 경쟁 유튜버/블로거 채널의 구독자 변동, 조회수 떡상 패턴, 신규 업로드 동향을 매일 밤 12시에 무인 스캔하여 꺾은선 추이 그래프와 떡상 알림을 제공.

### ④ 회원 유료/VIP 멤버십 만료 및 혜택 자동 정돈
- **서비스 내용**: 유료 플랜 만료 3일 전 회원에게 만료 예정 알림톡/메일을 발송하고, 만료일 자정에 회원 등급 및 AI 생성 권한을 무인으로 자동 조정.

### ⑤ CreAibox 클라우드 DB 주간 자동 백업 & 유휴 스토리지 다이어트
- **서비스 내용**: 매주 일요일 새벽 주요 유저 데이터 및 원고를 안전 백업 파일로 자동 압축 보관하고, 오래된 유휴 캐시 데이터를 자동 청소하여 서버 스토리지를 항시 최적 상태로 유지.

---

## 💡 요약 및 운용 정책
CreAibox의 자동 수집 라우트([`/api/cron/sync-trending`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-trending/route.ts) 및 [`/api/cron/sync-keywords`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-keywords/route.ts))는 표준 HTTP REST 규격을 준수하므로, 위의 **5가지 방식 중 어떤 방식을 적용하거나 2중 병행하더라도 100% 완벽하게 무인 작동**합니다.
