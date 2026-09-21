import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { requireAdmin } from "@/lib/auth";
import { menuItemSchema, slugify } from "@/lib/validations";
import { deleteStoredUploadByUrl } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = menuItemSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const item = await MenuItem.findById(id);
  if (!item) return NextResponse.json({ error: "Menu item not found" }, { status: 404 });

  const previousImage = item.image;
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.name && !parsed.data.slug) {
    updates.slug = slugify(parsed.data.name);
  } else if (parsed.data.slug) {
    updates.slug = slugify(parsed.data.slug);
  }

  Object.assign(item, updates);
  await item.save();

  if (typeof updates.image === "string" && previousImage && previousImage !== updates.image) {
    await deleteStoredUploadByUrl(previousImage);
  }

  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) return NextResponse.json({ error: "Menu item not found" }, { status: 404 });

  await deleteStoredUploadByUrl(item.image);

  return NextResponse.json({ success: true });
}
