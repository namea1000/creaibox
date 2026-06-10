✅ YouTube Data API v3 ⭐⭐⭐⭐⭐ 완료 
✅ Google Drive API ⭐⭐⭐⭐⭐ 완료 
✅ Google Sheets API ⭐⭐⭐⭐⭐ 완료 
✅ Google Calendar API ⭐⭐⭐⭐ 완료 
✅ Google Docs API ⭐⭐⭐⭐ 완료
✅ Google Analytics API ⭐⭐⭐⭐ 완료 
✅ Search Console API ⭐⭐⭐⭐ 완료 
✅ Google People API ⭐⭐ 완료 

✅API Key 발급 : YouTube Data API v3

✅ Google Cloud 프로젝트 생성
✅ OAuth 동의 화면
✅ 브랜드 설정
✅ OAuth Client 생성
✅ Supabase Callback 등록
✅ Google 로그인 성공
✅ API 활성화

남은 건
1. Search Console 연동
2. Analytics 연동
3. YouTube 연동
4. Drive 연동
5. Calendar 연동

API 및 서비스
→ 사용자 인증 정보
→ API 키 만들기

눌러서 API Key 하나 생성해놔.

나중에
YouTube Data API
Google Maps
Geocoding


선택된 API:

✅ YouTube Data API v3

API Key
AIza....

| API              | OAuth | API Key |
| ---------------- | ----- | ------- |
| Google Login     | ✅     | ❌       |
| Search Console   | ✅     | 거의 안씀   |
| Analytics        | ✅     | 거의 안씀   |
| Drive            | ✅     | ❌       |
| Sheets           | ✅     | ❌       |
| Docs             | ✅     | ❌       |
| Calendar         | ✅     | ❌       |
| People           | ✅     | ❌       |
| YouTube Data API | ✅     | ✅       |

/admin
├── page.tsx                ✅ 통합 대시보드
├── google/page.tsx    
├── API Gateway Vault     ✅ Google 관리
├── seo/page.tsx            ✅ SEO 관리
├── analytics/page.tsx      ⏭ 다음
├── youtube/page.tsx
├── content/page.tsx
├── billing/page.tsx
├── system/page.tsx
├── settings/page.tsx
├── usermanagement/page.tsx ✅ 완료

--------------------------------------------------------------------------------------------
⭐ 구글 애널리스틱

스트림 ID → 데이터 스트림 식별용
15008369739

측정 ID → 사이트에 심는 태그용
G-SRBFXMN9XQ

속성 ID → API 조회용 (Analytics Data API)
540360142 

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SRBFXMN9XQ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-SRBFXMN9XQ');
</script>

중요

이 방식은 서비스 계정 방식이라서 Google Analytics에서 서비스 계정 이메일을 추가해야 해.

Google Cloud → 서비스 계정 생성
서비스 계정 이메일 복사
Analytics → 관리자 → 속성 액세스 관리
서비스 계정 이메일 추가
권한은 뷰어

그리고 .env.local에 추가:

Google Cloud 서비스 계정
creaibox-analytics-reader@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com

OAuth 2 클라이언트 ID
104992061391638545456

⭐⭐ OAuth Scope 추가는 나중에 이런 기능 만들 때 필요함.
Google Cloud Console
→ Google 인증 플랫폼
→ 대상(Audience)
또는
→ OAuth 동의 화면

미래 기능
사용자 개인 Analytics 연결

예)

사용자 A
→ 자기 사이트 Analytics 연결

사용자 B
→ 자기 사이트 Analytics 연결

-------------------------------------------------------------------------------------------
사용자
↓
Google 로그인
↓
OAuth Token
↓
Drive
Sheets
Docs
Calendar
Analytics
Search Console


최종 구조를 이렇게 가져가면 된다.

OAuth 전용

✅ Google Login
✅ Google Drive API
✅ Google Sheets API
✅ Google Docs API
✅ Google Calendar API
✅ Google Analytics API
✅ Google Search Console API
✅ Google People API

API Key 유지

✅ YouTube Data API v3


YouTube Studio
채널 분석
영상 분석
댓글 분석
구독자 추이
인기 영상
트렌드 키워드

→ YouTube Data API v3 + API Key


SEO Studio
검색어 순위
클릭수
CTR
노출수
상위 페이지

→ Search Console OAuth

Analytics Studio
방문자
실시간 사용자
유입경로
국가
기기

→ Analytics OAuth


Productivity Studio
Google Calendar 연동
Google Drive 연동
Google Docs 저장
Google Sheets 저장

→ OAuth


app/admin/google/page.tsx 완료 
app/admin/seo/page.tsx
app/admin/analytics/page.tsx
app/admin/youtube/page.tsx
app/admin/billing/page.tsx
app/admin/content/page.tsx
app/admin/system/page.tsx
app/admin/settings/page.tsx
다음 단계 추천

관리자 허브 만든 뒤 바로 개발 가치가 큰 순서:

/admin/google
OAuth 상태
API 활성화 상태
YouTube API Key 상태
/admin/system
Supabase 상태
OpenAI 상태
Google API 상태
Stripe 상태
/admin/analytics
회원 수
방문자 수
DAU/MAU
/admin/seo
Search Console 연동
Sitemap 상태
색인 상태

이 순서가 좋아. 특히 방금 Google Cloud를 다 연결했으니까 /admin/google을 제일 먼저 진짜 대시보드로 만드는 걸 추천해.


⭐ /admin/analytics
Google Analytics API
Search Console API
Supabase
Stripe

Analytics 페이지 최종 목표

방문자
오늘 방문자
어제 방문자
7일 방문자
30일 방문자

실시간
현재 접속자
현재 페이지
국가
디바이스

유입 분석
Google
Naver
Direct
YouTube
Facebook
ChatGPT
Bing
파이차트

인기 페이지
/blog/xxx
/blog/yyy
/studio/thumbnail
/studio/writing
Top 20

검색어
Search Console API
검색어
클릭
노출
CTR
평균순위

국가
한국
미국
일본
호주
캐나다

디바이스
Desktop
Mobile
Tablet
사용자 행동
평균 체류시간

이탈률
페이지뷰
세션수

회원 분석
Supabase
신규 가입
구글 가입
네이버 가입
카카오 가입
유료 전환율
수익 분석

Stripe
MRR
ARR
이번달 매출
결제 성공률
환불률

그래프
일별 방문자
주별 방문자
월별 방문자

회원 증가
AI 인사이트
GPT 분석
이번주 성장률
급상승 페이지
급감 페이지
추천 개선사항


나중에 유료화할 거면 Stripe는 추가하는 게 맞아.

다만 지금 Google처럼 급한 건 아니고, 순서는 이렇게 가면 좋아.

지금은 /admin/billing 골격 먼저 만들기
유료화 직전에 Stripe 계정 생성/연동
STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 환경변수 추가
Webhook 연결
결제/구독/환불/회원 등급 자동 반영

⭐ Analytics 페이지의 ⏳ Stripe는 의미가 이거야.




/admin/content 는 단순 콘텐츠 목록이 아니라
콘텐츠 운영 본부 (Content Operations Center)
✅ 전체 원고
✅ 발행글
✅ 임시저장
✅ 휴지통

✅ SEO 상태
✅ 썸네일 상태
✅ 발행 상태

✅ 작성자별 통계
✅ 인기글
✅ 최근 발행글

✅ 블로그 종류별
- Creaibox
- Naver
- WordPress
- 기타

✅ 콘텐츠 생산량
✅ 발행 캘린더
✅ AI 작성 통계
✅ SEO 점수 분포
✅ 조회수 상위글
✅ 수정 필요 글


/admin/billing 은 나중에 Stripe 연결하면 사실상 매출 본부가 된다.
지금부터는 단순 페이지가 아니라: Revenue Center 수준으로 설계하는 게 맞음.
✅ 요금제 관리
✅ 구독 현황
✅ 무료 체험 제한
✅ API 사용량
✅ 월 매출(MRR)
✅ 연 매출(ARR)
✅ 환불
✅ 결제 성공률
✅ 플랜 업그레이드
✅ 사용자별 과금 현황


/admin/system 은
단순 시스템 페이지가 아니라 CreAIbox NOC(Network Operations Center) 느낌으로 가야 해.
✅ Supabase 상태
✅ DB 상태
✅ Storage 사용량
✅ Auth 상태
✅ Gemini
✅ OpenAI
✅ Claude
✅ Google OAuth
✅ YouTube API
✅ API Vault 상태
✅ Vercel 상태
✅ 에러 로그
✅ 사용자 활동
✅ 백업 상태
✅ Cron 작업
✅ AI 사용량
✅ 비용 모니터링
✅ 시스템 보안


/admin/settings.
이 페이지는 단순 설정이 아니라 CreAIbox Control Panel 개념으로 가는 게 맞아.
✅ 사이트 기본 설정
✅ 회원 정책
✅ 무료 사용량 제한
✅ AI 모델 기본값
✅ API Vault 기본값
✅ OAuth 설정
✅ SEO 기본 설정
✅ 결제 정책
✅ 관리자 권한
✅ 공지사항
✅ 베타 모드
✅ 유지보수 모드