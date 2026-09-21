import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { isSafeFilenameSegment, isValidFolder } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!isValidFolder(folder) || !isSafeFilenameSegment(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectDB();
  const upload = await StoredUpload.findOne({ folder, filename }).lean();

  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = Buffer.isBuffer(upload.data)
    ? upload.data
    : Buffer.from((upload.data as unknown as { buffer: ArrayBuffer }).buffer ?? upload.data);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
