import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('client_sites').select('brand_id, extra_configs').in('brand_id', ['helloworkbuldang', 'map', 'repaint', 'davich']);
  if (error) console.error(error);
  else {
    data.forEach(d => {
      console.log(`\n\n=== ${d.brand_id} ===`);
      console.log(d.extra_configs?.header_html);
    });
  }
}
check();
