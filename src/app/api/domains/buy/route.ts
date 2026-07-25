import { NextResponse } from "next/server";
import { purchaseDomain, assignDomainToProject } from "@/lib/server/vercel-domains";

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: "도메인 이름(domain)이 필요합니다." }, { status: 400 });
    }

    if (process.env.VERCEL_AUTH_TOKEN) {
      // 1. Purchase domain via Vercel API
      const buyResult = await purchaseDomain(domain);

      // 2. Auto-bind domain to Vercel project for instant SSL
      let bindResult = null;
      if (process.env.VERCEL_PROJECT_ID) {
        bindResult = await assignDomainToProject(domain);
      }

      return NextResponse.json({
        success: true,
        message: `${domain} 도메인 구매 및 1초 프로젝트 연결이 완료되었습니다!`,
        buyResult,
        bindResult,
      });
    }

    // Mock Response
    return NextResponse.json({
      success: true,
      message: `${domain} 1초 모의 구매 및 프로젝트 결합이 완료되었습니다! (VERCEL_AUTH_TOKEN 설정 필요)`,
      mock: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "도메인 구매 중 오류 발생" }, { status: 500 });
  }
}
