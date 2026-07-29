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

    // Resend Inbound Webhook payload Structure
    const emailData = payload.data || payload;
    const { from, to, subject, html, text } = emailData;

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
    const { data: rule, error: dbErr } = await supabaseAdmin
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

    // Perform Stateless Forwarding via Resend Outbound API
    const forwardSubject = `[전달: ${cleanRecipient}] ${subject || "(제목 없음)"}`;
    const forwardHtml = `
      <div style="font-family: sans-serif; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; background-color: #f8fafc;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: #475569;">📫 CreAibox 이메일 포워딩 수신 통지</p>
        <p style="margin: 0; font-size: 13px; color: #64748b;">
          <strong>원발신자:</strong> ${from}<br/>
          <strong>수신주소:</strong> ${cleanRecipient}<br/>
          <strong>전달목적지:</strong> ${forwardTarget}
        </p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ${html || text || "(본문 없음)"}
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
