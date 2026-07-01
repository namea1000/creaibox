# Google PageSpeed Insights API 무료 연동 및 설정 가이드

본 문서는 CreAibox 블로그 스튜디오 관리자 화면의 **PageSpeed Insights 성능 측정** 탭이 안정적으로 작동하기 위해 필요한 Google PageSpeed Insights API 연동 및 고유 API Key 발급 절차를 정리한 공식 가이드라인입니다.

---

## 1. 개요 및 배경

구글 애널리틱스, 구글 드라이브와 같은 외부 API 호출 환경과 달리 PageSpeed Insights API는 최초 익명(공용) 프로젝트 키(`project_number:583797351490`)를 공유하여 사용합니다. 
그러나 이 공용 프로젝트는 전 세계 개발자들이 트래픽을 나눠 쓰기 때문에 **일일 할당량(Quota) 초과 오류**가 빈번하게 발생하여 작동이 불가능해집니다.

이를 해결하기 위해 CreAibox는 각 플랫폼 운영자(Admin)의 **독립된 Google Cloud Console 프로젝트 전용 API Key**를 연동하여 사용할 수 있도록 환경 변수(`NEXT_PUBLIC_PAGESPEED_API_KEY`)를 설계하였습니다. 이 경우 하루 최대 **25,000회까지 완전 무료**로 측정이 가능합니다.

---

## 2. API Key 무료 발급 절차

구글 클라우드 콘솔에서 1분 내로 무료 발급받아 연동할 수 있습니다.

### 단계 1: Google Cloud Console 접속 및 프로젝트 선택
1. [Google Cloud Console](https://console.cloud.google.com/) 웹사이트에 로그인합니다.
2. 상단 프로젝트 선택 메뉴에서 현재 블로그 서비스(구글 드라이브, OAuth 등)에 연결해 둔 본인의 프로젝트를 선택합니다.

### 단계 2: PageSpeed Insights API 활성화
1. 좌측 메뉴 혹은 검색창을 통해 **[API 및 서비스] ➡️ [라이브러리]** 메뉴로 이동합니다.
2. 검색란에 **`PageSpeed Insights API`**를 입력하고 검색 결과에서 클릭합니다.
3. **[사용]** 버튼을 클릭하여 프로젝트에 API를 연동 및 활성화합니다.

### 단계 3: API 키 생성 및 보안 제약 설정
1. **[API 및 서비스] ➡️ [사용자 인증 정보]** 메뉴로 이동합니다.
2. 상단의 **[+ 사용자 인증 정보 만들기] ➡️ [API 키]**를 클릭하여 새로운 키를 임시 생성합니다.
3. 생성된 키의 관리 창에서 보안을 위한 제약 사항을 아래와 같이 설정합니다:
   * **이름**: 구분하기 쉬운 명칭 입력 (예: `PageSpeed Insights API Key`)
   * **API 제한사항**: **[API 제한]**을 선택한 뒤 목록에서 **`PageSpeed Insights API`**만 체크합니다. (해당 키로 다른 유료 구글 서비스가 무단 도용되는 것을 막는 매우 중요 보안 조치입니다.)
   * **서비스 계정 인증**: 체크 해제 (빈 칸으로 유지)
   * **애플리케이션 제한사항**: `없음` (개발/디바이스 범용성 기준)
4. 설정 저장을 마친 뒤 팝업 창에 표시되는 긴 API Key 값(`AIzaSy...`로 시작)을 복사합니다.

---

## 3. 환경 변수(Env) 등록 및 연동

복사한 API 키를 서버 및 클라이언트 빌드에 적용하기 위해 환경 변수 파일에 추가합니다.

### 로컬 개발 환경 (.env.local)
프로젝트 루트 경로에 위치한 [.env.local](file:///Users/a1234/Local%20Sites/creaibox/.env.local) 파일을 열어 가장 아랫줄에 다음의 한 줄을 추가하고 저장합니다:

```env
# Google PageSpeed Insights API Key
NEXT_PUBLIC_PAGESPEED_API_KEY=AIzaSyA_본인의_구글_API_키_값
```

> [!IMPORTANT]
> 로컬 환경 변수 파일을 수정한 경우, 실행 중인 터미널에서 기존 노드 서버를 종료(`Ctrl + C`)한 후 **`npm run dev`** 명령으로 개발 서버를 재기동해야 새 키 값이 로드됩니다.

### 실서비스 배포 환경 (Vercel)
Vercel 대시보드 ➡️ 프로젝트 설정 ➡️ **Environment Variables** 메뉴에서 다음과 같이 새로운 환경 변수를 등록해 줍니다:
* **Key**: `NEXT_PUBLIC_PAGESPEED_API_KEY`
* **Value**: `AIzaSyA_본인의_구글_API_키_값`
* 등록 후 배포(Deployments)를 재실행하면 실서버에도 즉시 적용됩니다.

---

## 4. 작동 검증 및 예외 대응

1. 블로그 관리 페이지의 **[PageSpeed Insights 성능 측정]** 탭으로 이동합니다.
2. 외부 접속이 가능한 실 도메인(예: `https://golfgosu.net` 또는 `https://guidenara.com`)을 기입하고 **[성능 측정]** 버튼을 누릅니다.
3. 5~15초간의 수집 과정이 흐른 후 4가지 핵심 원형 게이지 차트(성능, 접근성, 권장사항, 검색최적화) 및 속도 지표가 에러 없이 아름답게 노출되면 정상 동작이 최종 입증된 것입니다.

### 트러블슈팅
* **익명 한도 초과 오류 지속 발생 시**: `.env.local` 파일에 오타가 있거나, API 키를 저장한 뒤 개발 서버를 끄고 켜는 과정을 빠뜨렸는지 다시 확인해 주세요.
* **접속 불가 오류**: 로컬 도메인(`localhost:3000`)은 구글 서버가 통신을 뻗을 수 없으므로 무조건 오류가 나니 실주소로만 테스트해야 합니다.
