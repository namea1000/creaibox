# CreAibox 포트원(PortOne V2) PG 결제 및 리셀러 정산 아키텍처 기술 명세서
(PortOne PG Payment & Reseller Settlement Architecture Spec)

> **문서 상태**: 🟢 시스템 반영 완료 (Production Spec)  
> **최종 수정일**: 2026-08-06  
> **관련 실무 매뉴얼**: [`portone-pg-integration-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/portone-pg-integration-guide.md)  

---

## 1. 아키텍처 개요 (Architecture Overview)

CreAibox 전자결제 시스템은 **국내 PG 결제(PortOne V2 Gateway)**와 **글로벌 레지스트라 도메인 1초 매입(Vercel Domains API)** 및 **실시간 환율 엔진(`exchange-rate.ts`)**이 유기적으로 결합된 무인 자동 리셀링 정산 아키텍처입니다.

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 (CreAibox 회원)
    participant Client as 브라우저 (React/Next.js)
    participant PG as 포트원 PG Gateway (PortOne V2)
    participant Server as CreAibox 백엔드 API (/api/domains/buy)
    participant Exchange as 실시간 환율 엔진 (exchange-rate.ts)
    
    ```typescript
    // PG 결제 수수료 (카드/카카오페이 3.3%~3.5%) 차감 후 정산 손실 방지 3.5% 포함 산출
    const PG_FEE_RATE = 1.035;
    const finalPriceKRW = Math.round(priceUSD * exchangeRate * PG_FEE_RATE);
    ```
    
    participant Vercel as Vercel / ICANN 레지스트라 API
    participant DB as Supabase DB (profiles.extra_configs)

    User->>Client: 1. "1초 구매하기" 클릭
    Exchange-->>Client: 2. 실시간 환율(1,418.5원) 기반 원화 결제액 산출 (15,750원)
    Client->>PG: 3. requestDomainPayment() PG 모달 팝업 요청
    User->>PG: 4. 신용카드 / 카카오페이 / 토스페이 15,750원 결제 승인
    PG-->>Client: 5. 결제 성공 수령 (paymentId 발급)
    Client->>Server: 6. POST /api/domains/buy (paymentId, domain, amount)
    Server->>Vercel: 7. POST /v5/domains/buy (Vercel 법인카드로 $11.25 실시간 매입)
    Vercel-->>Server: 8. 매입 성공 & 76.76.21.21 Edge IP 및 SSL 1초 바인딩 리턴
    Server->>DB: 9. profiles.extra_configs에 도메인 소유권 보관 기록
    Server-->>Client: 10. 도메인 구매 & 1초 Edge IP 연결 완료 JSON 응답
    Client-->>User: 11. 최종 완료 팝업 & 커스텀 웹사이트 템플릿 연결 활성화
```

---

## 2. 결제 파이프라인 컴포넌트 스펙 (Component Specifications)

### 2.1 클라이언트 결제 게이트웨이 유틸리티
- **위치**: [`src/lib/client/payment.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/client/payment.ts)
- **주요 역량**:
  - PortOne V2 JS SDK (`window.PortOne.requestPayment`) 트리거
  - `NEXT_PUBLIC_PORTONE_STORE_ID` 미설정 시 안전 모의 결제(Mock Test Approval) 모드 자동 전환
  - 카드, 카카오페이, 토스페이, 네이버페이 등 다중 채널 동시 지원

### 2.2 실시간 환율 및 원가 연산 백엔드 엔진
- **위치**: [`src/lib/server/exchange-rate.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/exchange-rate.ts) 및 [`src/lib/server/vercel-domains.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/vercel-domains.ts)
- **주요 역량**:
  - `open.er-api.com` 오픈 환율 API를 통해 네이버/하나은행 고시 환율(현재 1,418.5원)을 1시간 메모리 캐시로 동적 수집
  - Vercel 도메인 도매 원가($11.25, $13.50, $37.99 등)에 실시간 환율을 곱해 원화 결제 금액(`wholesalePrice`) 산출

### 2.3 실시간 도메인 매입 & DB 소유권 바인딩 API
- **위치**: [`src/app/api/domains/buy/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/domains/buy/route.ts)
- **주요 역량**:
  - Vercel Domains API(`POST /v5/domains/buy`) 및 DNS 바인딩 API(`POST /v9/projects/{id}/domains`) 릴레이 호출
  - CreAibox Edge IP `76.76.21.21` 및 SSL 보안 인증서 1초 자동 바인딩
  - Supabase `profiles.extra_configs.purchased_domains` 배열 및 결제 영수증 JSON 기록

---

## 3. 정산 및 마진 구조 (Settlement & Margin Architecture)

```
[유저 원화 결제] (15,750원)
        │
        ▼ (국내 PG사 정산)
[CreAibox 대표자 통장] (+15,750원 수령)
        │
        ▼ (Vercel 도메인 자동 매입)
[CreAibox Vercel 결제 카드] (-$11.25 청구, 약 15,950원)
```

- **유저 경험**: 해외 결제 전용 카드가 없는 유저도 국내 카드로 원화 도메인 즉시 구매 가능.
- **플랫폼 무인화**: 100% 무인 백엔드 API 연동으로 관리자의 수동 처리 개입 0건 달성.

---

## 4. 데이터베이스 스키마 (Database Schema)

Supabase `profiles.extra_configs` 컬럼 내 저장 구조 스펙:

```json
{
  "purchased_domains": [
    "sotongcheum.com",
    "auramerino.kr"
  ],
  "domain_payment_sotongcheum.com": {
    "paymentId": "ORD_1785984902_a1b2c",
    "amount": 15750,
    "purchasedAt": "2026-08-06T12:28:10.000Z",
    "realPurchased": true
  }
}
```
