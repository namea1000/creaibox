import { NextResponse } from "next/server";
import { getClientSiteConfig, saveClientSiteConfig } from "@/lib/server/client-site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") || searchParams.get("domain") || "sotongcheum";
  const config = await getClientSiteConfig(brandId);
  return NextResponse.json({ success: true, brandId, config });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brandId = body.brandId || "sotongcheum";
    const config = body.config || body;

    await saveClientSiteConfig(brandId, config);
    return NextResponse.json({ success: true, brandId, config });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to save client config" }, { status: 500 });
  }
}
