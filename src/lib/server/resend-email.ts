/**
 * Resend Email Infrastructure Helper Module
 * (CreAibox Custom Domain Email Engine)
 */

import { Resend } from "resend";

function getResendKey(): string {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY 환경변수가 설정되지 않았습니다.");
  }
  return key;
}

export function getResendClient(): Resend {
  return new Resend(getResendKey());
}

/**
 * 1. Resend에 신규 커스텀 도메인 동적 등록 API
 */
export async function registerDomainInResend(domainName: string) {
  const resend = getResendClient();
  const cleanDomain = domainName.toLowerCase().trim();

  const { data, error } = await resend.domains.create({
    name: cleanDomain,
  });

  if (error) {
    console.error("Resend domain registration error:", error);
    throw new Error(`Resend 도메인 등록 실패: ${error.message}`);
  }

  return data;
}

/**
 * 2. Resend 도메인 DNS 검증 요청 API
 */
export async function verifyDomainInResend(domainId: string) {
  const resend = getResendClient();

  const { data, error } = await resend.domains.verify(domainId);

  if (error) {
    console.error("Resend domain verification error:", error);
    throw new Error(`Resend 도메인 검증 실패: ${error.message}`);
  }

  return data;
}

/**
 * 3. Resend 이메일 발송 API
 */
export async function sendEmailViaResend(params: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo,
  });

  if (error) {
    console.error("Resend email send error:", error);
    throw new Error(`이메일 전송 실패: ${error.message}`);
  }

  return data;
}

/**
 * 4. 회원가입 축하 웰컴 메일 (Welcome Email) 자동 발송 API
 */
export async function sendWelcomeEmail(params: {
  userEmail: string;
  userName?: string | null;
}) {
  const cleanEmail = params.userEmail?.trim();
  if (!cleanEmail || cleanEmail.includes("@example.com")) return;

  const rawName = (params.userName || "크리에이터").trim();
  const formattedName = rawName.endsWith("님") ? rawName : `${rawName}님`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CreAibox AI Studio</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0f172a;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding:40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:40px 32px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="left" style="padding-bottom:24px; border-bottom:1px solid #f1f5f9;">
              <span style="font-size:24px; font-weight:900; font-style:italic; letter-spacing:-0.05em; color:#0f172a;">
                Cre<span style="color:#2563eb;">Ai</span>box
              </span>
              <span style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.15em; margin-left:8px;">
                AI Studio Global
              </span>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td align="left" style="padding-top:28px; padding-bottom:16px;">
              <h1 style="margin:0 0 12px 0; font-size:22px; font-weight:800; color:#0f172a; line-height:1.3;">
                🎉 ${formattedName}, CreAibox AI 스튜디오 가입을 환영합니다!
              </h1>
              <p style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#334155;">
                CreAibox 가족이 되신 것을 진심으로 축하드립니다.<br>
                이제 최신 AI 원고 자동 작성, 블로그 및 웹사이트 제작, 비디오 편집기, 키워드 트렌드 분석 등 AI Studio 의 모든 기능을 자유롭게 이용하실 수 있습니다.
              </p>
            </td>
          </tr>

          <!-- Beta Period Info Card -->
          <tr>
            <td align="left" style="padding-bottom:24px;">
              <div style="background-color:#f1f5f9; border:1px solid #e2e8f0; border-radius:16px; padding:18px 20px;">
                <h3 style="margin:0 0 6px 0; font-size:14px; font-weight:800; color:#2563eb;">🎁 오픈 베타 테스트 무료 이용 혜택</h3>
                <p style="margin:0; font-size:13px; color:#475569; line-height:1.5;">현재 베타 테스트 기간 동안 플랫폼 내 모든 주요 AI 원고 및 제작 도구를 무료로 이용하실 수 있습니다.</p>
              </div>
            </td>
          </tr>

          <!-- CTA Button (Direct to /writing/creaibox/new-post) -->
          <tr>
            <td align="center" style="padding:10px 0 28px 0;">
              <a href="https://creaibox.com/writing/creaibox/new-post" target="_blank" style="display:inline-block; padding:15px 40px; background-color:#2563eb; color:#ffffff; font-size:15px; font-weight:800; text-decoration:none; border-radius:14px; box-shadow:0 4px 14px rgba(37,99,235,0.3);">
                ✨ AI 스튜디오 시작하기 / Start AI Studio
              </a>
            </td>
          </tr>

          <!-- English Section -->
          <tr>
            <td align="left" style="padding-top:20px; padding-bottom:16px; border-top:1px dashed #e2e8f0;">
              <h2 style="margin:0 0 8px 0; font-size:17px; font-weight:800; color:#0f172a; line-height:1.3;">
                Welcome to CreAibox AI Studio! 🚀
              </h2>
              <p style="margin:0; font-size:13px; line-height:1.6; color:#475569;">
                Hi ${rawName}, thank you for joining CreAibox.<br>
                Start creating high-quality content, building websites, and leveraging video tools & trend analysis with ease.
              </p>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td align="left" style="padding-top:24px; border-top:1px solid #f1f5f9; font-size:11px; color:#64748b; line-height:1.5;">
              <p style="margin:0 0 4px 0;">
                본 메일은 발신 전용 메일입니다. / This is an automated email, please do not reply.
              </p>
              <p style="margin:0;">
                Support & Inquiries: <a href="mailto:support@creaibox.com" style="color:#2563eb; text-decoration:underline;">support@creaibox.com</a>
              </p>
              <p style="margin:12px 0 0 0; font-weight:700; color:#94a3b8;">
                © CreAibox AI Studio. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    await sendEmailViaResend({
      from: "CreAibox <noreply@creaibox.com>",
      to: cleanEmail,
      subject: `🎉 [CreAibox] ${formattedName}, 회원가입을 진심으로 축하합니다!`,
      html: htmlContent,
      replyTo: "support@creaibox.com",
    });
    console.log(`✅ Welcome email sent successfully to ${cleanEmail}`);
  } catch (err: any) {
    console.warn("⚠️ Welcome email send failed:", err?.message);
  }
}

