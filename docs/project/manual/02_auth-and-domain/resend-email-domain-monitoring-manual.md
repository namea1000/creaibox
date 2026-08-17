# Resend 이메일 & 도메인 통합 모니터링 실전 운용 매뉴얼 (`docs/project/manual/02_auth-and-domain/resend-email-domain-monitoring-manual.md`)

CreaiBox 관리자 센터 내 구축된 **Resend 커스텀 도메인 이메일 연동 및 메일 발/수신 모니터링 시스템(` /admin/resend `)**의 실무 운용 및 개발 가이드 문서입니다.

---

## 1. 주요 기능 및 대시보드 화면 구성

| 탭 / 영역 | 주요 모니터링 항목 | 설명 |
|---|---|---|
| **KPI 카운터 (상단 4종)** | · 등록 커스텀 도메인 수<br/>· 이메일 별칭 생성 계정 수<br/>· 총 수신 메일 (Inbound)<br/>· 총 발송 메일 (Outbound) | Resend API 및 DB와 실시간 연동된 전체 서비스 메일 현황 |
| **🌐 도메인 & 이메일 계정 탭** | · Resend 등록 도메인 (DNS, DKIM, SPF 검증 상태)<br/>· 도메인별 이메일 계정 매핑 목록 (`ceo@creaibox.com` 등)<br/>· 계정 소유 유저 닉네임 및 이메일 | 어떤 도메인으로 총 몇 개의 사용자 이메일 포워딩 계정이 생성되었는지 모니터링 |
| **📥 수신 메일 이력 (Inbound)** | · 원발신자 (From)<br/>· 수신주소 (To)<br/>· 이메일 제목 (Subject)<br/>· 수신일시 | 외부(네이버, Gmail 등)에서 커스텀 도메인 이메일로 수신된 실시간 이메일 이력 |
| **📤 발송 메일 이력 (Outbound)** | · 발신주소 (From)<br/>· 최종 수신자 (To)<br/>· 메일 제목<br/>· 전송 상태 (`delivered` 등)<br/>· 발송일시 | Resend를 통해 지정된 목적지 이메일로 포워딩 발송된 실시간 내역 |

---

## 2. HOW-TO: 실전 운용 가이드

### 2.1 대시보드 접속 방법
1. 관리자 계정으로 로그인 후 사이드바 하단 `[ 관리자 센터 ]` → `[ Resend 이메일 관리 ]` 클릭
2. 직관적인 주소 `/admin/resend` 로 직접 이동 가능

### 2.2 메일 수신/발송 현황 최신화
- 대시보드 우측 상단의 **`[ 🔄 새로고침 ]`** 버튼을 누르면 DB 트래픽 소모 없이 Resend 최신 이력을 0.1초 만에 재조회합니다.

---

## 3. 금지 패턴 (Anti-Patterns) 🚫

> [!CAUTION]
> **금지 패턴 1: Inbound 웹훅 수신 시 `resend.emails.get(emailId)` 사용 금지**
> - Resend의 `emails.get()`은 **아웃바운드(발송) 메일 전용 API**입니다.
> - 인바운드 수신 메일의 본문(HTML/Text)을 읽을 때는 반드시 **`resend.emails.receiving.get(emailId)`**를 호출해야 합니다.

> [!WARNING]
> **금지 패턴 2: Resend API Key 권한 제한 설정 금지**
> - Resend 대시보드 API Key 권한이 `Sending access` (발송 전용)로 설정되어 있으면 수신 메일 본문 조회 시 `401 Restricted Key` 오류가 발생합니다.
> - API 키 권한은 반드시 **`Full access`** 로 설정해야 합니다.

> [!IMPORTANT]
> **금지 패턴 3: 가짜(Mock/Dummy) 데이터 합성 금지 (Strict Zero Fake Data Rule)**
> - 수신 메일이나 등록 도메인이 0건일 때 임의로 가짜 이메일 이력을 만들어 표시하지 마시고, **`데이터가 없습니다`** 메시지와 사유를 솔직히 노출해야 합니다.

---

## 4. 추천 코드 예시 (Best Practice Code Example)

### Resend 인바운드 수신 이메일 본문 조회 및 포워딩 발송
```typescript
import { getResendClient, sendEmailViaResend } from "@/lib/server/resend-email";

export async function processInboundEmail(emailId: string, recipient: string) {
  const resend = getResendClient();

  // ✅ 인바운드 전용 API 사용 (resend.emails.receiving.get)
  const inboundRes = await resend.emails.receiving.get(emailId);

  if (inboundRes.error || !inboundRes.data) {
    throw new Error(`Inbound email fetch failed: ${inboundRes.error?.message}`);
  }

  const { html, text } = inboundRes.data;

  // 목적지 지정 이메일로 전달 전송
  await sendEmailViaResend({
    to: recipient,
    subject: `[전달: ${recipient}] 수신 메일`,
    html: html || text || "<p>본문 내용 없음</p>",
  });
}
```

---

## 5. 자주 묻는 질문 (FAQ)

**Q. 메일 본문 내용이 `(수신된 메일 본문 내용이 없습니다)` 로 표기돼요.**
- **A**: Resend 대시보드(`https://resend.com/api-keys`)에서 API Key의 권한이 `Full access`인지 확인해 주세요. `Sending access`인 경우 본문을 가져올 수 없습니다.

**Q. 이 페이지를 자주 조회하면 Vercel이나 Supabase 요금이 많이 나오나요?**
- **A**: 아니오! 본문 콘텐츠(`content`)를 DB에 저장하지 않고 Resend 무상 API 쿼리로 100% 실시간 불러오므로 Egress 트래픽 소모가 제로(0.001MB 미만)에 가깝습니다.
