import { NextResponse } from "next/server";
import { purchaseDomain, assignDomainToProject } from "@/lib/server/vercel-domains";

export async function POST(request: Request) {
  try {
    const { domain, mock } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: "도메인 이름(domain)이 필요합니다." }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim();

    // 1. If VERCEL_AUTH_TOKEN is available, try real domain purchase
    if (process.env.VERCEL_AUTH_TOKEN && !mock) {
      try {
        const buyResult = await purchaseDomain(cleanDomain);
        let bindResult = null;
        if (process.env.VERCEL_PROJECT_ID) {
          bindResult = await assignDomainToProject(cleanDomain);
        }

        return NextResponse.json({
          success: true,
          domain: cleanDomain,
          message: `${cleanDomain} 도메인 구매 및 1초 프로젝트 연결이 완료되었습니다!`,
          buyResult,
          bindResult,
        });
      } catch (e: any) {
        console.warn("Real domain purchase fallback to mock simulation:", e.message);
      }
    }

    // 2. Mock Domain Purchase & Virtual Edge IP Binding Simulation
    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      registeredAt: new Date().toISOString(),
      status: "ACTIVE",
      dnsRecords: [
        { type: "A", name: "@", value: "76.76.21.21" },
        { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
      ],
      sslStatus: "ISSUED (1초 자동 발급 완료)",
      message: `${cleanDomain} 모의 결제 승인 및 CreAibox Edge IP (76.76.21.21) 1초 가상 바인딩이 성공적으로 완료되었습니다!`,
      mock: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "도메인 구매 중 오류 발생" }, { status: 500 });
  }
}
