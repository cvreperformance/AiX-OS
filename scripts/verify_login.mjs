// scripts/verify_login.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env vars not set");
  process.exit(1);
}

import ws from "ws";
const supabase = createClient(supabaseUrl, supabaseAnonKey, { realtime: { transport: ws } });

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "testadmin.aixos@gmail.com",
    password: "TestAdmin123456!",
  });
  if (error) {
    console.error("Login error:", error.message);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
  // Save session token for later curl usage
  if (data.session?.access_token) {
    fs.writeFileSync("session_token.txt", data.session.access_token);
  }
})();
