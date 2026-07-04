import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import fs from "fs";
import path from "path";

// GET /api/leads
// Returns merged list of leads from Supabase and local backup file
export async function GET() {
  try {
    let supabaseLeads = [];
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        supabaseLeads = data;
      }
    } catch (e) {
      console.warn("[AiX GET Leads] Supabase list failed:", e);
    }

    let localLeads = [];
    try {
      const backupPath = path.join(process.cwd(), "src/data/leads_backup.json");
      if (fs.existsSync(backupPath)) {
        const raw = fs.readFileSync(backupPath, "utf8");
        localLeads = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[AiX GET Leads] Local backup read failed:", e);
    }

    // Merge lists, using phone + created_at as unique key if id is not available
    const mergedMap = new Map();

    // Insert local leads first
    localLeads.forEach((lead: any) => {
      // Map legacy "subject" to "service" if needed, and vice-versa
      const serv = lead.service || lead.subject || "General Consultation";
      const leadItem = {
        ...lead,
        service: serv,
        subject: serv,
      };
      const key = `${leadItem.phone}_${leadItem.created_at}`;
      mergedMap.set(key, { ...leadItem, id: leadItem.id || key });
    });

    // Insert Supabase leads, overwriting duplicates
    supabaseLeads.forEach((lead: any) => {
      const serv = lead.service || lead.subject || "General Consultation";
      const leadItem = {
        ...lead,
        service: serv,
        subject: serv,
      };
      const key = leadItem.id || `${leadItem.phone}_${leadItem.created_at}`;
      mergedMap.set(key, leadItem);
    });

    // Convert map to array and sort by created_at descending
    const allLeads = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(allLeads);
  } catch (err) {
    console.error("[AiX GET Leads API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/leads
// Updates a lead's status (in Supabase and local backup file)
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Id and status are required" }, { status: 400 });
    }

    let updatedSupabase = false;
    try {
      const supabase = createClient();
      // Only try to update by UUID if the ID is a valid UUID format
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
      if (isUuid) {
        const { error } = await supabase.from("leads").update({ status }).eq("id", id);
        if (!error) updatedSupabase = true;
      }
    } catch (e) {
      console.warn("[AiX PATCH Leads] Supabase update failed:", e);
    }

    // Also update local file backup
    try {
      const backupPath = path.join(process.cwd(), "src/data/leads_backup.json");
      if (fs.existsSync(backupPath)) {
        const raw = fs.readFileSync(backupPath, "utf8");
        const list = JSON.parse(raw);
        let updatedLocal = false;
        
        const updatedList = list.map((lead: any) => {
          const key = lead.id || `${lead.phone}_${lead.created_at}`;
          if (lead.id === id || key === id) {
            updatedLocal = true;
            return { ...lead, status };
          }
          return lead;
        });

        if (updatedLocal) {
          fs.writeFileSync(backupPath, JSON.stringify(updatedList, null, 2), "utf8");
        }
      }
    } catch (e) {
      console.warn("[AiX PATCH Leads] Local backup update failed:", e);
    }

    return NextResponse.json({ success: true, updatedSupabase });
  } catch (err) {
    console.error("[AiX PATCH Leads API Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
