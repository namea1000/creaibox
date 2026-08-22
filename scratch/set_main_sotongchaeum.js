const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setMainSite() {
  const devProfileId = '454dfd4e-2b64-4309-afbe-e54f34666eb4'; // CreaiBox개발자

  // Check if primary 'sotongchaeum' exists
  const { data: existing } = await supabase.from('client_sites').select('id, brand_id').eq('brand_id', 'sotongchaeum');
  
  if (existing && existing.length > 0) {
    await supabase.from('client_sites').update({
      custom_domain: 'sotongchaeum.com',
      company_name: '소통과 채움',
      status: 'PUBLISHED',
      extra_configs: {
        companyName: '소통과 채움',
        email: 'sotongchaeum@naver.com',
        phone: '031-292-3806',
        address: '경기도 화성시 봉담읍 삼천병마로 1234',
        custom_domain: 'sotongchaeum.com',
        is_draft: false
      }
    }).eq('id', existing[0].id);
    console.log("Updated existing sotongchaeum client_site");
  } else {
    // Insert official sotongchaeum client_site
    const { data: inserted, error: inErr } = await supabase.from('client_sites').insert({
      profile_id: devProfileId,
      brand_id: 'sotongchaeum',
      company_name: '소통과 채움',
      custom_domain: 'sotongchaeum.com',
      status: 'PUBLISHED',
      template_id: 'service_1',
      creation_source: 'migration',
      phone: '031-292-3806',
      address: '경기도 화성시 봉담읍 삼천병마로 1234',
      extra_configs: {
        companyName: '소통과 채움',
        email: 'sotongchaeum@naver.com',
        phone: '031-292-3806',
        address: '경기도 화성시 봉담읍 삼천병마로 1234',
        custom_domain: 'sotongchaeum.com',
        is_draft: false
      }
    }).select();
    console.log("Created official sotongchaeum client_site:", inserted, inErr);
  }

  // Update dev profile
  await supabase.from('profiles').update({
    brand_id: 'sotongchaeum',
    custom_domain: 'sotongchaeum.com'
  }).eq('id', devProfileId);
  console.log("Updated developer profile brand_id to sotongchaeum");
}

setMainSite();
