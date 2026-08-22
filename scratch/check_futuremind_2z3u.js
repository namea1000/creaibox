const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkFuturemind2z3u() {
  const { data: site } = await supabase
    .from('client_sites')
    .select('*')
    .eq('brand_id', 'futuremind-2z3u')
    .maybeSingle();

  console.log("Site futuremind-2z3u:", site?.company_name, site?.template_id);
  if (site?.extra_configs) {
    console.log("Header snippet:", site.extra_configs.header_html?.slice(0, 300));
    console.log("Footer snippet:", site.extra_configs.footer_html?.slice(0, 300));
  }

  const { data: sections } = await supabase
    .from('site_sections')
    .select('*')
    .eq('site_id', site?.id)
    .order('section_order', { ascending: true });

  console.log("Sections count:", sections?.length);
  sections?.forEach((s, idx) => {
    console.log(`[Section ${idx}] title: ${s.title}, subtitle: ${s.subtitle}`);
  });
}

checkFuturemind2z3u();
