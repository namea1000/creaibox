import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to revalidate blog pages" },
      { status: 500 }
    );
  }
}