"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Upload, X, Star, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { storageConfig } from "@/lib/storage/config";

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ initialImages = [], onImagesChange, maxImages = 15 }: ImageUploaderProps) {
  const { language } = useLanguage();
  const [images, setImages] = useState<{ id: string; url: string; file?: File; uploading?: boolean }[]>(() => {
    return initialImages.map(url => ({
      id: Math.random().toString(36).substring(7),
      url,
      uploading: false,
    }));
  });
  const [isDragging, setIsDragging] = useState(false);
  const supabase = createClient();
  const initializedRef = useRef(false);

  // Sync initialImages once on mount or when external initialImages changes fundamentally
  useEffect(() => {
    if (!initializedRef.current && initialImages.length > 0 && images.length === 0) {
      initializedRef.current = true;
      setImages(initialImages.map(url => ({
        id: Math.random().toString(36).substring(7),
        url,
        uploading: false,
      })));
    }
  }, [initialImages]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const remainingSlots = Math.max(0, maxImages - images.length);
    if (remainingSlots <= 0) return;

    const newImages = files.slice(0, remainingSlots).map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
      uploading: true,
    }));

    setImages(prev => [...prev, ...newImages]);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const msg = language === "ro"
        ? "Sesiunea a expirat. Te rugăm să te autentifici din nou."
        : "Session expired. Please log in again.";
      console.error("[ImageUploader] No authenticated user found for storage upload.");
      alert(msg);
      setImages(prev => prev.filter(p => !newImages.some(n => n.id === p.id)));
      return;
    }

    const STORAGE_BUCKET = storageConfig.bucket;

    for (const img of newImages) {
      const rawExt = img.file.name.split('.').pop() || 'jpg';
      const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const timeStamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const fileName = `properties/${user.id}/${timeStamp}-${randomStr}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, img.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(data.path);

        setImages(prev => prev.map(p => {
          if (p.id === img.id) {
            return { ...p, url: publicUrl, uploading: false };
          }
          return p;
        }));
      } else {
        const errorMessage = error ? (error as { message?: string }).message || "Upload error" : "Upload failed";
        console.error("[ImageUploader] Upload failed:", error);
        alert(language === "ro" ? `Încărcarea a eșuat: ${errorMessage}` : `Upload failed: ${errorMessage}`);
        setImages(prev => prev.filter(p => p.id !== img.id));
      }
    }
  };

  const onImagesChangeRef = useRef(onImagesChange);
  useEffect(() => {
    onImagesChangeRef.current = onImagesChange;
  }, [onImagesChange]);

  // Whenever images array changes and no upload is in progress, notify parent
  useEffect(() => {
    if (images.length > 0 && images.every(img => !img.uploading)) {
      onImagesChangeRef.current(images.map(img => img.url));
    } else if (images.length === 0) {
      onImagesChangeRef.current([]);
    }
  }, [images]);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const setAsCover = (index: number) => {
    if (index === 0 || index >= images.length) return;
    setImages(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages(prev => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragging ? 'border-amber-500 bg-amber-50/50' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-9 h-9 text-zinc-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-zinc-900">
          {language === "ro" ? "Trage imaginile aici sau apasă pentru a încărca" : "Drag images here or click to upload"}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          {language === "ro" ? `Maxim ${maxImages} imagini (JPG, PNG, WebP). Prima imagine este coperta.` : `Max ${maxImages} images (JPG, PNG, WebP). First image is cover.`}
        </p>
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          id="image-upload"
          onChange={handleFileInput}
        />
        <label
          htmlFor="image-upload"
          className="mt-4 inline-block px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold cursor-pointer hover:bg-zinc-50 transition-colors shadow-sm"
        >
          {language === "ro" ? "Selectează Fișiere" : "Select Files"}
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-zinc-200 bg-zinc-100 shadow-sm">
              <img src={img.url} alt={`Property image ${idx + 1}`} className="w-full h-full object-cover" />

              {img.uploading ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    {idx !== 0 ? (
                      <button
                        type="button"
                        onClick={() => setAsCover(idx)}
                        title={language === "ro" ? "Setează ca imagine principală (Copertă)" : "Set as Cover image"}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase rounded-md flex items-center gap-1 shadow"
                      >
                        <Star className="w-3 h-3 fill-black" />
                        {language === "ro" ? "Copertă" : "Cover"}
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase rounded-md">
                        {language === "ro" ? "Copertă" : "Cover"}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      title={language === "ro" ? "Șterge imaginea" : "Delete image"}
                      className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, idx - 1)}
                        title={language === "ro" ? "Mută la stânga" : "Move left"}
                        className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-md backdrop-blur transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, idx + 1)}
                        title={language === "ro" ? "Mută la dreapta" : "Move right"}
                        className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-md backdrop-blur transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {idx === 0 && !img.uploading && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase rounded-md shadow-sm pointer-events-none">
                  {language === "ro" ? "Copertă" : "Cover"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
