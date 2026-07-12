"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { ListingAITools } from "@/components/dashboard/ListingAITools";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Bot, Wand2 } from "lucide-react";

export default function CreatePropertyWizard() {
  const { language } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Apartment",
    listing_type: "Sale",
    country: "Romania",
    city: "",
    district: "",
    neighborhood: "",
    address: "",
    price: "",
    currency: "EUR",
    built_area: "",
    usable_area: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    year_built: "",
    features: [] as string[],
    gallery: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      owner_id: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      listing_type: formData.listing_type,
      status: publish ? "Published" : "Draft",
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
      image_url: formData.gallery.length > 0 ? formData.gallery[0] : null,
      published_at: publish ? new Date().toISOString() : null
    };

    const { data, error } = await supabase.from("properties").insert(payload).select().single();

    setLoading(false);
    if (!error) {
      router.push("/dashboard/properties");
    } else {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 animate-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <PageHeader
          badge={language === "ro" ? "Pasul " + step + " din 4" : "Step " + step + " of 4"}
          title={language === "ro" ? "Publică o Proprietate" : "Publish Property"}
          subtitle={language === "ro" ? "Completează detaliile pentru a lista proprietatea în ecosistemul AiX OS™." : "Fill in the details to list the property within the AiX OS™ ecosystem."}
        />
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Informații de Bază" : "Basic Information"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" placeholder="e.g., Premium Penthouse in Herastrau" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
                  <span>Description</span>
                  <button className="flex items-center gap-1 text-[10px] text-amber-500 hover:text-amber-600 font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full">
                    <Wand2 className="w-3 h-3" /> AI Generate
                  </button>
                </label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Property Type</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                    {["Apartment", "House", "Villa", "Land", "Commercial", "Office", "Industrial", "Luxury Asset", "Other"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Purpose</label>
                  <select name="listing_type" value={formData.listing_type} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                    {["Sale", "Rent", "Auction", "Off Market"].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Locație" : "Location"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Country</label>
                <input name="country" value={formData.country} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">City</label>
                <input name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">District / Sector</label>
                <input name="district" value={formData.district} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Neighborhood</label>
                <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Address</label>
                <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Preț & Detalii Tehnice" : "Pricing & Technical Details"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
                  Price
                  <span className="flex items-center gap-1 text-[9px] text-amber-500 font-bold uppercase"><Bot className="w-3 h-3"/> AI Valuation</span>
                </label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="RON">RON</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Usable Area (sqm)</label>
                <input name="usable_area" type="number" value={formData.usable_area} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Rooms</label>
                <input name="rooms" type="number" value={formData.rooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Bedrooms</label>
                <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Bathrooms</label>
                <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900">{language === "ro" ? "Galerie Foto" : "Photo Gallery"}</h3>
            <ImageUploader onImagesChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))} />
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200">
          <div>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold hover:bg-zinc-100 transition-colors">
                {language === "ro" ? "Înapoi" : "Back"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSave(false)} disabled={loading} className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              {language === "ro" ? "Salvează Ciornă" : "Save Draft"}
            </button>
            
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-md">
                {language === "ro" ? "Următorul" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => handleSave(true)} disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
                {loading ? "Processing..." : (language === "ro" ? "Publică" : "Publish Now")}
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
