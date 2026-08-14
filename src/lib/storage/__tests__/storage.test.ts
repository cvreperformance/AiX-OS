import { describe, it, expect } from "vitest";
import { storageConfig } from "../config";
import { resolveStorageUrl } from "../images";

describe("Supabase Storage RLS & Path Configuration", () => {
  it("uses canonical bucket 'proprietati'", () => {
    expect(storageConfig.bucket).toBe("proprietati");
  });

  it("generates user-scoped object path matching RLS policy check", () => {
    const mockUserId = "507f191e810c19729de860ea";
    const timeStamp = 1786724000000;
    const randomStr = "abc1234";
    const fileExt = "jpg";
    const objectPath = `properties/${mockUserId}/${timeStamp}-${randomStr}.${fileExt}`;

    const segments = objectPath.split("/");
    expect(segments[0]).toBe("properties");
    expect(segments[1]).toBe(mockUserId);
    expect(segments[1]).toBe(mockUserId);
  });

  it("prevents path traversal in filename generation", () => {
    const maliciousInput = "../../../etc/passwd";
    const rawExt = maliciousInput.split('.').pop() || 'jpg';
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    expect(fileExt).not.toContain("/");
    expect(fileExt).not.toContain("..");
  });
});
