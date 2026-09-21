import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MenuCategory from "@/models/MenuCategory";
import { requireAdmin } from "@/lib/auth";
import { menuCategorySchema, slugify } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const categories = await MenuCategory.find().sort({ sortOrder: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = menuCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const existing = await MenuCategory.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
  }

  const count = await MenuCategory.countDocuments();
  const category = await MenuCategory.create({
    ...parsed.data,
    slug,
    sortOrder: parsed.data.sortOrder ?? count,
  });

  return NextResponse.json({ category }, { status: 201 });
}
