import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/auth";
import { buildUploadUrl } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const uploads = await StoredUpload.find()
    .select("folder filename mimeType size createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const images = uploads.map((u) => ({
    id: u._id.toString(),
    folder: u.folder,
    filename: u.filename,
    mimeType: u.mimeType,
    size: u.size,
    createdAt: u.createdAt,
    url: buildUploadUrl(u.folder, u.filename),
  }));

  return NextResponse.json({ images });
}
