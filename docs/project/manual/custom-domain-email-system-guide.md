# 📖 커스텀 도메인 이메일 시스템 구축 및 운용 매뉴얼 (Custom Domain Email Guide)

본 매뉴얼은 자사 이메일(`ceo@creaibox.com`) 구축부터 가입 유저(`user@downhubs.com`) 및 B2B 고객사 도메인 이메일(`contact@clientdomain.com`) 연동 및 Gmail 수발신 설정 방법을 단계별로 정리한 프로젝트 운용 가이드입니다.

---

## 1. 🥇 자사 이메일(`ceo@creaibox.com`) 1분 무료 구축 매뉴얼

### 1.1 Vercel DNS 유지 + ImprovMX 이메일 포워딩 (추천)
현재 `creaibox.com` 도메인의 네임서버가 Vercel로 설정되어 있으므로, 네임서버 이전 없이 Vercel 대시보드에서 설정합니다.

1. **ImprovMX (https://improvmx.com) 접속**:
   - `Domain`: `creaibox.com`
   - `Forward to`: 대표님 개인 Gmail 주소 (`yourname@gmail.com`) 입력 후 가입.
2. **Vercel DNS 레코드 등록**:
   - Vercel 대시보드 ➔ Domains ➔ `creaibox.com` ➔ DNS Records 추가:
     - **Type**: `MX`, **Name**: `@`, **Value**: `mx1.improvmx.com`, **Priority**: `10`
     - **Type**: `MX`, **Name**: `@`, **Value**: `mx2.improvmx.com`, **Priority**: `20`
     - **Type**: `TXT`, **Name**: `@`, **Value**: `v=spf1 include:spf.improvmx.com ~all`
3. **결과**: `ceo@creaibox.com`으로 들어오는 메일이 즉시 대표님 Gmail로 100% 무료 포워딩됩니다.

---

## 2. 📬 개인 Gmail에서 `ceo@creaibox.com` 이름으로 답장/발신 설정

대표님이 쓰시는 기존 Gmail 웹 화면이나 모바일 Gmail 앱에서 `ceo@creaibox.com`으로 발신하는 방법입니다.

1. **Gmail 웹 접속 ➔ 설정(⚙️) ➔ [모든 설정 보기]**:
2. **[계정 및 가져오기] 탭 ➔ `다른 이메일 주소 추가` 클릭**:
   - **이름**: 대표님 성함 / CreAibox CEO
   - **이메일 주소**: `ceo@creaibox.com`
   - **'별칭으로 사용' 체크** ➔ [다음 단계]
3. **SMTP 서버 설정**:
   - **SMTP 서버**: `smtp.gmail.com` (또는 Resend/ImprovMX 제공 SMTP)
   - **포트**: `587` (TLS) 또는 `465` (SSL)
   - **사용자 이름**: 대표님 개인 Gmail 주소
   - **비밀번호**: 구글 앱 비밀번호 (Google App Password) 16자리
4. **인증 완료**: 발송된 인증 메일 링크 클릭 시 설정 완료.

---

## 3. 👥 서비스 가입 유저 및 B2B 고객사 도메인 메일 자동화 매뉴얼

### 3.1 Resend 메일 인프라 가입 및 API 키 발급
1. **Resend (https://resend.com) 가입**: Free Plan (월 3,000건 무료 제공).
2. **API Keys 메뉴 ➔ `Create API Key` 클릭**:
   - 키 이름: `CREAIBOX_PRODUCTION_RESEND_KEY`
   - 발급된 API 키를 프로젝트 환경변수(`.env.local` / Vercel Environment Variables)에 등록:
     ```env
     RESEND_API_KEY=re_123456789...
     ```

### 3.2 고객사 Vercel 1초 자동 연동 매뉴얼 (Zero-Touch)
1. 고객사가 CreAibox에서 도메인을 구매하거나 Vercel로 이관한 경우.
2. 대시보드의 `[ ⚡ 이메일 1초 자동 연동 ]` 버튼 클릭.
3. 백엔드에서 `resend.domains.create()` ➔ `createDomainRecord()` 백그라운드 자동 호출.
4. 고객사는 수동 복사 없이 **1초 만에 메일 서버 연동 완료**.

---

## 4. ❓ 자주 묻는 질문 (FAQ)

### Q1. 고객사 도메인이 50개로 늘어나면 추가 비용이 많이 나오나요?
- **아닙니다!** Resend는 도메인 등록 개수 자체는 100% 무료(0원)입니다. 오직 한 달간 보낸 총 메일 수가 3,000건을 넘을 때에만 월 $20 (약 2.7만 원) 플랜으로 전환되며, 50개 고객사를 모두 커버할 수 있습니다.

### Q2. Cloudflare Email Workers는 왜 지금 안 쓰나요?
- Cloudflare Email Workers는 도메인 네임서버가 Cloudflare일 때만 구동됩니다. 현재 CreAibox 도메인 네임서버가 Vercel이므로, 네임서버 변경 없이 바로 쓸 수 있는 **Vercel DNS + Resend** 방식이 훨씬 편리하고 안전합니다.

### Q3. 특정 고객사가 하루 수천 건 이상 메일을 보내 비용이 급증하면 어떻게 하나요?
- 기본 발송 쿼터(일 50~300건) 제한 로직이 자동으로 작동하여 차단됩니다. 대량 발송이 필요한 고객사는 **추가 쿼터 팩 구매** 또는 **본인의 Resend API 키 등록(BYOK)** 방식으로 처리되어 자사의 비용 위험은 0%입니다.

### Q4. 수신 메일 본문이나 첨부파일을 CreAibox DB에 저장하나요?
- **절대 저장하지 않습니다 (Zero DB Storage)!** DB에 메일 본문을 보관하면 DB 용량이 낭비되고 개인정보 유출 리스크가 발생합니다. 이메일은 들어오는 즉시 무상태(Stateless)로 고객의 Gmail/Naver로 100% 통과 전송되므로, DB 용량 부담과 보안 위험이 0%입니다.
