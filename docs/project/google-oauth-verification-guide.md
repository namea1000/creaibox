# Google OAuth App Verification & Branding Guide

This document serves as a comprehensive guide for **Google OAuth App Verification (Consent Screen Review)** and **Branding Best Practices**. 

When starting a new project, follow these guidelines to ensure a smooth, professional, and secure authentication flow that maximizes user trust and removes Google's built-in security limitations.

---

## 1. Why Google OAuth Verification is Critical

By default, any new Google Cloud project starts in "Testing" or "Unverified" status. Submitting your app for verification and obtaining approval from Google provides four major benefits:

### A. Removal of the "Unverified App" Warning (Critical for User Trust)
* **Without Verification**: When a general user tries to log in, Google displays a prominent, red warning screen stating: **"Google has not verified this app" (이 앱은 Google의 확인을 받지 않았습니다)** or **"This app is unsafe"**. 
* **The Risk**: To proceed, the user must click "Advanced" and then click "Go to [yourdomain] (unsafe)". This scares away over 90% of potential users.
* **With Verification**: This warning is **completely removed**. Users are redirected directly and smoothly to the clean login/consent screen with a single click.

### B. Activation of the Official App Logo
* **Without Verification**: Even if you upload an app logo in the console, Google **will not display it** to public users on the OAuth consent screen for security reasons.
* **With Verification**: Your uploaded logo is displayed prominently in a circular frame next to your brand name, significantly enhancing your brand's professionalism.

### C. Removal of the 100-User Cap
* **Without Verification**: Unverified apps in production are subject to a strict, lifetime limit of **100 OAuth users**. Once the 100th unique user logs in, Google blocks all subsequent sign-ups.
* **With Verification**: This limit is **completely removed**, allowing unlimited users to register and log in.

### D. Access to Sensitive & Restricted Scopes
* If your application eventually needs to integrate with Google services (e.g., reading/writing files in Google Drive, managing YouTube videos, or accessing Gmail), Google requires strict verification before granting these "sensitive scopes".

---

## 2. App Logo Best Practices

The logo shown on the Google OAuth consent screen has unique rendering constraints. Follow these design rules:

| Rule | Best Practice | Rationale |
| :--- | :--- | :--- |
| **Aspect Ratio** | **1:1 (Square)** | Google crops and displays the logo inside a **small circular frame** (usually 120x120 pixels). |
| **Format** | **Symbol-Only / Favicon / App Icon** (e.g., the `CAI` mark) | Wide, text-based logos (spelling out "CreAibox") will become squished, unreadable, or cut off at the edges. |
| **File Size & Format** | **Under 100KB, PNG or WebP** | Ensures fast loading times on mobile devices. |

### Industry Examples
* **Notion**: Uses its square/circular black **`N`** symbol icon, not the text "Notion".
* **Spotify**: Uses its circular green soundwave symbol, not the text "Spotify".
* **Slack**: Uses its square colored hashtag symbol, not the text "Slack".

---

## 3. Domain & Redirect URI Management

When implementing a custom domain proxy (like the Vercel Hybrid Proxy), clean up your Google Cloud Console configurations to maintain security and brand integrity:

### A. Authorized Domains (승인된 도메인)
* **What to include**: Only include the primary domain(s) that initiate the OAuth flow (e.g., `creaibox.com`). 
* **What to exclude**: Once a proxy is active, the old direct Supabase endpoint (e.g., `dkblalbnykgpksurdace.supabase.co`) is **no longer needed** and should be deleted to prevent bypasses and keep the console secure.
* *Note: `localhost` is automatically allowed for local testing and does not need to be registered under Authorized Domains.*

### B. Authorized Redirect URIs (승인된 리디렉션 URI)
* **Strict Match**: Google performs a character-for-character match on redirect URIs. 
* Keep the production callback (`https://creaibox.com/supabase/auth/v1/callback`) and local callback (`http://localhost:3000/supabase/auth/v1/callback`).
* Delete the old direct Supabase callback to enforce that all logins pass through your branded proxy.

---

## 4. Step-by-Step Verification Process

When you are ready to submit your app for review in a new project:

1. **Complete your Branding Profile**:
   * Go to **APIs & Services** -> **OAuth consent screen** -> **Branding**.
   * Fill in the **App name** (use your clean brand name like `CreAibox`, not the domain).
   * Upload your **1:1 Symbol Logo**.
   * Provide links to your **Homepage**, **Privacy Policy** (e.g., `/privacy`), and **Terms of Service** (e.g., `/terms`). These pages must be live and accessible.
2. **Submit for Verification**:
   * Click the **Submit for Verification (인증 신청)** button.
3. **Monitor the Review**:
   * The review process typically takes **2 to 3 business days**.
   * Google's Trust & Safety team will send an email to your **Developer Contact Email** (e.g., `creaiboxofficial@gmail.com`).
   * They may ask you to verify domain ownership (via Google Search Console) or explain how you use the requested scopes. Respond promptly to their guidelines to finalize the approval.

구글 OAuth **앱 검토(인증)**를 진행하여 최종 승인(인증 완료)이 되면 서비스의 신뢰도와 운영 측면에서 다음과 같은 핵심적인 3가지 혜택을 얻게 됩니다.

1. "안전하지 않은 앱" 경고 화면 제거 (가장 중요)
인증을 받지 않은 상태에서 일반 사용자들에게 서비스를 오픈하면, 구글 로그인 버튼을 눌렀을 때 "이 앱은 Google의 확인을 받지 않았습니다" 또는 **"안전하지 않은 앱"**이라는 무서운 경고 창이 뜹니다.

사용자가 로그인하려면 '고급' 버튼을 누르고 '안전하지 않음으로 이동'을 클릭해야 하는 번거로움과 불안감을 겪게 됩니다. 이 경고는 사용자의 가입 이탈율을 극도로 높입니다.
인증 완료 시: 이 경고 창이 완전히 사라지고, 다른 대기업 서비스들처럼 깔끔하게 곧바로 로그인 동의 화면으로 넘어갑니다.
2. 로그인 화면에 공식 앱 로고(Logo) 노출
현재 올려주신 스크린샷에 예쁜 파란색 CAI 로고를 업로드해 두셨습니다.

구글은 보안 정책상 검토 및 인증이 완료되지 않은 앱의 로고는 실제 로그인 화면에 노출해주지 않습니다.
인증 완료 시: 사용자가 로그인할 때 브랜드명(CreAibox) 옆에 업로드하신 공식 로고가 예쁘게 표시되어 대외적인 신뢰도와 전문성이 극대화됩니다.
3. 로그인 사용자 수 제한 해제 (100명 제한)
인증받지 않은 앱은 구글 보안 정책상 '테스트/미인증 상태'로 분류되어 **최대 100명까지만 로그인(가입)**할 수 있습니다. 100명이 넘어가면 새로운 사용자는 로그인을 할 수 없도록 구글이 차단합니다.

인증 완료 시: 사용자 수 제한이 완전히 해제되어 수만, 수백만 명의 사용자가 제한 없이 회원가입하고 로그인할 수 있습니다.
요약
쉽게 말해, **"구글이 공식적으로 보증하는 안전한 서비스"**라는 마크를 획득하는 것입니다.

현재 검토 중(Reviewing) 상태이므로, 보통 2~3일(영업일 기준) 이내에 구글에서 인증 심사 결과 또는 추가 확인 메일이 발송됩니다. 메일이 오면 지침에 따라 가볍게 답변해 주시면 승인이 완료됩니다.

현재 등록하신 파비콘(앱 아이콘) 사진이 오히려 구글 로그인 화면에 가장 적합한 최적의 형태입니다. 굳이 홈페이지의 텍스트가 포함된 긴 공식 로고로 변경하실 필요가 없습니다.

그 이유는 다음과 같습니다.

1. 구글 로그인 창의 로고 노출 형태 (원형 1:1 비율)
구글 로그인 창에서 앱 로고는 가로로 긴 직사각형이 아니라, 아주 작은 1:1 비율의 원형(동그라미) 프레임 안에 들어가 노출됩니다.

만약 가로로 긴 텍스트 로고(예: CreAibox 글자가 다 들어간 로고)를 넣으면, 글씨가 너무 작아져서 알아보지 못하거나 원형 프레임 바깥으로 글자가 잘려 보기 싫게 나옵니다.
따라서 지금 등록하신 **정사각형 비율의 심볼형 아이콘(파란색 CAI 로고)**이 원형 프레임 안에 꽉 차고 깔끔하게 들어가므로 시각적으로 가장 완벽하게 어울립니다.
2. 글로벌 표준 사례
Notion: 글자가 들어간 로고 대신, 검은색 N 모양의 심볼 아이콘을 사용합니다.
Spotify: Spotify 글자 대신, 초록색 원형 와이파이 모양 심볼을 사용합니다.
Slack: Slack 글자 대신, 알록달록한 격자 모양 심볼을 사용합니다.
결론
현재 등록되어 있는 CAI 심볼형 파비콘 로고가 브랜드 인지성과 디자인 측면에서 최상의 형태이므로 그대로 유지하고 심사를 받으시는 것을 추천해 드립니다.


문서의 핵심 요약
인증의 핵심 가치: 유저 유입의 최대 장벽인 '안전하지 않은 앱' 경고창을 제거하고, 회원가입 100명 제한을 해제하며, 공식 로고를 로그인 화면에 노출시키는 필수 프로세스임을 명시.
로고 권장 규칙: 구글 로그인 창의 소형 원형(1:1) 프레임 특성상, 가로가 긴 텍스트 로고보다 현재 사용하신 심볼형 파비콘(예: CAI 로고)이 최적의 포맷임을 가이드라인화.
도메인 관리: 프록시 구축 후 불필요해진 기존 Supabase 도메인은 '승인된 도메인' 및 '리디렉션 URI'에서 모두 삭제하여 보안 및 브랜드 일관성을 지키는 아키텍처 정리법 수록.
심사 대처법: 구글 Trust & Safety 팀과의 이메일 소통 요령 및 소요 기간(영업일 2~3일) 안내.