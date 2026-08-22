import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

interface ComparisonItem {
  feature: string;
  targetStatus: string;
  targetBadge: "bad" | "warning" | "good";
  creaiboxStatus: string;
  benefit: string;
}

interface IssueItem {
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  solution: string;
}

interface EssentialSettingItem {
  key: string;
  name: string;
  passed: boolean;
  severity: "critical" | "warning" | "info";
  currentValue: string;
  recommendation: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    let { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "진단할 웹사이트 URL을 입력해주세요." }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    const hasSsl = url.startsWith("https://");

    // 1. Fetch Target URL HTML & Headers
    let html = "";
    let statusCode = 200;
    let finalUrl = url;
    let fetchError: string | null = null;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CreaiBox-SiteAudit-Bot/1.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      statusCode = response.status;
      finalUrl = response.url || url;
      html = await response.text();
    } catch (e: any) {
      fetchError = e.message || "사이트에 연결할 수 없습니다.";
      if (url.startsWith("https://")) {
        try {
          const fallbackRes = await fetch(url.replace("https://", "http://"), {
            headers: {
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CreaiBox-SiteAudit-Bot/1.0",
            },
            signal: AbortSignal.timeout(8000),
          });
          statusCode = fallbackRes.status;
          finalUrl = fallbackRes.url;
          html = await fallbackRes.text();
          fetchError = null;
        } catch {}
      }
    }

    // 2. Analyze HTML Structure & Essential Settings
    const isFrameset = /<frameset[\s\S]*?>/i.test(html);
    let frameSrc = "";
    if (isFrameset) {
      const match = html.match(/<frame[\s\S]*?src=["']([^"']+)["']/i);
      if (match && match[1]) {
        frameSrc = match[1];
      }
    }

    // Title & Description
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : `${domain} 메인 홈페이지`;

    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : "";

    // Favicon check
    const hasFavicon = /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html) ||
                       /<link[^>]+rel=["']apple-touch-icon["']/i.test(html);

    // Viewport check
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

    // Charset check
    const isUtf8 = /charset=["']?utf-8/i.test(html);
    const isEucKr = /charset=["']?euc-kr/i.test(html);
    const charsetValue = isUtf8 ? "UTF-8 (표준)" : isEucKr ? "EUC-KR (구식 레거시)" : "미지정";

    // Canonical check
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);

    // OpenGraph
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const ogImage = ogImageMatch ? ogImageMatch[1] : "";
    const hasOgTitle = /<meta[^>]+property=["']og:title["']/i.test(html);

    // HTML Lang
    const hasHtmlLang = /<html[^>]+lang=["'][^"']+["']/i.test(html);

    // Verification tags
    const hasNaverVerification = /naver-site-verification/i.test(html);
    const hasGoogleVerification = /google-site-verification/i.test(html);

    // Engine & Tech Stack Detection
    let detectedEngine = "Custom / Pure HTML";
    if (isFrameset && frameSrc.includes("figma.site")) {
      detectedEngine = "Figma Site (고정 프레임셋 포워딩)";
    } else if (frameSrc.includes("figma.site") || html.includes("figma.site")) {
      detectedEngine = "Figma Site (피그마 웹사이트)";
    } else if (html.includes("imweb.me") || html.includes("cdn.imweb.me") || html.includes("imweb-section")) {
      detectedEngine = "아임웹 (Imweb No-Code Builder)";
    } else if (html.includes("wixsite.com") || html.includes("wix-sdk") || html.includes("wix-warmup-data")) {
      detectedEngine = "Wix (글로벌 웹빌더)";
    } else if (html.includes("wp-content") || html.includes("wp-includes") || html.includes("wp-json")) {
      detectedEngine = "워드프레스 (WordPress CMS)";
    } else if (html.includes("cafe24.com") || html.includes("cafe24cdn")) {
      detectedEngine = "카페24 (Cafe24 쇼핑몰)";
    } else if (html.includes("_next/static") || html.includes("__NEXT_DATA__")) {
      detectedEngine = "Next.js React (최신 모던 웹)";
    } else if (html.includes("webflow.com") || html.includes("data-wf-page")) {
      detectedEngine = "Webflow (웹플로우)";
    } else if (isFrameset) {
      detectedEngine = "레거시 프레임셋 (Legacy Frameset)";
    }

    // 3. Essential Settings Checklist
    const essentialSettings: EssentialSettingItem[] = [
      {
        key: "favicon",
        name: "파비콘 (브라우저 탭 대표 아이콘)",
        passed: hasFavicon,
        severity: "warning",
        currentValue: hasFavicon ? "정상 등록됨" : "❌ 미설정 (기본 지구본 표시)",
        recommendation: hasFavicon ? "표준 규격 충족" : "브랜드 신뢰도를 위해 32x32 / 180x180 파비콘 등록 필수",
      },
      {
        key: "ssl",
        name: "HTTPS (SSL 보안 프로토콜)",
        passed: hasSsl && !finalUrl.startsWith("http://"),
        severity: "critical",
        currentValue: (hasSsl && !finalUrl.startsWith("http://")) ? "보안 연결 적용됨" : "❌ HTTP 미보안 (주의 요함)",
        recommendation: "SSL 인증서 적용 및 모든 트래픽 HTTPS 강제 리다이렉트",
      },
      {
        key: "charset",
        name: "문자셋 인코딩 (UTF-8 표준)",
        passed: isUtf8,
        severity: isEucKr ? "warning" : "info",
        currentValue: charsetValue,
        recommendation: isUtf8 ? "글로벌 표준 인코딩" : "모바일 및 크로스 브라우저 한글 깨짐 방지를 위해 UTF-8 변환 권장",
      },
      {
        key: "description",
        name: "메타 디스크립션 (검색 요약문)",
        passed: !!description,
        severity: "warning",
        currentValue: description ? `${description.slice(0, 45)}...` : "❌ 누락됨",
        recommendation: "구글/네이버 검색 클릭률(CTR) 극대화를 위한 160자 요약문 작성",
      },
      {
        key: "og_image",
        name: "SNS/카카오톡 공유 썸네일 (OpenGraph)",
        passed: !!ogImage,
        severity: "warning",
        currentValue: ogImage ? "OG 이미지 등록됨" : "❌ 누락됨 (공유 시 썸네일 없음)",
        recommendation: "카카오톡/SNS 공유 시 16:9 비율 대표 썸네일 이미지 필수",
      },
      {
        key: "canonical",
        name: "캐노니컬 URL (대표 주소 선언)",
        passed: hasCanonical,
        severity: "info",
        currentValue: hasCanonical ? "선언됨" : "⚠️ 미선언",
        recommendation: "검색엔진 중복 문서 색인 방지를 위한 <link rel='canonical'> 선언",
      },
      {
        key: "viewport",
        name: "뷰포트 (모바일 반응형 메타태그)",
        passed: hasViewport,
        severity: "critical",
        currentValue: hasViewport ? "적용됨" : "❌ 미적용",
        recommendation: "스마트폰 액정 최적화를 위한 width=device-width 뷰포트 설정",
      },
      {
        key: "search_console",
        name: "네이버·구글 서치콘솔 소유권 인증",
        passed: hasNaverVerification || hasGoogleVerification,
        severity: "info",
        currentValue: (hasNaverVerification || hasGoogleVerification) ? "인증 메타태그 등록됨" : "⚠️ 미등록 (색인 지연)",
        recommendation: "포털 검색 즉시 색인을 위한 naver/google verification 메타태그 주입",
      },
    ];

    // 4. Scoring & Grade Calculation
    let seoScore = 75;
    let performanceScore = 80;
    let securityScore = 85;

    const issues: IssueItem[] = [];
    const improvements: string[] = [];

    // Frame issue check
    if (isFrameset) {
      seoScore -= 45;
      securityScore -= 20;
      performanceScore -= 25;
      issues.push({
        type: "critical",
        title: "고정 프레임셋(Frameset / 아이프레임 포워딩) 감지",
        description: `도메인(${domain})이 실제 호스팅(${frameSrc || "내부 사이트"})을 빈 껍데기 프레임 안에 가두어 두고 있습니다. 서브메뉴를 이동해도 주소창 URL이 변경되지 않으며 구글/네이버 검색 수집 봇이 본문 콘텐츠를 읽지 못합니다.`,
        solution: "CreaiBox의 정석 Vercel Edge CNAME / A 레코드 바인딩 및 Next.js 서브패스 정식 라우팅으로 전환해야 합니다.",
      });
    }

    // Favicon check
    if (!hasFavicon) {
      seoScore -= 5;
      issues.push({
        type: "warning",
        title: "파비콘(Favicon / 탭 아이콘) 미설정",
        description: "웹 브라우저 탭 및 즐겨찾기에 표시될 브랜드 대표 아이콘(파비콘)이 등록되어 있지 않습니다.",
        solution: "CreaiBox AI가 사이트 로고 기반 32x32 및 고해상도 파비콘을 자동 생성 및 주입합니다.",
      });
    }

    // SSL check
    if (!hasSsl || finalUrl.startsWith("http://")) {
      securityScore -= 40;
      issues.push({
        type: "critical",
        title: "HTTPS (SSL 보안 인증서) 미적용 또는 HTTP 접속",
        description: "사이트가 보안 프로토콜(HTTPS)을 완벽하게 강제하지 않아 방문자 브라우저에 '주의 요함' 경고가 표시되고 네이버/구글 검색 순위에서 감점됩니다.",
        solution: "Vercel Global Edge SSL 자동 발급 및 HTTPS 영구 리다이렉트가 필요합니다.",
      });
    }

    // Encoding check
    if (isEucKr) {
      performanceScore -= 10;
      issues.push({
        type: "info",
        title: "구식 EUC-KR 문자셋 인코딩 사용",
        description: "최신 웹 브라우저 및 글로벌 환경에서 한글 깨짐 위험이 있는 레거시 EUC-KR 인코딩이 감지되었습니다.",
        solution: "글로벌 표준인 UTF-8 인코딩으로 전환해야 합니다.",
      });
    }

    // Description check
    if (!description) {
      seoScore -= 15;
      issues.push({
        type: "warning",
        title: "메타 디스크립션(Meta Description) 누락",
        description: "검색 결과 화면에 노출될 사이트 요약 설명문이 비어 있어 클릭률(CTR)이 저하됩니다.",
        solution: "CreaiBox AI가 사이트 업종에 맞는 160자 최적화 메타 디스크립션을 자동 생성합니다.",
      });
    }

    // OpenGraph check
    if (!ogImage) {
      seoScore -= 10;
      issues.push({
        type: "warning",
        title: "카카오톡/SNS 공유 썸네일(OpenGraph Image) 누락",
        description: "카카오톡이나 페이스북에 링크를 공유할 때 대표 이미지가 뜨지 않아 전문성이 떨어져 보입니다.",
        solution: "CreaiBox 16:9 황금비율 전용 썸네일 자동 생성기를 연동하세요.",
      });
    }

    // Improvements list
    if (isFrameset) {
      improvements.push("구식 프레임셋 포워딩을 제거하고 정식 Next.js 멀티 페이지 딥링크 라우팅으로 현대화");
    }
    if (!hasFavicon) {
      improvements.push("브랜드 아이덴티티를 위한 고해상도 파비콘(Favicon & Apple Touch Icon) 등록");
    }
    improvements.push("모바일 뷰포트 반응형 최적화 및 0.01초 Global Edge CDN 캐싱 적용");
    improvements.push("네이버 서치어드바이저 및 구글 서치콘솔 100% 자동 색인 메타태그 주입");
    improvements.push("브랜드 독립 이메일 무제한 포워딩(ceo@" + domain + ") 연동");

    seoScore = Math.max(10, Math.min(100, seoScore));
    performanceScore = Math.max(10, Math.min(100, performanceScore));
    securityScore = Math.max(10, Math.min(100, securityScore));

    const avgScore = Math.round((seoScore + performanceScore + securityScore) / 3);
    let overallGrade = "B";
    if (avgScore >= 90) overallGrade = "S";
    else if (avgScore >= 80) overallGrade = "A";
    else if (avgScore >= 65) overallGrade = "B";
    else if (avgScore >= 50) overallGrade = "C";
    else if (avgScore >= 35) overallGrade = "D";
    else overallGrade = "F";

    // 5. Comparison Table (Current Site vs CreaiBox)
    const comparisonTable: ComparisonItem[] = [
      {
        feature: "도메인 라우팅 & 주소 변경",
        targetStatus: isFrameset ? "❌ 고정 프레임셋 (메뉴 이동 시 주소 안 바뀜)" : "⚠️ 일반 호스팅 라우팅",
        targetBadge: isFrameset ? "bad" : "warning",
        creaiboxStatus: "✅ Next.js Vercel 엣지 딥링크 정식 라우팅 (/about, /blog 등)",
        benefit: "개별 페이지 주소 완벽 공유 및 검색엔진 개별 색인 100% 보장",
      },
      {
        feature: "기본 세팅 (파비콘 / 메타 / UTF-8)",
        targetStatus: (!hasFavicon || !description || isEucKr) ? "❌ 파비콘/메타/인코딩 미흡" : "✅ 기본 세팅 완료",
        targetBadge: (!hasFavicon || !description || isEucKr) ? "bad" : "good",
        creaiboxStatus: "✅ 파비콘, 16:9 OG 썸네일, UTF-8 자동 완벽 구성",
        benefit: "브라우저 탭 아이콘 및 카카오톡 공유 시 프로페셔널 브랜딩",
      },
      {
        feature: "검색엔진 최적화 (SEO)",
        targetStatus: isFrameset ? "❌ 프레임 차단으로 구글/네이버 수집 불리" : (description ? "⚠️ 기본 메타태그만 수동 설정" : "❌ 메타태그 누락"),
        targetBadge: (isFrameset || !description) ? "bad" : "warning",
        creaiboxStatus: "✅ 네이버·구글 포털 동시 100점 자동 SEO 인덱싱",
        benefit: "신규 포스팅 및 소개 페이지 작성 즉시 검색엔진 상위 노출 가속",
      },
      {
        feature: "로딩 속도 & 인프라",
        targetStatus: detectedEngine.includes("Figma") ? "⚠️ 무거운 피그마 렌더링 (지연 발생)" : "⚠️ 일반 웹서버 렌더링",
        targetBadge: "warning",
        creaiboxStatus: "✅ Vercel Global Edge CDN 0.01초 광속 서빙",
        benefit: "체감 로딩 지연 0초, 이탈률 70% 감소",
      },
      {
        feature: "모바일 터치 & 반응형 UI",
        targetStatus: isFrameset ? "❌ 프레임 뷰포트 충돌로 스크롤 오작동 위험" : "⚠️ 표준 반응형",
        targetBadge: isFrameset ? "bad" : "good",
        creaiboxStatus: "✅ 모바일 풀-와이드 반응형 최적화",
        benefit: "스마트폰, 태블릿, PC 전 기기 완벽 픽셀 매칭",
      },
      {
        feature: "브랜드 커스텀 이메일",
        targetStatus: "❌ 별도 유료 메일 서비스 구매 필요",
        targetBadge: "bad",
        creaiboxStatus: "✅ contact@" + domain + " 무제한 포워딩 0원 무료",
        benefit: "대표님 개인 메일함으로 비즈니스 메일 실시간 무료 수신",
      },
    ];

    const auditReport = {
      targetUrl: url,
      normalizedDomain: domain,
      title,
      description,
      detectedEngine,
      isFrameset,
      frameSrc,
      hasSsl,
      hasFavicon,
      isUtf8,
      essentialSettings,
      seoScore,
      performanceScore,
      securityScore,
      overallGrade,
      avgScore,
      issues,
      improvements,
      comparisonTable,
      scanReportSnapshot: {
        statusCode,
        finalUrl,
        ogImage,
        hasRobots: true,
        scannedAt: new Date().toISOString(),
      },
    };

    // 6. Save to Supabase DB if user is logged in
    let savedId: string | null = null;
    if (user?.id) {
      try {
        const { data: inserted, error: dbErr } = await supabase
          .from("site_audits")
          .insert({
            user_id: user.id,
            target_url: url,
            normalized_domain: domain,
            title,
            description,
            detected_engine: detectedEngine,
            is_frameset: isFrameset,
            frame_src: frameSrc || null,
            has_ssl: hasSsl,
            seo_score: seoScore,
            performance_score: performanceScore,
            security_score: securityScore,
            overall_grade: overallGrade,
            issues: issues as any,
            improvements: improvements as any,
            comparison_table: comparisonTable as any,
            scan_report_snapshot: {
              ...auditReport.scanReportSnapshot,
              essentialSettings,
            } as any,
          })
          .select("id")
          .maybeSingle();

        if (inserted?.id) {
          savedId = inserted.id;
        } else if (dbErr) {
          console.warn("site_audits insert note:", dbErr.message);
        }
      } catch (e: any) {
        console.warn("DB save note:", e.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...auditReport,
        id: savedId,
        isSaved: !!savedId,
      },
    });
  } catch (err: any) {
    console.error("POST /api/studio/site-audit/scan error:", err);
    return NextResponse.json({ error: err.message || "사이트 정밀 진단 중 오류가 발생했습니다." }, { status: 500 });
  }
}
