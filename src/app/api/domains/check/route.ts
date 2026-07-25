import { NextResponse } from "next/server";
import { checkDomainStatus } from "@/lib/server/vercel-domains";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("name");

    if (!domain) {
      return NextResponse.json({ error: "도메인 이름(name) 매개변수가 누락되었습니다." }, { status: 400 });
    }

    const result = await checkDomainStatus(domain);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "도메인 조회 중 오류 발생" }, { status: 500 });
  }
}
