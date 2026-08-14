import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResendClient, sendEmailViaResend } from "@/lib/server/resend-email";

// Initialize Supabase Admin client for webhook background routing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Helper to safely extract string content from any payload property
 */
function extractString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object") {
    if (typeof val.text === "string") return val.text.trim();
    if (typeof val.html === "string") return val.html.trim();
    if (typeof val.body === "string") return val.body.trim();
    if (typeof val.content === "string") return val.content.trim();
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val).trim();
}

/**
 * Resend Inbound Email Webhook Handler
 * POST /api/webhooks/resend-inbound
 *
 * ⚠️ Resend 인바운드 웹훅 설계 핵심:
 * - 웹훅 payload에는 이메일 본문(html/text)이 포함되지 않음 (공식 스펙)
 * - 반드시 resend.emails.receiving.get(emailId) 로 본문 조회해야 함
 * - resend.emails.get()은 아웃바운드 전용 → 인바운드 조회에 사용 불가!
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("📥 Resend Inbound Webhook Received:", JSON.stringify(payload, null, 2));

    // Resend Inbound Webhook payload 구조: payload.data 또는 payload 직접
    const emailData = payload.data || payload;
    const from = emailData.from || payload.from;
    const to = emailData.to || payload.to;
    const subject = emailData.subject || payload.subject;

    if (!to || !from) {
      return NextResponse.json({ message: "No 'to' or 'from' address found" }, { status: 400 });
    }

    // 수신자 이메일 추출 (예: "ceo@creaibox.com")
    const recipientStr = Array.isArray(to) ? to[0] : to;
    const cleanRecipient = recipientStr.toLowerCase().trim().replace(/.*<([^>]+)>.*/, "$1");

    const [aliasPrefix, domainName] = cleanRecipient.split("@");

    if (!aliasPrefix || !domainName) {
      return NextResponse.json({ message: "Invalid recipient email format" }, { status: 400 });
    }

    console.log(`Searching forwarding rule for ${aliasPrefix}@${domainName}...`);

    // Supabase에서 포워딩 규칙 조회 (등록된 주소만 수신 허용)
    const { data: rule } = await supabaseAdmin
      .from("email_forwarding_rules")
      .select("*")
      .eq("domain_name", domainName)
      .eq("alias_prefix", aliasPrefix)
      .eq("is_active", true)
      .single();

    if (!rule || !rule.forward_to) {
      console.warn(`[Anti-Spam Block] Unregistered recipient email: ${cleanRecipient}. Forwarding rejected.`);
      return NextResponse.json(
        { message: `Unregistered recipient email (${cleanRecipient}). Forwarding blocked for anti-spam security.` },
        { status: 200 }
      );
    }

    const forwardTarget = rule.forward_to;
    console.log(`[Forwarding Approved] Matching rule found: ${cleanRecipient} -> ${forwardTarget}`);

    // =========================================================
    // 이메일 본문 추출
    // Resend 인바운드 웹훅은 본문을 payload에 포함하지 않음! (공식 스펙)
    // 반드시 resend.emails.receiving.get(emailId)으로 별도 조회 필요
    // =========================================================
    const emailId = emailData.email_id || emailData.id || payload.email_id || payload.id;
    console.log(`Target Email ID: ${emailId}`);

    let rawHtml = "";
    let rawText = "";

    // 웹훅 payload에 혹시 본문이 포함된 경우 먼저 확인 (일부 구버전 호환)
    rawHtml =
      extractString(emailData.html) ||
      extractString(emailData.html_body) ||
      extractString(emailData.htmlBody) ||
      extractString(payload.html);

    rawText =
      extractString(emailData.text) ||
      extractString(emailData.text_body) ||
      extractString(emailData.textBody) ||
      extractString(emailData.plain_text) ||
      extractString(emailData.plainText) ||
      extractString(emailData.body) ||
      extractString(emailData.content) ||
      extractString(payload.text) ||
      extractString(payload.body);

    // ✅ 핵심 수정: resend.emails.receiving.get() 으로 인바운드 이메일 본문 조회
    // (기존 resend.emails.get()은 아웃바운드 전용 → 인바운드에서는 항상 실패)
    if (!rawHtml && !rawText && emailId) {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        // Attempt 1: Resend SDK resend.emails.receiving.get() — 공식 인바운드 조회 API
        try {
          const resend = getResendClient();
          const res = await resend.emails.receiving.get(emailId);
          const resData = (res as any)?.data || res;
          if (resData) {
            rawHtml = extractString(resData.html);
            rawText = extractString(resData.text) || extractString(resData.body);
            console.log(`[Resend receiving.get success] html: ${rawHtml?.length ?? 0}chars, text: ${rawText?.length ?? 0}chars`);
          }
        } catch (sdkErr: any) {
          console.warn("[Resend receiving.get failed]:", sdkErr?.message || sdkErr);
        }

        // Attempt 2: REST API — /emails/receiving/{id} 공식 경로 직접 호출
        if (!rawHtml && !rawText) {
          try {
            const fetchRes = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
            });

            if (fetchRes.ok) {
              const fetchedJson = await fetchRes.json();
              console.log(`[Resend REST receiving fetch success]:`, JSON.stringify(fetchedJson).slice(0, 300));
              const item = fetchedJson.data || fetchedJson;
              rawHtml = rawHtml || extractString(item.html) || extractString(item.html_body);
              rawText = rawText || extractString(item.text) || extractString(item.text_body) || extractString(item.body);
            } else {
              const errBody = await fetchRes.text().catch(() => "");
              console.warn(`[Resend REST receiving fetch] Status: ${fetchRes.status}, Body: ${errBody}`);
            }
          } catch (err: any) {
            console.warn(`[Resend REST receiving fetch] Error:`, err?.message);
          }
        }

        // Attempt 3: 800ms 딜레이 후 재시도 (Resend 인덱스 전파 지연 대응)
        if (!rawHtml && !rawText) {
          console.log("Waiting 800ms for Resend index propagation then retrying...");
          await new Promise((resolve) => setTimeout(resolve, 800));

          try {
            const resend = getResendClient();
            const retryRes = await resend.emails.receiving.get(emailId);
            const retryData = (retryRes as any)?.data || retryRes;
            if (retryData) {
              rawHtml = extractString(retryData.html);
              rawText = extractString(retryData.text) || extractString(retryData.body);
              console.log(`[Resend receiving.get retry] html: ${rawHtml?.length ?? 0}chars, text: ${rawText?.length ?? 0}chars`);
            }
          } catch (retryErr: any) {
            console.warn("[Resend receiving.get Retry Error]:", retryErr?.message);
          }
        }
      }
    }

    // 포워딩 이메일 본문 조립
    let bodySection = "";
    if (rawHtml && rawHtml.trim()) {
      bodySection = rawHtml;
    } else if (rawText && rawText.trim()) {
      bodySection = `<div style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #1e293b; line-height: 1.7; white-space: pre-wrap;">${rawText}</div>`;
    } else {
      bodySection = `<div style="font-family: sans-serif; font-size: 14px; color: #94a3b8; font-style: italic;">(수신된 메일 본문 내용이 없습니다)</div>`;
    }

    // Resend 아웃바운드 API로 포워딩 발송
    const forwardSubject = `[전달: ${cleanRecipient}] ${subject || "(제목 없음)"}`;
    const forwardHtml = `
      <div style="font-family: sans-serif; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; background-color: #f8fafc; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <p style="margin: 0 0 10px 0; font-weight: 900; color: #0f172a; font-size: 15px;">📫 CreaiBox 이메일 포워딩 수신 통지</p>
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
          <strong>원발신자:</strong> ${from}<br/>
          <strong>수신주소:</strong> ${cleanRecipient}<br/>
          <strong>전달목적지:</strong> ${forwardTarget}
        </p>
      </div>
      <div style="padding: 12px 4px;">
        <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">[원본 수신 메일 본문 내용]</h4>
        ${bodySection}
      </div>
    `;

    const sendResult = await sendEmailViaResend({
      from: `${aliasPrefix}@${domainName}`,
      to: forwardTarget,
      subject: forwardSubject,
      html: forwardHtml,
      replyTo: from,
    });

    console.log("✅ Stateless Forwarding completed successfully:", sendResult);

    return NextResponse.json({
      success: true,
      forwardedTo: forwardTarget,
      result: sendResult,
    });
  } catch (err: any) {
    console.error("POST /api/webhooks/resend-inbound error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
