"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Building,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Video,
  Search,
  Loader2,
  Filter
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteModalProperty, setDeleteModalProperty] = useState<any | null>(null);
  const supabase = createClient();

  const fetchProperties = useCallback(async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProperties(data);
    } else {
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data) {
          setProperties(data);
        } else {
          console.error("Error fetching properties:", error);
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    setActionLoadingId(propertyId);
    const updatePayload: Record<string, any> = { status: newStatus };
    if (newStatus === "Published") {
      updatePayload.published_at = new Date().toISOString();
    }

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        setProperties(prev => prev.map(p => (p.id === propertyId ? { ...p, ...updatePayload } : p)));
      } else {
        const { error: directErr } = await supabase.from("properties").update(updatePayload).eq("id", propertyId);
        if (!directErr) {
          setProperties(prev => prev.map(p => (p.id === propertyId ? { ...p, ...updatePayload } : p)));
        } else {
          alert(`Error updating status: ${directErr.message}`);
        }
      }
    } catch (e: any) {
      alert(`Error updating status: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
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
        const { error: directErr } = await supabase.from("properties").delete().eq("id", propertyId);
        if (!directErr) {
          setProperties(prev => prev.filter(p => p.id !== propertyId));
          setDeleteModalProperty(null);
        } else {
          alert(`Error deleting property: ${json.error || directErr.message}`);
        }
      }
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = !searchQuery ||
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || (p.status || "").toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Administrare Proprietăți</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestionează toate anunțurile imobiliare din platformă</p>
        </div>
        <Link
          href="/dashboard/properties/create"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-5 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md w-fit cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Adaugă Proprietate
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după titlu, oraș, slug..."
            className="w-full bg-transparent text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">Toate Statusurile</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-400 uppercase font-mono font-semibold">
                <th className="px-4 py-3.5">Proprietate</th>
                <th className="px-4 py-3.5">Locație</th>
                <th className="px-4 py-3.5">Preț</th>
                <th className="px-4 py-3.5">AiX Score</th>
                <th className="px-4 py-3.5">Media</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                    Se încarcă proprietățile...
                  </td>
                </tr>
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-zinc-400">
                    Nicio proprietate găsită.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => {
                  const cover = p.cover_image || (Array.isArray(p.gallery) && p.gallery[0]) || p.image_url;
                  const isPub = (p.status || "").toLowerCase() === "published" || (p.status || "").toLowerCase() === "active";

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                            {cover ? (
                              <img src={cover} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                <Building className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 line-clamp-1">{p.title || "Untitled"}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              {p.category || "Apartment"} • {p.listing_type || "Sale"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-zinc-600">
                        <p className="font-medium">{p.city || "București"}</p>
                        {p.district && <p className="text-[10px] text-zinc-400">{p.district}</p>}
                      </td>

                      <td className="px-4 py-3 font-bold text-zinc-900">
                        {p.price ? Number(p.price).toLocaleString() : "0"} {p.currency || "EUR"}
                      </td>

                      <td className="px-4 py-3 font-mono text-zinc-700">
                        {p.aix_score ? Number(p.aix_score).toFixed(1) : "—"}
                      </td>

                      <td className="px-4 py-3">
                        {p.video_url ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                            <Video className="w-3 h-3" /> 4K Tour
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[10px]">Doar Foto</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={p.status || "Draft"}
                          disabled={actionLoadingId === p.id}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${
                            isPub
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.status === "Draft"
                              ? "bg-zinc-100 text-zinc-700 border-zinc-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                          <option value="Rented">Rented</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.slug && (
                            <Link
                              href={`/proprietati/${p.slug}`}
                              target="_blank"
                              title="Pagină Publică"
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          <Link
                            href={`/dashboard/properties/${p.id}/edit`}
                            title="Editează Proprietate"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-sky-600 hover:bg-zinc-100 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteModalProperty(p)}
                            title="Șterge Proprietate"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalProperty && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">Confirmă Ștergerea</h3>
              <p className="text-xs text-zinc-500">
                Ești sigur că vrei să ștergi definitiv proprietatea &quot;{deleteModalProperty.title}&quot;?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalProperty(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors text-xs cursor-pointer"
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoadingId !== null}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoadingId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Șterge Definitiv"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
