import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const clientId = process.env.NAVER_CLIENT_ID || "ZTMACw6iK7VCdYi3dOMb";
  const state = Math.random().toString(36).substring(2, 15);

  // Send callback URL matching the Naver Developers Console registered URL
  const callbackUrl = `${requestUrl.origin}/auth/callback`;

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    callbackUrl
  )}&state=${state}`;

  return NextResponse.redirect(naverAuthUrl);
}
