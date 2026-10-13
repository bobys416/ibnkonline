import { createAdminClient } from "./admin";
import { createClient } from "./client";

export const STORAGE_BUCKETS = {
  PRODUCTS: "products",
  AVATARS: "avatars",
  RECEIPTS: "receipts",
  BANNERS: "banners",
} as const;

export type StorageBucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

/**
 * Ensures standard e-commerce storage buckets exist in Supabase.
 * Call this during project setup or onboarding.
 */
export async function initializeStorageBuckets(): Promise<{
  success: boolean;
  created: string[];
  existing: string[];
  errors: string[];
}> {
  const admin = createAdminClient();
  const created: string[] = [];
  const existing: string[] = [];
  const errors: string[] = [];

  const { data: buckets, error: listError } = await admin.storage.listBuckets();

  if (listError) {
    return {
      success: false,
      created,
      existing,
      errors: [listError.message],
    };
  }

  const existingNames = new Set(buckets.map((b) => b.name));

  for (const bucketName of Object.values(STORAGE_BUCKETS)) {
    if (existingNames.has(bucketName)) {
      existing.push(bucketName);
    } else {
      const isPublic = bucketName !== STORAGE_BUCKETS.RECEIPTS; // receipts/invoices should be private
      const { error: createError } = await admin.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
      });

      if (createError) {
        errors.push(`Failed to create bucket ${bucketName}: ${createError.message}`);
      } else {
        created.push(bucketName);
      }
    }
  }

  return {
    success: errors.length === 0,
    created,
    existing,
    errors,
  };
}

/**
 * Uploads a file buffer or blob to a Supabase Storage bucket.
 */
export async function uploadFileToStorage({
  bucket,
  path,
  file,
  options = {},
}: {
  bucket: StorageBucketName | string;
  path: string;
  file: Buffer | Uint8Array | Blob | File;
  options?: UploadOptions;
}): Promise<{
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage.from(bucket).upload(path, file, {
      contentType: options.contentType || "application/octet-stream",
      cacheControl: options.cacheControl || "3600",
      upsert: options.upsert ?? true,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = admin.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown upload error";
    return { success: false, error: message };
  }
}

/**
 * Returns a public URL for a file in a public bucket.
 */
export function getPublicStorageUrl(bucket: StorageBucketName | string, path: string): string {
  const client = createClient();
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Creates a signed URL for private files (e.g. order receipts, confidential documents).
 */
export async function createSignedStorageUrl(
  bucket: StorageBucketName | string,
  path: string,
  expiresInSeconds: number = 3600
): Promise<{ signedUrl?: string; error?: string }> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error) {
    return { error: error.message };
  }
  return { signedUrl: data.signedUrl };
}

/**
 * Deletes a file from Supabase Storage.
 */
export async function deleteStorageFile(
  bucket: StorageBucketName | string,
  paths: string[]
): Promise<{ success: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).remove(paths);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

