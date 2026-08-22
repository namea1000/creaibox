const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function registerFuturemind2() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id;

  const payload = {
    profile_id: userId,
    brand_id: 'futuremind2',
    company_name: '미래교육문화협회 (퓨처마인드)',
    custom_domain: 'futuremind2.kr',
    template_id: 'blazity',
    status: 'PUBLISHED',
    creation_source: 'migration',
    extra_configs: {
      original_url: 'http://futuremind.kr',
      figma_url: 'https://easing-perm-64748637.figma.site/',
      slogan: 'AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다',
      theme_color: '#f95700'
    }
  };

  const { data: existing } = await supabase
    .from('client_sites')
    .select('id, brand_id')
    .eq('brand_id', 'futuremind2')
    .maybeSingle();

  if (existing) {
    await supabase.from('client_sites').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('client_sites').insert(payload);
  }
  console.log("✅ futuremind2 registered in client_sites!");
}

registerFuturemind2();
