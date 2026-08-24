// src/app/api/properties/[id]/route.ts
// Secure Property Management Endpoint (CRUD, Status Toggles, Delete)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch property
    const { data: property, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Check visibility permissions
    const isOwner = user && property.owner_id === user.id;
    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role === "admin" || profile?.role === "superadmin") {
        isAdmin = true;
      }
    }

    const isPublished = property.status === "Published" || property.status === "active";

    if (!isPublished && !isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ property });
  } catch (err: any) {
    console.error("[API /api/properties/[id]] GET error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch existing property to check ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("properties")
      .select("id, owner_id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Check admin role
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";
    const isOwner = existing.owner_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not own this property" }, { status: 403 });
    }

    const body = await req.json();

    // Prevent changing owner_id unless admin
    if (body.owner_id && !isAdmin) {
      delete body.owner_id;
    }

    // If toggling status
    if (body.status === "Published" && existing.status !== "Published") {
      body.published_at = new Date().toISOString();
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("properties")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("[API /api/properties/[id]] Update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (err: any) {
    console.error("[API /api/properties/[id]] PATCH error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("properties")
      .select("id, owner_id, gallery")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";
    const isOwner = existing.owner_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete this property" }, { status: 403 });
    }

    // Delete property row from database
    const { error: deleteErr } = await supabaseAdmin
      .from("properties")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("[API /api/properties/[id]] Delete error:", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Property deleted successfully" });
  } catch (err: any) {
    console.error("[API /api/properties/[id]] DELETE error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
