import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/auth";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  buildUploadUrl,
  generateSecureFilename,
  isValidFolder,
} from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (typeof folder !== "string" || !isValidFolder(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    if (!(file.type in ALLOWED_MIME_TYPES)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPEG, PNG, WEBP or GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "File is too large. Maximum size is 8MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = generateSecureFilename(file.type);

    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    });

    return NextResponse.json({
      success: true,
      url: buildUploadUrl(folder, filename),
      filename,
      size: file.size,
      folder,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
