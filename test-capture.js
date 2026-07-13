require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data: { session }, error: authErr } = await supabase.auth.getSession();
  console.log("Auth:", !!session, authErr?.message);
  
  const { data, error } = await supabase.from('captures').select('*').limit(1);
  console.log("Captures query error:", error?.message);
}

test();
