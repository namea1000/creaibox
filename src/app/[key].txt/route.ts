import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_INDEXNOW_KEY } from "@/lib/server/indexnow";

export async function GET(
  req: NextRequest,
  context: any
) {
  const params = await context?.params;
  const requestedKey = params?.key;
  const currentKey = DEFAULT_INDEXNOW_KEY;

  if (!requestedKey || requestedKey === currentKey || requestedKey === "indexnow-key") {
    return new NextResponse(currentKey, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  return new NextResponse(currentKey, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
