import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { slug, brandId, categoryIds } = await request.json();

    if (brandId) {
      // 1. Revalidate brand home page
      revalidatePath(`/brand/${brandId}`);
      revalidatePath("/");

      // 2. Revalidate post detail page
      if (slug) {
        revalidatePath(`/brand/${brandId}/${slug}`);
        revalidatePath(`/${slug}`);
      }

      // 3. Revalidate category pages
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const supabase = await createAdminClient();
        const { data: categories } = await supabase
          .from("blog_categories")
          .select("slug")
          .in("id", categoryIds);

        if (categories) {
          for (const cat of categories) {
            if (cat.slug) {
              revalidatePath(`/brand/${brandId}/category/${cat.slug}`);
              revalidatePath(`/category/${cat.slug}`);
            }
          }
        }
      }
    } else {
      // Fallback for legacy calls
      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");

      if (slug) {
        revalidatePath(`/blog/${slug}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to revalidate blog pages" },
      { status: 500 }
    );
  }
}