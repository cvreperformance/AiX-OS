import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const SUPABASE_URL = "https://fcpsafjgjnecdlyqfcid.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

async function testWizardPayload() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "testadmin.aixos@gmail.com",
    password: "TestAdmin123456!",
  });

  if (authError || !authData.user) {
    console.error("Auth failed:", authError);
    process.exit(1);
  }

  const user = authData.user;
  const timeStamp = Date.now();

  const payload = {
    owner_id: user.id,
    title: `Full Wizard Test Penthouse ${timeStamp}`,
    description: "Testing complete wizard payload with address.",
    category: "Apartment",
    listing_type: "Sale",
    status: "Published",
    price: 1250000,
    currency: "EUR",
    country: "Romania",
    city: "Bucharest",
    district: "Sector 1",
    neighborhood: "Herastrau",
    address: "Sos. Nordului 42, Ap. 5B",
    built_area: 220,
    usable_area: 185,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 3,
    year_built: 2024,
    features: ["Terrace", "Underground Parking", "Smart Home", "Lake View"],
    gallery: [
      `https://fcpsafjgjnecdlyqfcid.supabase.co/storage/v1/object/public/proprietati/properties/${user.id}/cover.jpg`,
      `https://fcpsafjgjnecdlyqfcid.supabase.co/storage/v1/object/public/proprietati/properties/${user.id}/img2.jpg`
    ],
    cover_image: `https://fcpsafjgjnecdlyqfcid.supabase.co/storage/v1/object/public/proprietati/properties/${user.id}/cover.jpg`,
    video_url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    video_provider: "youtube",
    video_thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    published_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("properties").insert(payload).select().single();

  if (error) {
    console.error("❌ WIZARD PAYLOAD INSERT FAILED:", error);
    process.exit(1);
  }

  console.log("✅ WIZARD PAYLOAD INSERT SUCCEEDED!");
  console.log("ID:", data.id);
  console.log("ADDRESS:", data.address);
  console.log("LOCATION (AUTO-SYNCED):", data.location);
  console.log("AREA_SQM (AUTO-SYNCED):", data.area_sqm);
  console.log("IMAGE_URL (AUTO-SYNCED):", data.image_url);

  // Clean up test item
  await supabase.from("properties").delete().eq("id", data.id);
  console.log("✅ Cleanup done.");
}

testWizardPayload().catch(console.error);
