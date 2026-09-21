import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { createAdminSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { ensureSeedAdmin } from "@/lib/seed-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
    }

    await ensureSeedAdmin();
    await connectDB();

    const admin = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createAdminSession({ adminId: admin._id.toString(), email: admin.email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
