"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { ListingAITools } from "@/components/dashboard/ListingAITools";
import { parsePropertyVideoUrl } from "@/components/properties/PropertyVideoPlayer";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Bot, Video as VideoIcon } from "lucide-react";

export interface PropertyFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  listing_type: string;
  status: string;
  country: string;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  price: string | number;
  currency: string;
  built_area: string | number;
  usable_area: string | number;
  rooms: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  year_built: string | number;
  features: string[];
  gallery: string[];
  cover_image?: string | null;
  video_url?: string;
  video_thumbnail?: string;
  owner_id?: string | null;
  slug?: string;
}

interface PropertyWizardFormProps {
  initialData?: Partial<PropertyFormData>;
  propertyId?: string;
  mode: "create" | "edit";
  isAdmin?: boolean;
  onSuccess?: (property: Record<string, unknown>) => void;
}

export function PropertyWizardForm({
  initialData,
  propertyId,
  mode = "create",
  onSuccess,
}: PropertyWizardFormProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState<PropertyFormData>(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Apartment",
    listing_type: initialData?.listing_type || "Sale",
    status: initialData?.status || "Published",
    country: initialData?.country || "Romania",
    city: initialData?.city || "",
    district: initialData?.district || "",
    neighborhood: initialData?.neighborhood || "",
    address: initialData?.address || "",
    price: initialData?.price !== undefined ? String(initialData.price) : "",
    currency: initialData?.currency || "EUR",
    built_area: initialData?.built_area !== undefined && initialData?.built_area !== null ? String(initialData.built_area) : "",
    usable_area: initialData?.usable_area !== undefined && initialData?.usable_area !== null ? String(initialData.usable_area) : "",
    rooms: initialData?.rooms !== undefined && initialData?.rooms !== null ? String(initialData.rooms) : "",
    bedrooms: initialData?.bedrooms !== undefined && initialData?.bedrooms !== null ? String(initialData.bedrooms) : "",
    bathrooms: initialData?.bathrooms !== undefined && initialData?.bathrooms !== null ? String(initialData.bathrooms) : "",
    year_built: initialData?.year_built !== undefined && initialData?.year_built !== null ? String(initialData.year_built) : "",
    features: initialData?.features || [],
    gallery: initialData?.gallery || [],
    cover_image: initialData?.cover_image || null,
    video_url: initialData?.video_url || "",
    video_thumbnail: initialData?.video_thumbnail || "",
    owner_id: initialData?.owner_id || null,
    slug: initialData?.slug || "",
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (publish: boolean) => {
    if (loading) return;
    setLoading(true);

    if (publish) {
      if (!formData.title || !formData.category || !formData.price) {
        alert(language === "ro" ? "Vă rugăm să completați titlul, categoria și prețul." : "Please fill in title, category, and price.");
        setLoading(false);
        return;
      }
      if (formData.gallery.length === 0) {
        alert(language === "ro" ? "Vă rugăm să adăugați cel puțin o imagine în galerie." : "Please add at least one image in the gallery.");
        setLoading(false);
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert(language === "ro" ? "Autentificare necesară. Vă rugăm să vă conectați." : "Authentication required. Please log in.");
      setLoading(false);
      router.push("/login");
      return;
    }

    const parsedVideo = parsePropertyVideoUrl(formData.video_url || "");
    const coverImg = formData.gallery.length > 0 ? formData.gallery[0] : null;

    let targetStatus = formData.status || "Published";
    if (publish) {
      targetStatus = "Published";
    } else if (mode === "create" && !publish) {
      targetStatus = "Draft";
    }

    if (mode === "create") {
      const slugBase = (formData.title || "property").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const generatedSlug = `${slugBase || "property"}-${Math.random().toString(36).substring(2, 8)}`;

      const payload = {
        owner_id: user.id,
        slug: generatedSlug,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        listing_type: formData.listing_type,
        status: targetStatus,
        price: Number(formData.price) || 0,
        currency: formData.currency,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        neighborhood: formData.neighborhood,
        address: formData.address,
        built_area: Number(formData.built_area) || null,
        usable_area: Number(formData.usable_area) || null,
        rooms: Number(formData.rooms) || null,
        bedrooms: Number(formData.bedrooms) || null,
        bathrooms: Number(formData.bathrooms) || null,
        year_built: Number(formData.year_built) || null,
        features: formData.features,
        gallery: formData.gallery,
        cover_image: coverImg,
        image_url: coverImg,
        video_url: formData.video_url || null,
        video_provider: parsedVideo.provider !== 'unknown' ? parsedVideo.provider : null,
        video_thumbnail: formData.video_thumbnail || parsedVideo.defaultThumbnail || null,
        published_at: targetStatus === "Published" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase.from("properties").insert(payload).select().single();
      setLoading(false);

      if (!error) {
        if (onSuccess) {
          onSuccess(data);
        } else {
          router.push("/dashboard/properties");
        }
      } else {
        console.error("Database insert error:", error);
        alert(language === "ro" ? `Eroare la salvare: ${error.message}` : `Save error: ${error.message}`);
      }
    } else {
      // EDIT MODE
      const targetId = propertyId || formData.id;
      if (!targetId) {
        alert(language === "ro" ? "ID proprietate invalid." : "Invalid property ID.");
        setLoading(false);
        return;
      }

      const updatePayload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        listing_type: formData.listing_type,
        status: targetStatus,
        price: Number(formData.price) || 0,
        currency: formData.currency,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        neighborhood: formData.neighborhood,
        address: formData.address,
        built_area: Number(formData.built_area) || null,
        usable_area: Number(formData.usable_area) || null,
        rooms: Number(formData.rooms) || null,
        bedrooms: Number(formData.bedrooms) || null,
        bathrooms: Number(formData.bathrooms) || null,
        year_built: Number(formData.year_built) || null,
        features: formData.features,
        gallery: formData.gallery,
        cover_image: coverImg,
        image_url: coverImg,
        video_url: formData.video_url || null,
        video_provider: parsedVideo.provider !== 'unknown' ? parsedVideo.provider : null,
        video_thumbnail: formData.video_thumbnail || parsedVideo.defaultThumbnail || null,
      };

      if (targetStatus === "Published" && !initialData?.status?.toLowerCase().includes("publish")) {
        updatePayload.published_at = new Date().toISOString();
      }

      let updateResult = null;
      const { data, error } = await supabase
        .from("properties")
        .update(updatePayload)
        .eq("id", targetId)
        .select()
        .single();

      if (!error && data) {
        updateResult = data;
      } else {
        // Fallback to secure API endpoint
        try {
          const res = await fetch(`/api/properties/${targetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          });
          if (res.ok) {
            const resJson = await res.json();
            updateResult = resJson.property;
          } else {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error || error?.message || "Failed to update property");
          }
        } catch (apiErr: any) {
          console.error("Database update error:", apiErr);
          setLoading(false);
          alert(language === "ro" ? `Eroare la actualizare: ${apiErr.message}` : `Update error: ${apiErr.message}`);
          return;
        }
      }

      setLoading(false);

      if (updateResult) {
        if (onSuccess) {
          onSuccess(updateResult);
        } else {
          router.push("/dashboard/properties");
        }
      }
    }
  };

  const pageTitle = mode === "edit"
    ? (language === "ro" ? "Editează Proprietatea" : "Edit Property")
    : (language === "ro" ? "Publică o Proprietate" : "Publish Property");

  const pageSubtitle = mode === "edit"
    ? (language === "ro" ? "Actualizează detaliile, prețul, imaginile sau statusul proprietății." : "Update property details, pricing, images, or status.")
    : (language === "ro" ? "Completează detaliile pentru a lista proprietatea în ecosistemul AiX OS™." : "Fill in the details to list the property within the AiX OS™ ecosystem.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <PageHeader
          badge={language === "ro" ? "Pasul " + step + " din 4" : "Step " + step + " of 4"}
          title={pageTitle}
          subtitle={pageSubtitle}
        />
      </div>

      {/* Wizard Steps Navigation Indicator */}
      <div className="grid grid-cols-4 gap-2 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
        {[
          { num: 1, ro: "1. Info Bază", en: "1. Basic Info" },
          { num: 2, ro: "2. Locație", en: "2. Location" },
          { num: 3, ro: "3. Preț & Tehnic", en: "3. Pricing & Specs" },
          { num: 4, ro: "4. Galerie & Video", en: "4. Media" },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all text-center cursor-pointer ${
              step === s.num
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200 font-bold"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
            }`}
          >
            {language === "ro" ? s.ro : s.en}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Informații de Bază" : "Basic Information"}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  {language === "ro" ? "Titlu Anunț *" : "Listing Title *"}
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder={language === "ro" ? "ex: Penthouse Panoramic Herăstrău" : "e.g., Premium Penthouse in Herastrau"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
                  <span>{language === "ro" ? "Descriere Completă" : "Description"}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Markdown supported</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder={language === "ro" ? "Descrie facilitățile, vederea, finisajele și avantajele proprietății..." : "Describe amenities, finishes, views, and unique property highlights..."}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {language === "ro" ? "Tip Proprietate" : "Property Type"}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {["Apartment", "House", "Villa", "Land", "Commercial", "Office", "Industrial", "Luxury Asset", "Other"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {language === "ro" ? "Scop Listare" : "Listing Purpose"}
                  </label>
                  <select
                    name="listing_type"
                    value={formData.listing_type}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {["Sale", "Rent", "Auction", "Off Market"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {language === "ro" ? "Status Publicare" : "Status"}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                  >
                    <option value="Published">{language === "ro" ? "Publicată (Published)" : "Published"}</option>
                    <option value="Draft">{language === "ro" ? "Ciornă (Draft)" : "Draft"}</option>
                    <option value="Reserved">{language === "ro" ? "Rezervată (Reserved)" : "Reserved"}</option>
                    <option value="Sold">{language === "ro" ? "Vândută (Sold)" : "Sold"}</option>
                    <option value="Rented">{language === "ro" ? "Închiriată (Rented)" : "Rented"}</option>
                    <option value="Archived">{language === "ro" ? "Arhivată (Archived)" : "Archived"}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Locație" : "Location"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Țară" : "Country"}</label>
                <input name="country" value={formData.country} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Oraș *" : "City *"}</label>
                <input name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. Bucharest, Cluj, Timișoara" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Sector / Județ" : "District / County"}</label>
                <input name="district" value={formData.district} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. Sector 1, Ilfov" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Cartier / Zonă" : "Neighborhood"}</label>
                <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. Herăstrău, Primăverii, Pipera" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Adresă Detaliată" : "Full Address"}</label>
                <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. Str. Șoseaua Nordului 10" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Specs */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Preț & Detalii Tehnice" : "Pricing & Technical Details"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
                  <span>{language === "ro" ? "Preț Solicitat *" : "Price *"}</span>
                  <span className="flex items-center gap-1 text-[9px] text-amber-500 font-bold uppercase"><Bot className="w-3 h-3"/> AI Valuation</span>
                </label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 450000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Monedă" : "Currency"}</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm">
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="RON">RON (lei)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Suprafață Utilă (mp)" : "Usable Area (sqm)"}</label>
                <input name="usable_area" type="number" value={formData.usable_area} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 140" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Suprafață Construită (mp)" : "Built Area (sqm)"}</label>
                <input name="built_area" type="number" value={formData.built_area} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 175" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Camere" : "Rooms"}</label>
                <input name="rooms" type="number" value={formData.rooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 4" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Dormitoare" : "Bedrooms"}</label>
                <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 3" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "Băi" : "Bathrooms"}</label>
                <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">{language === "ro" ? "An Construcție" : "Year Built"}</label>
                <input name="year_built" type="number" value={formData.year_built} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm" placeholder="e.g. 2024" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Media Gallery & 4K Video */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">{language === "ro" ? "Galerie Foto" : "Photo Gallery"}</h3>
              <ImageUploader
                initialImages={formData.gallery}
                onImagesChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
              />
            </div>

            <div className="pt-6 border-t border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <VideoIcon className="w-5 h-5 text-amber-500" />
                  {language === "ro" ? "Tur Video 4K (Opțional)" : "4K Video Tour (Optional)"}
                </h3>
                <span className="text-xs font-mono text-zinc-400">YouTube & Vimeo</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    {language === "ro" ? "Link Video (YouTube sau Vimeo)" : "Video URL (YouTube or Vimeo)"}
                  </label>
                  <input
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=... sau https://vimeo.com/..."
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {formData.video_url && (
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between font-mono">
                    <span className="text-zinc-600">
                      Detected Provider: <strong className="text-zinc-900 uppercase">{parsePropertyVideoUrl(formData.video_url).provider}</strong>
                    </span>
                    {parsePropertyVideoUrl(formData.video_url).provider !== 'unknown' ? (
                      <span className="text-emerald-600 font-bold">✓ Valid Video Tour URL</span>
                    ) : (
                      <span className="text-amber-600">⚠️ Enter a valid YouTube or Vimeo URL</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                {language === "ro" ? "Înapoi" : "Back"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/dashboard/properties")}
                className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                {language === "ro" ? "Anulează" : "Cancel"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {mode === "create" ? (
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4 text-zinc-500" />
                {language === "ro" ? "Salvează Ciornă" : "Save Draft"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4 text-zinc-500" />
                {language === "ro" ? "Salvează Modificările" : "Save Changes"}
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                {language === "ro" ? "Următorul" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {loading ? "Processing..." : (mode === "edit" ? (language === "ro" ? "Actualizează & Publică" : "Update & Publish") : (language === "ro" ? "Publică Acum" : "Publish Now"))}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar Panel */}
      <div className="mt-8">
        <ListingAITools
          onApplyDescription={(text) => setFormData(prev => ({ ...prev, description: text }))}
          onApplyPrice={(price) => setFormData(prev => ({ ...prev, price }))}
        />
      </div>
    </div>
  );
}
