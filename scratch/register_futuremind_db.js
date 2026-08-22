const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function registerFuturemindSite() {
  console.log("Registering futuremind client site in Supabase DB...");
  
  // 1. Get first admin user or system user
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id;
  console.log("Using User ID:", userId);

  // 2. Check if client_sites has futuremind
  const { data: existing } = await supabase
    .from('client_sites')
    .select('id, brand_id')
    .eq('brand_id', 'futuremind')
    .maybeSingle();

  if (existing) {
    console.log("Updating existing futuremind record:", existing.id);
    const { error: updateErr } = await supabase
      .from('client_sites')
      .update({
        name: '미래교육문화협회 (퓨처마인드)',
        status: 'published',
        custom_domain: 'futuremind.kr',
        template_id: 'futuremind',
        updated_at: new Date().toISOString(),
        extra_configs: {
          originalUrl: 'http://futuremind.kr',
          figmaUrl: 'https://easing-perm-64748637.figma.site/',
          slogan: 'AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다',
          themeColor: '#06b6d4'
        }
      })
      .eq('id', existing.id);
    if (updateErr) console.error("Update error:", updateErr.message);
    else console.log("✅ futuremind updated successfully!");
  } else {
    console.log("Inserting new futuremind client site record...");
    const { data: inserted, error: insertErr } = await supabase
      .from('client_sites')
      .insert({
        user_id: userId,
        brand_id: 'futuremind',
        name: '미래교육문화협회 (퓨처마인드)',
        status: 'published',
        custom_domain: 'futuremind.kr',
        template_id: 'futuremind',
        extra_configs: {
          originalUrl: 'http://futuremind.kr',
          figmaUrl: 'https://easing-perm-64748637.figma.site/',
          slogan: 'AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다',
          themeColor: '#06b6d4'
        }
      })
      .select()
      .maybeSingle();

    if (insertErr) console.error("Insert error:", insertErr.message);
    else console.log("✅ futuremind inserted successfully:", inserted?.id);
  }
}

registerFuturemindSite();
