import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations";
import { getSiteSettings } from "@/lib/settings";
import { deleteStoredUploadByUrl } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
  }

  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
  }

  const previousLogo = settings.logoUrl;
  Object.assign(settings, parsed.data);
  await settings.save();

  if (parsed.data.logoUrl !== undefined && previousLogo && previousLogo !== parsed.data.logoUrl) {
    await deleteStoredUploadByUrl(previousLogo);
  }

  return NextResponse.json({ settings });
}
