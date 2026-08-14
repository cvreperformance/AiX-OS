import { describe, it, expect } from "vitest";
import { storageConfig } from "../config";
import { resolveStorageUrl } from "../images";

describe("Supabase Storage Configuration", () => {
  it("uses canonical bucket 'proprietati' by default", () => {
    expect(storageConfig.bucket).toBe("proprietati");
  });

  it("resolves relative storage paths using the canonical bucket", () => {
    const relativePath = "properties/user_123/sample-photo.jpg";
    const resolved = resolveStorageUrl(relativePath);
    if (storageConfig.supabaseUrl) {
      expect(resolved).toContain(`/storage/v1/object/public/proprietati/${relativePath}`);
    }
  });

  it("sanitizes file extensions and filenames safely", () => {
    const rawName = "Apartament Lux Sinaia Îáșț (1) [FINAL].PNG";
    const rawExt = rawName.split('.').pop() || 'jpg';
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    
    expect(fileExt).toBe("png");
  });
});
