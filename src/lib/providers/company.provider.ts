// src/lib/providers/company.provider.ts

import { IDataProvider } from "../dataHub/IDataProvider";
import { Company } from "../types/company";
import { supabaseAdmin as supabase } from "../supabase/admin";

/**
 * CompanyProvider interacts with the `companies` table in Supabase.
 * It can be extended to fetch data from external official APIs (ONRC/ANAF).
 */
export class CompanyProvider implements IDataProvider<Company> {
  async fetchAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      console.error("CompanyProvider fetchAll error:", error);
      return [];
    }
    return data ?? [];
  }

  async fetchById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("CompanyProvider fetchById error:", error);
      return null;
    }
    return data ?? null;
  }
}
