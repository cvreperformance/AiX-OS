// src/lib/providers/developer.provider.ts

import { IDataProvider } from "../dataHub/IDataProvider";
import { Developer } from "../types/developer";
import { supabaseAdmin as supabase } from "../supabase/admin";

/**
 * DeveloperProvider interacts with the `developers` table.
 * It merges duplicates based on CUI or name similarity (logic to be added later).
 */
export class DeveloperProvider implements IDataProvider<Developer> {
  async fetchAll(): Promise<Developer[]> {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      console.error("DeveloperProvider fetchAll error:", error);
      return [];
    }
    return data ?? [];
  }

  async fetchById(id: string): Promise<Developer | null> {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("DeveloperProvider fetchById error:", error);
      return null;
    }
    return data ?? null;
  }
}
