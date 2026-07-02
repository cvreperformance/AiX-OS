"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
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
}: PropertyImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const showFallback = !src || error;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-zinc-900 text-zinc-600",
          fill && "absolute inset-0",
          aspectClassName,
          className
        )}
      >
        <Building2 className="h-10 w-10 mb-2 opacity-40" />
        <span className="text-xs uppercase tracking-wider opacity-60">Imagine indisponibilă</span>
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
