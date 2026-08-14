import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fcpsafjgjnecdlyqfcid.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Basic guard against unauthorized access
  if (secret !== "aix-os-storage-fix-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    // 1. Ensure bucket 'proprietati' exists with public: true
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket("proprietati");
    
    if (bucketError || !bucket) {
      console.log("[Storage Admin] Bucket 'proprietati' missing, creating...");
      const { data: newBucket, error: createError } = await supabase.storage.createBucket("proprietati", {
        public: true,
      });
      if (createError) {
        return NextResponse.json({ error: `Failed to create bucket: ${createError.message}` }, { status: 500 });
      }
    } else if (!bucket.public) {
      console.log("[Storage Admin] Bucket 'proprietati' exists but is private, updating to public...");
      await supabase.storage.updateBucket("proprietati", { public: true });
    }

    // 2. Query storage buckets status
    const { data: buckets } = await supabase.storage.listBuckets();

    return NextResponse.json({
      success: true,
      canonicalBucket: "proprietati",
      bucketStatus: "configured",
      allBuckets: buckets?.map((b) => ({ id: b.id, name: b.name, public: b.public })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
