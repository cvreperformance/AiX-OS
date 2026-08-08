// scripts/fetch-real-estate.ts
import 'dotenv/config';
import { runRealEstateIngestion } from '@/services/aix-intelligence/realEstateIngestion';
import { validateSupabaseEnv } from '@/services/aix-intelligence/validateEnv';

(async () => {
  try {
    // Validate Supabase configuration before any work
    validateSupabaseEnv();

    console.log('Starting European Real Estate ingestion...');
    await runRealEstateIngestion();
    console.log('Ingestion completed successfully.');
    // The runRealEstateIngestion function already logs detailed stats.
    process.exit(0);
  } catch (e) {
    console.error('ERROR during ingestion:', e instanceof Error ? e.message : e);
    process.exit(1);
  }
})();
