import { NextResponse } from "next/server";
import { checkDomainStatus } from "@/lib/server/vercel-domains";

async function performDomainSearch(inputDomain: string, selectedTld: string = "all") {
  const cleanInput = inputDomain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  
  // Extract base name and TLDs to check
  const tldList = [".com", ".kr", ".co.kr", ".net", ".io"];
  let candidates: string[] = [];

  const hasTld = tldList.some((ext) => cleanInput.endsWith(ext));

  if (hasTld) {
    // If input already has TLD, prioritize exact domain, then add alternatives
    const baseName = cleanInput.replace(/(\.com|\.kr|\.co\.kr|\.net|\.io)$/, "");
    candidates = [cleanInput, ...tldList.filter((ext) => !cleanInput.endsWith(ext)).map((ext) => `${baseName}${ext}`)];
  } else {
    // If no TLD provided, append all TLDs
    candidates = tldList.map((ext) => `${cleanInput}${ext}`);
  }

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Set(candidates)).slice(0, 6);

  const results = await Promise.all(
    uniqueCandidates.map(async (candidate) => {
      try {
        const status = await checkDomainStatus(candidate);
        return {
          domain: status.domain,
          available: status.available,
          wholesalePrice: status.priceKRW || 18000,
          marketPrice: status.originalPriceKRW || 25850,
          recommended: status.available && (status.domain.endsWith(".com") || status.domain.endsWith(".kr")),
          tag: status.available ? "1초 무제한 커스텀 사이트 연결 가능" : "이미 타인이 사용 중인 도메인",
        };
      } catch {
        return {
          domain: candidate,
          available: false,
          wholesalePrice: 18000,
          marketPrice: 25850,
          recommended: false,
          tag: "조회 불가",
        };
      }
    })
  );

  return results;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const domain = body.domain || body.name;
    const tld = body.tld || "all";

    if (!domain || !domain.trim()) {
      return NextResponse.json({ error: "조회할 도메인을 입력해주세요." }, { status: 400 });
    }

    const results = await performDomainSearch(domain, tld);
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Domain search check POST error:", err);
    return NextResponse.json({ error: err.message || "도메인 실시간 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("name") || searchParams.get("domain");
    const tld = searchParams.get("tld") || "all";

    if (!domain) {
      return NextResponse.json({ error: "도메인 이름(name) 매개변수가 누락되었습니다." }, { status: 400 });
    }

    const results = await performDomainSearch(domain, tld);
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Domain search check GET error:", err);
    return NextResponse.json({ error: err.message || "도메인 조회 중 오류 발생" }, { status: 500 });
  }
}
