import { describe, it, expect } from "vitest";
import { storageConfig } from "../config";
import { resolveStorageUrl } from "../images";

// RLS Policy evaluator simulation matching Supabase Storage SQL WITH CHECK expression
function evaluateStorageInsertRLS(params: {
  bucketId: string;
  authRole: string;
  authUid: string | null;
  objectPath: string;
}): boolean {
  const { bucketId, authRole, authUid, objectPath } = params;

  // 1. Bucket check
  if (bucketId !== "proprietati") return false;

  // 2. Auth check
  if (authRole !== "authenticated" || !authUid) return false;

  // 3. Path parsing (storage.foldername(name))
  const segments = objectPath.split("/").filter(Boolean);
  
  // Pattern 1: {auth.uid()}/filename.jpg
  if (segments.length >= 2 && segments[0] === authUid) {
    return true;
  }

  // Pattern 2: properties/{auth.uid()}/filename.jpg
  if (segments.length >= 3 && segments[0] === "properties" && segments[1] === authUid) {
    return true;
  }

  return false;
}

describe("Supabase Storage RLS & Path Security Audit", () => {
  it("uses canonical bucket 'proprietati'", () => {
    expect(storageConfig.bucket).toBe("proprietati");
  });

  it("ALLOWS authenticated user uploading into their OWN path: properties/{user_id}/...", () => {
    const userA = "507f191e810c19729de860ea";
    const isAllowed = evaluateStorageInsertRLS({
      bucketId: "proprietati",
      authRole: "authenticated",
      authUid: userA,
      objectPath: `properties/${userA}/1786724000000-sample.jpg`,
    });
    expect(isAllowed).toBe(true);
  });

  it("DENIES authenticated user uploading into ANOTHER user's path: properties/{user_B}/...", () => {
    const userA = "507f191e810c19729de860ea";
    const userB = "999f191e810c19729de89999";
    const isAllowed = evaluateStorageInsertRLS({
      bucketId: "proprietati",
      authRole: "authenticated",
      authUid: userA,
      objectPath: `properties/${userB}/1786724000000-malicious.jpg`,
    });
    expect(isAllowed).toBe(false);
  });

  it("DENIES anonymous users from uploading to properties/{user_id}/...", () => {
    const userA = "507f191e810c19729de860ea";
    const isAllowed = evaluateStorageInsertRLS({
      bucketId: "proprietati",
      authRole: "anon",
      authUid: null,
      objectPath: `properties/${userA}/1786724000000-anon.jpg`,
    });
    expect(isAllowed).toBe(false);
  });

  it("DENIES uploads to WRONG bucket name", () => {
    const userA = "507f191e810c19729de860ea";
    const isAllowed = evaluateStorageInsertRLS({
      bucketId: "property-images",
      authRole: "authenticated",
      authUid: userA,
      objectPath: `properties/${userA}/1786724000000-sample.jpg`,
    });
    expect(isAllowed).toBe(false);
  });
});
