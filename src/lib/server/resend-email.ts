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
