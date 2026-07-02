import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "Proprietati";

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "gif", "svg",
]);

function isImage(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * GET /api/storage/list?folder=h4l-village
 * Lists all image files in a Supabase Storage folder and returns their public URLs.
 * Used by the property gallery to auto-discover images without hardcoding paths.
 */
export async function GET(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ urls: [], error: "Supabase not configured" }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder")?.trim();

  if (!folder) {
    return NextResponse.json({ urls: [], error: "Missing folder parameter" }, { status: 400 });
  }

  // Sanitize folder to prevent path traversal
  const sanitized = folder.replace(/\.\./g, "").replace(/^\/+/, "");

  try {
    // Call Supabase Storage list API
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(BUCKET)}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix: sanitized + "/",
          limit: 200,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        }),
        // Next.js cache: revalidate every 5 minutes
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("[AiX Storage] List API error:", response.status, response.statusText);
      return NextResponse.json({ urls: [], error: "Storage list failed" }, { status: 200 });
    }

    const items: Array<{ name: string; id?: string }> = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ urls: [] }, { status: 200 });
    }

    const baseUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

    const urls = items
      .filter((item) => item.name && isImage(item.name))
      .map((item) => {
        const name = encodeURIComponent(item.name);
        const folderEncoded = sanitized
          .split("/")
          .map(encodeURIComponent)
          .join("/");
        return `${baseUrl}/${folderEncoded}/${name}`;
      });

    return NextResponse.json({ urls }, { status: 200 });
  } catch (err) {
    console.error("[AiX Storage] List error:", err);
    return NextResponse.json({ urls: [], error: "Internal error" }, { status: 200 });
  }
}
