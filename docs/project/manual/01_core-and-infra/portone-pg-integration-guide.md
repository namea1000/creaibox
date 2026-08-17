# CreaiBox 포트원(PortOne V2) PG 전자결제 통합 운용 가이드 & 매뉴얼

> **문서 상태**: 🟢 실전 구동 중 (Production Operational Manual)  
> **최종 수정일**: 2026-08-06  
> **관련 아키텍처 문서**: [`portone-pg-payment-architecture.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/01_core-and-infra/portone-pg-payment-architecture.md)  

---

## 1. 개요 (Overview)

본 매뉴얼은 CreaiBox 플랫폼의 **독립 도메인 1초 매입, 멤버십 월/년 요금제 결제, AI 커스텀 웹사이트 제작 및 AI 크레딧 충전** 등 전 서비스 유료 결제를 담당하는 대한민국 업계 표준 **포트원(PortOne V2 Gateway)** 전자결제 시스템의 실무 운용 및 환경변수 설정 가이드입니다.

---

## 2. 포트원 PG 하나로 지원하는 4대 결제 영역

1. **🌐 브랜드 독립 도메인 1초 실시간 구매** (`/studio/domain-search`)
   - Vercel 도메인 매입 및 글로벌 Edge IP(`76.76.21.21`) 1초 자동 바인딩 결제
2. **👑 멤버십 월/년 구독 요금제 결제** (`/studio/pricing`)
   - Business 플랜(월 49,000원 등) 구독 및 정기 자동 갱신(Billing Key) 결제
3. **🎨 AI 커스텀 웹사이트 템플릿 & 1:1 제작 구매** (`/studio/custom-client-site`)
   - 웹사이트 100+종 템플릿 구매 및 맞춤형 제작 견적 전자결제
4. **🪙 AI 자동 생성을 위한 크레딧/토큰 충전 결제**
   - AI 대용량 원고/이미지 자동 작성을 위한 크레딧 충전 결제

---

## 3. 포트원(PortOne) 키 발급 및 환경변수 3분 설정 가이드

### 3.1 포트원 콘솔 가입 및 키 복사 (HOW-TO)
1. **포트원 콘솔 접속**: [https://admin.portone.io](https://admin.portone.io) 로그인
2. **Store ID 복사**: `콘솔 ➔ 연동 정보 ➔ Store ID` (예: `store-a1b2c3d4-xxxx`)
3. **Channel Key 복사**: `콘솔 ➔ 결제 연동 ➔ 채널 관리`에서 토스페이먼츠, NHN KCP, 카카오페이 중 사용할 PG사를 채널로 추가 후 생성된 채널 키 복사 (예: `channel-key-xxxx`)
4. **API Secret Key 복사**: `콘솔 ➔ 연동 정보 ➔ API Key`

### 3.2 로컬 개발 환경 설정 (`.env.local`)
프로젝트 루트의 `.env.local` 파일에 복사한 3개 키를 입력합니다:

```env
# =================================================================
# 💳 포트원(PortOne V2) PG 전자결제 통합 연동 키
# =================================================================
NEXT_PUBLIC_PORTONE_STORE_ID="store-e6eac1b1-9dcf-47c8-a2be-2a19a35c11aa"
NEXT_PUBLIC_PORTONE_CHANNEL_KEY="channel-key-f53bb8b4-4b15-4865-8209-bebea0ff47a1"
PORTONE_API_SECRET="your_portone_api_secret_here"
```

### 3.3 Vercel 실서버 프로덕션 배포 설정
1. [Vercel Dashboard](https://vercel.com) ➔ CreaiBox 프로젝트 선택
2. **`Settings` ➔ `Environment Variables`** 이동
3. 위 3개 환경변수(`NEXT_PUBLIC_PORTONE_STORE_ID`, `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`, `PORTONE_API_SECRET`)를 등록 후 **Redeploy**를 진행합니다.
4. 배포 완료 즉시 가상 알림창 모드에서 **실제 신용카드/카카오페이 결제 팝업 모드**로 1초 만에 전환됩니다.

---

## 4. 바로 복사해서 사용하는 프론트엔드 연동 추천 코드 (Code Example)

CreaiBox 결제 헬퍼 유틸리티([`src/lib/client/payment.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/client/payment.ts))를 활용한 추천 결제 트리거 예시입니다:

```typescript
import { requestDomainPayment } from "@/lib/client/payment";

async function handleCheckout() {
  try {
    // 1. 프론트엔드 PG 결제 모달 팝업 트리거
    const paymentResult = await requestDomainPayment({
      orderName: "CreaiBox 독립 브랜드 도메인 (mybrand.com) 매입",
      totalAmount: 15750, // 실시간 환율 연동 원화 금액
      customerName: "홍길동",
      customerEmail: "user@creaibox.com",
    });

    if (paymentResult.success) {
      // 2. 결제 승인 성공 시 백엔드 매입 API 호출
      const res = await fetch("/api/domains/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: "mybrand.com",
          paymentId: paymentResult.paymentId,
          amount: 15750,
        }),
      });
      const data = await res.json();
      alert("🎉 결제 및 도메인 1초 연결이 성공적으로 완료되었습니다!");
    }
  } catch (err: any) {
    alert(`결제 오류: ${err.message}`);
  }
}
```

---

## 5. 금지 패턴 및 주의사항 (Anti-Patterns)

- ❌ **금지 1: 백엔드 결제 검증 생략 금지**
  - 클라이언트에서 결제가 완료되었다고 보내오는 `totalAmount`를 맹신하지 않고, 위변조 방지를 위해 서버측에서 포트원 API(`POST /payments/{paymentId}/verify`)로 실제 결제된 금액과 상품 금액을 2차 검증해야 합니다.
- ❌ **금지 2: `PORTONE_API_SECRET` 클라이언트 노출 금지**
  - `PORTONE_API_SECRET`은 서버 전용 키이므로 `NEXT_PUBLIC_` 접두사를 절대 붙이지 않고 백엔드 API 라우트에서만 사용해야 합니다.
- ❌ **금지 3: PG 키 미입력 상태에서의 실서버 서비스 오픈 금지**
  - PG 키가 없으면 안전 모의 결제 모드로 작동하므로, 서비스 정식 오픈 전에는 반드시 Vercel Environment Variables에 실키를 등록해야 합니다.

---

## 6. 자주 묻는 질문 (FAQ)

### Q1. 포트원 자체 이용 수수료가 드나요?
- **아닙니다. 포트원 솔루션 이용료는 0원(100% 무료)입니다.** 실제 카드 결제 시 발생하는 PG사(토스페이먼츠/이니시스 등) 결제 수수료(약 1.6%~3.2%)만 PG사로 정산됩니다.

### Q2. 해외 카드가 없는 국내 사용자도 도메인을 결제할 수 있나요?
- **네, 100% 가능합니다.** Vercel 도메인은 원칙적으로 해외 결제 카드가 필요하지만, CreaiBox가 중간에서 국내 PG(카카오페이/신용카드/계좌이체)로 정산받아 Vercel API로 실시간 구매하므로, 유저는 일반 국내 카드로 편하게 결제할 수 있습니다.
