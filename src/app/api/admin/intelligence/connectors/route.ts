import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApplicationRegistry } from "@/services/aix-intelligence/connector/application-registry";
import { ConnectorHealth } from "@/services/aix-intelligence/connector/connector-health";

export const runtime = "nodejs";

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    return !!profile?.is_admin;
  } catch (e) {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const list = ApplicationRegistry.load();
  return NextResponse.json({ success: true, connectors: list });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, application_id, display_name, version, status, flags } = body;

    if (!application_id) {
      return NextResponse.json({ success: false, error: "Missing application_id" }, { status: 400 });
    }

    if (action === "register") {
      const reg = ApplicationRegistry.registerApp(application_id, display_name || application_id, version || "1.0.0", flags);
      return NextResponse.json({ success: true, connector: reg });
    }

    if (action === "unregister") {
      const res = ApplicationRegistry.unregisterApp(application_id);
      return NextResponse.json({ success: res });
    }

    if (action === "rotate_key") {
      const newKey = ApplicationRegistry.rotateKey(application_id);
      return NextResponse.json({ success: !!newKey, api_key: newKey });
    }

    if (action === "update") {
      const reg = ApplicationRegistry.updateApp(application_id, { status, feature_flags: flags });
      return NextResponse.json({ success: !!reg, connector: reg });
    }

    if (action === "heartbeat") {
      ConnectorHealth.updateStats(application_id, { heartbeat: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Internal registry failure" }, { status: 500 });
  }
}
