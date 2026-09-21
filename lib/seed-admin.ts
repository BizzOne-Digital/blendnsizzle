import "server-only";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

/**
 * Ensures an admin user exists, seeding one from ADMIN_EMAIL/ADMIN_PASSWORD
 * env vars on first run. Safe to call on every login attempt.
 */
export async function ensureSeedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  await connectDB();
  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({ email: email.toLowerCase(), passwordHash, name: "Admin" });
}
