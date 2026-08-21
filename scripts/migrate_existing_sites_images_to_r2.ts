import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { migrateAllImagesInHtmlAndData } from "../src/lib/server/migration-image-uploader";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateExistingSitesToR2() {
  console.log("🚀 [Batch Migration] Scanning existing migrated client sites...");

  const { data: sites, error } = await supabase
    .from("client_sites")
    .select("id, brand_id, company_name, extra_configs")
    .eq("creation_source", "migration");

  if (error || !sites) {
    console.error("Failed to fetch client sites:", error);
    return;
  }

  console.log(`📋 Found ${sites.length} migrated sites.`);

  for (const site of sites) {
    console.log(`\n========================================`);
    console.log(`🔍 Processing Site: ${site.brand_id} (${site.company_name})`);

    const { data: sections } = await supabase
      .from("site_sections")
      .select("id, section_type, sort_order, title, subtitle, content_data")
      .eq("site_id", site.id)
      .order("sort_order", { ascending: true });

    if (!sections || sections.length === 0) {
      console.log(`- No sections found for ${site.brand_id}. Skipping.`);
      continue;
    }

    const headerHtml = site.extra_configs?.header_html || "";
    const footerHtml = site.extra_configs?.footer_html || "";

    const sectionInputs = sections.map((s) => ({
      section_type: s.section_type,
      html: s.content_data?.html || "",
      content_data: s.content_data || {},
      media_urls: s.content_data?.media_urls || [],
      slides: s.content_data?.slides || [],
    }));

    try {
      const result = await migrateAllImagesInHtmlAndData(
        site.brand_id,
        sectionInputs,
        headerHtml,
        footerHtml
      );

      console.log(`✅ Migrated ${result.migratedCount} images to R2 for ${site.brand_id}`);

      // 1. Update site sections
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const updatedSec = result.sections[i];
        if (updatedSec) {
          await supabase
            .from("site_sections")
            .update({
              content_data: updatedSec.content_data,
            })
            .eq("id", sec.id);
        }
      }

      // 2. Update client_sites extra_configs
      const nextConfigs = {
        ...(site.extra_configs || {}),
        ...(result.headerHtml ? { header_html: result.headerHtml } : {}),
        ...(result.footerHtml ? { footer_html: result.footerHtml } : {}),
        migrated_images_count: result.migratedCount,
        images_migrated_to_r2_at: new Date().toISOString(),
      };

      await supabase
        .from("client_sites")
        .update({ extra_configs: nextConfigs })
        .eq("id", site.id);

      console.log(`💾 Successfully updated DB records for ${site.brand_id}`);
    } catch (err) {
      console.error(`❌ Error migrating images for ${site.brand_id}:`, err);
    }
  }

  console.log("\n🎉 [Batch Migration] All existing migrated site images are now safely backed up on Cloudflare R2!");
}

migrateExistingSitesToR2();
