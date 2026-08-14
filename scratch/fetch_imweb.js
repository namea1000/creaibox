const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://dkblalbnykgpksurdace.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYmxhbGJueWtncGtzdXJkYWNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg3Njc4MiwiZXhwIjoyMDkzNDUyNzgyfQ.4Z99MZh9xTu_9nT2-kjUH5OCxt2pJ_VaIfWYWdmiXts'
);
async function run() {
  const { data } = await supabase.from('client_sites').select('extra_configs').eq('brand_id', 'imweb2').single();
  console.log(data?.extra_configs?.header_html);
}
run();
