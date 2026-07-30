import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmailViaResend } from "@/lib/server/resend-email";

// Initialize Supabase Admin client for webhook background routing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    // Resend Inbound Webhook payload Structure (Flexible parsing)
    const emailData = payload.data || payload;
    const from = emailData.from || payload.from;
    const to = emailData.to || payload.to;
    const subject = emailData.subject || payload.subject;

    if (!to || !from) {
      return NextResponse.json({ message: "No 'to' or 'from' address found" }, { status: 400 });
    }

    // Extract recipient email (e.g., "ceo@creaibox.com" or "contact@creaibox.com")
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

    // Extract HTML & Text body from all possible webhook payload formats
    let rawHtml =
      emailData.html ||
      emailData.html_body ||
      emailData.htmlBody ||
      payload.html ||
      payload.html_body ||
      "";
    let rawText =
      emailData.text ||
      emailData.text_body ||
      emailData.textBody ||
      emailData.body ||
      emailData.content ||
      payload.text ||
      payload.body ||
      "";

    const emailId = emailData.email_id || emailData.id || payload.email_id || payload.id;

    // Try fetching full email content from Resend API if API key has permission and body is missing
    if (!rawHtml && !rawText && emailId) {
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const fetchRes = await fetch(`https://api.resend.com/emails/inbound/${emailId}`, {
            headers: { Authorization: `Bearer ${resendApiKey}` },
          });
          if (fetchRes.ok) {
            const fetchedData = await fetchRes.json();
            rawHtml = fetchedData.html || fetchedData.html_body || "";
            rawText = fetchedData.text || fetchedData.text_body || fetchedData.body || "";
          } else {
            const fetchRes2 = await fetch(`https://api.resend.com/emails/${emailId}`, {
              headers: { Authorization: `Bearer ${resendApiKey}` },
            });
            if (fetchRes2.ok) {
              const fetchedData2 = await fetchRes2.json();
              rawHtml = fetchedData2.html || fetchedData2.html_body || "";
              rawText = fetchedData2.text || fetchedData2.text_body || fetchedData2.body || "";
            }
          }
        }
      } catch (apiErr) {
        console.error("Resend API fetch error:", apiErr);
      }
    }

    // Construct forward email body
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
      from: cleanRecipient, // 발신자를 원래 수신주소(ceo@creaibox.com)로 지정
      to: forwardTarget,
      subject: forwardSubject,
      html: forwardHtml,
      replyTo: from, // 답장 누르면 원발신자에게 답장되도록 지정!
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
