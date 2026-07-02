"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PropertyImage } from "./PropertyImage";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Expand,
  Grid3X3,
} from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  /** If provided, will attempt to auto-load additional images from storage */
  storageFolder?: string;
}

export function PropertyGallery({
  images: initialImages,
  alt,
  className,
  storageFolder,
}: PropertyGalleryProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gridView, setGridView] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Auto-discover images from storage folder
  useEffect(() => {
    if (!storageFolder) return;
    fetch(`/api/storage/list?folder=${encodeURIComponent(storageFolder)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.urls) && data.urls.length > 0) {
          // Merge with existing: dedup by URL
          setImages((prev) => {
            const all = [...prev, ...data.urls];
            const seen = new Set<string>();
            return all.filter((url) => {
              if (seen.has(url)) return false;
              seen.add(url);
              return true;
            });
          });
        }
      })
      .catch(() => {
        // Silently fail — fallback to DB gallery
      });
  }, [storageFolder]);

  const goNext = useCallback(
    (inLightbox = false) => {
      const count = images.length;
      if (inLightbox) setLightboxIndex((i) => (i + 1) % count);
      else setActiveIndex((i) => (i + 1) % count);
    },
    [images.length]
  );

  const goPrev = useCallback(
    (inLightbox = false) => {
      const count = images.length;
      if (inLightbox) setLightboxIndex((i) => (i - 1 + count) % count);
      else setActiveIndex((i) => (i - 1 + count) % count);
    },
    [images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext(true);
      else if (e.key === "ArrowLeft") goPrev(true);
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setGridView(false);
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, inLightbox = false) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) goPrev(inLightbox);
      else goNext(inLightbox);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!images.length) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900",
          className
        )}
      >
        <PropertyImage src={null} alt={alt} />
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {/* Main image */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 cursor-zoom-in group"
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, false)}
          onClick={() => openLightbox(activeIndex)}
          role="button"
          tabIndex={0}
          aria-label={`Deschide galeria — imaginea ${activeIndex + 1} din ${images.length}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openLightbox(activeIndex);
          }}
        >
          <PropertyImage
            src={active}
            alt={`${alt} — imagine ${activeIndex + 1}`}
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Imaginea anterioară"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Imaginea următoare"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter + expand button */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            {images.length > 1 && (
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur-sm">
                {activeIndex + 1} / {images.length}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(activeIndex);
              }}
              className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
              aria-label="Fullscreen"
            >
              <Expand className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {images.map((url, index) => (
              <button
                key={`thumb-${index}-${url.slice(-20)}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all",
                  index === activeIndex
                    ? "border-amber-500/60 ring-1 ring-amber-500/30"
                    : "border-zinc-800 opacity-60 hover:opacity-100"
                )}
                aria-label={`Selectează imaginea ${index + 1}`}
              >
                <PropertyImage
                  src={url}
                  alt={`${alt} thumbnail ${index + 1}`}
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/97 flex flex-col"
          role="dialog"
          aria-label="Galerie imagini"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
            <span className="text-sm text-zinc-400">
              {lightboxIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGridView((v) => !v)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                aria-label="Grid view"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                aria-label="Închide galeria"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {gridView ? (
            /* Grid mode */
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
                {images.map((url, index) => (
                  <button
                    key={`lb-grid-${index}`}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(index);
                      setGridView(false);
                    }}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-xl border transition-all",
                      index === lightboxIndex
                        ? "border-amber-500/60 ring-2 ring-amber-500/30"
                        : "border-zinc-800 hover:border-zinc-600"
                    )}
                  >
                    <PropertyImage
                      src={url}
                      alt={`${alt} ${index + 1}`}
                      sizes="200px"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Single image mode */
            <div
              className="flex-1 relative flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, true)}
            >
              {/* Prev button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => goPrev(true)}
                  className="absolute left-4 z-10 rounded-full bg-zinc-800/80 p-3 text-white backdrop-blur-sm hover:bg-zinc-700 transition-all"
                  aria-label="Imaginea anterioară"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Main image */}
              <div className="relative w-full h-full max-w-6xl mx-auto px-16">
                <div className="relative h-full">
                  <PropertyImage
                    src={images[lightboxIndex]}
                    alt={`${alt} — ${lightboxIndex + 1}`}
                    priority
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Next button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => goNext(true)}
                  className="absolute right-4 z-10 rounded-full bg-zinc-800/80 p-3 text-white backdrop-blur-sm hover:bg-zinc-700 transition-all"
                  aria-label="Imaginea următoare"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Lightbox thumbnail strip */}
          {!gridView && images.length > 1 && (
            <div className="flex-shrink-0 px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, index) => (
                  <button
                    key={`lb-thumb-${index}`}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={cn(
                      "relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition-all",
                      index === lightboxIndex
                        ? "border-amber-500/60 ring-1 ring-amber-500/30"
                        : "border-zinc-700 opacity-50 hover:opacity-100"
                    )}
                  >
                    <PropertyImage
                      src={url}
                      alt={`${alt} thumbnail ${index + 1}`}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
