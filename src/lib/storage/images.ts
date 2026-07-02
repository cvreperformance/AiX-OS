import { storageConfig } from "./config";

/** Raw gallery item shapes stored in Supabase jsonb */
type GalleryItem = string | { url?: string; path?: string; src?: string };

/**
 * Normalizes gallery jsonb from Supabase into a flat array of path strings.
 * Handles: string[], JSON string, objects with url/path/src, mixed formats.
 */
export function parseGallery(gallery: unknown): string[] {
  if (gallery == null) return [];

  let value: unknown = gallery;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      value = JSON.parse(trimmed);
    } catch {
      return [trimmed];
    }
  }

  if (!Array.isArray(value)) return [];

  return value
    .flatMap((item: GalleryItem) => {
      if (typeof item === "string" && item.trim()) return [item.trim()];
      if (item && typeof item === "object") {
        const path = item.url || item.path || item.src;
        if (typeof path === "string" && path.trim()) return [path.trim()];
      }
      return [];
    })
    .filter(Boolean);
}

/**
 * Resolves any image reference to a loadable public URL.
 *
 * Supported inputs:
 * - Full HTTPS URL (returned as-is)
 * - Storage path: "folder/photo.jpg"
 * - Path with bucket prefix: "Proprietati/folder/photo.jpg"
 * - Supabase storage API URL (returned as-is)
 */
export function resolveStorageUrl(path: string | null | undefined): string | null {
  if (!path || typeof path !== "string") return null;

  const trimmed = path.trim();
  if (!trimmed) return null;

  // Already a full URL
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const { supabaseUrl, bucket } = storageConfig;
  if (!supabaseUrl) return null;

  // Already a storage API path
  if (trimmed.includes("/storage/v1/object/public/")) {
    return trimmed.startsWith("http") ? trimmed : `${supabaseUrl}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }

  let objectPath = trimmed.replace(/^\/+/, "");

  // Strip duplicate bucket prefix (case-insensitive check)
  const bucketPrefix = new RegExp(`^${escapeRegex(bucket)}/`, "i");
  if (bucketPrefix.test(objectPath)) {
    objectPath = objectPath.replace(bucketPrefix, "");
  }

  // Encode each path segment for special characters / spaces
  const encodedPath = objectPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface PropertyImageSet {
  /** Best image for cards / hero */
  primary: string | null;
  /** All resolved gallery URLs (deduplicated) */
  gallery: string[];
}

/**
 * Builds the complete image set for a property record.
 * Priority: image_url → gallery[0] → gallery items
 */
export function getPropertyImages(property: {
  image_url?: string | null;
  gallery?: unknown;
}): PropertyImageSet {
  const rawGallery = parseGallery(property.gallery);
  const candidates: string[] = [];

  if (property.image_url) {
    candidates.push(property.image_url);
  }
  candidates.push(...rawGallery);

  const gallery = candidates
    .map((c) => resolveStorageUrl(c))
    .filter((url): url is string => Boolean(url))
    .filter((url, index, arr) => arr.indexOf(url) === index);

  return {
    primary: gallery[0] ?? null,
    gallery,
  };
}

/**
 * Server-side helper using Supabase SDK getPublicUrl (handles encoding).
 * Falls back to manual URL building if SDK unavailable.
 */
export function getPublicStorageUrl(path: string): string | null {
  const trimmed = path?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const { supabaseUrl, bucket } = storageConfig;
  if (!supabaseUrl) return resolveStorageUrl(trimmed);

  try {
    // Dynamic import avoided — use manual resolution consistent with client
    let objectPath = trimmed.replace(/^\/+/, "");
    const bucketPrefix = new RegExp(`^${escapeRegex(bucket)}/`, "i");
    if (bucketPrefix.test(objectPath)) {
      objectPath = objectPath.replace(bucketPrefix, "");
    }

    const encodedPath = objectPath
      .split("/")
      .filter(Boolean)
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");

    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodedPath}`;
  } catch {
    return resolveStorageUrl(trimmed);
  }
}
