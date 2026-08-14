/**
 * PortOne V2 & Toss Payments Client Gateway Trigger
 * (CreaiBox Domain & Custom Site Payment Engine)
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

function loadPortOneSdk(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve(null);
    if (window.PortOne) return resolve(window.PortOne);

    const scriptId = "portone-v2-sdk-script";
    if (document.getElementById(scriptId)) {
      let checkInterval = setInterval(() => {
        if (window.PortOne) {
          clearInterval(checkInterval);
          resolve(window.PortOne);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.portone.io/v2/browser-sdk.js";
    script.onload = () => resolve(window.PortOne);
    script.onerror = (err) => reject(new Error("포트원 결제 SDK 로드 실패"));
    document.head.appendChild(script);
  });
}

export async function requestDomainPayment({
  orderName,
  totalAmount,
  customerName = "CreaiBox 회원",
  customerEmail = "customer@creaibox.com",
}: PaymentRequestData): Promise<{ success: boolean; paymentId: string }> {
  // 1. 0원 이하 무료 쿠폰/특약 결제 처리
  if (totalAmount <= 0) {
    return { success: true, paymentId: `FREE_PERK_${Date.now()}` };
  }

  // 2. 포트원 브라우저 SDK 동적 가동
  const PortOne = await loadPortOneSdk();

  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-e6eac1b1-9dcf-47c8-a2be-2a19a35c11aa";
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-34c7b992-7104-4b0a-a7bc-2fc5699671f2";

  if (PortOne) {
    try {
      const paymentId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      console.log(`[PortOne SDK Requesting] PaymentId: ${paymentId}, Order: ${orderName}`);
      
      const response = await PortOne.requestPayment({
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

      if (response && response.code != null) {
        throw new Error(response.message || "결제가 실패하거나 취소되었습니다.");
      }

      return { success: true, paymentId: response?.paymentId || paymentId };
    } catch (err: any) {
      console.error("[PortOne Payment Error]:", err);
      throw new Error(err.message || "포트원 결제창 호출에 실패했습니다.");
    }
  }

  throw new Error("포트원 결제 SDK를 로드할 수 없습니다.");
}
