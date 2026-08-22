import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const SUPABASE_URL = "https://fcpsafjgjnecdlyqfcid.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

async function runStorageRlsTests() {
  console.log("==================================================");
  console.log("1. AUTHENTICATING TEST USER");
  console.log("==================================================");

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "testadmin.aixos@gmail.com",
    password: "TestAdmin123456!",
  });

  if (authError || !authData.session) {
    console.error("❌ Authentication failed:", authError);
    process.exit(1);
  }

  const userA = authData.user;
  const tokenA = authData.session.access_token;
  console.log("✅ Authenticated as User A:", userA.id, userA.email);

  // User B UUID from database
  const userB_id = "158022c5-892e-429d-a359-65615edb860f";

  console.log("\n==================================================");
  console.log("2. VERIFYING OBJECT PATH & FOLDER EVALUATION");
  console.log("==================================================");
  const samplePath = `properties/${userA.id}/test-sample.jpg`;
  console.log("Path:", samplePath);
  console.log("Expected folder[1]: properties");
  console.log("Expected folder[2]:", userA.id);

  const dummyFile = Buffer.from("fake image data for RLS test");

  console.log("\n==================================================");
  console.log("3. TEST 1: POSITIVE SECURITY TEST (User A -> Own Folder)");
  console.log("==================================================");
  const pathUserA = `properties/${userA.id}/test-rls-${Date.now()}.jpg`;
  const uploadUrlUserA = `${SUPABASE_URL}/storage/v1/object/proprietati/${pathUserA}`;

  console.log("METHOD: POST");
  console.log("URL:", uploadUrlUserA);
  console.log("BUCKET: proprietati");
  console.log("OBJECT PATH:", pathUserA);
  console.log("AUTHENTICATED USER:", userA.id);

  const { data: resA, error: errA } = await supabase.storage
    .from("proprietati")
    .upload(pathUserA, dummyFile, { contentType: "image/jpeg", upsert: true });

  if (errA) {
    console.error("❌ TEST 1 FAILED:", errA);
  } else {
    console.log("✅ TEST 1 PASSED: Upload successful!", resA);
    // Cleanup
    await supabase.storage.from("proprietati").remove([pathUserA]);
  }

  console.log("\n==================================================");
  console.log("4. TEST 2: NEGATIVE SECURITY TEST (User A -> User B Folder)");
  console.log("==================================================");
  const pathUserB = `properties/${userB_id}/test-rls-hack-${Date.now()}.jpg`;
  const { data: resB, error: errB } = await supabase.storage
    .from("proprietati")
    .upload(pathUserB, dummyFile, { contentType: "image/jpeg", upsert: true });

  if (errB) {
    console.log("✅ TEST 2 PASSED (DENIED as expected):", errB.message);
  } else {
    console.error("❌ SECURITY FAILURE! User A was able to write to User B's folder:", resB);
  }

  console.log("\n==================================================");
  console.log("5. TEST 3: NEGATIVE SECURITY TEST (Anonymous -> Any Folder)");
  console.log("==================================================");
  const anonSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    realtime: { transport: ws }
  });
  const { data: resAnon, error: errAnon } = await anonSupabase.storage
    .from("proprietati")
    .upload(pathUserA, dummyFile, { contentType: "image/jpeg", upsert: true });

  if (errAnon) {
    console.log("✅ TEST 3 PASSED (DENIED as expected):", errAnon.message);
  } else {
    console.error("❌ SECURITY FAILURE! Anonymous user was able to upload:", resAnon);
  }

  console.log("\n==================================================");
  console.log("6. TEST 4: NEGATIVE SECURITY TEST (Wrong Bucket)");
  console.log("==================================================");
  const { data: resWrong, error: errWrong } = await supabase.storage
    .from("non-existent-bucket")
    .upload(pathUserA, dummyFile, { contentType: "image/jpeg", upsert: true });

  if (errWrong) {
    console.log("✅ TEST 4 PASSED (DENIED as expected):", errWrong.message);
  } else {
    console.error("❌ FAILURE! Upload to wrong bucket succeeded:", resWrong);
  }
}

runStorageRlsTests().catch(console.error);
