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
 * Resend에서 이메일 수신 시 Webhook으로 메일 데이터(Sender, Recipient, Subject, Body)를 수령
 * DB의 email_forwarding_rules 규칙에 따라 무상태(Stateless) 실시간 포워딩 발송!
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("📥 Resend Inbound Webhook Received:", JSON.stringify(payload, null, 2));

    // Resend Inbound Webhook payload Structure
    const emailData = payload.data || payload;
    const from = emailData.from || payload.from;
    const to = emailData.to || payload.to;
    const subject = emailData.subject || payload.subject;

    if (!to || !from) {
      return NextResponse.json({ message: "No 'to' or 'from' address found" }, { status: 400 });
    }

    // Extract recipient email (e.g., "ceo@creaibox.com")
    const recipientStr = Array.isArray(to) ? to[0] : to;
    const cleanRecipient = recipientStr.toLowerCase().trim().replace(/.*<([^>]+)>.*/, "$1");

    const [aliasPrefix, domainName] = cleanRecipient.split("@");

    if (!aliasPrefix || !domainName) {
      return NextResponse.json({ message: "Invalid recipient email format" }, { status: 400 });
    }

    console.log(`Searching forwarding rule for ${aliasPrefix}@${domainName}...`);

    // Query Supabase for matching forwarding rule
    const { data: rule } = await supabaseAdmin
      .from("email_forwarding_rules")
      .select("*")
      .eq("domain_name", domainName)
      .eq("alias_prefix", aliasPrefix)
      .eq("is_active", true)
      .single();

    let forwardTarget = "creaiboxofficial@gmail.com"; // Default fallback destination

    if (rule && rule.forward_to) {
      forwardTarget = rule.forward_to;
      console.log(`Found matching rule: ${cleanRecipient} -> ${forwardTarget}`);
    } else {
      console.log(`No specific rule found. Using default fallback: ${forwardTarget}`);
    }

    // 1. Direct Webhook Body Extraction
    let rawHtml =
      extractString(emailData.html) ||
      extractString(emailData.html_body) ||
      extractString(emailData.htmlBody) ||
      extractString(payload.html);

    let rawText =
      extractString(emailData.text) ||
      extractString(emailData.text_body) ||
      extractString(emailData.textBody) ||
      extractString(emailData.plain_text) ||
      extractString(emailData.plainText) ||
      extractString(emailData.body) ||
      extractString(emailData.content) ||
      extractString(payload.text) ||
      extractString(payload.body);

    const emailId = emailData.email_id || emailData.id || payload.email_id || payload.id;
    console.log(`Target Email ID: ${emailId}`);

    // 2. Fetch Email Body via Resend SDK & REST API if body is missing in webhook
    if (!rawHtml && !rawText && emailId) {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        // Attempt 1: Resend SDK get
        try {
          const resend = getResendClient();
          const res = await resend.emails.get(emailId);
          const resData = (res as any)?.data || res;
          if (resData) {
            rawHtml = extractString(resData.html) || extractString(resData.html_body);
            rawText = extractString(resData.text) || extractString(resData.text_body) || extractString(resData.body);
          }
        } catch (sdkErr: any) {
          console.warn("[Resend SDK fetch failed]:", sdkErr?.message || sdkErr);
        }

        // Attempt 2: REST API Endpoints
        if (!rawHtml && !rawText) {
          const endpointsToTry = [
            `https://api.resend.com/emails/${emailId}`,
            `https://api.resend.com/emails/receiving/${emailId}`,
            `https://api.resend.com/emails/inbound/${emailId}`,
          ];

          for (const ep of endpointsToTry) {
            try {
              const fetchRes = await fetch(ep, {
                headers: {
                  Authorization: `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
              });

              if (fetchRes.ok) {
                const fetchedJson = await fetchRes.json();
                console.log(`[Resend REST Fetch Success from ${ep}]:`, JSON.stringify(fetchedJson));
                const item = fetchedJson.data || fetchedJson;

                rawHtml = rawHtml || extractString(item.html) || extractString(item.html_body);
                rawText = rawText || extractString(item.text) || extractString(item.text_body) || extractString(item.body);
                if (rawHtml || rawText) break;
              } else {
                console.warn(`[Resend REST Fetch ${ep}] Status: ${fetchRes.status}`);
              }
            } catch (err: any) {
              console.warn(`[Resend REST Fetch ${ep}] Error:`, err?.message);
            }
          }
        }

        // Attempt 3: 600ms Retry delay for index propagation
        if (!rawHtml && !rawText) {
          console.log("Waiting 600ms for Resend index propagation...");
          await new Promise((resolve) => setTimeout(resolve, 600));

          try {
            const resend = getResendClient();
            const retryRes = await resend.emails.get(emailId);
            const retryData = (retryRes as any)?.data || retryRes;
            if (retryData) {
              rawHtml = extractString(retryData.html);
              rawText = extractString(retryData.text) || extractString(retryData.body);
            }
          } catch (retryErr: any) {
            console.warn("[Resend Retry Error]:", retryErr?.message);
          }
        }
      }
    }

    // Construct Forwarding Email Body
    let bodySection = "";
    if (rawHtml && rawHtml.trim()) {
      bodySection = rawHtml;
    } else if (rawText && rawText.trim()) {
      bodySection = `<div style="font-family: 'Pretendard', sans-serif; font-size: 14px; color: #1e293b; line-height: 1.7; white-space: pre-wrap;">${rawText}</div>`;
    } else {
      bodySection = `<div style="font-family: sans-serif; font-size: 14px; color: #94a3b8; font-style: italic;">(수신된 메일 본문 내용이 없습니다)</div>`;
    }

    // Perform Forwarding via Resend Outbound API
    const forwardSubject = `[전달: ${cleanRecipient}] ${subject || "(제목 없음)"}`;
    const forwardHtml = `
      <div style="font-family: sans-serif; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; background-color: #f8fafc; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <p style="margin: 0 0 10px 0; font-weight: 900; color: #0f172a; font-size: 15px;">📫 CreAibox 이메일 포워딩 수신 통지</p>
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
      from: cleanRecipient,
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
