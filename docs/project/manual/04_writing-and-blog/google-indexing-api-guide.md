# 📖 [매뉴얼] 구글 인덱싱 API (Google Indexing API) 연동 및 운용 가이드

본 문서는 크리에이박스(CreaiBox) 플랫폼에 구축된 **구글 실시간 색인 핑 전송 시스템(Google Web Search Indexing API)**의 도입 필요성, 핵심 장점, 단계별 연동 방법 및 백엔드 운영 가이드라인을 정의한 정식 기술 매뉴얼입니다.

---

## 1. 개요 및 도입 필요성 (Overview & Necessity)

### 1.1 기존 검색엔진 색인의 구조적 한계
일반적인 웹사이트 및 블로그의 검색 노출(SEO) 체계는 구글 로봇(Googlebot)이 주기적으로 사이트를 방문하여 사이트맵(`sitemap.xml`)과 RSS 피드(`/feed`)를 긁어갈 때까지 수동으로 대기하는 방식입니다.

* **수일~수주일 소요**: 새로운 블로그 글이나 비즈니스 웹사이트 페이지를 수백 개 작성하더라도 구글봇의 방문 주기에 따라 검색 노출까지 수일에서 최대 수주일 이상 지연될 수 있습니다.
* **트렌드 키워드 선점 불가**: 급상승 트렌드나 신규 상품 리뷰 등 시의성이 중요한 콘텐츠는 실시간 색인이 되지 않으면 검색엔진 상단 노출 기회를 타 사이트에 빼앗기게 됩니다.

### 1.2 Google Indexing API 도입 효과
**Google Web Search Indexing API**는 크리에이박스 백엔드 서버와 구글 검색 엔진 수집 시스템을 API로 직접 연결하여, 콘텐츠가 작성/발행되는 **즉시 구글에 수집 핑(Ping)을 전송하여 수 분 내에 실시간 검색 색인을 요청**하는 고급 연동 기술입니다.

---

## 2. 핵심 장점 및 비즈니스 가치 (Key Benefits)

### ⚡ ① 검색 색인 반영의 "실시간화" (Real-Time Indexing)
* **도입 전**: 구글봇이 무작위로 방문하여 크롤링해 갈 때까지 무기한 대기.
* **도입 후**: 유저가 블로그 포스트 발행 버튼을 누르는 즉시 백엔드가 구글 수집 엔진에 실시간 핑을 전송하여 **수 분 내에 검색 색인 및 반영 완료**.

### 🏆 ② 크리에이터 만족도 & 플랫폼 락인(Lock-In) 극대화
* 크리에이박스를 사용하는 작가, 소상공인, 기업 고객들이 **"글을 올리자마자 구글 검색 결과에 실시간으로 노출되는 경험"**을 제공하여 서비스 신뢰도 및 만족도 대폭 상승.
* 대외 공개용 55대 상세 분야 포스트 및 비즈니스 웹사이트의 키워드 검색 랭킹 선점에 절대적으로 유리한 발판 확보.

### 🌐 ③ 멀티테넌트 서브도메인 (`*.creaibox.com`) 100% 자동 적용
* 메인 도메인(`creaibox.com`) 서치콘솔에 서비스 계정 1회 연동만으로, **모든 유저들의 개별 블로그**(`gildong.creaibox.com/posts/...` 등)가 별도 복잡한 설정 없이 자동으로 실시간 핑 혜택을 받습니다.

---

## 3. 단계별 설정 & 연동 매뉴얼 (Setup & Operations Manual)

```mermaid
sequenceDiagram
    actor User as 크리에이터 / 작성자
    participant CB as CreaiBox 백엔드 API
    participant GSC as Google Search Console
    participant GAPI as Google Indexing API

    User->>CB: 블로그 포스트 발행 (Submit)
    CB->>CB: DB 저장 및 공개 URL 생성
    CB->>GAPI: Google Indexing API 호출 (URL & Publish Event)
    GAPI-->>CB: 200 OK (수집 대기열 즉시 등록 완료)
    GAPI->>GSC: Googlebot 즉시 출동 및 URL 수집 요청
```

### 📌 Step 1. GCP 콘솔 API 활성화
1. [Google Cloud Console](https://console.cloud.google.com/) 접속 및 프로젝트 선택 (`CreaiBox`).
2. **`API 및 서비스` > `라이브러리`** 이동.
3. **`Web Search Indexing API`** (또는 `Indexing API`) 검색 후 **`사용 (Enable)`** 클릭.

### 📌 Step 2. GCP 서비스 계정 (Service Account) 생성 및 키 발급
1. **`API 및 서비스` > `사용자 인증 정보`** 탭 이동.
2. **`+ 사용자 인증 정보 만들기` > `서비스 계정 (Service Account)`** 클릭.
3. 서비스 계정 이름 기재 (예: `creaibox-indexing-bot`).
4. 생성된 서비스 계정 이메일 주소 복사:
   `creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`
5. 해당 계정 클릭 ➔ **`키 (KEYS)`** 탭 ➔ **`새 키 만들기` > `JSON`** 선택 후 컴퓨터에 비밀키 다운로드.

### 📌 Step 3. Google Search Console 소유자(Owner) 권한 연동
1. [Google Search Console](https://search.google.com/search-console) 접속 후 `creaibox.com` (도메인 속성) 선택.
2. 좌측 하단 **`설정 ⚙️` > `사용자 및 권한` > `사용자 추가`** 클릭.
3. Step 2에서 복사한 **서비스 계정 이메일** 입력.
4. 권한을 **`소유자 (Owner)`**로 선택하고 등록 완료.

### 📌 Step 4. 프로젝트 환경변수 (`.env.local`) 시크릿 적재
발급받은 JSON 키 파일의 내용을 프로젝트 환경변수 파일에 아래 규격으로 설정합니다:

```env
# Google Indexing API Service Account Credentials
GOOGLE_INDEXING_CLIENT_EMAIL="creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com"
GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_INDEXING_CREDENTIALS='{"type":"service_account","project_id":"project-51796415-94e5-4403-ad7",...}'
```

---

## 4. 백엔드 API 구현 & 운영 가이드 (Developer Spec)

### 4.1 실시간 핑 전송 API 스펙 (Payload Format)

- **Endpoint**: `https://indexing.googleapis.com/v3/urlNotifications:publish`
- **HTTP Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {GOOGLE_OAUTH2_ACCESS_TOKEN}`
- **Body Payload**:
  ```json
  {
    "url": "https://gildong.creaibox.com/posts/my-new-article-123",
    "type": "URL_UPDATED"
  }
  ```

### 4.2 일일 쿼터 (Quota) 및 확장 (Quota Increase Request) 방법
* **기본 제공 쿼터**: GCP 프로젝트당 **일일 200건 (Requests per day)**의 핑(Ping) 쿼터가 기본 제공됩니다.
* **목록에 Indexing API가 안 보일 때 선행 조치**:
  1. **API 활성화 필수**: [Google Cloud Console Indexing API 활성화 바로가기](https://console.cloud.google.com/apis/library/indexing.googleapis.com?project=project-51796415-94e5-4403-ad7) ➔ **`[사용 (ENABLE)]`** 버튼 1회 클릭.
  2. **전용 할당량 페이지 직행**: [Indexing API 전용 Quota 페이지 바로가기](https://console.cloud.google.com/apis/api/indexing.googleapis.com/quotas?project=project-51796415-94e5-4403-ad7)
* **증액 신청 (Google Form Quota Request) 작성 양식**:
  1. **Applicant name**: `Jung-on Kim` (또는 대표자 영문 성함)
  2. **Email Address**: `creaiboxofficial@gmail.com` (자동 입력됨)
  3. **Project Number**: `333143506545` (자동 입력됨)
  4. **Desired Quota**: `10000` (일일 10,000건 신청)
  5. **Example URL**: `https://creaibox.com/blog`
  6. **Use Case**: 드롭다운에서 `Content Publishing` 또는 `Other` (또는 `JobPosting` / `BroadcastEvent`) 선택.
  7. **Request Description / Justification (신청 사유)**:
     > *"We operate CreaiBox (creaibox.com), an all-in-one digital blogging and website builder platform that enables content creators, businesses, and bloggers to build custom websites and publish active blogs. As we scale up our platform service, we expect thousands of creators and users to build websites and publish multiple blog posts and pages daily. To ensure prompt indexing and seamless search visibility for all our users' growing content from day one, we kindly request a daily Indexing API quota of 10,000 requests to notify Googlebot in real time."*

### 4.3 스마트 핑 낭비 방지 & 최종 핑 보장 알고리즘 (Smart Throttling & Trailing Edge Ping)
유저가 글을 발행한 후 short-term으로 수정 및 재발행을 연속해서 누를 경우 핑 쿼터 낭비를 방지하고 최신 완성본의 수집을 보장하기 위한 3중 방어 메커니즘입니다.

* **① 최초 발행 (Immediate Ping)**: 글이 `published` 상태로 처음 최초 발행되면 즉시 구글에 `URL_UPDATED` 핑 1회 전송.
* **② 1시간 쿨다운 (1-Hour Cooldown Throttling)**: 동일 URL에 대해 1시간(60분) 이내 추가 수정/재발행 시 즉시 핑을 쏘지 않고 `pending_ping: true` 플래그로 큐에 보관.
* **③ 최종 핑 보장 (Trailing Edge Ping)**: 1시간 쿨다운 경과 시점 또는 수정 종료 후 최종 완성본 URL로 핑 1회를 자동 쏘아주어 50분 후 완성된 최종 원고가 구글봇에 100% 반영되도록 보장.
* **④ 삭제/비공개 (URL_DELETED)**: 포스트 삭제 시 구글 색인 지우기 요청 핑 즉시 송신.

---

## 5. 독립 커스텀 도메인 (`mybrand.com`) 유저 대응 가이드

1. **플랫폼 기본 도메인 (`*.creaibox.com`)**:
   - `creaibox.com` 소유자권한에 등록되어 있으므로 백엔드 핑 100% 자동 동작.
2. **독립 도메인 사용 고객 (`mybrand.com`)**:
   - 고객이 직접 본인 구글 서치콘솔 속성을 개설한 뒤, 크리에이박스 서비스 계정 이메일(`creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com`)을 사용자/소유자로 1회 추가 등록하도록 안내하면 개인 독립 도메인도 동일하게 실시간 핑 혜택을 이용할 수 있습니다.
