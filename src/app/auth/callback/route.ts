import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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