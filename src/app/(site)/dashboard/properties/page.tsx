"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Video,
  CheckCircle2,
  Clock,
  Archive,
  MoreHorizontal,
  Loader2
} from "lucide-react";

export default function PropertiesDashboardPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewAllAdmin, setViewAllAdmin] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteModalProperty, setDeleteModalProperty] = useState<any | null>(null);
  const [statusMenuOpenId, setStatusMenuOpenId] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchProperties(currentUser?: any, showAll = false) {
    setLoading(true);
    const u = currentUser || user;
    if (!u) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setUser(authUser);

      // Check admin status
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .maybeSingle();
      const adminRole = profile?.role === "admin" || profile?.role === "superadmin";
      setIsAdmin(adminRole);

      let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
      if (!adminRole || !showAll) {
        query = query.eq("owner_id", authUser.id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setProperties(data);
      }
      setLoading(false);
      return;
    }

    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (!isAdmin || !showAll) {
      query = query.eq("owner_id", u.id);
    }
    const { data, error } = await query;
    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties(undefined, viewAllAdmin);
  }, [viewAllAdmin]);

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    setActionLoadingId(propertyId);
    setStatusMenuOpenId(null);

    const updatePayload: Record<string, any> = { status: newStatus };
    if (newStatus === "Published") {
      updatePayload.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("properties")
      .update(updatePayload)
      .eq("id", propertyId);

    if (!error) {
      setProperties(prev => prev.map(p => (p.id === propertyId ? { ...p, ...updatePayload } : p)));
    } else {
      console.error("Status update error:", error);
      alert(language === "ro" ? `Eroare la actualizarea statusului: ${error.message}` : `Error updating status: ${error.message}`);
    }
    setActionLoadingId(null);
  };

  const handleDelete = async () => {
    if (!deleteModalProperty) return;
    const propertyId = deleteModalProperty.id;
    setActionLoadingId(propertyId);

    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      const json = await res.json();

      if (res.ok && json.success) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setDeleteModalProperty(null);
      } else {
        // Fallback to direct client deletion
        const { error: directErr } = await supabase.from("properties").delete().eq("id", propertyId);
        if (!directErr) {
          setProperties(prev => prev.filter(p => p.id !== propertyId));
          setDeleteModalProperty(null);
        } else {
          alert(language === "ro" ? `Eroare la ștergere: ${json.error || directErr.message}` : `Delete error: ${json.error || directErr.message}`);
        }
      }
    } catch (e: any) {
      // Fallback
      const { error: directErr } = await supabase.from("properties").delete().eq("id", propertyId);
      if (!directErr) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setDeleteModalProperty(null);
      } else {
        alert(language === "ro" ? `Eroare la ștergere: ${e.message}` : `Delete error: ${e.message}`);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const tabs = [
    { id: "all", label: language === "ro" ? "Toate" : "All Properties" },
    { id: "Draft", label: language === "ro" ? "Ciorne" : "Drafts" },
    { id: "Published", label: language === "ro" ? "Publicate" : "Published" },
    { id: "Sold", label: language === "ro" ? "Vândute" : "Sold" },
    { id: "Rented", label: language === "ro" ? "Închiriate" : "Rented" },
    { id: "Archived", label: language === "ro" ? "Arhivate" : "Archived" },
  ];

  const filteredProperties = activeTab === "all"
    ? properties
    : properties.filter(p => (p.status || "").toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          badge={language === "ro" ? "Management Anunțuri" : "Property Listings"}
          title={language === "ro" ? "Proprietățile Mele" : "My Properties"}
          subtitle={
            language === "ro"
              ? "Gestionează, editează, publică și optimizează portofoliul tău imobiliar."
              : "Manage, edit, publish, and optimize your real estate portfolio."
          }
        />
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setViewAllAdmin(!viewAllAdmin)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                viewAllAdmin
                  ? "bg-zinc-900 text-amber-400 border-zinc-900 shadow-md"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {viewAllAdmin
                ? (language === "ro" ? "🛡️ Mod Admin (Toate)" : "🛡️ Admin Mode (All)")
                : (language === "ro" ? "Afișează Toate (Admin)" : "Show All (Admin)")}
            </button>
          )}
          <Link
            href="/dashboard/properties/create"
            className="flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-3 text-sm font-semibold hover:bg-amber-400 transition-all shadow-md w-fit cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === "ro" ? "Publică Proprietate" : "Publish Property"}
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-2 rounded-2xl border border-zinc-200">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const count = tab.id === "all"
              ? properties.length
              : properties.filter(p => (p.status || "").toLowerCase() === tab.id.toLowerCase()).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-black shadow-sm font-bold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === tab.id ? "bg-black/15 text-black" : "bg-zinc-100 text-zinc-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-zinc-400 font-mono pr-2">
          {filteredProperties.length} {language === "ro" ? "proprietăți" : "properties"}
        </div>
      </div>

      {/* Grid of Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-zinc-500 font-mono text-sm">
              {language === "ro" ? "Se încarcă proprietățile..." : "Loading properties..."}
            </p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 space-y-4">
            <Building className="w-12 h-12 mx-auto text-zinc-300" />
            <div className="space-y-1">
              <p className="text-zinc-700 font-semibold text-base">
                {language === "ro" ? "Nicio proprietate găsită" : "No properties found"}
              </p>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                {activeTab === "all"
                  ? (language === "ro" ? "Nu ai publicat nicio proprietate încă. Adaugă primul tău anunț imobiliar." : "You haven't posted any properties yet. Add your first listing.")
                  : (language === "ro" ? `Nu există proprietăți cu statusul '${activeTab}'.` : `No properties with '${activeTab}' status.`)}
              </p>
            </div>
            <Link
              href="/dashboard/properties/create"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-xs font-semibold hover:bg-zinc-800 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              {language === "ro" ? "Adaugă Proprietate" : "Add Property"}
            </Link>
          </div>
        ) : (
          filteredProperties.map(property => {
            const imgUrl = property.cover_image || (Array.isArray(property.gallery) && property.gallery[0]) || property.image_url;
            const isPub = (property.status || "").toLowerCase() === "published" || (property.status || "").toLowerCase() === "active";
            const isDraft = (property.status || "").toLowerCase() === "draft";
            const isArchived = (property.status || "").toLowerCase() === "archived";

            return (
              <div
                key={property.id}
                className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
              >
                {/* Card Image Banner */}
                <div className="h-52 bg-zinc-100 relative overflow-hidden">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 gap-1 bg-zinc-50">
                      <Building className="w-10 h-10" />
                      <span className="text-[10px] uppercase font-mono">No Image</span>
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                      isPub
                        ? "bg-emerald-500/90 text-white border-emerald-400/50"
                        : isDraft
                        ? "bg-zinc-800/90 text-zinc-200 border-zinc-700/50"
                        : isArchived
                        ? "bg-slate-700/90 text-slate-200 border-slate-600/50"
                        : "bg-amber-500/90 text-black border-amber-400/50"
                    }`}>
                      {property.status || "Draft"}
                    </span>

                    {property.video_url && (
                      <span className="px-2 py-1 bg-black/80 backdrop-blur-md text-amber-400 font-mono font-bold rounded-lg text-[9px] uppercase flex items-center gap-1 border border-zinc-700 shadow-sm">
                        <Video className="w-3 h-3 text-amber-400" /> 4K Tour
                      </span>
                    )}
                  </div>

                  {/* Category & Listing Type */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white rounded-lg text-[10px] font-medium">
                      {property.category || "Apartment"} • {property.listing_type || "Sale"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-zinc-900 text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {property.title || "Untitled Property"}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {property.city ? `${property.city}` : "București"}
                      {property.district ? `, ${property.district}` : ""}
                      {property.address ? ` • ${property.address}` : ""}
                    </p>

                    {/* Specs Pills */}
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-zinc-600 font-mono border-t border-zinc-100">
                      {property.usable_area && (
                        <span>{property.usable_area} mp</span>
                      )}
                      {property.rooms && (
                        <span>{property.rooms} {language === "ro" ? "cam." : "rms"}</span>
                      )}
                      {property.bedrooms && (
                        <span>{property.bedrooms} {language === "ro" ? "dorm." : "beds"}</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} {language === "ro" ? "băi" : "baths"}</span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Toolbar */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <div>
                      <span className="text-xs text-zinc-400 uppercase font-mono block text-[10px]">Preț</span>
                      <p className="font-bold text-zinc-900 text-base">
                        {property.price ? Number(property.price).toLocaleString() : "0"} {property.currency || "EUR"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {/* View Button */}
                      {property.slug && (
                        <Link
                          href={`/proprietati/${property.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
                          title={language === "ro" ? "Vezi pagina publică" : "View public page"}
                          target="_blank"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{language === "ro" ? "Vezi" : "View"}</span>
                        </Link>
                      )}

                      {/* Edit Button */}
                      <Link
                        href={`/dashboard/properties/${property.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-semibold transition-colors shadow-2xs"
                        title={language === "ro" ? "Editează proprietatea" : "Edit property"}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === "ro" ? "Editează" : "Edit"}</span>
                      </Link>

                      {/* Status Toggle Dropdown Trigger */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setStatusMenuOpenId(statusMenuOpenId === property.id ? null : property.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer border border-zinc-200/50"
                          title={language === "ro" ? "Schimbă statusul" : "Change status"}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Status</span>
                        </button>

                        {/* Status Popup Menu */}
                        {statusMenuOpenId === property.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl border border-zinc-200 shadow-xl p-1.5 z-50 text-xs font-semibold space-y-1">
                            {!isPub && (
                              <button
                                onClick={() => handleStatusChange(property.id, "Published")}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {language === "ro" ? "Publică" : "Publish"}
                              </button>
                            )}
                            {isPub && (
                              <button
                                onClick={() => handleStatusChange(property.id, "Draft")}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 text-zinc-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                {language === "ro" ? "Treci în Ciornă" : "Set as Draft"}
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusChange(property.id, "Sold")}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-800 flex items-center gap-2 cursor-pointer"
                            >
                              🏷️ {language === "ro" ? "Marchează Vândut" : "Mark as Sold"}
                            </button>
                            <button
                              onClick={() => handleStatusChange(property.id, "Rented")}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-800 flex items-center gap-2 cursor-pointer"
                            >
                              🔑 {language === "ro" ? "Marchează Închiriat" : "Mark as Rented"}
                            </button>
                            {!isArchived && (
                              <button
                                onClick={() => handleStatusChange(property.id, "Archived")}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                {language === "ro" ? "Arhivează" : "Archive"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteModalProperty(property)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 text-xs font-semibold transition-colors cursor-pointer"
                        title={language === "ro" ? "Șterge proprietatea" : "Delete property"}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span className="hidden sm:inline">{language === "ro" ? "Șterge" : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProperty && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">
                {language === "ro" ? "Confirmă Ștergerea" : "Confirm Deletion"}
              </h3>
              <p className="text-xs text-zinc-500">
                {language === "ro"
                  ? `Ești sigur că vrei să ștergi definitiv proprietatea "${deleteModalProperty.title}"? Această acțiune este ireversibilă.`
                  : `Are you sure you want to permanently delete "${deleteModalProperty.title}"? This action cannot be undone.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalProperty(null)}
                disabled={actionLoadingId !== null}
                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors text-xs cursor-pointer"
              >
                {language === "ro" ? "Anulează" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoadingId !== null}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  language === "ro" ? "Șterge Definitiv" : "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
