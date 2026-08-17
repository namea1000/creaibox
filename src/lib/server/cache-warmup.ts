import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/server";

export interface WarmUpOptions {
  brandId?: string | null;
  slug?: string | null;
  categoryIds?: string[];
  customDomain?: string | null;
}

/**
 * 🌟 CreaiBox On-Demand Edge Revalidate & Instant Warm-up Helper
 * 글 발행, 수정, 삭제, AI 마이그레이션 완료 시 호출하여
 * 구형 캐시를 즉시 파기하고 새 HTML을 Vercel Edge CDN에 0.1초 만에 미리 구워둡니다.
 */
export async function revalidateAndWarmUpPost({
  brandId,
  slug,
  categoryIds,
  customDomain,
}: WarmUpOptions): Promise<{ ok: boolean; warmedUrls: string[] }> {
  const warmUpUrls: string[] = [];

  try {
    if (brandId) {
      const cleanBrandId = brandId.toLowerCase();

      // 1. Revalidate brand home page & root
      revalidatePath(`/brand/${cleanBrandId}`);
      revalidatePath("/");
      warmUpUrls.push(`https://${cleanBrandId}.creaibox.com`);

      // 2. Revalidate post detail page
      if (slug) {
        const decodedSlug = decodeURIComponent(slug);
        const encodedSlug = encodeURIComponent(decodedSlug);

        revalidatePath(`/brand/${cleanBrandId}/${decodedSlug}`);
        revalidatePath(`/brand/${cleanBrandId}/${encodedSlug}`);
        revalidatePath(`/brand/${cleanBrandId}/blog/${decodedSlug}`);
        revalidatePath(`/brand/${cleanBrandId}/blog/${encodedSlug}`);
        revalidatePath(`/${decodedSlug}`);
        revalidatePath(`/${encodedSlug}`);

        warmUpUrls.push(`https://${cleanBrandId}.creaibox.com/${encodedSlug}`);
        warmUpUrls.push(`https://${cleanBrandId}.creaibox.com/blog/${encodedSlug}`);
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
              const decodedCat = decodeURIComponent(cat.slug);
              const encodedCat = encodeURIComponent(decodedCat);
              revalidatePath(`/brand/${cleanBrandId}/category/${decodedCat}`);
              revalidatePath(`/brand/${cleanBrandId}/category/${encodedCat}`);
              revalidatePath(`/category/${decodedCat}`);
              revalidatePath(`/category/${encodedCat}`);
              warmUpUrls.push(`https://${cleanBrandId}.creaibox.com/category/${encodedCat}`);
            }
          }
        }
      }

      // 4. Check for Custom Domain
      if (customDomain) {
        const cleanCustom = customDomain.toLowerCase().trim();
        warmUpUrls.push(`https://${cleanCustom}`);
        if (slug) {
          const encodedSlug = encodeURIComponent(decodeURIComponent(slug));
          warmUpUrls.push(`https://${cleanCustom}/${encodedSlug}`);
          warmUpUrls.push(`https://${cleanCustom}/blog/${encodedSlug}`);
        }
      }
    } else {
      // Platform official blog
      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");
      warmUpUrls.push("https://creaibox.com/blog");

      if (slug) {
        const decodedSlug = decodeURIComponent(slug);
        const encodedSlug = encodeURIComponent(decodedSlug);
        revalidatePath(`/blog/${decodedSlug}`);
        revalidatePath(`/blog/${encodedSlug}`);
        warmUpUrls.push(`https://creaibox.com/blog/${encodedSlug}`);
      }
    }

    // 🌟 Non-blocking Instant Edge Warm-up
    if (warmUpUrls.length > 0) {
      Promise.allSettled(
        warmUpUrls.map((targetUrl) =>
          fetch(targetUrl, {
            method: "GET",
            headers: {
              "User-Agent": "CreaiBox-Edge-Warmup-Bot/1.0",
              "x-creaibox-warmup": "true",
            },
            cache: "no-store",
          }).catch(() => {})
        )
      ).catch(() => {});
    }

    return { ok: true, warmedUrls: warmUpUrls };
  } catch (err) {
    console.error("revalidateAndWarmUpPost error:", err);
    return { ok: false, warmedUrls: [] };
  }
}
