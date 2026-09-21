import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  await connectDB();
  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { $set: { read: Boolean(body.read) } },
    { new: true }
  );

  if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  return NextResponse.json({ message });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const message = await ContactMessage.findByIdAndDelete(id);
  if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
