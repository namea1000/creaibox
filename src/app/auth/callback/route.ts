import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/lib/server/resend-email";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  // If 'state' parameter exists, it's a Naver OAuth callback -> forward to Naver handler
  if (code && state) {
    const naverCallbackUrl = new URL("/api/auth/callback/naver", requestUrl.origin);
    naverCallbackUrl.searchParams.set("code", code);
    naverCallbackUrl.searchParams.set("state", state);
    return NextResponse.redirect(naverCallbackUrl);
  }

  const nextPath = requestUrl.searchParams.get("next") || "/";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 웰컴 이메일 미발송 신규 가입자 체크 및 자동 발송
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email && !user.user_metadata?.welcome_email_sent) {
          const userName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            null;

          // 1. Resend 웰컴 이메일 비동기 트리거
          void sendWelcomeEmail({
            userEmail: user.email,
            userName: userName,
          });

          // 2. 발송 완료 플래그 기록 (중복 발송 100% 방지)
          const adminSupabase = await createAdminClient();
          await adminSupabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
              ...user.user_metadata,
              welcome_email_sent: true,
            },
          });
        }
      } catch (welcomeErr: any) {
        console.warn("Welcome email trigger warning:", welcomeErr?.message);
      }

      return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
    }

    console.error("Auth error:", error.message);

    return NextResponse.redirect(
      new URL(
        `/login?error_msg=${encodeURIComponent(error.message)}`,
        requestUrl.origin
      )
    );
  }

  return NextResponse.redirect(
    new URL("/login?error_details=auth_failed", requestUrl.origin)
  );
}