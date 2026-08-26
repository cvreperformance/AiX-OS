"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Camera,
  Trash2,
  EyeOff,
  Shield,
  Loader2,
  X,
  FileText,
  Save,
  ChevronDown
} from "lucide-react";
import { PropertyWizardForm } from "@/components/dashboard/PropertyWizardForm";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { useLanguage } from "@/context/LanguageContext";

interface OwnerManagementBarProps {
  property: any;
  isOwnerOrAdmin: boolean;
}

export function OwnerManagementBar({ property, isOwnerOrAdmin }: OwnerManagementBarProps) {
  const { language } = useLanguage();
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState<string>(property?.status || "Published");
  const [statusLoading, setStatusLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showQuickEditModal, setShowQuickEditModal] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Quick edit form state
  const [quickForm, setQuickForm] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    currency: property?.currency || "EUR",
    category: property?.category || property?.property_type || "Residential",
    listing_type: property?.listing_type || property?.purpose || "sale",
    city: property?.city || "București",
    neighborhood: property?.neighborhood || property?.location || "",
    usable_area: property?.usable_area || property?.area_sqm || 0,
    rooms: property?.rooms || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    featuresStr: Array.isArray(property?.features) ? property.features.join(", ") : "",
    video_url: property?.video_url || "",
  });
  const [quickSaving, setQuickSaving] = useState(false);

  // If user is neither owner nor admin, render nothing
  if (!isOwnerOrAdmin) return null;

  // Status Change Handler
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus || statusLoading) return;
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentStatus(newStatus);
        router.refresh();
      } else {
        alert(`Error updating status: ${data.error || "Failed"}`);
      }
    } catch (e: any) {
      alert(`Error updating status: ${e?.message || "Failed"}`);
    } finally {
      setStatusLoading(false);
    }
  };

  // Quick Edit Submit Handler
  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickSaving(true);

    const features = quickForm.featuresStr
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload = {
      title: quickForm.title,
      description: quickForm.description,
      price: Number(quickForm.price),
      currency: quickForm.currency,
      category: quickForm.category,
      purpose: quickForm.listing_type,
      listing_type: quickForm.listing_type,
      city: quickForm.city,
      neighborhood: quickForm.neighborhood,
      location: quickForm.neighborhood,
      usable_area: Number(quickForm.usable_area),
      area_sqm: Number(quickForm.usable_area),
      rooms: Number(quickForm.rooms),
      bedrooms: Number(quickForm.bedrooms),
      bathrooms: Number(quickForm.bathrooms),
      features,
      video_url: quickForm.video_url,
    };

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowQuickEditModal(false);
        router.refresh();
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        alert(`Error saving edits: ${data.error || "Failed"}`);
      }
    } catch (err: any) {
      alert(`Error saving edits: ${err?.message || "Failed"}`);
    } finally {
      setQuickSaving(false);
    }
  };

  // Photos Update Handler
  const handlePhotosChange = async (urls: string[]) => {
    setPhotosLoading(true);
    try {
      const cover = urls[0] || null;
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery: urls,
          cover_image: cover,
          image_url: cover,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.refresh();
      }
    } catch (e: any) {
      console.error("Photos update error:", e);
    } finally {
      setPhotosLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowDeleteModal(false);
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard/properties";
        }
      } else {
        alert(`Error deleting property: ${data.error || "Failed"}`);
        setIsDeleting(false);
      }
    } catch (err: any) {
      alert(`Error deleting property: ${err?.message || "Failed"}`);
      setIsDeleting(false);
    }
  };

  const handleVisitorPreview = () => {
    if (typeof window !== "undefined") {
      const url = `/proprietati/${property.slug || property.id}?visitor=true`;
      window.open(url, "_blank");
    }
  };

  const initialImages = Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : (property.cover_image ? [property.cover_image] : (property.image_url ? [property.image_url] : []));

  return (
    <>
      {/* Top Sticky Management Bar - SOLID PREMIUM DARK LUXURY (NO GLASSMORPHISM) */}
      <div
        data-testid="owner-management-bar"
        className="sticky top-0 z-40 w-full bg-[#0f0f11] border-b border-zinc-800 shadow-xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Title / Badge */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5" />
              <span className="uppercase">{language === "ro" ? "Administrare Proprietate" : "Property Management"}</span>
            </div>
            <span className="text-zinc-300 text-xs truncate max-w-[200px] sm:max-w-[300px] hidden md:inline font-medium">
              {property.title}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status Dropdown */}
            <div className="relative">
              <select
                data-testid="owner-status"
                value={currentStatus}
                disabled={statusLoading}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-[#18181b] border border-zinc-700/60 rounded-lg px-3 py-1.5 pr-7 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50 cursor-pointer disabled:opacity-50 font-medium"
              >
                <option value="Published">{language === "ro" ? "🟢 Publicat" : "🟢 Published"}</option>
                <option value="Draft">{language === "ro" ? "🟡 Ciornă" : "🟡 Draft"}</option>
                <option value="Reserved">{language === "ro" ? "🔵 Rezervat" : "🔵 Reserved"}</option>
                <option value="Sold">{language === "ro" ? "🔴 Vândut" : "🔴 Sold"}</option>
                <option value="Rented">{language === "ro" ? "🟣 Închiriat" : "🟣 Rented"}</option>
                <option value="Archived">{language === "ro" ? "⚪ Arhivat" : "⚪ Archived"}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Edit Button */}
            <button
              data-testid="owner-edit"
              onClick={() => setShowWizardModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition-colors shadow-sm cursor-pointer"
              title={language === "ro" ? "Editează proprietatea" : "Edit property"}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{language === "ro" ? "Editează" : "Edit"}</span>
            </button>

            {/* Quick Content Edit Button */}
            <button
              data-testid="owner-content"
              onClick={() => setShowQuickEditModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 transition-colors cursor-pointer"
              title={language === "ro" ? "Editare rapidă conținut" : "Quick edit content"}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{language === "ro" ? "Conținut" : "Content"}</span>
            </button>

            {/* Photos Button */}
            <button
              data-testid="owner-photos"
              onClick={() => setShowPhotosModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 transition-colors cursor-pointer"
              title={language === "ro" ? "Gestionare poze" : "Manage photos"}
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{language === "ro" ? "Poze" : "Photos"}</span>
            </button>

            {/* Delete Button */}
            <button
              data-testid="owner-delete"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
              title={language === "ro" ? "Șterge proprietatea" : "Delete property"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === "ro" ? "Șterge" : "Delete"}</span>
            </button>

            {/* Preview / Visitor Button */}
            <button
              data-testid="owner-preview"
              onClick={handleVisitorPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-zinc-100 transition-colors cursor-pointer"
              title={language === "ro" ? "Vezi ca vizitator" : "View as Visitor"}
            >
              <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">{language === "ro" ? "Vizitator" : "Visitor"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Photos Management Modal */}
      {showPhotosModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0f0f11] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowPhotosModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-[#18181b] border border-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>{language === "ro" ? "Gestionare Galerie Foto" : "Manage Photo Gallery"}</span>
              </h3>
              <p className="text-xs text-zinc-400">
                {language === "ro"
                  ? "Adaugă poze noi, schimbă ordinea, setează poza de copertă sau șterge imaginile nedorite."
                  : "Upload new photos, reorder, set cover image, or remove unwanted images."}
              </p>
            </div>

            <ImageUploader
              initialImages={initialImages}
              onImagesChange={handlePhotosChange}
              maxImages={20}
            />

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  setShowPhotosModal(false);
                  router.refresh();
                  if (typeof window !== "undefined") {
                    window.location.reload();
                  }
                }}
                className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                {language === "ro" ? "Gata / Închide" : "Done / Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Content Edit Modal */}
      {showQuickEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0f0f11] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowQuickEditModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-[#18181b] border border-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{language === "ro" ? "Editare Conținut Proprietate" : "Edit Property Content"}</span>
              </h3>
              <p className="text-xs text-zinc-400">
                {language === "ro"
                  ? "Modifică rapid titlul, prețul, descrierea, specificațiile și facilitățile."
                  : "Quickly update title, price, description, specifications, and features."}
              </p>
            </div>

            <form onSubmit={handleQuickSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Titlu" : "Title"}</label>
                  <input
                    type="text"
                    value={quickForm.title}
                    onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Price & Currency */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Preț" : "Price"}</label>
                  <input
                    type="number"
                    value={quickForm.price}
                    onChange={(e) => setQuickForm({ ...quickForm, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Monedă" : "Currency"}</label>
                  <select
                    value={quickForm.currency}
                    onChange={(e) => setQuickForm({ ...quickForm, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="RON">RON (lei)</option>
                  </select>
                </div>

                {/* Category & Listing Type */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Categorie" : "Category"}</label>
                  <select
                    value={quickForm.category}
                    onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land / Teren</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Tip Tranzacție" : "Listing Type"}</label>
                  <select
                    value={quickForm.listing_type}
                    onChange={(e) => setQuickForm({ ...quickForm, listing_type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="sale">Vânzare / Sale</option>
                    <option value="rent">Închiriere / Rent</option>
                  </select>
                </div>

                {/* City & Neighborhood */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Oraș" : "City"}</label>
                  <input
                    type="text"
                    value={quickForm.city}
                    onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Zona / Cartier" : "Neighborhood"}</label>
                  <input
                    type="text"
                    value={quickForm.neighborhood}
                    onChange={(e) => setQuickForm({ ...quickForm, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Usable Area & Rooms */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Suprafață Utilă (m²)" : "Usable Area (sqm)"}</label>
                  <input
                    type="number"
                    value={quickForm.usable_area}
                    onChange={(e) => setQuickForm({ ...quickForm, usable_area: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Număr Camere" : "Total Rooms"}</label>
                  <input
                    type="number"
                    value={quickForm.rooms}
                    onChange={(e) => setQuickForm({ ...quickForm, rooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Dormitoare" : "Bedrooms"}</label>
                  <input
                    type="number"
                    value={quickForm.bedrooms}
                    onChange={(e) => setQuickForm({ ...quickForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Băi" : "Bathrooms"}</label>
                  <input
                    type="number"
                    value={quickForm.bathrooms}
                    onChange={(e) => setQuickForm({ ...quickForm, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Features */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Facilități (separate prin virgulă)" : "Features (comma-separated)"}</label>
                  <input
                    type="text"
                    value={quickForm.featuresStr}
                    onChange={(e) => setQuickForm({ ...quickForm, featuresStr: e.target.value })}
                    placeholder="Piscina, Parcare, Vedere la mare, Terasa"
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Video URL */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "URL Video (YouTube / Vimeo)" : "Video URL"}</label>
                  <input
                    type="text"
                    value={quickForm.video_url}
                    onChange={(e) => setQuickForm({ ...quickForm, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-zinc-300">{language === "ro" ? "Descriere" : "Description"}</label>
                  <textarea
                    rows={4}
                    value={quickForm.description}
                    onChange={(e) => setQuickForm({ ...quickForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50 resize-y"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowQuickEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#18181b] border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  {language === "ro" ? "Renunță" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={quickSaving}
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {quickSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === "ro" ? "Se salvează..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{language === "ro" ? "Salvează Modificările" : "Save Changes"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Full Wizard Edit Modal */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 bg-[#0f0f11] overflow-y-auto">
          <div className="sticky top-0 z-50 bg-[#18181b] border-b border-zinc-800 px-6 py-4 flex items-center justify-between shadow-md">
            <span className="text-sm font-semibold text-amber-400">
              {language === "ro" ? "Wizard Editare Proprietate" : "Property Edit Wizard"} — {property.title}
            </span>
            <button
              onClick={() => setShowWizardModal(false)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-5xl mx-auto p-6">
            <PropertyWizardForm
              mode="edit"
              propertyId={property.id}
              initialData={{
                ...property,
                category: property.category || property.property_type || "Residential",
                listing_type: property.listing_type || property.purpose || "sale",
                usable_area: property.usable_area || property.area_sqm || 0,
                built_area: property.built_area || property.area_sqm || 0,
                neighborhood: property.neighborhood || property.location || "",
                gallery: initialImages,
                cover_image: initialImages[0] || null,
              }}
              onSuccess={() => {
                setShowWizardModal(false);
                router.refresh();
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation Modal */}
      {showDeleteModal && (
        <div data-testid="owner-delete-modal" className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f0f11] border border-rose-500/30 rounded-2xl p-6 space-y-5 shadow-2xl text-center relative">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-100">
                {language === "ro" ? "Ștergi definitiv această proprietate?" : "Permanently delete this property?"}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {language === "ro"
                  ? `Sunteți sigur că doriți să ștergeți "${property.title}"? Această acțiune nu poate fi anulată.`
                  : `Are you sure you want to delete "${property.title}"? This action cannot be undone.`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                data-testid="owner-cancel-delete"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-lg bg-[#18181b] border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                {language === "ro" ? "Anulează" : "Cancel"}
              </button>
              <button
                data-testid="owner-confirm-delete"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "ro" ? "Se șterge..." : "Deleting..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{language === "ro" ? "Șterge Proprietatea" : "Delete Property"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

