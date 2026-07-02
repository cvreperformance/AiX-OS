"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Ship, Car } from "lucide-react";
import { storageConfig } from "@/lib/storage/config";
import { cn } from "@/lib/utils";

interface PropertyImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspectClassName?: string;
  propertyType?: string | null;
}

function isOptimizableUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname.endsWith(".supabase.co") ||
      hostname === "images.unsplash.com" ||
      hostname.endsWith(".supabase.in")
    );
  } catch {
    return false;
  }
}

export function PropertyImage({
  src,
  alt,
  className,
  fill = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  aspectClassName,
  propertyType,
}: PropertyImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  let isMismatched = false;
  if (src && (propertyType || alt)) {
    const typeLower = (propertyType || "").toLowerCase();
    const altLower = (alt || "").toLowerCase();
    const srcLower = src.toLowerCase();
    const isYacht = typeLower.includes("yacht") || typeLower.includes("yaht") || typeLower.includes("boat") || typeLower.includes("ship") || typeLower.includes("marina") || typeLower.includes("maritime") || altLower.includes("yacht") || altLower.includes("yaht") || altLower.includes("boat") || altLower.includes("ship") || altLower.includes("marina");
    if (isYacht) {
      const hasYachtTerms = srcLower.includes("yacht") || srcLower.includes("boat") || srcLower.includes("ship") || srcLower.includes("marina") || srcLower.includes("sea") || srcLower.includes("ocean") || srcLower.includes("water") || srcLower.includes("benetti") || srcLower.includes("sunseeker") || srcLower.includes("oasis") || srcLower.includes("charter") || srcLower.includes("yachts");
      const hasHouseTerms = srcLower.includes("house") || srcLower.includes("villa") || srcLower.includes("apartment") || srcLower.includes("penthouse") || srcLower.includes("room") || srcLower.includes("bedroom") || srcLower.includes("kitchen") || srcLower.includes("bathroom") || srcLower.includes("interior") || srcLower.includes("lobby") || srcLower.includes("facade");
      if (!hasYachtTerms && hasHouseTerms) {
        isMismatched = true;
      }
    }
    const isCar = typeLower.includes("car") || typeLower.includes("auto") || typeLower.includes("vehicle") || typeLower.includes("porsche") || typeLower.includes("rolls") || typeLower.includes("spectre") || typeLower.includes("supercar") || altLower.includes("car") || altLower.includes("auto") || altLower.includes("vehicle") || altLower.includes("porsche") || altLower.includes("rolls") || altLower.includes("spectre") || altLower.includes("supercar");
    if (isCar) {
      const hasCarTerms = srcLower.includes("car") || srcLower.includes("vehicle") || srcLower.includes("auto") || srcLower.includes("porsche") || srcLower.includes("rolls") || srcLower.includes("spectre") || srcLower.includes("supercar") || srcLower.includes("gt3") || srcLower.includes("drive") || srcLower.includes("wheel") || srcLower.includes("road") || srcLower.includes("cars");
      const hasHouseTerms = srcLower.includes("house") || srcLower.includes("villa") || srcLower.includes("apartment") || srcLower.includes("penthouse") || srcLower.includes("building") || srcLower.includes("office") || srcLower.includes("room") || srcLower.includes("interior") || srcLower.includes("lobby") || srcLower.includes("kitchen") || srcLower.includes("bathroom") || srcLower.includes("bed") || srcLower.includes("pool");
      if (!hasCarTerms && hasHouseTerms) {
        isMismatched = true;
      }
    }
  }

  const showFallback = !src || error || isMismatched;

  if (showFallback) {
    const typeLower = (propertyType || "").toLowerCase();
    const altLower = (alt || "").toLowerCase();
    const isYacht = typeLower.includes("yacht") || typeLower.includes("yaht") || typeLower.includes("boat") || typeLower.includes("ship") || typeLower.includes("marina") || typeLower.includes("maritime") || altLower.includes("yacht") || altLower.includes("yaht") || altLower.includes("boat") || altLower.includes("ship") || altLower.includes("marina");
    const isCar = typeLower.includes("car") || typeLower.includes("auto") || typeLower.includes("vehicle") || typeLower.includes("porsche") || typeLower.includes("rolls") || typeLower.includes("spectre") || typeLower.includes("supercar") || altLower.includes("car") || altLower.includes("auto") || altLower.includes("vehicle") || altLower.includes("porsche") || altLower.includes("rolls") || altLower.includes("spectre") || altLower.includes("supercar");

    let FallbackIcon = Building2;
    let label = "Imagine indisponibilă";
    if (isYacht) {
      FallbackIcon = Ship;
      label = "Yaht indisponibil";
    } else if (isCar) {
      FallbackIcon = Car;
      label = "Autovehicul indisponibil";
    }

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-zinc-900 text-zinc-600",
          fill && "absolute inset-0",
          aspectClassName,
          className
        )}
      >
        <FallbackIcon className="h-10 w-10 mb-2 opacity-40" />
        <span className="text-xs uppercase tracking-wider opacity-60">{label}</span>
      </div>
    );
  }

  const optimizable = isOptimizableUrl(src);

  return (
    <>
      {!loaded && (
        <div
          className={cn(
            "animate-pulse bg-zinc-800",
            fill && "absolute inset-0",
            aspectClassName
          )}
        />
      )}
      {optimizable ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            fill ? "absolute inset-0 h-full w-full object-cover" : "h-full w-full object-cover",
            "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}

export function PropertyImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-zinc-900 text-zinc-600",
        className
      )}
    >
      <Building2 className="h-8 w-8 opacity-40" />
    </div>
  );
}

/** Preload hint for LCP images */
export function getPropertyImageSrc(property: {
  resolved_image_url?: string | null;
  image_url?: string | null;
}): string | null {
  return property.resolved_image_url ?? property.image_url ?? null;
}

export { storageConfig };
