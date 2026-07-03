# Cloudflare R2 연동 및 고성능 에셋 전송 아키텍처 가이드

본 문서는 CreAibox 비디오 에디터 및 크리에셋박스(CreAssetBox) 라이브러리 운영 시 발생하는 트래픽 전송 비용을 최소화하고, 구글 드라이브 API 할당량 초과 에러를 방지하기 위해 구축된 **Cloudflare R2 오브젝트 스토리지 연동 및 파일 자동 동기화 가이드**입니다.

---

## 1. 개요 및 도입 배경

### ⚠️ 기존 아키텍처의 한계
1. **구글 드라이브 트래픽 제한**: 구글 드라이브에 저장된 에셋 원본 주소로 다수의 사용자가 동시에 동영상을 로딩하거나 편집에 사용하면 구글 API 단에서 `403 Quota Exceeded` 에러를 뱉으며 다운로드를 강제 차단합니다.
2. **Supabase Egress 요금 폭탄**: Supabase Storage를 다이렉트 스트리밍으로 사용하는 경우, 데이터 다운로드 전송 요금(Egress)이 1GB당 약 125원($0.09)씩 무제한 과금되어 사용자가 많아질수록 높은 인프라 유지 비용이 청구됩니다.

### 💡 Cloudflare R2의 핵심 해결책
* **Zero Egress Fees (전송 요금 0원)**: 클라우드플레어 R2는 전 세계에서 유일하게 **데이터 다운로드 전송료가 완전히 무료(0원)**인 오브젝트 스토리지입니다. 수만 명의 사용자가 고화질 비디오 에셋을 계속해서 스트리밍하고 인코딩(내보내기)에 활용해도 트래픽 전송 요금이 단 1원도 청구되지 않는 최적의 비디오 서빙 스토리지입니다. (10GB 보관 용량까지 완전 무료 제공)

---

## 2. Cloudflare 가입 및 R2 서비스 활성화

1. [Cloudflare 공식 홈페이지](https://www.cloudflare.com/)에 접속하여 회원가입을 완료합니다.
2. 대시보드 왼쪽 메뉴에서 **[Storage & databases] ➡️ [R2 Object Storage] ➡️ [Overview]**로 이동합니다.
3. R2 서비스를 활성화하기 위해 파란색 **[Add R2 subscription to my account]** 버튼을 클릭하여 활성화합니다.
   * *주의*: 10GB 무료 범주 내에서는 **청구 금액이 `$0.00`**이지만, 무분별한 남용을 차단하기 위해 결제 수단(신용카드) 정보 등록을 요구하므로 최초 1회 인증 카드를 등록해야 개통됩니다.

---

## 3. R2 버킷(Bucket) 생성 및 Public Domain 허용

### 단계 1: 버킷 생성
1. R2 메인 대시보드에서 **[Create bucket]** 파란색 버튼을 클릭합니다.
2. **Bucket name**에 `creaibox-assets`를 입력합니다. (영문 소문자, 숫자, 하이픈만 사용 가능)
3. 생성 설정을 완료하여 저장합니다.

### 단계 2: Public Development URL (공개 주소) 활성화
유저들의 웹 브라우저가 R2 창고에 들어있는 동영상을 직접 로딩하여 플레이할 수 있도록 공개 도메인 주소를 활성화해야 합니다.
1. 생성된 `creaibox-assets` 버킷 대시보드에서 **[Settings (설정)]** 탭 메뉴를 클릭합니다.
2. 아래로 스크롤하여 **`Public Development URL`** 섹션을 찾습니다.
3. 우측의 파란색 **`[Enable]`** 링크를 클릭합니다.
4. "Enable Public Development URL?" 팝업창이 뜨면 입력창에 소문자로 **`allow`**를 타이핑해 적어 넣은 뒤 빨간색 **`[Allow]`** 버튼을 눌러 승인합니다.
5. 활성화가 완료되면 생성되는 고유 공개 도메인 주소(예: `https://pub-xxxxxxxxxxxxxx.r2.dev`)를 획득하여 기록합니다.

---

## 4. CORS(교차 출처 리소스 공유) 정책 설정

비디오 에디터의 HTML5 Canvas 렌더링 엔진과 타임라인이 R2의 비디오 파일을 로드하고 분석하여 픽셀을 결합(인코딩)할 때 브라우저 보안 규정에 의해 파일이 차단되는 현상(CORS 에러)을 미연에 방지하기 위한 설정입니다.

1. R2 버킷 설정 페이지(**[Settings]**)로 이동합니다.
2. **`CORS Policy`** 항목을 찾아 우측의 **`[+ Add]`** (또는 Edit) 버튼을 클릭합니다.
3. 입력란에 아래의 JSON 정책 코드를 복사해서 붙여넣고 저장합니다:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 5. API 토큰(R2 API Credentials) 발급

프로젝트 백엔드 및 싱크 스크립트가 R2에 원격으로 접속해 파일을 업로드할 수 있도록 API 인증 키를 발급받아야 합니다.

1. **[R2 Object Storage] ➡️ [Overview]** 화면으로 이동합니다.
2. 우측 사이드바의 **[Account Details]** 영역에 있는 **`Manage R2 API Tokens`** (API 토큰 관리) 링크를 클릭합니다.
3. **`[Create Account API token]`** 파란색 버튼을 누릅니다.
4. 설정을 다음과 같이 지정하고 생성합니다:
   * **Token name**: `creaibox-sync`
   * **Permissions**: 📌 반드시 **`Admin Read & Write` (관리자 읽기 및 쓰기)**를 선택합니다.
5. 토큰 생성이 완료되면 화면에 출력되는 아래 세 가지 정보를 안전하게 기록합니다:
   * **`Account ID`** (계정 ID)
   * **`Access Key ID`** (액세스 키 ID)
   * **`Secret Access Key`** (비밀 액세스 키)

---

## 6. 환경 변수 등록 및 연동 (.env.local)

프로젝트 루트 폴더의 [.env.local](file:///Users/a1234/Local%20Sites/creaibox/.env.local) 파일의 가장 아래에 위에서 획득한 R2 정보 5개를 아래 형식에 맞추어 기재해 줍니다. 

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="9b9b1f3c19bb1f238909a806c9679bd8"
R2_ACCESS_KEY_ID="4f17e0531ee261a5792d02ed3db17247"
R2_SECRET_ACCESS_KEY="11da83331560863d994170eca386d0640d2b6a467b1c9d030d6cb67a6efd9738"
R2_BUCKET_NAME="creaibox-assets"
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev"
```

> [!CAUTION]
> 주소 및 비밀번호 값에 주석이나 쌍따옴표 바깥쪽의 trailing space(의도치 않은 공백 문자)가 있는 경우, 자바스크립트 환경 변수 빌드 단에서 스트링 파싱 오류가 발생하여 경로가 깨질 수 있으니 공백이나 특수문자가 들어가지 않도록 깨끗이 복사하여 저장해야 합니다.

---

## 7. 구글 드라이브 ➡️ R2 미디어 동기화 스크립트 실행 가이드

프로젝트에는 관리자용 동기화 엔진인 [scripts/test_r2_sync.ts](file:///Users/a1234/Local%20Sites/creaibox/scripts/test_r2_sync.ts) 파일이 내장되어 있습니다. 이 스크립트는 구글 드라이브 폴더의 모든 영상을 조회하여 R2에 없는 파일만 다운로드/업로드하고 Supabase DB 테이블 `free_assets`에 R2 CDN 주소를 다이렉트로 매핑하여 동기화해 줍니다.

### 실행 방법
터미널을 열고 프로젝트 루트 디렉토리에서 다음 명령을 실행합니다:

```bash
npx ts-node --compiler-options '{"module":"commonjs","noImplicitAny":false}' scripts/test_r2_sync.ts
```

### 작동 프로세스
1. `.env.local` 파일에서 구글 및 R2 설정 값을 로드합니다.
2. `creaibox-free-assets` 구글 드라이브 공유 폴더 하위의 `video/` 디렉토리를 검색합니다.
3. 발견된 신규 비디오 파일(예: `abocado_ai_...mp4`)을 백엔드로 가져옵니다.
4. R2 스토리지의 `video/` 가상 경로에 파일을 업로드(S3 API)합니다.
5. Supabase의 `free_assets` 테이블에 고속 R2 CDN 링크(`https://[R2_DOMAIN]/video/[FILE_NAME]`)를 매핑하여 `gdrive_file_id` 기준 충돌 시 `upsert` 업데이트를 처리합니다.
6. 이제 비디오 에디터의 '무료 에셋' 탭에 해당 아이템이 0.1초의 로딩 속도로 즉시 표시됩니다.
