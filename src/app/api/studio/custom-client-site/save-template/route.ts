import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "로그인이 필요한 서비스입니다." }, { status: 401 });
    }

    const body = await req.json();
    const { siteId, templateName, category, description } = body;

    if (!siteId) {
      return NextResponse.json({ error: "대상 사이트 ID가 누락되었습니다." }, { status: 400 });
    }

    // 1. Fetch source client site
    const { data: site, error: siteErr } = await supabase
      .from("client_sites")
      .select("*")
      .eq("id", siteId)
      .maybeSingle();

    if (siteErr || !site) {
      return NextResponse.json({ error: "사이트 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. Fetch site sections if any
    const { data: sections } = await supabase
      .from("site_sections")
      .select("*")
      .eq("site_id", siteId)
      .order("section_order", { ascending: true });

    const finalName = templateName?.trim() || `${site.company_name || site.brand_id} 스타일 템플릿`;
    const templateKey = `custom_${site.brand_id}_${Date.now().toString(36)}`;
    const thumbnailUrl = site.extra_configs?.thumbnail_url || 
                         site.extra_configs?.og_image || 
                         (sections && sections[0]?.media_urls?.[0]) || 
                         "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60";

    const templateData = {
      user_id: user.id,
      template_key: templateKey,
      name: finalName,
      category: category || "나만의 템플릿",
      description: description || `${site.company_name || site.brand_id} 사이트에서 추출된 고품질 맞춤 템플릿입니다.`,
      thumbnail_url: thumbnailUrl,
      source_brand_id: site.brand_id,
      source_url: site.extra_configs?.original_url || site.extra_configs?.source_url || `https://${site.brand_id}.creaibox.com`,
      header_html: site.extra_configs?.header_html || null,
      footer_html: site.extra_configs?.footer_html || null,
      sections_snapshot: (sections && sections.length > 0) ? sections : (site.extra_configs?.main_sections || []),
      is_public: false,
    };

    // 3. Insert into custom_templates table (with fail-safe)
    let savedInTable = false;
    try {
      const { data: inserted, error: insertErr } = await supabase
        .from("custom_templates")
        .insert(templateData)
        .select("id")
        .maybeSingle();

      if (inserted?.id) {
        savedInTable = true;
      } else if (insertErr) {
        console.warn("custom_templates table insert note:", insertErr.message);
      }
    } catch (e: any) {
      console.warn("custom_templates table note:", e.message);
    }

    // 4. Also store in profiles.extra_configs.saved_templates as a robust fallback
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const prevConfigs = profile?.extra_configs || {};
      const prevTemplates = Array.isArray(prevConfigs.saved_templates) ? prevConfigs.saved_templates : [];
      const updatedTemplates = [
        { ...templateData, id: templateKey, created_at: new Date().toISOString() },
        ...prevTemplates.filter((t: any) => t.source_brand_id !== site.brand_id),
      ].slice(0, 30);

      await supabase
        .from("profiles")
        .update({
          extra_configs: {
            ...prevConfigs,
            saved_templates: updatedTemplates,
          },
        })
        .eq("id", user.id);
    } catch (profErr) {
      console.warn("Profile extra_configs template save note:", profErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        templateKey,
        name: finalName,
        thumbnailUrl,
        savedInTable,
      },
    });
  } catch (err: any) {
    console.error("POST /api/studio/custom-client-site/save-template error:", err);
    return NextResponse.json({ error: err.message || "템플릿 등록 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 1. Try fetching from custom_templates table
    try {
      const { data, error } = await supabase
        .from("custom_templates")
        .select("*")
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch {}

    // 2. Fallback to profiles.extra_configs.saved_templates
    const { data: profile } = await supabase
      .from("profiles")
      .select("extra_configs")
      .eq("id", user.id)
      .maybeSingle();

    const saved = profile?.extra_configs?.saved_templates || [];
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}
