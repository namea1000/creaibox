import { NextResponse } from "next/server";
import { checkDomainStatus } from "@/lib/server/vercel-domains";

const KNOWN_TLDS = [
  ".com",
  ".ai",
  ".kr",
  ".co.kr",
  ".net",
  ".io",
  ".shop",
  ".store",
  ".tech",
  ".app",
  ".dev",
  ".org",
  ".me",
  ".xyz",
];

async function performDomainSearch(inputDomain: string, selectedTld: string = "all") {
  let cleanInput = inputDomain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  
  let candidates: string[] = [];

  // Check if user explicitly included a known TLD in their input (e.g. 'creaibox.ai', 'google.com')
  const matchedTld = KNOWN_TLDS.find((ext) => cleanInput.endsWith(ext));

  if (matchedTld) {
    // 1. Exact match input (e.g. 'creaibox.ai') is #1 priority
    const baseName = cleanInput.slice(0, -matchedTld.length);
    candidates = [
      cleanInput,
      ...KNOWN_TLDS.filter((ext) => ext !== matchedTld).map((ext) => `${baseName}${ext}`),
    ];
  } else if (cleanInput.includes(".")) {
    // Other custom extension (e.g. 'brand.cc')
    const parts = cleanInput.split(".");
    const baseName = parts[0];
    candidates = [
      cleanInput,
      ...KNOWN_TLDS.map((ext) => `${baseName}${ext}`),
    ];
  } else {
    // Plain name without dot (e.g. 'creaibox')
    if (selectedTld && selectedTld !== "all" && selectedTld.startsWith(".")) {
      candidates = [
        `${cleanInput}${selectedTld}`,
        ...KNOWN_TLDS.filter((ext) => ext !== selectedTld).map((ext) => `${cleanInput}${ext}`),
      ];
    } else {
      candidates = KNOWN_TLDS.map((ext) => `${cleanInput}${ext}`);
    }
  }

  // Deduplicate candidates and limit to top 8
  const uniqueCandidates = Array.from(new Set(candidates)).slice(0, 8);

  const results = await Promise.all(
    uniqueCandidates.map(async (candidate) => {
      try {
        const status = await checkDomainStatus(candidate);
        return {
          domain: status.domain,
          available: status.available,
          wholesalePrice: status.priceKRW || 18000,
          marketPrice: status.originalPriceKRW || 25850,
          recommended: status.available && (status.domain.endsWith(".com") || status.domain.endsWith(".ai") || status.domain.endsWith(".kr")),
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
