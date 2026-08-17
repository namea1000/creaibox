# 📧 CreaiBox 공식 이메일 계정 마스터 가이드 (`docs/project/manual/01_core-and-infra/creaibox-official-email-accounts-guide.md`)

본 문서는 **creaibox.com 글로벌 플랫폼 서비스 운용**에 필요한 필수 커스텀 도메인 이메일 계정(`***@creaibox.com`) 리스트, 용도별 분류, 수/발신 포워딩 정책, Supabase/Resend 연동 설정 및 보안 운용 가이드 대장입니다.

---

## 1. 📋 서비스 공식 이메일 계정 마스터 리스트 (7대 핵심 계정)

| 이메일 주소 | 분류 | 대표 용도 | 수/발신 정책 | 추천 포워딩 목적지 (Reply-To) |
|---|---|---|---|---|
| **`noreply@creaibox.com`** | **시스템 발신 전용** | · 회원가입 이메일 인증 (`Confirm Email`)<br/>· 시스템 중요 공지사항 자동 발송 | 발신 전용 (Outbound Only) | `support@creaibox.com` |
| **`auth@creaibox.com`** | **보안/인증 전용** | · 비밀번호 재설정 링크 발송<br/>· 2단계 보안 인증(MFA) 핀코드 전달 | 수/발신 가능 | `ceo@creaibox.com` |
| **`support@creaibox.com`** | **고객 지원 (CS)** | · 1:1 고객 문의 접수 및 답변<br/>· 서비스 버그 제보 및 개선 요청 수신 | 수/발신 가능 | 대표 관리자 개인 메일 |
| **`ceo@creaibox.com`** | **대표 이사 (CEO)** | · 최고 경영자 대외 공식 연락처<br/>· 주요 파트너십 및 법적/서비스 총괄 | 수/발신 가능 | 대표 관리자 개인 메일 |
| **`contact@creaibox.com`** | **B2B / 제휴** | · 기업 맞춤형 AI 구축 문의<br/>· 광고/협업/리셀러 제안 수신 | 수/발신 가능 | B2B 담당자 또는 대표 메일 |
| **`billing@creaibox.com`** | **결제 / 정산** | · 결제 영수증 자동 발송<br/>· 전자세금계산서 발행 및 환불 문의 | 수/발신 가능 | 재무/결제 담당자 메일 |
| **`admin@creaibox.com`** | **시스템 서버 알림** | · Vercel / Supabase 서버 장애 경고<br/>· 크론 배치 작업 에러 리포트 수신 | 수/발신 가능 | 시스템 엔지니어/관리자 메일 |

---

## 2. 🎯 계정별 상세 설명 및 운용 가이드

### ① `noreply@creaibox.com` (시스템 자동 발신 전용 - 1순위 표준)
- **용도**: Supabase 회원가입 확인 메일, 시스템 자동 알림 발송.
- **특징**: "본 메일은 발신 전용 메일입니다" 문구 적용. 전 세계 IT 서비스 스팸 방지 신뢰도 1위 규격.
- **설정**: Supabase `Authentication` -> `Email Templates`의 From Address로 지정.

### ② `auth@creaibox.com` (보안 및 본인 인증)
- **용도**: 비밀번호 변경/찾기, 계정 보안 위험 알림, 본인 확인 핀코드 발송.
- **특징**: 유저에게 "보안 관련 메일"임을 직관적으로 전달하여 피싱 메일과 구분.

### ③ `support@creaibox.com` (고객 지원 & CS 센터)
- **용도**: 플랫폼 1:1 문의 답변, 서비스 가이드 안내, 유저 불만 및 요금 문의 응대.
- **특징**: 유저가 `noreply` 메일에 답장을 보낼 경우 자동으로 `support@creaibox.com`으로 수신되도록 `Reply-To` 설정.

### ④ `ceo@creaibox.com` (대표 계정)
- **용도**: 투자 유치(IR), 플랫폼 공식 대표 명의 통신, 정부 과제 및 중요 계약.

### ⑤ `contact@creaibox.com` (B2B 제휴 & 마케팅)
- **용도**: B2B 기업 커스텀 사이트 제작 신청, 리셀링 파트너십, 제휴 제안서 수신.

### ⑥ `billing@creaibox.com` (결제 및 구독 정산)
- **용도**: 토스페이먼츠/포트원/Stripe 결제 확인서, 구독 플랜 변경/해지, 환불 및 세금계산서 관련 통신.

### ⑦ `admin@creaibox.com` (시스템 관제탑)
- **용도**: 백그라운드 자동 크론(Cron) 실패 알림, API 쿼터 초과 경고, Supabase DB 시스템 로그 전송.

---

## 3. ⚙️ 서비스 연동 셋팅 방법 (Supabase & Resend)

### 3.1 CreaiBox 이메일 포워딩 등록 (`/studio/domain-search`)
1. `/studio/domain-search` 또는 관리자 센터 이동
2. `creaibox.com` 도메인 아래에 다음 7개 별칭 계정을 등록:
   - `noreply` → 대표 목적지 메일
   - `auth` → 대표 목적지 메일
   - `support` → 대표 목적지 메일
   - `ceo` → 대표 목적지 메일
   - `contact` → 대표 목적지 메일
   - `billing` → 대표 목적지 메일
   - `admin` → 대표 목적지 메일

### 3.2 Supabase Auth 가입 인증 메일 연동 설정 (상세 세팅)

#### 1) 이메일 인증 기능 활성화 (Confirm Email)
- **메뉴 경로**: Supabase Dashboard → `Authentication` → `Sign In / Providers` → `Email`
- **설정**: **`Confirm email`** 스위치를 **`ON`**으로 설정 및 `Save` 저장.
- *참고*: 구글/네이버/카카오 소셜 로그인은 OAuth 검증 시 `email_verified: true`로 수신되므로 이메일 인증 과정을 거치지 않고 **0.1초 만에 즉시 가입 완료**됩니다.

#### 2) Resend Custom SMTP 연결 (SMTP Settings)
- **메뉴 경로**: Supabase Dashboard → `Authentication` → `Emails` → `SMTP Settings`
- **`Enable custom SMTP`**: **`ON`**으로 활성화
- **상세 입력 항목**:
  - **Sender email address**: `noreply@creaibox.com`
  - **Sender name**: `CreaiBox` (또는 `크리에이박스`)
  - **Host**: `smtp.resend.com`
  - **Port number**: `465` (또는 `587`)
  - **Minimum interval per user**: `60` seconds
  - **Username**: `resend` *(Resend API 표준 고정 문자열)*
  - **Password**: Resend API Key (`re_5K4JnXi7_...` 형태로 본인의 Full Access API 키 입력)

#### 3) 회원가입 이메일 인증 템플릿 설정 (Confirm signup)
- **메뉴 경로**: Supabase Dashboard → `Authentication` → `Emails` → `Templates` → **`Confirm sign up`**
- **Subject (메일 제목)**:
  ```text
  [CreaiBox] 회원가입 이메일 인증 / Verify your email address
  ```
- **Message Body (한-영 병기 + 약관 링크 포함 프리미엄 HTML 코드)**:
  ```html
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CreaiBox Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#09090b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f4f4f5;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b; padding:40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#18181b; border:1px solid #27272a; border-radius:24px; padding:40px 32px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
            
            <!-- Logo Header -->
            <tr>
              <td align="left" style="padding-bottom:24px; border-bottom:1px solid #27272a;">
                <span style="font-size:24px; font-weight:900; font-style:italic; letter-spacing:-0.05em; color:#ffffff;">
                  Cre<span style="color:#3b82f6;">Ai</span>box
                </span>
                <span style="font-size:10px; font-weight:700; color:#71717a; text-transform:uppercase; letter-spacing:0.15em; margin-left:8px;">
                  AI Studio Global
                </span>
              </td>
            </tr>

            <!-- KOREAN SECTION -->
            <tr>
              <td align="left" style="padding-top:24px; padding-bottom:12px;">
                <h1 style="margin:0 0 10px 0; font-size:20px; font-weight:800; color:#ffffff; line-height:1.3;">
                  CreaiBox 회원가입을 환영합니다! 🎉
                </h1>
                <p style="margin:0 0 18px 0; font-size:14px; line-height:1.6; color:#a1a1aa;">
                  CreaiBox AI 스튜디오 서비스를 이용해 주셔서 감사합니다.<br>
                  아래 버튼을 클릭하시면 이메일 인증이 완료되며 즉시 모든 기능을 이용하실 수 있습니다.
                </p>
              </td>
            </tr>

            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding:10px 0 24px 0;">
                <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block; padding:14px 36px; background-color:#3b82f6; color:#ffffff; font-size:15px; font-weight:800; text-decoration:none; border-radius:14px; box-shadow:0 4px 14px rgba(59,130,246,0.4);">
                  ✉️ 이메일 인증 완료하기 / Verify Email
                </a>
              </td>
            </tr>

            <!-- ENGLISH SECTION -->
            <tr>
              <td align="left" style="padding-top:20px; padding-bottom:16px; border-top:1px dashed #27272a;">
                <h2 style="margin:0 0 8px 0; font-size:18px; font-weight:800; color:#ffffff; line-height:1.3;">
                  Welcome to CreaiBox AI Studio! 🚀
                </h2>
                <p style="margin:0; font-size:13px; line-height:1.6; color:#a1a1aa;">
                  Thank you for signing up for CreaiBox AI Studio.<br>
                  Please click the button above or the link below to verify your email address.
                </p>
              </td>
            </tr>

            <!-- Link Fallback -->
            <tr>
              <td align="left" style="padding-top:20px; border-top:1px solid #27272a;">
                <p style="margin:0 0 6px 0; font-size:11px; color:#71717a; line-height:1.4;">
                  버튼이 클릭되지 않는 경우 아래 URL을 복사하여 브라우저 주소창에 직접 붙여넣으세요.<br>
                  If the button doesn't work, copy and paste the URL below into your browser:
                </p>
                <p style="margin:0; font-size:11px; color:#3b82f6; word-break:break-all; line-height:1.4;">
                  {{ .ConfirmationURL }}
                </p>
              </td>
            </tr>

            <!-- LEGAL & TERMS SECTION -->
            <tr>
              <td align="left" style="padding-top:24px; border-top:1px solid #27272a;">
                <p style="margin:0 0 10px 0; font-size:11px; color:#71717a; line-height:1.5;">
                  본 이메일 인증을 완료하면 CreaiBox의 <a href="https://creaibox.com/terms" target="_blank" style="color:#a1a1aa; text-decoration:underline;">이용약관(Terms of Service)</a> 및 <a href="https://creaibox.com/privacy" target="_blank" style="color:#a1a1aa; text-decoration:underline;">개인정보처리방침(Privacy Policy)</a>에 동의하는 것으로 간주됩니다.
                </p>
              </td>
            </tr>

            <!-- Footer Info -->
            <tr>
              <td align="left" style="padding-top:16px; font-size:11px; color:#52525b; line-height:1.5;">
                <p style="margin:0 0 4px 0;">
                  본 메일은 발신 전용 메일입니다. / This is an automated email, please do not reply.
                </p>
                <p style="margin:0;">
                  Support & Inquiries: <a href="mailto:support@creaibox.com" style="color:#71717a; text-decoration:underline;">support@creaibox.com</a>
                </p>
                <p style="margin:12px 0 0 0; font-weight:700; color:#3f3f46;">
                  © CreaiBox AI Studio. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  ```

### 3.3 모든 회원가입 수단(Google, Naver, Kakao, Email) 신규 가입 축하 웰컴 이메일(Welcome Email) 자동 발송 파이프라인

CreaiBox 플랫폼은 사용자가 어떤 가입 수단(Google OAuth, Naver OAuth, Kakao OAuth, 일반 Email/Password)을 사용하든 회원가입이 완료되는 시점에 `noreply@creaibox.com` 명의로 **`🎉 회원가입 축하 웰컴 이메일`**을 0.1초 만에 백그라운드 무인 자동 발송합니다.

#### 1) 수단별 콜백 처리 및 중복 발송 방지 (Deduplication)
- **Google / Kakao / Email 가입**: `src/app/auth/callback/route.ts`
  - OAuth 인증 코드 교환(`exchangeCodeForSession`) 직후 유저 메타데이터의 `welcome_email_sent` 플래그를 확인합니다.
  - 미발송 신규 유저인 경우 `sendWelcomeEmail()`을 비동기 트리거하고 `welcome_email_sent: true`를 Supabase Auth 메타데이터에 기록하여 재로그인 시 중복 발송을 100% 방지합니다.
- **Naver 가입**: `src/app/api/auth/callback/naver/route.ts`
  - `createUser`로 최초 네이버 신규 사용자가 데이터베이스에 생성되는 순간 `sendWelcomeEmail()`을 트리거합니다.

#### 2) 웰컴 메일 백엔드 모듈 (`src/lib/server/resend-email.ts`)
- **발신자**: `CreaiBox <noreply@creaibox.com>`
- **수신 거부/답장 수신 (Reply-To)**: `support@creaibox.com`
- **제목**: `🎉 [CreaiBox] {formattedName}, 회원가입을 진심으로 축하합니다!` *(호칭 중복 '님님' 자동 방지 보정)*
- **본문 디자인 주요 구성**:
  - `formattedName` 호칭 자동 보정 (예: '대표님' ➔ '대표님', '홍길동' ➔ '홍길동님')
  - **오픈 베타 혜택**: 플랫폼 내 모든 주요 AI 원고 및 제작 도구 무료 이용 안내 카드
  - **CTA 버튼**: `[ ✨ AI 스튜디오 시작하기 / Start AI Studio ]` (`https://creaibox.com/writing/creaibox/new-post`)
  - **테마**: 가독성이 뛰어난 눈이 편안한 라이트 화이트 테마 적용
  - **다국어 지원**: 상단 한국어, 하단 English 병기 적용

#### 3) 백엔드 발송 헬퍼 예시
```typescript
import { sendWelcomeEmail } from "@/lib/server/resend-email";

// 회원가입 완료 콜백 지점에서 비동기 호출
void sendWelcomeEmail({
  userEmail: user.email,
  userName: user.user_metadata?.full_name || "크리에이터",
});
```

#### 4) 회원가입 축하 웰컴 이메일 전체 HTML 템플릿 풀 코드 (Full Source Code)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CreaiBox AI Studio</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0f172a;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding:40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:40px 32px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="left" style="padding-bottom:24px; border-bottom:1px solid #f1f5f9;">
              <span style="font-size:24px; font-weight:900; font-style:italic; letter-spacing:-0.05em; color:#0f172a;">
                Cre<span style="color:#2563eb;">Ai</span>box
              </span>
              <span style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.15em; margin-left:8px;">
                AI Studio Global
              </span>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td align="left" style="padding-top:28px; padding-bottom:16px;">
              <h1 style="margin:0 0 12px 0; font-size:22px; font-weight:800; color:#0f172a; line-height:1.3;">
                🎉 ${formattedName}, CreaiBox AI 스튜디오 가입을 환영합니다!
              </h1>
              <p style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#334155;">
                CreaiBox 가족이 되신 것을 진심으로 축하드립니다.<br>
                이제 최신 AI 원고 자동 작성, 블로그 및 웹사이트 제작, 비디오 편집기, 키워드 트렌드 분석 등 AI Studio 의 모든 기능을 자유롭게 이용하실 수 있습니다.
              </p>
            </td>
          </tr>

          <!-- Beta Period Info Card -->
          <tr>
            <td align="left" style="padding-bottom:24px;">
              <div style="background-color:#f1f5f9; border:1px solid #e2e8f0; border-radius:16px; padding:18px 20px;">
                <h3 style="margin:0 0 6px 0; font-size:14px; font-weight:800; color:#2563eb;">🎁 오픈 베타 테스트 무료 이용 혜택</h3>
                <p style="margin:0; font-size:13px; color:#475569; line-height:1.5;">현재 베타 테스트 기간 동안 플랫폼 내 모든 주요 AI 원고 및 제작 도구를 무료로 이용하실 수 있습니다.</p>
              </div>
            </td>
          </tr>

          <!-- CTA Button (Direct to /writing/creaibox/new-post) -->
          <tr>
            <td align="center" style="padding:10px 0 28px 0;">
              <a href="https://creaibox.com/writing/creaibox/new-post" target="_blank" style="display:inline-block; padding:15px 40px; background-color:#2563eb; color:#ffffff; font-size:15px; font-weight:800; text-decoration:none; border-radius:14px; box-shadow:0 4px 14px rgba(37,99,235,0.3);">
                ✨ AI 스튜디오 시작하기 / Start AI Studio
              </a>
            </td>
          </tr>

          <!-- English Section -->
          <tr>
            <td align="left" style="padding-top:20px; padding-bottom:16px; border-top:1px dashed #e2e8f0;">
              <h2 style="margin:0 0 8px 0; font-size:17px; font-weight:800; color:#0f172a; line-height:1.3;">
                Welcome to CreaiBox AI Studio! 🚀
              </h2>
              <p style="margin:0; font-size:13px; line-height:1.6; color:#475569;">
                Hi ${rawName}, thank you for joining CreaiBox.<br>
                Start creating high-quality content, building websites, and leveraging video tools & trend analysis with ease.
              </p>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td align="left" style="padding-top:24px; border-top:1px solid #f1f5f9; font-size:11px; color:#64748b; line-height:1.5;">
              <p style="margin:0 0 4px 0;">
                본 메일은 발신 전용 메일입니다. / This is an automated email, please do not reply.
              </p>
              <p style="margin:0;">
                Support & Inquiries: <a href="mailto:support@creaibox.com" style="color:#2563eb; text-decoration:underline;">support@creaibox.com</a>
              </p>
              <p style="margin:12px 0 0 0; font-weight:700; color:#94a3b8;">
                © CreaiBox AI Studio. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

2. **Strict Zero Fake Data 원칙**:
   - 발신되는 모든 이메일 본문은 진짜 인증 링크 및 진짜 정보만 포함해야 하며, 임의의 가짜 템플릿 문구를 혼용하지 않습니다.

---

## 5. 🚀 향후 이메일 시스템 개발 로드맵 & 할 일 (Future Roadmap)

- [ ] **🌐 글로벌 영문 서비스 오픈 시 유저 Locale 기반 자동 언어 분기 인증 메일 시스템 탑재**
  - **내용**: 해외 유저 접속 증가 및 글로벌 서비스 정식 오픈 시, 브라우저/계정 언어 설정(Locale `en` vs `ko`)을 감지하여 100% 영문 단독 메일 템플릿으로 자동 분기 발송하는 Supabase Auth Send Email Hook 파이프라인 개발 예정.
- [ ] **📥 Resend Inbound 기반 사용자 1:1 수신함(Inbox) 대시보드 뷰어 구축**
  - **내용**: 유저별 커스텀 도메인 이메일로 전달받은 이메일 목록을 CreaiBox AI Studio 대시보드 내에서 간편하게 실시간으로 조회하고 검색하는 웹 뷰어 개발 예정.
- [ ] **📊 고객사 플랜별 일일/월간 이메일 발송 쿼터(Quota Throttling) 및 스팸 제어**
  - **내용**: 회원 등급별(Free, Pro, Business) 일일 이메일 발송 한도를 제한하고 쿼터 초과 시 자동 차단 및 추가 쿼터 팩 결제 연동.
- [ ] **🔑 대량 발송 헤비 고객사 전용 API 키 직접 입력(BYOK: Bring Your Own Key) 지원**
  - **내용**: 일 수천~수만 건 대량 메일을 발송하는 B2B 기업 고객을 위해 사용자가 직접 보유한 Resend API 키를 연동하는 모듈 개발 예정.

