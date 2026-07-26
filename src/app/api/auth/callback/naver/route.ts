import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=naver_no_code", requestUrl.origin));
  }

  const clientId = process.env.NAVER_CLIENT_ID || "ZTMACw6iK7VCdYi3dOMb";
  const clientSecret = process.env.NAVER_CLIENT_SECRET || "qB0yyUD0Oa";

  try {
    // 1. Exchange code for token
    const tokenRes = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Naver token error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=naver_token_failed", requestUrl.origin));
    }

    // 2. Get Naver User Profile
    const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const profileData = await profileRes.json();

    if (profileData.resultcode !== "00" || !profileData.response) {
      console.error("Naver profile error:", profileData);
      return NextResponse.redirect(new URL("/login?error=naver_profile_failed", requestUrl.origin));
    }

    const naverUser = profileData.response; // { id, email, nickname, profile_image, name }
    const email = naverUser.email || `naver_${naverUser.id}@creaibox.com`;
    const nickname = naverUser.nickname || naverUser.name || "네이버 사용자";

    // 3. Supabase User Upsert via Admin Client
    const supabaseAdmin = await createAdminClient();

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let user = existingUsers.users.find((u: any) => u.email === email);

    if (!user) {
      // Create user with verified email
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: nickname,
          avatar_url: naverUser.profile_image || "",
          provider: "naver",
          naver_id: naverUser.id,
        },
      });

      if (createErr || !newUser.user) {
        console.error("Supabase user creation error:", createErr);
        return NextResponse.redirect(new URL("/login?error=user_creation_failed", requestUrl.origin));
      }
      user = newUser.user;
    }

    // Generate magic link session for instant auto login
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkErr || !linkData.properties?.action_link) {
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }

    return NextResponse.redirect(linkData.properties.action_link);
  } catch (err: any) {
    console.error("Naver OAuth error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message)}`, requestUrl.origin)
    );
  }
}
