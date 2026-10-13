import { NextRequest, NextResponse } from "next/server";
import { uploadFileToStorage, STORAGE_BUCKETS, StorageBucketName } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || STORAGE_BUCKETS.PRODUCTS;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF, SVG, PDF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds 10MB limit (size: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    // Fallback if Supabase is not yet configured with real API keys
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Supabase credentials not yet configured. Returning simulated upload URL.",
        publicUrl: `/images/placeholder.png`,
        fileName: file.name,
      });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${folder}/${timestamp}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileToStorage({
      bucket: bucket as StorageBucketName,
      path: storagePath,
      file: buffer,
      options: {
        contentType: file.type,
      },
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      publicUrl: result.publicUrl,
      path: result.path,
      bucket,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

