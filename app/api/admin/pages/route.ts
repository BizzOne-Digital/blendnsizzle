import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = request.nextUrl.searchParams.get("key");

  await connectDB();
  if (key) {
    const doc = await PageContent.findOne({ key }).lean();
    return NextResponse.json({ content: doc?.data ?? {} });
  }

  const docs = await PageContent.find().lean();
  return NextResponse.json({ pages: docs });
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { key, data } = body as { key?: string; data?: Record<string, unknown> };

  if (!key || typeof key !== "string" || !data || typeof data !== "object") {
    return NextResponse.json({ error: "A key and data object are required" }, { status: 400 });
  }

  await connectDB();
  const doc = await PageContent.findOneAndUpdate(
    { key },
    { $set: { data } },
    { new: true, upsert: true }
  );

  return NextResponse.json({ content: doc.data });
}
