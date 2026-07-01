"use client";

import Link from "next/link";

const SUPABASE_URL = "https://fcpsafjgjnecdlyqfcid.supabase.co";
const BUCKET = "Proprietati";

export function PropertyCard({ property }: any) {
  const imagePath = property?.gallery?.[0];

  const imageUrl = imagePath
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${imagePath}`
    : null;

  return (
    <Link href={`/proprietati/${property.slug}`}>
      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">

        <div className="h-56 w-full bg-black">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-4 text-white">No image</div>
          )}
        </div>

        <div className="p-4 text-white">
          <div className="text-sm text-zinc-400">
            {property.location} · {property.city}
          </div>

          <div className="font-semibold">
            {property.title}
          </div>

          <div className="text-amber-400">
            €{property.price}
          </div>
        </div>

      </div>
    </Link>
  );
}