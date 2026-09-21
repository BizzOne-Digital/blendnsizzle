import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MenuCategory from "@/models/MenuCategory";
import MenuItem from "@/models/MenuItem";
import { requireAdmin } from "@/lib/auth";
import { menuCategorySchema, slugify } from "@/lib/validations";
import { deleteStoredUploadByUrl } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = menuCategorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const category = await MenuCategory.findById(id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const previousImage = category.image;
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.name && !parsed.data.slug) {
    updates.slug = slugify(parsed.data.name);
  } else if (parsed.data.slug) {
    updates.slug = slugify(parsed.data.slug);
  }

  Object.assign(category, updates);
  await category.save();

  if (
    typeof updates.image === "string" &&
    previousImage &&
    previousImage !== updates.image
  ) {
    await deleteStoredUploadByUrl(previousImage);
  }

  return NextResponse.json({ category });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const inUse = await MenuItem.countDocuments({ category: id });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "This category has menu items assigned. Reassign or delete them first." },
      { status: 400 }
    );
  }

  const category = await MenuCategory.findByIdAndDelete(id);
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  await deleteStoredUploadByUrl(category.image);

  return NextResponse.json({ success: true });
}
