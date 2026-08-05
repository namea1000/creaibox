import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { getResendClient } from "@/lib/server/resend-email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/admin/resend
 * 관리자 전용 Resend 도메인, 이메일 포워딩 계정 현황, 발/수신 통계 통합 모니터링 API
 */
export async function GET(req: NextRequest) {
  try {
    // 1. 관리자 권한 검증
    const supabase = await createServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자 전용 기능입니다." },
        { status: 403 }
      );
    }

    const resend = getResendClient();

    // 2. Resend 등록 도메인 목록 수집
    let domainsList: any[] = [];
    try {
      const domainsRes = await resend.domains.list();
      domainsList = (domainsRes as any)?.data || domainsRes || [];
    } catch (dErr: any) {
      console.warn("Resend domains fetch warning:", dErr?.message);
    }

    // 3. Supabase DB email_forwarding_rules 규칙 수집 (도메인별, 유저별 계정 통계)
    let rulesList: any[] = [];
    try {
      const { data: rulesData } = await supabaseAdmin
        .from("email_forwarding_rules")
        .select("*, profiles:user_id(email, nickname)");
      rulesList = rulesData || [];
    } catch (rErr: any) {
      console.warn("DB rules fetch warning:", rErr?.message);
    }

    // 4. Resend 수신 (Inbound) 메일 이력 수집
    let receivedEmails: any[] = [];
    try {
      const receivingRes = await resend.emails.receiving.list();
      receivedEmails = (receivingRes as any)?.data?.data || (receivingRes as any)?.data || [];
    } catch (inboundErr: any) {
      console.warn("Resend inbound emails fetch warning:", inboundErr?.message);
    }

    // 5. Resend 발송 (Outbound) 메일 이력 수집
    let sentEmails: any[] = [];
    try {
      const sentRes = await resend.emails.list();
      sentEmails = (sentRes as any)?.data?.data || (sentRes as any)?.data || [];
    } catch (outboundErr: any) {
      console.warn("Resend outbound emails fetch warning:", outboundErr?.message);
    }

    // 6. 통계 데이터 집계
    const totalDomains = domainsList.length;
    const totalEmailRules = rulesList.length;
    const totalReceived = receivedEmails.length;
    const totalSent = sentEmails.length;

    // 도메인별 매핑 그룹화
    const domainGroupedMap: Record<string, { domainName: string; rulesCount: number; rules: any[]; status?: string }> = {};

    // 6-1. Resend 도메인 기본 정보 매핑
    domainsList.forEach((d: any) => {
      const name = d.name.toLowerCase();
      domainGroupedMap[name] = {
        domainName: name,
        rulesCount: 0,
        rules: [],
        status: d.status,
      };
    });

    // 6-2. DB 이메일 포워딩 규칙 매핑
    rulesList.forEach((rule: any) => {
      const dName = rule.domain_name?.toLowerCase() || "creaibox.com";
      if (!domainGroupedMap[dName]) {
        domainGroupedMap[dName] = {
          domainName: dName,
          rulesCount: 0,
          rules: [],
          status: "active",
        };
      }
      domainGroupedMap[dName].rulesCount += 1;
      domainGroupedMap[dName].rules.push({
        id: rule.id,
        emailAddress: `${rule.alias_prefix}@${dName}`,
        aliasPrefix: rule.alias_prefix,
        forwardTo: rule.forward_to,
        isActive: rule.is_active,
        createdAt: rule.created_at,
        ownerEmail: rule.profiles?.email || null,
        ownerNickname: rule.profiles?.nickname || null,
      });
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalDomains,
        totalEmailRules,
        totalReceived,
        totalSent,
      },
      domains: Object.values(domainGroupedMap),
      rawDomains: domainsList,
      rules: rulesList,
      receivedEmails,
      sentEmails,
    });
  } catch (err: any) {
    console.error("GET /api/admin/resend error:", err);
    return NextResponse.json(
      { error: err.message || "Resend 모니터링 데이터 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
