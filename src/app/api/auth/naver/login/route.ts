import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const clientId = process.env.NAVER_CLIENT_ID || "ZTMACw6iK7VCdYi3dOMb";
  const state = Math.random().toString(36).substring(2, 15);
  const prompt = requestUrl.searchParams.get("prompt") || requestUrl.searchParams.get("auth_type");

  // Send callback URL matching the Naver Developers Console registered URL
  const callbackUrl = `${requestUrl.origin}/auth/callback`;

  let naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    callbackUrl
  )}&state=${state}`;

  // Always force Naver re-authentication / account switching if prompt=select_account or auth_type=reprompt, or by default for smooth switching!
  if (prompt === "select_account" || prompt === "reprompt" || prompt === "true") {
    naverAuthUrl += `&auth_type=reprompt`;
  }

  return NextResponse.redirect(naverAuthUrl);
}
