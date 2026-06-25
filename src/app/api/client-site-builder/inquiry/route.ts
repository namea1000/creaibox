import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { siteId, formData, fields } = await req.json();

    if (!siteId) {
      return NextResponse.json(
        { error: "소속 홈페이지 ID(siteId)가 누락되었습니다." },
        { status: 400 }
      );
    }

    const name = formData.name || "익명 신청자";
    const phone = formData.phone || "";
    const email = formData.email || "";

    // 1. Build a clean readable body content
    const details: string[] = [];
    details.push(`신청인: ${name}`);
    if (phone) details.push(`연락처: ${phone}`);
    if (email) details.push(`이메일: ${email}`);

    // Map other dynamic fields
    const excludedKeys = ["name", "phone", "email"];
    Object.entries(formData).forEach(([key, value]) => {
      if (!excludedKeys.includes(key) && value) {
        details.push(`${key}: ${value}`);
      }
    });

    const contentText = details.join("\n");
    const titleText = `[상담신청] ${name} - ${phone || "연락처 없음"}`;

    // 2. Insert into database using admin client
    const supabase = await createAdminClient();
    
    // Check if client site is active
    const { data: site } = await supabase
      .from("client_sites")
      .select("id, company_name")
      .eq("id", siteId)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (!site) {
      return NextResponse.json(
        { error: "활성화되어 있지 않거나 존재하지 않는 홈페이지입니다." },
        { status: 404 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("site_posts")
      .insert({
        site_id: siteId,
        post_type: "inquiry",
        title: titleText,
        content: contentText,
        author_name: name,
        extra_data: formData
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Inquiry DB insert failed: ${insertError.message}`);
    }

    // TODO: Send Email/Push Notification to the homepage owner (Phase 2-4)

    return NextResponse.json({
      success: true,
      inquiryId: inserted.id
    });
  } catch (error: any) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: error.message || "문의 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
