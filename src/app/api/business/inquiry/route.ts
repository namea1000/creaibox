import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. GET: Fetch all B2B inquiries for admin dashboard
export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // Fetch inquiries sorted by created_at desc
    const { data, error } = await supabase
      .from("enterprise_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET B2B inquiries unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Submit a new B2B inquiry from enterprise landing page
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      inquiryType,
      companyName,
      managerName,
      managerPosition,
      phone,
      email,
      solutions,
      details,
    } = body;

    if (!companyName || !managerName || !phone || !email) {
      return NextResponse.json(
        { error: "필수 입력 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("enterprise_inquiries")
      .insert([
        {
          inquiry_type: inquiryType || "enterprise",
          company_name: companyName,
          manager_name: managerName,
          manager_position: managerPosition || null,
          phone,
          email,
          solutions: solutions || [],
          details: details || null,
          status: "pending", // default status
        },
      ])
      .select();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("POST B2B inquiry unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PATCH: Update inquiry status and admin notes
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "문의 식별 고유 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.admin_notes = adminNotes;
    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("enterprise_inquiries")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("PATCH B2B inquiry unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
