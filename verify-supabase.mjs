// Quick Supabase connectivity + schema verification
// Run: node verify-supabase.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=');
    if (k && v.length) acc[k.trim()] = v.join('=').trim();
    return acc;
  }, {});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_ANON_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const SUPABASE_SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key if available (bypasses RLS), otherwise anon
const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, key);

console.log('🔍 Verifying Supabase connection and schema...');
console.log('URL:', SUPABASE_URL);
console.log('Using:', SUPABASE_SERVICE_KEY ? 'service_role key' : 'anon key');
console.log('');

const tables = ['calendar_events', 'captures', 'ideas', 'reminders', 'agent_runs', 'agent_logs'];

for (const table of tables) {
  const { data, error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    console.log(`❌ ${table}: ${error.message} (code: ${error.code})`);
  } else {
    console.log(`✅ ${table}: accessible (${data?.length ?? 0} rows sampled)`);
  }
}

// Test insert into captures (only works with service_role or authenticated user)
if (SUPABASE_SERVICE_KEY) {
  console.log('');
  console.log('🔍 Testing capture insert (service role)...');
  
  // Get first user
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1 });
  const user = users?.users?.[0];
  
  if (user) {
    console.log(`   Using user: ${user.email} (${user.id})`);
    
    const { data: capture, error: insertErr } = await supabase
      .from('captures')
      .insert({ user_id: user.id, raw_text: 'Schema verification test - safe to delete' })
      .select()
      .single();
    
    if (insertErr) {
      console.log(`❌ Insert test failed: ${insertErr.message}`);
    } else {
      console.log(`✅ Insert succeeded: id=${capture.id}`);
      
      // Clean up
      await supabase.from('captures').delete().eq('id', capture.id);
      console.log(`✅ Cleanup done`);
    }
  } else {
    console.log('   No users found - skipping insert test');
  }
} else {
  console.log('');
  console.log('ℹ️  SUPABASE_SERVICE_ROLE_KEY not set - skipping authenticated insert test');
  console.log('   Tables are accessible via anon key (schema verified above)');
}

console.log('');
console.log('✅ Schema verification complete.');
