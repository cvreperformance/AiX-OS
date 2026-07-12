"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ onImagesChange, maxImages = 15 }: ImageUploaderProps) {
  const { language } = useLanguage();
  const [images, setImages] = useState<{ id: string; url: string; file?: File; uploading?: boolean }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const supabase = createClient();

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
    const newImages = files.slice(0, maxImages - images.length).map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
      uploading: true
    }));

    setImages(prev => [...prev, ...newImages]);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const img of newImages) {
      const fileExt = img.file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, img.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(data.path);
          
        setImages(prev => prev.map(p => {
          if (p.id === img.id) {
            return { ...p, url: publicUrl, uploading: false };
          }
          return p;
        }));
      } else {
        // Handle error by removing the failed image
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

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
          isDragging ? 'border-amber-500 bg-amber-50/50' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
        <p className="text-sm font-semibold text-zinc-900">
          {language === "ro" ? "Trage imaginile aici sau apasă pentru a încărca" : "Drag images here or click to upload"}
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          {language === "ro" ? `Maxim ${maxImages} imagini (JPG, PNG).` : `Max ${maxImages} images (JPG, PNG).`}
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
          className="mt-4 inline-block px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold cursor-pointer hover:bg-zinc-50"
        >
          {language === "ro" ? "Selectează Fișiere" : "Select Files"}
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-zinc-200 bg-zinc-100">
              <img src={img.url} alt="Upload preview" className="w-full h-full object-cover" />
              {img.uploading ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {idx === 0 && !img.uploading && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold uppercase rounded-md shadow-sm">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
