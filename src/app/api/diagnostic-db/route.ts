import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "MISSING";
    
    // Mask key/url for security
    const maskedUrl = supabaseUrl !== "MISSING" 
      ? supabaseUrl.slice(0, 15) + "..." + supabaseUrl.slice(-5) 
      : "MISSING";
    const maskedKey = serviceRoleKey !== "MISSING" 
      ? serviceRoleKey.slice(0, 10) + "..." + serviceRoleKey.slice(-10) 
      : "MISSING";

    const supabase = await createAdminClient();
    
    // Test fetch brand_id = 'blog'
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, nickname, brand_id, brand_id_status")
      .eq("brand_id", "blog")
      .maybeSingle();

    return NextResponse.json({
      success: true,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: maskedUrl,
        SUPABASE_SERVICE_ROLE_KEY_EXISTS: serviceRoleKey !== "MISSING",
        SUPABASE_SERVICE_ROLE_KEY_MASKED: maskedKey,
      },
      dbTest: {
        profileFound: !!profile,
        profileData: profile || null,
        error: profileErr ? {
          message: profileErr.message,
          details: profileErr.details,
          hint: profileErr.hint,
          code: profileErr.code,
        } : null,
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || err.toString(),
    }, { status: 500 });
  }
}
