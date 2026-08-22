const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testOrCreateTable() {
  console.log("Checking if site_audits table exists...");
  const { data, error } = await supabase.from('site_audits').select('id').limit(1);
  if (error) {
    console.log("Table check error/not created yet:", error.message);
  } else {
    console.log("site_audits table is ready!", data);
  }
}

testOrCreateTable();
