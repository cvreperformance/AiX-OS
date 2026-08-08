// scripts/audit-real-estate-feed.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { validateSupabaseEnv } from '@/services/aix-intelligence/validateEnv';
import { FEED_CONFIG } from '@/services/aix-intelligence/feedConfig';

/**
 * Simple audit of the real‑estate news table.
 * It reports the total number of rows and how many are verified.
 * The script aborts with a clear error if real Supabase credentials are not configured.
 */
(async () => {
  try {
    // Ensure we have real credentials before proceeding.
    validateSupabaseEnv();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch stats from the 'news' table (the table used by the real‑estate pipeline).
    const { data, error, count } = await supabase
      .from('news')
      .select('verification_status', { count: 'exact' });

    if (error) {
      console.error('Failed to query Supabase:', error.message);
      process.exit(1);
    }

    const total = count ?? 0;
    const verified = data?.filter((r) => r.verification_status === 'verified').length ?? 0;
    console.log('=== Real Estate Feed Audit ===');
    console.log(`Total articles in DB: ${total}`);
    console.log(`Verified articles: ${verified}`);
    console.log('Configured feed sources:');
    FEED_CONFIG.forEach((src) => {
      console.log(`- ${src.displayName} (enabled: ${src.enabled})`);
    });
    process.exit(0);
    } catch (e) {
      // If Supabase credentials are missing, report a clear blocked status
      if (e instanceof Error && e.message.includes('Supabase credentials')) {
        console.error('BLOCKED — SUPABASE NOT CONFIGURED');
      } else {
        console.error('AUDIT ERROR:', e instanceof Error ? e.message : e);
      }
      process.exit(1);
    }
  })();
