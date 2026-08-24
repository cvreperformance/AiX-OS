"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PropertyWizardForm } from "@/components/dashboard/PropertyWizardForm";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProperty() {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/dashboard/properties/${id}/edit`);
        return;
      }

      // Fetch property
      const { data, error: fetchErr } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (fetchErr) {
        console.error("Error loading property:", fetchErr);
        setError(fetchErr.message);
      } else if (!data) {
        setError(language === "ro" ? "Proprietatea nu a fost găsită." : "Property not found.");
      } else {
        // Prepare gallery & cover image format
        const gallery = Array.isArray(data.gallery) && data.gallery.length > 0
          ? data.gallery
          : (data.cover_image ? [data.cover_image] : (data.image_url ? [data.image_url] : []));

        setProperty({
          ...data,
          gallery,
          cover_image: data.cover_image || gallery[0] || null,
        });
      }

      setLoading(false);
    }

    loadProperty();
  }, [id, router, language]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-zinc-500 font-mono text-sm">
          {language === "ro" ? "Se încarcă detaliile proprietății..." : "Loading property details..."}
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
          {language === "ro" ? "Eroare la încărcare" : "Error Loading Property"}
        </h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          {error || (language === "ro" ? "Nu am putut găsi această proprietate sau nu aveți permisiunea de a o edita." : "Could not find this property or you do not have permission to edit it.")}
        </p>
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "ro" ? "Înapoi la Proprietățile Mele" : "Back to My Properties"}
        </Link>
      </div>
    );
  }

  return (
    <PropertyWizardForm
      mode="edit"
      propertyId={id}
      initialData={property}
      onSuccess={() => router.push("/dashboard/properties")}
    />
  );
}
