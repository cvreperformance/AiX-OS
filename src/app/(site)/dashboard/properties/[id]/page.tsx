"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { PropertyVideoPlayer } from "@/components/properties/PropertyVideoPlayer";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Building,
  MapPin,
  Calendar,
  BedDouble,
  Bath,
  Maximize2,
  Video,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    async function loadProperty() {
      if (!id) return;
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/dashboard/properties/${id}`);
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!isMounted) return;

      if (fetchErr) {
        setError(fetchErr.message);
      } else if (!data) {
        setError(language === "ro" ? "Proprietatea nu a fost găsită." : "Property not found.");
      } else {
        setProperty(data);
        const cover = data.cover_image || (Array.isArray(data.gallery) && data.gallery[0]) || data.image_url;
        setSelectedImg(cover);
      }
      setLoading(false);
    }

    loadProperty();
    return () => {
      isMounted = false;
    };
  }, [id, router, language, supabase]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-zinc-500 font-mono text-sm">
          {language === "ro" ? "Se încarcă proprietatea..." : "Loading property..."}
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">
          {language === "ro" ? "Proprietate Negăsită" : "Property Not Found"}
        </h2>
        <p className="text-zinc-500 text-sm">{error}</p>
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "ro" ? "Înapoi la Proprietăți" : "Back to Properties"}
        </Link>
      </div>
    );
  }

  const gallery: string[] = Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : (property.cover_image ? [property.cover_image] : (property.image_url ? [property.image_url] : []));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-8 animate-in">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/properties"
            className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </Link>
          <div>
            <span className="text-[11px] font-mono uppercase text-amber-600 font-bold tracking-wider">
              {property.status || "Draft"}
            </span>
            <h1 className="text-2xl font-bold text-zinc-900">{property.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {property.slug && (
            <Link
              href={`/proprietati/${property.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors text-xs shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {language === "ro" ? "Pagină Publică" : "Public View"}
            </Link>
          )}

          <Link
            href={`/dashboard/properties/${property.id}/edit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-xs shadow-md"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {language === "ro" ? "Editează" : "Edit Property"}
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery & Media (Left 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Selected Image */}
          <div className="h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm relative">
            {selectedImg ? (
              <img src={selectedImg} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                <Building className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    selectedImg === img ? "border-amber-500 scale-105 shadow-md" : "border-zinc-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video Tour Player */}
          {property.video_url && (
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                <Video className="w-4 h-4" /> 4K Video Tour
              </h3>
              <PropertyVideoPlayer
                videoUrl={property.video_url}
                videoProvider={property.video_provider}
                videoThumbnail={property.video_thumbnail}
                propertyTitle={property.title}
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              {language === "ro" ? "Descrierea Proprietății" : "Property Description"}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {property.description || (language === "ro" ? "Fără descriere adăugată." : "No description provided.")}
            </p>
          </div>
        </div>

        {/* Sidebar Specifications (Right 1 Col) */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-4 shadow-sm">
            <div>
              <span className="text-xs text-zinc-400 uppercase font-mono block">Preț</span>
              <p className="text-3xl font-extrabold text-zinc-900">
                {property.price ? Number(property.price).toLocaleString() : "0"} {property.currency || "EUR"}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Status</span>
                <span className="font-bold text-zinc-900">{property.status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Tip</span>
                <span className="font-bold text-zinc-900">{property.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Scop</span>
                <span className="font-bold text-zinc-900">{property.listing_type}</span>
              </div>
            </div>
          </div>

          {/* Specs Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-4 shadow-sm">
            <h4 className="font-bold text-zinc-900 text-sm">
              {language === "ro" ? "Specificații Tehnice" : "Key Specifications"}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" /> Suprafață</span>
                <p className="font-bold text-zinc-900">{property.usable_area || property.built_area || "—"} mp</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5" /> Dormitoare</span>
                <p className="font-bold text-zinc-900">{property.bedrooms || "—"}</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> Băi</span>
                <p className="font-bold text-zinc-900">{property.bathrooms || "—"}</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
                <span className="text-zinc-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> An Construcție</span>
                <p className="font-bold text-zinc-900">{property.year_built || "—"}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-3 shadow-sm">
            <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              {language === "ro" ? "Locație" : "Location"}
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {[property.address, property.neighborhood, property.district, property.city, property.country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
