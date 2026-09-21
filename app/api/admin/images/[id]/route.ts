import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const upload = await StoredUpload.findByIdAndDelete(id);
  if (!upload) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
