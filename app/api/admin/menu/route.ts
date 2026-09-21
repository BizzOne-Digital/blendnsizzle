import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { requireAdmin } from "@/lib/auth";
import { menuItemSchema, slugify } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const items = await MenuItem.find().sort({ sortOrder: 1 }).populate("category", "name").lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

  const existing = await MenuItem.findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A menu item with this slug already exists" }, { status: 400 });
  }

  const count = await MenuItem.countDocuments();
  const item = await MenuItem.create({
    ...parsed.data,
    price: parsed.data.price ?? undefined,
    slug,
    sortOrder: parsed.data.sortOrder ?? count,
  });

  return NextResponse.json({ item }, { status: 201 });
}
