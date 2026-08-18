import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

/**
 * 1. GET /api/email-forwarding
 * 로그인 유저의 이메일 포워딩 규칙 목록 조회
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { source: "unauthenticated", data: [], message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const domainName = searchParams.get("domain") || "creaibox.com";

    // DB 테이블 조회
    const { data: rules, error: dbErr } = await supabase
      .from("email_forwarding_rules")
      .select("*")
      .eq("user_id", user.id)
      .eq("domain_name", domainName)
      .order("created_at", { ascending: true });

    if (dbErr) {
      console.warn("DB query warning (table might be initializing):", dbErr.message);
      // 테이블이 아직 없거나 빈 경우
      return NextResponse.json({ source: "empty", data: [], domain: domainName });
    }

    return NextResponse.json({ source: "db", data: rules || [], domain: domainName });
  } catch (err: any) {
    console.error("GET /api/email-forwarding error:", err);
    return NextResponse.json(
      { error: err.message || "이메일 포워딩 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 2. POST /api/email-forwarding
 * 이메일 포워딩 규칙 신규 추가 또는 수정
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { domain_name, alias_prefix, forward_to } = body;

    if (!domain_name || !alias_prefix || !forward_to) {
      return NextResponse.json(
        { error: "도메인, 별칭 아이디, 전달받을 이메일을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const cleanAlias = alias_prefix.toLowerCase().trim().replace(/[^a-z0-9._-]/g, "");
    const cleanForward = forward_to.toLowerCase().trim();
    const cleanDomain = domain_name.toLowerCase().trim();

    if (!cleanAlias) {
      return NextResponse.json(
        { error: "유효한 이메일 아이디(영문, 숫자, 특수문자 ._-)를 입력해 주세요." },
        { status: 400 }
      );
    }

    // Upsert or Insert into email_forwarding_rules
    const { data, error } = await supabase
      .from("email_forwarding_rules")
      .upsert(
        {
          user_id: user.id,
          domain_name: cleanDomain,
          alias_prefix: cleanAlias,
          forward_to: cleanForward,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "domain_name,alias_prefix" }
      )
      .select()
      .single();

    if (error) {
      console.error("POST /api/email-forwarding DB upsert error:", error);
      return NextResponse.json(
        { error: `DB 저장 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${cleanAlias}@${cleanDomain} -> ${cleanForward} 포워딩 규칙이 등록되었습니다.`,
      rule: data,
    });
  } catch (err: any) {
    console.error("POST /api/email-forwarding error:", err);
    return NextResponse.json(
      { error: err.message || "이메일 포워딩 규칙 추가 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 3. DELETE /api/email-forwarding
 * 이메일 포워딩 규칙 삭제
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ruleId = searchParams.get("id");

    if (!ruleId) {
      return NextResponse.json(
        { error: "삭제할 규칙 ID가 지정되지 않았습니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("email_forwarding_rules")
      .delete()
      .eq("id", ruleId)
      .eq("user_id", user.id);

    if (error) {
      console.error("DELETE /api/email-forwarding DB error:", error);
      return NextResponse.json(
        { error: `삭제 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "이메일 포워딩 규칙이 삭제되었습니다.",
    });
  } catch (err: any) {
    console.error("DELETE /api/email-forwarding error:", err);
    return NextResponse.json(
      { error: err.message || "이메일 포워딩 규칙 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
