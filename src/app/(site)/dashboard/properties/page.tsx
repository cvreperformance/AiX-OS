"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { Building, Plus, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";

export default function PropertiesDashboardPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function fetchProperties() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  const tabs = [
    { id: "all", label: language === "ro" ? "Toate" : "My Properties" },
    { id: "Draft", label: language === "ro" ? "Ciorne" : "Drafts" },
    { id: "Published", label: language === "ro" ? "Publicate" : "Published" },
    { id: "Sold", label: language === "ro" ? "Vândute" : "Sold" },
    { id: "Rented", label: language === "ro" ? "Închiriate" : "Rented" },
    { id: "Archived", label: language === "ro" ? "Arhivate" : "Archived" },
  ];

  const filteredProperties = activeTab === "all" ? properties : properties.filter(p => p.status === activeTab);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          badge={language === "ro" ? "Management Proprietăți" : "Property Management"}
          title={language === "ro" ? "Proprietăți" : "Properties"}
          subtitle={
            language === "ro"
              ? "Gestionează, publică și optimizează portofoliul tău imobiliar."
              : "Manage, publish, and optimize your real estate portfolio."
          }
        />
        <Link
          href="/dashboard/properties/create"
          className="flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-3 text-sm font-semibold hover:bg-amber-400 transition-all shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          {language === "ro" ? "Publică Proprietate" : "Publish Property"}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2.5 bg-white/60 p-2 rounded-2xl border border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-amber-500 text-black shadow-md"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
            }`}
          >
            {tab.label}
            {tab.id !== "all" && (
              <span className="ml-2 px-1.5 py-0.5 rounded-md bg-white/30 text-[10px]">
                {properties.filter(p => p.status === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-400 font-mono text-sm">
            {language === "ro" ? "Se încarcă proprietățile..." : "Loading properties..."}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50">
            <Building className="w-10 h-10 mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 text-sm">
              {language === "ro" ? "Nu ai nicio proprietate în această categorie." : "You have no properties in this category."}
            </p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <div key={property.id} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-48 bg-zinc-100 relative overflow-hidden">
                {property.image_url ? (
                  <img src={property.image_url} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-800">
                  {property.status}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-semibold text-zinc-900 text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{property.city}, {property.address}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <p className="font-semibold text-zinc-900">
                    {property.price.toLocaleString()} {property.currency}
                  </p>
                  <div className="flex gap-2 text-zinc-400">
                    <button className="hover:text-amber-500 transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                    <button className="hover:text-sky-500 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button className="hover:text-rose-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
