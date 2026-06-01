import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const format = searchParams.get("format") || "png";

    if (!imageUrl) {
      return NextResponse.json({ error: "이미지 URL이 없습니다." }, { status: 400 });
    }

    const imageRes = await fetch(imageUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const outputBuffer =
      format === "webp"
        ? await sharp(inputBuffer).webp({ quality: 90 }).toBuffer()
        : await sharp(inputBuffer).png().toBuffer();

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": format === "webp" ? "image/webp" : "image/png",
        "Content-Disposition": `attachment; filename="creaibox-image.${format}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "다운로드 변환 실패" },
      { status: 500 }
    );
  }
}