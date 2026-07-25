import { NextResponse } from "next/server";
import { transferInDomain, assignDomainToProject } from "@/lib/server/vercel-domains";

export async function POST(request: Request) {
  try {
    const { domain, authCode } = await request.json();

    if (!domain || !authCode) {
      return NextResponse.json({ error: "도메인 이름(domain)과 이전 인증키(authCode)가 필요합니다." }, { status: 400 });
    }

    if (process.env.VERCEL_AUTH_TOKEN) {
      // 1. Transfer in domain via Vercel API
      const transferResult = await transferInDomain(domain, authCode);

      // 2. Auto-bind domain to Vercel project for instant SSL
      let bindResult = null;
      if (process.env.VERCEL_PROJECT_ID) {
        bindResult = await assignDomainToProject(domain);
      }

      return NextResponse.json({
        success: true,
        message: `${domain} 도메인 이관 신청 및 프로젝트 연결이 정상 접수되었습니다!`,
        transferResult,
        bindResult,
      });
    }

    // Mock Response
    return NextResponse.json({
      success: true,
      message: `${domain} 모의 이관 신청이 정상 접수되었습니다! (VERCEL_AUTH_TOKEN 설정 필요)`,
      mock: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "도메인 이관 중 오류 발생" }, { status: 500 });
  }
}
