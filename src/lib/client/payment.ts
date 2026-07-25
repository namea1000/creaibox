/**
 * PortOne V2 & Toss Payments Client Gateway Trigger
 * (CreAibox Domain & Custom Site Payment Engine)
 */

declare global {
  interface Window {
    PortOne?: any;
  }
}

export interface PaymentRequestData {
  orderName: string;
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
}

export async function requestDomainPayment({
  orderName,
  totalAmount,
  customerName = "CreAibox 회원",
  customerEmail = "customer@creaibox.com",
}: PaymentRequestData): Promise<{ success: boolean; paymentId: string }> {
  // 1. 비즈니스 회원 0원 무상 혜택인 경우 즉시 승인
  if (totalAmount <= 0) {
    return { success: true, paymentId: `FREE_PERK_${Date.now()}` };
  }

  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

  // 2. 포트원(PortOne) 실서버 PG SDK 연동 시
  if (storeId && typeof window !== "undefined" && window.PortOne) {
    try {
      const paymentId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const response = await window.PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customer: {
          fullName: customerName,
          email: customerEmail,
        },
      });

      if (response.code != null) {
        throw new Error(response.message || "결제가 취소되었습니다.");
      }

      return { success: true, paymentId: response.paymentId || paymentId };
    } catch (err: any) {
      throw new Error(err.message || "결제 진행 중 오류가 발생했습니다.");
    }
  }

  // 3. PG 토큰 미설정 시 안전한 모의 결제 승인창 (테스트용)
  const confirmed = typeof window !== "undefined" && window.confirm(
    `[CreAibox 안전 전자결제 모드]\n\n` +
    `· 주문 상품: ${orderName}\n` +
    `· 결제 금액: ${totalAmount.toLocaleString()}원\n\n` +
    `NEXT_PUBLIC_PORTONE_STORE_ID 설정 시 실시간 카드/간편결제창이 가동됩니다.\n\n` +
    `결제를 승인하고 도메인을 1초 매입하시겠습니까?`
  );

  if (confirmed) {
    return { success: true, paymentId: `MOCK_PAY_${Date.now()}` };
  } else {
    throw new Error("고객에 의해 결제가 취소되었습니다.");
  }
}
