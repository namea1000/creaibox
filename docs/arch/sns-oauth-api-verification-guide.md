# SNS OAuth API 연동 및 정식 검수 가이드 (Verification Guide)

본 문서는 크리에이박스(CreAibox) 채널 배포 스튜디오의 정식 상용화 배포 시 필요한 **구글(YouTube), 메타(Instagram), 틱톡(TikTok) 개발자 계정 승인 및 앱 검수(App Review) 절차**를 안내합니다.

---

## 1. Google / YouTube API 검수 절차 (Sensitive Scopes)

사용자 본인의 유튜브 채널에 비디오를 자동 업로드하고 통계를 읽기 위해서는 **민감한 권한(Sensitive Scopes)** 검수가 필수적입니다.

### 1) 요청 권한 (Scopes)
* `https://www.googleapis.com/auth/youtube.upload` (동영상 업로드)
* `https://www.googleapis.com/auth/youtube.readonly` (동영상 조회수 및 통계 동기화)

### 2) 개발 및 테스트 단계 (검수 전)
* 구글 클라우드 콘솔(GCP)에서 OAuth 동의 화면을 설정할 때 **"게시 상태"를 테스트(Testing) 단계**로 둡니다.
* 개발자 본인 및 테스트팀의 이메일 계정(최대 100개)을 등록하여 권한 승인 창 테스트를 진행할 수 있습니다.
* 로그인 시 구글의 안전성 미인증 경고 창이 노출되나, `고급 > creaibox.com으로 이동(안전하지 않음)`을 눌러 우회 및 테스트가 가능합니다.

### 3) 프로덕션 승인 신청 (App Verification)
일반 공개 배포를 위해 게시 상태를 **"앱 준비 완료(In Production)"**로 전환하고 구글의 공식 검수를 신청합니다.
1. **필수 링크 준비**:
   * 개인정보 처리방침(Privacy Policy) 페이지 (`creaibox.com/privacy`)
   * 서비스 이용약관(Terms of Service) 페이지 (`creaibox.com/terms`)
   * 구글 서치 콘솔(Google Search Console)을 통해 `creaibox.com` 도메인 소유권 인증 필수.
2. **시연 동영상(Demo Video) 촬영 및 제출**:
   * 유튜브 승인팀이 확인하도록 **시연용 영상(영문 설명 권장)**을 제작해 YouTube 일부 공개 링크로 제출해야 합니다.
   * 영상 필수 내용:
     * 크리에이박스 홈페이지 및 로그인 과정
     * OAuth 동의 화면에 접근하는 단계 (브라우저 주소창의 클라이언트 ID가 명확히 보여야 함)
     * 권한 체크 후 승인 완료 과정
     * 비디오 스튜디오에서 내보낸 영상이 **유튜브 채널에 실제로 성공적으로 업로드 및 동기화되는 동작 시연**
3. **심사 기간**: 일반적으로 **1주 ~ 3주**가 소요되며, 검수관의 피드백에 따라 수정을 요청받을 수 있습니다.

### 4) API 할당량(Quota) 확장 신청
* 유튜브 Data API v3의 기본 무료 할당량은 **일일 10,000 unit**입니다.
* 비디오 업로드 1회는 약 **1,600 unit**을 소모하므로, 하루에 약 6개의 비디오만 업로드하면 당일 할당량이 만료되어 서비스 전체가 마비됩니다.
* 실사용 유저가 생기는 시점에 구글 클라우드 콘솔을 통해 **유튜브 API 할당량 확장 요청(Quota Extension Request)** 서류를 제출하여 승인받아야 상용 서비스가 가능합니다. (심사 기간: 약 1~2주)

---

## 2. Meta (Instagram Graph API) 검수 절차

인스타그램 릴스(Reels)의 비디오 자동 발행(`instagram_content_publish`) 권한은 메타의 강력한 통제를 받습니다.

### 1) 필수 권한 (Instagram Permissions)
* `instagram_basic`
* `instagram_content_publish`
* `pages_read_engagement`
* `pages_show_list`

### 2) 사전 요건 (Prerequisites)
* 연동하는 유저의 인스타그램 계정이 **비즈니스(Business) 또는 크리에이터(Creator) 프로필**이어야 합니다.
* 인스타그램 프로필이 **페이스북 페이지(Facebook Page)와 연동**되어 있어야 배포가 가능합니다. (Meta API의 기술적 제약 사항)

### 3) 메타 앱 검수 (Meta App Review)
일반 유저에게 연동 기능을 제공하기 위해 메타 개발자 센터에서 검수를 신청해야 합니다.
1. **메타 비즈니스 관리자(Meta Business Manager) 인증**:
   * 크리에이박스 사업자 등록증 및 회사 실명 인증을 완료해야 앱 검수 제출이 승인됩니다.
2. **권한 사용처 소명 설명서 제출**:
   * 각 권한이 사용자의 인스타그램 피드에 릴스 영상을 배포하기 위해 왜 필요한지 서술식 소명서 및 다국어 지원 텍스트를 제출합니다.
3. **스크린캐스트(Screencast) 제출**:
   * 페이스북 로그인을 통해 인스타그램 계정을 성공적으로 연결하고, 릴스 배포 폼을 채워 인스타그램 앱에 실제 동영상이 포스팅되는 화면 녹화본을 제출합니다.

---

## 3. TikTok Content Posting API 검수 절차

틱톡 계정에 비디오를 임시저장(Draft) 혹은 직접 게시하기 위해 필요한 절차입니다.

### 1) 요청 권한 (TikTok Scopes)
* `video.upload` (동영상 업로드 및 발행)
* `video.list` (기존 동영상 데이터 읽기 및 통계 수집)

### 2) 틱톡 개발자 등록 및 심사
1. **TikTok for Developers** 계정 등록 후 크리에이박스 클라이언트 앱을 생성합니다.
2. **웹훅(Webhook) 및 도메인 바인딩**:
   * 틱톡 연동 인증서(Redirect URIs) 및 통신 도메인을 승인 리스트에 등록합니다.
3. **리뷰 신청 (App Review)**:
   * 틱톡 역시 테스트 모드에서는 개발자가 등록한 특정 테스트용 틱톡 계정으로만 연동이 가능합니다.
   * 서비스 오픈 시 틱톡 심사 가이드에 맞추어 앱 카테고리(Content Creation & Marketing)를 지정하고, 실제 영상 업로드 시연 동영상을 포함한 설명서를 제출하여 정식 심사를 마쳐야 합니다.

---

## 4. 아키텍처 및 보안 준수 권장 사항

1. **토큰 암호화 저장**:
   * 사용자의 구글, 메타, 틱톡 `Access Token` 및 `Refresh Token`은 유출 시 소셜 미디어 탈취 위험이 크므로, 데이터베이스 저장 시 반드시 대칭키 암호화(AES-256) 알고리즘을 거쳐 안전하게 보관해야 합니다.
2. **자동 갱신 (Token Refresh) 매커니즘**:
   * Access Token은 1시간이 지나면 만료됩니다. 배포 스케줄러가 작동하기 직전 Refresh Token을 호출하여 새로운 Access Token을 자동으로 발급받는 미들웨어 로직이 안전하게 셋업되어야 배포 실패율이 낮아집니다.
