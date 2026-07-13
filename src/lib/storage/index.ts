import { storageConfig } from "./config";
import { getPropertyImages, parseGallery } from "./images";

export { storageConfig, isStorageConfigured, getSupabaseHostname } from "./config";
export {
  getPropertyImages,
  parseGallery,
  resolveStorageUrl,
  getPublicStorageUrl,
  type PropertyImageSet,
} from "./images";

/**
 * Enriches a property record with resolved image URLs for UI consumption.
 * Safe to call on server — does not mutate the original object.
 */
export function enrichProperty<T extends { image_url?: string | null; gallery?: unknown }>(
  property: T
): T & { resolved_image_url: string | null; resolved_gallery: string[] } {
  const { primary, gallery } = getPropertyImages(property);
  return {
    ...property,
    resolved_image_url: primary,
    resolved_gallery: gallery.length > 0 ? gallery : primary ? [primary] : [],
  };
}

/**
 * Batch enrich properties list.
 */
export function enrichProperties<T extends { image_url?: string | null; gallery?: unknown }>(
  properties: T[]
): Array<T & { resolved_image_url: string | null; resolved_gallery: string[] }> {
  return properties.map(enrichProperty);
}

/** Debug helper — logs image resolution for a property (dev only) */
export function debugPropertyImages(property: {
  slug?: string;
  image_url?: string | null;
  gallery?: unknown;
}): void {
  if (process.env.NODE_ENV !== "development") return;
  const { primary, gallery } = getPropertyImages(property);
  console.info(`[AiX OS™ Images] ${property.slug ?? "unknown"}`, {
    bucket: storageConfig.bucket,
    supabaseUrl: storageConfig.supabaseUrl ? "configured" : "missing",
    raw_image_url: property.image_url,
    raw_gallery: property.gallery,
    parsed_gallery: parseGallery(property.gallery),
    primary,
    gallery_count: gallery.length,
  });
}
