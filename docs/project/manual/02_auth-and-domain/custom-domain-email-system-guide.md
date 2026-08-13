# 📖 커스텀 도메인 이메일 시스템 구축 및 운용 매뉴얼 (Custom Domain Email Guide)

본 매뉴얼은 자사 이메일(`ceo@creaibox.com`) 구축부터 가입 유저(`user@downhubs.com`) 및 B2B 고객사 도메인 이메일(`contact@clientdomain.com`) 연동, Resend Inbound Webhook 연동, Vercel 환경변수 배포 및 Gmail 수발신 설정 방법을 단계별로 정리한 프로젝트 최신 운용 가이드입니다.

---

## 1. 🥇 시스템 개요 및 100% 무상태(Stateless Zero-DB) 아키텍처

- **Zero-DB Storage 방침**: 이메일 본문, 첨부파일, HTML 텍스트를 DB에 보관하지 않음으로써 DB 용량 낭비 0원 및 개인정보 유출 보안 리스크 100% 원천 차단.
- **수발신 구조**: 들어오는 이메일은 Resend Inbound Webhook(`https://creaibox.com/api/webhooks/resend-inbound`)을 통과하여 즉시 지정된 담당자 개인 메일(Gmail/Naver)로 1초 만에 포워딩.

---

## 2. 🚀 도메인 DNS 1초 자동 주입 및 Resend 도메인 인증

### 2.1 Resend 도메인 추가 (`resend.com/domains`)

1. Resend 대시보드 ➔ Domains ➔ `Add domain` 클릭.
2. Domain Name: `creaibox.com` (또는 고객사 도메인 입력).
3. Region: `Tokyo (ap-northeast-1)` 선택 ➔ `Add domain` 클릭.

### 2.2 Vercel DNS 레코드 백그라운드 자동 주입 모듈

CreAibox에는 Vercel Domains API(`addDnsRecordToVercel`)가 탑재되어 있어, 수동 복사 없이 백엔드가 5대 DNS 레코드를 Vercel DNS에 100% 자동 입력합니다.

- `DKIM (TXT)`: `resend._domainkey`
- `SPF (MX)`: `send` (우선순위 10)
- `SPF (TXT)`: `send` (`v=spf1 include:amazonses.com ~all`)
- `DMARC (TXT)`: `_dmarc` (`v=DMARC1; p=none;`)
- `Inbound (MX)`: `@` (`inbound-smtp.ap-northeast-1.amazonaws.com`, 우선순위 10)

---

## 3. 🔗 Resend Inbound Webhook 연동 매뉴얼

수신된 메일을 CreAibox 포워딩 백엔드 모듈로 전달하기 위한 1회성 Webhook 설정입니다.

1. **Resend 접속 (`https://resend.com/webhooks`)**:
2. **`[ Add Webhook ]`** 클릭:
   - **Endpoint URL**: `https://creaibox.com/api/webhooks/resend-inbound`
   - **Events**: `email.received` 체크
   - **Save** 클릭 (STATUS: `Enabled` 확인)
3. **Vercel 프로덕션 환경변수 등록 (`https://vercel.com`)**:
   - `creaibox` 프로젝트 ➔ Settings ➔ Environment Variables
   - **Key**: `RESEND_API_KEY`, **Value**: `re_5K4...` 입력 후 **Redeploy**

---

## 4. ✉️ CreAibox 대시보드 내 포워딩 주소 관리 UI (/studio/domain-search)

어드민 및 일반/B2B 고객사가 자신의 도메인 이메일 포워딩 주소를 직접 등록하는 UI 페이지입니다.

- **메뉴 위치**: `[ AI STUDIO ]` ➔ `[ 도메인 조회 & 구매 / 연동 ]` (`/studio/domain-search`) ➔ **`3️⃣ ✉️ 커스텀 이메일 1초 연동`** 탭
- **포워딩 주소 추가**:
  - `대표 이메일 주소`: `ceo`, `contact`, `cs`, `sales` 등 입력
  - `연결할 담당자 이메일`: `creaiboxofficial@gmail.com` 등 입력 ➔ `[ 🚀 1초 이메일 주소 등록하기 ]` 클릭

---

## 5. 📬 개인 Gmail에서 `ceo@creaibox.com` 이름으로 답장/발신 설정

대표님이 쓰시는 기존 Gmail 웹 화면이나 모바일 Gmail 앱에서 `ceo@creaibox.com` 발신자로 메일을 보내는 방법입니다.

1. **Gmail 웹 접속 (`mail.google.com`) ➔ 설정(⚙️) ➔ [모든 설정 보기]**:
2. **[계정 및 가져오기] 탭 ➔ `다른 이메일 주소 추가` 클릭**:
   - **이름**: `CreAibox CEO` (또는 대표님 성함)
   - **이메일 주소**: `ceo@creaibox.com`
   - **'별칭으로 사용' 체크** ➔ [다음 단계]
3. **Resend SMTP 정보 입력**:
   - **SMTP 서버**: `smtp.resend.com`
   - **포트**: `465` (또는 `587`)
   - **사용자 이름**: `resend` (문자 그대로 resend 입력)
   - **비밀번호**: Resend API Key (`re_5K4...`) 입력
4. **인증 완료**: Gmail함으로 발송된 구글 확인 메일의 링크 클릭.

---

## 6. ❓ 자주 묻는 질문 및 트러블슈팅 (FAQ)

### Q1. 수신 메일이 오지 않고 Webhook에서 404 Not Found 에러가 발생합니다.

- **원인**: 웹훅 백엔드 파일(`src/app/api/webhooks/resend-inbound/route.ts`)이 로컬 컴퓨터에만 있고 Vercel 프로덕션 서버에 배포되지 않은 상태입니다.
- **해결**: `git push` 실행 후 Vercel 배포 완료 시 100% 정상 가동됩니다.

### Q2. Webhook에서 `{"error":"RESEND_API_KEY 환경변수가 설정되지 않았습니다."}` (500 에러)가 뜹니다.

- **원인**: Vercel 프로덕션 환경변수에 `RESEND_API_KEY`가 미등록되었기 때문입니다.
- **해결**: Vercel 대시보드 ➔ Settings ➔ Environment Variables 에 `RESEND_API_KEY` 등록 후 Redeploy 진행.
